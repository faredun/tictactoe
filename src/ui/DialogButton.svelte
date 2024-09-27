<script lang="ts">
    import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
    import * as Dialog from '$lib/components/ui/dialog/index.js';
    import { Input } from '$lib/components/ui/input/index.js';
    import { Label } from '$lib/components/ui/label/index.js';
    let { title, style }: { title: string; style: string } = $props();
</script>

<Dialog.Root>
    <Dialog.Trigger class={buttonVariants({ variant: 'default' }) + ' h-fit'}>
        <span class={style}>
            {title}
        </span>
    </Dialog.Trigger>
    <Dialog.Content class="sm:max-w-[425px]">
        <Dialog.Header>
            <Dialog.Description>please enter your name to join the lobby with</Dialog.Description>
        </Dialog.Header>
        <div class="grid gap-4 py-4">
            <div class="grid grid-cols-4 items-center gap-4">
                <Label for="name" class="text-right">name</Label>
                <Input id="name" value="anonymous" class="col-span-3" />
            </div>
        </div>
        <Dialog.Footer>
            <Button type="submit">join lobby</Button>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>
