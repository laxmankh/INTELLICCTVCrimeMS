import CrimeRecord from "../Models/crimeRecordsModel.js";
export const getcrimeRecords=async(req,res)=>{
    try{
        const crimerecord=await CrimeRecord.find();
        res.status(200).json(crimerecord)
    }catch(error){
        console.log("Error:",error);
        res.status(500).json(error);
    }
}