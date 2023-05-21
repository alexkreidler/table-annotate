import {theme as defaultTheme, extendTheme} from '@chakra-ui/react';

const custom = {
    fonts: {
        heading: 'Inter, sans-serif',
        body: 'Inter, sans-serif'
    }
}

export const theme = extendTheme(defaultTheme, custom)