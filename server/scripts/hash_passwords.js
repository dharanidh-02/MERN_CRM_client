import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import FacultyCollection from '../Model/FacultyModel.js';
import StudentCollection from '../Model/StudentModel.js';
import dotenv from 'dotenv';

dotenv.config();

const hashPasswords = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Connected to MongoDB');

        // Hash faculty passwords
        const faculty = await FacultyCollection.find({ password: { $exists: true, $ne: null } });
        for (let f of faculty) {
            if (f.password && !f.password.startsWith('$2b$')) { // Not already hashed
                const hashedPassword = await bcrypt.hash(f.password, 10);
                await FacultyCollection.updateOne({ _id: f._id }, { password: hashedPassword });
                console.log(`Hashed password for faculty: ${f.name}`);
            }
        }

        // Hash student passwords
        const students = await StudentCollection.find({ password: { $exists: true, $ne: null } });
        for (let s of students) {
            if (s.password && !s.password.startsWith('$2b$')) { // Not already hashed
                const hashedPassword = await bcrypt.hash(s.password, 10);
                await StudentCollection.updateOne({ _id: s._id }, { password: hashedPassword });
                console.log(`Hashed password for student: ${s.name}`);
            }
        }

        console.log('Password hashing completed');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

hashPasswords();