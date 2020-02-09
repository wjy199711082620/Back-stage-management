import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'


const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    userId: '',
    userIcon: '',
    roles: [],
    routerList:null
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_ROUTERS:(state,router)=>{
      state.routerList = router;
    },
    SET_USERID: (state, router) => {
      state.userId = router;
    },
    SET_USERICON: (state, router) => {
      state.userIcon = router;
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim();
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(response => {
          console.log(response);
          const data = response.data;
          localStorage.setItem("WMuserInfo",JSON.stringify(data));
          const tokenStr = data.tokenHead + data.token;
          setToken(tokenStr);
          commit('SET_TOKEN', tokenStr);
          commit('SET_NAME', data.adminName);
          commit('SET_ROLES', data.roleId);
          commit('SET_USERICON', data.userIcon);
          commit('SET_USERID', data.adminId);
          //commit('SET_AVATAR', data.icon)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {

        getInfo().then(response => {
          const data = response.data;
          if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', data.roles)
          } else {
            reject('getInfo: roles must be a non-null array !')
          }
          commit('SET_NAME', data.username);
          commit('SET_AVATAR', data.icon);
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    GenerateRoutes({commit,state},data){
      return new Promise((resolve,reject)=>{

          commit("SET_ROUTERS",data);
      })

    },
    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        localStorage.removeItem("WMuserInfo");

        commit('SET_TOKEN', '')
        removeToken()
        resolve()

      })
    }
  }
}

export default user
