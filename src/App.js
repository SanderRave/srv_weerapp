import React, { useEffect, useState } from 'react';
import SunCalc from 'suncalc'; // Importeer SunCalc voor zonsopkomst, zonsondergang en maanfase
import './styles.css';

function App() {
  const [temperatures, setTemperatures] = useState({
    waterTemp: null,
    airTemp: null,
  });

  const [sunData, setSunData] = useState({
    sunrise: '',
    sunset: '',
    moonPhase: '',
  });

  useEffect(() => {
    // Fetch temperature data
    async function fetchTemperatureData() {
      try {
        const response = await fetch('/ONLINEWAARNEMINGENSERVICES_DBO/OphalenLaatsteWaarnemingen', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            LocatieLijst: [
              { Code: 'HOEK', X: 576917.675576278, Y: 5759136.13463449 }
            ],
            AquoPlusWaarnemingMetadataLijst: [
              { AquoMetadata: { Compartiment: { Code: 'OW' }, Grootheid: { Code: 'T' } } },
              { AquoMetadata: { Compartiment: { Code: 'LT' }, Grootheid: { Code: 'T' } } }
            ]
          }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('API Response:', data);

        const waterTemp = data.Waarnemingen.find(item =>
          item.Locatie.Code === 'HOEK' &&
          item.AquoMetadata.Grootheid.Code === 'T' &&
          item.AquoMetadata.Compartiment.Code === 'OW'
        )?.Waarde;

        const airTemp = data.Waarnemingen.find(item =>
          item.Locatie.Code === 'HOEK' &&
          item.AquoMetadata.Grootheid.Code === 'T' &&
          item.AquoMetadata.Compartiment.Code === 'LT'
        )?.Waarde;

        setTemperatures({
          waterTemp: waterTemp !== undefined && waterTemp !== 0 ? waterTemp : '--',
          airTemp: airTemp !== undefined && airTemp !== 0 ? airTemp : '--',
        });
      } catch (error) {
        console.error('Fetching temperature data failed:', error);
      }
    }

    fetchTemperatureData();

    // Calculate sunrise, sunset, and moon phase
    const latitude = 51.977;  // Hoek van Holland
    const longitude = 4.123;

    const sunTimes = SunCalc.getTimes(new Date(), latitude, longitude);
    const sunrise = sunTimes.sunrise.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    const sunset = sunTimes.sunset.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

    const moonIllumination = SunCalc.getMoonIllumination(new Date());
    const moonPhase = getMoonPhaseDescription(moonIllumination.phase);

    setSunData({ sunrise, sunset, moonPhase });
  }, []);

  // Helper function to map moon phase to description
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

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-container">
          <img src={`${process.env.PUBLIC_URL}/logo512.png`} className="App-logo" alt="Club Logo" />
          <h1>Current Coastal Conditions</h1>
        </div>
      </header>

      <main>
        <section id="current-conditions">
          <h2>Current Conditions</h2>
          <p>Tidal Stream: <span id="tidal-stream">2.5 knots</span></p>
          <p>Wind Direction: <span id="wind-direction">NE</span></p>
          <p>Wave Height: <span id="wave-height">1.2 meters</span></p>
        </section>

        <section id="forecast">
          <h2>3-Hour Forecast</h2>
          <p>Tidal Stream: <span id="forecast-tidal-stream">2.8 knots</span></p>
          <p>Wind Direction: <span id="forecast-wind-direction">E</span></p>
          <p>Wave Height: <span id="forecast-wave-height">1.5 meters</span></p>
        </section>

        {/* Tidal Information & Additional Details */}
        <section id="tidal-info">
          <h2>Tidal Information & Additional Details</h2>
          <div id="tidal-graph">
            <img src={`${process.env.PUBLIC_URL}/tidal-graph-placeholder.png`} alt="Tidal Graph" />
          </div>
          <p>Sunrise: <span id="sunrise-time">{sunData.sunrise}</span></p>
          <p>Sunset: <span id="sunset-time">{sunData.sunset}</span></p>
          <p>Moon Phase: <span id="moon-phase">{sunData.moonPhase}</span></p>
          <p>Water Temperature: <span id="water-temp">{temperatures.waterTemp !== null ? `${temperatures.waterTemp} °C` : 'Loading...'}</span></p>
          <p>Air Temperature: <span id="air-temp">{temperatures.airTemp !== null ? `${temperatures.airTemp} °C` : 'Loading...'}</span></p>
        </section>

        <footer>
          <h3><a href={`${process.env.PUBLIC_URL}/feedback-form.html`}>Feedback</a></h3>
        </footer>
      </main>
    </div>
  );
}

export default App;
