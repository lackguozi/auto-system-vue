import http from '@/utils/request'

export async function login(data) {
  return await http.login("/api/User/Login", data);
}

export async function getInfo() {
  
  return await http.get("/api/User/getCurrentUserInfo");
}
export async function getMenuList(){
  return await http.get("api/User/GetMenuList");
}
export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}
