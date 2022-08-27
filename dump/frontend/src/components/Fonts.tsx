import { Global } from '@emotion/react'

const Fonts = () => {

  return <Global styles={`
    @font-face {
      font-family: 'Satoshi-Bold';
      src: url('./fonts/Satoshi-Bold.woff2') format('woff2'),
           url('./fonts/Satoshi-Bold.woff') format('woff'),
           url('./fonts/Satoshi-Bold.ttf') format('truetype');
      font-weight: 700;
      font-display: swap;
      font-style: normal;
    }
    @font-face {
      font-family: 'Satoshi-Regular';
      src: url('./fonts/Satoshi-Regular.woff2') format('woff2'),
           url('./fonts/Satoshi-Regular.woff') format('woff'),
           url('./fonts/Satoshi-Regular.ttf') format('truetype');
      font-weight: 400;
      font-display: swap;
      font-style: normal;
    }
  `}/>;
}

export default Fonts