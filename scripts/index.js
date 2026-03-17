import { cityWeather } from "./data.js";

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

  hourlyData.forEach(item => {
    const li = document.createElement("li");
    li.classList.add("forecast-item");

    li.textContent = `${item.time} ${item.temp}°`;

    hourly.appendChild(li);
  });
}


function init() {
  renderBannerInfo(cityWeather);
  renderDayInfo(cityWeather);
  renderDaily(cityWeather.daily);
  renderHourly(cityWeather.hourly);
}
init();