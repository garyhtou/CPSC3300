export default async function validateInt(req, res, value, name) {
	const valueInt = parseInt(value);
	if (isNaN(valueInt)) {
		res
			.status(400)
			.json({ error: { message: `Invalid ${name}.` } })
			.end();
		return false;
	}
	return true;
}
