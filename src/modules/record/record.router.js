import { Router } from "express";
import recordController from "./record.controller.js";
import { upload } from "../../config/multer.js";

const recordRouter = Router();

recordRouter.post(
  "/upload",
  upload.single("file"),
  recordController.previewUploads,
);

recordRouter.get("/", recordController.fetchRecords);

recordRouter.post("/upload/confirm", recordController.confirmRecords);

recordRouter.get("/summary", recordController.fetchSummary);

recordRouter.get("/:id", recordController.fetchRecordById);

recordRouter.delete("/:id", recordController.deleteRecord);

recordRouter.put("/:id", recordController.updateRecord);

export default recordRouter;
