import Container from '@mui/material/Container';
import NativeSelect, { NativeSelectProps } from '@mui/material/NativeSelect';
import Typography from '@mui/material/Typography';
import { FormOptions } from '..';

interface SelectInputProps extends NativeSelectProps {
	label?: string;
	error?: boolean;
	helper?: string;
	options?: FormOptions[];
	onChange?(value: any): void;
}

const SelectInput = (props: SelectInputProps) => {
	const { value, label, error, helper, options, onChange, ...rest } = props;
	return (
		<Container sx={{ mt: 1 }} disableGutters>
			<Typography
				sx={{
					fontSize: '14px',
					color: error ? 'red' : '#bdbebe',
				}}
			>
				{label}
			</Typography>
			<NativeSelect
				value={value ?? ''}
				sx={{
					border: error ? '2px solid red' : '2px solid #bdbebe',
					borderRadius: '5px',
					paddingY: 1,
					paddingX: 1.5,
				}}
				fullWidth
				disableUnderline
				onChange={(e) => {
					onChange && onChange(e.target.value);
				}}
				{...rest}
			>
				{options?.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</NativeSelect>
			{helper && <Typography sx={{ fontSize: '14px', color: error ? 'red' : '#bdbebe' }}>{helper}</Typography>}
		</Container>
	);
};
export default SelectInput;
