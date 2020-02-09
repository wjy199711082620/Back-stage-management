import user from "./modules/user";

const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  userId: state => state.user.userId,
  userIcon: state => state.user.userIcon,
  routerList:state=>state.user.routerList
}
console.log(user);
export default getters
