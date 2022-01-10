const searchbox = document.querySelector(".search-box")
const layer = document.querySelector(".not-available")
const citiesNear = document.querySelector(".more")

let elements = document.getElementsByClassName("info-card")

const api = {
    key: "6dc03e881dc8b962bc1a29daeb884c5b",
    base: "https://api.openweathermap.org/data/2.5/",
    units: {
        celcius: "metric",
        farenheit: "imperial"
    }
}

window.addEventListener("load", () => {
    theDate()

    if (navigator.geolocation)  {
      navigator.geolocation.getCurrentPosition(
          (position) => {
              geo_success(position)
          }, () => {
              handleLocationError(true, false) // in case there were any errors while trying to get location
          }
      )
    } else {
        handleLocationError(false, false) // for when browser doesn't support geolocation
    }
})

function handleLocationError(browserHasGeolocation, showCitiesNearU) {
    if(!showCitiesNearU) {
        layer.style.display = "flex"
        citiesNear.style.display = "none"
    }

    let infoWindow = browserHasGeolocation ? "Error: The Geolocation service failed." 
                                           : "Error: Your browser doesn't support geolocation."
    alert(infoWindow)
}

async function geo_success(position) {
    let lat = position.coords.latitude
    let lng = position.coords.longitude

    try {
        let res = await fetch(`${api.base}find?lat=${lat}&lon=${lng}&units=${api.units.celcius}&appid=${api.key}`)
        let data =  await res.json()
        renderMainWeatherData(data)

        if(data.count > 0) renderOtherWeatherData(data)
        else citiesNear.style.display = "none"
    } catch (error) {
        console.log(error)
    }
}

function renderMainWeatherData(data) {
    const location = document.querySelector(".location")
    location.innerHTML = `<div class="country"><h1>${data.list[0].sys.country}</h1></div>
                          <div class="city"><h2>${data.list[0].name}</h2></div>`

    const description = document.querySelector(".weather-condition")
    description.innerHTML = `<div class="text"><p>${data.list[0].weather[0].description}</p</div>`

    const temp = document.querySelector(".temp")
    temp.innerHTML = `<p class="number">${data.list[0].main.temp}</p>
                      <div class="symbol">°C</div>`

    const details = document.querySelector(".box")
    details.innerHTML = 
        `<div class="humidity">
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
        </div>`
}

function renderOtherWeatherData(data) {
    buildCards(data)
    renderTitles(data)
    renderOtherData(data)
}

function buildCards(data) {
    const card = document.querySelector(".more .box")
    
    while (elements.length < data.count - 1 && elements.length < 5) {
        card.innerHTML += `<section class="info-card">
                            <div class="city-icon">
                                <img src="./images/city-icon.png" alt="" srcset="">
                            </div>
                            <div class="content">
                                <div class="title"></div>
                                <div class="info"></div>
                            </div>
                        </section>`
    }
}

function renderTitles(data) {
    const more = document.querySelectorAll(".content .title")
    let titles = []
    //getting cities names from the json and placing it into an object to pass it into the html
    for (i = 1; i < data.count; i++) {
        const name = `${data.list[i].name}`
        titles.push(name)
    }
    for (i = 0; i < data.count - 1; i++) {
        more[i].innerHTML = `<h2>${titles[i]}</h2>`
    }
}

function renderOtherData(data) {
    const more = document.querySelectorAll(".content .info")
    let temp = []
    let hum = []
    let press = []
    let wind = []
    // getting temperature, pressure, wind and humitity and displaying them
    for (i = 1; i < data.count; i++) {
        const Temp = `${data.list[i].main.temp}`
        const Hum = `${data.list[i].main.humidity}`
        const Press = `${data.list[i].main.pressure}`
        const Wind = `${data.list[i].wind.speed}`

        temp.push(Temp)
        hum.push(Hum)
        press.push(Press)
        wind.push(Wind)
    }
    for (i = 0; i < data.count - 1; i++) {
        more[i].innerHTML = `<p>Temp: ${temp[i]}°C</p>
                             <p>Hum: ${hum[i]}%</p>
                             <p>Press: ${press[i]}Pa</p>
                             <p>Wind: ${wind[i]}mts</p>`
    }
}

searchbox.addEventListener("keypress", (evt) => {
    if (evt.keyCode == 13) {
        getResults(searchbox.value)
        layer.style.display = "none"
    }
})

async function getResults(value) {
    try {
        let res = await fetch(`${api.base}find?q=${value}&units=${api.units.celcius}&appid=${api.key}`)
        let data = await res.json()
        
        if(data.count == "0" || data.cod == "400" || data.message == "bad query") {
            cityNotFound(false)
        } else {
            renderMainWeatherData(data)
            renderOtherWeatherData(data)
            citiesNear.style.display = "flex"
        }
    } catch(error) {
        console.log(error)
    }
}

function cityNotFound(cityFound) {
    if(!cityFound) {
        alert("Error: city not found! try looking for something else")
    }
}

function theDate() {
    let now = new Date()
    let date = document.querySelector(".date")
    date.innerHTML = dateBuilder(now)
}

function dateBuilder(d) {
    let months = [
      "January", "February", "March", "April", "May", "June", "July",
      "August", "September", "October", "November", "December",
    ]
    let days = [
      "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
    ]
  
    let day = days[d.getDay()]
    let date = d.getDate() + ","
    let month = months[d.getMonth()]
    let year = d.getFullYear()
  
    return `${day} ${date} ${month} ${year}`
}