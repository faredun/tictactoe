<script lang="ts">
    // --------------------------------
    //          imports
    // --------------------------------

    // navigation and route params
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';

    // socket.io
    import { io } from 'socket.io-client';

    // shadcn
    import { Button } from '$lib/components/ui/button/index.js';
    import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';
    import Input from '$lib/components/ui/input/input.svelte';
    import { Toaster } from '$lib/components/ui/sonner';
    import { toast } from 'svelte-sonner';
    // import { player } from '$lib/playerName.svelte';

    //copy
    import { copy } from 'svelte-copy';
    // --------------------------------
    //          variables
    // --------------------------------

    const socket = io();

    let { lobbyId } = $page.params;

    // player name
    let player_name: string = $state('');
    let init_creator: boolean | undefined;

    // game
    const board_init: string[] = Array(9).fill('');
    let board: string[] = $state(board_init);
    let client_turn: number | undefined = $state();
    let is_client_turn: boolean = $state(false);
    let game_over: boolean = $state(false);
    let game_over_message: string = $state('');

    // user log
    let log_messages: string[] = $state([]);

    // chat
    let input_text: string = $state('');
    let chat: any[] = $state([]); // define type later

    // --------------------------------
    //          functions
    // --------------------------------

    function handleChatSubmit(e: Event) {
        e.preventDefault();
        chat.push({ messages: input_text, client: true });
        socket.emit('sio-msgsFromClient', lobbyId, input_text);
        input_text = '';
    }

    function handleMove(i: number) {
        if (!is_client_turn || board[i] !== '' || game_over) {
            return;
        }
        socket.emit('sio-move', lobbyId, { index: i, player: client_turn });
    }

    function handleReset() {
        socket.emit('sio-reset', lobbyId);
    }
    function handleQuit() {
        socket.emit('sio-quit', lobbyId);
        toast.success('you quit succesfully... going back to homepage ');
        // goto('/');
        const link = document.getElementById('quit-lobby-link');
        link!.setAttribute('href', `/`);
        link!.click();
    }

    function handleCopy() {
        toast.success('lobby ID copied');
    }

    // --------------------------------
    //   socket.io emits and receives
    // --------------------------------

    socket.emit('sio-joinLobby', lobbyId, ({ gameState }: any) => {
        board = gameState.board;
        is_client_turn = gameState.server_turn === client_turn;
        game_over = gameState.completed;
        game_over_message = gameState.winner;
    });

    socket.on('sio-msgsFromServer', (message) => {
        chat.push({ messages: message, client: false });
    });

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
        toast.success('game is restarting...');
    });

    socket.on('sio-log-messages', (message) => {
        log_messages.push(message);
    });

    // on load
    $effect(() => {
        const user: any = JSON.parse(localStorage.getItem('user')!);
        if (user.plobby === lobbyId) {
            player_name = user.pname;
            client_turn = user.creator ? 1 : 2;
            init_creator = user.creator;
        }
    });

    log_messages.push('you ' + (init_creator ? 'created' : 'joined') + ' the lobby...');
</script>

<Toaster />
<!-- header section -->
<section>
    <h1 class="text-2xl md:text-3xl text-center p-2 mb-4 md:mt-10 mt-2 tracking-wide font-mono">
        ~ hi <span class={'capitalize ' + (client_turn == 1 ? 'text-red-400' : 'text-blue-400')}
            >{player_name}</span
        > ~
    </h1>

    <p class="text-center text-lg mb-4 tracking-wide">
        lobby id: <span
            class="text-xl font-mono tracking-wider dark:hover:bg-slate-800 hover:bg-slate-200 p-2"
        >
            <button use:copy={lobbyId} onclick={handleCopy}>
                {lobbyId}
            </button>
        </span>
    </p>
</section>

<!-- main grid layout -->
<div
    class="grid grid-rows-8 grid-cols-5 grid-flow-row md:grid-rows-4 md:grid-cols-5 md:grid-flow-col gap-2 md:h-[78vh] mb-1"
>
    <!-- board section -->
    <section
        class="flex-col gap-8 row-span-3 col-span-5 md:row-span-3 md:col-span-3 flex justify-center items-center"
    >
        <div class="grid grid-cols-3 grid-rows-3 p-2">
            {#each board as cell, i}
                <button
                    class={'font-extrabold ' +
                        (cell === ''
                            ? 'cell cell-color ' +
                              (client_turn === 1 && is_client_turn && !game_over
                                  ? 'cell-color-hover-p1'
                                  : client_turn === 2 && is_client_turn && !game_over
                                    ? 'cell-color-hover-p2'
                                    : 'cell-disabled')
                            : 'cell-disabled ' +
                              (cell === 'X' ? 'cell-color-disabled-p1' : 'cell-color-disabled-p2'))}
                    onclick={() => handleMove(i)}
                >
                    {cell}
                </button>
            {/each}
        </div>
        <a id="quit-lobby-link" class="hidden" aria-labelledby="create"></a>
        <div class="pb-6 tracking-wider">
            <Button type="button" onclick={handleQuit} class="text-base">quit</Button>
        </div>
    </section>

    <!-- game status  -->
    <section
        class="border col-span-3 md:col-span-3 flex justify-center items-center p-2 rounded-lg"
    >
        <div class="font-medium tracking-wider text-large md:text-2xl text-center">
            {#if game_over}
                <div class=" flex gap-8">
                    {game_over_message}
                    <Button type="button" onclick={handleReset} class="text-lg">restart?</Button>
                </div>
            {:else}
                {is_client_turn ? 'your turn ...' : "opponent's turn, please wait ..."}
            {/if}
        </div>
    </section>

    <!-- log -->
    <section
        class="border justify-center items-center col-span-2 md:col-span-2 px-4 py-4 rounded-lg"
    >
        <ScrollArea class="h-[15vh]">
            <ul class="italic dark:text-gray-700 text-gray-300 text-xs md:text-sm">
                {#each [...log_messages].reverse() as message}
                    <li>{message}</li>
                {/each}
            </ul>
        </ScrollArea>
    </section>

    <!-- chat -->
    <section class="row-span-3 col-span-5 md:row-span-3 md:col-span-2 relative">
        <div class="h-full flex flex-col">
            <div class="bg-muted/50 border rounded-xl p-4 h-full">
                <ScrollArea class=" h-36 md:h-[85%] rounded-md px-4 py-4 flex flex-col w-full ">
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
                    class="absolute bottom-2 right-2 w-[97%] bg-background focus-within:ring-ring overflow-hidden rounded-lg border focus-within:ring-1 flex items-center justify-center"
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
    </section>
</div>

<style lang="postcss">
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
