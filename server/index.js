import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import connectDb from "./Db/db.js";
import authWait from "./Routes/authRoutes.js";
import enquiryRoute from "./Routes/enquiryRoutes.js";
import crmRoutes from "./Routes/crmRoutes.js";
import UserCollection from "./Model/UserModel.js";

dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});

app.use('/auth', authWait);
app.use('/enquiry', enquiryRoute);
app.use('/api', crmRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

const seedAdmin = async () => {
    try {
        const adminExists = await UserCollection.findOne({ username: 'admin' });
        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('admin', 10);
            const adminUser = new UserCollection({
                username: 'admin',
                password: hashedPassword,
                role: 'Admin'
            });
            await adminUser.save();
            console.log("Admin user seeded successfully");
        } else {
            console.log("Admin user already exists");
        }
    } catch (err) {
        console.error("Error seeding admin:", err);
    }
}

connectDb();
// Wait for DB connection before seeding (simple timeout or listen to event would be better but this is simple enough for now if db.js connects fast)
// Actually better to call seedAdmin inside db.js or just call it after connectDb() but connectDb is async without awaiting.
// Let's modify db.js or just wait a bit? No, connectDb isn't exporting promise.
// Simplest fix: Just run it, mongoose queues it up.
seedAdmin();
