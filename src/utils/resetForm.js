export default function resetForm(fromName, obj) {
    //清空表单 
    if (this.$refs[fromName]) {
        this.$refs[fromName].resetFields();
    }
    //清空数据域 
    Object.keys(obj).forEach(key => {
        obj[key] = '';
    })
}