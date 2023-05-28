import { ListItem, Option, Select, Stack, Textarea } from '@mui/joy';
import { Alert, Backdrop, Box, CircularProgress, TextField } from '@mui/material';
import Button from '@mui/joy/Button';
import FixedSizeList from '@mui/material/List'; 
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import DeleteIcon from '@mui/icons-material/Delete';
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Add } from '@mui/icons-material';

export default function Prompt() {
	const [ton, setTon] = useState('Neutre');
	const [style, setStyle] = useState('Formel');
	const [mailContent, setMailContent] = useState('');
	const [finalContent, setFinalContent] = useState('');

	const [apiResponse, setApiResponse] = useState('');

	const [hasContent, setHasContent] = useState(false);

	const [open, setOpen] = useState(false);

	const [x, setX] = useState();
	const [y, setY] = useState();

	const [w, setW] = useState();
	const [h, setH] = useState();

	const [count, setCount] = useState(1);

	const [context, setContext] = useState('');

	const [fnContexts, setFnContexts] = useState([]);

	const [error, setError] = useState(false);

	const secondTxtAreaRef = useRef();

	const baseUrl = "http://127.0.0.1:5000";


	const handleChange = event => {
		setMailContent(event.target.value);
	};

	const handleContext = event => {
		console.log(event.target.value);
		const elValue = event.target.value;
		setContext(elValue)
	};

	const [items, setItems] = useState([]);
	const incrCounter = () => setCount(c => c + 1);
	console.log(count);

	const addToFnContexts = () => {
		const elValue = context;
		console.log(elValue);
		if(elValue.length > 0){
			setError(false);
			setFnContexts((cont) => {
				return [...cont, elValue];
			});
	
			setItems([
				<TextField id={'in-'+ (count + 1)} 
				key={'key-in-' + (count + 1)}
				placeholder="Ajoutez du contexte..." 
				sx={{ color: "neutral",
						variant: "solid",
						minHeight: "100px", 
						width: "100%", 
						justifyContent: "center" }}
				onChange={handleContext}
				/>
			]);
			setContext('');
		}else{
			setContext('');
			setError(true);
		}
		
	};

	const handleClick = async () => {
		backdropIsOpen();

		const contArrayStr = fnContexts.toString();

		const fn = `XYW2${ton}XYW2${style}XYW2 WXZYF45${contArrayStr} ::\n${mailContent}`;
		setFinalContent(fn);
		setHasContent(true);
	};

	const requestGpt = async () => {
		const fnUrl = new URL(`/${finalContent}`, baseUrl);
		const href = fnUrl.href.replaceAll('?', 'WXZZ');

		const response = await axios.post(href);
		setApiResponse(response.data);
	};

	const backdropIsOpen = () => {
		getPosistionOfRefEl(secondTxtAreaRef);
		getDimensionOfRefEl(secondTxtAreaRef);
		setOpen(!open);
	};

	if (hasContent) {
		requestGpt().then(() => backdropIsOpen());
		setHasContent(false);
	}
	const getPosistionOfRefEl = (value) => {
		const xVal = value?.current?.offsetLeft;
		setX(xVal);

		const yVal = value?.current?.offsetTop;
		setY(yVal);
	};

	const getDimensionOfRefEl = (value) => {
		const elmRect = value.current.getBoundingClientRect();

		const hVal = elmRect.height;
		setH(hVal);

		const wVal = elmRect.width;
		setW(wVal);
	};

	const onWindowResize = () => {
		getPosistionOfRefEl(secondTxtAreaRef);
		getDimensionOfRefEl(secondTxtAreaRef);
	};

	const addInputField = () => {
		if(items.length < 1){
			setItems([...items, 
				<TextField id={'in-'+ (count + 1)} 
							key={'key-in-' + (count + 1)}
							placeholder="Ajoutez du contexte..." 
							sx={{ color: "neutral",
									variant: "solid",
									minHeight: "100px", 
									width: "80%", 
									justifyContent: "center" }}
							onChange={handleContext}
							/>
			]);
		}
	};

	const deleteInputField = (input) => {
		const elId = input;
		if(fnContexts.length > 0)
			setFnContexts(fnContexts.filter(i => i !== elId));
	}
	
	useEffect(() => {
		getPosistionOfRefEl(secondTxtAreaRef);
		getDimensionOfRefEl(secondTxtAreaRef);
	}, []);

	useEffect(() => {
		incrCounter()
	}, [items]);
	
	window.addEventListener('resize', onWindowResize);
	window.addEventListener('scroll', onWindowResize);

	return (
		<Box display={"flex"} flexDirection={"column"}>
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
							id="select-1"
							placeholder="Chosis en un"
							size="lg"
							variant="soft"
							defaultValue="Neutre"
							onChange={(choice) => setTon(choice.target['innerText'])}

						>
							<Option value="Neutre">Neutre</Option>
							<Option value="Heureux">Heureux</Option>
							<Option value="Fache">Fâché</Option>
							<Option value="Comprehensif">Compréhensif</Option>
							<Option value="Triste">Triste</Option>
						</Select>
						<Select
							id="select-2"
							placeholder="Chosis en un"
							size="lg"
							variant="soft"
							defaultValue="Formel"
							onChange={(choice) => setStyle(choice.target['innerText'])}
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
						onChange={handleChange}
						value={mailContent}
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
							onClick={handleClick}
						>
							Sumbit prompt
						</Button>
					</Box>
				</Box>
				<Box>
					<Textarea
						ref={secondTxtAreaRef}
						disabled={false}
						minRows={10}
						placeholder="SORTIE DE CHATGPT"
						size="lg"
						variant="solid"
						sx={{
							minWidth: '500px',
						}}
						value={apiResponse}
						readOnly
					/>
					<Backdrop sx={{ position: 'absolute', color: 'fff', left: x, top: y, width: w, height: h, borderRadius: '8px' }} open={open}>
						<CircularProgress color="inherit" />
					</Backdrop>
				</Box>
			</Box>
			<Box
				display="flex"
				flexDirection="row"
				alignItems="center"
				justifyContent="flex-start"
				width="100%"
				gap={16}
			>
				<Box height={"450px"} width={"500px"} marginTop={"50px"} justifyContent={"center"}>
					<h2>Contexte à ajouter</h2>
					<Stack spacing={2}
						display="flex"
						alignItems="center"
						justifyContent="stretch"
						sx={{overflowY: 'auto', flexFlow: 'column nowrap'}}>
						<Button
							variant="soft"
							color="neutral"
							onClick={addInputField}
							sx={{ minHeight: '50px', width: '100%' }}
						>
							<Add color='action'/>
						</Button>
						<FixedSizeList sx={{height: 390, width: '100%'}}>
						{items.map((item, index) => (
							<ListItem
								sx={{
									display: "flex",
									flexDirection: "row",
									alignItems: "center",
									justifyItems: "stretch",
									width: "100%"
								}}
							>
								<Box sx={{width: '100%'}}>
									<Box sx={{display: 'flex'}}>
										{item}
										<Box sx={{width: '20%', display:'flex', alignItems:'center', justifyContent: 'center'}}>
											<Button
												variant="outlined"
												color="neutral"
												onClick={() => addToFnContexts()}
												sx={{ width: '90%', marginLeft: '10px', height:'56px', justifyContent: 'center' }}
											>
												<KeyboardArrowRight sx={{color: '#506077'}}/>
											</Button>
										</Box>
									</Box>
									<Box visibility={error ? 'visible' : 'hidden'}>
										<Alert severity="error">The field is empty !</Alert>
									</Box>
								</Box>
							</ListItem>
						))}
						</FixedSizeList>
					</Stack>
				</Box>
				<Box height={"450px"} width={"500px"} marginTop={"50px"} justifyContent={"center"}>
					<h2>Contexte ajouté</h2>
					<Stack spacing={2}
						display="flex"
						alignItems="center"
						justifyContent="stretch"
						sx={{overflowY: 'auto', flexFlow: 'column nowrap'}}>
						<FixedSizeList sx={{height: 390, width: '100%'}}>
						{fnContexts.map((item, index) => (
							<ListItem 
								sx={{
									display: "flex",
									flexDirection: "row",
									alignItems: "center",
									justifyItems: "stretch",
									width: "100%"
								}}
							>
								{item}
								<Button
									variant="outlined"
									color="neutral"
									onClick={() => deleteInputField(item)}
									sx={{ minHeight: '60px', marginLeft: '10px', justifyContent: 'center' }}
								>
									<DeleteIcon color='error'/>
								</Button>
							</ListItem>
						))}
						</FixedSizeList>
					</Stack>
				</Box>
			</Box>
		</Box>
	);
}
