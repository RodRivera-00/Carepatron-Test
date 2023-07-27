import Container from '@mui/material/Container';
import Select, { SelectProps } from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { FormOptions } from '..';

interface SelectInputProps extends SelectProps {
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
			<Select
				native
				value={value}
				size='medium'
				sx={{
					border: error ? '2px solid red' : '2px solid #bdbebe',
					borderRadius: '5px',
				}}
				fullWidth
				disableUnderline
				displayEmpty
				onChange={(e) => {
					onChange && onChange(e.target.value);
				}}
				{...rest}
			>
				<option value=''>Select gender</option>
				{options?.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</Select>
			{helper && <Typography sx={{ fontSize: '14px', color: error ? 'red' : '#bdbebe' }}>{helper}</Typography>}
		</Container>
	);
};
export default SelectInput;
