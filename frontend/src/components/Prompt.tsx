import { ListItem, Option, Select, Stack, Textarea } from '@mui/joy';
import { Backdrop, Box, CircularProgress, StepContext, TextField } from '@mui/material';
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

	//const initContexts = {id: string, value: ""}

	const [contexts, setContexts] = useState([{id: "", value: ""}]);
	//const contexts = [{id: "", value: ""}];

	const [items, setItems] = useState([<TextField id={'in-'+count}  placeholder="Ajoutez du contexte..." value={contexts} sx={{ color: "neutral", variant: "solid", minHeight: "100px", width: "100%", justifyContent: "center" }} />]);

	const secondTxtAreaRef = useRef();

	const baseUrl = "http://127.0.0.1:5000";

	const handleChange = event => {
		setMailContent(event.target.value);
	};

	let val = false;

	const checkIfExists = (value, event) => {
		value.id === event.target.id ? val = true : val = false;
	};

	const handleContext = event => {
		console.log(event.target.value);
		// if(b.length < 1){
			
		const nextList = [...contexts];
		const b = nextList.filter((obj, index, self) => obj.value !== event.target.id).indexOf;
		//const b = nextList.find((obj) => obj.id === event.target.id);
		const n = event.target.id;
		if(b.length > 1){
			const nextList = [...contexts];
			const cont = nextList.find(
				a => a.id === event.target.id
			);
			cont.value = event.target.value;

			//setContexts(nextList);
		}else {
			
			var newContexts = contexts.slice();
			newContexts.push({id: event.target.id, value: event.target.value});
			setContexts( cont => {
				cont.forEach(e => checkIfExists(e, event));
				if(val){
					const c = cont.find(
						a => a.id === event.target.id
					);
					c.value = event.target.value;

					setContexts(cont);

				}else{
					return [...cont, 
						{
							value: event.target.value, 
							id: event.target.id
						}]
				}
			})
		}

		// }
		//else{
			//setContexts( cont => [...cont, {value: event.target.value, id: event.target.id}]);
		// contexts.map(obj => {
		// 	if(obj.id === event.target.id)
		// 	{
		// 		console.log('passé iciiiiidsfdsfdf')
		// 		setContexts([{...obj, id: event.target.id,value: event.target.value }])
		// 		return {...obj, value: event.target.value as string};
		// 	}
		// 	setContexts([{...obj,id: event.target.id , value: event.target.value }])
		// 	return {...obj, id: event.target.id as string, value: event.target.value as string};
		// },[]);

		//setContexts(newState)
		//}
	};

	// const getContexts = () => {
	// 	const str = "";
	// 	contexts.reduce
	// } 

	const handleClick = async () => {
		backdropIsOpen();

		const fn = `XYW2${ton}XYW2${style}XYW2 ::\n${mailContent}`;
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
		const xVal = value.current.offsetLeft;
		setX(xVal);

		const yVal = value.current.offsetTop;
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
		console.log("OKKKKKK!!!!!!!");
		getPosistionOfRefEl(secondTxtAreaRef);
		getDimensionOfRefEl(secondTxtAreaRef);
	};

	const addInputField = () => {
		setCount(c => c + 1);
		setItems([...items, 
				<TextField id={'in-'+ (count + 1)} 
							key={'key-in-' + (count + 1)}
							placeholder="Ajoutez du contexte..." 
							sx={{ color: "neutral",
									variant: "solid",
									minHeight: "100px", 
									width: "100%", 
									justifyContent: "center" }}
							onBlur={handleContext}
							/>
		]);
	};

	const deleteInputField = (input) => {
		const elId = input.props.id;
		if(items.length > 1)
			setItems(items.filter(i => i.props.id !== elId));
	}
	
	useEffect(() => {
		getPosistionOfRefEl(secondTxtAreaRef);
		getDimensionOfRefEl(secondTxtAreaRef)
	}, []);
	
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
					<Stack spacing={2}
						display="flex"
						alignItems="center"
						justifyContent="stretch"
						sx={{overflowY: 'auto', flexFlow: 'column nowrap'}}>
						<FixedSizeList sx={{height: 390, width: '100%'}}>
						{items.map(item => (
							<ListItem key={item.key}
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
									variant="soft"
									color="neutral"
									onClick={addInputField}
									sx={{ minHeight: '60px', marginLeft: '10px' }}
								>
									<Add color='action'/>
								</Button>
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
				<Box>
					{contexts.map(item => (
						<Stack>
							<ListItem>
								Val: {item.value} ID: {item.id}
							</ListItem>
						</Stack>
					))}
				</Box>
			</Box>
		</Box>
	);
}
