<script>
    import { page } from '$app/stores';

    let version = 'banana';
    // let version = PUBLIC_VERSION;
    let image, title;
    export let pageTitle;

    // if (!['banana', 'anana'].includes(`${version}`)) {
        version = $page.url.hostname.match(/bananostr/) ? 'banana' : 'anana';
    // }

    if (version === 'banana') {
        image = '/images/banana-svgrepo-com.svg';
        title = 'BANANOSTR';
        pageTitle = '🍌 bananostr';
    } else {
        image = '/images/pineapple-svgrepo-com.svg';
        title = 'ANANOSTR';
        pageTitle = '🍍 ananostr';
    }

</script>

<svelte:head>
<title>{pageTitle}</title>
</svelte:head>

<div class="min-h-screen flex flex-col">
    <div class="flex-grow flex flex-col justify-center items-center">
        <div class="w-64">
            <img src="{image}">
        </div>
        <h1 class="text-4xl md:text-6xl text-purple-800 mt-3" style="font-family: 'Press Start 2P';">
            {title}
        </h1>
        <h3 class="text-gray-500 mt-10">
            Nothing to see yet... move along
        </h3>
    </div>

    <footer class="p-3 text-center">
        by
        <a href="https://pablof7z.com" class="text-purple-900">@pablof7z</a>
    </footer>
</div>
