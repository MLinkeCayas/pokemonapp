import { fireEvent, screen } from "@testing-library/react-native";
import { renderRouter } from "expo-router/testing-library";

import PokemonListScreen from "@/app/index";
import PokemonDetailScreen from "@/app/pokemon/[id]";

jest.mock("@/hooks/use-pokemons", () => {
  return {
    usePokemons: () => ({
      data: [
        {
          id: 1,
          name: "bulbasaur",
          order: 1,
          sprites: { front_default: "https://example.com/1.png" },
          types: [{ slot: 1, type: { name: "grass" } }],
          stats: [],
        },
      ],
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

    fireEvent.press(screen.getByText("bulbasaur"));
    expect(await screen.findByText("Detail of Pokemon 1")).toBeTruthy();
  });
});
