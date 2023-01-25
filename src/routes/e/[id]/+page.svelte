<script>
    import Note from './Note.svelte';

    import { onMount } from 'svelte';
    import { relayInit, getEventHash } from 'nostr-tools';
	import NavBar from '$lib/components/NavBar.svelte';
	import Avatar from '$lib/components/Avatar.svelte';
    import { page } from '$app/stores';
    import MarkdownIt from 'markdown-it';

    let md = new MarkdownIt();

    let noteId = $page.params.id;
    let note, comments = [];
    let relay, relayConnected = false;
    let profiles = {};

    onMount(async () => {
        relay = relayInit('wss://2b7e38b6d8cb.ngrok.io')
        await relay.connect()
        relay.on('connect', async () => {
            relayConnected = true;

            let pub = relay.sub([
                {ids:[noteId]},
                {'#e':[noteId]}
            ])
            pub.on('event', (e) => {
                if (e.id === noteId) {
                    e.content = JSON.parse(e.content);
                    note = e;
                } else {
                    comments.push(e);
                    comments = comments.sort((a, b) => a.created_at - b.created_at);
                    console.log('adding a comment');
                }

                if (!profiles[e.pubkey]) {
                    profiles[e.pubkey] = {
                        display_name: e.pubkey,
                        picture: '/images/pineapple-svgrepo-com.svg',
                        nip05: '',
                    }
                } else {
                    return;
                }

                let profileSub = relay.sub([ { kinds: [0], authors: [e.pubkey] }])
                profileSub.on('event', async (event) => {
                    console.log(event);
                    const { content } = event;
                    let data;
                    console.log(content);
                    try {
                        data = JSON.parse(content);
                    } catch (e) {
                        data = content;
                    }
                    console.log(event);
                    profiles[event.pubkey] = data
                })
            })
        });
    })

    function submit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        let data = {}

        for (let field of formData) {
            const [key, value] = field;

            console.log(key, value);

            if (key === 'comment') {
                data = value;
            }
        }

        window.nostr.getPublicKey().then((pubkey) => {
            if (!relayConnected) {
                alert('Relay not connected');
                return;
            }

            let event = {
                content: data,
                kind: 1,
                created_at: Math.floor(Date.now() / 1000),
                tags: [
                    ["e", noteId],
                ],
                pubkey
            };
            console.log(event);
            event.id = getEventHash(event);

            window.nostr.signEvent(event).then((signedEvent) => {
                let pub = relay.publish(signedEvent);
                pub.on('ok', () => {
                    // reset form
                    document.getElementById('post-form').reset();
                })
                pub.on('seen', () => {
                    console.log(`we saw the event on ${relay.url}`)
                })
                pub.on('failed', reason => {
                    console.log(`failed to publish to ${relay.url}: ${reason}`)
                })
            })
        })
    }
</script>

<NavBar />

<main class="w-full">
    <div class="w-full">
        {#if note}
            <Note author={profiles[note.pubkey]} note={note}>
                {@html md.render(note.content.comment)}
            </Note>
        {/if}
    </div>

    <h1 class="text-purple-700">Comments</h1>

    {#each comments as comment}
        <div class="my-4">
            <Note author={profiles[comment?.pubkey]} note={comment}>
                {@html md.render(note.content)}
            </Note>
        </div>
    {/each}
</main>

<h1 class="text-3xl text-purple-900 font-bold">Interested?</h1>

<form method="POST" action="?post" on:submit={submit} id="add-form" class="w-full">
    <textarea rows="10" name="comment" id="comment" class="block w-full rounded-md border-gray-300 border shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 text-black "></textarea>

    <button type="submit" class="w-full text-center rounded-md border border-transparent bg-purple-900 px-6 py-5 text-base font-medium text-white shadow-sm hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex flex-row items-center justify-center">
        <img src="https://nostrica.com/images/shaka.png" alt="" class="mr-3 h-full">
        <div class="flex flex-col items-start">
            <h1>Post it!</h1>
            <h3 class="text-sm text-purple-200 font-light">(0 sats)</h3>
        </div>
    </button>
</form>