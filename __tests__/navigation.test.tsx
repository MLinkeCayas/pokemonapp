import { fireEvent, screen } from "@testing-library/react-native";
import { renderRouter } from "expo-router/testing-library";

import PokemonListScreen from "@/app/index";
import PokemonDetailScreen from "@/app/pokemon/[id]";

const mockPokemon = {
  id: 1,
  name: "bulbasaur",
  order: 1,
  sprites: { front_default: "https://example.com/1.png" },
  types: [{ slot: 1, type: { name: "grass" } }],
  stats: [{ base_stat: 45, stat: { name: "hp" } }],
};

jest.mock("@/hooks/use-pokemons", () => {
  return {
    usePokemons: () => ({
      data: {
        pages: [{ items: [mockPokemon], nextCursor: undefined }],
      },
      isLoading: false,
      error: null,
      fetchNextPage: jest.fn(),
      hasNextPage: false,
    }),
    usePokemon: () => ({
      data: mockPokemon,
      isLoading: false,
      error: null,
    }),
  };
});

describe("navigation flow", () => {
  it("navigates from list to detail when tapping a pokemon", async () => {
    renderRouter(
      {
        index: PokemonListScreen,
        "pokemon/[id]": PokemonDetailScreen,
      },
      { initialUrl: "/" },
    );

    fireEvent.press(screen.getByText("Bulbasaur"));
    expect(await screen.findByText("# 1 BULBASAUR")).toBeTruthy();
  });
});
