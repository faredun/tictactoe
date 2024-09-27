<script lang="ts">
    import { Button } from '$lib/components/ui/button';

    let player_name: string = $state('');
</script>

<div class="flex gap-8 mx-[5%] lg:mx-[15%] md:mx-[5%] md:mt-[10%] flex-col md:flex-row">
    <div
        class="px-4 py-16 border flex flex-col md:flex-1 justify-around items-center md:h-[50vh] h-[30vh] min-h-fit cursor-pointer"
    >
        <h2 class="text-3xl">Single-Player</h2>
        <p>play against AI (easy/hard mode)</p>
        <p class="italic">coming soon ...</p>
    </div>
    <div
        class="border flex flex-col md:flex-1 justify-center items-center md:h-[50vh] px-4 pt-8 pb-12 min-h-fit"
    >
        <h2 class="text-3xl mb-12 text-center">Multi-Player</h2>
        <form action="" class="justify-self-center flex flex-col justify-center items-center">
            <input
                type="text"
                placeholder="your name ..."
                class="border px-4 py-2 h-fit w-full text-center text-lg"
                bind:value={player_name}
                required
            />
            <Button class="py-2 text-2xl px-7 mt-10 h-fit" type="submit">create lobby</Button>
            <p class="my-4 text-gray-500">--- o r ---</p>
            <div class="flex justify-center items-center">
                <input
                    type="text"
                    class="border mr-2 h-10 w-3/5 text-center"
                    placeholder="lobby id ..."
                />
                <Button class="text-xl px-4">join</Button>
            </div>
        </form>
    </div>
</div>
