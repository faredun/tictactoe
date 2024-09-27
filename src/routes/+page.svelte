<script>
    import DialogButton from '../ui/DialogButton.svelte';
</script>

<div class="flex gap-8 mx-[5%] lg:mx-[20%] md:mx-[5%] md:my-36 flex-col md:flex-row">
    <div
        class="py-8 px-4 border flex flex-col md:flex-1 justify-center items-center md:h-[50vh] h-[30vh] cursor-pointer"
    >
        <h2 class="text-3xl md:-mt-32">Single-Player</h2>
        <p class="mt-2">play against AI</p>
        <p class="italic mt-8">coming soon ...</p>
    </div>
    <div
        class="border flex flex-col md:flex-1 justify-center items-center md:h-[50vh] h-max py-8 px-4"
    >
        <h2 class="text-3xl mb-12 text-center">Multi-Player</h2>
        <DialogButton title="create lobby" style="py-2 text-2xl px-7" />
        <p class="my-8 text-gray-500">--- o r ---</p>
        <div class="flex">
            <form action="" class="justify-self-center flex flex-row justify-center items-center">
                <input type="text" class="border mr-2 h-10 w-3/5 text-center" />
                <DialogButton title="join" style="text-xl" />
            </form>
        </div>
    </div>
</div>
