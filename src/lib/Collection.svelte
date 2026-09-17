<script lang="ts">
import { liveQuery } from "dexie";
import { onDestroy } from "svelte";
import { fly } from "svelte/transition";
import { Portal } from "@jsrob/svelte-portal"
import { Upload, Download, Pen, Trash } from '@lucide/svelte';

import { db, type CardTable, type CollectionSerialization, type CollectionTable } from "../context.svelte";
import CollectionEditor from "./CollectionEditor.svelte";
import Card from "./Card.svelte";
import { download, prebind } from "../helper";

type Props = CollectionTable & {
	onchange: (changes: Partial<CollectionTable>) => void,
	ondelete: () => void,
};

let { id, name, icon_blob, stat_blob, stylesheet, onchange, ondelete }: Props = $props();

const cards = liveQuery(() => db.cards.where({ collection_id: id }).toArray());
const size = $derived($cards?.length ?? 0);

let show_editor = $state(false);

const cssstylesheet = new CSSStyleSheet();
document.adoptedStyleSheets.push(cssstylesheet);

$effect(() => {
	cssstylesheet.replaceSync(stylesheet);
	onchange({ stylesheet });
});
$effect(() => onchange({ name }));

onDestroy(() => {
	document.adoptedStyleSheets = document.adoptedStyleSheets.filter((s) => s != cssstylesheet);
})

function show_image(blob_key: "icon_blob" | "stat_blob", event: Event & { currentTarget: HTMLInputElement }) {
	const reader = new FileReader();
	reader.addEventListener("load", async () => {
		const value = reader.result as string
		if (blob_key == "icon_blob") icon_blob = value;
		else stat_blob = value;

		onchange({ [blob_key]: value });
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

function handle_card_change(id: number, value: Partial<CardTable>) {
	db.cards.update(id, value);
}

function handle_card_clone(card: Omit<CardTable, "id">) {
	db.cards.add({
		collection_id: card.collection_id,

		name: card.name,
		description: card.description,
		portrait_blob: card.portrait_blob,

		cost: card.cost,
		attack: card.attack,
		life: card.life,
	});
}

function handle_card_deletion(id: number) {
	db.cards.delete(id);
}

function handle_upload(event: Event & { currentTarget: HTMLInputElement }) {
	const reader = new FileReader();
	reader.addEventListener("load", async () => {
		const data: CollectionSerialization = JSON.parse(reader.result as string);

		db.cards.bulkAdd(data.cards.map((card) => ({ ...card, collection_id: id })));
	});
	reader.readAsText(event.currentTarget!.files![0]);
}

function handle_download() {
	download<CollectionSerialization>(`${name}.collection-data`, {
		name,
		icon_blob,
		stat_blob,
		stylesheet,

		cards: $cards.map((card) => ({
			name: card.name,
			description: card.description,
			portrait_blob: card.portrait_blob,

			cost: card.cost,
			attack: card.attack,
			life: card.life,
		})),
	});
}
</script>

<Portal target="body">
	{#if show_editor}
		<aside class="collection-editor-sidebar" transition:fly={{ duration: 300, x: 512, opacity: 0 }}>
			<CollectionEditor onclose={() => show_editor = false} bind:value={stylesheet} />
		</aside>
	{/if}
</Portal>

<section class="collection">
	<div class="collection-portrait icon" style:background-image={`url(${icon_blob})`}>
		<label><input type="file" accept="image/*" onchange={prebind(show_image, "icon_blob")} /></label>
	</div>
	<input class="collection-name" bind:value={name} />
	<div class="collection-infos">
		<Download class="clickable" size={32} onclick={handle_download} />
		<div class="collection-upload">
			<Upload size={32} />
			<label class="clickable" style:position="absolute"><input type="file" accept=".collection-data" onchange={handle_upload} /></label>
		</div>
		<Pen class="clickable" size={32} onclick={() => show_editor = true}/>
		<Trash class="clickable" color="red" size={32} onclick={ondelete} />
		<div class="collection-stat clickable icon" style:background-image={`url(${stat_blob})`}>
			<label>
				<input type="file" accept="image/*" style:position="absolute" onchange={prebind(show_image, "stat_blob")} />
				{size}
			</label>
		</div>
	</div>
</section>

<section class="cards">
	{#each $cards as card (card.id)}
		<Card
			onchange={(changes) => handle_card_change(card.id, changes)}
			onclone={() => handle_card_clone(card)}
			ondelete={() => handle_card_deletion(card.id)}
			collection_name={name}
			collection_blob={icon_blob}
			{stat_blob}
			{...card} />
	{/each}

	<button class="card card-adder" onclick={handle_add_card}>+ Créer une carte.</button>
</section>


<style>
	.collection {
		display: flex;

		justify-content: space-between;
		align-items: center;

		gap: 8px;
	}

	.cards { margin: 8px; }
	.cards, .collection-infos {
		display: flex;

		flex-wrap: wrap;
		align-items: flex-start;
		align-content: flex-start;

		gap: 8px;
	}

	.card-adder {
		background-color: var(--light-background);
		border: 4px solid var(--border);

		font-size: 24px;
		text-align: center;

		user-select: none;
		cursor: pointer;
	}

	.collection-portrait, .collection-stat {
		display: inline-block;
		image-rendering: pixelated;
	}

	.collection-stat, .collection-upload {
		position: relative;
		display: inline-block;
		text-align: center;

		width: 32px;
		height: 32px;

		line-height: 30px;
		font-size: 32px;
	}

	.collection-upload label {
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
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

	.collection-editor-sidebar {
		position: absolute;
		z-index: 2;

		overflow: scroll;

		background-color: var(--border);
		border: 2px solid var(--code-bg);

		width: 512px;
		max-width: 512px;

		padding: 8px;

		top: 0;
		bottom: 0;
		right: 0;
	}
</style>
