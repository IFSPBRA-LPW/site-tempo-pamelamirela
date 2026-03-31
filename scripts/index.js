import { API_KEY } from "./config.js";

async function fetchWeather(city) {
  const response = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=7&lang=pt`
  );

  if (!response.ok) {
    throw new Error("Erro ao buscar dados da API");
  }

  return response.json();
}

function adaptData(apiData) {
  return {
    city: apiData.location.name,
    country: apiData.location.country,
    date: apiData.location.localtime,
    temperature: Math.round(apiData.current.temp_c),
    feelsLike: Math.round(apiData.current.feelslike_c),
    humidity: apiData.current.humidity,
    wind: apiData.current.wind_kph,
    precipitation: apiData.current.precip_mm,

    daily: apiData.forecast.forecastday.map(day => ({
      day: new Date(day.date).toLocaleDateString("pt-BR", { weekday: "short" }),
      max: Math.round(day.day.maxtemp_c),
      min: Math.round(day.day.mintemp_c),
    })),

    hourly: apiData.forecast.forecastday[0].hour.map(hour => ({
      time: hour.time.split(" ")[1],
      temp: Math.round(hour.temp_c),
    })),
  };
}

function renderBannerInfo(data) {
  document.querySelector("#city").textContent =
    `${data.city}, ${data.country}`;

  document.querySelector("#date").textContent = data.date;

  document.querySelector("#temp").textContent =
    `${data.temperature}°`;
}

function renderDayInfo(data) {
  document.querySelector("#feels").textContent =
    `${data.feelsLike}°`;

  document.querySelector("#humidity").textContent =
    `${data.humidity}%`;

  document.querySelector("#wind").textContent =
    `${data.wind} km/h`;

  document.querySelector("#precipitation").textContent =
    `${data.precipitation} mm`;
}


function renderDaily(dailyData) {
  const daily = document.querySelector(".daily");

  daily.innerHTML = `<p class="titulo-secao">Daily Forecast</p>`;

  dailyData.forEach(day => {
    const section = document.createElement("section");

    section.innerHTML = `
      <p>${day.day}</p>
      <p>${day.max}° / ${day.min}°</p>
    `;

    daily.appendChild(section);
  });
}


function renderHourly(hourlyData) {
  const hourly = document.querySelector(".hourly");

  hourly.innerHTML = `
    <p class="titulo-secao">Hourly forecast</p>
  `;

  hourlyData.slice(0, 8).forEach(item => {
    const li = document.createElement("li");
    li.classList.add("forecast-item");

    li.textContent = `${item.time} ${item.temp}°`;

    hourly.appendChild(li);
  });
}


async function loadWeather(city) {
  try {
    const apiData = await fetchWeather(city);
    const data = adaptData(apiData);

    renderBannerInfo(data);
    renderDayInfo(data);
    renderDaily(data.daily);
    renderHourly(data.hourly);

    localStorage.setItem("lastCity", city);
  } catch (error) {
    alert("Cidade não encontrada!");
  }
}

function setupSearch() {
  const form = document.querySelector("form");
  const input = document.querySelector("input[name='place']");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const city = input.value.trim();

    if (city) {
      loadWeather(city);
    }
  });
}

function init() {
  const lastCity = localStorage.getItem("lastCity") || "São Paulo";

  loadWeather(lastCity);
  setupSearch();
}

init();