import { useEffect, useState } from 'react';
import { axiosInstance } from '../lib/axios.js';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import {
  format,
  parseISO,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  subDays
} from 'date-fns';

// ✨ Custom Tooltip
const CustomTooltip = ({ active, payload, label, yKey }) => {
  if (active && payload && payload.length) {
    const value = payload[0].value.toFixed(2);
    return (
      <div className="bg-black/80 text-white text-sm p-2 rounded">
        <p className="font-semibold">{label}</p>
        <p>
          {yKey === 'calories'
            ? `🔥 Calories: ${value} kcal`
            : `🛣️ Distance: ${value} km`}
        </p>
      </div>
    );
  }
  return null;
};

const PerformancePage = () => {
  const [activities, setActivities] = useState([]);
  const [yKey, setYKey] = useState('calories');
  const [signInDate, setSignInDate] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      const res = await axiosInstance.get('/activity');
      setActivities(res.data);
    };
    const fetchSignInDate = async () => {
      const res = await axiosInstance.get('/user/signin-date');
      setSignInDate(parseISO(res.data.signInDate));
    };
    fetchActivities();
    fetchSignInDate();
  }, []);

  const aggregatedData = activities.reduce((acc, activity) => {
    const date = format(parseISO(activity.startTime), 'yyyy-MM-dd');
    if (!acc[date]) acc[date] = { date, calories: 0, distance: 0 };
    acc[date].calories += activity.calories;
    acc[date].distance += activity.distance;
    return acc;
  }, {});

  const today = new Date();
  const currentWeekStart = startOfWeek(today);
  const currentWeekEnd = endOfWeek(today);
  const currentWeekDays = eachDayOfInterval({ start: currentWeekStart, end: currentWeekEnd });

  const chartData = currentWeekDays.map((date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const activity = aggregatedData[dateStr] || { calories: 0, distance: 0 };
    return {
      day: format(date, 'EEE'),
      calories: activity.calories,
      distance: activity.distance
    };
  });

  const startDate = signInDate || subDays(today, 255);
  const allDays = eachDayOfInterval({ start: startDate, end: today });

  let heatmapData = allDays.map((day) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const activity = aggregatedData[dateStr];
    return {
      date: dateStr,
      active: activity && (activity.calories > 0 || activity.distance > 0)
    };
  });

  heatmapData.reverse();
  const heatmapGrid = [];
  for (let i = 0; i < 16; i++) {
    heatmapGrid.push(heatmapData.slice(i * 16, (i + 1) * 16));
  }

  const toggleButtonStyles = `px-6 py-2 rounded-full border-2 
    flex items-center justify-between w-32
    ${yKey === 'calories' ? 'border-green-500' : 'border-blue-500'}`;

  const circleStyles = `w-5 h-5 rounded-full bg-white border-2 
    ${yKey === 'calories' ? 'border-green-500' : 'border-blue-500'} 
    ml-auto`;

  return (
    <div className="px-4 sm:px-6 md:px-12 lg:px-20 mt-20 max-w-screen-2xl mx-auto">
      {/* Responsive Layout */}
      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* Chart Section */}
        {/* Chart Section */}
        <div className="w-full lg:w-1/2 flex flex-col items-center self-start mt-8">
          <h2 className="text-2xl font-semibold mb-6 lg:mb-8 text-center">Weekly Progress</h2>

          <div className="w-full">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis
                  dataKey="day"
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                  axisLine={true}
                  tickLine={true}
                />
                <YAxis
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                  axisLine={true}
                  tickLine={true}
                  label={{
                    value: yKey === 'calories' ? 'Calories' : 'Distance',
                    angle: -90,
                    position: 'insideLeft',
                    style: { fill: '#9ca3af', fontSize: 14 }
                  }}
                />
                <Tooltip
                  content={(props) => <CustomTooltip {...props} yKey={yKey} />}
                  cursor={{ fill: 'transparent' }}
                />
                <Bar
                  dataKey={yKey}
                  fill={yKey === 'calories' ? '#4ade80' : '#3b82f6'}
                  radius={[8, 8, 0, 0]}
                  isAnimationActive={false}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6">
            <button
              onClick={() => setYKey((prev) => (prev === 'calories' ? 'distance' : 'calories'))}
              className={toggleButtonStyles}
            >
              <span className="font-semibold text-sm">
                {yKey === 'calories' ? 'Calories' : 'Distance'}
              </span>
              <div className={circleStyles}></div>
            </button>
          </div>
        </div>

        {/* Heatmap Section */}
        <div className="w-full lg:w-1/2 flex flex-col items-center self-start mt-8">
            <h2 className="text-2xl font-semibold mb-6 lg:mb-8 text-center">Heatmap</h2>
            <div className="grid grid-cols-16 gap-2">
            {heatmapGrid.map((row, i) => (
              <div key={i} className="flex">
                {row.map((day, j) => (
                  <div
                    key={j}
                    title={day?.date}
                    className={`w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 mx-0.5 rounded-md transition-all
                      ${day.active ? 'bg-green-400' : 'bg-gray-200'}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformancePage;
