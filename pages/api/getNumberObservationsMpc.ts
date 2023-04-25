import type { NextApiRequest, NextApiResponse } from 'next';
import * as cheerio from 'cheerio';

/**
 * Gets the number of observations that have been submitted
 * to the minor planet center by scraping the MPC website.
 * Value reported in the millions.
 */
const getNumberObservationsMpc = (req: NextApiRequest, res: NextApiResponse) => {
  return getDataInternal().then((result: string) => {
		res.setHeader('Content-Type', 'application/json');
		res.end(result);
	});
}

// Internal function for getting data
const getDataInternal = async (): Promise<string> => {
	// MPC site parsing
	const raw_data = await (await fetch('https://minorplanetcenter.net')).text();

	// Load the webpage into cheerio and pull out the observations text
	const $ = cheerio.load(raw_data);
	
	const observations_text = $('span:contains("Observations")')
	.parent().parent().find('td:contains("ALL TIME:")').next().text();

	const total_observations = Math.round(parseFloat(observations_text.replace(/[^\d.-]/g, '')));

	return total_observations.toString();
}

export default getNumberObservationsMpc;