<script lang="ts">
    import { page } from '$app/stores';
    import { player } from '$lib/playerName.svelte';
    let { lobbyId } = $page.params;
    console.log($page);
    let player_name = $state();
</script>

<h1 class="text-2xl md:text-3xl text-center p-2 mb-4 md:mt-10 mt-2">Welcome {player.get()}</h1>

<p class="text-center text-lg mb-4">lobby id: {lobbyId}</p>

<div
    class="grid grid-rows-6 grid-flow-row md:grid-rows-4 md:grid-flow-col gap-2 h-full min-h-[78vh]"
>
    <div
        class="border row-span-3 col-span-2 md:row-span-3 md:col-span-3 flex justify-center items-center"
    >
        game
    </div>
    <div class="border md:col-span-3 flex justify-center items-center">game status</div>
    <div class="border flex justify-center items-center md:col-span-2">log</div>
    <div class="border row-span-2 col-span-2 md:row-span-3 flex justify-center items-center">
        chat
    </div>
</div>
