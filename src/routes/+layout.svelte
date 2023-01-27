<script>
    import { nostrPool, relayEvents } from "$lib/store";
    import TimeAgo from 'javascript-time-ago'
    import en from 'javascript-time-ago/locale/en';
	import { onMount } from "svelte";
    
    TimeAgo.addDefaultLocale(en)

    onMount(async () => {
        await $nostrPool.add('wws://5b82-157-245-32-159.eu.ngrok.io');
        await $nostrPool.add('wss://nostr-pub.wellorder.net');
        await $nostrPool.add('wss://nostr1.tunnelsats.com');
        await $nostrPool.add('wss://relay.nostr.info');
        await $nostrPool.add("wss://relay.snort.social");
        

        try {
            const userRelays = await window.nostr?.getRelays()
            console.log('userRelays', userRelays, window.nostr);
            if (userRelays) {
                Object.keys(userRelays).forEach(relay => $nostrPool.add(relay))
            }
        } catch (e) {
            console.log('error getting relays', e)
        }
    })
    
    import "../app.css";

    let displayRelayInfo = false;

    let relayUrls;
    $: relayUrls = Object.keys($relayEvents).filter(url => url.match(/\/\//));

    async function addNewRelay(e) {
        const formData = new FormData(e.target);
        $nostrPool.add(formData.get('newRelay'));
        e.target.reset();
    }
</script>

<div class="fixed bottom-0 left-0 text-4xl opacity-90 m-2 hidden md:block cursor-pointer hover:opacity-100" on:click={()=>{displayRelayInfo=!displayRelayInfo}}>⚙️</div>
{#if displayRelayInfo}
<div class="fixed bottom-12 left-0 hidden md:block  p-5 m-2 rounded-lg shadow-lg bg-purple-900 text-white">
    <div class="font-bold text-lg mb-3">Relays</div>

    <ul class="list-none">
        {#each relayUrls as relayUrl}
            <li>
                <b>{relayUrl}:</b> {$relayEvents[relayUrl]} events
            </li>
        {/each}

        <li>
<form on:submit|preventDefault={addNewRelay} class="mt-3 flex rounded-md shadow-sm">
      <div class="relative flex flex-grow items-stretch focus-within:z-10">
        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"stroke-width="1.5" stroke="currentColor" fill="none" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </div>
        <input type="newRelay" name="newRelay" id="newRelay" class="block w-full rounded-none rounded-l-md border-gray-300 pl-10 text-gray-700 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" placeholder="wss://...">
      </div>
      <button type="submit" class="relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-purple-700 bg-purple-700 px-4 py-2 text-sm font-medium text-white hover:bg-purple-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
        <span>Add</span>
      </button>
    </form>
    </ul>
</div>
{/if}

<div class="flex flex-col min-h-screen items-center">
    <div class="flex flex-col items-center max-w-2xl w-full flex-grow">
        <slot />
    </div>
    <footer class="bottom-0 p-5 bg-black font-mono text-white w-full text-center mt-12">
        <div class="flex justify-center flex-row">
            <div class="text-sm">
                🍍
                ANANOSTR
                by
                <a class="text-purple-50 hover:text-purple-400" href="https://pablof7z.com">
                    @pablof7z
                </a>
            </div>
        </div>
    </footer>
</div>