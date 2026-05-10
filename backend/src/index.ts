import express, { type Express, type Request, type Response } from "express";
import { getTodos, type Todo } from "./db/todo.js";

const port = 8000;

const app: Express = express();


app.get('/', async (req: Request, res: Response) => {
	try {
		res.send('Hello World! Todo API is ready.');
	} catch(error) {
		console.error(error);
		res.status(500).send('Internal Server Error');
	}
});

app.get('/todos', async (req: Request, res: Response) => {
	try {
		const todos: Todo[] = await getTodos();
		res.json(todos);
	} catch(error) {
		console.error('Database connection failed:', error);
		res.status(500).send('Internal Server Error');
	}
});

app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
})