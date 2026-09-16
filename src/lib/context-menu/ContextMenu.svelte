<script lang="ts">
import type { Snippet } from "svelte";

import { menu } from "../../context.svelte";

const { children }: { children: Snippet } = $props();

export function show_at(x: number, y: number) {
	menu.value = children;
	menu.x = x;
	menu.y = y;
}
</script>
