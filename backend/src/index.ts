import express, { type Express, type Request, type Response } from "express";
import { Pool } from "pg";

const port = 8000;

const app: Express = express();
const pool = new Pool({
	connectionString: process.env.DATABASE_URL
})


app.get('/', async (req: Request, res: Response) => {
	try {
		const result = await pool.query('SELECT NOW()');
		res.send(`Hello World! DB Time: ${result.rows[0].now}`);
	} catch(error) {
		console.error(error);
		res.status(500).send('Internal Server Error');
	}
});

app.listen(port, async () => {
	console.log('Server is running on port ' + port);
	try {
		await pool.query('SELECT 1');
		console.log('Database connection successful');
	} catch(error) {
		console.error('Database connection failed:', error);
	}
})