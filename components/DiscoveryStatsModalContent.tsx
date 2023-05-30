import { useEffect, useState } from 'react';
import { IDiscoveryStatsData } from '../models/IDiscoveryStatsData';
import { getDiscoveryStats } from '../utils/getDiscoveryStats';
import Button from './Button';

/**
 * Popup modal that promps user for a time period (fiscal or calendar year)
 * and year, then fetches and displays the discovery stats for that time.
 */
export default function DiscoveryStatsModalContent() {
	const [timePeriod, setTimePeriod] = useState('placeholder');
	const [year, setYear] = useState('placeholder');

	const [isButtonLoading, setIsButtonLoading] = useState(false);
	
	const [discoveryStats, setDiscoveryStats] = useState<IDiscoveryStatsData | null>(null);
	const [cadData, setCadData] = useState<{
		neosPassingWithin1LD: string;
		neosPassingWithinGeo: string;
	} | null>(null);

	const [displayedTimePeriod, setDisplayedTimePeriod] = useState('');
	const [displayedYear, setDisplayedYear] = useState('');
	const [displayedStartDate, setDisplayedStartDate] = useState('');
	const [displayedEndDate, setDisplayedEndDate] = useState('');
	const [displayedCadStartDate, setDisplayedCadStartDate] = useState('');
	const [displayedCadEndDate, setDisplayedCadEndDate] = useState('');

	const [years, setYears] = useState<number[]>([]);
	const [fyYears, setFyYears] = useState<number[]>([]);

	useEffect(() => {
		// Generate year elements
		let today = new Date();
		let elements = [];
		for(var i = 0; i < (today.getFullYear() - 2009); i++) {
			elements.push(today.getFullYear() - i);
		}

		let fyYearsCopy = [...elements];
		// Next years FY has started
		if(today.getMonth() > 8) {
			fyYearsCopy.unshift(today.getFullYear() + 1);
		}

		setYears(elements);
		setFyYears(fyYearsCopy);
	}, []);

	// Load data for selected time perido and year
	const loadData = async () => {
		setIsButtonLoading(true);
		setDiscoveryStats(null);
		setCadData(null);

		let numbersStartDateString = ``;
		let numbersEndDateString = ``;

		let cadStartDateString = ``;
		let cadEndDateString = ``;

		if(timePeriod === 'fiscalYear') {
			const today = new Date();

			numbersStartDateString = cadStartDateString = `${parseInt(year) - 1}-10-01`;
			numbersEndDateString = `${parseInt(year)}-10-01`;
			cadEndDateString = `${parseInt(year)}-09-30`;

			// Current year selected and fiscal year not over yet
			if(parseInt(year) === today.getFullYear() && today.getMonth() <= 8) {
				numbersStartDateString = `${parseInt(year) - 1}-10-01`;
				numbersEndDateString = `${parseInt(year)}-${String(today.getMonth() + 1).padStart(2, '0')}-01`;
				cadEndDateString = `${parseInt(year)}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
			}
		}
		else {
			const today = new Date();

			numbersStartDateString = cadStartDateString = `${parseInt(year)}-01-01`;
			numbersEndDateString = `${parseInt(year) + 1}-01-01`;
			cadEndDateString = `${parseInt(year)}-12-31`;

			// Current year selected
			if(parseInt(year) === today.getFullYear()) {
				numbersEndDateString = `${parseInt(year)}-${String(today.getMonth() + 1).padStart(2, '0')}-01`;
				cadEndDateString = `${parseInt(year)}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
			}
		}

		const discoveryStats: IDiscoveryStatsData | null = await getDiscoveryStats(numbersStartDateString, numbersEndDateString);
		if(discoveryStats) {
			setDiscoveryStats(discoveryStats);
			setDisplayedStartDate(numbersStartDateString);
			setDisplayedEndDate(discoveryStats.actualFetchedEndDate);
		}
		else {
			console.log("no discovery stats :(");
		}

		const cadData = await(await fetch(`/api/getCadData?dateMin=${cadStartDateString}&dateMax=${cadEndDateString}&distMax=1LD`)).json();
		let belowGeo = 0;
		cadData.data.forEach((element: string[]) => {
			if(parseFloat(element[4]) < 0.00023920795) {
				belowGeo += 1;
			}
		});
		setCadData({
			neosPassingWithin1LD: cadData.count,
			neosPassingWithinGeo: belowGeo.toFixed(0)
		});
		setDisplayedCadStartDate(cadStartDateString);
		setDisplayedCadEndDate(cadEndDateString);

		setIsButtonLoading(false);
		setDisplayedYear(year);
		setDisplayedTimePeriod(timePeriod);
	}

	const isFyPartial = (year: number) => {
		const today = new Date();
		return (year === today.getFullYear() && (today.getMonth() <= 8)) || year > today.getFullYear();
	}

	return (
		<div className='flex flex-col items-start pb-10'>
			<span className='text-white pb-1'>
				Time period?
			</span>

			<select value={timePeriod} onChange={e => setTimePeriod(e.target.value)}>
				<option disabled value='placeholder'>
					Please select an option
				</option>

				<option value='fiscalYear'>
					Fiscal Year
				</option>

				<option value='calendarYear'>
					Calendar Year
				</option>
			</select>

			{timePeriod !== 'placeholder' && <>
				<span className='text-white pb-1 pt-5'>
					Year?
				</span>

				<select value={year} onChange={e => setYear(e.target.value)}>
					<option disabled value='placeholder'>
						Please select an option
					</option>

					{(timePeriod === 'fiscalYear' ? fyYears : years).map((item, index) => (
						<option key={index} value={item}>
							{timePeriod === 'fiscalYear' && 'FY'}{item}{isFyPartial(item) && ' (Partial)'}
						</option>
					))}
				</select>
			</>}

			{timePeriod !== 'placeholder' && year !== 'placeholder' &&
			<Button
				onClick={loadData}
				className='mt-5'
				loading={isButtonLoading}
			>
				Load
			</Button>}

			{!!discoveryStats && !!cadData &&
			<div className='flex flex-col items-start w-full'>
				<span className='text-white text-lg mt-5 font-semibold'>
					Data for {displayedTimePeriod === 'fiscalYear' && 'FY'}{displayedYear}
				</span>

				<DiscoveryStatRow title='NEAs Discovered (>140m)' data={discoveryStats.neasDiscovered140m} />
				<DiscoveryStatRow title='NEAs Discovered (>1km)' data={discoveryStats.neasDiscovered1km} />
				<DiscoveryStatRow title='NEAs Discovered (all)' data={discoveryStats.neasDiscovered} />
				<DiscoveryStatRow title='Comets Discovered' data={discoveryStats.cometsDiscovered} />
				<DiscoveryStatRow title='NEOs Passed Within 1LD' data={cadData.neosPassingWithin1LD} />
				<DiscoveryStatRow title='NEOs Passed Within Geostationary Orbit' data={cadData.neosPassingWithinGeo} />

				<span className='text-white text-lg mt-5 font-semibold'>
					Data for All Time
				</span>

				<DiscoveryStatRow title='NEAs Discovered (>140m)' data={discoveryStats.neasDiscovered140mAllTime} />
				<DiscoveryStatRow title='% NEAs Discovered (>140m)' data={(parseFloat(String(discoveryStats.neasDiscovered140mAllTime)) / 25000 * 100).toFixed(1) + '%'} />
				<DiscoveryStatRow title='NEAs Discovered (>1km)' data={discoveryStats.neasDiscovered1kmAllTime} />
				<DiscoveryStatRow title='NEAs Discovered (all)' data={discoveryStats.neasDiscoveredAllTime} />

				<span className='text-sm text-gray-400 mt-3'>
					<b>Note:</b>&nbsp;Most data is from <b>{displayedStartDate}</b> to <b>{displayedEndDate}</b>, due to the way data is reported. NEOs within 1LD 
					and GEO is from <b>{displayedCadStartDate}</b> to <b>{displayedCadEndDate}</b>.
				</span>
			</div>}
		</div>
	)
}

function DiscoveryStatRow({title, data}: { title: string, data: string | number }) {
	return (
		<div className='text-gray-100 mb-3'>
			<span className='text-gray-300'>
				{title}:
			</span>
			&nbsp;
			<span className='font-semibold'>
				{data}
			</span>
		</div>
	)
}