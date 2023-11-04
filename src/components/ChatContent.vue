<script setup lang="ts">
import GptResView from './GptResView.vue';
const props=defineProps({
    role:{
        type:String,
        default:'user',
        required:true
    },
    content:{
        type:String,
        default:'',
        required:true
    },
})
</script>

<template>
    <div class="bubble" :class="role" v-if="role==='user'">{{ content }}</div>
    <div class="bubble" :class="role" v-if="role==='assistant'">
        <GptResView :text="content" v-if="content.length>0"></GptResView>
        <div class="loading" v-else></div>
    </div>
</template>

<style scoped>
@keyframes ellipsis {
    0% { content: ""; }
    17% { content: "."; }
    34% { content: ".."; }
    50% { content: "..."; }
    57% { content: "...."; }
    74% { content: "....."; }
    91% { content: "......"; }
}

.loading::after {
    content: "";
    animation: ellipsis 1s steps(5, end) infinite;
}
.bubble {
    padding: 10px;
    border-radius: 8px;
    margin: 10px 0;
    position: relative;
    max-width: 60%;
}

.bubble.user {
    background-color: #646cff;
    color: white;
    align-self: flex-end;
}

.bubble.assistant {
    background-color: #3b3b3b;
    color: white;
    align-self: flex-start;
}
</style>