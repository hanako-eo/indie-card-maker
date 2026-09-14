<script lang="ts">
import Pen from "@lucide/svelte/icons/pen";
import Trash from "@lucide/svelte/icons/trash";
import { liveQuery } from "dexie";
import { onDestroy } from "svelte";
import { db, type CollectionTable } from "../context.svelte";
import Card from "./Card.svelte";

type Props = CollectionTable & {
	onedit: () => void,
};

let { id, name, icon_blob, stat_blob, stylesheet, onedit }: Props = $props();
const cards = liveQuery(() => db.cards.where({ collection_id: id }).toArray());
const size = $derived($cards?.length ?? 0);

const cssstylesheet = new CSSStyleSheet();
document.adoptedStyleSheets.push(cssstylesheet);

$effect(() => {
	cssstylesheet.replaceSync(stylesheet);
})

$effect(() => {
	db.collections.update(id, { name });
})

onDestroy(() => {
	document.adoptedStyleSheets = document.adoptedStyleSheets.filter((s) => s != cssstylesheet);
})

function show_image(blob_key: "icon_blob" | "stat_blob", event: Event & { currentTarget: HTMLInputElement }) {
	var reader = new FileReader();
	reader.addEventListener("load", async () => {
		const value = reader.result as string
		if (blob_key == "icon_blob") icon_blob = value;
		else stat_blob = value;

		await db.collections.update(id, { [blob_key]: value });
	});
	reader.readAsDataURL(event.currentTarget!.files![0]);
}

function handle_add_card() {
	db.cards.add({
		collection_id: id,

		name: "Nouvelle Carte",
		description: "",
		portrait_blob: "",

		cost: 0,
		attack: 0,
		life: 0,
	});
}

async function handle_delete() {
	await db.cards.where({ collection_id: id }).delete();
	await db.collections.delete(id);
}
</script>

<div class="collection">
	<div class="collection-portrait" style:background-image={`url(${icon_blob})`}>
		<label>
			<input type="file" accept="image/*" onchange={show_image.bind(null, "icon_blob")} />
		</label>
	</div>
	<input class="collection-name" bind:value={name} />
	<div class="collection-infos">
		<Pen class="clickable" size={32} onclick={onedit}/>
		<Trash class="clickable" color="red" size={32} onclick={handle_delete} />
		<div class="collection-stat clickable" style:background-image={`url(${stat_blob})`}>
			<label>
				<input type="file" accept="image/*" style:position="absolute" onchange={show_image.bind(null, "stat_blob")} />
				{size}
			</label>
		</div>
	</div>
</div>

<div class="cards">
	{#each $cards as card (card.id)}
		<Card collection_name={name} collection_blob={icon_blob} {stat_blob} {...card} />
	{/each}

	<button class="card card-adder" onclick={handle_add_card}>+ Créer une carte.</button>
</div>


<style>
	.card-adder {
		background-color: var(--border);
		border: 2px solid var(--border);

		font-size: 24px;
		text-align: center;
		color: var(--text-h);

		user-select: none;
		cursor: pointer;
	}

	.cards, .collection-infos {
		display: flex;

		flex-wrap: wrap;
		align-items: flex-start;
		align-content: flex-start;

		gap: 8px;
	}

	.cards {
		margin: 8px;
	}

	.collection {
		display: flex;

		justify-content: space-between;
		align-items: center;

		gap: 8px;
	}

	.collection-portrait, .collection-stat {
		display: inline-block;

		image-rendering: pixelated;

		width: 32px;
		height: 32px;
	}

	.collection-stat {
		position: relative;
		display: inline-block;
		text-align: center;

		width: 32px;
		height: 32px;

		line-height: 30px;
		font-size: 32px;
	}

	.collection-name {
		text-align: center;
		field-sizing: content;
		align-self: center;
		height: 32px;

		background: none;
		border: none;

		font-family: determination;
		font-size: 32px;
	}
</style>
