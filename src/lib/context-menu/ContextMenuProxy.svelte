<script lang="ts">
import { Portal } from '@jsrob/svelte-portal';

import { menu } from '../../context.svelte';

function handle_hide_context(event: MouseEvent) {
	if (event.type == "contextmenu")
		event.preventDefault();
	menu.value = null;
}
</script>

<svelte:window onclick={handle_hide_context} oncontextmenu={handle_hide_context}></svelte:window>
{#if menu.value}
	<Portal target="body">
		<menu id="contextmenu-container" style:top="{menu.y}px" style:left="{menu.x}px">{@render menu.value()}</menu>
	</Portal>
{/if}
