import execQuery from '../../helper/executeQuery';
import validateInt from '../../helper/validateInt';
import db from '../../utils/db';

const CustomersTable = 'Customers';
export default async function handler(req, res) {
	// Only allow GET requests
	if (req.method != 'GET') {
		res.status(405).end();
		return;
	}

	try {
		const name = req.query.name || '';

		const limit = req.query.limit || 10;
		if (!validateInt(req, res, limit, 'limit')) {
			return;
		}

		const results = await execQuery({
			query: `
			SELECT c.id as customer_id, c.name, c.email, c.phone, o.id as order_id,
				o.date, o.store_id
			FROM Orders o
			INNER JOIN Customers c on o.customer_id = c.id
			WHERE c.name LIKE ?
			ORDER BY o.date DESC
			LIMIT ${limit};
			`,
			values: [`%${name}%`],
		});

		res.status(200).json({ results, meta: { count: results.length } });
	} catch (err) {
		res.status(500).json({ error: err });
	}
}
