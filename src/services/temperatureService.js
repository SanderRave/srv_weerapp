const API_BASE_URL = 'https://scheveningen-weerapp.onrender.com'; // Backend server URL

export async function fetchTemperatureData() {
  try {
    // Make the POST request to the backend
    const response = await fetch(`${API_BASE_URL}/api/temperature`, {
      method: 'POST', // HTTP method
      headers: {
        'Content-Type': 'application/json', // Set the request content type
      },
      body: JSON.stringify({
        LocatieLijst: [
          { Code: 'HOEK', X: 576917.675576278, Y: 5759136.13463449 }, // Hoek van Holland
        ],
        AquoPlusWaarnemingMetadataLijst: [
          { AquoMetadata: { Compartiment: { Code: 'OW' }, Grootheid: { Code: 'T' } } }, // Water temperature
          { AquoMetadata: { Compartiment: { Code: 'LT' }, Grootheid: { Code: 'T' } } }, // Air temperature
        ],
      }),
    });

    // Check if the response is successful
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse the JSON response
    const data = await response.json();

    // Extract water temperature
    const waterTempItem = data.WaarnemingenLijst?.find(
      (item) =>
        item.Locatie.Code === 'HOEK' &&
        item.AquoMetadata.Compartiment.Code === 'OW' &&
        item.AquoMetadata.Grootheid.Code === 'T'
    );

    // Extract air temperature
    const airTempItem = data.WaarnemingenLijst?.find(
      (item) =>
        item.Locatie.Code === 'HOEK' &&
        item.AquoMetadata.Compartiment.Code === 'LT' &&
        item.AquoMetadata.Grootheid.Code === 'T'
    );

    // Safely access temperature values, or fallback to '--' if missing
    const waterTemp =
      waterTempItem?.MetingenLijst?.[0]?.Meetwaarde?.Waarde_Numeriek ?? '--';
    const airTemp =
      airTempItem?.MetingenLijst?.[0]?.Meetwaarde?.Waarde_Numeriek ?? '--';

    // Return the extracted temperatures
    return {
      waterTemp,
      airTemp,
    };
  } catch (error) {
    console.error('Error fetching temperature data:', error);
    throw error; // Re-throw error to handle it in the caller
  }
}
