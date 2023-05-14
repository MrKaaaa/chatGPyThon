import { Box, Typography } from '@mui/material';

export default function Title() {
	return (
		<Box
			display="flex"
			flexDirection="column"
			alignItems="center"
			justifyContent="center"
		>
			<Typography variant="h1" component="div" gutterBottom>
				ChatGpyThon
			</Typography>
		</Box>
	);
}
