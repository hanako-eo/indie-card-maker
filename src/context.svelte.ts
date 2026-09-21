import Dexie, { type EntityTable } from "dexie";
import { type Snippet } from "svelte";

type Migrate<From, To> = Partial<From> & To;

interface CollectionTableV1 {
	id: number,

	name: string,
	icon_blob: string,
	stat_blob: string,

	stylesheet: string,
}

export interface CollectionStyle {
	background: { type: "color" | "image", value: string },
	border_color: string,
	color: string,
}
export type CollectionTable = Omit<CollectionTableV1, "stylesheet"> & {
	style: CollectionStyle,
}

interface CardTableV1 {
	id: number,

	collection_id: number,

	name: string,
	description: string,
	portrait_blob: string,

	cost: number,
	attack: number,
	life: number,
}

export type CardTable = CardTableV1 & {
	archetypes: string,
}

export type CollectionSerialization = Omit<CollectionTable, "id"> & {
	cards: Array<CardSerialization>
}

export type CardSerialization = Omit<CardTable, "id" | "collection_id">

export const menu = $state<{ value: Snippet | null, x: number, y: number }>({ value: null, x: 0, y: 0 });
export const db = new Dexie("indie_cards_local_db") as Dexie & {
	collections: EntityTable<CollectionTable, "id">,
	cards: EntityTable<CardTable, "id">,
};

db.version(1).stores({
	collections: "++id, name, icon_blob, stat_blob, stylesheet",
	cards: "++id, collection_id, name, description, portrait_blob, cost, attack, life",
})

db.version(2).stores({
	collections: "++id, name, icon_blob, stat_blob, style",
	cards: "++id, collection_id, name, archetypes, description, portrait_blob, cost, attack, life",
}).upgrade(async (tx) => {
	await tx.table<Migrate<CardTableV1, CardTable>>("cards").toCollection().modify((card) => {
		card.archetypes = "";
	});
	await tx.table<Migrate<CollectionTableV1, CollectionTable>>("collections").toCollection().modify((collection) => {
		collection.style = {
			background: { type: "color", value: "black" },
			border_color: "white",
			color: "white",
		};
		delete collection.stylesheet;
	});
})
