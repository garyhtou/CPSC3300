import execQuery from '../../helper/executeQuery';
import db from '../../utils/db';

const itemsTable = 'Items';
export default async function handler(req, res) {
	try {
		if (req.method == 'GET') {
			const limit = req.query.limit || 10;
			const escapedLimit = parseInt(limit);
			if (isNaN(escapedLimit)) {
				res
					.status(400)
					.json({ error: { message: 'Invalid limit.' } })
					.end();
				return;
			}

			const order =
				(['ASC', 'DESC'].includes(req.query.order) ? req.query.order : null) ||
				'ASC';

			const results = await execQuery({
				query: `SELECT * FROM ${itemsTable} ORDER BY id ${order} LIMIT ${escapedLimit};`,
			});
			results.forEach((row) => {
				row.price = '$' + Math.round(row.price_cents) / 100;
				delete row.price_cents;
			});

			res.status(200).json({ results, meta: { count: results.length } });
		} else if (req.method == 'PUT') {
			const id = req.body.id?.trim();
			const price = req.body.price;

			if (!id || !price) {
				res.status(400).json({
					error: {
						message: 'Missing required fields. Item ID and Price are required',
					},
				});
				return;
			}

			const escapedId = db.escape(id);
			const escapedPrice = db.escape(parseInt(price));

			if (isNaN(escapedPrice)) {
				res.status(400).json({ error: 'Price must be a number' });
				return;
			}

			const execUpate = await execQuery({
				query: `
				UPDATE ${itemsTable}
				SET price_cents = ${escapedPrice}
				WHERE id = ${escapedId};
				`,
			});
			console.log(execUpate);

			if (execUpate.affectedRows == 0) {
				res.status(404).json({ error: 'Item not found' });
				return;
			}

			// Tuple updated. Now get the updated value

			const execResults = await execQuery({
				query: `
				SELECT *
				FROM ${itemsTable}
				WHERE id = ${escapedId};
				`,
			});

			const results = execResults.map((row) => {
				row.price = '$' + Math.round(row.price_cents) / 100;
				delete row.price_cents;
				return row;
			});

			// [
			// 	{
			// 		status: 'Success',
			// 		item_id: execResults[0].id,
			// 		name: execResults[0].name,
			// 		price: '$' + execResults[0].price_cents / 100,
			// 		calories: execResults[0].calories,
			// 	},
			// ];

			res.status(200).json({ results, meta: { count: results.length } });
		} else {
			res.status(405).end();
			return;
		}
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: err });
	}
}
