import express, { type Express, type Request, type Response } from "express";
import { getTodos, createTodo, type Todo } from "./db/todo.js";
import cors from "cors";
const port = 8000;

const app: Express = express();
app.use(cors({
	origin: "http://localhost:3000",
	methods: ["GET", "POST", "PUT", "DELETE"],
	credentials: true,
}));
app.use(express.json());

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

app.post('/todos', async (req: Request, res: Response) => {
		const { title } = req.body;
		try {
			const newTodo: Todo = await createTodo(title);
			res.status(201).json(newTodo);
		} catch(error) {
			console.error('Failed to create todo:', error);
			res.status(500).send('Internal Server Error');
		}
})

app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
})