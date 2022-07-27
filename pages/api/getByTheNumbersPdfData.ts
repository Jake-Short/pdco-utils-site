import type { NextApiRequest, NextApiResponse } from 'next';
import * as cheerio from 'cheerio';
import { IByTheNumbersPdfData } from '../../models/IByTheNumbersPdfData';

/**
 * Retrives By the Numbers Data for use in PDF.
 */
const getByTheNumbersPdf = (_: NextApiRequest, res: NextApiResponse) => {
  return getPdfInternal().then((result: IByTheNumbersPdfData) => {
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify(result));
	});
}

const getPdfInternal = async (): Promise<IByTheNumbersPdfData> => {
	/**
	 * Data Fetching
	 */

	const padWithLeadingZero = (numToPad: number) => {
		return ('0' + numToPad).slice(-2);
	}

	const now = new Date();

	 const current_year = now.getFullYear();
	 // Pad with a leading zero if necessary
	 const current_month = padWithLeadingZero(now.getMonth() + 1)
	 const current_day = padWithLeadingZero(now.getDate() + 1);
	 
	 // Get date components for one year ago today
	 const date_one_year_ago_today = new Date();
	 date_one_year_ago_today.setFullYear(date_one_year_ago_today.getFullYear() - 1);
	 const one_year_ago_year = date_one_year_ago_today.getFullYear();
	 // Pad with a leading zero if necessary
	 const one_year_ago_month = padWithLeadingZero(date_one_year_ago_today.getMonth() + 1)
	 const one_year_ago_day = padWithLeadingZero(date_one_year_ago_today.getDate() + 1)
	 
	 // Program start date is July 1998
	 let years_of_program = current_year - 1998
	 if (parseInt(current_month) < 7) {
		years_of_program -= 1
	 }

	 // Get JSON from neo_totals.json file
	 const nea_totals = await (await fetch('https://cneos.jpl.nasa.gov/stats/nea_totals.json')).json();

	 // Build URL for data ranging from one year ago to today
	const neos_past_year_1LD_url = `https://ssd-api.jpl.nasa.gov/cad.api?date-min=${one_year_ago_year}-${one_year_ago_month}-${one_year_ago_day}&date-max=${current_year}-${current_month}-${current_day}&dist-max=1LD`;

	// Get the JSON from the URLs constructed above
	const neos_past_year_1LD = await (await fetch(neos_past_year_1LD_url)).json();

	// Get data points to display
	const discovered_neas = nea_totals['all'] as number;
	const discovered_neas_greater_than_140m = nea_totals['140m+'] as number;
	const discovered_neas_greater_than_1km = nea_totals['1km+'] as number;

	// Get the numbers.json file
	const numbers_data = await (await fetch("https://cneos.jpl.nasa.gov/stats/numbers.json")).json();
	const phas_count = numbers_data['data'][numbers_data['data'].length - 1][7] as number;
	const necs_count = numbers_data['data'][numbers_data['data'].length - 1][1] as number;

	return {
		program_years: years_of_program.toString(),
		neas_discovered: discovered_neas.toLocaleString('en-US'),
		neas_greater_than_1km: discovered_neas_greater_than_1km.toLocaleString('en-US'),
		neas_greater_than_140m: discovered_neas_greater_than_140m.toLocaleString('en-US'),
		neas_within_moon: neos_past_year_1LD['count'],
		date_generated: `${now.toLocaleDateString('en-us', { year:"numeric", month:"short", day:"numeric"})}`,
		current_phas: phas_count.toLocaleString('en-US'),
		necs_known: necs_count.toString()
	}
}

export default getByTheNumbersPdf;