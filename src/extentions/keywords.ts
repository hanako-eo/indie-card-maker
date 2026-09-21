import type { TokenizerAndRendererExtension } from "marked";

const keyword_colors = {
	"essence": "card-cost",
	"atk": "card-attack",
	"hp": "card-life",
	"dmg": "card-damage",
};

const keywords = {
	"Avatar": "L'effet associé s'execute comme Arrivée si la carte et le héros choisi sont les mêmes.",
	"Arrivée": "L'effet associé s'execute lors que la carte arrive sur le terrain.",
	"Départ": "L'effet associé s'execute lors que la carte va au cimetière.",
	"Départ précipité": "L'effet associé s'execute lors que la carte va dans la zone de bannissement.",
	"Début du tour": "L'effet associé s'execute au début du tour juste après la pioche.",
	"Fin du tour": "L'effet associé s'execute à la fin du tour.",

	"Muet": "Plus aucune effets de la carte peuvent être activé.",
	"Paralysie": "Cette créature ne peut plus faire d'attaque.",

	"Précision": "Cette créature peut ignorer les créatures ennemis et l'attaque adversaire directement.",
	"Esquive": "Cette créature peut ignorer 1 fois les dégats qui lui sont addressés.",
	"Provocation": "Cette créature ne peut pas être ignorer lorsqu'une créature ennemie attaque.",
};

const keywords_string = [...Object.keys(keyword_colors), ...Object.keys(keywords)].join("|");
const tokenizer = new RegExp(`^(${keywords_string})`, "i");
const detection = new RegExp(keywords_string, "i");

export default {
	name: "keywords",
	level: "inline",
	start(src) { return src.match(detection)?.index; },
	tokenizer(src, _tokens) {
		const match = tokenizer.exec(src);
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
			return `<span class="${keyword_colors[keyword]}">${token.keyword}</span>`;
		}

		return `<span class="card-keyword">${token.keyword}</span>`;
	}
} as TokenizerAndRendererExtension;
