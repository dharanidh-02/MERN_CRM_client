import mongoose from "mongoose";

const batchSchema = mongoose.Schema({
    name: { type: String, required: true }, // e.g., "2023-2027"
    dept: { type: [String], required: true }
});

const BatchCollection = mongoose.model('batches', batchSchema);
export default BatchCollection;
