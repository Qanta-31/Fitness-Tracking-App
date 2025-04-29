import { useEffect, useState } from 'react';
import { axiosInstance } from '../lib/axios.js';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO, startOfWeek, endOfWeek, eachDayOfInterval, subDays, addDays } from 'date-fns';

// ✨ Custom Tooltip Component
const CustomTooltip = ({ active, payload, label, yKey }) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    const formattedValue = value.toFixed(2); // 👈 format to 2 decimal places

    return (
      <div className="p-2 rounded-md" style={{
        backgroundColor: 'rgba(0,0,0,0.7)',
        color: '#fff',
        border: 'none',
        fontSize: '14px'
      }}>
        <p className="font-semibold mb-1">{label}</p>
        {yKey === 'calories' ? (
          <p>🔥 Calories Burnt: {formattedValue} kcal</p>
        ) : (
          <p>🛣️ Distance Covered: {formattedValue} km</p>
        )}
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
      try {
        const response = await axiosInstance.get('/activity');
        setActivities(response.data);
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    };
    fetchActivities();

    const fetchSignInDate = async () => {
      try {
        const response = await axiosInstance.get('/user/signin-date');
        setSignInDate(parseISO(response.data.signInDate));
      } catch (error) {
        console.error('Error fetching sign-in date:', error);
      }
    };
    fetchSignInDate();
  }, []);

  const aggregatedData = activities.reduce((acc, activity) => {
    const date = format(parseISO(activity.startTime), 'yyyy-MM-dd');
    if (!acc[date]) {
      acc[date] = { date, calories: 0, distance: 0 };
    }
    acc[date].calories += activity.calories;
    acc[date].distance += activity.distance;
    return acc;
  }, {});

  const today = new Date();
  const currentWeekStart = startOfWeek(today, { weekStartsOn: 0 });
  const currentWeekEnd = endOfWeek(today, { weekStartsOn: 0 });

  const currentWeekDays = eachDayOfInterval({ start: currentWeekStart, end: currentWeekEnd });

  const chartData = currentWeekDays.map((date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const activity = aggregatedData[dateStr] || { calories: 0, distance: 0 };
    return {
      day: format(date, 'EEEE'),
      calories: activity.calories,
      distance: activity.distance,
    };
  });

  const startDate = signInDate ? signInDate : subDays(today, 255);
  const endDate = today;
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  while (days.length < 256) {
    days.push(addDays(endDate, days.length - 256));
  }

  let heatmapData = days.map((day) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const activity = aggregatedData[dateStr];
    return {
      date: dateStr,
      active: activity && (activity.calories > 0 || activity.distance > 0),
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
    <div className="p-6 mt-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Bar Chart Section */}
        <div className="flex flex-col items-center w-full">
          <h2 className="text-xl font-semibold mb-32 text-center">Weekly Progress</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="day" />
              <YAxis
                label={{
                  value: yKey === 'calories' ? 'Calories Burnt' : 'Distance Covered',
                  angle: -90,
                  position: 'insideLeft',
                  style: { textAnchor: 'middle', fill: '#ccc', fontSize: 14 },
                }}
              />
              <Tooltip
                content={(props) => <CustomTooltip {...props} yKey={yKey} />}
                cursor={{ fill: 'rgba(0,0,0,0.09)' }}
              />
              <Bar
                dataKey={yKey}
                fill={yKey === 'calories' ? '#4ade80' : '#3b82f6'}
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>

          {/* Toggle Button */}
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
        <div className="flex flex-col items-center w-full">
          <h2 className="text-xl font-semibold mb-6 text-center">Heatmap</h2>
          <div className="grid grid-cols-16 grid-rows-16 gap-2">
            {heatmapGrid.map((row, rowIndex) => (
              <div key={rowIndex} className="flex">
                {row.map((day, colIndex) => (
                  <div
                    key={colIndex}
                    title={day?.date}
                    className={`mx-1 w-5 h-5 md:w-6 md:h-6 rounded-md 
                      ${day.active ? 'bg-green-400' : 'bg-gray-200'}
                      transition-all`}
                  ></div>
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
