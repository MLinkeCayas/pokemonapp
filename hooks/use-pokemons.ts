import {
  getPokemonById,
  getPokemons,
  getPokemonsInfinite,
} from "@/services/pokeapi";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

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

export function usePokemonsInfinite(pageSize: number, page: number) {
  return useInfiniteQuery({
    queryKey: ["pokemons", pageSize],
    initialPageParam: page,
    queryFn: ({ pageParam }) => getPokemonsInfinite(pageSize, pageParam),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
}
