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

<aside class="collection-editor-sidebar">
	<h2>Modifier le style des cartes.</h2>
	<CodeMirror class="collection-editor" bind:value={value} lang={css()} theme={oneDark} styles={{
		"&": {
			width: "100%",
			height: "50rem",
			maxHeight: "100%",
		},
	}}/>
	<button class="clickable" onclick={onclose}>Fermer</button>
</aside>

<style>
	.collection-editor-sidebar {
		position: absolute;
		z-index: 2;

		overflow: scroll;

		background-color: var(--border);
		border: 2px solid var(--code-bg);

		width: 512px;

		padding: 8px;

		top: 0;
		bottom: 0;
		right: 0;
	}

	:global(.collection-editor) {
		margin: 16px 0;
	}
</style>
