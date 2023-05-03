import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * Gets the number of observations that have been submitted
 * to the minor planet center by scraping the MPC website.
 * Value reported in the millions.
 */
const getCadData = (req: NextApiRequest, res: NextApiResponse) => {
	if (req.query['dateMin'] && req.query['dateMax']) {
		return getDataInternal(req.query['dateMin'] as string, req.query['dateMax'] as string).then((result: string) => {
			res.setHeader('Content-Type', 'application/json');
			res.end(result);
		});
	}
	else {
		res.status(404);
		res.end();
	}
}

// Internal function for getting data
const getDataInternal = async (dateMin: string, dateMax: string): Promise<string> => {
	// MPC site parsing
	const data = await (await fetch(`https://ssd-api.jpl.nasa.gov/cad.api%3Fdate-min=${dateMin}%26date-max=${dateMax}%26dist-max=1LD`)).text();

	return data;
}

export default getCadData;