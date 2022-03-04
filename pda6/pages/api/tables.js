import execQuery from '../../helper/executeQuery';

const tables = ['Customers', 'Items', 'Stores', 'Orders', 'OrderItems'];
export default async function handler(req, res) {
	// Only allow GET requests
	if (req.method != 'GET') {
		res.status(405).end();
		return;
	}

	try {
		const results = Object.assign(
			...(await Promise.all(
				tables.map(async (table) => {
					var result = {};
					result[table] = await execQuery({ query: `DESCRIBE ${table};` });
					return result;
				})
			))
		);

		res.status(200).json({ results, meta: { count: results.length } });
	} catch (err) {
		res.status(500).json({ error: err });
	}
}
