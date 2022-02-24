import { Box, Grid, Paper, Stack, Typography } from '@mui/material';

export default function Customers() {
	return (
		<>
			<Grid container spacing={3} mt={2}>
				<Grid item md={6}>
					<Typography variant='h6'>Playground</Typography>
				</Grid>
				<Grid item md={6}>
					<Typography variant='h6' color='text.secondary' gutterBottom>
						Results
					</Typography>
					<Paper outlined elevation={0}></Paper>
				</Grid>
			</Grid>
		</>
	);
}
