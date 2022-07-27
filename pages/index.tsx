import type { NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import Card from '../components/Card';
import Modal from '../components/Modal';
import { IByTheNumbersData } from '../models/IByTheNumbersData';
import downloadByTheNumbersPdf from '../utils/downloadByTheNumbersPdf';

/**
 * Home page for the site
 */
const Home: NextPage = () => {
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [isByTheNumbersDataLoading, setIsByTheNumbersDataLoading] = useState(false);

  const [isDataModalShown, setIsDataModalShown] = useState(false);
  const [dataModalData, setDataModalData] = useState<{ title: string; data: (string | number); }[]>([]);

  return (
    <div className='bg-black w-full min-h-full px-8 pt-8 pb-3 flex flex-col'>
      <Modal
        isShown={isDataModalShown}
        close={() => setIsDataModalShown(false)}
      >
        <div className='flex flex-col items-start w-full pb-5'>
          {dataModalData.map((item, index) => (
            <div className='text-gray-100 mb-3' key={index}>
              <span className='text-gray-300'>
                {item.title}:
              </span>
              &nbsp;
              <span className='font-semibold'>
                {item.data}
              </span>
            </div>
          ))}
        </div>
      </Modal>

      <Head>
        <title>PDCO Resources &amp; Utilities</title>
        <meta name="description" content="Resources and utilities for PDCO" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className='flex flex-col items-start justify-start'>
        <h1 className='text-4xl font-semibold text-gray-100'>
          PDCO Resources &amp; Utilities
        </h1>

        <div className='flex flex-col items-start w-full'>
          <Card
            title='Planetary Defense By the Numbers PDF'
            subtitle='Download an auto-filled PDF graphic'
            image='/PlanetaryDefenseByTheNumbersPDF_Image.jpg'
            alt='PDF with data relating to planetary defense, such as NEOs discovered.'
            width={1354}
            height={1812}
            buttonText='Download PDF'
            onClick={async () => {
              if(!isPdfLoading) {
                setIsPdfLoading(true);              
                await downloadByTheNumbersPdf();
                setIsPdfLoading(false);
              }
            }}
            isButtonLoading={isPdfLoading}
          />

          <Card
            title='Planetary Defense By the Numbers Data'
            subtitle='Fetch and display the Planetary Defense By the Numbers data'
            image='/PlanetaryDefenseByTheNumbersYT.jpg'
            alt='Planetary defense by the numbers text in center, with two asteroids and a satellite in the back'
            width={2528}
            height={1284}
            buttonText='Fetch &amp; Display Data'
            onClick={async () => {
              if(!isByTheNumbersDataLoading) {
                setIsByTheNumbersDataLoading(true);
                const byTheNumbersData: IByTheNumbersData = await (await fetch('/api/getByTheNumbersData')).json();
                const observationsSubmittedToMpc = await (await fetch('/api/getNumberObservationsMpc')).text();
                setIsByTheNumbersDataLoading(false);

                setDataModalData([
                  {
                    title: 'Years of Program',
                    data: byTheNumbersData.yearsOfProgram
                  },
                  {
                    title: 'Total NEAs Discovered',
                    data: byTheNumbersData.totalNeasDiscovered
                  },
                  {
                    title: 'Total NEAs Discovered >140m',
                    data: byTheNumbersData.totalNeasDiscoveredGreaterThan140m
                  },
                  {
                    title: 'Total NEAs Discovered >1km',
                    data: byTheNumbersData.totalNeasDiscoveredGreaterThan1km
                  },
                  {
                    title: 'Estimated NEAs >140m Left to Be Discovered',
                    data: 25000 - byTheNumbersData.totalNeasDiscoveredGreaterThan140m
                  },
                  {
                    title: 'Known Asteroids That Passed Closer Than the Moon in the Past 365 Days',
                    data: byTheNumbersData.neasWithinMoonPast365Days
                  },
                  {
                    title: 'Known Asteroids That Passed Closer Than the Moon in the Past 30 Days',
                    data: byTheNumbersData.neasWithinMoonPast30Days
                  },
                  {
                    title: 'Observations Submitted to MPC',
                    data: observationsSubmittedToMpc + ' million'
                  }
                ]);
                setIsDataModalShown(true);
              }
            }}
            isButtonLoading={isByTheNumbersDataLoading}
          />
        </div>
      </main>

      <footer className='mt-auto text-sm text-gray-400 pt-10 md:pt-0'>
        <a className='border-b-gray-100 hover:text-gray-100 hover:border-b' href='https://small-bodies-node.github.io/pdco-dashboard' target='_blank' rel='noopener noreferrer'>
          PDCO Dashboard
        </a>
      </footer>
    </div>
  )
}

export default Home
