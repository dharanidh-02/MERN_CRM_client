import express from "express";
import { addEnquiry, getEnquiries, deleteEnquiry, updateEnquiryStatus } from "../Controller/enquiryController.js";

const route = express.Router();

route.post("/create", addEnquiry);
route.get("/read", getEnquiries);
route.put("/:id", updateEnquiryStatus);
route.delete("/:id", deleteEnquiry);

export default route;
