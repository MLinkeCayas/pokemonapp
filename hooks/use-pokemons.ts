import { getPokemons } from "@/services/pokeapi";
import { useQuery } from "@tanstack/react-query";

export function usePokemons(pageSize: number, page: number) {
  return useQuery({
    queryKey: ["pokemons", pageSize, page],
    queryFn: () => getPokemons(pageSize, page),
  });
}

export function usePokemon(pokemonId: number) {
  return useQuery({
    queryKey: ["pokemon", pokemonId],
    queryFn: () => getPokemonById(pokemonId),
  });
}
