<script lang="ts">
    import { goto } from '$app/navigation';
    import { Button } from '$lib/components/ui/button';
    import { player } from '$lib/playerName.svelte';

    let player_name = '';
    let lobbyId = '';

    function handleCreate() {
        if (player_name) {
            player.set(player_name);
            const newLobbyId = Math.random().toString(36).substring(2, 8);
            goto(`/lobby/${newLobbyId}`);
        } else {
            alert('please enter player name');
        }
    }

    function handleJoin() {
        if (lobbyId && player_name) {
            console.log('success join');
        } else if (lobbyId) {
            console.log('fail join');
            alert('please enter player name');
        } else {
            console.log('fail join');
            alert('please enter lobby id');
        }
    }
</script>

<h1 class="text-5xl md:text-6xl text-center p-2 mb-8">tic tac toe</h1>
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
        <form class="justify-self-center flex flex-col" on:submit|preventDefault={handleCreate}>
            <input
                type="text"
                placeholder="your name ..."
                class="border px-4 py-2 h-fit w-full text-center text-lg"
                bind:value={player_name}
                on:keydown={(e) => {
                    if (e.key === 'Enter') {
                        console.log('entered');
                        handleCreate();
                    }
                }}
                required
            />
            <Button class="py-2 text-2xl px-7 mt-10 h-fit" type="button" onclick={handleCreate}
                >create lobby</Button
            >
            <p class="my-4 text-gray-500">--- o r ---</p>
            <div class="flex justify-center items-center">
                <input
                    type="text"
                    class="border mr-2 h-10 w-3/5 text-center"
                    placeholder="lobby id ..."
                    bind:value={lobbyId}
                    on:keydown={(e) => {
                        if (e.key === 'Enter') {
                            console.log('entered');
                            handleJoin();
                        }
                    }}
                />
                <Button class="text-xl px-4" type="button" onclick={handleJoin}>join</Button>
            </div>
        </form>
    </div>
</div>
