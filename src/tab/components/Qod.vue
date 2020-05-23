<template>
  <div class="qod" v-if="qod">
    <div>"{{qod.quote}}"</div>
    <div class="floatright">-{{qod.author}}</div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      qod: null,
    };
  },
  mounted() {
    if (!localStorage.getItem('qod')) {
      axios.get('http://quotes.rest/qod.json').then(response => {
        this.qod = response.data.contents.quotes[0];
        localStorage.setItem('qod', JSON.stringify(this.qod));
      });
    } else {
      this.qod = JSON.parse(localStorage.getItem('qod'));
      let hours_between = (new Date() - Date.parse(this.qod.date)) / 3600000;
      if (hours_between > 12) {
        axios.get('http://quotes.rest/qod.json').then(response => {
          this.qod = response.data.contents.quotes[0];
          localStorage.setItem('qod', JSON.stringify(this.qod));
        });
      }
    }
  },
};
</script>

<style scoped>
.qod {
  padding: 20px;
  font-family: qodFace;
  font-size: 160%;
  display: inline-block;
  width: 100%;
}

.floatright {
  float: right;
}

@font-face {
  font-family: qodFace;
  src: url('../assets/KatahdinRound.otf') format('opentype');
}
</style>