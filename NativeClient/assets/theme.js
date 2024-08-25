import { configureFonts } from "react-native-paper";

const fontConfig = {
  header: { fontSize: 24, fontFamily: "pd-semibold" },
  headerSmaller: { fontSize: 20, fontFamily: "p-semibold", textAlign: "center" }, //Welcome rarev
  postTitle: { fontSize: 24, lineHeight: 30, fontFamily: "p-bold" },
  postBody: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "p-regular",
  },
  commentBody: {},

  textInput: {
    fontSize: 15,
    fontFamily: "p-medium",
  },

  textLarge: { fontSize: 20, fontFamily: "pd-regular", textAlign: "center" },
  textLargeBold: { fontSize: 20, fontFamily: "pd-semibold" }, //posts
  textSemiLarge: { fontSize: 18, fontFamily: "p-regular" }, //comments
  textSemiLargeBold: { fontSize: 18, fontFamily: "p-semibold" }, //comments
  textMedium: { fontSize: 16, fontFamily: "p-regular" }, //username
  textMediumBold: { fontSize: 16, fontFamily: "p-semibold" }, //
  textSmall: { fontSize: 14, fontFamily: "p-regular" }, // errors
  textSmallBold: { fontSize: 14, fontFamily: "p-semibold" }, //
  textExtraSmall: { fontSize: 12, fontFamily: "p-regular" }, //timestamp
  textExtraSmallBold: { fontSize: 12, fontFamily: "p-semibold" }, //

  surfaceHeader: {},
};

export default theme = {
  dark: true,
  roundness: 4,
  version: 3,
  isV3: true,
  colors: {
    primary: "rgb(31, 28, 31)",
    onPrimary: "rgb(233, 233, 233)",
    onPrimaryDisabled: "rgb(148, 148, 148)",
    onPrimaryLighter: "rgb(202, 202, 202)",
    primaryContainer: "rgb(23, 19, 23)",
    onPrimaryContainer: "rgb(233, 233, 233)",

    secondary: null,
    onSecondary: null,
    secondaryContainer: null,
    onSecondaryContainer: null,
    tertiary: null,
    tertiaryContainer: null,

    surface: "rgb(31, 28, 31)",
    onSurface: "rgb(233, 233, 233)",
    onSurfaceLighter: "rgb(202, 202, 202)",
    surfaceContainer: "rgb(23, 19, 23)",
    onSurfaceContainer: "rgb(233, 233, 233)",

    inverseSurface: null,
    inverseOnSurface: null,

    surfaceVariant: null,
    surfaceDisabled: null,

    accent: "rgb(212, 23, 23)",

    background: "rgb(23, 19, 23)",
    onBackground: "rgb(233, 233, 233)",
    onBackgroundLighter: "rgb(202, 202, 202)",

    error: null,
    onError: "rgb(255, 10, 10)",
    errorContainer: null,
    onTertiary: null,
    onTertiaryContainer: null,
    onSurfaceVariant: null,
    onSurfaceDisabled: null,
    onErrorContainer: null,
    outline: null,
    outlineVariant: null,
    inversePrimary: null,
    shadow: null,
    scrim: null,
    backdrop: null,
    success: "rgb(0, 255, 0)",
    onSuccess: "rgb(0, 255, 0)",
    elevation: {
      level0: null,
      level1: null,
      level2: null,
      level3: null,
      level4: null,
      level5: null,
    },
  },
  fonts: fontConfig,
  animation: {
    scale: null,
  },
};
