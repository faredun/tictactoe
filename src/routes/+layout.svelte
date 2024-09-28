<script>
    import { ModeWatcher } from 'mode-watcher';
    import ToggleTheme from '../ui/ToggleTheme.svelte';

    import '../app.css';
</script>

<ModeWatcher />
<div class="hide-scrollbar overflow-auto h-screen">
    <div class="m-4 h-full">
        <div class="absolute top-0 right-0 mt-6 md:mt-12 mr-4 md:mr-6">
            <ToggleTheme />
        </div>

        <slot />
    </div>
    <footer class="bottom-0 text-center w-full py-10">
        <p>
            {'made with ♡ by faredun'}
        </p>
    </footer>
</div>

<style lang="postcss">
    .hide-scrollbar::-webkit-scrollbar {
        display: none;
    }

    /* Hide scrollbar for IE, Edge and Firefox */
    .hide-scrollbar {
        -ms-overflow-style: none; /* IE and Edge */
        scrollbar-width: none; /* Firefox */
    }
</style>
