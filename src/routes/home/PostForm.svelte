<script>
	import { relayInit, getEventHash } from 'nostr-tools';
	import { onMount } from 'svelte';
    import PostTypeSelector from './PostTypeSelector.svelte';
    import { createEventDispatcher } from 'svelte';

    let relay, relayConnected = false;

    const dispatch = createEventDispatcher();
    
    onMount(async () => {
        relay = relayInit('wss://2b7e38b6d8cb.ngrok.io')
        await relay.connect()
        relay.on('connect', async () => {
            relayConnected = true;
        });
    })

    function submit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = {};

        for (let field of formData) {
            const [key, value] = field;
            data[key] = value;
        }

        window.nostr.getPublicKey().then((pubkey) => {
            if (!relayConnected) {
                alert('Relay not connected');
                return;
            }

            let event = {
                content: JSON.stringify(data),
                kind: 111113,
                created_at: Math.floor(Date.now() / 1000),
                tags: [],
                pubkey
            };
            event.id = getEventHash(event);

            window.nostr.signEvent(event).then((signedEvent) => {
                let pub = relay.publish(signedEvent);
                pub.on('seen', () => {
                    console.log(`we saw the event on ${relay.url}`)
                    console.log('dispatch');
                    dispatch('post', signedEvent.id);
                    document.getElementById('post-form').reset();
                })
                pub.on('failed', reason => {
                    console.log(`failed to publish to ${relay.url}: ${reason}`)
                })
            })
        })
    }
</script>

<div class="bg-purple-600 w-full my-4 text-white">
    <form method="POST" action="?post" on:submit={submit} id="post-form">
        <div class="px-6 py-4">
            <h1>Have something to share?</h1>
    
            <div class="my-3 ">
                <PostTypeSelector></PostTypeSelector>  
            </div>
        </div>

        <button type="submit" class="w-full text-center rounded-md border border-transparent bg-purple-900 px-6 py-5 text-base font-medium text-white shadow-sm hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex flex-row items-center justify-center">
            <img src="https://nostrica.com/images/shaka.png" alt="" class="mr-3 h-full">
            <div class="flex flex-col items-start">
                <h1>Post it!</h1>
                <h3 class="text-sm text-purple-200 font-light">(0 sats)</h3>
            </div>
        </button>
    </form>
</div>