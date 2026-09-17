import Dexie, { type EntityTable } from "dexie";
import { type Snippet } from "svelte";


export interface CollectionTable {
	id: number,

	name: string,
	icon_blob: string,
	stat_blob: string,

	stylesheet: string,
}

export interface CardTable {
	id: number,

	collection_id: number,

	name: string,
	description: string,
	portrait_blob: string,

	cost: number,
	attack: number,
	life: number,
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
