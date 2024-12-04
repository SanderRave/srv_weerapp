export async function fetchTemperatureData() {
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
      throw new Error('Failed to fetch temperature data');
    }
  
    const data = await response.json();
  
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
  
    return {
      waterTemp: waterTemp !== undefined && waterTemp !== 0 ? waterTemp : '--',
      airTemp: airTemp !== undefined && airTemp !== 0 ? airTemp : '--',
    };
  }
  