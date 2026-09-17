import type { TokenizerAndRendererExtension } from "marked";

const keyword_colors = {
	"essence": "card-cost",
	"atk": "card-attack",
	"hp": "card-life",
	"dmg": "card-damage",
};

export default {
	name: "keywords",
	level: "inline",
	start(src) { return src.match(/essence|atk|hp|dmg/i)?.index; },
	tokenizer(src, _tokens) {
		const rule = /^(essence|atk|hp|dmg)/i;
		const match = rule.exec(src);
		if (match) {
			return {
				type: "keywords",
				raw: match[0],
				keyword: match[1],
			};
		}
	},
	renderer(token) {
		const keyword: keyof typeof keyword_colors = token.keyword.toLowerCase();
		if (keyword in keyword_colors) {
			return `<span class="${keyword_colors[keyword]}">${token.keyword}</span>`
		}

		return token.keyword
	}
} as TokenizerAndRendererExtension;
