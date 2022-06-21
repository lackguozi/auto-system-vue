import {  constantRoutes } from '@/router'
import Layout from '@/layout'
import{getMenuList}from '@/api/user';
/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(menus) {
  // const res = []

  // routes.forEach(route => {
  //   const tmp = { ...route }
  //   if (hasPermission(roles, tmp)) {
  //     if (tmp.children) {
  //       tmp.children = filterAsyncRoutes(tmp.children, roles)
  //     }
  //     res.push(tmp)
  //   }
  // })
  let routes = menus.map(menu=>{
    if(menu.component){
      let name = menu.component;
      if(name ==='layout'){
        menu.component = Layout
      }else{
        menu.component = (resolve) => require([`@/${name}`],resolve);
      }
     
    }
    if(menu.children && menu.children.length){
      menu.children = filterAsyncRoutes(menu.children);
    }
    return menu;
  })
  return routes;
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise((resolve ,reject)=> {
      getMenuList().then(res=>{
        let accessedRoutes =res;
        // if (roles.includes('admin')) {
        //   accessedRoutes = asyncRoutes || []
        // } else {
        //   accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
        // }
        let remoteroutes = filterAsyncRoutes(accessedRoutes);
        commit('SET_ROUTES', remoteroutes)
        resolve(remoteroutes)
      }).catch(error=>{
        reject(error);
      })
      
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
