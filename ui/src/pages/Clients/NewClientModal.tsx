import { v4 as uuidv4 } from 'uuid';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';

import CloseIcon from '@mui/icons-material/Close';

import { InputTypes } from '../../components/MultiStepForm/InputPicker';
import MultiStepForm, { FormData, FormStep, ValidationMessage } from '../../components/MultiStepForm';

interface NewClientModalProps {
	open?: boolean;
	onClose?(): void;
	onComplete?(value: IClient): void;
}

const steps: FormStep[] = [
	{
		label: 'Personal details',
		inputs: [
			{
				label: 'First name',
				type: InputTypes.TEXT,
				key: 'firstName',
				validation: (input): ValidationMessage => {
					if (input === '') return { error: true, message: 'First name is required' };
					if (input === null) return { error: true, message: 'First name is required' };
					if (input === undefined) return { error: true, message: 'First name is required' };
					return { error: false };
				},
			},
			{
				label: 'Last name',
				type: InputTypes.TEXT,
				key: 'lastName',
				validation: (input): ValidationMessage => {
					if (input === '') return { error: true, message: 'Last name is required' };
					if (input === null) return { error: true, message: 'Last name is required' };
					if (input === undefined) return { error: true, message: 'Last name is required' };
					return { error: false };
				},
			},
			{
				label: 'Gender',
				type: InputTypes.SELECT,
				key: 'gender',
				options: [
					{
						label: 'Male',
						value: 'Male',
					},
					{
						label: 'Female',
						value: 'Female',
					},
					{
						label: 'Transgender',
						value: 'Transgender',
					},
					{
						label: 'Non-binary',
						value: 'Non-binary',
					},
					{
						label: 'I prefer not to say',
						value: 'N/A',
					},
				],
				validation: (input): ValidationMessage => {
					if (input === '') return { error: true, message: 'Gender is required' };
					if (input === null) return { error: true, message: 'Gender is required' };
					if (input === undefined) return { error: true, message: 'Gender is required' };
					return { error: false };
				},
			},
		],
	},
	{
		label: 'Contact details',
		inputs: [
			{
				label: 'Email',
				type: InputTypes.TEXT,
				key: 'email',
				validation: (input): ValidationMessage => {
					if (input === '') return { error: true, message: 'Email is required' };
					if (input === null) return { error: true, message: 'Email is required' };
					if (input === undefined) return { error: true, message: 'Email is required' };
					if (!/^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/.test(input))
						return { error: true, message: 'Invalid email format' };
					return { error: false };
				},
			},
			{
				label: 'Phone number',
				type: InputTypes.TEXT,
				key: 'phoneNumber',
				validation: (input): ValidationMessage => {
					if (input === '') return { error: true, message: 'Phone number is required' };
					if (input === null) return { error: true, message: 'Phone number is required' };
					if (input === undefined) return { error: true, message: 'Phone number is required' };
					if (!/^\+(?:[0-9] ?){6,14}[0-9]$/.test(input))
						return { error: true, message: 'Invalid phone number format. Ex. +18888888' };
					return { error: false };
				},
			},
		],
	},
];

const NewClientModal = ({ open = true, onClose, onComplete }: NewClientModalProps) => {
	const onCompleteForm = async (formValue: FormData) => {
		onComplete && onComplete({ ...formValue, id: uuidv4() } as unknown as IClient);
		onClose && onClose();
	};
	return (
		<>
			<Modal open={open} onClose={onClose}>
				<Box
					sx={{
						position: 'absolute',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						background: 'white',
						padding: '40px',
						width: '500px',
					}}
				>
					<Container
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
						}}
						disableGutters
					>
						<Typography variant='h5' sx={{ textAlign: 'start' }}>
							Create new client
						</Typography>
						<IconButton onClick={onClose}>
							<CloseIcon sx={{ color: '#9e9e9e' }} />
						</IconButton>
					</Container>
					<MultiStepForm steps={steps} onComplete={onCompleteForm} />
				</Box>
			</Modal>
		</>
	);
};

export default NewClientModal;
