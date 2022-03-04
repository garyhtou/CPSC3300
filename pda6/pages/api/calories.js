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
		const groupSize = req.query.interval || 100;
		const escapedGroupSize = db.escape(groupSize);
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
			SELECT calories, AVG(price_cents) as average_price_cents
			FROM (
				SELECT ROUND(calories/${escapedGroupSize}) * ${escapedGroupSize} as calories, price_cents
				FROM Items
			) r
			GROUP BY calories
			ORDER BY calories ASC
			LIMIT ${escapedLimit};
			`,
		});

		// Convert price cents to dolar amount

		results.map((row) => {
			if (row.calories == null) {
				row.calories = 'No Calorie Data';
			}
			row.average_price = '$' + Math.round(row.average_price_cents) / 100;
			delete row['average_price_cents'];
			return row;
		});

		res.status(200).json({ results, meta: { count: results.length } });
	} catch (err) {
		res.status(500).json({ error: err });
	}
}
