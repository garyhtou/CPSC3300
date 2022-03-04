import Head from 'next/head';
import '../styles/globals.css';
import '@fontsource/roboto';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../styles/theme';
import { ThemeProvider } from '@mui/material/styles';

function MyApp({ Component, pageProps }) {
	const siteName = 'CPSC 3300 PDA6 — Gary Tou & Castel Villalobos';
	return (
		<>
			<Head>
				<meta
					name='viewport'
					content='minimum-scale=1, initial-scale=1, width=device-width'
				/>
				<meta httpEquiv='content-language' content='en' />
				<title>{siteName}</title>
				<meta property='og:site_name' content={siteName} key='ogsitename' />
			</Head>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<Component {...pageProps} />
			</ThemeProvider>
		</>
	);
}

export default MyApp;
