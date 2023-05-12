import { Box } from '@mui/material';
import Title from '../components/Title';
import Prompt from '../components/Prompt';

export default function Homepage() {
	return (
		<Box
			display="flex"
			flexDirection="column"
			alignItems="center"
			justifyContent="center"
		>
			<Title />
			<Prompt />
		</Box>
	);
}
