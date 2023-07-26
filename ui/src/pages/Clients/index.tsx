import { memo, useContext, useEffect, useState } from 'react';
import { Container, Paper, Typography, InputAdornment, Button, Input } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { StateContext } from '../../store/DataProvider';
import Page from '../../components/Page';
import ClientTable from './ClientTable';
import { getClients } from '../../services/api';

function Clients() {
	const [search, setSearch] = useState('');
	const { state, dispatch } = useContext(StateContext);
	const { clients } = state;

	useEffect(() => {
		getClients().then((clients) => dispatch({ type: 'FETCH_ALL_CLIENTS', data: clients }));
	}, [dispatch]);

	return (
		<Page>
			<Typography variant='h4' sx={{ textAlign: 'start', fontWeight: 'bold' }}>
				Clients
			</Typography>
			<Container
				sx={{
					width: '100%',
					justifyContent: 'space-between',
					alignItems: 'end',
					display: 'flex',
					marginTop: 3,
				}}
				disableGutters
			>
				<Input
					placeholder='Search clients...'
					sx={{
						background: 'white',
						border: '2px solid #ecedf0',
						borderRadius: '10px',
						paddingY: 0.5,
						paddingX: 1.5,
					}}
					onChange={(e) => setSearch(e.target.value)}
					endAdornment={
						<InputAdornment position='end'>
							<SearchIcon />
						</InputAdornment>
					}
					disableUnderline
				/>
				<Button
					size='large'
					variant='contained'
					sx={{
						background: '#345fff',
						fontSize: 12,
						paddingY: 1.5,
						borderRadius: '10px',
						textTransform: 'none',
					}}
				>
					Create new client
				</Button>
			</Container>
			<Paper
				sx={{
					margin: 'auto',
					marginTop: 3,
					boxShadow: 'none',
					border: '2px solid #ecedf0',
					borderRadius: '10px',
				}}
			>
				<ClientTable clients={clients} filter={search} />
			</Paper>
		</Page>
	);
}

export default memo(Clients);
