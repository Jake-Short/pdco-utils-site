import { IDiscoveryStatsData } from "../models/IDiscoveryStatsData";

export const getDiscoveryStats = async (numbersStartDate: string, numbersEndDate: string): Promise<IDiscoveryStatsData | null> => {
	// Fetch the numbers data
	const numbersData = await (await fetch('/api/getNeoNumbers')).json();

	let startRow = null;
	let endRow = null;
	// Search for and store the data rows matching the passed
	// start and end dates
	for(let i = 0; i < numbersData.data.length; i++) {
		const row = numbersData.data[i];

		if(row[0] === numbersStartDate) {
			startRow = row;
		}
		else if(row[0] === numbersEndDate) {
			endRow = row;
		}
	}

	// end row is null, so get the very latest
	if(endRow === null) {
		endRow = numbersData.data[numbersData.data.length - 1];
	}

	// Fetch NEA totals data
	const neaTotals = await (await fetch('/api/getNeaTotals')).json();

	// Both rows were successfully found
	if(startRow && endRow) {
		return {
			neasDiscovered140m: (parseInt(endRow[9]) - parseInt(startRow[9])),
			neasDiscovered1km: (parseInt(endRow[8]) - parseInt(startRow[8])),
			neasDiscovered: (parseInt(endRow[10]) - parseInt(startRow[10])),
			cometsDiscovered: (parseInt(endRow[1]) - parseInt(startRow[1])),

			neasDiscovered140mAllTime: neaTotals['140m+'],
			neasDiscovered1kmAllTime: neaTotals['1km+'],
			neasDiscoveredAllTime: neaTotals['all'],

			actualFetchedEndDate: endRow[0]
		}
	}
	// One or both rows not found (likely due to invalid date passed)
	else {
		return null;
	}
}