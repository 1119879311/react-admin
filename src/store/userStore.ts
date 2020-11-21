import { observable, action, computed } from 'mobx';
const InitUser = {
    user_name:'',
    user_id:0,
    user_type:0,
    token:'',
    menus:[],
    auths:[],
    roles:{},
}
export type IUserStore = Partial<typeof InitUser>
export class UserStoreClass {

    @observable userData:IUserStore = InitUser

    constructor(){
        let res = sessionStorage.getItem("USER_INFO")
        if(res){
            this.userData = JSON.parse(res);
        }
        
    }

    @action setData(data:IUserStore){
        this.userData = {...this.userData,...data}
        sessionStorage.setItem("USER_INFO",JSON.stringify(this.userData) )
        sessionStorage.setItem("APP_TOKEN",this.userData.token as string)
    }
    @action delData(){
        this.userData = {};
        sessionStorage.removeItem("USER_INFO")
        sessionStorage.removeItem('APP_TOKEN')
    }

    @computed get isSystem(){
        return this.userData.user_type===1||this.userData.user_type===2
    }
}

export default new UserStoreClass();