import { InputProps } from '@mui/material/Input';
import { SelectProps } from '@mui/material/Select';

import TextInput from './TextInput';
import SelectInput from './SelectInput';

export enum InputTypes {
	TEXT = 'text',
	EMAIL = 'email',
	SELECT = 'select',
	CHECKBOX = 'checkbox',
	SWITCH = 'switch',
	RADIO = 'radio',
}

export interface FormOptions {
	label: string;
	value: any;
}

export interface FormInputProps {
	type: InputTypes;
	label?: string;
	error?: boolean;
	helper?: string;
	options?: FormOptions[];
	props?: InputProps | SelectProps;
	value?: any;
	onChange?(value: any): void;
}

const InputPicker = ({ type, label, error, helper, options, value, onChange, props }: FormInputProps) => {
	if (type === InputTypes.TEXT) {
		return (
			<TextInput
				label={label}
				error={error}
				helper={helper}
				onChange={onChange}
				value={value}
				{...(props as InputProps)}
			/>
		);
	}
	if (type === InputTypes.SELECT) {
		return (
			<SelectInput
				label={label}
				error={error}
				helper={helper}
				options={options}
				value={value}
				onChange={onChange}
				{...(props as Omit<SelectProps, 'label' | 'onChange'>)}
			/>
		);
	}
	return <></>;
};
export default InputPicker;
