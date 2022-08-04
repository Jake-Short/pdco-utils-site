import type { NextApiRequest, NextApiResponse } from 'next';

const getUrlBypassCors = (req: NextApiRequest, res: NextApiResponse) => {
	const query = req.query;
	const { url } = query;

  return fetch(url as string)
		.then((result) => result.text())
		.then((text) => {
			res.setHeader('Content-Type', 'application/json');
			res.end(text);
		});
}

export default getUrlBypassCors;