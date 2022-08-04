import type { NextApiRequest, NextApiResponse } from 'next';
import { IDiscoveryStatsData } from '../../models/IDiscoveryStatsData';

const getDiscoveryStats = (req: NextApiRequest, res: NextApiResponse) => {
	const query = req.query;
	const { numbersStartDate, numbersEndDate } = query;

	console.log('dates', numbersStartDate, numbersEndDate);

	if(!numbersStartDate || !numbersEndDate) {
		res.statusCode = 400;
		res.end(null);
	}

  return getDataInternal(numbersStartDate as string, numbersEndDate as string).then(result => {
		if(!result) {
			res.statusCode = 400;
			res.end(result);
		}
		else {
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(result));
		}
	});
}

const getDataInternal = async (numbersStartDate: string, numbersEndDate: string): Promise<IDiscoveryStatsData | null> => {
	// Numbers data
	const numbersData = await (await fetch('https://cneos.jpl.nasa.gov/stats/numbers.json')).json();

	let startRow = null;
	let endRow = null;
	for(let i = 0; i < numbersData.data.length; i++) {
		const row = numbersData.data[i];

		console.log(row[0], 'comp to', numbersStartDate, numbersEndDate);
		if(row[0] === numbersStartDate) {
			startRow = row;
		}
		else if(row[0] === numbersEndDate) {
			endRow = row;
		}
	}

	console.log('start end', startRow, endRow);

	// NEA Totals data
	const neaTotals = await (await fetch('https://cneos.jpl.nasa.gov/stats/nea_totals.json')).json();

	if(startRow && endRow) {
		return {
			neasDiscovered140m: (parseInt(endRow[9]) - parseInt(startRow[9])),
			neasDiscovered1km: (parseInt(endRow[8]) - parseInt(startRow[8])),
			neasDiscovered: (parseInt(endRow[10]) - parseInt(startRow[10])),
			cometsDiscovered: (parseInt(endRow[1]) - parseInt(startRow[1])),

			neasDiscovered140mAllTime: neaTotals['140m+'],
			neasDiscovered1kmAllTime: neaTotals['1km+'],
			neasDiscoveredAllTime: neaTotals['all'],
		}
	}
	else {
		return null;
	}
}

export default getDiscoveryStats;