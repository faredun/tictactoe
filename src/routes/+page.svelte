<script lang="ts">
    // --------------------------------
    //           imports
    // --------------------------------

    // navigation
    import { goto } from '$app/navigation';

    // socket.io
    import { io } from 'socket.io-client';

    // shadcn
    import { Button } from '$lib/components/ui/button';
    import { Toaster } from '$lib/components/ui/sonner';
    import { toast } from 'svelte-sonner';

    // components
    import DrawerCustom from '$lib/ui/DrawerCustom.svelte';
    // import { player } from '$lib/playerName.svelte';

    // --------------------------------
    //          variables
    // --------------------------------

    let player_name: string = $state('');
    let lobbyId: string = $state('');

    const socket = io();

    // --------------------------------
    //          functions
    // --------------------------------

    function handleCreate() {
        if (player_name) {
            // player.set(player_name);
            // player.isCreator();
            const newLobbyId = Math.random().toString(36).substring(2, 8).toUpperCase();
            socket.emit('sio-createLobby', newLobbyId);

            // goto(`/lobby/${newLobbyId}`);

            const link = document.getElementById('create-lobby-link');
            link!.setAttribute('href', `/lobby/${newLobbyId}`);
            link!.click();

            lobbyId = newLobbyId;
            localStorage.setItem(
                'user',
                JSON.stringify({ pname: player_name, plobby: lobbyId, creator: true })
            );
        } else {
            toast.error('please enter your name...');
        }
    }

    function handleJoin() {
        if (lobbyId && player_name) {
            // player.set(player_name);
            // player.notCreator();
            socket.emit(
                'sio-checkLobby',
                lobbyId,
                ({ success, message }: { success: boolean; message: string }) => {
                    if (success) {
                        // goto(`/lobby/${lobbyId}`);
                        const link = document.getElementById('join-lobby-link');
                        link!.setAttribute('href', `/lobby/${lobbyId}`);
                        link!.click();
                        localStorage.setItem(
                            'user',
                            JSON.stringify({ pname: player_name, plobby: lobbyId, creator: false })
                        );
                    } else {
                        toast.error(message);
                    }
                }
            );
        } else if (lobbyId) {
            toast.error('please enter your name ...');
        } else {
            toast.error('please enter a lobby id to join ...');
        }
    }

    // on page load (client side)
    $effect(() => {
        const pname: string | null = JSON.parse(localStorage.getItem('user')!).pname;
        if (!player_name) player_name = pname ? pname : '';
    });
</script>

<Toaster />
<!-- header -->
<h1 class="text-3xl md:text-6xl text-center p-2 mb-8 tracking-widest">~ tic tac toe ~</h1>

<div class="flex gap-8 mx-[5%] lg:mx-[15%] md:mx-[5%] md:mt-[10%] flex-col-reverse md:flex-row">
    <!-- single player -->
    <div
        class="px-4 py-16 border flex flex-col md:flex-1 justify-around items-center md:min-h-[50vh] min-h-fit gap-8"
    >
        <h2 class="text-3xl tracking-widest">Single-Player</h2>
        <p>play against AI (easy/hard mode)</p>
        <p class="italic">coming soon ...</p>
        <div
            class="dark:hover:bg-slate-300 dark:bg-slate-200 dark:text-slate-900 hover:bg-slate-600 bg-slate-800 text-slate-200 tracking-wider p-4"
        >
            <DrawerCustom />
        </div>
    </div>

    <!-- multiplayer -->
    <div
        class="border flex flex-col md:flex-1 justify-center items-center md:h-[50vh] px-4 pt-8 pb-12 min-h-fit"
    >
        <h2 class="text-3xl mb-12 text-center tracking-widest">Multi-Player</h2>
        <form class="justify-self-center flex flex-col items-center">
            <input
                type="text"
                placeholder="your name ..."
                class=" px-4 py-2 h-fit w-full text-center text-lg mb-8"
                bind:value={player_name}
                onkeydown={(e) => {
                    if (e.key === 'Enter') {
                        handleCreate();
                    }
                }}
                required
            />
            <a id="create-lobby-link" class="hidden" aria-labelledby="create"></a>
            <Button
                class="py-2 text-lg px-7 mt-10 h-fit w-fit rounded-none tracking-wider font-mono"
                type="button"
                onclick={handleCreate}>create lobby</Button
            >
            <p class="my-4 text-gray-500 text-center">--- o r ---</p>
            <div class="flex justify-center items-center">
                <input
                    type="text"
                    class=" mr-2 h-10 w-4/5 text-center"
                    placeholder="lobby id ..."
                    bind:value={lobbyId}
                    onkeydown={(e) => {
                        if (e.key === 'Enter') {
                            handleJoin();
                        }
                    }}
                />
                <a id="join-lobby-link" class="hidden" aria-labelledby="create"></a>
                <Button
                    class="text-lg px-4 rounded-none tracking-wider font-mono"
                    type="button"
                    onclick={handleJoin}>join</Button
                >
            </div>
        </form>
    </div>
</div>
