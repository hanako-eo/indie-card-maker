<script lang="ts">
import { liveQuery } from 'dexie';
import { db, type CollectionTable } from './context.svelte';
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
</script>

<ContextMenuProxy />

{#each $collections as collection (collection.id)}
	<Collection
	    onchange={(changes) => handle_collection_change(collection.id, changes)}
		ondelete={() => handle_collection_deletion(collection.id)}
		{...collection} />
{/each}

<button class="collection clickable" onclick={handle_click}>
	+ Créer une collection.
</button>
