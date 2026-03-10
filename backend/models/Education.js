import mongoose from 'mongoose';

const educationContentSchema = new mongoose.Schema({
  language: {
    type: String,
    required: true
  },
  disasterType: {
    type: String,
    required: true
  },
  content: {
    description: String,
    dos: [String],
    donts: [String]
  }
}, {
  timestamps: true
});

export default mongoose.model('Education', educationContentSchema);
