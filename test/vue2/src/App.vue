<template>
  <div id="app">
    <h1>{{ $kkbrouter }}</h1>
    <router-link to="/">home</router-link>
    <router-link to="/test">test</router-link>
    <button @click="about">aaa</button>
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {},
  methods: {
    about() {
      this.$yrouter.push('/test')
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
