import type { TokenizerAndRendererExtension } from "marked";

type BaseKeywords = keyof typeof keyword_colors | keyof typeof keywords;
type SingularKeywords = BaseKeywords | keyof typeof variants;

const keyword_colors = {
	"essence": "card-cost",
	"atk": "card-attack",
	"hp": "card-life",
	"dmg": "card-damage",
};

const keywords = {
	"avatar": "L'effet associé s'execute comme Arrivée si la carte et le héros choisi sont les mêmes.",
	"arrivée": "L'effet associé s'execute lorsque la carte arrive sur le terrain.",
	"départ": "L'effet associé s'execute lorsque la carte va au cimetière.",
	"départ précipité": "L'effet associé s'execute lorsque la carte va dans la zone de bannissement.",
	"début du tour": "L'effet associé s'execute au début du tour juste après la pioche.",
	"fin du tour": "L'effet associé s'execute à la fin du tour.",
	"attaque": "L'effet associé s'execute lors que la créature attaque.",
	"soutient": "L'effet associé s'execute lors qu'une autre créature alliée attaque.",

	"transparence": "Cette créature ne peut pas être ciblé pendant 1 tour.",
	"paralysie": "Cette créature ne peut plus attaquer.",
	"tétanisé": "Cette créature ne peut plus attaquer pendant 1 tour.",
	"muet": "Les effets de la carte ne peuvent plus être activé.",
	"agressivité": "Cette créature peut ignorer les créatures ennemis et attaquer adversaire directement.",
	"hâte": "Cette créature peut attaquer lors de son arrivée.",
	"esquive": "Cette créature peut ignorer 1 fois les dégats qui lui sont addressés.",
	"provocation": "Cette créature ne peut pas être ignorer lorsqu'une créature ennemie attaque.",
};

const variants = {
	"muette": "muet",
	"tétanise": "tétanisé",
	"tétanisée": "tétanisé",
	"agressivite": "tétanisé",
	"agressivitée": "tétanisé",
};

const keywords_list = [...Object.keys(keyword_colors), ...Object.keys(variants), ...Object.keys(keywords)];
const plurials = keywords_list.map((s) => s + 's').join("|")
const singulars = keywords_list.join("|")
const tokenizer = new RegExp(`^(${plurials}|${singulars})(?![a-z])`, "i");
const detection = new RegExp(`${plurials}|${singulars}`, "i");

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
		const extracted_keyword = (token.keyword as string).toLowerCase().replace(/s$/, "") as SingularKeywords;
		const keyword = extracted_keyword in variants ? variants[extracted_keyword as keyof typeof variants] : extracted_keyword;

		if (keyword in keyword_colors) {
			return `<span class="${keyword_colors[keyword as keyof typeof keyword_colors]}">${token.keyword}</span>`;
		}

		if (keyword in keywords) {
			return `<span class="card-keyword" title="${keywords[keyword as keyof typeof keywords]}">${token.keyword}</span>`;
		}

		return token.keyword;
	}
} as TokenizerAndRendererExtension;
