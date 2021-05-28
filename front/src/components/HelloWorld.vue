<template>
  <div class="hello">
    <input v-model="name" type="text">
    <button @click="previewTemplate">预览</button>
    <button @click="setTemplateClick">生成</button>
    <div id="html"></div>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { setTemplate, previewTemplate } from '@/api/template'
import { getUsers } from '@/api/user'
import marked from "marked"
import hljs from "highlight.js";
import 'highlight.js/styles/atelier-plateau-light.css';
export default {
  name: 'HelloWorld',
  data() {
    return {
      name: ''
    }
  },
  mounted() {
    console.log(useStore().state.user)
    getUsers().then(res => {
      console.log(res)
    })
  },
  methods: {
    previewTemplate() {
      previewTemplate({ name: this.name }).then(res => {
        console.log(res)
        res.data = '```\n' + res.data + '\n```'
        this.renderHtml(res.data)
      })
    },
    setTemplateClick() {
      setTemplate({ name: this.name }).then(res => {
        console.log(res)
      })
    },
    renderHtml(data) {
      marked.setOptions({
        renderer: new marked.Renderer(),
        highlight: function(code) {
          return hljs.highlightAuto(code).value;
        },
        pedantic: false,
        gfm: true,
        tables: true,
        breaks: false,
        sanitize: false,
        smartLists: true,
        smartypants: false,
        xhtml: false
      })
      document.getElementById('html').innerHTML = marked(data)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
