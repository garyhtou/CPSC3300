import {
	Alert,
	Box,
	Button,
	Grid,
	Paper,
	Stack,
	Typography,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useState } from 'react';
import axios from 'axios';

export default function Customers() {
	const customerApi = '/api/customers';

	const [customers, setCustomers] = useState(null);
	const [error, setError] = useState(null);

	const handleClick = async () => {
		try {
			const cus = await axios.get(customerApi);
			const data = cus.data;
			console.log(data);

			if (data.error) {
				setError(data.error.message || 'Whoops! A server error occurred.');
			}
			setCustomers(cus.data.results);
		} catch (error) {
			console.log(error);
			setError('Whoops! An api error occurred.');
		}
	};

	const columns = [
		{ field: 'id', headerName: 'ID', width: 90 },
		{
			field: 'name',
			headerName: 'Name',
			width: 150,
		},
		{
			field: 'email',
			headerName: 'Email',
			width: 150,
		},
		{
			field: 'phone',
			headerName: 'Phone',
			width: 110,
		},
	];

	return (
		<>
			<Typography variant='h6' gutterBottom mt={3}>
				Playground
			</Typography>
			<Button variant='contained' onClick={handleClick}>
				YO, GET ME MY DATA!
			</Button>

			<Typography variant='h6' color='text.secondary' gutterBottom mt={3}>
				Results
			</Typography>
			<Paper outlined elevation={0}>
				<div style={{ height: 400, width: '100%' }}>
					{customers != null ? (
						<DataGrid
							rows={customers}
							columns={columns}
							pageSize={5}
							rowsPerPageOptions={[5]}
						/>
					) : (
						<></>
					)}
				</div>
			</Paper>
		</>
	);
}

{
	/* <>
<Grid container spacing={3} mt={2}>
	<Grid item md={6}>
		<Typography variant='h6'>Playground</Typography>
	</Grid>
	<Grid item md={6}>
		<Typography variant='h6' color='text.secondary' gutterBottom>
			Results
		</Typography>
		<Paper outlined elevation={0}>
			<div style={{ height: 400, width: '100%' }}>
				<DataGrid
					rows={rows}
					columns={columns}
					pageSize={5}
					rowsPerPageOptions={[5]}
				/>
			</div>
		</Paper>
	</Grid>
</Grid>
</> */
}
