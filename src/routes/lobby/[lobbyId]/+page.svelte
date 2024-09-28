<script lang="ts">
    import { page } from '$app/stores';
    import { player } from '$lib/playerName.svelte';
    import { Button } from '$lib/components/ui/button/index.js';
    import { Textarea } from '$lib/components/ui/textarea/index.js';
    import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';
    import { onMount } from 'svelte';
    import { io } from 'socket.io-client';
    import Input from '$lib/components/ui/input/input.svelte';

    const socket = io();
    let { lobbyId } = $page.params;
    let player_name: string = $state(player.get());

    let chat: any[] = $state([]);
    let input_text: string = $state('');

    // game related
    const board_size = Array(9).fill('');
    let board = $state(board_size);
    let client_turn: number | undefined = $state();
    let is_client_turn = $state(false);
    let game_over = $state(false);
    let game_over_message = $state('');

    function handleChatSubmit(e: Event) {
        e.preventDefault();
        chat.push({ messages: input_text, client: true });
        socket.emit('sio-msgsFromClient', lobbyId, input_text);
        input_text = '';
    }

    function handleMove(i: number) {
        if (!is_client_turn || board[i] !== '' || game_over) {
            console.log('did not move');
            return; // Block moves if game is over
        }

        socket.emit('sio-move', lobbyId, { index: i, player: client_turn });
    }

    function handleReset() {
        socket.emit('sio-reset', lobbyId);
    }
    function handleQuit() {
        socket.emit('sio-quit', lobbyId);
    }

    socket.emit('sio-joinLobby', lobbyId, ({ gameState }: any) => {
        board = gameState.board;
        is_client_turn = gameState.server_turn === client_turn;
        game_over = gameState.completed;
        game_over_message = gameState.winner;
    });

    socket.on('sio-msgsFromServer', (message) => {
        chat.push({ messages: message, client: false });
    });

    // Handle incoming move updates
    socket.on('sio-move', (gameState) => {
        board = gameState.board;
        // coming_from_server = game ? true : false;
        is_client_turn = gameState.server_turn === client_turn;
    });
    socket.on('sio-gameover', (winner) => {
        game_over = true;
        game_over_message = winner;
    });
    socket.on('sio-reset-server', (gameState) => {
        board = gameState.board;
        is_client_turn = gameState.server_turn === client_turn;
        game_over = gameState.completed;
        game_over_message = gameState.winner;
    });

    onMount(() => {
        const user: any = JSON.parse(localStorage.getItem('user')!);
        if (user.plobby === lobbyId) {
            player_name = user.pname;
            client_turn = user.creator ? 1 : 2;
        }
    });
</script>

<h1 class="text-2xl md:text-3xl text-center p-2 mb-4 md:mt-10 mt-2 tracking-wider">
    ~ hi <span class={'capitalize ' + (client_turn == 1 ? 'text-red-400' : 'text-blue-400')}
        >{player_name}</span
    > ~
</h1>

<p class="text-center text-lg mb-4 tracking-wide">
    lobby id: <span class="text-xl">{lobbyId}</span>
</p>

<div
    class="grid grid-rows-4 grid-cols-5 grid-flow-row md:grid-rows-4 md:grid-cols-5 md:grid-flow-col gap-2 min-h-[78vh]"
>
    <!-- TIC TAC TOE BOARD -->
    <div class="row-span-3 col-span-5 md:row-span-3 md:col-span-3 flex justify-center items-center">
        <div class="grid grid-cols-3 grid-rows-3 p-2">
            {#each board as cell, i}
                <button
                    class={cell === ''
                        ? 'cell cell-color ' +
                          (client_turn === 1 && is_client_turn && !game_over
                              ? 'cell-color-hover-p1'
                              : client_turn === 2 && is_client_turn && !game_over
                                ? 'cell-color-hover-p2'
                                : 'cell-disabled')
                        : 'cell-disabled ' +
                          (cell === 'X' ? 'cell-color-disabled-p1' : 'cell-color-disabled-p2')}
                    onclick={() => handleMove(i)}
                >
                    {cell}
                </button>
            {/each}
        </div>
    </div>

    <!-- game status -->
    <div class="border col-span-3 md:col-span-3 flex justify-center items-center p-2 rounded-lg">
        <div class="font-medium tracking-widest text-large md:text-3xl text-center">
            {#if game_over}
                <div class=" flex gap-8">
                    {game_over_message}
                    <div class="flex gap-2">
                        <Button type="button" onclick={handleReset} class="text-lg">restart?</Button
                        >
                        <Button type="button" onclick={handleQuit} class="text-lg">quit</Button>
                    </div>
                </div>
            {:else}
                {is_client_turn ? 'your turn ...' : "opponent's turn, please wait ..."}
            {/if}
        </div>
    </div>

    <!-- log -->
    <div class="border justify-center items-center col-span-2 md:col-span-2 px-4 py-6 rounded-lg">
        <ScrollArea>
            <ul class="italic dark:text-gray-700 text-gray-300 text-xs md:text-sm">
                <li>{'you ' + (client_turn === 1 ? 'created' : 'joined') + ' the lobby...'}</li>
            </ul>
        </ScrollArea>
    </div>

    <!-- chat -->
    <div class="row-span-1 col-span-5 md:row-span-3 md:col-span-2">
        <div class="h-full flex flex-col">
            <div class="bg-muted/50 border rounded-xl p-4 h-full">
                <ScrollArea class="h-36 md:h-[85%] rounded-md px-4 py-4 flex flex-col w-full ">
                    <div class="flex flex-col">
                        {#each chat as c}
                            <p
                                class={'max-w-[70%] px-4 py-1 rounded-xl justify-self-end' +
                                    (c.client
                                        ? ' self-end ' +
                                          (client_turn === 1 ? 'bg-red-500' : 'bg-blue-600')
                                        : ' self-start ' +
                                          (client_turn === 1 ? 'bg-blue-600' : 'bg-red-500'))}
                            >
                                {c.messages}
                            </p>
                            <br />
                        {/each}
                    </div>
                </ScrollArea>

                <form
                    class="bg-background focus-within:ring-ring relative overflow-hidden rounded-lg border focus-within:ring-1 flex items-center justify-center"
                    onsubmit={handleChatSubmit}
                >
                    <Input
                        id="message"
                        placeholder="Type your message here..."
                        class="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0 overflow-hidden flex-1"
                        bind:value={input_text}
                        autocomplete="off"
                    />
                    <div class="flex items-center p-3 justify-center">
                        <Button type="submit" size="sm" class="ml-auto gap-1.5">Send</Button>
                    </div>
                </form>
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
