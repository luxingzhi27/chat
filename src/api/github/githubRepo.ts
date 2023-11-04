import axios from "axios"

//分页获取
export const githubSearchRepo = (query:string,lang:string,page:number,perPage:number) => {
  const url = `https://api.github.com/search/repositories?q=`+encodeURIComponent(query)+`+language:`+encodeURIComponent(lang)
  return axios({
    method:'get',
    url:url,
    params:{
      page:`${page}`,
      per_page:`${perPage}`
    }
  }).then((res:any)=>{
    if(res.status===200&&res.data){
      let repos = res.data.items.map((repo:any)=>{
        return {
          full_name:repo.full_name,
          description:repo.description,
          url:repo.html_url,
          updated_at:repo.updated_at,
          stars:repo.stargazers_count
        }
      })
      if(repos.length===0){
        repos = [{
          //搜索结果为空，star为-1
          full_name:'',
          description:'',
          url:'',
          updated_at:'',
          stars:-1
        }]
      }
      return repos
    }else{
      return [{
        //网络错误，star为-2
        full_name:'网络错误',
        description:'请检查网络情况',
        url:'',
        updated_at:'',
        stars:-2
      }]
    }
  })
}

export const githubSearchRepoSize = (query:string,lang:string) => {
  const url = `https://api.github.com/search/repositories?q=`+encodeURIComponent(query)+`+language:`+encodeURIComponent(lang)
  return axios({
    method:'get',
    url:url,
  }).then((res:any)=>{
    if(res.status===200&&res.data){
      return res.data.total_count
    }else{
      return -1
    }
  })
}