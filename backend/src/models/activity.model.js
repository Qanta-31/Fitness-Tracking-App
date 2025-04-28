import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  distance: {
    type: Number, // in kilometers or meters
    required: true,
  },
  duration: {
    type: Number, // in seconds
    required: true,
  },
  calories: {
    type: Number,
    required: false,
  },
  path: [
    {
      lat: Number,
      lng: Number,
    },
  ],
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Activity', activitySchema);
