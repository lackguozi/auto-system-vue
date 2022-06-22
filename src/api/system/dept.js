import http from '@/utils/request'
export async function list(){
   return await http.get("api/dept/list");
}
export async function del(data){
    return await http.post("api/dept/delDept",data);
}
export async function save(data) {
    return await http.post("api/dept/save", data);
}