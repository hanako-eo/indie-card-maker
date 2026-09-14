import type { TokenizerAndRendererExtension } from "marked";

export default {
	name: "card-name",
	level: "inline",
	start(src) { return src.match(/{/)?.index; },
	tokenizer(src, _tokens) {
		const rule = /^{([^{}\n]+)}/;
		const match = rule.exec(src);
		if (match) {
			return {
				type: "card-name",
				raw: match[0],
				name: match[1],
			};
		}
	},
	renderer(token) {
		return `<span class="card-name-effect">${token.name}</span>`
	}
} as TokenizerAndRendererExtension;
