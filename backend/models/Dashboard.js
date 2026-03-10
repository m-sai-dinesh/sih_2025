import mongoose from 'mongoose';

const dashboardSchema = new mongoose.Schema({
  preparednessScore: {
    type: Number,
    default: 0
  },
  studentsTrained: {
    type: Number,
    default: 0
  },
  drillsCompleted: {
    type: Number,
    default: 0
  },
  participationByGrade: [{
    name: String,
    participation: Number
  }],
  preparednessByDisaster: [{
    subject: String,
    score: Number,
    fullMark: Number
  }]
}, {
  timestamps: true
});

export default mongoose.model('Dashboard', dashboardSchema);
