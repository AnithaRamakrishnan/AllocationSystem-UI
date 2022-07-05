import { createTheme } from "@mui/material/styles";
import { red, green } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: "#556cd6",
    },
    secondary: {
      main: "#19857b",
    },
    progress: {
      main: "#ff5722",
    },
    error: {
      main: red.A400,
    },
    colors: {
      red,
      green,
    }
  },
  typography: {
		fontFamily: [
			'Roboto',
			'Open Sans',
			'"Segoe UI"',
			'"Helvetica Neue"',
			'Arial',
		].join(','),
		htmlFontSize: 16,
  },
});

export default theme;
