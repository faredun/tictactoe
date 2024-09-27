<script lang="ts">
    import { Button } from '$lib/components/ui/button';

    let player_name: string = $state('');
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
        <form action="" class="justify-self-center flex flex-col justify-center items-center">
            <input
                type="text"
                placeholder="please enter your name"
                class="border px-4 py-2 h-fit w-full text-center text-lg"
                bind:value={player_name}
                required
            />
            <Button class="py-2 text-2xl px-7 mt-10 h-fit" type="submit">create lobby</Button>
            <p class="my-4 text-gray-500">--- o r ---</p>
            <div class="flex">
                <input type="text" class="border mr-2 h-10 w-3/5 text-center" />
                <Button class="text-xl px-4">join</Button>
            </div>
        </form>
    </div>
</div>
