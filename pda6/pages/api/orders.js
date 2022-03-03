import execQuery from '../../helper/executeQuery';

const CustomersTable = 'Customers';
export default async function handler(req, res) {
	// Only allow GET requests
	if (req.method !== 'GET') {
		res.status(405).end();
		return;
	}

	const name = req.query.name || '';
	const limit = req.query.limit || 10;

	try {
		const results = await execQuery({
			query: `
			SELECT c.id as customer_id, c.name, c.email, c.phone, o.id as order_id,
				o.date, o.store_id
			FROM Orders o
			INNER JOIN Customers c on o.customer_id = c.id
			WHERE c.name LIKE '%${name}%'
			ORDER BY o.date DESC
			LIMIT ${limit};
			`,
		});

		res.status(200).json({ results, meta: { count: results.length } });
	} catch (err) {
		res.status(500).json({ error: err });
	}
}
