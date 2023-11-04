import axios from 'axios'


export const getGptResponse = (params:any,key:string) => {
    return axios({
        method:'post',
        url:'http://flag.smarttrot.com/index.php/api/v1/chat/completions',
        data:params,
        headers:{
            'Content-Type':'application/json',
            'Authorization':'Bearer '+key
        }
    }).then(res=>{
        if(res.status===200&&res.data){
            if(res.data.msg==='ok'){
                if(res.data.choices[0].finish_reason==='stop'&&res.data.choices[0].message){
                    return res.data.choices[0].message.content
                }
            }else{
                return 'api error '+res.data.msg
            }
        }else{
            return 'network error'
        }
      }
    )
}