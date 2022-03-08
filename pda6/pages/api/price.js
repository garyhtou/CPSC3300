import execQuery from '../../helper/executeQuery';
import validateInt from '../../helper/validateInt';
import db from '../../utils/db';

const ItemsTable = 'Items';
export default async function handler(req, res) {
	if (req.method != 'PUT') {
		res.status(405).end();
		return;
	}

	try {
		const id = db.escape(req.query.id);
		const price = db.escape(req.query.price);
		if (!validateInt(req, res, price, 'price')) {
			return;
		}

		const results = await execQuery({
			query: `
			UPDATE ?
			SET price_cents = ?
			WHERE id = ?;
			`,
			values: [ItemsTable, price, id],
		});

		res.status(200).json({ results, meta: { count: results.length } });
	} catch (err) {
		res.status(500).json({ error: err });
	}
}
