import {
  getPokemonById,
  getPokemonsInfinite,
  Pokemon,
} from "@/services/pokeapi";
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export function usePokemon(pokemonId: number) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ["pokemon", pokemonId],
    queryFn: () => getPokemonById(pokemonId),
    initialData: () => {
      const infiniteQueries = queryClient.getQueriesData<{
        pages: { items: Pokemon[] }[];
      }>({
        queryKey: ["pokemons"],
      });

      for (const [, data] of infiniteQueries) {
        if (data) {
          for (const page of data.pages) {
            const pokemon = page.items.find((p) => p.id === pokemonId);
            if (pokemon) {
              return pokemon;
            }
          }
        }
      }
      return undefined;
    },
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
