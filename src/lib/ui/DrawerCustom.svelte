<script lang="ts">
    import * as Drawer from '$lib/components/ui/drawer';
    const features = [
        'single player AI with easy and hard mode',
        'store games and user data in database',
        'lobbies once created can be viewed and joined from',
        'lobby games can be spectated by others',
        'user login',
        'user stats (how many total wins and vs who)',
        'implement match making system along with ranking (MMR)'
    ];
</script>

<Drawer.Root>
    <Drawer.Trigger>upcoming features</Drawer.Trigger>
    <Drawer.Content>
        <div class="w-full md:max-w-md max-w-sm mx-auto">
            <Drawer.Header>
                <div class="py-4 text-center">
                    <Drawer.Title>Future updates</Drawer.Title>
                </div>
            </Drawer.Header>
            <ul class="py-8 px-8">
                {#each features as feature}
                    <li class="list-disc w-full">
                        {feature}
                    </li>
                {/each}
            </ul>
            <div class="md:ml-44 ml-32">
                <a href="https://github.com/faredun/tictactoe/tree/main" class="underline">
                    code repo link</a
                >
            </div>
            <Drawer.Footer>
                <Drawer.Close>Cancel</Drawer.Close>
            </Drawer.Footer>
        </div>
    </Drawer.Content>
</Drawer.Root>
