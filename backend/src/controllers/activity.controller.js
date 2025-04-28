import Activity from '../models/activity.model.js';

export const createActivity = async (req, res) => {
  try {
    const { distance, duration, calories, path, startTime, endTime } = req.body;

    // Validate required fields
    if (distance == null || duration == null || !path || !startTime || !endTime) {
      return res.status(400).json({ message: 'Missing required activity data' });
    }

    // Additional validation for data types (ensure they are numbers, not strings)
    if (typeof distance !== 'number' || typeof duration !== 'number') {
      return res.status(400).json({ message: 'Distance and duration must be numbers' });
    }

    // Validate path array (make sure it's an array of objects with lat and lng)
    if (!Array.isArray(path) || !path.every(p => p.lat && p.lng)) {
      return res.status(400).json({ message: 'Path must be an array of objects with lat and lng' });
    }

    // Validate startTime and endTime (must be valid Date objects)
    if (isNaN(Date.parse(startTime)) || isNaN(Date.parse(endTime))) {
      return res.status(400).json({ message: 'Start time and end time must be valid dates' });
    }

    const newActivity = new Activity({
      user: req.user._id, // Make sure req.user._id is populated properly
      distance,
      duration,
      calories,
      path,
      startTime,
      endTime,
    });

    await newActivity.save();

    res.status(201).json({ message: 'Activity saved successfully', activity: newActivity });
  } catch (error) {
    console.error('Error saving activity:', error);
    res.status(500).json({ message: 'Server error while saving activity' });
  }
};

export const getUserActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ user: req.user._id }).sort({ startTime: -1 });

    res.status(200).json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ message: 'Server error while fetching activities' });
  }
};
