// models/WalkInLog.js
import mongoose from 'mongoose';

const walkInLogSchema = new mongoose.Schema({
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true,
  },
  estimatedCustomerCount: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const WalkInLog = mongoose.model('WalkInLog', walkInLogSchema);
export default WalkInLog;
