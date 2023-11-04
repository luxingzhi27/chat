<script setup lang="ts">
import { ref, watch ,reactive, onMounted,Ref,onBeforeMount, nextTick, onUpdated} from 'vue'
import { useGpt } from '../api/gpt/GptStreamVue'
import { ElScrollbar } from 'element-plus'
import { ipcRenderer } from 'electron'
import { ElMessage } from 'element-plus'
import ChatContainer from './ChatContainer.vue'

const gptApiKey:Ref<string>=ref(ipcRenderer.sendSync('electron-store-get','gpt-api-key'))
const isGptApiFilled:Ref<boolean>=ref(ipcRenderer.sendSync('electron-store-get','gpt-api-key-filled'))
const aiModel=ref('gpt-4')
const question = ref('')

let {streamingText,streaming,msgList,stream}  = useGpt(gptApiKey.value,true)
const value = ref(0)
const lastValue = ref(0)
const innerRef = ref<HTMLDivElement>()
const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>()



watch(streamingText, (val) => {
    if (val) {
        nextTick(() => {
            if(value.value-lastValue.value<0){
                return
            }
            scrollbarRef.value?.setScrollTop(innerRef.value!.clientHeight)
        })
    }
})


const scroll = ({ scrollTop }:any) => {
    lastValue.value = value.value
    value.value = scrollTop
}

onUpdated(()=>{
    if(value.value-lastValue.value<0){
        return
    }
    scrollbarRef.value?.setScrollTop(innerRef.value!.clientHeight)
})

const handleQuestionSearch = async () => {
    if(!streaming.value){
        let content=`${question.value}`
        stream(content,aiModel.value)
        question.value = ''
    }
}

const clear=()=>{
    msgList.value=[]
}

const submitGptApiKey=()=>{
    if(gptApiKey.value.length===0){
        ElMessage({
            message: 'key不能为空',
            type: 'warning'
        })
        return
    }
    ipcRenderer.send('electron-store-set','gpt-api-key',gptApiKey.value)
    ipcRenderer.send('electron-store-set','gpt-api-key-filled',true)
    setTimeout(() => {
        isGptApiFilled.value=ipcRenderer.sendSync('electron-store-get','gpt-api-key-filled')
        gptApiKey.value=ipcRenderer.sendSync('electron-store-get','gpt-api-key')
    }, 100);
}
</script>


<template>
    <div class="flex w-full h-full">
        <div class="flex w-full h-full justify-center items-center flex-col" v-if="!isGptApiFilled">
            <h1 class="my-5">还没有填写gpt的api key喔~</h1>
            <p class="my-5">请前往http://gpt.zhizengzeng.com/ 购买gpt api key</p>
            <div class="flex justify-center items-center w-2/3">
                <label for="gpt-api-key-input">gpt</label>
                <el-input id="gpt-api-key-input" v-model="gptApiKey" @keyup.enter.native="submitGptApiKey" class="my-2 ml-2 mr-1" placeholder="enter your gpt api key"></el-input>
                <button class="my-2 ml-1 mr-2" @click="submitGptApiKey">OK</button>
            </div>
        </div>
        <div class="w-full h-full" v-if="isGptApiFilled">
            <div class="chat">
                <div class="chat-list">
                    <el-scrollbar ref="scrollbarRef" class="p-8" @scroll="scroll">
                        <div ref="innerRef">
                            <div class="header">
                                <el-radio-group v-model="aiModel">
                                    <el-radio-button :disabled="streaming" label="gpt-3.5-turbo" />
                                    <el-radio-button :disabled="streaming" label="gpt-4" />
                                </el-radio-group>
                                <el-dropdown size="small">
                                    <div class="api-key">
                                        <el-text>Api Key</el-text>
                                        <el-icon class="ml-2"><ArrowDown /></el-icon>
                                    </div>
                                    <template #dropdown>
                                        <div class="flex flex-col justify-center items-start p-4">
                                            <div class="flex justify-around items-center">
                                                <span>gpt</span>
                                                <el-input v-model="gptApiKey" @keyup.enter="submitGptApiKey" class="my-2 ml-2 mr-1" placeholder="enter your gpt api key"></el-input>
                                                <button class="my-2 ml-1 mr-2" @click="submitGptApiKey">OK</button>
                                            </div>
                                        </div>
                                    </template>
                                </el-dropdown>
                                <button @click="clear">clear</button>
                            </div>
                            <ChatContainer :messages="msgList" :streaming="streaming" :streamingText="streamingText"></ChatContainer>
                        </div>
                    </el-scrollbar>
                </div>
            </div>
            <div class="input-container">
                <div class="input">
                    <div class="w-full">
                        <el-input
                            placeholder="请输入您的问题"
                            v-model="question"
                            clearable
                            @keyup.enter.native="handleQuestionSearch"
                            :disabled="streaming"
                        >
                            <template #prefix><el-icon><Search/></el-icon></template>
                        </el-input>
                    </div>
                    <button class="mx-2.5" @click="handleQuestionSearch">Go!</button>
                </div>
            </div>
                
        </div>
    </div>
</template>



<style scoped>

.chat{
    width: 100%;
    min-height: 90vh;
    height: fit-content;
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
}

.chat-list{
    width: 100%;
    height: 90vh;
}

.input-container{
    width: 100%;
    display: flex;
    justify-content: center;
}

.input{
    bottom: 20px;
    width: 90%;
    display: flex;
    justify-content: start;
    align-items: center;
}

.button {
  animation: pulse 0.5s;
}

.el-input {
  animation: fadeIn 0.5s;
}
.api-key:hover{
    cursor: pointer;
    background-color: rgba(255,255,255,0.1);
    border-radius: 8px;
}

.api-key{
    width: fit-content;
    height: 35px;
    border-radius: 8px;
    padding-left: 4px;
    padding-right: 4px;
    padding-top: 4px;
    padding-bottom: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.header{
    width: 75%;
    height: fit-content;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 20px;
    flex-wrap: wrap;
}

.bing-suggestion{
    width: 100%;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: start;
    padding-top: 5px;
    padding-bottom: 5px;
    padding-left: 10px;
    padding-right: 10px;
    color: #fff;
    font-size: 14px;
    font-weight: 500;
}

.bing-suggestion:hover{
    cursor: pointer;
    background-color: rgba(255,255,255,0.1);
    border-radius: 8px;
}

.key-words-header{
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
    margin-top: 10px;
}

.search-key-words{
    transition: transform 0.1s ease-in-out; 
}

.search-key-words:hover{
    cursor: pointer;
    transform: scale(1.05);
    color: #646cff;
    text-decoration: underline;
}

.github-loading-skeleton{
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: center;
    width: 100%;
    margin-top: 4px;
    margin-bottom: 10px;
}

.github-loading-skeleton-single{
    background-color: #1a1a1a;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: start;
    padding-top: 8px;
    padding-bottom: 12px;
    padding-left: 5px;
    padding-right: 5px;
    margin-top: 5px;
    margin-bottom: 5px;
    width: 100%;
}

</style>