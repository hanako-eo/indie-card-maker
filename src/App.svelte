<script lang="ts">
import CodeMirror from "svelte-codemirror-editor";
import { css } from "@codemirror/lang-css";
import { oneDark } from "@codemirror/theme-one-dark";

import { liveQuery } from 'dexie';
import { db, menu } from './context.svelte';
import Collection from './lib/Collection.svelte';
import ContextMenuProxy from './lib/context-menu/ContextMenuProxy.svelte';

const collections = liveQuery(async () => db.collections.toArray());
let current_edit_index = $state(-1);
let current_edit_id = $derived($collections[current_edit_index].id);
let value = $state<string>("");

$effect(() => {
	if (current_edit_index == -1)
		return;

	value = $collections[current_edit_index].stylesheet;
	console.log(current_edit_index);
})

function handle_click() {
	db.collections.add({
		name: "Nouvelle Collection",
		icon_blob: "/default-collection.png",
		stat_blob: "/default-stat.png",
		stylesheet: "",
	});
}

function handle_hide_context(event: MouseEvent) {
	if (event.type == "contextmenu")
		event.preventDefault();
	menu.value = null;
}

function handle_close() {
	db.collections.update(current_edit_id, { stylesheet: value });
	current_edit_index = -1;
}
</script>

<svelte:window onclick={handle_hide_context} oncontextmenu={handle_hide_context}></svelte:window>
<ContextMenuProxy />

<input type="file">

{#if current_edit_index != -1}
	<div class="collection-editor">
		<h2>Modifier le style des cartes.</h2>
		<CodeMirror bind:value={value} lang={css()} theme={oneDark} styles={{
			"&": {
				width: "500px",
				maxWidth: "100%",
				height: "50rem",
			},
		}}/>
		<button class="editor-close" onclick={handle_close}>Fermer</button>
	</div>
{/if}

{#each $collections as collection, index (collection.id)}
	<Collection onedit={() => current_edit_index = index} {...collection} />
{/each}

<button class="collection clickable" onclick={handle_click}>
	+ Créer une collection.
</button>

<style>
	h2 {
		color: var(--text-h);
	}

	.editor-close {
		margin-top: 8px;
		font-size: 18px;
	}

	.collection-editor {
		position: absolute;
		z-index: 2;

		background-color: var(--border);
		border: 2px solid var(--code-bg);

		padding: 8px;

		top: 0;
		bottom: 0;
		right: 0;
	}
</style>
