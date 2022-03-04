import {
	Alert,
	Box,
	Button,
	CircularProgress,
	Grid,
	Paper,
	Stack,
	TextField,
	Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {
	DataGrid,
	GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD,
} from '@mui/x-data-grid';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useMediaQuery } from '@mui/material';
import theme from '../styles/theme';

export default function Playground({
	endpoint,
	method,
	columns,
	params = null,
	multiTable = false,
	idKey = null,
	height = 400,
}) {
	const url = `/api/${endpoint}`;

	const [results, setResults] = useState(null);
	const [loading, setLoading] = useState(false);
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
			setLoading(true);
			const res = await axios(url, {
				method: method,
				data: bodyParams && method != 'GET' ? bodyParams : undefined,
				params: bodyParams && method == 'GET' ? bodyParams : undefined,
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
					error.response?.data?.error ||
					'Invalid input!'
			);
			setResults(null);
		}
		setLoading(false);
	};

	const mobile = useMediaQuery(theme.breakpoints.down('sm'));

	return (
		<>
			{bodyParams && (
				<div style={{ marginTop: '2rem' }}>
					{Object.keys(bodyParams).map((q) => {
						if (params[q]?.price == true) {
							return (
								<TextField
									key={endpoint + method + q}
									label={q}
									variant={'outlined'}
									type={'number'}
									value={bodyParams[q] / 100.0}
									style={{
										marginRight: mobile ? 0 : '0.5rem',
										marginBottom: !mobile ? 0 : '1rem',
										width: mobile ? '100%' : '32%',
									}}
									onChange={(e) => {
										setQueryParams({
											...bodyParams,
											[q]: Math.max(Math.round(e.target.value * 100), 0),
										});
									}}
								/>
							);
						}

						return (
							<TextField
								key={endpoint + method + q}
								label={q}
								variant={'outlined'}
								value={bodyParams[q]}
								style={{
									marginRight: mobile ? 0 : '0.5rem',
									marginBottom: !mobile ? 0 : '1rem',
									width: mobile ? '100%' : '32%',
								}}
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
			<LoadingButton
				variant='contained'
				onClick={handleClick}
				style={{ marginTop: '1rem' }}
				loading={loading}
			>
				Run Query
			</LoadingButton>
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
				<div style={{ height: height, width: '100%' }}>
					<DataGrid
						rows={results || []}
						columns={columns}
						pageSize={pageSize}
						rowsPerPageOptions={[5, 10, 20, 25, 50, 100]}
						onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
						pagination
						getRowId={results && idKey ? (row) => row[idKey] : undefined}
					/>
				</div>
			) : (
				<>
					{results == null ? (
						<div style={{ height: 300, width: '100%' }}>
							<DataGrid
								rows={results || []}
								columns={columns}
								rowsPerPageOptions={[]}
							/>
						</div>
					) : (
						Object.keys(results).map((table) => {
							const tableResults = results[table];
							return (
								<React.Fragment key={endpoint + method + table}>
									<Typography variant='body1' mt={1.5} mb={0.5}>
										<strong>{table}</strong>
									</Typography>
									<div style={{ height: height, width: '100%' }}>
										<DataGrid
											rows={tableResults}
											columns={columns}
											pageSize={tableResults.length}
											rowsPerPageOptions={[tableResults.length]}
											getRowId={idKey ? (row) => row[idKey] : undefined}
										/>
									</div>
								</React.Fragment>
							);
						})
					)}
				</>
			)}
		</>
	);
}
