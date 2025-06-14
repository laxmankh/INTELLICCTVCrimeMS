import express from "express";
const router = express.Router();
import {getcrimeRecords} from "../controllers/crimeRecordscontroller.js";

router.get("/crimerecords", getcrimeRecords);


export default router;
