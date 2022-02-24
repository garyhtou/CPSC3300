import execQuery from '../../helper/executeQuery';

const CustomersTable = 'Customers';
export default async function handler(req, res) {
	// Only allow GET requests
	if (req.method !== 'GET') {
		res.status(405).end();
		return;
	}

	const groupSize = req.query.groupSize || 100;
	const limit = req.query.limit || 10;

	try {
		const results = await execQuery({
			query: `
			SELECT calories, AVG(price_cents) as average_price_cents
			FROM (
				SELECT ROUND(calories/${groupSize}) * ${groupSize} as calories, price_cents
				FROM Items
			) r
			GROUP BY calories
			ORDER BY average_price_cents DESC
			LIMIT ${limit};
			`,
		});

		res.status(200).json({ results, meta: { count: results.length } });
	} catch (err) {
		res.status(500).json({ error: err });
	}
}
