import execQuery from '../../helper/executeQuery';
import db from '../../utils/db';

const ItemsTable = 'Items';
export default async function handler(req, res) {
	if (req.method !== 'PUT') {
		res.status(405).end();
		return;
	}

	try {
		const id = db.escape(req.query.id);
		const price = parseInt(db.escape(req.query.price));

		if (isNaN(price)) {
			res
				.status(400)
				.json({ error: { message: 'Invalid price.' } })
				.end();
			return;
		}

		const results = await execQuery({
			query: `
			UPDATE ${ItemsTable}
			SET price_cents = ${price}
			WHERE id = ${id};
			`,
		});

		res.status(200).json({ results, meta: { count: results.length } });
	} catch (err) {
		res.status(500).json({ error: err });
	}
}
