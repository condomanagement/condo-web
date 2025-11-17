import { styled } from '@mui/material/styles';
import { makeStyles as tssMakeStyles } from 'tss-react/mui';

export const makeStyles = tssMakeStyles;
export { useTheme } from '@mui/material/styles';

// For createStyles - tss-react doesn't need it, just return the styles as-is
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createStyles = <T extends Record<string, any>>(styles: T) => styles;

// withStyles replacement using styled API
// In old MUI: withStyles(styles)(Component)
// In new MUI: styled(Component)(styles)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const withStyles = (stylesFn: (theme: any) => any) => (Component: any) => styled(Component)(({ theme }) => {
  const styles = stylesFn(theme);

  // Handle head/body pattern for TableCell
  if (styles.head || styles.body) {
    return {
      '&.MuiTableCell-head': styles.head || {},
      '&.MuiTableCell-body': styles.body || {},
    };
  }

  // Handle root pattern
  if (styles.root) {
    return styles.root;
  }

  // Return all styles
  return styles;
});
