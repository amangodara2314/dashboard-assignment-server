import recordRepository from "./record.repository.js";
import AppError from "../../utils/appError.js";
import {
  buildHeaderMap,
  mapRow,
  parseExcelBuffer,
} from "../../utils/excelHelpers.js";
import {
  createRecordSchema,
  updateRecordSchema,
} from "./record.validations.js";
import buildPagination from "../../utils/buildPagination.js";

const requiredFields = ["name", "email", "phone", "type"];

async function previewUploads(buffer) {
  const rawData = parseExcelBuffer(buffer);

  if (rawData.length === 0) {
    throw new AppError("The uploaded file has no data rows", 400);
  }

  const rawHeaders = Object.keys(rawData[0]);
  const headerMap = buildHeaderMap(rawHeaders);

  const mappedFieldValues = new Set(Object.values(headerMap));

  const missingFields = requiredFields.filter(
    (field) => !mappedFieldValues.has(field),
  );

  if (missingFields.length > 0) {
    throw new AppError(
      `Missing required fields: ${missingFields.join(", ")}`,
      400,
    );
  }

  const validRows = [];
  const invalidRows = [];
  let index = 0;
  for (const row of rawData) {
    const mappedRow = mapRow(row, headerMap);
    mappedRow.phone = String(mappedRow.phone);
    const result = createRecordSchema.safeParse(mappedRow);

    if (result.success) {
      validRows.push(result.data);
    } else {
      invalidRows.push({
        row: index + 2,
        original: row,
        errors: result.error.issues.map(
          (i) => `${i.path.join(".")}: ${i.message}`,
        ),
      });
    }
    index++;
  }

  return {
    headerMap,
    totalRows: rawData.length,
    validCount: validRows.length,
    invalidCount: invalidRows.length,
    validRows,
    invalidRows,
  };
}

async function confirmRecords(records) {
  if (!Array.isArray(records) || records.length === 0) {
    throw new AppError("No records to confirm", 400);
  }

  const invalidRecords = [];
  for (const record of records) {
    const result = createRecordSchema.safeParse(record);
    if (!result.success) {
      invalidRecords.push({
        record,
        errors: result.error.issues.map(
          (i) => `${i.path.join(".")}: ${i.message}`,
        ),
      });
    }
  }

  if (invalidRecords.length > 0) {
    throw new AppError(
      `Some records are invalid. Please check the details.`,
      400,
      invalidRecords,
    );
  }

  try {
    const inserted = await recordRepository.insertMany(records);
    return { insertedCount: inserted.length, rejectedCount: 0, rejected: [] };
  } catch (error) {
    if (error.name === "MongoBulkWriteError") {
      const insertedCount = error.result.nInserted;

      for (const writeError of error.writeErrors) {
        const { index, errmsg } = writeError;
        const rejectedRecord = records[index];
        invalidRecords.push({
          record: rejectedRecord,
          errors: [errmsg],
        });
      }
      return {
        insertedCount: insertedCount,
        rejectedCount: invalidRecords.length,
        rejected: invalidRecords,
      };
    }
    throw error;
  }
}

async function getRecords({
  page = 1,
  limit = 10,
  search,
  type,
  linkStatus,
  downloadStatus,
  dateFrom,
  dateTo,
}) {
  page = parseInt(page);
  limit = parseInt(limit);

  const result = await recordRepository.findWithFilters({
    page,
    limit,
    search,
    type,
    linkStatus,
    downloadStatus,
    dateFrom,
    dateTo,
  });

  const pagination = buildPagination(page, limit, result.total);

  return { ...result, pagination };
}

async function getRecordById(id) {
  const record = await recordRepository.findById(id);
  if (!record) {
    const err = new Error("Record not found.");
    err.status = 404;
    throw err;
  }
  return record;
}

async function getSummary() {
  const summary = await recordRepository.getSummaryCounts();
  return summary;
}

async function deleteRecord(id) {
  const deleted = await recordRepository.deleteById(id);
  if (!deleted) {
    throw new AppError("Record not found.", 404);
  }
  return deleted;
}

async function updateRecord(id, data) {
  const result = updateRecordSchema.safeParse(data);
  if (!result.success) {
    errors = result.error.issues.map(
      (i) => `${i.path.join(".")}: ${i.message}`,
    );
    throw new AppError("Validation failed.", 400, errors);
  }

  const updated = await recordRepository.updateById(id, result.data);
  if (!updated) {
    throw new AppError("Record not found.", 404);
  }
  return updated;
}

export default {
  previewUploads,
  getRecords,
  confirmRecords,
  getRecordById,
  deleteRecord,
  getSummary,
  updateRecord,
};
