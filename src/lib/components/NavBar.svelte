<script>
    const title = 'ANANOSTR';
    import { get } from 'svelte/store'
    import { introDismissed } from '$lib/store'
    import { onMount } from 'svelte';

    let mounted = false;
    let introDisplayed = false;

    onMount(() => { mounted = true; });

    function toggleIntro(e) {
        e.preventDefault();
        introDisplayed = !introDisplayed;
    }
    
    function dismissIntro() {
        introDismissed.set(true);
        introDisplayed = false;
    }
</script>

<div class="flex flex-row justify-between items-center w-full px-3">
    <a href="/" class="flex flex-row items-center text-md text-yellow-700 mt-3 flex-1" style="font-family: 'Press Start 2P';">
        <img src="/images/pineapple-svgrepo-com.svg" class="w-8 h-8" />
        {title}
        <button class="hidden md:block ml-3 text-black text-sm font-mono" on:click={toggleIntro}>
            What's this?
        </button>
    </a>
    <h1 class="text-md text-purple-800 mt-3" style="font-family: 'Press Start 2P';">
        NOSTRICA
        <span class="hidden md:inline-block">2023</span>
    </h1>
</div>

{#if (!$introDismissed && mounted) || introDisplayed}
<div class="bg-black text-white w-full mt-4 md:rounded-lg">
    <div class="flex flex-col md:flex-row font-mono p-8 md:p-8 leading-7">
        <div class="flex-0 hidden md:block">
            <div class="text-6xl pr-4">🤙</div>
        </div>
        <div class="flex-1 text-justify">
            <h1 class="font-bold text-lg mb-3">Nostr-powered classifieds</h1>
        
            <p class="mb-4">
                Ananostr is a Craigslist alternative, especially built
                thinking of matching nostriches attending <b>NOSTRICA 2023</b>.
            </p>

            <p class="mb-4">
                If you're attending 🇨🇷 and want to share a hotel room,
                a ride from/to the hotel, or anything else, post it here and find another nostrich.
            </p>

            <p class="font-bold text-xl">🧡 Pura Vida!</p>
        </div>
    </div>
    <button class="px-4 block bg-black hover:bg-slate-900 w-full py-4 text-lg font-mono border-top-white border-t-2 rounded-sm text-white" on:click={dismissIntro}>Close</button>
</div>
{/if}