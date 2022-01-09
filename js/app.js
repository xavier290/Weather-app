const api = {
    key: "6dc03e881dc8b962bc1a29daeb884c5b",
    base: "https://api.openweathermap.org/data/2.5/",
    units: {
        celcius: "metric",
        farenheit: "imperial"
    }
};

window.addEventListener("load", () => {
    if (navigator.geolocation)  {
      navigator.geolocation.getCurrentPosition(
          (position) => {
              geo_success(position)
          }, () => {
              handleLocationError(true)
          }
      )
    }
    else {
        handleLocationError(false)
    }
});

function handleLocationError(browserHasGeolocation) {
    if(browserHasGeolocation) {
        alert("Error: The Geolocation service failed.")
    }
    else {
        alert("Error: Your browser doesn't support geolocation.")
    }
}

async function geo_success(position) {
    let lat = position.coords.latitude
    let lng = position.coords.longitude

    try {
        let res = await fetch(`${api.base}find?lat=${lat}&lon=${lng}&units=${api.units.celcius}&appid=${api.key}`)
        let data =  await res.json()
        console.log(data)
        renderWeatherData(data)
    } catch (error) {
        console.log(error)
    }
}

async function renderWeatherData(data) {
    theDate()

    const location = document.querySelector(".location")
    location.innerHTML = `<div class="country"><h1>${data.list[0].sys.country}</h1></div>
                          <div class="city"><h2>${data.list[0].name}</h2></div>`

    const description = document.querySelector(".weather-condition")
    description.innerHTML = `<div class="text"><p>${data.list[0].weather[0].description}</p</div>`

    const temp = document.querySelector(".temp")
    temp.innerHTML = `<p class="number">${data.list[0].main.temp}</p>
                      <div class="symbol">°C</div>`

    const details = document.querySelector(".details")
    details.innerHTML = 
        `<div class="box">
            <div class="humidity">
                <div>
                    <p>${data.list[0].main.humidity}</P>
                    <div class="symbol">%</div>
                </div>
                <h3 class="title">Humidity</h3>
            </div>
            <div class="wind">
                <div>
                    <p>${data.list[0].wind.speed}</p>
                    <div class="symbol">mts</div>
                </div>
                <h3 class="title">Wind</h3>
            </div>
            <div class="pressure">
                <div>
                    <p>${data.list[0].main.pressure}</p>
                    <div class="symbol">Pa</div>
                </div>
                <h3 class="title">Pressure</h3>
            </div>
        </div>`
}

function theDate() {
    let now = new Date();
    let date = document.querySelector(".date");
    date.innerHTML = dateBuilder(now);
}

function dateBuilder(d) {
    let months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    let days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
  
    let day = days[d.getDay()];
    let date = d.getDate() + ",";
    let month = months[d.getMonth()];
    let year = d.getFullYear();
  
    return `${day} ${date} ${month} ${year}`;
}