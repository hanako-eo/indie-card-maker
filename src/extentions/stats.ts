import type { TokenizerAndRendererExtension } from "marked";

export default {
	name: "stats",
	level: "inline",
	start(src) { return src.match(/((\+|\-)\d+\/)?(\+|\-)\d+\/(\+|\-)\d+/)?.index; },
	tokenizer(src, _tokens) {
		const match = /^((\+|\-)(\d+))?\/?((\+|\-)(\d+))\/((\+|\-)(\d+))/.exec(src);
		if (match) {
			return {
				type: "stats",
				raw: match[0],
				cost: !!match[1] ? [match[2], match[3]] : null,
				atk: [match[5], match[6]],
				hp: [match[8], match[9]],
			};
		}
	},
	renderer(token) {
		if (token.cost != null) {
			return `${token.cost[0]}<span class="card-cost">${token.cost[1]}</span>/${token.atk[0]}<span class="card-attack">${token.atk[1]}</span>/${token.hp[0]}<span class="card-life">${token.hp[1]}</span>`;
		} else {
			return `${token.atk[0]}<span class="card-attack">${token.atk[1]}</span>/${token.hp[0]}<span class="card-life">${token.hp[1]}</span>`;
		}
	}
} as TokenizerAndRendererExtension;
