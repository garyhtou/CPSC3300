import execQuery from '../../helper/executeQuery';
import db from '../../utils/db';

const CustomersTable = 'Customers';
export default async function handler(req, res) {
	try {
		if (req.method == 'GET') {
			const limit = req.query.limit || 10;
			const order =
				(['ASC', 'DESC'].includes(req.query.order) ? req.query.order : null) ||
				'ASC';

			const results = await execQuery({
				query: `SELECT * FROM ${CustomersTable} ORDER BY id ${order} LIMIT ${limit};`,
			});

			res.status(200).json({ results, meta: { count: results.length } });
		} else if (req.method == 'POST') {
			const name = req.body.name;
			const email = req.body.email;
			const phone = req.body.phone;

			if (!name.trim() || !email.trim() || !phone.trim()) {
				res
					.status(400)
					.json({
						error: {
							message:
								'Missing required fields. Name, Email, and Phone are required',
						},
					});
				return;
			}

			const escapedName = db.escape(name);
			const escapedEmail = db.escape(email);
			const escapedPhone = db.escape(phone);

			const results = await execQuery({
				query: `
				INSERT INTO ${CustomersTable} (name, email, phone)
				VALUES (${escapedName}, ${escapedEmail}, ${escapedPhone});
				`,
			});

			res.status(200).json({ results, meta: { count: results.length } });
		} else if (req.method == 'DELETE') {
			const id = db.escape(req.body.id);
			if (!id.trim()) {
				res.status(400).json({ error: 'Missing id' });
				return;
			}

			const results = await execQuery({
				query: `DELETE FROM ${CustomersTable} WHERE id = ${id};`,
			});

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
