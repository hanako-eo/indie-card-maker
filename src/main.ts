
import { marked } from "marked";
import { mount } from "svelte";
import App from "./App.svelte";

import card_name from "./extentions/card_name";

import "./app.css";

marked.use({
	extensions: [card_name],
});

const app = mount(App, {
	target: document.getElementById("app")!,
});

export default app;
