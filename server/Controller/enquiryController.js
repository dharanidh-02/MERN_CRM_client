import EnquiryCollection from "../Model/EnquiryModel.js";

export const addEnquiry = async (req, res) => {
    try {
        const data = new EnquiryCollection(req.body);
        await data.save();
        res.status(201).json({ message: "Enquiry submitted successfully", data });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export const getEnquiries = async (req, res) => {
    try {
        const data = await EnquiryCollection.find().sort({ date: -1 }); // Sort by date desc
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export const deleteEnquiry = async (req, res) => {
    try {
        const { id } = req.params;
        await EnquiryCollection.findByIdAndDelete(id);
        res.status(200).json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export const updateEnquiryStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updatedEnquiry = await EnquiryCollection.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );
        res.status(200).json({ message: "Status updated", data: updatedEnquiry });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
