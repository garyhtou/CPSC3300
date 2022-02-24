import db from '../utils/db';

export default async function excuteQuery({ query, values }) {
	const results = await db.query(query, values);
	await db.end();
	return results;
}
