const baseUri = 'https://pokeapi.co/api/v2/pokemon'

export interface Stat {
  name: string
}

export interface StatValue {
  base_stat: number,
  stat: Stat
}

export interface Type {
  name: string
}

export interface TypeSlot {
  slot: number,
  type: Type
}

export interface Sprites {
  back_default: string,
  back_female: string,
  back_shiny: string,
  back_shiny_female: string,
  front_default: string,
  front_female: string,
  front_shiny: string,
  front_shiny_female: string
}

export interface Pokemon {
  name: string,
  order: number,
  sprites: Sprites,
  types: TypeSlot[],
  stats: StatValue[]
}

interface PokemonRef {
  name: string,
  url: string
}
interface GetPokemonsResult {
  results: PokemonRef[]
}

async function getPokemon(url: string) : Promise<Pokemon> {
  const response = await fetch(url)

  if(!response.ok) throw new Error("Not ok")

  const json = await response.json()
  const result: Pokemon = JSON.parse(JSON.stringify(json))

  return result
}

export async function getPokemons(pageSize: number, page: number) {
  const uri = `${baseUri}?limit=${pageSize}&offset=${page*pageSize}`

  const response = await fetch(uri)

  if(!response.ok) throw new Error("Not ok")

  const json = await response.json()
  const result: GetPokemonsResult = JSON.parse(JSON.stringify(json))

  const pokemons = await Promise.all(result.results.map(pokemonRef => getPokemon(pokemonRef.url)))

  return pokemons
}