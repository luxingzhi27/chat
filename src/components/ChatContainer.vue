<script setup lang="ts">
import chatContent from './ChatContent.vue';
interface Message{
    role:string,
    content:string
}

const props=defineProps({
    messages:{
        type:Array<Message>,
        default:()=>[],
        required:true
    },
    streamingText:{
        type:String,
        default:'',
        required:true
    },
    streaming:{
        type:Boolean,
        default:false,
        required:true
    }
})
</script>

<template>
    <div class="chat-container">
        <chatContent v-for="message in messages" :role="message.role" :content="message.content" :key="message.content"></chatContent>
        <chatContent role="assistant" :content="streamingText"  v-if="streaming"></chatContent>
    </div>
</template>

<style scoped>
.chat-container{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
}
</style>