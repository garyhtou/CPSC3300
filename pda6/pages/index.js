import {
	AppBar,
	Typography,
	Toolbar,
	Box,
	IconButton,
	MenuIcon,
	Menu,
	Tooltip,
	Avatar,
	Card,
	CardContent,
	CardActions,
	Button,
} from '@mui/material';
import Container from '@mui/material/Container';
import Customers from '../components/customers';

const Homepage = () => {
	const appName = 'PDA6';

	return (
		<>
			<AppBar position='sticky'>
				<Container maxWidth='xl'>
					<Toolbar disableGutters>
						<Typography
							variant='h6'
							noWrap
							component='div'
							sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
						>
							{appName}
						</Typography>

						<Typography
							variant='h6'
							noWrap
							component='div'
							sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
						>
							{appName}
						</Typography>
						<Box sx={{ flexGrow: 2, display: 'flex', flexDirection: 'row' }}>
							Developed by{' '}
							<Tooltip title='Gary Tou'>
								<Avatar
									alt='Gary Tou'
									src='http://assets.garytou.com/profile/GaryTou.jpg'
								/>
							</Tooltip>
							Gary Tou and
							<Tooltip title='Castel Villalobos'>
								<Avatar
									alt='Castel Villalobos'
									src='http://assets.garytou.com/profile/GaryTou.jpg'
								/>
							</Tooltip>
							Castel Villalobos
						</Box>
					</Toolbar>
				</Container>
			</AppBar>
			<Container maxWidth='md'>
				<Typography variant='h1'>PDA 6</Typography>
				<Card>
					<CardContent>
						<Typography variant='h4' color='text.secondary' gutterBottom>
							List Customers
						</Typography>
						<Typography>The information regarding customers.</Typography>
						<Customers />
					</CardContent>
					<CardActions>
						<Button size='small'>Learn More</Button>
					</CardActions>
				</Card>
			</Container>
		</>
	);
};

export default Homepage;
