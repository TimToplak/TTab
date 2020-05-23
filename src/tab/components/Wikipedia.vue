<template>
  <div class="article" v-if="wikiArticle">
    <img v-on:click="getRandomWikiArticle()" src="assets/icons8-refresh.svg" class="refreshButton" />
    <!--<div>{{wikiArticle.title}}</div>-->
    <div>
      <img class="thumbnailimg" :src="wikiArticle.thumbnail.source" />
      <i>"{{shorten(wikiArticle.extract, 350)}}</i>
      <span v-if="!showMore">..."</span>
      <span v-if="showMore">
        <i>{{rest(wikiArticle.extract, 350)}}"</i>
      </span>
      <span v-on:click="showMore = true" v-if="!showMore">Read more</span>
      <span v-on:click="showMore = false" v-if="showMore">Read less</span>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      wikiArticle: null,
      showMore: false,
      localStorageKeyName: 'wikiArticle',
      url: 'https://en.wikipedia.org/api/rest_v1/page/random/summary',
    };
  },
  mounted() {
    if (!localStorage.getItem(this.localStorageKeyName)) {
      this.getRandomWikiArticle();
    } else {
      this.wikiArticle = JSON.parse(localStorage.getItem(this.localStorageKeyName));
      let hours_between = (new Date() - Date.parse(this.wikiArticle.date)) / 3600000;
      if (hours_between > 2) {
        this.getRandomWikiArticle();
      }
    }
  },
  methods: {
    getRandomWikiArticle() {
      axios.get(this.url).then(response => {
        this.wikiArticle = response.data;
        this.wikiArticle.date = new Date();
        localStorage.setItem(this.localStorageKeyName, JSON.stringify(this.wikiArticle));
      });
    },
    shorten(str, maxLen, separator = ' ') {
      if (str.length <= maxLen) return str;
      return str.substr(0, str.lastIndexOf(separator, maxLen));
    },
    rest(str, maxLen, separator = ' ') {
      if (str.length <= maxLen) return '';
      return str.substr(str.lastIndexOf(separator, maxLen), str.length);
    },
  },
};
</script>

<style scoped>
.thumbnailimg {
  float: left;
  margin-right: 10px;
}

.article {
  overflow: auto;
  padding: 10px;
}

.title {
  display: inline;
}
.refreshButton {
  display: block;
  float: right;
  cursor: pointer;
}
</style> 