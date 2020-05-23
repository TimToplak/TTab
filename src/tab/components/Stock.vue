<template>
  <div class="stock">
    <div class="row">
      <div class="col-2">
        <div>{{stockSymbol}}</div>
        <div v-if="stocksData">
          <div>
            {{toReadableDate(stocksData[0].date)}}
            <br />
          </div>

          <div>
            <span class="label">Open:</span>
            <br />
            <span class="info">{{stocksData[0].open}}</span>
          </div>

          <div>
            <span class="label">High:</span>
            <br />
            <span class="info">{{stocksData[0].high}}</span>
          </div>
          <div>
            <span class="label">Low:</span>
            <br />
            <span class="info">{{stocksData[0].low}}</span>
          </div>

          <div>
            <span class="label">Close:</span>
            <br />
            <span class="info">{{stocksData[0].close}}</span>
          </div>
          <div>
            <span class="label">Volume:</span>
            <br />
            <span class="info">{{stocksData[0].volume}}</span>
          </div>
        </div>
      </div>
      <div class="col-10">
        <chart :width="null" :height="null" :chartData="datacollection" :options="chartOptions"></chart>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from '../plugins/LineChart';
import axios from 'axios';
import Dexie from 'dexie';

export default {
  name: 'Stock',
  props: ['stockSymbol', 'apiKey'],
  components: {
    Chart,
  },
  data() {
    return {
      message: 'My new tab pagee',
      stocksData: null,
      datacollection: { datasets: [], labels: [] },
      chartOptions: {
        plugins: {
          datalabels: {
            display: false,
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
              ticks: {
                beginAtZero: false,
              },
              gridLines: {
                drawBorder: false,
                display: true,
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
                maxTicksLimit: 5,
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
        maintainAspectRatio: true,
      },
    };
  },
  methods: {
    async getStocksFromApi(db) {
      let apiKeys = 'KN29P37VYQTFFMXN';
      let url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=' + this.stockSymbol + '&apikey=' + this.apiKey;
      await axios.get(url).then(response => {
        let allDaily = response.data['Time Series (Daily)'];
        let array = Object.entries(allDaily);

        if (this.stocksData == null) {
          for (let day of array) {
            db.stocks
              .add({
                stockSymbol: this.stockSymbol,
                date: day[0],
                open: day[1]['1. open'],
                high: day[1]['2. high'],
                low: day[1]['3. low'],
                close: day[1]['4. close'],
                volume: day[1]['5. volume'],
              })
              .catch(function(e) {
                console.log('Error: ' + (e.stack || e));
              });
          }
        } else {
          let lastDate = new Date(this.stocksData[0].date);
          for (let day of array) {
            if (lastDate < new Date(day[0])) {
              db.stocks
                .add({
                  stockSymbol: this.stockSymbol,
                  date: day[0],
                  open: day[1]['1. open'],
                  high: day[1]['2. high'],
                  low: day[1]['3. low'],
                  close: day[1]['4. close'],
                  volume: day[1]['5. volume'],
                })
                .catch(function(e) {
                  console.log('Error: ' + (e.stack || e));
                });
            }
          }
        }
      });
    },
    async getStocksFromDB(db) {
      this.stocksData = await db.stocks.where({ stockSymbol: this.stockSymbol }).toArray();
      if (this.stocksData.length == 0) {
        this.stocksData = null;
      } else {
        this.stocksData.sort(function(a, b) {
          return new Date(b.date) - new Date(a.date);
        });
      }
    },
    fillData() {
      let lineColor = parseFloat(this.stocksData[0].open) - parseFloat(this.stocksData[1].open) > 0 ? '#A5CC82' : '#a80f28';

      this.datacollection = {
        labels: this.stocksData
          .slice() //TODO: not so preatty solution
          .reverse()
          .map(a => this.toReadableDate(a.date)),
        datasets: [
          {
            borderColor: lineColor,
            fill: false,
            data: this.stocksData
              .slice() //TODO: not so preatty solution
              .reverse()
              .map(a => parseFloat(a.open)),
          },
        ],
      };
    },
    toReadableDate(date) {
      let dateObj = new Date(date);
      return dateObj.getDate() + '. ' + (dateObj.getMonth() + 1) + '. ' + dateObj.getFullYear();
    },
  },
  async mounted() {
    var db = new Dexie('StockDatabase');
    db.version(1).stores({
      stocks: '++id,stockSymbol,date,open,high,low,close,volume',
    });

    await this.getStocksFromDB(db);
    if (this.stocksData == null) {
      await this.getStocksFromApi(db);
      await this.getStocksFromDB(db);
    } else {
      let todayDate = new Date();
      let lastDate = new Date(this.stocksData[0].date);
      if (todayDate > lastDate) {
        await this.getStocksFromApi(db);
      }
    }
    this.fillData();

    // db.stocks.where({ stockSymbol: this.stockSymbol }).first(data => {
    //   console.log(data);
    // });
  },
};
</script>

<style scoped>
.stock {
  padding-left: 15px;
  padding-top: 10px;
}

.label {
  color: #5e5c5c;
}

.info {
  padding-left: 5px;
}

.stockinfo {
  background-color: rgb(27, 28, 29);
}
</style>