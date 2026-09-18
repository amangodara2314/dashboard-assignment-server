import successResponse from "../../utils/responseHelpers.js";
import recordService from "./record.service.js";

const previewUploads = async (req, res) => {
  const { file } = req;
  const result = await recordService.previewUploads(file.buffer);
  successResponse(res, result, "Preview generated", 200);
};

const fetchRecords = async (req, res) => {
  const {
    page,
    limit,
    search,
    type,
    linkStatus,
    downloadStatus,
    dateFrom,
    dateTo,
  } = req.query;

  const result = await recordService.getRecords({
    page,
    limit,
    search,
    type,
    linkStatus,
    downloadStatus,
    dateFrom,
    dateTo,
  });

  successResponse(res, result, "Data found", 200);
};

const confirmRecords = async (req, res) => {
  const { rows } = req.body;

  const result = await recordService.confirmRecords(rows);
  successResponse(res, result, "Records confirmed", 200);
};

const fetchRecordById = async (req, res) => {
  const { id } = req.params;
  const result = await recordService.getRecordById(id);
  successResponse(res, result, "Data found", 200);
};

const deleteRecord = async (req, res) => {
  const { id } = req.params;
  const result = await recordService.deleteRecord(id);
  successResponse(res, result, "Record deleted", 200);
};

const fetchSummary = async (req, res) => {
  const result = await recordService.getSummary();
  successResponse(res, result, "Summary fetched", 200);
};

const updateRecord = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const result = await recordService.updateRecord(id, data);
  successResponse(res, result, "Record Updated Successfully", 200);
};

export default {
  fetchRecords,
  previewUploads,
  confirmRecords,
  fetchRecordById,
  deleteRecord,
  fetchSummary,
  updateRecord,
};
