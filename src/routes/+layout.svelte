<script>
    import { ModeWatcher } from 'mode-watcher';
    import ToggleTheme from '../ui/ToggleTheme.svelte';

    import '../app.css';
</script>

<ModeWatcher />
<div class="m-4">
    <div class="absolute top-0 right-0 mt-6 md:mt-12 mr-4 md:mr-6">
        <ToggleTheme />
    </div>

    <slot />
</div>
