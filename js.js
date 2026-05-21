const APIKEY = "c40aa26d07cf0144f50dd6b9bbec98a8"

const mainTemp = document.querySelector("#main-temp")
const mainHumidity = document.querySelector("#humidity")
const windSpeed = document.querySelector("#wind-speed")
const sunrise = document.querySelector("#sunrise")
const sunset = document.querySelector("#sunset")
const pressure = document.querySelector("#pressure")
const feelsLike = document.querySelector("#feels-like")

const nearbyTemp = document.querySelector("#nearby-temp")
const nearbyCity = document.querySelector("#nearby-city")
const nearbyDescription = document.querySelector("#nearby-description")

const nearbyTemp2 = document.querySelector("#nearby-temp2")
const nearbyCity2 = document.querySelector("#nearby-city2")
const nearbyDescription2 = document.querySelector("#nearby-description2")

const searchInput = document.querySelector("#search-input")
const currentCity = document.querySelector("#current-city")

const fc = document.querySelector("#forecast")
const body = document.querySelector("body")

async function sendRequest() {

    const city = searchInput.value

    if(city === "") {
        alert("Введіть місто")
        return
    }

    fc.innerHTML = ""

    nearbyTemp.innerHTML = ""
    nearbyCity.innerHTML = ""
    nearbyDescription.innerHTML = ""

    nearbyTemp2.innerHTML = ""
    nearbyCity2.innerHTML = ""
    nearbyDescription2.innerHTML = ""

    currentCity.innerHTML = city

    const api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKEY}&units=metric&lang=uk`

    const response = await fetch(api)
    const data = await response.json()

    console.log(data)

    if (data.cod != 200) {
        alert("Місто не знайдено")
        return
    }

    mainTemp.innerHTML = `${Math.round(data.main.temp)} °C`

    feelsLike.innerHTML = `Відчувається як ${Math.round(data.main.feels_like)} °C`

    mainHumidity.innerHTML = `${data.main.humidity} %`
    windSpeed.innerHTML = `${data.wind.speed} km/h`
    pressure.innerHTML = `${data.main.pressure} hPa`

    let sunriseTime = new Date(data.sys.sunrise * 1000)
    sunrise.innerHTML = sunriseTime.toLocaleTimeString()

    let sunsetTime = new Date(data.sys.sunset * 1000)
    sunset.innerHTML = sunsetTime.toLocaleTimeString()

    let apiCoord1 = `https://api.openweathermap.org/data/2.5/weather?lat=${data.coord.lat - 0.3}&lon=${data.coord.lon + 0.3}&appid=${APIKEY}&units=metric&lang=uk`

    const responseCoord1 = await fetch(apiCoord1)
    const dataCoord1 = await responseCoord1.json()

    nearbyTemp.innerHTML = `${Math.round(dataCoord1.main.temp)} °C`
    nearbyCity.innerHTML = `${dataCoord1.name}`
    nearbyDescription.innerHTML = `${dataCoord1.weather[0].main}`

    let apiCoord2 = `https://api.openweathermap.org/data/2.5/weather?lat=${data.coord.lat + 0.5}&lon=${data.coord.lon - 0.5}&appid=${APIKEY}&units=metric&lang=uk`

    const responseCoord2 = await fetch(apiCoord2)
    const dataCoord2 = await responseCoord2.json()

    nearbyTemp2.innerHTML = `${Math.round(dataCoord2.main.temp)} °C`
    nearbyCity2.innerHTML = `${dataCoord2.name}`
    nearbyDescription2.innerHTML = `${dataCoord2.weather[0].main}`

    changeBackgroundImage(data.weather[0].main)

    fiveDaysForecast(city)
}

async function fiveDaysForecast(city) {

    fc.innerHTML = ""

    const api = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIKEY}&units=metric&lang=uk`

    const response = await fetch(api)
    const data = await response.json()

    const days = {}

    data.list.forEach(element => {

        const date = element.dt_txt.split(' ')[0]
        const temp = element.main.temp

        if (!days[date]) {

            days[date] = {
                min: temp,
                max: temp
            }

        } else {

            days[date].min = Math.min(days[date].min, temp)
            days[date].max = Math.max(days[date].max, temp)

        }

    })

    for (const key in days) {

        fc.innerHTML += `
        <div class="day active">
            <p>${key}</p>
            <span>${Math.round(days[key].max)}°C</span>
        </div>
        `
    }
}

function changeBackgroundImage(main) {

    if (main == "Clouds") {
        body.style.backgroundImage = `url("clouds.Webp")`
    }
    else if (main == "Rain") {
        body.style.backgroundImage = `url("rain.png")`
    }
    else if (main == "Clear") {
        body.style.backgroundImage = `url("sunny.webp")`
    }
    else if (main == "Snow") {
        body.style.backgroundImage = `url("snow.png")`
    }
    else if (main == "Thunderstorm") {
        body.style.backgroundImage = `url("thunder.png")`
    }
}