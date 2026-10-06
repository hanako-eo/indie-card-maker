
import { marked } from "marked";
import { mount } from "svelte";
import App from "./App.svelte";

import card_name from "./extentions/card_name";
import keywords from "./extentions/keywords";
import stats from "./extentions/stats";

import "./reset.css";
import "./app.css";

marked.use({
	extensions: [card_name, keywords, stats],
});

const app = mount(App, {
	target: document.getElementById("app")!,
});

export default app;
