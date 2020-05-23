<template>
  <div class="grid-container">
    <Stock
      v-for="stock in stockSymbols"
      :key="stock"
      :stockSymbol="stock"
      :apiKey="apiKey"
      class="grid-item"
    />
  </div>
</template>

<script>
import Stock from './Stock';
import config from '../config.json';

export default {
  name: 'StockWrapper',
  data() {
    return {
      message: 'My new tab pagee',
      stockSymbols: config.stockSymbols,
      db: null,
      apiKey: config.alphavantageAPIKey,
    };
  },
  components: { Stock },
  mounted() {},
};
</script>

<style scoped>
.stock-wrapper {
  padding: 4px;
}
</style>