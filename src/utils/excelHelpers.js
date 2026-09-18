import { utils, read } from "xlsx";
import { HEADER_ALIASES } from "../constants/excel.js";

const parseExcelBuffer = (buffer) => {
  const workbook = read(buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  return utils.sheet_to_json(sheet);
};

const buildHeaderMap = (rawHeaders) => {
  const map = {};

  for (const header of rawHeaders) {
    const normalizedHeader = header.trim().toLowerCase();

    for (const [key, aliases] of Object.entries(HEADER_ALIASES)) {
      if (aliases.includes(normalizedHeader)) {
        map[header] = key;
        break;
      }
    }
  }
  return map;
};

const mapRow = (row, headerMap) => {
  const mappedRow = {};
  for (const [header, field] of Object.entries(headerMap)) {
    mappedRow[field] = row[header];
  }

  return mappedRow;
};

export { parseExcelBuffer, buildHeaderMap, mapRow };
