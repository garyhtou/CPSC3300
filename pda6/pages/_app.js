import Head from 'next/head';
import '../styles/globals.css';
import '@fontsource/roboto';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../styles/theme';
import { ThemeProvider } from '@material-ui/core/styles';

function MyApp({ Component, pageProps }) {
	return (
		<>
			<Head>
				<meta
					name='viewport'
					content='minimum-scale=1, initial-scale=1, width=device-width'
				/>
				<meta httpEquiv='content-language' content='en' />
				<meta
					property='og:site_name'
					content="Gary Tou's Assets"
					key='ogsitename'
				/>
			</Head>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<Component {...pageProps} />
			</ThemeProvider>
		</>
	);
}

export default MyApp;
