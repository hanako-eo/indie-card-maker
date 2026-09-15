<script lang="ts">


import { Portal } from "@jsrob/svelte-portal"
import Pen from "@lucide/svelte/icons/pen";
import Trash from "@lucide/svelte/icons/trash";
import { liveQuery } from "dexie";
import { onDestroy } from "svelte";
import { db, type CardTable, type CollectionTable } from "../context.svelte";
import Card from "./Card.svelte";
import CollectionEditor from "./CollectionEditor.svelte";

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
	var reader = new FileReader();
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

function handle_card_clone(card: CardTable) {
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
</script>

{#if show_editor}
	<Portal target="body">
		<CollectionEditor onclose={() => show_editor = false} bind:value={stylesheet} />
	</Portal>
{/if}

<section class="collection">
	<div class="collection-portrait" style:background-image={`url(${icon_blob})`}>
		<label>
			<input type="file" accept="image/*" onchange={show_image.bind(null, "icon_blob")} />
		</label>
	</div>
	<input class="collection-name" bind:value={name} />
	<div class="collection-infos">
		<Pen class="clickable" size={32} onclick={() => show_editor = true}/>
		<Trash class="clickable" color="red" size={32} onclick={ondelete} />
		<div class="collection-stat clickable" style:background-image={`url(${stat_blob})`}>
			<label>
				<input type="file" accept="image/*" style:position="absolute" onchange={show_image.bind(null, "stat_blob")} />
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
	.card-adder {
		background-color: var(--border);
		border: 2px solid var(--border);

		font-size: 24px;
		text-align: center;

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

		background-size: 32px;
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
