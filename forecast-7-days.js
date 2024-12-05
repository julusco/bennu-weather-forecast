const API_KEY = '1VFVugekLeqYWdMNsbzpwjWX6yAUb5a1';
const BASE_URL = 'https://api.tomorrow.io/v4/weather/forecast';

// Fonction pour récupérer la géolocalisation de l'utilisateur
function getLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject("La géolocalisation n'est pas prise en charge par votre navigateur.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        resolve({ latitude, longitude });
      },
      (error) => {
        reject(`Erreur de géolocalisation: ${error.message}`);
      }
    );
  });
}

// Fonction principale qui récupère les prévisions météo pour 7 jours
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const { latitude, longitude } = await getLocation();  // Obtenez les coordonnées de l'utilisateur
    console.log(`Localisation détectée : Latitude ${latitude}, Longitude ${longitude}`);
    const forecastData = await fetch7DayForecast(latitude, longitude);  // Passez ces coordonnées à l'API
    display7DayForecast(forecastData);
  } catch (error) {
    console.error('Erreur lors de la récupération des prévisions météo :', error);
  }
});

// Fonction pour récupérer les prévisions météo pour 7 jours
async function fetch7DayForecast(latitude, longitude) {
  const url = `${BASE_URL}?location=${latitude},${longitude}&apikey=${API_KEY}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Erreur ${response.status}: ${response.statusText}`);
  const data = await response.json();
  return data.timelines.daily;
}

// Afficher les prévisions météo sur 7 jours
function display7DayForecast(dailyForecasts) {
  const container = document.getElementById('forecast-container');

  if (!dailyForecasts || dailyForecasts.length === 0) {
    console.error('Aucune prévision disponible');
    alert('Impossible d’afficher les prévisions météo.');
    return;
  }

  container.innerHTML = '';
  dailyForecasts.forEach((day, index) => {
    const dayElement = document.createElement('div');
    dayElement.className = 'forecast-day';

    // Extraire les valeurs nécessaires
    const maxTemp = day.values.temperatureMax || 'N/A'; // Température maximale
    const minTemp = day.values.temperatureMin || 'N/A'; // Température minimale
    const humidity = day.values.humidityAvg !== undefined ? `${day.values.humidityAvg.toFixed(1)}%` : 'Non disponible'; // Humidité moyenne
    const windSpeed = day.values.windSpeedAvg !== undefined ? `${day.values.windSpeedAvg.toFixed(1)} km/h` : 'Non disponible'; // Vent moyen
    const visibility = day.values.visibilityAvg !== undefined ? `${day.values.visibilityAvg.toFixed(1)} km` : 'Non disponible'; // Visibilité moyenne
    const uvIndex = day.values.uvIndexMax !== undefined ? `${day.values.uvIndexMax}` : 'Non disponible'; // Index UV maximal

    // Convertir la date en format lisible
    const dayDate = new Date(day.time).toLocaleDateString();

    // Afficher les données
    dayElement.innerHTML = `
      <p><strong>${dayDate}</strong></p>
      <p>Max : ${maxTemp}°C</p>
      <p>Min : ${minTemp}°C</p>
      <p>Humidité moyenne : ${humidity}</p>
      <p>Vent moyen : ${windSpeed}</p>
      <p>Visibilité moyenne : ${visibility}</p>
      <p>Index UV : ${uvIndex}</p>
    `;
    container.appendChild(dayElement);
  });
}
