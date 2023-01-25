<script>
    import Avatar from '$lib/components/Avatar.svelte';
    import NavBar from '$lib/components/NavBar.svelte';
    import PostForm from './PostForm.svelte';

    import { onMount } from 'svelte';
    import { relayInit } from 'nostr-tools';
    import { goto } from '$app/navigation';

    let events = []
    let relay;
    let profiles = {};
    let showForm = true;

    function toggleShowForm() {
        showForm = !showForm;
    }

    onMount(async () => {
        relay = relayInit('wss://2b7e38b6d8cb.ngrok.io')
        await relay.connect()
        relay.on('connect', async () => {
            let sub = relay.sub([ { kinds: [111113] }
            ]);

            sub.on('event', async (event) => {
                console.log(event);
                const { content } = event;
                let data;
                console.log(content);
                try {
                    data = JSON.parse(content);
                } catch (e) {
                    data = content;
                }
                event.content = data;
                console.log(event);
                events.push(event)
                events = events.reverse()

                if (!profiles[event.pubkey]) {
                    profiles[event.pubkey] = {
                        display_name: event.pubkey,
                        picture: '/images/pineapple-svgrepo-com.svg',
                        nip05: '',
                    }
                } else {
                    return;
                }

                let profileSub = relay.sub([ { kinds: [0], authors: [event.pubkey] }])
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
        relay.on('error', async(e) => {
          console.log(e);
          alert('error')
        })
    })

    function posted(event) {
      const eventId = event.detail;
      goto(`/e/${eventId}`);
    }

</script>


<NavBar />

{#if !showForm}
  <button on:click={toggleShowForm} class="mt-3 w-full text-center rounded-md border border-transparent bg-purple-900 px-6 py-5 text-base font-medium text-white shadow-sm hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex flex-row items-center justify-center">
    <img src="https://nostrica.com/images/shaka.png" alt="" class="mr-3">
    Add a post
  </button>
{:else}
  <PostForm on:post={posted} />
{/if}

<div class="px-4 sm:px-6 lg:px-8 w-full">
    <div class="mt-8 flex flex-col">
      <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle">
          <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table class="min-w-full divide-y divide-gray-300">
              <tbody class="divide-y divide-gray-200 bg-white bg-">
                {#each events as event}
                <tr class="hover:bg-purple-50 cursor-pointer" on:click={goto(`/e/${event.id}`)}>
                    <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                      <div class="flex items-center">
                        <div class="h-10 w-10 flex-shrink-0">
                          <Avatar image={profiles[event.pubkey].picture} />
                        </div>
                        <div class="ml-4">
                          <div class="font-medium text-gray-900">{profiles[event.pubkey].display_name}</div>
                          <div class="text-gray-500">{profiles[event.pubkey].nip05}</div>
                        </div>
                      </div>
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <div class="text-gray-900">
                        {#if event.content.type == 'airport'}
                        <img src="/images/car.svg" alt="" class="w-8">
                        {/if}
                        {#if event.content.type !== 'airport'}
                            {event.content.type}
                        {/if}
                      </div>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>

