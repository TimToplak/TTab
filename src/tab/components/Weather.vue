<template>
  <div class="weather">
    <div v-if="currentWeatherData" class="row">
      <div class="col-6">
        <div class="locationName">{{currentWeatherData.name}}</div>
        <div>{{toReadebleTime(currentWeatherData.dt )}}</div>
        <div>{{capatalize(currentWeatherData.weather[0].description) }}</div>
        <div>
          <img
            :src="'http://openweathermap.org/img/wn/' + currentWeatherData.weather[0].icon + '@2x.png'"
            v-bind:alt="currentWeatherData.weather[0].icon"
          />

          <span class="currentTemp">{{toCelcius(currentWeatherData.main.temp).toFixed(1)}}</span>°C
        </div>
      </div>
      <div class="col-6">
        <div>Sunrise: {{toReadebleTime(currentWeatherData.sys.sunrise)}}</div>
        <div>Sunset: {{toReadebleTime(currentWeatherData.sys.sunset)}}</div>
        <br />
        <div>Pressure: {{currentWeatherData.main.pressure}} hPa</div>
        <div>Humidity: {{currentWeatherData.main.humidity}} %</div>
        <div>Real feel: {{toCelcius(currentWeatherData.main.feels_like).toFixed(1)}}°C</div>
        <div class="chartTypeButtons">
          <div class="chartTypeButton">Temperature</div>
          <div class="chartTypeButton">Rain</div>
          <div class="chartTypeButton">Wind</div>
        </div>
      </div>
    </div>

    <div v-if="forecastWeatherData">
      <div class="row">
        <div class="col" v-on:click="chartClick($event)">
          <chart :width="null" :height="50" :chartData="chartData" :options="chartOptions"></chart>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="days">
            <div
              v-for="day in forecastWeatherData.days"
              :key="day.day"
              class="day"
              v-on:click="fillDataToChart(day)"
            >
              <div>
                <img :src="'http://openweathermap.org/img/wn/' + getMostProperIcon(day)+ '.png'" />
              </div>
              <div>{{weekday[day.day]}}</div>
              <div>{{Math.round(getHighestTemperatureOfTheDay(day))}}° {{Math.round(getLowestTemperatureOfTheDay(day))}}°</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Chart from '../plugins/LineChart';
import ChartJsPluginDataLabels from 'chartjs-plugin-datalabels';
import config from '../config.json';

export default {
  components: { Chart, ChartJsPluginDataLabels },
  data() {
    return {
      weekday: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      forecastWeatherData: null,
      currentWeatherData: null,
      chartData: { datasets: [], labels: [] },
      chartOptions: {
        plugins: {
          // Change options for ALL labels of THIS CHART
          datalabels: {
            color: '#FFFFFF',
            align: 'top',
          },
        },
        layout: {
          padding: {
            left: 0,
            right: 0,
            top: 25,
            bottom: 0,
          },
        },
        elements: {
          point: {
            radius: 0,
          },
        }, //Chart.js options
        scales: {
          yAxes: [
            {
              display: false,
              ticks: {
                beginAtZero: false,
              },
              gridLines: {
                drawBorder: false,
                display: false,
                color: '#494949',
              },
            },
          ],
          xAxes: [
            {
              gridLines: {
                display: false,
              },
              ticks: {
                autoSkip: true,
                maxRotation: 0,
                minRotation: 0,
              },
            },
          ],
        },
        legend: {
          display: false,
        },
        responsive: true,
      },
    };
  },

  methods: {
    getForecastDateFromApi(apiKey, city, forecastWeatherLocalStorageName) {
      let url = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=' + apiKey;
      axios.get(url).then(response => {
        this.forecastWeatherData = this.groupByDay(response.data.list);
        console.log(this.forecastWeatherData);
        localStorage.setItem(forecastWeatherLocalStorageName, JSON.stringify(this.forecastWeatherData));
      });
    },
    getCurrentDataFromApi(apiKey, city, currentWeatherLocalStorageName) {
      let url = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + apiKey;
      axios.get(url).then(response => {
        this.currentWeatherData = response.data;
        localStorage.setItem(currentWeatherLocalStorageName, JSON.stringify(this.currentWeatherData));
      });
    },
    toReadebleTime(date) {
      let dateObj = new Date(date * 1000);
      var hours = dateObj.getHours();
      var minutes = '0' + dateObj.getMinutes();
      return hours + ':' + minutes.substr(-2);
    },
    capatalize(value) {
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
    toCelcius(temperature) {
      return temperature - 273.15;
    },
    getLowestTemperatureOfTheDay(day) {
      let lowestTemperature = day.weather[0].main.temp;
      for (let weather of day.weather) {
        if (lowestTemperature > weather.main.temp) {
          lowestTemperature = weather.main.temp;
        }
      }
      return this.toCelcius(lowestTemperature);
    },
    getHighestTemperatureOfTheDay(day) {
      let highestTemperature = day.weather[0].main.temp;
      for (let weather of day.weather) {
        if (highestTemperature < weather.main.temp) {
          highestTemperature = weather.main.temp;
        }
      }
      return this.toCelcius(highestTemperature);
    },
    getMostProperIcon(day) {
      //lower the weather ID, worst the weather
      let lowestID = day.weather[0].weather[0].id;
      let lowestIndex = 0;
      for (let i = 0; i < day.weather.length; i++) {
        if (lowestID > day.weather[i].weather[0].id) {
          lowestID = day.weather[i].weather[0].id;
          lowestIndex = i;
        }
      }

      return day.weather[lowestIndex].weather[0].icon;
    },
    groupByDay(collection) {
      var result = [];
      var raw_time;
      var day;

      collection.forEach(elm => {
        raw_time = elm.dt;
        day = new Date(raw_time * 1000).getDay();

        var contain = result.find(obj => {
          return obj.day === day;
        });

        if (contain) {
          contain.weather.push(elm);
        } else {
          var temp = {};
          temp['day'] = day;
          temp['weather'] = [];
          temp['weather'].push(elm);
          result.push(temp);
        }
      });

      return { days: result, dt: new Date() };
    },

    fillDataToChart(day) {
      console.log('filling data');

      var weatherData = [];
      //first day could have less than 8 weathers, so join some weather info from day 2
      if (this.forecastWeatherData.days.indexOf(day) == 0 && day.weather.length < 8) {
        console.log('not enough data');
        console.log(day.weather);
        console.log(this.forecastWeatherData.days[1].weather);
        weatherData = day.weather.concat(this.forecastWeatherData.days[1].weather);
      } else {
        weatherData = day.weather;
      }

      this.chartData = {
        labels: weatherData.map(x => this.toReadebleTime(x.dt)).slice(0, 8),
        datasets: [
          {
            fill: true,
            borderColor: '#e3d430',
            data: weatherData.map(x => Math.round(this.toCelcius(x.main.temp))).slice(0, 8),
            fillColor: '#ffff00',
          },
        ],
      };
    },
    chartClick(e) {
      console.log(e.offsetX / (e.target.offsetWidth / 6));
    },
  },
  mounted() {
    let apiKey = config.openweathermapAPIKey;
    let city = config.weatherCityName;

    let currentWeatherLocalStorageName = 'currentWeather';
    let forecastWeatherLocalStorageName = 'forecastWeather';

    if (!localStorage.getItem(forecastWeatherLocalStorageName)) {
      this.getForecastDateFromApi(apiKey, city, forecastWeatherLocalStorageName);
    } else {
      this.forecastWeatherData = JSON.parse(localStorage.getItem(forecastWeatherLocalStorageName));
      let hours_between = (new Date() - Date.parse(this.forecastWeatherData.dt)) / 3600000;
      if (hours_between > 3) {
        this.getForecastDateFromApi(apiKey, city, forecastWeatherLocalStorageName);
      }
    }

    if (!localStorage.getItem(currentWeatherLocalStorageName)) {
      this.getCurrentDataFromApi(apiKey, city, currentWeatherLocalStorageName);
    } else {
      this.currentWeatherData = JSON.parse(localStorage.getItem(currentWeatherLocalStorageName));
      console.log(this.currentWeatherData.dt);
      let hours_between = (new Date() - new Date(this.currentWeatherData.dt)) / 3600000;
      if (hours_between > 3) {
        this.getCurrentDataFromApi(apiKey, city, currentWeatherLocalStorageName);
      }
    }
    console.log(this.forecastWeatherData);
    this.fillDataToChart(this.forecastWeatherData.days[0]);
  },
};
</script>

<style scoped>
.weather {
  padding: 10px;
}

.days {
  display: flex;
}

.day {
  flex-basis: 100%;
  text-align: center;
  border: 1px solid black;
  margin: 3px;
  cursor: pointer;
  background-color: rgb(27, 28, 29);
}
.day:hover {
  background-color: rgb(42, 44, 46);
}

.locationName {
  font-size: 130%;
}
.currentTemp {
  font-size: 190%;
}
.chartTypeButtons {
  display: flex;
}

.chartTypeButton {
  flex: 1;
}
</style>