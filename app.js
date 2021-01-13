let long; // variable to storage the longitude of our current position
let lat; // variable to storage the latitude of our current position

let $ = (selector) => document.querySelector(selector); // this is to avoid writing document.querySelector again and again

const city = $(`.city`);
const tem = $(`.temp`);
const weatherDes = $(`.weather`);
const current = $(`.current`);
const span = $(`.current span`);
const proxy = "https://cors-anywhere.herokuapp.com/";

const feelsLike = $(`.feels`);
const tempMax = $(`.max`);
const tempMin = $(`.min`);
const hum = $(`.humidity`);
const Pressure = $(`.pressure`);

window.addEventListener("load", () => {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition((position) => {
			long = position.coords.longitude;
			lat = position.coords.latitude;

			const api = `${proxy}api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=31082aca407daab1546d6553ae49ef9d`;

			fetch(api)
				.then((response) => {
					return response.json();
				})
				.then((data) => {
					// console.log(data);

					// now we save some information from the api into variables to display it in the screen
					const { name } = data;
					const { country } = data.sys;
					const {
						temp,
						feels_like,
						humidity,
						temp_max,
						temp_min,
						pressure,
					} = data.main;
					const { id, description } = data.weather[0];
					let temperature = Math.round(temp - 273);

					city.textContent = name + ", " + country;
					weatherDes.textContent = description;
					tem.textContent = temperature;
					feelsLike.textContent = "temp feels like: " + feels_like;
					tempMax.textContent = "temp max: " + temp_max + "°c";
					tempMin.textContent = "temp min: " + temp_min + "°c";
					hum.textContent = `humidity: ${humidity}%`;
					Pressure.textContent = "pressure: " + pressure;

					// set icon according to the conditions of the weather
					setIcon(id);
				});
		});
	}
});

const api = {
	key: "31082aca407daab1546d6553ae49ef9d",
	base: "https://api.openweathermap.org/data/2.5/",
};

const searchbox = $(`.search-box`);

searchbox.addEventListener("keypress", (evt) => {
	if (evt.keyCode == 13) {
		getResults(searchbox.value);
	}
});

function getResults(query) {
	fetch(`${api.base}weather?q=${query}&units=metric&appid=${api.key}`)
		.then((results) => {
			return results.json();
		})
		.then(displayResults);
}

function displayResults(results) {
	// console.log(results);

	const { name } = results;
	const { country } = results.sys;
	const {
		temp,
		feels_like,
		humidity,
		temp_max,
		temp_min,
		pressure,
	} = results.main;
	const { id, description } = results.weather[0];
	let temperature = Math.round(temp);

	city.textContent = name + ", " + country;
	weatherDes.textContent = description;
	tem.textContent = temperature;
	feelsLike.textContent = "temp feels like: " + feels_like + "°c";
	tempMax.textContent = "temp max: " + temp_max + "°c";
	tempMin.textContent = "temp min: " + temp_min + "°c";
	hum.textContent = "humidity: " + humidity + "%";
	Pressure.textContent = "pressure: " + pressure;

	setIcon(id);
}

document.getElementById("moreInfo").addEventListener("click", showInfo);

function showInfo() {
	document.getElementById("toggleInfo").classList.toggle("active");
}

function setIcon(id) {
	var skycons = new Skycons({ color: "white" });

	if (id < 250) {
		skycons.add("icon", Skycons.WIND);
	} else if (id < 550) {
		skycons.add("icon", Skycons.RAIN);
	} else if (id < 650) {
		skycons.add("icon", Skycons.SNOW);
	} else if (id < 800) {
		skycons.add("icon", Skycons.FOG);
	} else if (id === 800) {
		skycons.add("icon", Skycons.CLEAR_DAY);
	} else if (id > 800) {
		skycons.add("icon", Skycons.PARTLY_CLOUDY_DAY);
	}
	skycons.play();
}
