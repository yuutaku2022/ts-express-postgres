import { pool } from "./client.js";
import { v4 as uuidv4 } from "uuid";

export type Todo = {
	id: string;
	title: string;
	completed: boolean;
	created_at: string;
};

export async function getTodos(): Promise<Todo[]> {
	const result = await pool.query<Todo>("SELECT * FROM todos ORDER BY created_at DESC");
	return result.rows;
}

export async function createTodo(title: string): Promise<Todo> {
	const id = uuidv4();
	const result = await pool.query<Todo>(
		"INSERT INTO todos (id, title) VALUES ($1, $2) RETURNING *",
		[id, title]
	);

	if (!result.rows[0]) {
		throw new Error("Failed to create todo");
	}

	return result.rows[0];
}
