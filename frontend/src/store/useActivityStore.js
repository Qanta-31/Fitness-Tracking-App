import { create } from 'zustand';

export const useActivityStore = create((set, get) => {
  let timerInterval = null;  // Will store the interval ID for updating metrics (time, pace, calories)
  let watchId = null;        // Will store the geolocation watch ID for stopping the geolocation watch later
  let lastLocation = null;   // Stores the last known location to calculate distance between locations

  // Function to calculate the distance between two geographical points (using Haversine formula)
  const calculateDistance = (loc1, loc2) => {
    const R = 6371e3; // Radius of the Earth in meters
    const toRad = (x) => (x * Math.PI) / 180; // Converts degrees to radians

    const [lat1, lon1] = loc1; // Extracts latitude and longitude from the first location
    const [lat2, lon2] = loc2; // Extracts latitude and longitude from the second location

    // Calculates the difference in latitude and longitude
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    // Haversine formula to calculate the distance
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); // Calculate central angle
    return R * c; // Returns distance in meters
  };

  return {
    location: null,  // The user's current location will be stored here
    setLocation: (loc) => set({ location: loc }),  // Updates the location in the store

    route: [],  // Array to store the route as an array of location points (latitude, longitude)
    addToRoute: (point) =>
      set((state) => ({ route: [...state.route, point] })),  // Adds a new point to the route

    isRunning: false,  // A boolean flag indicating if the activity is running or not
    setRunning: (running) => set({ isRunning: running }),  // Sets whether the activity is running

    startTime: null,  // Stores the start time of the activity
    setStartTime: (time) => set({ startTime: time }),  // Sets the start time of the activity

    duration: 0,  // Time duration of the activity in seconds
    setDuration: (dur) => set({ duration: dur }),  // Sets the duration of the activity

    distance: 0,  // Total distance covered during the activity in meters
    setDistance: (dist) => set({ distance: dist }),  // Sets the distance covered during the activity

    calories: 0,  // Calories burned during the activity
    setCalories: (cal) => set({ calories: cal }),  // Sets the calories burned during the activity

    pace: 0,  // Average pace of the activity (in km/h or min/km)
    
    modalVisible: false,  // Boolean flag for whether the modal (save/discard) is visible
    setModalVisible: (visible) => set({ modalVisible: visible }),  // Sets visibility of the modal

    // Function to reset all activity-related states
    resetActivity: () => {
      clearInterval(timerInterval);  // Clears the interval that updates the metrics
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);  // Clears the geolocation watch
        watchId = null;
      }
      lastLocation = null;  // Resets the last known location
      set({
        isRunning: false,  // Resets the running flag
        startTime: null,  // Resets the start time
        duration: 0,  // Resets the duration
        distance: 0,  // Resets the distance
        calories: 0,  // Resets the calories
        pace: 0,  // Resets the pace
        location: null,  // Resets the location
        route: [],  // Resets the route
        modalVisible: false,  // Hides the modal
      });
    },

    // Function to start tracking the activity
    startTracking: async () => {
      try {
        const startTime = new Date();  // Get the start time
        set({ isRunning: true, startTime });  // Update the state to reflect that the activity is running

        // Start the timer interval to update the duration and pace every second
        timerInterval = setInterval(() => {
          const now = new Date();  // Get the current time
          const elapsed = Math.floor((now - get().startTime) / 1000);  // Calculate elapsed time in seconds
          const distance = get().distance;  // Get the total distance covered so far
          const pace = elapsed > 0 ? ((distance / 1000) / (elapsed / 3600)).toFixed(2) : 0; // pace in km/hr

          // Update the state with the new metrics
          set({
            duration: elapsed,  // Update the duration
            pace,  // Update the pace
            calories: Math.floor((distance / 1000) * 62),  // Update calories (assuming 62 cal/km)
          });
        }, 1000);  // Updates every second

        // Start watching the user's position
        if (navigator.geolocation) {
          watchId = navigator.geolocation.watchPosition(
            (pos) => {
              const { latitude, longitude } = pos.coords;  // Get the current latitude and longitude
              const newLoc = [latitude, longitude];  // Store the current location
              get().setLocation(newLoc);  // Update the location in the state
              get().addToRoute({
                lat: latitude,
                lng: longitude,
                timestamp: new Date(),
              });  // Add the new location to the route

              if (lastLocation) {
                // If there was a previous location, calculate the distance from the last one
                const d = calculateDistance(lastLocation, newLoc);
                set((state) => ({ distance: state.distance + d }));  // Update the total distance
              }
              lastLocation = newLoc;  // Update the last known location
            },
            (err) => {
              throw new Error(`Geolocation error: ${err.message}`);  // Handle geolocation errors
            },
            { enableHighAccuracy: true, maximumAge: 1000, timeout: 5000 }  // Options for the geolocation API
          );
        } else {
          throw new Error('Geolocation not supported by this browser');  // Error handling if geolocation is not supported
        }
      } catch (error) {
        console.error('Error while starting activity tracking:', error.message);  // Log the error
        set({ isRunning: false });  // Stop the activity in case of an error
      }
    },

    // Function to stop tracking the activity
    stopTracking: () => {
      try {
        clearInterval(timerInterval);  // Clear the timer interval
        if (watchId !== null) {
          navigator.geolocation.clearWatch(watchId);  // Stop watching the user's position
          watchId = null;
        }
      } catch (error) {
        console.error('Error while stopping activity tracking:', error.message);  // Log the error if stopping fails
      }
    },
  };
});
