<script lang="ts">
import { mount, unmount } from 'svelte';
import Wormhole from './Wormhole.svelte';
import { menu } from '../../context.svelte';

$effect(() => {
	const target: HTMLElement | null = document.querySelector("#contextmenu-container");
	if (!target) {
		console.error(`the element #contextmenu-container does not exist`);
		return;
	}

	if (!menu.value) {
		target.setAttribute("style", `display: none;`);
		return;
	}

	target.setAttribute("style", `top: ${menu.y}px; left: ${menu.x}px;`);
	const app = mount(Wormhole, {
		target,
		props: { children: menu.value },
	});

	return () => {
		if (app) {
			unmount(app, { outro: true });
		}
	};
});
</script>
