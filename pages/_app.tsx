import "../styles/globals.css";
import type { AppProps } from "next/app";
import "@glideapps/glide-data-grid/dist/index.css";

import { ChakraProvider } from '@chakra-ui/react'
function CSSstring(string) {
  const css_json = `{"${string
    .replace(/; /g, '", "')
    .replace(/: /g, '": "')
    .replace(";", "")}"}`;

  const obj = JSON.parse(css_json);

  const keyValues = Object.keys(obj).map((key) => {
    var camelCased = key.replace(/-[a-z]/g, (g) => g[1].toUpperCase());
    return { [camelCased]: obj[key] };
  });
  return Object.assign({}, ...keyValues);
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <Component {...pageProps} />
      <div
        id="portal"
        style={CSSstring("position: fixed; left: 0; top: 0; z-index: 9999;")}
      />
    </ChakraProvider>
  );
}
