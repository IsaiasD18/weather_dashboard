//This function is responsible for fetching and displaying weather data for a given city.
function weather() {
    const apiKey = '5dbc17075344bed68c6fe1d5398f786a';
    const cityInput = document.querySelector('#city');
    const city = cityInput.value;
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    //Make a request to the WeatherAPI
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const weatherCard = document.querySelector('#weatherCard');

            if (data.cod === '404') {
                weatherCard.innerHTML = `<p>${data.message}</p>`;
            } else {
                const current = data.list[0].main;
                const forecast = data.list.slice(1, 6); // Get the next 5 forecast entries

                // Add the weather information
                let weatherHTML = '<h2>Current Weather</h2>';

                weatherHTML += `
            <div class="forecast-card">
              <h3>${data.city.name}, ${data.city.country}</h3>
              <p><strong>Temperature:</strong> ${current.temp}°C</p>
              <p><strong>Condition:</strong> ${forecast[0].weather[0].description}</p>
              <p><strong>Humidity:</strong> ${current.humidity}%</p>
              <p><strong>Wind Speed:</strong> ${forecast[0].wind.speed} m/s</p>
              <img src="https://openweathermap.org/img/w/${forecast[0].weather[0].icon}.png" alt="Weather Icon">
            </div>
          `;

                weatherHTML += '<h2>5-Day Forecast</h2>';

                forecast.forEach(day => {
                    const date = new Date(day.dt_txt).toLocaleString();
                    const temp = day.main.temp;
                    const description = day.weather[0].description;
                    const humidity = day.main.humidity;
                    const windSpeed = day.wind.speed;

                    weatherHTML += `
              <div class="forecast-card">
                <h3>${date}</h3>
                <p><strong>Temperature:</strong> ${temp}°C</p>
                <p><strong>Condition:</strong> ${description}</p>
                <p><strong>Humidity:</strong> ${humidity}%</p>
                <p><strong>Wind Speed:</strong> ${windSpeed} m/s</p>
                <img src="https://openweathermap.org/img/w/${day.weather[0].icon}.png" alt="Weather Icon">
              </div>
            `;
                });

                weatherCard.innerHTML = weatherHTML;

                // Add the searched city to the search history
                addToSearchHistory(city);

                // Update the displayed search history list.
                displaySearchHistory();
            }
        })
        .catch(error => {
            const weatherCard = document.getElementById('weatherCard');
            weatherCard.innerHTML = '<p>An error occurred while fetching the weather data.</p>';
        });
}


//This function will add a city to the search history.
function addToSearchHistory(city) {
    const searchHistory = getSearchHistory();

    //If the city being provided is not already in the search history, than add it to the array of cities.
    if (!searchHistory.includes(city)) {
        searchHistory.push(city);
    }

    //Saves the updated search history array back to the localStorage.
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
}

//This function will retrieve the current search history from the localStorage.
function getSearchHistory() {
    const searchHistory = localStorage.getItem('searchHistory');

    //If the value exists, parse it. If it does not exist, it returns an empty array
    return searchHistory ? JSON.parse(searchHistory) : [];
}

//This function will display the search history on the page.
function displaySearchHistory() {
    const historyList = document.querySelector('#historyList');
    historyList.innerHTML = '';

    const searchHistory = getSearchHistory();

    searchHistory.forEach(city => {
        const li = document.createElement('li');
        const button = document.createElement('button');

        button.textContent = city;

        button.addEventListener('click', () => {
            document.querySelector('#city').value = city;
            weather();
        });
        li.appendChild(button);
        historyList.appendChild(li);
    });
}

//wait for the DOM to be ready before executing the funtion
document.addEventListener('DOMContentLoaded', () => {
    displaySearchHistory();
});

// Find the button by its id
const getWeatherBtn = document.querySelector('#getWeatherBtn');

// Attach an event listener to the button so weather() function will be called whenever the button is clicked
getWeatherBtn.addEventListener('click', weather);
