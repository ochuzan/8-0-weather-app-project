let cityArr = [];
 let form = document.querySelector('#weather-search');
 function fetchWeatherByCity(cityName) {

     fetch(`https://wttr.in/${cityName}?format=j1`)
         .then((res) => res.json())
         .then((data) => {
             if(data.nearest_area[0].areaName[0].value !== "Ban Not") {
                 let p = document.querySelector('#city-info');
                 p.innerHTML = 
                 `<h2>${cityName}</h2>
                 <div><strong>Area:</strong> ${data.nearest_area[0].areaName[0].value}</div>
                 <div><strong>Region:</strong> ${data.nearest_area[0].region[0].value}</div>
                 <div><strong>Country:</strong> ${data.nearest_area[0].country[0].value}</div>
                 <div><strong>Currently:</strong> Feels Like ${data.current_condition[0].FeelsLikeF} &deg;F</div>
                 <div><strong>${data.current_condition[0].weatherDesc[0].value}</strong></div>`;
                 let weatherDiv = document.querySelector('#weather-condition div');

                 let conditionValue = data.current_condition[0].weatherDesc[0].value;
                 if (conditionValue === 'Sunny' || conditionValue === 'Clear') {
                     weatherDiv.id = "sunny";
                 } else if (conditionValue === 'Overcast' || conditionValue === 'Partly cloudy' || conditionValue === 'Cloudy') {
                     weatherDiv.id = 'cloudy';
                 } else if (conditionValue === 'Shower in vicinity' || conditionValue.includes('rain') || conditionValue === 'Patchy rain possible') {
                     weatherDiv.id = 'rain';
                 } else if (conditionValue.includes('snow')) {
                     weatherDiv.id = 'snow';
                 }

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

                 // adding links to the sidebar (class of history)
                 let ul = document.querySelector('#previous-city');
                 let li = document.createElement('li');
                 let anchor = document.createElement('a');
                 let span = document.createElement('span');
                 span.innerHTML = ` - ${data.current_condition[0].FeelsLikeF} &deg;F`
                 anchor.setAttribute('href', `#`);
                 anchor.textContent = `${cityName}`;
                 anchor.addEventListener("click", (e)=> {
                     // On click reconstruct the page
                     fetchWeatherByCity(e.target.textContent);
                 })
                 let noSearches = document.querySelector('#no-searches');

                 // Avoiding duplicated history links
                 if (!cityArr.includes(cityName.toLowerCase())) {
                     cityArr.unshift(cityName.toLowerCase());
                     li.append(anchor, span);
                     ul.append(li);
                     if (cityArr.length === 1) noSearches.remove(); 
                 }

             }
             else {
                 let inp=document.querySelector("#weather-search-city");
                 let div=document.createElement("div");
                 div.textContent="Invalid city name!";
                 div.setAttribute("id", "error");
                 form.before(div);

                 inp.addEventListener("focus", ()=>{
                     div.style.display="none";
                 })
             }

         })
             
 }

 // On submit construct the page
form.addEventListener('submit', (e) => {
    e.preventDefault();
     let city = e.target.city.value;
     let checkCityName=city;
     checkCityName=checkCityName.split(" ").join("");
      // User input validation
     let regArr=checkCityName.match(/[^a-z]/gi)||[];
     if(city.trim()==="" || regArr.length){
         let inp=document.querySelector("#weather-search-city");
        let div=document.createElement("div");
        div.textContent="Please enter a valid city!";
        div.setAttribute("id", "error");
        form.before(div);
        inp.addEventListener("focus", ()=>{
             div.style.display="none";
         })

     } else if(cityArr.includes(city.toLowerCase())) {
         let inp=document.querySelector("#weather-search-city");
         let div=document.createElement("div");
         div.textContent="City already entered!";
         div.setAttribute("id", "error");
         form.before(div);

         inp.addEventListener("focus", ()=>{
             div.style.display="none";
         })
     }
     else {
         let citySplit=city.split(" ");
        let splitReturn = citySplit.map(el=>el[0].toUpperCase()+el.slice(1))
                                                                                    
        city=splitReturn.join(" ");
        fetchWeatherByCity(city);
    }
    e.target.city.value = '';
})