import React, { useEffect, useState } from 'react';
import SunCalc from 'suncalc'; // Library for sunrise, sunset, and moon phase calculations
import MoonPhaseIcon from './components/MoonPhaseIcon'; // Component for displaying moon phase icon
import './styles.css'; // Styles for the app
import { fetchTemperatureData } from './services/temperatureService'; // API service for temperature data

// Function to get moon phase description
function getMoonPhaseDescription(phase) {
  if (phase === 0 || phase === 1) return 'New Moon';
  if (phase > 0 && phase < 0.25) return 'Waxing Crescent';
  if (phase === 0.25) return 'First Quarter';
  if (phase > 0.25 && phase < 0.5) return 'Waxing Gibbous';
  if (phase === 0.5) return 'Full Moon';
  if (phase > 0.5 && phase < 0.75) return 'Waning Gibbous';
  if (phase === 0.75) return 'Last Quarter';
  if (phase > 0.75 && phase < 1) return 'Waning Crescent';
  return 'Unknown Phase';
}

function App() {
  // State for temperatures
  const [temperatures, setTemperatures] = useState({
    waterTemp: null,
    airTemp: null,
  });

  // State for sun and moon data
  const [sunData, setSunData] = useState({
    sunrise: '',
    sunset: '',
    moonPhase: 0,
  });

  // Fetch temperatures and calculate sun/moon data
  useEffect(() => {
    // Fetch temperature data from API
    const fetchData = async () => {
      try {
        const data = await fetchTemperatureData();  // Fetch data from backend
        setTemperatures(data); // Save data in React state
      } catch (error) {
        console.error('Error fetching temperature data:', error);
      }
    };

    fetchData();

    // Calculate sunrise, sunset, and moon phase
    const latitude = 51.977; // Latitude for Hoek van Holland
    const longitude = 4.123; // Longitude for Hoek van Holland

    const sunTimes = SunCalc.getTimes(new Date(), latitude, longitude);
    const sunrise = sunTimes.sunrise.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    const sunset = sunTimes.sunset.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    const moonIllumination = SunCalc.getMoonIllumination(new Date());
    const moonPhase = moonIllumination.phase; // Numerical value between 0 and 1

    setSunData({ sunrise, sunset, moonPhase });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-container">
          <img
            src={`${process.env.PUBLIC_URL}/logo512.png`}
            className="App-logo"
            alt="Club Logo"
          />
          <h1>Coastal Conditions</h1>
        </div>
      </header>

      <main>
        <section id="current-conditions">
          <h2>Current Conditions</h2>
          <p>
            Tidal Stream: <span id="tidal-stream">2.5 knots</span>
          </p>
          <p>
            Wind Direction: <span id="wind-direction">NW</span>
          </p>
          <p>
            Wave Height: <span id="wave-height">1.2 meters, 6 seconds</span>
          </p>
        </section>

        <section id="forecast">
          <h2>3-Hour Forecast</h2>
          <p>
            Tidal Stream: <span id="forecast-tidal-stream">2.8 knots</span>
          </p>
          <p>
            Wind Direction: <span id="forecast-wind-direction">W</span>
          </p>
          <p>
            Wave Height: <span id="forecast-wave-height">1.5 meters, 5 seconds</span>
          </p>
        </section>

        <section id="tidal-info">
          <h2>Tidal Information & Additional Details</h2>
          <div id="tidal-graph">
            <img
              src={`${process.env.PUBLIC_URL}/tidal-graph-placeholder.png`}
              alt="Tidal Graph"
            />
          </div>
          <p>
            Sunrise: <span id="sunrise-time">{sunData.sunrise}</span>
          </p>
          <p>
            Sunset: <span id="sunset-time">{sunData.sunset}</span>
          </p>
          <p style={{ display: 'flex', alignItems: 'center', gap: '0.5em' }}>
            Moon Phase:
            <MoonPhaseIcon phase={sunData.moonPhase} size="1em" />
            <span>{getMoonPhaseDescription(sunData.moonPhase)}</span>
          </p>
          <p>
            Water Temperature:{' '}
            <span id="water-temp">
              {temperatures.waterTemp !== null
                ? `${temperatures.waterTemp} °C`
                : 'Loading...'}
            </span>
          </p>
          <p>
            Air Temperature:{' '}
            <span id="air-temp">
              {temperatures.airTemp !== null
                ? `${temperatures.airTemp} °C`
                : 'Loading...'}
            </span>
          </p>
        </section>

        <footer>
          <h3>
            <a href={`${process.env.PUBLIC_URL}/feedback-form.html`}>Feedback</a>
          </h3>
        </footer>
      </main>
    </div>
  );
}

export default App;
