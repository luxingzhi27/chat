<script setup lang="ts">
import { reactive, onMounted,watch } from 'vue';
import MarkdownIt from 'markdown-it'
import mdKatex from '@traptitech/markdown-it-katex'
import hljs from 'highlight.js';

const props=defineProps({
    text: {
        type: String,
        default: ''
    }
})
 
const mdi = new MarkdownIt({
  linkify: true,
  highlight(code, language) {
    const validLang = !!(language && hljs.getLanguage(language))
    if (validLang) {
      const lang = language ?? ''
      return highlightBlock(hljs.highlight(lang, code, true).value, lang)
    }
    return highlightBlock(hljs.highlightAuto(code).value, '')
  }
})


mdi.use(mdKatex, { blockClass: 'katexmath-block rounded-md p-[10px]', errorColor: ' #cc0000' })
 
function highlightBlock(str:any, lang:any) {
    return `<pre style="background:#1a1a1a;border-radius:7px;overflow:auto" class="my-4 p-3"><code>${str}</code></pre>`
}
 
const getMdiText = (value:any) => {
    return mdi.render(value)
}
 
const state = reactive({
    htmlStr: '' 
})
 
onMounted(() => {
    state.htmlStr = getMdiText(String(props.text)) //htmlStr就是已经包含html样式的文本
});

watch(()=>props.text,(newVal)=>{
    state.htmlStr = getMdiText(String(newVal))
})
 
 
</script>
<template>
    <div v-html="state.htmlStr"></div>
</template>

<style scoped>
</style>