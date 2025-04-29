import { useEffect, useState } from 'react';
import { axiosInstance } from '../lib/axios.js';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO, startOfWeek, endOfWeek, eachDayOfInterval, subDays, addDays } from 'date-fns';

// Custom Tooltip
const CustomTooltip = ({ active, payload, label, yKey }) => {
  if (active && payload && payload.length) {
    const value = payload[0].value.toFixed(2);
    return (
      <div className="p-2 rounded-md bg-black/70 text-white text-sm">
        <p className="font-semibold mb-1">{label}</p>
        <p>{yKey === 'calories' ? `🔥 Calories Burnt: ${value} kcal` : `🛣️ Distance Covered: ${value} km`}</p>
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
    const fetchData = async () => {
      try {
        const activityRes = await axiosInstance.get('/activity');
        setActivities(activityRes.data);
        const signInRes = await axiosInstance.get('/user/signin-date');
        setSignInDate(parseISO(signInRes.data.signInDate));
      } catch (err) {
        console.error('Error:', err);
      }
    };
    fetchData();
  }, []);

  const aggregatedData = activities.reduce((acc, act) => {
    const date = format(parseISO(act.startTime), 'yyyy-MM-dd');
    acc[date] = acc[date] || { date, calories: 0, distance: 0 };
    acc[date].calories += act.calories;
    acc[date].distance += act.distance;
    return acc;
  }, {});

  const today = new Date();
  const currentWeekDays = eachDayOfInterval({
    start: startOfWeek(today, { weekStartsOn: 0 }),
    end: endOfWeek(today, { weekStartsOn: 0 }),
  });

  const chartData = currentWeekDays.map((date) => {
    const key = format(date, 'yyyy-MM-dd');
    const act = aggregatedData[key] || { calories: 0, distance: 0 };
    return { day: format(date, 'EEE'), ...act };
  });

  const startDate = signInDate || subDays(today, 255);
  const days = eachDayOfInterval({ start: startDate, end: today });

  const paddedDays = [...days];
  while (paddedDays.length < 256) {
    paddedDays.push(addDays(today, paddedDays.length - 256));
  }

  const heatmapData = paddedDays.reverse().map((day) => {
    const key = format(day, 'yyyy-MM-dd');
    const act = aggregatedData[key];
    return {
      date: key,
      active: act && (act.calories > 0 || act.distance > 0),
    };
  });

  const heatmapGrid = Array.from({ length: 16 }, (_, i) =>
    heatmapData.slice(i * 16, (i + 1) * 16)
  );

  const toggleButtonStyles = `px-6 py-2 rounded-full border-2 w-32 flex items-center justify-between ${
    yKey === 'calories' ? 'border-green-500' : 'border-blue-500'
  }`;

  const circleStyles = `w-5 h-5 rounded-full bg-white border-2 ${
    yKey === 'calories' ? 'border-green-500' : 'border-blue-500'
  } ml-auto`;

  return (
    <div className="p-4 sm:p-6 mt-16">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        {/* Weekly Bar Chart */}
        <div className="flex flex-col items-center w-full">
          <h2 className="text-lg sm:text-xl font-semibold mb-8 text-center">Weekly Progress</h2>
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
              <Tooltip content={(props) => <CustomTooltip {...props} yKey={yKey} />} />
              <Bar
                dataKey={yKey}
                fill={yKey === 'calories' ? '#4ade80' : '#3b82f6'}
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
          <button
            onClick={() => setYKey((prev) => (prev === 'calories' ? 'distance' : 'calories'))}
            className={`${toggleButtonStyles} mt-6`}
          >
            <span className="font-semibold text-sm">
              {yKey === 'calories' ? 'Calories' : 'Distance'}
            </span>
            <div className={circleStyles}></div>
          </button>
        </div>

        {/* Heatmap */}
        <div className="flex flex-col items-center w-full">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-center">Heatmap</h2>
          <div className="overflow-auto max-w-full">
            <div
              className="grid"
              style={{
                gridTemplateColumns: 'repeat(16, minmax(1rem, 1fr))',
                gap: '4px',
              }}
            >
              {heatmapGrid.map((row, rowIndex) =>
                row.map((day, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    title={day?.date}
                    className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded ${
                      day.active ? 'bg-green-400' : 'bg-gray-200'
                    } transition-all`}
                  ></div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformancePage;
