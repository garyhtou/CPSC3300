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
	AvatarGroup,
} from '@mui/material';
import Container from '@mui/material/Container';
import Playground from '../components/playground';

const Homepage = () => {
	const appName = 'PDA6';

	const queries = [
		{
			title: 'Tables',
			description: 'List table names and their attributes (using DESCRIBE).',
			endpoint: 'tables',
			method: 'GET',
			columns: [
				{ field: 'Field', headerName: 'Field', flex: 1 },
				{
					field: 'Type',
					headerName: 'Type',
					flex: 1,
				},
				{
					field: 'Null',
					headerName: 'Null',
					flex: 0.2,
				},
				{
					field: 'Key',
					headerName: 'Key',
					flex: 0.3,
				},
				{
					field: 'Default',
					headerName: 'Default',
					flex: 0.3,
				},
				{
					field: 'Extra',
					headerName: 'Extra',
					flex: 0.5,
				},
			],
			multiTable: true,
			idKey: 'Field',
		},
		{
			title: 'Customers',
			description: 'The information regarding customers.',
			endpoint: 'customers',
			method: 'GET',
			columns: [
				{ field: 'id', headerName: 'ID', minWidth: 40 },
				{
					field: 'name',
					headerName: 'Name',
					flex: 0.8,
				},
				{
					field: 'email',
					headerName: 'Email',
					flex: 1,
				},
				{
					field: 'phone',
					headerName: 'Phone',
					flex: 0.8,
				},
			],
			params: {
				limit: {
					default: 25,
					editable: true,
				},
			},
		},
		{
			title: 'Menu Items',
			description: 'The information regarding the available Items on the menu.',
			endpoint: 'items',
			method: 'GET',
			columns: [
				{ field: 'id', headerName: 'ID', minWidth: 40 },
				{
					field: 'name',
					headerName: 'Name',
					flex: 0.8,
				},
				{
					field: 'price',
					headerName: 'Price',
					flex: 1,
				},
				{
					field: 'calories',
					headerName: 'Calories',
					flex: 0.8,
				},
			],
			params: {
				limit: {
					default: 25,
					editable: true,
				},
			},
		},
		{
			title: 'Orders',
			description:
				'Find customers whose name matches your input, and list their information and orders.',
			endpoint: 'orders',
			method: 'GET',
			columns: [
				{
					field: 'date',
					headerName: 'Date',
					flex: 0.5,
				},
				{ field: 'order_id', headerName: 'Order ID', minWidth: 40 },
				{ field: 'store_id', headerName: 'Store ID', minWidth: 40 },
				{
					field: 'customer_id',
					headerName: 'Customer ID',
					minWidth: 40,
				},
				{
					field: 'name',
					headerName: 'Name',
					flex: 0.8,
				},
				{
					field: 'email',
					headerName: 'Email',
					flex: 1,
				},
				{
					field: 'phone',
					headerName: 'Phone',
					flex: 0.6,
				},
			],
			params: {
				name: {
					default: '',
					editable: true,
				},
				limit: {
					default: 25,
					editable: true,
				},
			},
			idKey: 'order_id',
		},
		{
			title: 'Average Calories',
			description:
				'Calculate the average price of each Item, grouped by calories (in 100 intervals).',
			endpoint: 'calories',
			method: 'GET',
			columns: [
				{ field: 'calories', headerName: 'Calories', flex: 1 },
				{
					field: 'average_price',
					headerName: 'Average Price',
					flex: 2,
				},
			],
			params: {
				limit: {
					default: 25,
					editable: true,
				},
			},
			idKey: 'calories',
		},
		{
			title: 'Create a Customer',
			description: 'Are you intersted in being a Customer? Sign up!',
			height: 200,
			endpoint: 'customers',
			method: 'POST',
			columns: [
				{ field: 'status', headerName: 'Status', flex: 0.4 },
				{
					field: 'customer_id',
					headerName: 'Customer ID',
					flex: 0.5,
				},
				{
					field: 'name',
					headerName: 'Name',
					flex: 0.8,
				},
				{
					field: 'email',
					headerName: 'Email',
					flex: 1,
				},
				{
					field: 'phone',
					headerName: 'Phone',
					flex: 0.6,
				},
			],
			params: {
				name: {
					default: 'John',
					editable: true,
				},
				email: {
					default: '',
					editable: true,
				},
				phone: {
					default: '',
					editable: true,
				},
			},
			idKey: 'customer_id',
		},
		{
			title: 'Rising Prices!',
			description:
				"It's time to update the price of items. Enter an Item ID and it's new Price.",
			height: 200,
			endpoint: 'items',
			method: 'PUT',
			columns: [
				{
					field: 'id',
					headerName: 'Item ID',
					flex: 0.2,
				},
				{
					field: 'name',
					headerName: 'Name',
					flex: 1.5,
				},
				{
					field: 'calories',
					headerName: 'Calories',
					flex: 0.5,
				},
				{
					field: 'price',
					headerName: 'Price',
					flex: 0.6,
				},
			],
			params: {
				id: {
					default: '',
					editable: true,
				},
				price: {
					default: 500,
					editable: true,
					price: true,
				},
			},
		},
		{
			title: 'Delete a Customer',
			description:
				"Provide a Customer ID to delete them. It's sad to see them go :(",
			height: 200,
			endpoint: 'customers',
			method: 'DELETE',
			columns: [{ field: 'status', headerName: 'Status', flex: 1 }],
			params: {
				id: {
					default: '',
					editable: true,
				},
			},
		},
	];

	return (
		<>
			<Container
				maxWidth='md'
				style={{ marginTop: '5rem', paddingBottom: '6rem' }}
			>
				<Typography variant='h1'>PDA 6</Typography>
				<Box
					display={'flex'}
					flexDirection={'row'}
					marginBottom={'0.5rem'}
					alignItems={'flex-end'}
				>
					<AvatarGroup style={{ paddingRight: '0.5rem' }}>
						<Tooltip title='Gary Tou'>
							<Avatar
								alt='Gary Tou'
								src='https://assets.garytou.com/profile/GaryTou.jpg'
							/>
						</Tooltip>
						<Tooltip title='Castel Villalobos'>
							<Avatar alt='Castel Villalobos' src='C' />
						</Tooltip>
					</AvatarGroup>
					<Typography variant='body2'>
						Developed by{' '}
						<Button variant='text' href='https://garytou.com' target={'_blank'}>
							Gary Tou
						</Button>{' '}
						and
						<Button
							variant='text'
							href='https://github.com/impropernoun'
							target={'_blank'}
						>
							Castel Villalobos
						</Button>{' '}
					</Typography>
				</Box>
				<Typography variant='body1'>
					An application that interacts with a database representing a fast food
					restaurants business rules.
				</Typography>
				{queries.map((query) => (
					<Card
						style={{ marginTop: '2rem' }}
						key={query.endpoint + query.method}
					>
						<CardContent>
							<Typography variant='h4' color='text.secondary' gutterBottom>
								{query.title}
							</Typography>
							<Typography>{query.description}</Typography>
							<Playground
								endpoint={query.endpoint}
								columns={query.columns}
								height={query.height}
								method={query.method}
								params={query.params}
								multiTable={query.multiTable}
								idKey={query.idKey}
							/>
						</CardContent>
					</Card>
				))}
				{/* Footer */}
			</Container>
		</>
	);
};

export default Homepage;
