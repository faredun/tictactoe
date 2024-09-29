<script>
    import { ModeWatcher } from 'mode-watcher';
    import ToggleTheme from '$lib/ui/ToggleTheme.svelte';
    import '../app.css';

    let { children } = $props();
</script>

<ModeWatcher />
<div class="hide-scrollbar overflow-auto h-screen">
    <div class="m-4 h-full min-h-fit">
        <div class="absolute top-0 right-0 mt-6 md:mt-12 mr-4 md:mr-6">
            <ToggleTheme />
        </div>
        {@render children()}
    </div>
    <footer class="bottom-0 text-center w-full py-10 mt-20 md:mt-0">
        <p>
            {'made with ♡ by faredun'}
        </p>
    </footer>
</div>

<style lang="postcss">
    /* hide scrollbar for IE, Edge and Firefox */
    .hide-scrollbar::-webkit-scrollbar {
        display: none;
    }

    .hide-scrollbar {
        -ms-overflow-style: none; /* IE and Edge */
        scrollbar-width: none; /* Firefox */
    }
</style>
