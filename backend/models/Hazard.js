import mongoose from 'mongoose';

const hazardSchema = new mongoose.Schema({
  state: {
    type: String,
    required: true,
    unique: true
  },
  hazards: [{
    type: String,
    required: true
  }]
}, {
  timestamps: true
});

export default mongoose.model('Hazard', hazardSchema);
