<script lang="ts">
    import { page } from '$app/stores';
    import { player } from '$lib/playerName.svelte';

    let { lobbyId } = $page.params;
    let player_name = $state();

    // game related
    const board_size = Array(9).fill(' ');
    let board = $state(board_size);
    let player_turn: number = 1;
    let player_turn_hover: number = $state(1);
</script>

<h1 class="text-2xl md:text-3xl text-center p-2 mb-4 md:mt-10 mt-2">Welcome {player.get()}</h1>

<p class="text-center text-lg mb-4">lobby id: {lobbyId}</p>

<div
    class="grid grid-rows-6 grid-flow-row md:grid-rows-4 md:grid-flow-col gap-2 h-full min-h-[78vh]"
>
    <div
        class="border row-span-3 col-span-2 md:row-span-3 md:col-span-3 flex justify-center items-center"
    >
        <!-- TIC TAC TOE BOARD -->
        <div class="grid grid-cols-3 grid-rows-3">
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
    <div class="border md:col-span-3 flex justify-center items-center">game status</div>
    <div class="border flex justify-center items-center md:col-span-2">log</div>
    <div class="border row-span-2 col-span-2 md:row-span-3 flex justify-center items-center">
        chat
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
