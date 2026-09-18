import { Router } from "express";
import recordRouter from "../modules/record/record.router.js";

const router = Router();

router.use("/record", recordRouter);

export default router;
