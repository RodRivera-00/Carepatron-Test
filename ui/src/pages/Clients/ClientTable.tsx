import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import ClientRow from './ClientRow';

interface BasicTableProps {
	clients: IClient[];
	filter?: string;
}

export default function BasicTable({ clients, filter = '' }: BasicTableProps) {
	return (
		<TableContainer component={Paper} sx={{ maxWidth: '100%', borderRadius: '10px' }}>
			<Table sx={{ minWidth: 400, border: '1px solid #f5f5f7', boxShadow: 'none' }} aria-label='simple table'>
				<TableHead>
					<TableRow>
						<TableCell>Name</TableCell>
						<TableCell>Phone</TableCell>
						<TableCell>Email</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{clients
						.filter((item) => {
							// Filters the ff:
							// First name only
							// Last name only
							// First name + Last name
							// Last name + First name
							return (
								item.firstName.toLowerCase().includes(filter.toLowerCase()) ||
								item.lastName.toLowerCase().includes(filter.toLowerCase()) ||
								`${item.firstName} ${item.lastName}`.toLowerCase().includes(filter.toLowerCase()) ||
								`${item.lastName} ${item.firstName}`.toLowerCase().includes(filter.toLowerCase())
							);
						})
						.map((client) => (
							<ClientRow key={client.id} client={client} />
						))}
					{!clients ||
						(!clients.length && (
							<TableRow sx={{ padding: 3 }}>
								<TableCell component='th' scope='row'>
									No clients
								</TableCell>
							</TableRow>
						))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
