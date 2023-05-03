import { NextApiRequest, NextApiResponse } from "next";

/**
 * Retrives the nea_totals.json file from CNEOS
 */
const getNeaTotals = (req: NextApiRequest, res: NextApiResponse) => {
  return getDataInternal()
    .then(data => {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(data));
    });
}

const getDataInternal = async (): Promise<unknown> => {
  const data = await (await fetch('https://cneos.jpl.nasa.gov/stats/nea_totals.json')).json();

  return data;
}

export default getNeaTotals;