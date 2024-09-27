<script>
    import { ModeWatcher } from 'mode-watcher';
    import ToggleTheme from '../ui/ToggleTheme.svelte';

    import '../app.css';
</script>

<ModeWatcher />
<div class="m-4">
    <div class="float-right mt-7 mr-6">
        <ToggleTheme />
    </div>
    <h1 class="text-6xl text-center p-2 mb-8">tic tac toe</h1>

    <slot />
</div>
