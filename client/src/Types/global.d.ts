import { GlobalThemeType } from 'src/Styles/GlobalTheme';

declare global {
  namespace Jss {
    export interface Theme extends GlobalThemeType {}
  }
}
