# srv_weerapp
Oefening om essentiele gegevens bij elkaar te brengen tbv. roeitrainingen van de Scheveningse Zeeroeivereniging.
De focus ligt op de locale water en weersomstandigheden in en rond Scheveningen haven.

Waar verschilt deze app van bestaande apps?
- De informatie beperkt zich tot de benodigde basisinformatie voor een roeitraining
- De actuele gegevens en verwachtingen worden via de API direct van RWS betrokken
- De niet actuele informatie (zon en maan gegevens) wordt locaal berekend (suncalc)

Acties, op basis van prioriteit
Aanvullende data:
- Current Conditions en Forecast
- Tijdstip hoog-, en laag water Scheveningen
- Zicht, neerslag en onweer
- Grafisch: Wind, stroming, en golfrichting
- Grafisch: Getijdetabel

Performance Optimalisatie:
- Cache responses or implement a state management library like Redux or React Context to minimize API calls.