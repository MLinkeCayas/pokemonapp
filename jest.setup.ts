import "@testing-library/jest-native/extend-expect";

// Silence the warning: "useNativeDriver is not supported..."
jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper", () => ({}), {
  virtual: true,
});

// Reanimated mock recommended for Jest.
jest.mock("react-native-reanimated", () =>
  require("react-native-reanimated/mock"),
);
