const baseUri = "https://pokeapi.co/api/v2/pokemon";

export interface Stat {
  name: string;
}

export interface StatValue {
  base_stat: number;
  stat: Stat;
}

export interface Type {
  name: string;
}

export interface TypeSlot {
  slot: number;
  type: Type;
}

export interface Sprites {
  back_default: string;
  back_female: string;
  back_shiny: string;
  back_shiny_female: string;
  front_default: string;
  front_female: string;
  front_shiny: string;
  front_shiny_female: string;
}

export interface Pokemon {
  id: number;
  name: string;
  order: number;
  sprites: Sprites;
  types: TypeSlot[];
  stats: StatValue[];
}

interface PokemonRef {
  name: string;
  url: string;
}
interface GetPokemonsResult {
  results: PokemonRef[];
  next: string | null;
}

export async function getPokemonById(pokemonId: number) {
  return getPokemon(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
}

export async function getPokemon(url: string): Promise<Pokemon> {
  const response = await fetch(url);

  if (!response.ok) throw new Error("Not ok");

  const result = await response.json();

  return {
    id: result.id,
    name: result.name,
    order: result.order,
    sprites: {
      back_default: result.sprites.back_default,
      back_female: result.sprites.back_female,
      back_shiny: result.sprites.back_shiny,
      back_shiny_female: result.sprites.back_shiny_female,
      front_default: result.sprites.front_default,
      front_female: result.sprites.front_female,
      front_shiny: result.sprites.front_shiny,
      front_shiny_female: result.sprites.front_shiny_female,
    },
    types: result.types.map((type: any) => ({
      slot: type.slot,
      type: { name: type.type.name },
    })),
    stats: result.stats.map((stat: any) => ({
      base_stat: stat.base_stat,
      stat: { name: stat.stat.name },
    })),
  } as Pokemon;
}

export async function getPokemons(pageSize: number, page: number) {
  const uri = `${baseUri}?limit=${pageSize}&offset=${page * pageSize}`;

  const response = await fetch(uri);

  if (!response.ok) throw new Error("Not ok");

  const result: GetPokemonsResult = await response.json();

  const pokemons = await Promise.all(
    result.results.map((pokemonRef) =>
      getPokemon(pokemonRef.url).catch((error) => {
        console.error(error);
        return null;
      }),
    ),
  );

  return pokemons.filter((pokemon) => pokemon !== null);
}

export async function getPokemonsInfinite(pageSize: number, page: number) {
  const uri = `${baseUri}?limit=${pageSize}&offset=${page * pageSize}`;

  const response = await fetch(uri);

  if (!response.ok) throw new Error("Not ok");

  const result: GetPokemonsResult = await response.json();

  const pokemons = await Promise.all(
    result.results.map((pokemonRef) =>
      getPokemon(pokemonRef.url).catch((error) => {
        console.error(error);
        return null;
      }),
    ),
  );

  const filteredPokemons = pokemons.filter((pokemon) => pokemon !== null);

  let nextCursor: number | undefined;
  if (result.next) {
    const u = new URL(result.next);
    const nextOffset = Number(u.searchParams.get("offset"));
    nextCursor = nextOffset;
  }

  return { items: filteredPokemons, nextCursor };
}

/*
getPokemons(10, 0)
  .then((result) => console.log(JSON.stringify(result, null, 2)))
  .catch(console.error);
*/
