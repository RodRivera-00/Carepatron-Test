import Container from '@mui/material/Container';
import Input, { InputProps } from '@mui/material/Input';
import Typography from '@mui/material/Typography';

interface TextInputProps extends InputProps {
	label?: string;
	error?: boolean;
	helper?: string;
	onChange?(value: any): void;
}

const TextInput = (props: TextInputProps) => {
	const { value, label, error, helper, onChange, ...rest } = props;
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
			<Input
				value={value ?? ''}
				sx={{
					border: error ? '2px solid red' : '2px solid #bdbebe',
					borderRadius: '5px',
					paddingY: 1,
					paddingX: 1.5,
				}}
				fullWidth
				disableUnderline
				onChange={(e) => onChange && onChange(e.target.value)}
				{...rest}
			/>
			{helper && <Typography sx={{ fontSize: '14px', color: error ? 'red' : '#bdbebe' }}>{helper}</Typography>}
		</Container>
	);
};
export default TextInput;
