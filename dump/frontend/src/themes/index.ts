import { ComponentStyleConfig, extendTheme } from '@chakra-ui/react'

const backgroundColor = 'gray';
const mainColor = 'green';

const Button: ComponentStyleConfig = {
  baseStyle: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
    borderRadius: 'base',
    width: '12rem'
  },
  variants: {
    outline: {
      border: '2px solid',
      borderColor: mainColor + '.400',
      color: mainColor + '.400',
    },
  },
  defaultProps: {
    size: 'md',
    variant: 'outline',
  },
}

const Select: ComponentStyleConfig = {
  baseStyle: {
    borderColor: mainColor + '.400',
  },
  variants: {
    outline: {
      field: {
        _focus: {
          borderColor: mainColor + '.300',
          boxShadow: '0 0 0 1px'
        }
      }
    }
  },
}

const Textarea: ComponentStyleConfig = {
  baseStyle: {
    borderRadius: 'base',
    borderColor: mainColor,
  },
  variants: {
    outline: {
      _focus: {
        borderColor: mainColor + '.300',
        boxShadow: '0 0 0 1px'
      },
      _hover: {
        borderColor: mainColor + '.500',
      }
    }
  },
}

export const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false
  },
  styles: {
    global: {
      body: {
        bg: backgroundColor + '.800',
        color: mainColor + '.400',
      },
      'html, body, #__next': {
        height: "100%",
      },
      'main, main > div': {
        height: "80%",
      }
    }
  },
  components: {
    Button,
    Select,
    Textarea
  },
  fonts: {
    heading: 'Satoshi-Bold, sans-serif',
    body: 'Satoshi-Bold, sans-serif',
  },
})