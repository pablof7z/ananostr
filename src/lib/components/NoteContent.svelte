<script>
	import { onMount } from "svelte";
    import MarkdownIt from 'markdown-it';
	import { tick } from "svelte";
    
    let md = new MarkdownIt();

    export let content;
    let renderContent;

    const bitcoinImage = "<img src=\"https://abs.twimg.com/hashflags/Bitcoin_evergreen/Bitcoin_evergreen.png\" style=\"width: 1.2em; vertical-align: -20%; margin-right: 0.075em; height: 1.2em; margin-left: 2px; display: inline-block;\">";

    $: renderContent = md.render(content).toString().replace(/#bitcoin/, `<em>#bitcoin</em>${bitcoinImage}`)
</script>

{@html renderContent}