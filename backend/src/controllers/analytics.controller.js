import Activity from '../models/activity.model.js';

export const getUserAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;

    const analytics = await Activity.aggregate([
      { $match: { user: userId } }, // Get only this user's activities
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$startTime" } }, // Group by date (YYYY-MM-DD)
          totalDistance: { $sum: "$distance" },
          totalCalories: { $sum: "$calories" },
          activityCount: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          totalDistance: 1,
          totalCalories: 1,
          activityCount: 1
        }
      },
      { $sort: { date: 1 } } // Sort by date ascending
    ]);

    res.status(200).json({ analytics });
  } catch (error) {
    console.error('Error fetching user analytics:', error);
    res.status(500).json({ message: 'Server error while fetching analytics' });
  }
};
