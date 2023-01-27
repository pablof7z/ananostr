<script>
    import { nostrNotes, posts, profiles } from '$lib/store';
    import Avatar from '$lib/components/Avatar.svelte';
    import NavBar from '$lib/components/NavBar.svelte';
    import CalendarIcon from '$lib/components/CalendarIcon.svelte';
    import PostForm from '$lib/components/PostForm.svelte';
    import NoteContent from '$lib/components/NoteContent.svelte';
    import { formatSatoshis } from '$lib/utils';
    import { massageString } from "$lib/utils";

    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { nostrPool } from '$lib/store';
    import { intlFormat } from 'date-fns'

    let showForm = false;

    function toggleShowForm() {
        showForm = !showForm;
    }

    onMount(async () => {
        $nostrPool.subscribe([{kinds: [111119]}]);
    })

    function posted(event) {
      const eventId = event.detail;
      showForm = false
      // goto(`/e/${eventId}`);
    }
</script>

<NavBar />

{#if !showForm}
  <button on:click={toggleShowForm} class="mt-3 w-full text-center md:rounded-md border border-transparent bg-purple-900 px-6 py-5 text-base font-medium text-white shadow-sm hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex flex-row items-center justify-center">
    <img src="https://nostrica.com/images/shaka.png" alt="" class="mr-3">
    <h1>Add a post</h1>
  </button>
{:else}
  <PostForm on:post={posted} />
{/if}

<div class="my-4 w-full rounded">
{#each $posts as post}
  <div class="flex flex-row py-5 bg-white w-full hover:bg-purple-50 cursor-pointer  md:mb-4 md:rounded md:shadow border-b-gray-300 border-b max-h-24" on:click={goto(`/e/${post.id}`)} on:keypress={()=>{}}>
    <div class="flex-shrink px-4">
      <div class="text-gray-900">
        {#if post.content.type == 'airport'}
          <span class="text-5xl">🚗</span>
        {:else if post.content.type === 'lodging'}
          <span class="text-5xl">🏡</span>
        {:else if post.content.type === 'surfing'}
          <span class="text-5xl">🏄‍♂️</span>
        {:else if post.content.type === 'climbing'}
          <span class="text-5xl">🧗‍♂️</span>
        {:else if post.content.type === 'coffee'}
          <span class="text-5xl">☕️</span>
        {:else if post.content.type === 'psa'}
          <span class="text-5xl">📢</span>
        {:else}
          {post.content.type}
        {/if}
      </div>
    </div>

    <div class="flex-grow px-4 overflow-hidden">
      <div class="flex flex-col">
        <div class="flex-1 overflow-hidden">
          <div class="truncate">
            {#if post.content.title}
              <h2 class="font-semibold text-lg text-purple-900">
                {@html massageString(post.content.title)}
              </h2>
            {/if}
            <div class="text-gray-500 text-sm mt-1">
              <NoteContent content={post.content.comment} />
            </div>
          </div>
        </div>
        {#if post.content.price}
          <div class="flex flex-1 items-end">
            <div class=" bg-slate-100  shadow border px-3 py-1 flex-shrink rounded-xl">
              <img src="https://abs.twimg.com/hashflags/Bitcoin_evergreen/Bitcoin_evergreen.png" style="width: 1.2em; vertical-align: -20%; margin-right: 0.075em; height: 1.2em; margin-left: 2px; display: inline-block;" />
              <span class="text-gray-900 font-normal text-xs">
                {formatSatoshis(parseInt(post.content.price), { tryThousands: true })}
              </span>
            </div>
          </div>
        {/if}
      </div>
    </div>

    <div class="flex-shrink px-4 flex flex-row items-center gap-1">
      <div class="flex-shrink flex flex-row items-center">
        {#if post.content.type == 'airport'}
          {#if post.content.date}
            <CalendarIcon date={post.content.date} />
          {/if}
        {:else}
          {#if post.content.checkIn}
            <div class="mr-2">
              <CalendarIcon date={post.content.checkIn} endDate={post.content.checkOut} />
            </div>
          {/if}
        {/if}
      </div>

      <div class="flex flex-col md:flex-row-reverse justify-center md:justify-start items-center">
        <div class="h-10 w-10 flex-shrink-0">
          <Avatar klass="sm:ring-purple-900 sm:ring-2" pubkey={post.pubkey} />
        </div>

        {#if ($nostrNotes.responses[post.id])}
        <div class="whitespace-nowrap py-2 px-3 text-sm bg-purple-100 text-gray-800 rounded-lg mt-1 md:mr-2 flex flex-row md:flex-col items-center gap-1">
            <span class="font-bold text-md">{$nostrNotes.responses[post.id].length}</span>
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
              </svg>
              
            </span>
        </div>
      {/if}
      </div>
    </div>
    
  </div>
{/each}
</div>
