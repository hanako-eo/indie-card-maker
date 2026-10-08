<script lang="ts">
// TODO: add card type for creatures and spells
import { marked } from "marked";
import fitText from "@activetheory/fit-text";

import ContextMenu from "./context-menu/ContextMenu.svelte";
import { CardRarity, type CardTable } from "../context.svelte";
import { file_content, snake_case } from "../helper";

type Props = Omit<CardTable, "id" | "collection_id"> & {
	collection_index: number,
	collection_size: number,
	collection_name: string,
	collection_blob: string,
	stat_blob: string,

	onchange?: (changes: Partial<CardTable>) => void,
	onclone?: () => void,
	ondelete?: () => void,
};

let {
	collection_index,
	collection_size,
	collection_name,
	collection_blob,
	stat_blob,

	name,
	rarity,
	archetypes,
	description,
	portrait_blob,

	cost,
	attack,
	life,

	onchange,
	onclone,
	ondelete,
}: Props = $props();

const parsed_description = $derived(marked.parse(description));
const reactive = $derived(!!onclone || !!ondelete);

let description_holder = $state<HTMLDivElement>();
let description_box = $state<HTMLDivElement>();

let context_menu = $state<ContextMenu>()!;
let description_editing = $state(false);

$effect(() => onchange?.({ name, rarity, archetypes, cost, attack, life }));

$effect(() => {
	if (!description_holder)
		return;

	fitText({
		el: description_holder,
		box: description_box,
	});
});

async function show_image(event: Event & { currentTarget: HTMLInputElement }) {
	const files = event.currentTarget.files;
	if (files === null) return;

	portrait_blob = await file_content("data_url", files[0]);
	onchange?.({ portrait_blob });
}

function handle_dblclick() {
	if (!reactive) return;

	description_editing = true;
}

function handle_blur() {
	if (!reactive) return;

	onchange?.({ description });
	description_editing = false;
}

function handle_contextmenu(event: MouseEvent) {
	if (!reactive) return;

	event.preventDefault();
	event.stopPropagation();

	context_menu.show_at(event.pageX, event.pageY);
}
</script>

<div class="card card-{snake_case(collection_name)}" oncontextmenu={handle_contextmenu} role="doc-abstract">
	<div class="card-collection">
		<img src={collection_blob} alt="Collection {collection_name}" />
	</div>
	<div class="card-stats">
		<input class="card-cost" type="number" placeholder="0" style:background-image={`url(${stat_blob})`} bind:value={cost} />
		<input class="card-attack" type="number" placeholder="0" style:background-image={`url(${stat_blob})`} bind:value={attack} />
		<input class="card-life" type="number" placeholder="0" style:background-image={`url(${stat_blob})`} bind:value={life} />
	</div>
	<div class="card-inner">
		<input class="card-name" placeholder="Card Name" bind:value={name} />
		<div class="card-portrait" style:background-image={`url(${portrait_blob})`}>
			<label><input type="file" name="portrait" accept="image/*" onchange={show_image} /></label>
		</div>
		<input class="card-archetypes" placeholder="Archetypes" bind:value={archetypes} />
		{#if description_editing}
			<textarea class="card-effect" autofocus bind:value={description} onblur={handle_blur}></textarea>
		{:else}
			<div class="card-effect" ondblclick={handle_dblclick} role="contentinfo" bind:this={description_box}>
				<div class="card-effect-holder" bind:this={description_holder}>
					{@html parsed_description}
				</div>
			</div>
		{/if}
	</div>
	<div class="card-extra-info">
		<select class="card-rarity clickable" bind:value={rarity}>
			<option value={CardRarity.Token}>Token</option>
			<option value={CardRarity.Common}>Commun</option>
			<option value={CardRarity.Uncommon}>Peu commun</option>
			<option value={CardRarity.Rare}>Rare</option>
			<option value={CardRarity.Legendary}>Légendaire</option>
			<option value={CardRarity.Hero}>Hero</option>
		</select>
		<span class="card-indexing">
			{collection_index}/{collection_size}
		</span>
	</div>
</div>

<ContextMenu bind:this={context_menu}>
	{#if onclone}
		<li><button onclick={onclone}>Cloner la carte</button></li>
	{/if}
	{#if ondelete}
		<li><button onclick={ondelete}>Supprimer la carte</button></li>
	{/if}
</ContextMenu>

<style>
	.card {
		position: relative;
		display: inline-block;
		image-rendering: pixelated;

		width: 348px;
		height: 508px;

		background: var(--card-background, black);
		border: 4px solid var(--card-border, white);
		color: var(--card-color, white);
	}

	.card-inner {
		display: flex;

		flex-direction: column;
		flex-wrap: nowrap;
		justify-content: center;
		align-items: center;

		gap: 2px;
	}

	.card-name {
		background: none;

		width: 252px;
		height: 40px;

		color: inherit;
		font-size: 24px;
		text-align: center;
		text-fit: shrink;
	}

	.card-stats {
		position: absolute;
		display: grid;

		gap: 8px;
		top: 4px;
		left: 4px;

		font-size: 32px;
	}

	.card-stats > * {
		display: inline-block;

		background: inherit;
		background-repeat: no-repeat;
		background-size: 100% 100%;

		width: 32px;
		height: 32px;

		text-align: center;
		line-height: 30px;
	}

	.card-collection {
		position: absolute;
		display: flex;

		justify-content: center;
		align-items: center;

		top: 4px;
		right: 4px;

		width: 32px;
		height: 32px;
	}

	.card-portrait, .card-archetypes, .card-effect {
		color: inherit;
		outline: 2px solid var(--card-border, white);
		width: 312px;
	}

	.card-portrait {
		display: block;
		background-repeat: no-repeat;
		background-size: 100% 100%;

		height: 232px;
	}

	.card-archetypes {
		background: none;

		height: 24px;
		padding: 4px;

		font-size: 14px;
	}

	.card-effect {
		display: flex;

		flex-direction: column;
		justify-content: center;

		height: 180px;
		padding: 4px;

		background: none;
		resize: none;

		font-size: 15px;
		text-align: center;
	}

	.card-effect-holder {
		display: flex;

		flex-direction: column;
		flex-wrap: nowrap;
		justify-content: center;
		align-items: center;

		gap: 8px;

		text-align: center;
	}

	.card-extra-info {
		position: absolute;
		display: grid;

		grid-template-columns: 1fr 1fr;
		align-items: center;

		left: 4px;
		right: 4px;
		bottom: 2px;

		font-size: 12px;
	}

	.card-rarity {
		background: none;
		color: inherit;
		width: max-content;

		-moz-appearance:none; /* Firefox */
		-webkit-appearance:none; /* Safari and Chrome */
		appearance:none;
	}

	.card-indexing {
		text-align: right;
	}

:global {
	.card-keyword {
		text-decoration: underline;
	}
	.card-name-effect { color: #BB62F3; }

	.card-cost { color: #00d0ff; }
	.card-attack { color: #f0003c; }
	.card-life { color: #0dd000; }
	.card-damage { color: goldenrod; }

	.card-effect ul {
		list-style: disc;
		padding-left: 12px;
	}
}
</style>
