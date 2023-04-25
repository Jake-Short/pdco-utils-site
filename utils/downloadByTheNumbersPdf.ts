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
	const observationsSubmittedToMpc = await (await fetch('/api/getNumberObservationsMpc')).text();
  
	form.getTextField('program_years').setText(String(byTheNumbersPdfData.program_years));
	form.getTextField('program_years').enableReadOnly();
	form.getTextField('neas_discovered').setText(String(byTheNumbersPdfData.neas_discovered));
	form.getTextField('neas_discovered').enableReadOnly();
	form.getTextField('neas_greater_than_1km').setText(String(byTheNumbersPdfData.neas_greater_than_1km));
	form.getTextField('neas_greater_than_1km').enableReadOnly();
	form.getTextField('neas_greater_than_140m').setText(String(byTheNumbersPdfData.neas_greater_than_140m));
	form.getTextField('neas_greater_than_140m').enableReadOnly();
	form.getTextField('neas_within_moon').setText(String(byTheNumbersPdfData.neas_within_moon));
	form.getTextField('neas_within_moon').enableReadOnly();
	form.getTextField('observations_submitted_to_mpc').setText(String(observationsSubmittedToMpc));
	form.getTextField('observations_submitted_to_mpc').enableReadOnly();
	form.getTextField('date_generated').setText(String(byTheNumbersPdfData.date_generated));
	form.getTextField('date_generated').enableReadOnly();
	form.getTextField('current_phas').setText(String(byTheNumbersPdfData.current_phas));
	form.getTextField('current_phas').enableReadOnly();
	form.getTextField('necs_known').setText(String(byTheNumbersPdfData.necs_known));
	form.getTextField('necs_known').enableReadOnly();

	const encodedUri = await doc.saveAsBase64({ dataUri: true });

	const now = new Date();
	const a = document.createElement("a");
	a.href = encodedUri;
	a.download = `ByTheNumbers-${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate() + 1}.pdf`;
	a.click();
}