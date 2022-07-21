import { PDFDocument } from 'pdf-lib';

/**
 * Fetches By the Numbers Data from the API and loads the data into
 * a PDF, then downloads the PDF.
 */
export default async function downloadByTheNumbersPdf() {
	const res = await fetch('/PlanetaryDefenseByTheNumbers_FillablePDF.pdf');
	const buffer = await res.arrayBuffer();
	const doc = await PDFDocument.load(buffer);
	const form = doc.getForm();

	const byTheNumbersPdfData = await (await fetch('/api/getByTheNumbersPdfData')).json();
  
	form.getTextField('program_years').setText(byTheNumbersPdfData.program_years);
	form.getTextField('neas_discovered').setText(byTheNumbersPdfData.neas_discovered);
	form.getTextField('neas_greater_than_1km').setText(byTheNumbersPdfData.neas_greater_than_1km);
	form.getTextField('neas_greater_than_140m').setText(byTheNumbersPdfData.neas_greater_than_140m);
	form.getTextField('neas_within_moon').setText(byTheNumbersPdfData.neas_within_moon);
	form.getTextField('observations_submitted_to_mpc').setText(byTheNumbersPdfData.observations_submitted_to_mpc);
	form.getTextField('date_generated').setText(byTheNumbersPdfData.date_generated);
	form.getTextField('current_phas').setText(byTheNumbersPdfData.current_phas);
	form.getTextField('necs_known').setText(byTheNumbersPdfData.necs_known);

	const encodedUri = await doc.saveAsBase64({ dataUri: true });

	const now = new Date();
	const a = document.createElement("a");
	a.href = encodedUri;
	a.download = `ByTheNumbers-${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate() + 1}.pdf`;
	a.click();
}