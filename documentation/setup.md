# setup from scratch

### sveltekit

let's start with creating a new sveltekit project
we will use pnpm as our package manager throughout this project

```bash
 pnpm create svelte@latest .
```

let's select skeleton project, using TypeScript, and in additional options select these: ESLint, Prettier and Svelte 5

updating .prettierrc, feel free to update whatever formatting you are comfortable with, i like this setup

```
{
	"useTabs": false,
	"tabWidth": 4,
	"singleQuote": true
}
```

### tailwind

great, now let's setup tailwindcss

```
pnpm install -D tailwindcss postcss autoprefixer
pnpx tailwindcss init -p
```

this should now add 2 new files: postcss.config.js and tailwind.config.js

make sure in your svelte.config.js file your prepocess is set to vitePreprocess(), this will enable postcss in the style blocks

now, let's add paths to all of our template files in tailwind.config.js

```
content: ['./src/**/*.{html,js,svelte,ts}']
```

next, create a new file src/app.css

```
@tailwind base;
@tailwind components;
@tailwind utilities;
```

let's add this app.css to our layout, create src/routes/+layout.svelte

```
<script>
import '../app.css';
</script>

<slot />
```

great, our tailwindcss setup is now completed

### shadcn

now let's setup shadcn

```
pnpm dlx shadcn-svelte@latest init
```

i like the new york style and the slate design

for dark and light mode, we need mode-watcher

```
pnpm add mode-watcher
```

add `<ModeWatcher />` before the <slot /> in +layout.svelte file

let's add button component

```
pnpm dlx shadcn-svelte@latest add button
```

#### iconify

let's also add iconify for all our icons

```
pnpm add -D @iconify/svelte
```

let's create our custom component to toggle theme
create src/ui/ToggleTheme.svelte

```svelte
<script lang="ts">
    import Icon from '@iconify/svelte';
    import { toggleMode } from 'mode-watcher';
    import { Button } from '$lib/components/ui/button/index.js';
</script>

<Button onclick={toggleMode} variant="outline" size="icon">
    <Icon
        icon="ph:sun-light"
        class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
    />

    <Icon
        icon="ph:moon-light"
        class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
    />

    <span class="sr-only">Toggle theme</span>
</Button>
```

### socket.io

let's setup websocket using socket.io

```
pnpm i -D @sveltejs/adapter-node
```

add all the dependencies

```
pnpm i socket.io socket.io-client express
```

#### dev

update vite.config.ts

```
import { type ViteDevServer, defineConfig } from 'vite';

import { Server } from 'socket.io'

const webSocketServer = {
	name: 'webSocketServer',
	configureServer(server: ViteDevServer) {
		if (!server.httpServer) return
		const io = new Server(server.httpServer)

		io.on('connection', (socket) => {
		socket.emit('eventFromServer', 'hi from socket')
		})
	}
}

export default defineConfig({
	plugins: [sveltekit(), webSocketServer]
});
```

in +page.svelte:

```
import { io } from 'socket.io-client';

const socket = io();

socket.on('eventFromServer', (message) => {
	console.log(message);
});
```

#### prod

create server/index.js

```

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { handler } from '../build/handler.js';

const port = 3000;
const app = express();
const server = createServer(app);
const io = new Server(server);

// add vite.config.js socket.io contents here

app.use(handler);

server.listen(port, () => {
	console.log(`listening on port - ${port}`);
});

```

add `"start": "node ./server"` in your package.json scripts

setup is now complete
