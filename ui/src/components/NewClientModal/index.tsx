import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Modal, Box, Container, Typography, IconButton, Input, Button } from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { createClient } from '../../services/api';

interface NewClientModalProps {
	open?: boolean;
	onClose?(): void;
}

// This could be refactored into another stepper form component
interface ValidationMessage {
	error: boolean;
	message?: string;
}

interface FormInput {
	label: string;
	type: string;
	key: string;
	validation(input: string): ValidationMessage;
}

interface FormStep {
	label: string;
	inputs: FormInput[];
}

const steps: FormStep[] = [
	{
		label: 'Personal details',
		inputs: [
			{
				label: 'First name',
				type: 'text',
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
				type: 'text',
				key: 'lastName',
				validation: (input): ValidationMessage => {
					if (input === '') return { error: true, message: 'Last name is required' };
					if (input === null) return { error: true, message: 'Last name is required' };
					if (input === undefined) return { error: true, message: 'Last name is required' };
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
				type: 'email',
				key: 'email',
				validation: (input): ValidationMessage => {
					if (input === '') return { error: true, message: 'Email is required' };
					if (input === null) return { error: true, message: 'Email is required' };
					if (input === undefined) return { error: true, message: 'Email is required' };
					return { error: false };
				},
			},
			{
				label: 'Phone number',
				type: 'text',
				key: 'phoneNumber',
				validation: (input): ValidationMessage => {
					if (input === '') return { error: true, message: 'Phone number is required' };
					if (input === null) return { error: true, message: 'Phone number is required' };
					if (input === undefined) return { error: true, message: 'Phone number is required' };
					return { error: false };
				},
			},
		],
	},
];

// Extract all unique input keys from the `steps` array
type InputKeys = Extract<FormInput['key'], string>;

interface FormInputData {
	[key: string]: {
		value: string;
		validation?: ValidationMessage;
	};
}

type FormData = FormInputData & {
	[key in InputKeys]: FormInputData[key];
};

interface FormFormattedData {
	[key: string]: any;
}

const NewClientModal = ({ open = true, onClose }: NewClientModalProps) => {
	const [stepIndex, setStepIndex] = useState(0);
	const [formState, setFormState] = useState<FormData>({});

	const validateForm = (): boolean => {
		const updatedFormState = { ...formState };
		const validationResults = steps[stepIndex].inputs.map((input) => {
			const { key, validation } = input;
			const value = formState[key]?.value || '';

			const validateResult = validation(value);
			updatedFormState[key] = {
				value: value,
				validation: validateResult,
			};

			return validateResult.error;
		});
		setFormState(updatedFormState);
		return !validationResults.some((result) => result === true);
	};
	const onChange = (key: keyof FormData, value: string) => {
		setFormState((formState) => ({
			...formState,
			[key]: {
				...formState[key],
				value: value,
			},
		}));
	};
	const onBack = () => {
		setStepIndex((stepIndex) => stepIndex - 1);
	};
	const onContinue = () => {
		if (validateForm()) {
			setStepIndex((stepIndex) => stepIndex + 1);
		}
	};
	const onComplete = () => {
		if (validateForm()) {
			let formattedForm: FormFormattedData = {};
			Object.keys(formState).forEach((key) => {
				formattedForm[key] = formState[key].value;
			});
			try {
				createClient({ ...formattedForm, id: uuidv4() } as unknown as IClient);
				onClose && onClose();
			} catch (e) {
				alert(e);
			}
		}
	};
	return (
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
				<Container
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						marginTop: 2,
						gap: '12px',
					}}
					disableGutters
				>
					{steps.map((step, index) => {
						return (
							<React.Fragment key={step.label}>
								<div>
									<Container
										sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}
										disableGutters
									>
										<Box
											sx={{
												height: '30px',
												width: '30px',
												display: 'flex',
												justifyContent: 'center',
												alignItems: 'center',
												background:
													index < stepIndex
														? '#008025'
														: index === stepIndex
														? '#345fff'
														: '#9e9e9e',
												borderRadius: '100%',
												color: 'white',
											}}
										>
											{index < stepIndex ? (
												<CheckIcon />
											) : (
												<Typography sx={{ fontSize: '14px' }}>{index + 1}</Typography>
											)}
										</Box>
										<Typography
											sx={{
												fontSize: '14px',
												fontWeight: index <= stepIndex ? 'bold' : 'normal',
												color: index <= stepIndex ? 'black' : '#9e9e9e',
											}}
										>
											{step.label}
										</Typography>
									</Container>
								</div>
								{index !== steps.length - 1 && (
									<Box
										key={`Separator-${step.label}`}
										sx={{ flexGrow: 1, height: '1px', background: '#cccccc' }}
									/>
								)}
							</React.Fragment>
						);
					})}
				</Container>
				<Container sx={{ mt: 2 }} disableGutters>
					{steps[stepIndex].inputs.map((input) => (
						<Container sx={{ mt: 1 }} key={`Input-${input.key}`} disableGutters>
							<Typography
								sx={{
									fontSize: '14px',
									color: formState[input.key]?.validation?.error ? 'red' : '#bdbebe',
								}}
							>
								{input.label}
							</Typography>
							<Input
								value={formState[input.key]?.value ?? ''}
								sx={{
									border: formState[input.key]?.validation?.error
										? '2px solid red'
										: '2px solid #bdbebe',
									borderRadius: '5px',
									paddingY: 1,
									paddingX: 1.5,
								}}
								fullWidth
								disableUnderline
								onChange={(e) => onChange(input.key, e.target.value)}
							/>
							<Typography sx={{ fontSize: '14px', color: 'red' }}>
								{formState[input.key]?.validation?.message}
							</Typography>
						</Container>
					))}
				</Container>
				<Container
					sx={{ display: 'flex', mt: 8, justifyContent: stepIndex === 0 ? 'end' : 'space-between' }}
					disableGutters
				>
					{stepIndex !== 0 && (
						<Button sx={{ display: 'flex', alignItems: 'center', gap: 1 }} onClick={onBack}>
							<ArrowBackIcon />
							<Typography sx={{ fontSize: 14, fontWeight: 'bold' }}>Back</Typography>
						</Button>
					)}
					{stepIndex !== steps.length - 1 && (
						<Button
							variant='contained'
							sx={{
								background: '#345fff',
								fontSize: 12,
								paddingY: 1.5,
								paddingX: 4,
								borderRadius: '10px',
								textTransform: 'none',
								boxShadow: 'none',
							}}
							onClick={onContinue}
						>
							Continue
						</Button>
					)}
					{stepIndex === steps.length - 1 && (
						<Button
							variant='contained'
							sx={{
								background: '#345fff',
								fontSize: 12,
								paddingY: 1.5,
								paddingX: 4,
								borderRadius: '10px',
								textTransform: 'none',
								boxShadow: 'none',
							}}
							onClick={onComplete}
						>
							Create client
						</Button>
					)}
				</Container>
			</Box>
		</Modal>
	);
};

export default NewClientModal;
