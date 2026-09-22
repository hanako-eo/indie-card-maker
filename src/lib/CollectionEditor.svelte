<script lang="ts">
import ColorPicker from "svelte-awesome-color-picker";
import type { CollectionStyle } from "../context.svelte";
import Card from "./Card.svelte";

import { file_content } from "../helper";

import portrait_placeholder from "../assets/fish.gif";

type Props = CollectionStyle & {
	collection_name: string,
	collection_blob: string,
	stat_blob: string,

	onchange: (changes: CollectionStyle) => void,
	onclose: () => void,
}

let { background, border_color, color, collection_name, collection_blob, stat_blob, onchange, onclose }: Props = $props();
let background_type = $derived(background.type);
let background_value = $derived(background.value);

const css_background = $derived(background_type == "color" ? background_value : `url(${background_value})`);

$effect.pre(() => {
	if (background_type == "color")
		background_value = "black";
});

$effect(() => {
	background.type = background_type;
	background.value = background_value;
});

async function set_background(event: Event & { currentTarget: HTMLInputElement }) {
	const files = event.currentTarget!.files;
	if (files === null) return;

	background_value = await file_content("data_url", files[0]);
}
</script>

<h2>Editer l'apparence des cartes de {collection_name}.</h2>

<div class="card-editor" style:--card-background={css_background} style:--card-border={border_color} style:--card-color={color}>
	<Card
		{collection_name}
		{collection_blob}
		{stat_blob}

		name="Card Name"
		archetypes="Archetype1, Archetype2"
		description="Ceci est une **description** de {'{'}test{'}'}{"\n\n"}atk hp essence"
		portrait_blob={portrait_placeholder}

		cost={8}
		attack={8}
		life={8} />
</div>
<hr />
<div class="inputs">
	<h3>Fond</h3>
	<select bind:value={background_type}>
		<option value="color">Couleur</option>
		<option value="image">Image</option>
	</select>

	{#if background_type == "color"}
		<ColorPicker
			bind:hex={background_value}
			label="Choisi la couleur du fond."
			isAlpha={false} />
	{:else}
		<button>
			Mettre une image de fond.
			<label style:position="absolute">
				<input type="file" onchange={set_background}/>
			</label>
		</button>
	{/if}

	<h3>Bordure</h3>
	<ColorPicker
		bind:hex={border_color}
		label="Choisi la couleur pour la bordure."
		isAlpha={false} />

	<h3>Text</h3>
	<ColorPicker
		bind:hex={color}
		label="Choisi la couleur pour le text."
		isAlpha={false} />

	<div>
		<button class="clickable" onclick={() => onchange({ background, border_color, color })}>Sauvegarder et fermer</button>
		<button class="clickable" onclick={onclose}>Fermer sans sauvegarder</button>
	</div>
</div>

<style>
	h2 {
		text-align: center;
		font-size: 32px;

		margin: 16px 0;
	}

	h3 {
		text-align: center;
		font-size: 24px;

		margin: 16px 0;
	}

	hr {
		border: 2px solid white;
		margin: 16px 0;
	}

	button, select {
		position: relative;

		border-radius: 4px;
		padding: 8px;
	}

	label {
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
	}

	.card-editor {
		display: flex;

		flex-direction: column;
		flex-wrap: nowrap;
		justify-content: center;
		align-items: center;
	}

	.inputs {
		--cp-bg-color: var(--light-background);
		--cp-border-color: var(--border);
		--cp-text-color: var(--text);
		--cp-input-color: var(--light-background);
		--cp-button-hover-color: #777;
		text-align: center;
	}
</style>
