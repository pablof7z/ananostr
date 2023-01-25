<script>
    import { onMount } from 'svelte';
    import "../app.css";
    const testing = true;
    let hasExtension;

    onMount(async () => {
        hasExtension = !!window.nostr;
        console.log(window.nostr)
    });
</script>
  
<div class="flex mx-auto flex-col items-center max-w-2xl">
    <slot />
</div>


{#if hasExtension === false}
    <footer class="bottom-0 p-5 bg-black text-white w-full text-center fixed">
        <div class="flex justify-center flex-row">
            <h1 class="text-5xl mx-6">
                🤷‍♂️
            </h1>
            <div>
                <h1>You don't have a nostr extension</h1>
                <p class="mt-3">
                    You can only use
                    ANANOSTR
                    in read-only mode.
                </p>
            </div>
            <h1 class="text-5xl mx-6">
                🤷‍♂️
            </h1>
        </div>
    </footer>
{/if}