import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    enum: ['Primary Student (Classes 1-5)', 'Secondary Student (Classes 6-12)', 'College Student', 'Parent', 'Administrator/Teacher']
  },
  password: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('User', userSchema);
