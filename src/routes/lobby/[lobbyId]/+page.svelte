<script lang="ts">
    import { page } from '$app/stores';
    import { player } from '$lib/playerName.svelte';
    import ChatInput from '../../../ui/ChatInput.svelte';
    import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';
    import { onMount } from 'svelte';

    let { lobbyId } = $page.params;
    let player_name: string | null = $state(player.get());

    // game related
    const board_size = Array(9).fill(' ');
    let board = $state(board_size);
    let player_turn: number = 1;
    let player_turn_hover: number = $state(1);

    onMount(() => {
        const pname: string | null = localStorage.getItem('pname');
        if (!player_name) player_name = pname ? pname : 'anonymous';
    });
</script>

<h1 class="text-2xl md:text-3xl text-center p-2 mb-4 md:mt-10 mt-2">Welcome {player_name}</h1>

<p class="text-center text-lg mb-4">lobby id: {lobbyId}</p>

<div
    class="grid grid-rows-4 grid-cols-5 grid-flow-row md:grid-rows-4 md:grid-cols-5 md:grid-flow-col gap-2 h-full min-h-[78vh]"
>
    <div
        class="border row-span-3 col-span-5 md:row-span-3 md:col-span-3 flex justify-center items-center"
    >
        <!-- TIC TAC TOE BOARD -->
        <div class="grid grid-cols-3 grid-rows-3 p-2">
            {#each board as cell, i}
                <button
                    class={cell == ' '
                        ? 'cell cell-color ' +
                          (player_turn_hover === 1 ? 'cell-color-hover-p1' : 'cell-color-hover-p2')
                        : 'cell-disabled font-bold ' +
                          (player_turn === 0 ? 'cell-color-disabled-p1' : 'cell-color-disabled-p2')}
                    onclick={() => {
                        board[i] = player_turn === 1 ? 'X' : 'O';
                        player_turn = player_turn === 1 ? 0 : 1;
                        player_turn_hover = player_turn_hover === 1 ? 0 : 1;
                    }}
                >
                    {cell}
                </button>
            {/each}
        </div>
    </div>
    <div class="border col-span-3 md:col-span-3 flex justify-center items-center p-2">
        <!-- game status -->
        <h2 class="font-bold text-large md:text-3xl text-center">
            waiting for other player to connect
        </h2>
    </div>
    <div class="border justify-center items-center col-span-2 md:col-span-2 px-2 py-4">
        <!-- log -->
        <ScrollArea>
            <ul class="italic dark:text-gray-700 text-gray-300 text-xs">
                <li>lobby is created by {player_name}...</li>
            </ul>
        </ScrollArea>
    </div>

    <div class="row-span-1 col-span-5 md:row-span-3 md:col-span-2">
        <div class="h-full flex flex-col">
            <div class="bg-muted/50 border rounded-xl p-4">
                <ScrollArea class="h-36 md:h-72 rounded-md border px-4 py-4 flex flex-col w-full ">
                    <div class="flex flex-col">
                        <p class="max-w-[70%]">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis
                            laboriosam perferendis saepe tempora suscipit quia illo id asperiores
                            quaerat, aliquam voluptates velit. Magni voluptatum cum ratione debitis
                            eos labore distinctio!
                        </p>
                        <br />
                        <p class="max-w-[70%] self-end">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis
                            laboriosam perferendis saepe tempora suscipit quia illo id asperiores
                            quaerat, aliquam voluptates velit. Magni voluptatum cum ratione debitis
                            eos labore distinctio!
                        </p>
                    </div>
                </ScrollArea>
                <ChatInput />
            </div>
        </div>
    </div>
</div>

<style lang="postcss">
    /* your styles go here */
    .cell {
        margin: 0.125rem;
        height: 85px;
        width: 85px;
        --tw-scale-x: 0.95;
        --tw-scale-y: 0.95;
        transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate))
            skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x))
            scaleY(var(--tw-scale-y));
        border-radius: 0.75rem;
        --tw-bg-opacity: 1;
        padding: 0.5rem;
        /* font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; */
        font-size: 3rem;
        line-height: 1;
        --tw-text-opacity: 1;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 300ms;
    }

    .cell-disabled {
        margin: 0.125rem;
        height: 85px;
        width: 85px;
        --tw-scale-x: 0.95;
        --tw-scale-y: 0.95;
        transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate))
            skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x))
            scaleY(var(--tw-scale-y));
        border-radius: 0.75rem;
        border-width: 2px;
        padding: 0.5rem;
        font-size: 3rem;
        line-height: 1;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 300ms;
    }
</style>
