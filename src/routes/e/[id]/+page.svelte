<script>
	import ReplyForm from './ReplyForm.svelte';
    import { nostrPool, nostrNotes, profiles } from '$lib/store';
    import HeadNote from './HeadNote.svelte';
    import Note from './Note.svelte';

    import { onMount } from 'svelte';
	import NavBar from '$lib/components/NavBar.svelte';
	import Avatar from '$lib/components/Avatar.svelte';
    import { page } from '$app/stores';
    
    let noteId = $page.params.id;

    let showReplyForm = false;

    onMount(async () => {
        $nostrPool.reqEvent(noteId)
    })

    function submit({detail: formData}) {
        let data = {}

        for (let field of formData) {
            const [key, value] = field;

            if (key === 'comment') {
                data = value;
            }
        }
    }

    function toggleReplyForm() {
        showReplyForm = !showReplyForm;
    }
</script>

<NavBar />

{#if $nostrNotes[noteId]}
<main class="w-full">
    <div class="w-full">
        {#if $nostrNotes[noteId]}
            <div>
                <HeadNote note={$nostrNotes[noteId]} on:interested={toggleReplyForm}>
                </HeadNote>
            </div>
        {/if}
    </div>

    {#if showReplyForm}
        <ReplyForm on:submit={submit} parentId={noteId} />
    {/if}

    <h1 class="text-purple-700">
        Comments
        <span>
            {#if ($nostrNotes.responses[noteId])}
                ({$nostrNotes.responses[noteId].length})
            {/if}
        </span>
    </h1>

    {#if $nostrNotes.responses[noteId]}
        {#each $nostrNotes.responses[noteId] as responseId}
            <Note note={$nostrNotes[responseId]}>
            </Note>
        {/each}
    {/if}
</main>
{:else}
Loading {noteId}
{/if}