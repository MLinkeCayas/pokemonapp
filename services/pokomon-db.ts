import { drizzle } from "drizzle-orm/expo-sqlite";
import * as SQLite from "expo-sqlite";
import * as schema from "./db-schema";
import { pokemonTable } from "./db-schema";
import { getPokemonsInfinite } from "./pokeapi";

const expo = SQLite.openDatabaseSync("pokemon.db");
export const db = drizzle(expo, { schema });
export let databaseFilled = false;

export async function fillDatabase() {
  let pokemons = await getPokemonsInfinite(20, 0);
  while (true) {
    for (const pokemon of pokemons.items) {
      await db
        .insert(pokemonTable)
        .values({
          id: pokemon.id,
          name: pokemon.name,
          order: pokemon.order,
          sprites: JSON.stringify(pokemon.sprites),
          types: JSON.stringify(pokemon.types),
          stats: JSON.stringify(pokemon.stats),
        })
        .onConflictDoNothing();
    }
    console.log("Filled", pokemons.items.length, "pokemons into database");
    if (pokemons.nextCursor !== undefined) {
      pokemons = await getPokemonsInfinite(20, pokemons.nextCursor);
    } else {
      break;
    }
  }
  databaseFilled = true;
  console.log("Database filled");
}
