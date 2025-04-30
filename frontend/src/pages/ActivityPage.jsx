import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import { useNavigate } from 'react-router-dom';
import { useActivityStore } from '../store/useActivityStore';
import { formatDuration, formatDistance } from '../utils/formatters';
import { X } from 'lucide-react';
import L from 'leaflet';
import { axiosInstance } from '../lib/axios';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';


// ✅ Fix Leaflet's default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
});

const RecenterMap = ({ location }) => {
  const map = useMap();
  const hasCenteredRef = React.useRef(false);

  useEffect(() => {
    if (location && !hasCenteredRef.current) {
      map.setView(location, map.getZoom());
      hasCenteredRef.current = true;
    }
  }, [location, map]);

  return null;
};


const ActivityPage = () => {
  const navigate = useNavigate();
  const {
    location,
    setLocation,
    isRunning,
    setRunning,
    startTime,
    setStartTime,
    duration,
    setDuration,
    distance,
    setDistance,
    calories,
    setCalories,
    modalVisible,
    setModalVisible,
    resetActivity,
    route,
    addToRoute,
    pace,
    startTracking,
    stopTracking,
  } = useActivityStore();

  // Set initial location on page load
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setLocation([latitude, longitude]);
        },
        (err) => console.error('Geolocation error:', err.message),
        { enableHighAccuracy: true }
      );
    }
  }, [setLocation]);


  const handleStart = () => {
    // Reset previous activity data when starting a new activity
    resetActivity(); // Clears out previous state data
    setStartTime(new Date()); // Set the current start time
    startTracking(); // Start tracking the activity
    setRunning(true); // Set running state to true
  };
  

  const handleFinish = () => {
    stopTracking();
    const endTime = new Date();
    const dur = Math.floor((endTime - startTime) / 1000);
    const cal = Math.floor((distance / 1000) * 62); // Example calculation
    setDuration(dur);
    setCalories(cal);
    setModalVisible(true);
  };
  
  const handleSave = async () => {
    try {
      const { authUser } = useAuthStore.getState(); // get the logged-in user
      if (!authUser || !authUser._id) {
        toast.error('User not authenticated');
        return;
      }
  
      const activityData = {
        userId: authUser._id, // pass the user ID (optional since your backend uses req.user._id)
        distance,
        duration,
        calories,
        path: route,
        startTime,
        endTime: new Date(),
      };

      // console.log('Activity Data being sent:', activityData);

      const cleanedActivityData = {
        distance: activityData.distance,
        duration: activityData.duration,
        calories: activityData.calories,
        startTime: activityData.startTime.toISOString(),  // convert Date -> string
        endTime: activityData.endTime.toISOString(),      // convert Date -> string
        path: activityData.path.map(p => ({ lat: p.lat, lng: p.lng })),  // remove timestamp
      };


      const res = await axiosInstance.post('/activity', cleanedActivityData);
      toast.success('Activity saved successfully!');

      
      // After successful save, reset the activity data and close the modal
      resetActivity();

      // Redirect to homepage or another page after saving the activity
      navigate('/');
    } catch (error) {
      console.error('Error saving activity:', error);
      toast.error('Failed to save activity');
    }
  };
  
  
  

  const handleDiscard = () => {
    setModalVisible(false);
    resetActivity();
  };

  

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Map */}
      <div className="w-full lg:w-2/3 h-[50vh] lg:h-full p-4">
        <div className="w-full h-full rounded-3xl overflow-hidden shadow-lg border border-gray-300">
          <MapContainer
            center={location || [51.505, -0.09]}
            zoom={16}
            scrollWheelZoom={false}
            className="w-full h-full"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {location && <Marker position={location} />}
            {location && <RecenterMap location={location} />}
            {route.length > 0 && (
              <Polyline
              positions={route.map((p) => [p.lat, p.lng])}
              color="#f97316" // orange color
              weight={10} // Increase the value for thicker lines
              opacity={1} // Set opacity to 1 for solid color
            />
            )}
          </MapContainer>
        </div>
      </div>

      {/* Right Panel on large screens */}
      <div className="hidden lg:flex w-full lg:w-1/3 flex-col justify-between p-4 border-gray-300">
        <div className='mt-36'>
          <p className='text-4xl mb-7'><strong>Average Pace:</strong> {pace} km/hr</p>
          <p className='text-4xl mb-7'><strong>Distance:</strong> {formatDistance(distance)}</p>
          <p className='text-4xl mb-7'><strong>Time:</strong> {formatDuration(duration)}</p>
        </div>
        <div className="mb-20">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="bg-orange-500 text-white text-xl rounded-full px-3 py-4  font-bold shadow-md hover:bg-orange-600 transition w-72"
            >
            Start
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="bg-green-500 text-white text-xl rounded-full px-3 py-4  font-bold shadow-md hover:bg-green-600 transition w-72"
            >
            Finish
            </button>
          )}
        </div>
      </div>

      {/* Bottom Panel for small screens */}
      <div className="lg:hidden w-full px-4 pb-6">
        <div className="my-4">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="bg-orange-500 text-white rounded-full w-full py-4 text-lg font-bold shadow-md hover:bg-orange-600 transition"
            >
            Start
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="bg-green-500 text-white rounded-full w-full py-4 text-lg font-bold shadow-md hover:bg-green-600 transition"
            >
            Finish
            </button>
          )}
        </div>
        <div className="text-center space-y-1">
          <p className='text-xl'><strong>Average Pace:</strong> {pace} km/h</p>
          <p className='text-xl'><strong>Distance:</strong> {formatDistance(distance)}</p>
          <p className='text-xl'><strong>Time:</strong> {formatDuration(duration)}</p>
        </div>
      </div>

        {/* Modal (visible on all screen sizes) */}
        {modalVisible && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999]">
        <div className="relative bg-gray-600 p-8 rounded-lg w-[90%] max-w-md text-white">
        {/* Close Icon */}
                <button
                  onClick={handleDiscard}
                      className="absolute top-2 right-2 text-white hover:text-gray-300"
                      aria-label="Close"
                >
                      <X size={24} />
                </button>

        <p className="text-lg font-semibold mb-4 text-center">
            Do you want to save this activity?
        </p>

        <div className="flex justify-center gap-4 mt-6">
            <button
            onClick={handleSave}
            className="bg-green-500 px-4 py-2 rounded-xl hover:bg-green-600 transition"
            >
            Save
            </button>
            <button
            onClick={handleDiscard}
            className="bg-red-500 px-4 py-2 rounded-xl hover:bg-red-600 transition"
            >
            Discard
            </button>
        </div>
        </div>
    </div>
    )}



    </div>
  );
};

export default ActivityPage;
