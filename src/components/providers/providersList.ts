import { TProvider } from "./Providers";
import TanstackQueryProvider from "./TanstackQueryProvider";
import { ThemeProvider } from "./ThemeProvider";

export const providersList: TProvider[] = [
  TanstackQueryProvider,
  ThemeProvider,
]; //add providers here
