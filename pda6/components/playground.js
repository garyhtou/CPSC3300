import {
	Alert,
	Box,
	Button,
	Grid,
	Paper,
	Stack,
	TextField,
	Typography,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function Playground({
	endpoint,
	method,
	columns,
	params = null,
	multiTable = false,
	idKey = null,
}) {
	const url = `/api/${endpoint}`;

	const [results, setResults] = useState(null);
	const [error, setError] = useState(null);

	const [pageSize, setPageSize] = useState(10);

	const [bodyParams, setQueryParams] = useState(
		params
			? Object.keys(params).reduce((obj, key) => {
					const paramConfig = params[key];

					if (!paramConfig?.editable) {
						return obj;
					}
					return {
						...obj,
						[key]: paramConfig.default,
					};
			  }, {})
			: undefined
	);

	const handleClick = async () => {
		try {
			const res = await axios(url, {
				method: method,
				data: bodyParams ? bodyParams : undefined,
			});
			const data = res.data;
			console.log(res.data.results);
			setResults(res.data.results);
			setError(null);
		} catch (error) {
			console.log(error);
			console.log(error.response?.data?.error?.message);
			setError(
				error.response?.data?.error?.message ||
					error.response?.data?.error?.sqlMessage ||
					'Invalid input!'
			);
		}
	};

	return (
		<>
			{bodyParams && (
				<div style={{ marginTop: '2rem' }}>
					{Object.keys(bodyParams).map((q) => {
						return (
							<TextField
								id={endpoint + method + q}
								label={q}
								variant={'outlined'}
								value={bodyParams[q]}
								style={{ marginRight: '0.5rem', width: '32%' }}
								onChange={(e) => {
									setQueryParams({
										...bodyParams,
										[q]: e.target.value,
									});
								}}
							/>
						);
					})}
				</div>
			)}
			<Button
				variant='contained'
				onClick={handleClick}
				style={{ marginTop: '1rem' }}
			>
				Run Query
			</Button>
			{error && (
				<Alert severity='error' style={{ marginTop: '1rem' }}>
					{error}
				</Alert>
			)}
			<Typography variant='h5' color='text.secondary' gutterBottom mt={3}>
				Results{' '}
				<small>
					{results == null ? (
						<Typography>Run the query to review results</Typography>
					) : null}
				</small>
			</Typography>
			{!multiTable ? (
				<div style={{ height: 400, width: '100%' }}>
					<DataGrid
						rows={results}
						columns={columns}
						pageSize={pageSize}
						rowsPerPageOptions={[5, 10, 20, 25, 50]}
						onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
						pagination
						getRowId={results && idKey ? (row) => row[idKey] : undefined}
					/>
				</div>
			) : (
				<>
					{results == null ? (
						<div style={{ height: 400, width: '100%' }}>
							<DataGrid rows={results} columns={columns} />
						</div>
					) : (
						Object.keys(results).map((table) => {
							const tableResults = results[table];
							return (
								<>
									<Typography variant='body1' mt={1} mb={0.1}>
										<strong>{table}</strong>
									</Typography>
									<div
										style={{ height: 330, width: '100%' }}
										key={endpoint + method + table}
									>
										<DataGrid
											rows={tableResults}
											columns={columns}
											pageSize={tableResults.length}
											getRowId={idKey ? (row) => row[idKey] : undefined}
										/>
									</div>
								</>
							);
						})
					)}
				</>
			)}
		</>
	);
}
