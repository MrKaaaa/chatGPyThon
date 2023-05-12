import { Option, Select, Textarea } from '@mui/joy';
import { Box } from '@mui/material';
import Button from '@mui/joy/Button';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

export default function Prompt() {
	return (
		<Box
			display="flex"
			flexDirection="row"
			alignItems="center"
			justifyContent="center"
			width="100%"
			gap={16}
		>
			<Box
				display="flex"
				flexDirection="column"
				alignItems="center"
				justifyContent="center"
				gap={2}
			>
				<Box
					display="flex"
					flexDirection="row"
					alignItems="center"
					justifyContent="flex-end"
					gap={4}
					width="100%"
				>
					<Select
						placeholder="Chosis en un"
						size="lg"
						variant="soft"
						defaultValue="Neutre"
					>
						<Option value="Neutre">Neutre</Option>
						<Option value="Heureux">Heureux</Option>
						<Option value="Fache">Fâché</Option>
						<Option value="Comprehensif">Compréhensif</Option>
						<Option value="Triste">Triste</Option>
					</Select>
					<Select
						placeholder="Chosis en un"
						size="lg"
						variant="soft"
						defaultValue="Formel"
					>
						<Option value="Formel">Formel</Option>
						<Option value="Informel">Informel</Option>
					</Select>
				</Box>

				<Textarea
					disabled={false}
					minRows={10}
					placeholder="Contenu du mail..."
					size="lg"
					variant="solid"
					sx={{
						minWidth: '500px',
					}}
				/>
				<Box
					display="flex"
					flexDirection="row"
					alignItems="center"
					justifyContent="flex-end"
					width="100%"
				>
					<Button
						variant="soft"
						color="neutral"
						endDecorator={<KeyboardArrowRight />}
					>
						Sumbit prompt
					</Button>
				</Box>
			</Box>
			<Textarea
				disabled={false}
				minRows={10}
				placeholder="SORTIE DE CHATGPT"
				size="lg"
				variant="solid"
				sx={{
					minWidth: '500px',
				}}
				readOnly
			/>
		</Box>
	);
}
