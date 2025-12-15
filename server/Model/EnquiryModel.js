import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    message: {
        type: String,
    },
    status: {
        type: String,
        default: 'New'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const EnquiryCollection = mongoose.model('enquiries', enquirySchema);
export default EnquiryCollection;
