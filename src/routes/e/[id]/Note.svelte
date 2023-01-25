<script>
    import TimeAgo from 'javascript-time-ago'
    import en from 'javascript-time-ago/locale/en';
    
    TimeAgo.addDefaultLocale(en)

    const timeAgo = new TimeAgo('en-US')

    export let author;
    export let note;
</script>

<div class="bg-white border rounded-lg p-4 w-full overflow-scroll max-h-48 text-gray-700 my-4">
    <div class="flex flex-row overflow-clip text-ellipsis">
        <img class="h-16 w-16 ring-4 ring-purple-700 rounded-full" src={author?.picture}>

        <div class="pl-6 flex flex-col text-ellipsis">
            <div class="font-bold text-xl text-clip">
                {author?.display_name}
            </div>
            <div class="text-xs text-gray-500 mt-1">
                {timeAgo.format(new Date(note.created_at * 1000))}
            </div>

            <div class="mt-5 bg-slate-50 p-3 border">
                <slot />
            </div>

            
        </div>
    </div>
</div>