import UserCollection from "../Model/UserModel.js";
import bcrypt from "bcryptjs";
import FacultyCollection from "../Model/FacultyModel.js";
import StudentCollection from "../Model/StudentModel.js";

export const registerUser = async (req, res) => {
    try {
        const { username, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserCollection({ username, password: hashedPassword, role });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export const loginUser = async (req, res) => {
    try {
        const { username, password, role } = req.body;
        console.log(`Login attempt for username: ${username} with role: ${role}`);

        let user = null;
        let userRole = null;

        // Normalize role to lowercase for comparison
        const targetRole = role ? role.toLowerCase() : '';

        if (targetRole === 'admin') {
            user = await UserCollection.findOne({ username });
            console.log("Admin Check - Found User:", user ? user.username : "None", "Role:", user ? user.role : "N/A");

            // Strict check: User must exist AND have role 'Admin' (case-insensitive check safe)
            if (user && user.role && user.role.toLowerCase() === 'admin') {
                console.log("Admin Role Match: SUCCESS");
                userRole = 'admin';
            } else {
                console.log("Admin Role Match: FAILED");
                user = null; // Reset if role mismatch found in UserCollection
            }
        } else if (targetRole === 'faculty') {
            user = await FacultyCollection.findOne({
                $or: [{ id: username }, { userId: username }]
            });
            console.log("Faculty Check - Found User:", user ? user.id : "None");
            if (user) userRole = 'faculty';
        } else if (targetRole === 'student') {
            user = await StudentCollection.findOne({
                $or: [{ regNo: username }, { userId: username }]
            });
            console.log("Student Check - Found User:", user ? user.regNo : "None");
            if (user) userRole = 'student';
        } else {
            console.log("Unknown Role Requested:", targetRole);
            return res.status(400).json({ message: "Role is required for login." });
        }

        if (!user) {
            console.log("User not found in any collection");
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Invalid password");
            return res.status(400).json({ message: "Invalid credentials" });
        }

        console.log("Login successful");
        res.json({
            message: "Login successful",
            role: userRole,
            username: user.username || user.name,
            user: {
                _id: user._id,
                name: user.name || user.username,
                role: userRole
            }
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: err.message });
    }
}
