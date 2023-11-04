import axios from "axios"
export const bingWebSearch=(query:any,page:number,pagesize:number,SUBSCRIPTION_KEY:string)=>{
  return axios({
    method:'get',
    url:'https://api.bing.microsoft.com/v7.0/search?q='+encodeURIComponent(query)+`&page=${page}&pagesize=${pagesize}`,
    headers:{
      'Ocp-Apim-Subscription-Key':SUBSCRIPTION_KEY
    }
  }).then(res=>{
    if(res.status===200&&res.data){
      let pages = res.data.webPages.value.map((page:any)=>{
        return {
          url:page.url,
          snippet:page.snippet,
          name:page.name
        }
      })
      return pages
    }else if(res.status===403){
      return []
    }else{
      return []
    }
  })
}

export const bingWebSearchSize=(query:any,SUBSCRIPTION_KEY:string)=>{
  return axios({
    method:'get',
    url:'https://api.bing.microsoft.com/v7.0/search?q='+encodeURIComponent(query),
    headers:{
      'Ocp-Apim-Subscription-Key':SUBSCRIPTION_KEY
    }
  }).then(res=>{
    if(res.status===200&&res.data){
      return res.data.webPages.totalEstimatedMatches
    }else{
      return -1
    }
  })
}