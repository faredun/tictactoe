<script>
    import Button from '$lib/components/ui/button/button.svelte';
    import ToggleTheme from '../ui/ToggleTheme.svelte';
</script>

<div class="float-right mt-4 mr-8">
    <ToggleTheme />
</div>

<h1 class="text-5xl text-center p-2 mb-8">tic tac toe</h1>
<div class="flex gap-8 mx-[5%] lg:mx-[20%] md:mx-[5%] md:my-36 flex-col md:flex-row">
    <div
        class="py-8 px-4 border flex flex-col md:flex-1 justify-center items-center md:h-[50vh] h-[30vh] hover:dark:bg-slate-900 hover:bg-slate-100 cursor-pointer"
    >
        <h2 class="text-3xl md:-mt-32">Single-Player</h2>
        <p class="mt-2">play against AI</p>
        <p class="italic mt-8">coming soon ...</p>
    </div>
    <div
        class="border flex flex-col md:flex-1 justify-center items-center md:h-[50vh] h-max py-8 px-4 hover:dark:bg-slate-900 hover:bg-slate-100"
    >
        <h2 class="text-3xl mb-12 text-center">Multi-Player</h2>
        <Button class="py-4 h-12 text-2xl">create lobby</Button>
        <p class="italic my-8">--- or ---</p>
        <div>
            <form action="">
                <input type="text" class="border mr-2 h-9 w-3/5" />
                <Button class="text-xl">join</Button>
            </form>
        </div>
    </div>
</div>
