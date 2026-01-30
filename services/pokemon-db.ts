import type { SQLiteDatabase } from "expo-sqlite";
import type { Pokemon } from "./pokeapi";

export async function getPokemonFromDb(
  db: SQLiteDatabase,
  pokemonId: number
): Promise<Pokemon | null> {
  const pokemon = await db.getFirstAsync<{
    id: number;
    name: string;
    order_num: number;
    sprite_back_default: string | null;
    sprite_back_female: string | null;
    sprite_back_shiny: string | null;
    sprite_back_shiny_female: string | null;
    sprite_front_default: string | null;
    sprite_front_female: string | null;
    sprite_front_shiny: string | null;
    sprite_front_shiny_female: string | null;
    sprite_front_animated: string | null;
  }>("SELECT * FROM pokemons WHERE id = ?", pokemonId);

  if (!pokemon) return null;

  const types = await db.getAllAsync<{
    slot: number;
    type_name: string;
  }>("SELECT slot, type_name FROM pokemon_types WHERE pokemon_id = ?", pokemonId);

  const stats = await db.getAllAsync<{
    stat_name: string;
    base_stat: number;
  }>("SELECT stat_name, base_stat FROM pokemon_stats WHERE pokemon_id = ?", pokemonId);

  return {
    id: pokemon.id,
    name: pokemon.name,
    order: pokemon.order_num,
    sprites: {
      back_default: pokemon.sprite_back_default ?? "",
      back_female: pokemon.sprite_back_female ?? "",
      back_shiny: pokemon.sprite_back_shiny ?? "",
      back_shiny_female: pokemon.sprite_back_shiny_female ?? "",
      front_default: pokemon.sprite_front_default ?? "",
      front_female: pokemon.sprite_front_female ?? "",
      front_shiny: pokemon.sprite_front_shiny ?? "",
      front_shiny_female: pokemon.sprite_front_shiny_female ?? "",
      front_animated: pokemon.sprite_front_animated ?? "",
    },
    types: types.map((t) => ({ slot: t.slot, type: { name: t.type_name } })),
    stats: stats.map((s) => ({ base_stat: s.base_stat, stat: { name: s.stat_name } })),
  };
}

export async function getPokemonsFromDb(
  db: SQLiteDatabase,
  limit: number,
  offset: number
): Promise<Pokemon[]> {
  const pokemons = await db.getAllAsync<{ id: number }>(
    "SELECT id FROM pokemons ORDER BY id LIMIT ? OFFSET ?",
    limit,
    offset
  );

  const results: Pokemon[] = [];
  for (const { id } of pokemons) {
    const pokemon = await getPokemonFromDb(db, id);
    if (pokemon) results.push(pokemon);
  }

  return results;
}

export async function getPokemonCountFromDb(db: SQLiteDatabase): Promise<number> {
  const result = await db.getFirstAsync<{ count: number }>(
    "SELECT COUNT(*) as count FROM pokemons"
  );
  return result?.count ?? 0;
}

export async function savePokemonToDb(
  db: SQLiteDatabase,
  pokemon: Pokemon
): Promise<void> {
  await db.runAsync(
    `INSERT OR REPLACE INTO pokemons (
      id, name, order_num,
      sprite_back_default, sprite_back_female, sprite_back_shiny, sprite_back_shiny_female,
      sprite_front_default, sprite_front_female, sprite_front_shiny, sprite_front_shiny_female,
      sprite_front_animated
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    pokemon.id,
    pokemon.name,
    pokemon.order,
    pokemon.sprites.back_default,
    pokemon.sprites.back_female,
    pokemon.sprites.back_shiny,
    pokemon.sprites.back_shiny_female,
    pokemon.sprites.front_default,
    pokemon.sprites.front_female,
    pokemon.sprites.front_shiny,
    pokemon.sprites.front_shiny_female,
    pokemon.sprites.front_animated
  );

  // Delete existing types and stats before inserting
  await db.runAsync("DELETE FROM pokemon_types WHERE pokemon_id = ?", pokemon.id);
  await db.runAsync("DELETE FROM pokemon_stats WHERE pokemon_id = ?", pokemon.id);

  for (const typeSlot of pokemon.types) {
    await db.runAsync(
      "INSERT INTO pokemon_types (pokemon_id, slot, type_name) VALUES (?, ?, ?)",
      pokemon.id,
      typeSlot.slot,
      typeSlot.type.name
    );
  }

  for (const stat of pokemon.stats) {
    await db.runAsync(
      "INSERT INTO pokemon_stats (pokemon_id, stat_name, base_stat) VALUES (?, ?, ?)",
      pokemon.id,
      stat.stat.name,
      stat.base_stat
    );
  }
}

export async function savePokemonsToDb(
  db: SQLiteDatabase,
  pokemons: Pokemon[]
): Promise<void> {
  for (const pokemon of pokemons) {
    await savePokemonToDb(db, pokemon);
  }
}
