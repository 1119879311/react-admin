import { action, observable } from "mobx"


function initUser(){
    let result = {
        username:"",
        userId:-100,
        userType:-100,

    }
    return result
}

type IuserInfo = Partial< ReturnType<typeof initUser>&Record<string,any>>

export class UserStore{

   @observable token:string = ''

   @observable userinfo:IuserInfo = initUser()

   @action setToken(token?:string){
       this.token = token ||''
   }

   @action setUserinfo(data?:IuserInfo){
       if(data){
            data.username&&(this.userinfo.username = data.username)
            data.userType&&(this.userinfo.userType = data.userType)
            data.userId&&(this.userinfo.userId = data.userId)
       }else{
           this.userinfo = initUser()
       }
      
   }

}
export default new UserStore()