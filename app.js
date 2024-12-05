
const API_KEY = '1VFVugekLeqYWdMNsbzpwjWX6yAUb5a1';
const BASE_URL = 'https://api.tomorrow.io/v4/weather/forecast';

document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Obtenez la localisation actuelle de l'utilisateur
    const location = await getUserLocation();
    const weatherData = await fetchWeatherData(location);
    displayCurrentWeather(weatherData, location);
    checkDarkMode(weatherData);
  } catch (error) {
    console.error('Erreur lors de la récupération des données météo ou de la localisation :', error);
  }
});

// Fonction pour obtenir la localisation actuelle
async function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject('La géolocalisation n\'est pas prise en charge par ce navigateur.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        resolve(`${latitude}, ${longitude}`);
      },
      (error) => {
        reject(`Erreur lors de l'obtention de la localisation : ${error.message}`);
      }
    );
  });
}

// Fonction pour récupérer les données météo
async function fetchWeatherData(location) {
  const url = `${BASE_URL}?location=${location}&apikey=${API_KEY}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Erreur ${response.status}: ${response.statusText}`);
  const data = await response.json();
  
  return data.timelines.daily; // Retourne les données journalières
}

// Fonction pour afficher la météo actuelle et celle de demain
function displayCurrentWeather(data, location) {
  const today = data[0].values; // Météo du jour
  const tomorrow = data[1].values; // Météo du lendemain

  // Convertir les dates en format lisible
  const todayDate = new Date(data[0].time).toLocaleDateString();
  const tomorrowDate = new Date(data[1].time).toLocaleDateString();

  document.getElementById('current-temp').textContent = `${today.temperatureMax}°C`;
  document.getElementById('location').textContent = `Localisation : ${location}`;

  const forecastContainer = document.getElementById('forecast-container');
  forecastContainer.innerHTML = `
    <p><strong>${todayDate}</strong> : Max ${today.temperatureMax}°C, Min ${today.temperatureMin}°C</p>
    <p><strong>${tomorrowDate}</strong> : Max ${tomorrow.temperatureMax}°C, Min ${tomorrow.temperatureMin}°C</p>
  `;
}

// Fonction pour gérer le mode sombre
// Fonction pour activer le mode sombre en fonction des heures de lever/coucher du soleil
function checkDarkMode(data) {
  const today = data[0].values;

  // Extraire les heures de lever et de coucher du soleil
  const sunrise = new Date(today.sunriseTime).getHours();
  const sunset = new Date(today.sunsetTime).getHours();
  
  // Heure actuelle
  const currentTime = new Date().getHours();

  console.log(`Heure actuelle : ${currentTime}`);
  console.log(`Lever du soleil : ${sunrise}, Coucher du soleil : ${sunset}`);

  // Activer ou désactiver le mode sombre
  if (currentTime >= sunset || currentTime < sunrise) {
    document.body.classList.add('dark-mode'); // Ajouter la classe pour le mode sombre
    console.log('Mode sombre activé');
  } else {
    document.body.classList.remove('dark-mode'); // Supprimer la classe pour le mode sombre
    console.log('Mode sombre désactivé');
  }
}
