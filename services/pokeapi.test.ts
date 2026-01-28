import { getPokemons } from "./pokeapi";

function jsonResponse(body: unknown, ok = true) {
  return {
    ok,
    json: async () => body,
  } as Response;
}

describe("getPokemons", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it("fetches a page and resolves pokemon details", async () => {
    const fetchMock = jest
      .spyOn(global, "fetch")
      .mockImplementation(async (input: RequestInfo | URL) => {
        const url = input.toString();

        if (url.includes("https://pokeapi.co/api/v2/pokemon?")) {
          return jsonResponse({
            results: [
              {
                name: "bulbasaur",
                url: "https://pokeapi.co/api/v2/pokemon/1/",
              },
              { name: "ivysaur", url: "https://pokeapi.co/api/v2/pokemon/2/" },
            ],
          });
        }

        if (url.endsWith("/pokemon/1/")) {
          return jsonResponse({
            id: 1,
            name: "bulbasaur",
            order: 1,
            sprites: {
              back_default: "",
              back_female: "",
              back_shiny: "",
              back_shiny_female: "",
              front_default: "",
              front_female: "",
              front_shiny: "",
              front_shiny_female: "",
            },
            types: [{ slot: 1, type: { name: "grass" } }],
            stats: [{ base_stat: 45, stat: { name: "hp" } }],
          });
        }

        if (url.endsWith("/pokemon/2/")) {
          return jsonResponse({
            id: 2,
            name: "ivysaur",
            order: 2,
            sprites: {
              back_default: "",
              back_female: "",
              back_shiny: "",
              back_shiny_female: "",
              front_default: "",
              front_female: "",
              front_shiny: "",
              front_shiny_female: "",
            },
            types: [{ slot: 1, type: { name: "grass" } }],
            stats: [{ base_stat: 60, stat: { name: "hp" } }],
          });
        }

        throw new Error(`Unexpected fetch URL in test: ${url}`);
      });

    const result = await getPokemons(10, 0);

    expect(fetchMock).toHaveBeenCalled();
    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({ id: 1, name: "bulbasaur" });
    expect(result[1]).toMatchObject({ id: 2, name: "ivysaur" });
  });

  it("filters out pokemon detail fetch failures (returns remaining)", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    jest
      .spyOn(global, "fetch")
      .mockImplementation(async (input: RequestInfo | URL) => {
        const url = input.toString();

        if (url.includes("https://pokeapi.co/api/v2/pokemon?")) {
          return jsonResponse({
            results: [
              {
                name: "bulbasaur",
                url: "https://pokeapi.co/api/v2/pokemon/1/",
              },
              {
                name: "missingno",
                url: "https://pokeapi.co/api/v2/pokemon/999999/",
              },
            ],
          });
        }

        if (url.endsWith("/pokemon/1/")) {
          return jsonResponse({
            id: 1,
            name: "bulbasaur",
            order: 1,
            sprites: {
              back_default: "",
              back_female: "",
              back_shiny: "",
              back_shiny_female: "",
              front_default: "",
              front_female: "",
              front_shiny: "",
              front_shiny_female: "",
            },
            types: [{ slot: 1, type: { name: "grass" } }],
            stats: [{ base_stat: 45, stat: { name: "hp" } }],
          });
        }

        // Simulate a non-ok response for the second pokemon fetch.
        return jsonResponse({}, false);
      });

    const result = await getPokemons(10, 0);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ id: 1, name: "bulbasaur" });

    consoleErrorSpy.mockRestore();
  });
});
