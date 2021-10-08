let cityArr = [];

function fetchWeatherByCity (cityName) {
    fetch(`https://wttr.in/${cityName}?format=j1`)
    .then((res) => res.json())
    .then((data) => {
        console.log(data);
        let p = document.querySelector('#city-info');
        p.innerHTML = 
        `<h2>${cityName}</h2>
        <div><strong>Area:</strong> ${data.nearest_area[0].areaName[0].value}</div>
        <div><strong>Region:</strong> ${data.nearest_area[0].region[0].value}</div>
        <div><strong>Country:</strong> ${data.nearest_area[0].country[0].value}</div>
        <div><strong>Currently:</strong> Feels Like ${data.current_condition[0].FeelsLikeF} &deg;F</div>`

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

        // let history = document.querySelector('#history-content');
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

        if (!cityArr.includes(cityName)) {
            cityArr.unshift(cityName);
            li.append(anchor, span);
            ul.append(li);
            if (cityArr.length === 1) noSearches.remove(); 
        }

        // if (cityArr) noSearches.style.display = 'none';
    })
}

let form = document.querySelector('#weather-search');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    let city = e.target.city.value;
    e.target.city.value = '';
    fetchWeatherByCity(city);
})

// let anchorList = document.querySelectorAll('a');
// anchorList.forEach(el => {
//     el.addEventListener('click', (e) => {
//         history.go(-cityArr.indexOf(e.target));
//     })
// })