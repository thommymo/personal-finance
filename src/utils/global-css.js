import { injectGlobal } from 'styled-components';
import { theme } from './theme'

injectGlobal`
  @import url(${theme.font.url});

  body:before {
    height: 100vh;
    display:block;
  }
  html, body {
    margin: 0;
    padding: 0;
    font-family: ${`${theme.font.fontFamily}, ${theme.font.serif}`};
    font-weight: 200;
    font-size: 100%;
    height: 100%;
    background-color: white; /*{white}*/
  }
`
