import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Admin', 'Faculty', 'Student'],
        required: true
    }
});

const UserCollection = mongoose.model('users', userSchema);
export default UserCollection;
