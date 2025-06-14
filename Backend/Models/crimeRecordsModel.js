import mongoose from "mongoose";

const crimeRecordSchema = new mongoose.Schema({
  type: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  time: { type: Date, required: true },
  confidence: { type: Number, min: 0, max: 1 },
  crime: { type: String, required: true, enum: ['current', 'past'] },
}, { timestamps: true,collection: 'crimeRecords' });

const CrimeRecord = mongoose.model('CrimeRecord', crimeRecordSchema);
export default CrimeRecord;
