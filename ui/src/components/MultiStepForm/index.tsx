import React, { useReducer } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Input from '@mui/material/Input';
import Typography from '@mui/material/Typography';
import CheckIcon from '@mui/icons-material/Check';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export interface ValidationMessage {
	error: boolean;
	message?: string;
}

interface FormInput {
	label: string;
	type: string;
	key: string;
	validation(input: string): ValidationMessage;
}

type InputKeys = Extract<FormInput['key'], string>;

interface FormInputData {
	[key: string]: {
		value: string;
		validation?: ValidationMessage;
	};
}

export type FormData = FormInputData & {
	[key in InputKeys]: FormInputData[key];
};

interface FormFormattedData {
	[key: string]: any;
}

export interface FormStep {
	label: string;
	inputs: FormInput[];
}

interface MultiStepFormProps {
	steps: FormStep[];
	onComplete(formValue: FormData): void;
}

// Action types for useReducer
enum ActionTypes {
	UPDATE_FORM_FIELD,
	RESET_FORM,
}

// Action for updating form field value
interface UpdateFormFieldAction {
	type: ActionTypes.UPDATE_FORM_FIELD;
	payload: {
		value: FormData;
	};
}

interface ResetFormAction {
	type: ActionTypes.RESET_FORM;
}

type FormAction = UpdateFormFieldAction | ResetFormAction;

const formReducer = (state: FormData, action: FormAction): FormData => {
	switch (action.type) {
		case ActionTypes.UPDATE_FORM_FIELD:
			const { value } = action.payload;
			return {
				...state,
				...value,
			};
		case ActionTypes.RESET_FORM:
			return {};
		default:
			return state;
	}
};

const MultiStepForm = ({ steps, onComplete }: MultiStepFormProps) => {
	const [formState, dispatch] = useReducer(formReducer, {});
	const [stepIndex, setStepIndex] = React.useState(0);

	const currentStep = steps[stepIndex];
	const totalSteps = steps.length;

	const onChange = (key: keyof FormData, value: string) => {
		const updateValue: FormData = {};
		updateValue[key] = { value };
		dispatch({ type: ActionTypes.UPDATE_FORM_FIELD, payload: { value: updateValue } });
	};

	const onBack = () => {
		setStepIndex((prevStepIndex) => Math.max(0, prevStepIndex - 1));
	};

	const onContinue = () => {
		const isFormValid = validateForm();

		if (isFormValid) {
			setStepIndex((prevStepIndex) => Math.min(prevStepIndex + 1, totalSteps - 1));
		}
	};
	const onCompleteForm = () => {
		const isFormValid = validateForm();

		if (isFormValid) {
			let formattedForm: FormFormattedData = {};
			Object.keys(formState).forEach((key) => {
				formattedForm[key] = formState[key].value;
			});

			try {
				setStepIndex(0);
				dispatch({ type: ActionTypes.RESET_FORM });
				onComplete(formattedForm);
			} catch (e) {
				alert(e);
			}
		}
	};

	const validateForm = (): boolean => {
		const currentStepInputs = currentStep.inputs;
		const updatedFormState: FormData = {};
		let isValid = true;

		currentStepInputs.forEach((input) => {
			const { key, validation } = input;
			const value = formState[key]?.value || '';

			const validateResult = validation(value);
			updatedFormState[key] = {
				value: value,
				validation: validateResult,
			};

			if (validateResult.error) {
				isValid = false;
			}
		});

		dispatch({ type: ActionTypes.UPDATE_FORM_FIELD, payload: { value: updatedFormState } });
		return isValid;
	};
	return (
		<>
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
								<Container sx={{ display: 'flex', alignItems: 'center', gap: '8px' }} disableGutters>
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
				{currentStep.inputs.map((input) => (
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
								border: formState[input.key]?.validation?.error ? '2px solid red' : '2px solid #bdbebe',
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
						onClick={onCompleteForm}
					>
						Create client
					</Button>
				)}
			</Container>
		</>
	);
};
export default MultiStepForm;
