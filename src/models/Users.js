import { Schema, model, connect } from 'mongoose';
import mongoose from 'mongoose';

const userSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true,unique:true},
    income:{ type: Number, default:0 },
    id: { type: mongoose.Schema.Types.ObjectId, auto: true, primaryKey: true }
});

export default mongoose.model('users', userSchema);