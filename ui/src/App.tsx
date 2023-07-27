import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import './App.css';

import DataProvider from './store/DataProvider';
import Clients from './pages/Clients';

const queryClient = new QueryClient();

export default function App() {
	return (
		<div className='App'>
			<DataProvider>
				<QueryClientProvider client={queryClient}>
					<Routes>
						<Route path='/' element={<Clients />} />
						<Route path='/Clients' element={<Clients />} />
					</Routes>
				</QueryClientProvider>
			</DataProvider>
		</div>
	);
}
