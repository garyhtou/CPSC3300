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
			const name = req.body.name?.trim();
			const email = req.body.email?.trim();
			const phone = req.body.phone?.trim();

			if (!name || !email || !phone) {
				res.status(400).json({
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

			const execResults = await execQuery({
				query: `
				INSERT INTO ${CustomersTable} (name, email, phone)
				VALUES (${escapedName}, ${escapedEmail}, ${escapedPhone});
				`,
			});

			const results = [
				{
					status: 'Success',
					customer_id: execResults.insertId,
					name: name,
					email: email,
					phone: phone,
				},
			];

			res.status(200).json({ results, meta: { count: results.length } });
		} else if (req.method == 'DELETE') {
			const id = db.escape(req.body.id);
			if (!id.trim()) {
				res.status(400).json({ error: 'Missing id' });
				return;
			}

			const execDelete = await execQuery({
				query: `DELETE FROM ${CustomersTable} WHERE id = ${id};`,
			});
			console.log(execDelete);

			if (execDelete.affectedRows === 0) {
				res.status(404).json({ error: 'Customer not found' });
				return;
			}

			const results = {
				status: 'Success',
			};

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
