<script lang="ts">
import { marked } from "marked";

import ContextMenu from "./context-menu/ContextMenu.svelte";
import { type CardTable } from "../context.svelte";
import { snake_case } from "../helper";

type Props = Omit<CardTable, "id" | "collection_id"> & {
	collection_name: string,
	collection_blob: string,
	stat_blob: string,

	onchange: (changes: Partial<CardTable>) => void,
	onclone: () => void,
	ondelete: () => void,
};

let {
	collection_name,
	collection_blob,
	stat_blob,

	name,
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
let context_menu = $state<ContextMenu>()!;
let description_editing = $state(false);

$effect(() => onchange({ name, cost, attack, life, }));

function show_image(event: Event & { currentTarget: HTMLInputElement }) {
	var reader = new FileReader();
	reader.addEventListener("load", async () => {
		portrait_blob = reader.result as string;
		onchange({ portrait_blob });
	});
	reader.readAsDataURL(event.currentTarget!.files![0]);
}

function handle_dblclick() {
	description_editing = true;
}

function handle_blur() {
	onchange({ description });
	description_editing = false;
}

function handle_contextmenu(event: MouseEvent) {
	event.preventDefault();
	event.stopPropagation();

	context_menu.show_at(event.x, event.y);
}
</script>

<div class="card card-{snake_case(collection_name)}" oncontextmenu={handle_contextmenu}>
	<input class="card-name" bind:value={name} />
	<img class="card-collection" src={collection_blob} alt="Collection {collection_name}" />
	<div class="card-stats">
		<input class="card-cost" type="number" placeholder="0" style:background-image={`url(${stat_blob})`} bind:value={cost} />
		<input class="card-attack" type="number" placeholder="0" style:background-image={`url(${stat_blob})`} bind:value={attack} />
		<input class="card-life" type="number" placeholder="0" style:background-image={`url(${stat_blob})`} bind:value={life} />
	</div>
	<div class="card-portrait" style:background-image={`url(${portrait_blob})`}>
		<label><input type="file" name="portrait" accept="image/*" onchange={show_image} /></label>
	</div>
	{#if description_editing}
		<textarea class="card-effect" style:margin-top="8px" autofocus bind:value={description} onblur={handle_blur}></textarea>
	{:else}
		<div class="card-effect" ondblclick={handle_dblclick}>{@html parsed_description}</div>
	{/if}
</div>


<ContextMenu bind:this={context_menu}>
	<li><button onclick={onclone}>Cloner la carte</button></li>
	<li><button onclick={ondelete}>Supprimer la carte</button></li>
</ContextMenu>

<style>
	button { padding: 8px; }
</style>
