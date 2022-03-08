import execQuery from '../../helper/executeQuery';
import validateInt from '../../helper/validateInt';

export default async function handler(req, res) {
	// Only allow GET requests
	if (req.method != 'GET') {
		res.status(405).end();
		return;
	}

	try {
		const groupSize = req.query.interval || 100;
		if (!validateInt(req, res, groupSize, 'group size')) {
			return;
		}
		const limit = req.query.limit || 10;
		if (!validateInt(req, res, limit, 'limit')) {
			return;
		}

		const results = await execQuery({
			query: `
			SELECT calories, AVG(price_cents) as average_price_cents
			FROM (
				SELECT ROUND(calories/${groupSize}) * ${groupSize} as calories, price_cents
				FROM Items
			) r
			GROUP BY calories
			ORDER BY calories ASC
			LIMIT ${limit};
			`,
		});

		// Convert price cents to dolar amount
		results.forEach((row) => {
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
