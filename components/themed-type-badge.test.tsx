import { render } from "@testing-library/react-native";
import { ThemedTypeBadge } from "./themed-type-badge";

describe("ThemedTypeBadge", () => {
  it("renders the pokemon type label and uses its type color", () => {
    const { getByText, getByTestId } = render(
      <ThemedTypeBadge pokemonType="fire" />,
    );

    const text = getByText("FIRE");
    expect(text).toBeTruthy();

    // The badge background is applied by `ThemedView`.
    expect(getByTestId("type-badge-fire")).toHaveStyle({
      backgroundColor: "#EE8130",
    });
  });
});
