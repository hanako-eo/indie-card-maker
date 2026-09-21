<script lang="ts">
import { liveQuery } from "dexie";
import { onDestroy } from "svelte";
import { fly } from "svelte/transition";
import { Portal } from "@jsrob/svelte-portal"
import { Upload, Download, Plus, Pen, Trash, ChevronDown } from '@lucide/svelte';

import { db, type CardTable, type CollectionSerialization, type CollectionTable } from "../context.svelte";
import CollectionEditor from "./CollectionEditor.svelte";
import Card from "./Card.svelte";
import { download, file_content, prebind } from "../helper";

type Props = CollectionTable & {
	onchange: (changes: Partial<CollectionTable>) => void,
	ondelete: () => void,
};

let { id, name, icon_blob, stat_blob, style, onchange, ondelete }: Props = $props();

const cards = liveQuery(() => db.cards.where({ collection_id: id }).toArray());
const size = $derived($cards?.length ?? 0);

let show_content = $state(true);
let show_editor = $state(false);

// const cssstylesheet = new CSSStyleSheet();
// document.adoptedStyleSheets.push(cssstylesheet);

// $effect(() => {
// 	cssstylesheet.replaceSync(stylesheet);
// 	onchange({ stylesheet });
// });
$effect(() => onchange({ name }));

// onDestroy(() => {
// 	document.adoptedStyleSheets = document.adoptedStyleSheets.filter((s) => s != cssstylesheet);
// })

async function show_image(blob_key: "icon_blob" | "stat_blob", event: Event & { currentTarget: HTMLInputElement }) {
	const files = event.currentTarget!.files;
	if (files === null) return;

	const value = await file_content("data_url", files[0]);

	if (blob_key == "icon_blob") icon_blob = value;
	else stat_blob = value;

	onchange({ [blob_key]: value });
}

function handle_add_card() {
	db.cards.add({
		collection_id: id,

		name: "Nouvelle Carte",
		archetypes: "",
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
		archetypes: card.archetypes,
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

async function handle_upload(event: Event & { currentTarget: HTMLInputElement }) {
	const files = event.currentTarget!.files;
	if (files === null) return;

	const data: CollectionSerialization = JSON.parse(await file_content("text", files[0]));
	db.cards.bulkAdd(data.cards.map((card) => ({ ...card, collection_id: id })));
}

function handle_download() {
	download<CollectionSerialization>(`${name}.collection-data`, {
		name,
		icon_blob,
		stat_blob,
		style,

		cards: $cards.map((card) => ({
			name: card.name,
			archetypes: card.archetypes,
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
			<CollectionEditor collection_name={name} onclose={() => show_editor = false} {...style} />
		</aside>
	{/if}
</Portal>

<section class="collection" class:collection-close={!show_content}>
	<nav class="collection-header">
		<div class="collection-infos">
			<ChevronDown style="transform:rotate({show_content ? "180deg" : "0deg"})" onclick={() => show_content = !show_content}/>
			<div class="collection-portrait icon" style:background-image={`url(${icon_blob})`}>
				<label><input type="file" accept="image/*" onchange={prebind(show_image, "icon_blob")} /></label>
			</div>
		</div>
		<input class="collection-name" bind:value={name} />
		<div class="collection-infos">
			<Download class="clickable" onclick={handle_download} />
			<div class="collection-upload">
				<Upload />
				<label class="clickable" style:position="absolute"><input type="file" accept=".collection-data" onchange={handle_upload} /></label>
			</div>
			<hr class="vl" />
			<Plus class="clickable" onclick={handle_add_card}/>
			<Pen class="clickable" onclick={() => show_editor = true}/>
			<Trash class="clickable" color="#C23C3C" onclick={ondelete} />
			<div class="collection-stat clickable icon" style:background-image={`url(${stat_blob})`}>
				<label>
					<input type="file" accept="image/*" style:position="absolute" onchange={prebind(show_image, "stat_blob")} />
					{size}
				</label>
			</div>
		</div>
	</nav>
	<hr />
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
	</section>
</section>

<style>
	hr {
		border: 2px solid white;
		margin: 16px 0;
	}

	.collection {
		background-color: var(--light-background);
		border: 4px solid var(--border);
		border-radius: 8px;

		text-align: center;

		margin: 16px;
		padding: 16px;

		width: -webkit-fill-available;
		width: -moz-available;

		font-size: 24px;
		overflow: clip;
	}

	.collection-close {
		height: 72px;
	}

	.collection-header {
		display: flex;

		justify-content: space-between;
		align-items: center;

		gap: 8px;
	}

	.cards { margin: 8px; }
	.cards, .collection-infos {
		display: flex;

		flex-wrap: wrap;
		align-items: center;
		align-content: flex-start;

		gap: 8px;
	}

	.collection-portrait, .collection-stat {
		display: inline-block;
		image-rendering: pixelated;
	}

	.collection-stat, .collection-upload {
		position: relative;
		display: inline-block;
		text-align: center;

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

		background-color: var(--background);
		border-left: 4px solid var(--border);

		width: 512px;
		max-width: 512px;

		padding: 8px;

		top: 0;
		bottom: 0;
		right: 0;
	}

	@keyframes collection-closing {
		0%, 1% { height: fit-content; }
		100% { height: 64px; }
	}
</style>
