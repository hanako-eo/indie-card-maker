<script lang="ts">
import { liveQuery } from 'dexie';
import { Upload } from '@lucide/svelte';

import { db, type CollectionSerialization, type CollectionTable } from './context.svelte';
import Collection from './lib/Collection.svelte';
import ContextMenuProxy from './lib/context-menu/ContextMenuProxy.svelte';

import default_icon_blob from "./assets/default-collection.png"
import default_stat_blob from "./assets/default-stat.png"

const collections = liveQuery(async () => db.collections.toArray());

function handle_click() {
	db.collections.add({
		name: "Nouvelle Collection",
		icon_blob: default_icon_blob,
		stat_blob: default_stat_blob,
		stylesheet: "",
	});
}

function handle_collection_change(id: number, changes: Partial<CollectionTable>) {
	db.collections.update(id, changes);
}

async function handle_collection_deletion(id: number) {
	await db.cards.where({ collection_id: id }).delete();
	await db.collections.delete(id);
}

function handle_upload(event: Event & { currentTarget: HTMLInputElement }) {
	const reader = new FileReader();
	reader.addEventListener("load", async () => {
		const { cards, ...data }: CollectionSerialization = JSON.parse(reader.result as string);

		const collection_id = await db.collections.add(data);
		db.cards.bulkAdd(cards.map((card) => ({ ...card, collection_id })));
	});
	reader.readAsText(event.currentTarget!.files![0]);
}
</script>

<ContextMenuProxy />

{#each $collections as collection (collection.id)}
	<Collection
		onchange={(changes) => handle_collection_change(collection.id, changes)}
		ondelete={() => handle_collection_deletion(collection.id)}
		{...collection} />
{/each}

<div class="collection collection-adder">
	<div></div>
	<button class="clickable" onclick={handle_click}>+ Créer une collection.</button>
	<div class="collection-upload">
		<Upload size={32} />
		<label class="clickable" style:position="absolute"><input type="file" accept=".collection-data" onchange={handle_upload} /></label>
	</div>
</div>

<style>
	.collection {
		display: flex;

		justify-content: space-between;
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
