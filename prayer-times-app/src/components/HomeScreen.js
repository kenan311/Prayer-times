import React, { useState, useEffect } from 'react';

const cities = {
  "Podujevo": { latitude: 42.91056, longitude: 21.19306 },
  "Prishtina": { latitude: 42.6629, longitude: 21.1655 },
  "Mitrovica": { latitude: 42.8905, longitude: 20.8664 },
  "Peja": { latitude: 42.6514, longitude: 20.2973 },
  "Gjakova": { latitude: 42.3803, longitude: 20.4356 },
  "Ferizaj": { latitude: 42.3706, longitude: 21.1556 },
  "Prizren": { latitude: 42.2139, longitude: 20.7397 },
  "Gjilan": { latitude: 42.4636, longitude: 21.4691 }
};

const HomeScreen = () => {
  const [selectedCity, setSelectedCity] = useState('Prishtina');
  const [prayerTimes, setPrayerTimes] = useState({});
  const [isDay, setIsDay] = useState(true);
  const [manualMode, setManualMode] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState(new Date().getHours());

  const fetchPrayerTimes = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=2`
      );
      const data = await response.json();
      setPrayerTimes(data.data.timings);
    } catch (error) {
      console.error("Gabim gjatë marrjes së kohëve të faljeve:", error);
    }
  };

  useEffect(() => {
    const { latitude, longitude } = cities[selectedCity];
    fetchPrayerTimes(latitude, longitude);
  }, [selectedCity]);

  useEffect(() => {
    if (!manualMode) {
      const now = new Date();
      const hours = now.getHours();
      setTimeOfDay(hours);
      setIsDay(hours >= 5 && hours < 19);
    }
  }, [manualMode]);

  const calculatePosition = (timeOfDay) => {
    const percentage = (timeOfDay / 24) * 100;
    return percentage;
  };

  const toggleManualMode = () => {
    setManualMode(!manualMode);
  };

  const toggleDayNight = () => {
    if (manualMode) {
      setIsDay(!isDay);
    }
  };

  return (
    <div className={`app-container ${isDay ? 'day' : 'night'}`}>
      <div className="background-elements">
        {isDay ? (
          <>
            <div
              className="sun"
              style={{ left: `${calculatePosition(timeOfDay)}%` }}
            ></div>
            <div className="clouds"></div> {/* Add clouds here */}
          </>
        ) : (
          <>
            <div
              className="moon"
              style={{ left: `${calculatePosition(timeOfDay)}%` }}
            ></div>
            <div className="stars"></div>
          </>
        )}
      </div>
      <div className="content">
        <h1>Vaktet e Faljeve</h1>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
        >
          {Object.keys(cities).map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
        <div className="prayer-times">
          <h2>{selectedCity}</h2>
          {Object.keys(prayerTimes).length > 0 ? (
            <ul>
              {Object.entries(prayerTimes).map(([prayer, time]) => (
                <li key={prayer}>
                  {prayer}: {time}
                </li>
              ))}
            </ul>
          ) : (
            <p>Duke ngarkuar kohët e faljeve...</p>
          )}
        </div>
        <button onClick={toggleManualMode}>
          {manualMode ? 'Ndërrim Automatik' : 'Ndërrim Manual'}
        </button>
        <button onClick={toggleDayNight} disabled={!manualMode}>
          Ndërro Ditë/Natë
        </button>
      </div>
    </div>
  );
};

export default HomeScreen;
