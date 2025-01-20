import { Schema, model, connect } from 'mongoose';
import mongoose from 'mongoose';

const expensesSchema = new Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'users', 
        required: true,
    },
    amount:{ type: Number, required: true},
    place: { type: String, required: true },
    description: { type: String, required: true},
    _expid: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        unique: true  
    }
});

export default mongoose.model('Expenses', expensesSchema);