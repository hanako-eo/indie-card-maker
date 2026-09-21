<script lang="ts">
import { liveQuery } from 'dexie';
import { Upload } from '@lucide/svelte';

import { db, type CollectionSerialization, type CollectionTable } from './context.svelte';
import Collection from './lib/Collection.svelte';
import ContextMenuProxy from './lib/context-menu/ContextMenuProxy.svelte';

import default_icon_blob from "./assets/default-collection.png"
import default_stat_blob from "./assets/default-stat.png"
import { file_content } from './helper';

const collections = liveQuery(async () => db.collections.toArray());

function handle_click() {
	db.collections.add({
		name: "Nouvelle Collection",
		icon_blob: default_icon_blob,
		stat_blob: default_stat_blob,
		style: {
			background: { type: "color", value: "black" },
			border_color: "white",
			color: "white",
		},
	});
}

function handle_collection_change(id: number, changes: Partial<CollectionTable>) {
	db.collections.update(id, changes);
}

async function handle_collection_deletion(id: number) {
	await db.cards.where({ collection_id: id }).delete();
	await db.collections.delete(id);
}

async function handle_upload(event: Event & { currentTarget: HTMLInputElement }) {
	const files = event.currentTarget!.files;
	if (files === null) return;

	const { cards, ...data }: CollectionSerialization = JSON.parse(await file_content("text", files[0]));

	const collection_id = await db.collections.add(data);
	db.cards.bulkAdd(cards.map((card) => ({ ...card, collection_id })));
}
</script>

<ContextMenuProxy />

{#each $collections as collection (collection.id)}
	<Collection
		onchange={(changes) => handle_collection_change(collection.id, changes)}
		ondelete={() => handle_collection_deletion(collection.id)}
		{...collection} />
{/each}

<div class="collection-adder">
	<div></div>
	<button class="clickable" onclick={handle_click}>+ Créer une collection.</button>
	<div class="collection-upload">
		<Upload />
		<label class="clickable" style:position="absolute"><input type="file" accept=".collection-data" onchange={handle_upload} /></label>
	</div>
</div>

<style>
	.collection-adder {
		display: flex;

		justify-content: space-between;

		background-color: var(--light-background);
		border: 4px solid var(--border);
		border-radius: 8px;

		text-align: center;

		margin: 16px;
		padding: 16px;

		width: -webkit-fill-available;
		width: -moz-available;

		font-size: 24px;
	}

	button {
		background: none;

		width: -webkit-fill-available;
		width: -moz-available;
	}

	.collection-upload {
		position: relative;
	}

	.collection-upload label {
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
	}
</style>
