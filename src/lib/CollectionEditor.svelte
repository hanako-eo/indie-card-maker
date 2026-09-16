<script lang="ts">
import CodeMirror from "svelte-codemirror-editor";
import { css } from "@codemirror/lang-css";
import { oneDark } from "@codemirror/theme-one-dark";

interface Props {
	value: string,
	onclose: () => void,
}

let { value = $bindable(), onclose }: Props = $props();
</script>

<h2>Modifier le style des cartes.</h2>
<CodeMirror class="collection-editor" bind:value={value} lang={css()} theme={oneDark} styles={{
	"&": {
		width: "100%",
		height: "50rem",
		maxHeight: "100%",
	},
}}/>
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
