<script>
	import { onMount } from "svelte";
    import MarkdownIt from 'markdown-it';
	import { tick } from "svelte";
    import { massageString } from "$lib/utils";
    
    let md = new MarkdownIt();

    export let content;
    let renderContent;

    $: renderContent = massageString(md.render(content).toString())
</script>

<div class="note-content">
    {@html renderContent}
</div>