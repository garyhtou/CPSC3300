import execQuery from '../../helper/executeQuery';
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
		if (!name.trim()) {
			res
				.status(400)
				.json({ error: { message: 'Invalid name.' } })
				.end();
			return;
		}

		const escapedName = db.escape(name);
		const limit = req.query.limit || 10;
		const escapedLimit = parseInt(limit);
		if (isNaN(escapedLimit)) {
			res
				.status(400)
				.json({ error: { message: 'Invalid limit.' } })
				.end();
			return;
		}

		const results = await execQuery({
			query: `
			SELECT c.id as customer_id, c.name, c.email, c.phone, o.id as order_id,
				o.date, o.store_id
			FROM Orders o
			INNER JOIN Customers c on o.customer_id = c.id
			WHERE c.name LIKE '%${escapedName}%'
			ORDER BY o.date DESC
			LIMIT ${escapedLimit};
			`,
		});

		res.status(200).json({ results, meta: { count: results.length } });
	} catch (err) {
		res.status(500).json({ error: err });
	}
}
