import { memo, useContext, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import Snackbar from '@mui/material/Snackbar';
import Alert, { AlertColor } from '@mui/material/Alert';

import SearchIcon from '@mui/icons-material/Search';

import { StateContext } from '../../store/DataProvider';
import Page from '../../components/Page';

import { getClients, createClient } from '../../services/api';

import ClientTable from './ClientTable';
import NewClientModal from './NewClientModal';

function Clients() {
	const [search, setSearch] = useState('');
	const [createModalOpen, setCreateModalOpen] = useState(false);
	const [toastMessage, setToastMessage] = useState<{ type: AlertColor; message: string } | undefined>();

	const { state, dispatch } = useContext(StateContext);
	const { clients } = state;

	//React Query
	const queryClient = useQueryClient();
	const { isLoading } = useQuery({
		queryKey: ['clients'],
		queryFn: getClients,
		onSuccess: (data) => {
			dispatch({ type: 'FETCH_ALL_CLIENTS', data: data });
		},
		onError: (e) => {
			setToastMessage(() => ({
				type: 'error',
				message: `An error occured: ${e}`,
			}));
		},
		staleTime: 30000,
	});
	const mutation = useMutation({
		mutationFn: createClient,
		onSuccess: () => {
			setToastMessage(() => ({
				type: 'success',
				message: 'Successfully added a client',
			}));
			queryClient.invalidateQueries({ queryKey: ['clients'] });
		},
		onError: (e) => {
			setToastMessage(() => ({
				type: 'error',
				message: `An error occured: ${e}`,
			}));
		},
	});
	const onComplete = (value: IClient) => {
		mutation.mutate(value);
	};
	const onCloseToast = () => {
		setToastMessage(undefined);
	};
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
					onClick={() => setCreateModalOpen(() => true)}
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
				{isLoading ? <Typography>Loading...</Typography> : <ClientTable clients={clients} filter={search} />}
			</Paper>
			<NewClientModal
				open={createModalOpen}
				onClose={() => setCreateModalOpen(() => false)}
				onComplete={onComplete}
			/>
			<Snackbar
				open={toastMessage !== undefined}
				autoHideDuration={6000}
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'center',
				}}
				onClose={onCloseToast}
			>
				<Alert onClose={onCloseToast} severity={toastMessage?.type ?? 'success'} sx={{ width: '100%' }}>
					{toastMessage?.message}
				</Alert>
			</Snackbar>
		</Page>
	);
}

export default memo(Clients);
