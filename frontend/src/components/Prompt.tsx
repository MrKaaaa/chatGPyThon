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

	const [xFirstArea, setXFirstArea] = useState();
	const [yFirstArea, setYFirstArea] = useState();

	const [wFirstArea, setWFirstArea] = useState();
	const [hFirstArea, setHFirstArea] = useState();

	const [w, setW] = useState();
	const [h, setH] = useState();

	const [count, setCount] = useState(1);

	const [context, setContext] = useState('');

	const [fnContexts, setFnContexts] = useState([]);

	const [error, setError] = useState(false);

	const [errorSubmit, setErrorSubmit] = useState(false);

	const firstTxtAreaRef = useRef();
	const secondTxtAreaRef = useRef();

	const baseUrl = "http://127.0.0.1:5000";


	/**
	 * This function is an event handler that updates the state mailContent with the value from the event target.
	 * @param event The event object.
	 */
	const handleChange = event => {
		setMailContent(event.target.value)
	};

	/**
	 * This function is an event handler that logs the value from the event target and updates the state context with that value.
	 * @param event The event object.
	 */
	const handleContext = event => {
		const elValue = event.target.value;
		setContext(elValue)
	};

	const [items, setItems] = useState([]);
	const incrCounter = () => setCount(c => c + 1);

	/**
	 * This function adds the current context value to the fnContexts state if it's not empty. 
	 * It also updates the items state with a new TextField.
	 */
	const addToFnContexts = () => {
		const elValue = context;

		if(elValue.length > 0){
			setError(false);
			setErrorSubmit(false);
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

	let timer;
	/**
	 * This function is an asynchronous handler that sets the finalContent state with 
	 * a formatted string and sets hasContent state to true.
	 */
	const handleClick = async () => {
		if(mailContent.length < 1 ){
			setErrorSubmit(true);
		}else if(fnContexts.length < 1){setErrorSubmit(true);} 
		else{
			getPosistionOfRefElTwo(secondTxtAreaRef);
			getPosistionOfRefElOne(firstTxtAreaRef);

			getDimensionOfRefElTwo(secondTxtAreaRef);
			getPosistionOfRefElOne(firstTxtAreaRef);

			backdropIsOpen();

			const contArrayStr = fnContexts.toString();
			const fn = `XYW2${ton}XYW2${style}XYW2 WXZYF45${contArrayStr} ::\n${mailContent}`;
			setFinalContent(fn);
			setHasContent(true);
		}
		
	};

	/**
	 * This function sends a POST request to the flask app URL using axios and 
	 * sets the apiResponse state with the response data.
	 */
	const requestGpt = async () => {
		const fnUrl = new URL(`/${finalContent}`, baseUrl);
		const href = fnUrl.href.replaceAll('?', 'WXZZ');

		const response = await axios.post(href);
		setApiResponse(response.data);
	};

	/**
	 * Set the visibility of the backdrop.
	 */
	const backdropIsOpen = () => {
		getPosistionOfRefElTwo(secondTxtAreaRef);
		getPosistionOfRefElOne(firstTxtAreaRef);

		getDimensionOfRefElTwo(secondTxtAreaRef);
		getPosistionOfRefElOne(firstTxtAreaRef);
		setOpen(!open);
	};

	if (hasContent) {
		requestGpt().then(() => backdropIsOpen());
		setHasContent(false);
	}

	/**
	 * Get the position of a react element.
	 * @param value The Ref of the element.
	 */
	const getPosistionOfRefElTwo = (value) => {
		const xVal = value?.current?.offsetLeft;
		setX(xVal);

		const yVal = value?.current?.offsetTop;
		setY(yVal);
	};

	/**
	 * Get the position of a react element.
	 * @param value The Ref of the element.
	 */
	const getPosistionOfRefElOne = (value) => {
		const xVal = value?.current?.offsetLeft;
		setXFirstArea(xVal);

		const yVal = value?.current?.offsetTop;
		setYFirstArea(yVal);
	};

	/**
	 * Get the dimensions of a react element.
	 * @param value The Ref of the element.
	 */
	const getDimensionOfRefElTwo = (value) => {
		const elmRect = value.current.getBoundingClientRect();

		const hVal = elmRect.height;
		setH(hVal);

		const wVal = elmRect.width;
		setW(wVal);
	};

	/**
	 * Get the dimensions of a react element.
	 * @param value The Ref of the element.
	 */
	const getDimensionOfRefElOne = (value) => {
		const elmRect = value.current.getBoundingClientRect();

		const hVal = elmRect.height;
		setHFirstArea(hVal);

		const wVal = elmRect.width;
		setWFirstArea(wVal);
	};
	
	const onWindowResize = () => {
		getPosistionOfRefElTwo(secondTxtAreaRef);
		getPosistionOfRefElOne(firstTxtAreaRef);

		getDimensionOfRefElTwo(secondTxtAreaRef);
		getDimensionOfRefElOne(firstTxtAreaRef)
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
		const timer = setTimeout(() => handleClick(), 1000);
	}, [mailContent]);
	
	useEffect(() => {
		getPosistionOfRefElTwo(secondTxtAreaRef);
		getPosistionOfRefElOne(firstTxtAreaRef);

		getDimensionOfRefElTwo(secondTxtAreaRef);
		getDimensionOfRefElOne(firstTxtAreaRef);
	}, []);

	useEffect(() => {
		incrCounter()
	}, [items]);
	
	window.addEventListener('resize', onWindowResize);
	window.addEventListener('scroll', onWindowResize);

	return (
		<Box display={"flex"} flexDirection={"column"} marginTop={'30px'}>
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
						ref={firstTxtAreaRef}
						disabled={false}
						minRows={10}
						placeholder="Contenu du mail..."
						size="lg"
						variant="solid"
						sx={{
							minWidth: '500px',
						}}
						onChange={handleChange}
					/>
					<Backdrop sx={{ position: 'absolute', color: 'fff', left: xFirstArea, top: yFirstArea, width: wFirstArea, height: hFirstArea, borderRadius: '8px' }} open={open}>
						<CircularProgress color="inherit" />
					</Backdrop>
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
						id='txt-2'
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
			<Box visibility={errorSubmit ? 'visible' : 'hidden'} sx={{marginTop: errorSubmit ? '20px' : '0', height: errorSubmit ? '48px' : '0'}}>
				<Alert severity="error"><b>Considère ajouter du contexte pour avoir une réponse plus aligné avec le contexte de ton mail</b></Alert>
			</Box>
			<Box
				display="flex"
				flexDirection="row"
				alignItems="center"
				justifyContent="flex-start"
				width="100%"
				gap={16}
			>
				<Box height={"450px"} width={"500px"} marginTop={"20px"} justifyContent={"center"}>
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
