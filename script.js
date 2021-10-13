let cityArr = [];

function fetchWeatherByCity (cityName) {
    // Weather display creation
    fetch(`https://wttr.in/${cityName}?format=j1`)
        .then((res) => res.json())
        .then((data) => {
            let p = document.querySelector('#city-info');
            p.innerHTML = 
            `<h2>${cityName}</h2>
            <div><strong>Area:</strong> ${data.nearest_area[0].areaName[0].value}</div>
            <div><strong>Region:</strong> ${data.nearest_area[0].region[0].value}</div>
            <div><strong>Country:</strong> ${data.nearest_area[0].country[0].value}</div>
            <div><strong>Currently:</strong> Feels Like ${data.current_condition[0].FeelsLikeF} &deg;F</div>
            <div><strong>${data.current_condition[0].weatherDesc[0].value}</strong></div>` // <------ADDED THIS LINE

            // UPDATE EVERYTHING BELOW THIS LINE ------------------------------
            let weatherDiv = document.querySelector('#weather-condition div');
            let secondWeatherDiv = document.querySelector('#second-div');

            let conditionValue = data.current_condition[0].weatherDesc[0].value;
            if (conditionValue === 'Sunny' || conditionValue === 'Clear') {
                weatherDiv.id = "sunny";
            } else if (conditionValue === 'Overcast' || conditionValue === 'Partly cloudy' || conditionValue === 'Cloudy') {
                weatherDiv.id = 'cloudy';
            } else if (conditionValue === 'Shower in vicinity' || conditionValue.toLowerCase().includes('rain') || conditionValue.toLowerCase().includes('mist')) {
                weatherDiv.id = 'rain';
                secondWeatherDiv.setAttribute('class', "dark-clouds");
            } else if (conditionValue.includes('snow')) {
                weatherDiv.id = 'snow';
                secondWeatherDiv.setAttribute('class', "#");
            }
            // --------------------------------------

            let threeDay = document.querySelector('#three-days');
            threeDay.innerHTML = 
            `<div id="today">
                <h3>Today</h3>
                <div><strong>Average Temperature: </strong>${data.weather[0].avgtempF}&deg;F</div>
                <div><strong>Max Temperature: </strong>${data.weather[0].maxtempF}&deg;F</div>
                <div><strong>Min Temperature: </strong>${data.weather[0].mintempF}&deg;F</div>
            </div>
            <div id="tomorrow">
                <h3>Tomorrow</h3>
                <div><strong>Average Temperature: </strong>${data.weather[1].avgtempF}&deg;F</div>
                <div><strong>Max Temperature: </strong>${data.weather[1].maxtempF}&deg;F</div>
                <div><strong>Min Temperature: </strong>${data.weather[1].mintempF}&deg;F</div>
            </div>
            <div id="after-tomorrow">
                <h3>Day After Tomorrow</h3>
                <div><strong>Average Temperature: </strong>${data.weather[2].avgtempF}&deg;F</div>
                <div><strong>Max Temperature: </strong>${data.weather[2].maxtempF}&deg;F</div>
                <div><strong>Min Temperature: </strong>${data.weather[2].mintempF}&deg;F</div>
            </div>`

            // Add links to previous searches sidebar 
            let ul = document.querySelector('#previous-city');
            let li = document.createElement('li');
            let anchor = document.createElement('a');
            let span = document.createElement('span');
            span.innerHTML = ` - ${data.current_condition[0].FeelsLikeF} &deg;F`
            anchor.setAttribute('href', `#${cityName}`);
            anchor.textContent = `${cityName}`

            let noSearches = document.querySelector('#no-searches');

            anchor.addEventListener('click', (e) => {
                fetchWeatherByCity(e.target.textContent);
            })

            // Check to see if city has been searched before to avoid duplicates
            if (!cityArr.includes(cityName)) {
                cityArr.unshift(cityName);
                li.append(anchor, span);
                ul.append(li);
                if (cityArr.length === 1) noSearches.remove(); 
            }
        })
}

// When form has been submitted, weather details will populate
let form = document.querySelector('#weather-search');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
        // User input validation
    let city = e.target.city.value;
    let checkCityName = city; 
    checkCityName = checkCityName.split(' ').join('');
    let regArr = checkCityName.match(/[^a-z]/gi)||[];
    
    if (city.trim() === '' || regArr.length) {
        let div = document.createElement('div');
        div.textContent = 'Please enter a valid city!'
        div.id = 'error';
        form.before(div);

        let weatherSearch = document.querySelector('#weather-search-city')
        weatherSearch.addEventListener('focus', () =>{
            div.style.display = 'none';
        })
        } else {
            let citySplit = city.split(' ');
            let cityReturn = citySplit.map((el) => el[0].toUpperCase() + el.slice(1))
            
            city = cityReturn.join(' ')
            fetchWeatherByCity(city);
        }
    e.target.city.value = '';
})
