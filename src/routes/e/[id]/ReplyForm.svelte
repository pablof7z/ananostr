<script>
	import { nostrPool, profiles } from '$lib/store.js';
    import TimeAgo from 'javascript-time-ago'
    import en from 'javascript-time-ago/locale/en';
	import { onMount } from 'svelte';
    import { createEventDispatcher } from 'svelte';
    import Avatar from '$lib/components/Avatar.svelte';

    const dispatch = createEventDispatcher();
    
    TimeAgo.addDefaultLocale(en)

    const timeAgo = new TimeAgo('en-US')
    let ownPubkey;

    export let parentId;

    onMount(async () => {
        ownPubkey = await $nostrPool.fetchOwnProfile();
        if (!ownPubkey) {
            alert('No profile found. Please create one first.');
        }
    });

    async function submit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);

        let event = {
            content: formData.get('comment'),
            kind: 1,
            created_at: Math.floor(Date.now() / 1000),
            tags: [['e', parentId]],
            pubkey: ownPubkey
        };

        await $nostrPool.signAndPublishEvent(event);
        
        // dispatch('submit', formData);
    }
</script>

<div class="bg-white border border-l-purple-900 border-l-8 rounded-l-none rounded-lg p-4 w-full text-gray-700 my-4">
    <form method="POST" action="?post" on:submit={submit} id="add-form" class="w-full">
        <div class="flex flex-row">
            <Avatar klass="m-2 h-16 w-16 ring-4 ring-purple-700 rounded-full" pubkey={ownPubkey} />

            <div class="pl-6 flex flex-col flex-1 overflow-hidden">
                <div class="font-bold text-xl truncate">
                    <span>{$profiles[ownPubkey]?.display_name}</span>
                </div>

                <div class="mt-5 bg-slate-50 border">
                    <textarea rows="3" name="comment" id="comment" class="block border-0 w-full bg-white text-black resize-none focus:resize-y hover:resize"></textarea>
                </div>

                <div class="flex">
                    <button type="submit" class="flex-1 rounded-t-none text-center rounded-md border border-transparent bg-purple-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-800 focus:outline-none ocus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex flex-row items-center justify-center">
                        <span class="mr-2">🤙</span>
                        <div class="flex flex-col items-start">
                            Post it!
                        </div>
                    </button>
                </div>
            </div>
        </div>
    </form>
</div>
