import { parse } from "csv-parse/sync";

async function getSheetData(url) {
  const response = await fetch(url);
  const csv = await response.text();
  return parse(csv, { columns: true });
}

export default getSheetData;
