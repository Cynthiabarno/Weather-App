let currentTime = new Date();

let time = document.querySelector("#time");

let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let day = days[currentTime.getDay()];

let hours = currentTime.getHours();
let minutes = currentTime.getMinutes();

if (hours < 10) {
  hours = `0${hours}`;
}
if (minutes < 10) {
  minutes = `0${minutes}`;
}

time.innerHTML = `${day}, ${hours}:${minutes}`;

function formatDay(timestamp) {
  let now = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let day = now.getDay();
  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
      <div class="col-sm">
        <div>${formatDay(forecastDay.dt)}</div>
        <div>
          <img
            src="https://openweathermap.org/img/wn/${
              forecastDay.weather[0].icon
            }@2x.png"
            alt=""
            width="50"
          />
        </div>
        <div>${Math.round(forecastDay.temp.max)} / ${Math.round(
          forecastDay.temp.min
        )} °C</div>
      </div>
    `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  console.log(coordinates);
  let apiKey = "5f472b7acba333cd8a035ea85a0d4d4c";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(displayForecast);
}

function showTemperature(response) {
  getForecast(response.data.coord);

  document.querySelector("h1").innerHTML = response.data.name;

  celciusTemperature = response.data.main.temp;
  document.querySelector("#temper").innerHTML = Math.round(celciusTemperature);
  document.querySelector("#temperature-description").innerHTML =
    response.data.weather[0].description;
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
}

function searchCity(city) {
  let apiKey = "5f472b7acba333cd8a035ea85a0d4d4c";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showTemperature);
}

function enterCity(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#enter-city");
  let city = searchInput.value;
  searchCity(city);
}

let form = document.querySelector("#search-form");
form.addEventListener("click", enterCity);

function currentPosition(position) {
  let apiKey = "5f472b7acba333cd8a035ea85a0d4d4c";
  let apiUrl =
    "https://api.openweathermap.org/data/2.5/weather?lat=${position.coord.lat}&lon=${position.coord.lon}&appid=${apiKey}&units=metric";
  axios.get(apiUrl).then(showTemperature);
}

function currentCity(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(currentPosition);
}

let button = document.querySelector("#location");
button.addEventListener("click", currentCity);

function displayFahrenheitTemperature(event) {
  event.preventDefault();
  let temperature = document.querySelector("#temper");

  celciusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");

  let fahrenheitTemperature = (celciusTemperature * 9) / 5 + 32;
  temperature.innerHTML = Math.round(fahrenheitTemperature);
}

function displayCelciusTemperature(event) {
  event.preventDefault();
  let temperature = document.querySelector("#temper");

  celciusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  temperature.innerHTML = Math.round(celciusTemperature);
}

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

let celciusLink = document.querySelector("#celcius-link");
celciusLink.addEventListener("click", displayCelciusTemperature);

let celciusTemperature = null;

searchCity("Nairobi");
