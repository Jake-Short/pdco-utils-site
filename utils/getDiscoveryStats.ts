export const getDiscoveryStats = async (numbersStartDate: string, numbersEndDate: string) => {
	// https://us-central1-healthy-earth-356019.cloudfunctions.net/discovery-stats
	// Fetch the numbers data
	const numbersData = await (await fetch('https://us-central1-healthy-earth-356019.cloudfunctions.net/discovery-stats?url=https://cneos.jpl.nasa.gov/stats/numbers.json')).json();

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

	// Fetch NEA totals data
	const neaTotals = await (await fetch('https://us-central1-healthy-earth-356019.cloudfunctions.net/discovery-stats?url=https://cneos.jpl.nasa.gov/stats/nea_totals.json')).json();

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
		}
	}
	// One or both rows not found (likely due to invalid date passed)
	else {
		return null;
	}
}