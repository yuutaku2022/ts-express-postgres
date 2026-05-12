import express, { type Express, type Request, type Response } from "express";
import { getTodos, createTodo, updateTodo, type Todo } from "./db/todo.js";
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

app.get('/todos', async (req, res) => {
  console.log("GET /todos リクエストを受信"); // これがターミナルに出るか？
  try {
    const todos = await getTodos();
    console.log("データ取得成功");
    res.json(todos);
  } catch (error) {
    console.error("エラー発生:", error);
    res.status(500).send("Error"); // catch内でも必ずレスポンスを返す
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

app.put('/todos/:id', async (req: Request, res: Response) => {
	const { id } = req.params;
	const { title } = req.body;
	try {
		if (typeof id !== "string") return;

		const editTodo: Todo = await updateTodo(id, title);
		res.status(200).json(editTodo);
	} catch (error) {
		console.error(`Failed to edit todo:`, error);
		res.status(500).send(`Internal Server Error`);
	}
})

app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
})