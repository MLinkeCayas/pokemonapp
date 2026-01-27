import { getPokemons } from "@/services/pokeapi";
import { useQuery } from "@tanstack/react-query";

export function usePokemons(pageSize: number, page: number) {
  return useQuery({
    queryKey: ["pokemons", pageSize, page],
    queryFn: () => getPokemons(pageSize, page),
  });
}
