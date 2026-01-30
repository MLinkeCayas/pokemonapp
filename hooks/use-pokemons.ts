import {
  getPokemonById,
  getPokemonsInfinite,
  Pokemon,
} from "@/services/pokeapi";
import {
  getPokemonCountFromDb,
  getPokemonFromDb,
  getPokemonsFromDb,
  savePokemonsToDb,
  savePokemonToDb,
} from "@/services/pokemon-db";
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { SQLiteDatabase, useSQLiteContext } from "expo-sqlite";
import { useEffect, useRef } from "react";

const TOTAL_POKEMON = 1025;
const INITIAL_BATCH_SIZE = 50;
const BACKGROUND_BATCH_SIZE = 50;
const PAGE_SIZE = 20;

async function preloadPokemons(
  db: SQLiteDatabase,
  onProgress?: (loaded: number, total: number) => void,
) {
  const currentCount = await getPokemonCountFromDb(db);

  if (currentCount >= TOTAL_POKEMON) {
    return; // Already fully loaded
  }

  // Start from where we left off
  let offset = currentCount;

  while (offset < TOTAL_POKEMON) {
    const batchSize = Math.min(BACKGROUND_BATCH_SIZE, TOTAL_POKEMON - offset);

    try {
      const result = await getPokemonsInfinite(batchSize, offset);
      await savePokemonsToDb(db, result.items);
      offset += result.items.length;
      onProgress?.(offset, TOTAL_POKEMON);

      if (!result.nextCursor) break;
    } catch {
      // Network error - stop preloading but don't crash
      console.log("Preload paused - network unavailable");
      break;
    }
  }
}

export function usePokemon(pokemonId: number) {
  const queryClient = useQueryClient();
  const db = useSQLiteContext();

  return useQuery({
    queryKey: ["pokemon", pokemonId],
    queryFn: async () => {
      // Check database first
      const cachedPokemon = await getPokemonFromDb(db, pokemonId);
      if (cachedPokemon) {
        return cachedPokemon;
      }

      // Fetch from API and save to database
      const pokemon = await getPokemonById(pokemonId);
      await savePokemonToDb(db, pokemon);
      return pokemon;
    },
    initialData: () => {
      const queries = queryClient.getQueriesData<{
        pages: { items: Pokemon[]; nextCursor?: number }[];
      }>({
        queryKey: ["pokemons"],
      });

      for (const [, data] of queries) {
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

export function usePokemons() {
  const db = useSQLiteContext();
  const queryClient = useQueryClient();
  const preloadStarted = useRef(false);

  const query = useInfiniteQuery({
    queryKey: ["pokemons"],
    initialPageParam: 0,
    queryFn: async ({ pageParam: offset }) => {
      const dbCount = await getPokemonCountFromDb(db);

      // If we need data beyond what's in the DB, fetch from API first
      if (offset + PAGE_SIZE > dbCount && dbCount < TOTAL_POKEMON) {
        // Fetch initial batch if database is empty or nearly empty
        const fetchSize = Math.max(INITIAL_BATCH_SIZE, PAGE_SIZE);
        const result = await getPokemonsInfinite(fetchSize, dbCount);
        await savePokemonsToDb(db, result.items);
      }

      // Now load from database
      const pokemons = await getPokemonsFromDb(db, PAGE_SIZE, offset);
      const newDbCount = await getPokemonCountFromDb(db);

      return {
        items: pokemons,
        nextCursor:
          offset + PAGE_SIZE < newDbCount ? offset + PAGE_SIZE : undefined,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  // Start background preloading after initial data is loaded
  useEffect(() => {
    if (query.data && !preloadStarted.current) {
      preloadStarted.current = true;

      preloadPokemons(db, (loaded) => {
        // Invalidate to allow fetching more pages when data is available
        if (loaded % 100 === 0 || loaded === TOTAL_POKEMON) {
          queryClient.invalidateQueries({ queryKey: ["pokemons"] });
        }
      });
    }
  }, [query.data, db, queryClient]);

  return query;
}
