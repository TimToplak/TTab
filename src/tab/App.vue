<template>
  <div>
    <div class="container-fluid">
      <div class="row">
        <div class="col-1"></div>
        <div class="col-10">
          <div class="board">
            <Qod />
          </div>
        </div>
        <div class="col-1"></div>
      </div>
      <div class="row">
        <div class="col-1"></div>
        <div class="col-5">
          <div class="board">
            <StockWrapper />
          </div>
        </div>
        <div class="col-5">
          <div class="board">
            <Weather />
          </div>
          <div class="board">
            <Wikipedia />
          </div>
          <div class="board"></div>
        </div>
        <div class="col-1"></div>
      </div>
    </div>

    <img
      src="https://images.unsplash.com/photo-1546083381-2bed38b42cac?ixlib=rb-1.2.1&auto=format"
      style="position:fixed;top:0px;left:0px;width:100%;height:100%;z-index:-1;"
    />
  </div>
</template>

<script>
import Qod from './components/Qod';
import Weather from './components/Weather';
import StockWrapper from './components/StockWrapper';
import Wikipedia from './components/Wikipedia';
import Dexie from 'dexie';

export default {
  data() {
    return {};
  },
  components: {
    Qod,
    StockWrapper,
    Weather,
    Wikipedia,
  },
  mounted() {},
};
</script>

<style scoped>
p {
  font-size: 20px;
}

.board {
  margin-top: 14px;
  background-color: rgb(14, 16, 18);
  color: rgb(185, 183, 183);
  -webkit-box-shadow: 7px 7px 15px -1px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 7px 7px 15px -1px rgba(0, 0, 0, 0.75);
  box-shadow: 7px 7px 15px -1px rgba(0, 0, 0, 0.75);
}
</style>