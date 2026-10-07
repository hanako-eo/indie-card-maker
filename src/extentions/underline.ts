import type { TokenizerAndRendererExtension } from "marked";

export default {
	name: "underline",
	level: "inline",
	start(src) { return src.match(/_/)?.index; },
	tokenizer(src, _tokens) {
		const rule = /^_([^_\n]+)_/;
		const match = rule.exec(src);
		if (match) {
			return {
				type: "underline",
				raw: match[0],
				content: match[1],
			};
		}
	},
	renderer(token) {
		return `<u>${token.content}</u>`
	}
} as TokenizerAndRendererExtension;
