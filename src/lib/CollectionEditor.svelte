<script lang="ts">
import type { CollectionStyle } from "../context.svelte";

type Props = CollectionStyle & {
	collection_name: string,
	onclose: () => void,
}

let { background, border_color, color, collection_name, onclose }: Props = $props();
</script>

<h2>Editer l'apparence des cartes de {collection_name}.</h2>
<!-- <CodeMirror class="collection-editor" bind:value={value} lang={css()} theme={oneDark} styles={{
	"&": {
		width: "100%",
		height: "50rem",
		maxHeight: "100%",
	},
}}/> -->
<button class="clickable" onclick={onclose}>Fermer</button>

<style>
	:global(.collection-editor) { margin: 16px 0; }

	h2 {
		text-align: center;
		font-size: 32px;

		margin: 16px 0;
	}

	button {
		border-radius: 4px;
		padding: 8px;
	}
</style>
