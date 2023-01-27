<script>
    import Card from '$lib/components/Card.svelte';
    import { formatSatoshis } from '$lib/utils';
    
    export let note;
</script>

<div class="mt-3">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-purple-900">
        {#if note.content.checkIn}
        <Card title="Check-In" value={note.content.checkIn} />
        {/if}

        {#if note.content.checkOut}
        <Card title="Check-out" value={note.content.checkOut} />
        {/if}

        {#if note.content.roomsAvailable}
            <Card title="Rooms available" value={note.content.roomsAvailable} />
        {/if}

        {#if note.content.price}
            <Card title="Price" value="{formatSatoshis(note.content.price)}" />
        {/if}

        {#if note.content.url}
            <Card title="URL">
                <a href={note.content.url} class="text-purple-900 underline">
                    {note.content.url}
                </a>
            </Card>
        {/if}
    </div>

    <div class="flex flex-col md:flex-row">

    </div>
</div>