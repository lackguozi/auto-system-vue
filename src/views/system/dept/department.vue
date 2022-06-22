<template>
  <el-main>
    <el-form :model="searchModel" ref="searchForm" label-width="80px" :inline="true" size="small">
      <el-form-item>
        <el-input placeholder="请输入部门名称" v-model="searchModel.departmentName"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search">查询</el-button>
        <el-button icon="el-icon-refresh-right">重置</el-button>
        <el-button type="success" icon="el-icon-plus">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      border
      stripe
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      default-expand-all
      :tree-props="{ children: 'children' }"
    >
      <el-table-column prop="simpleName" label="简称"></el-table-column>
      <el-table-column prop="fullName" label="部门全称"></el-table-column>
      <el-table-column prop="num" label="顺序"></el-table-column>
     
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button
            icon="el-icon-edit-outline"
            type="primary"
            size="small"
            @click="handleEdit(scope.row)"
          >编辑</el-button>
          <el-button
            icon="el-icon-close"
            type="danger"
            size="small"
            @click="handleDelete(scope.row.id)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-main>
</template> </el-table-column> </el-table>
  </el-main>
</template>

<script>
import { list, save, del } from "@/api/system/dept";
export default {
  name: "department",
  data() {
    return {
      searchModel: {
        departmentName: ""
      },
      tableData: []
    };
  },
  created() {
    this.search();
  },
  methods: {
    async search() {
      let res = await list();
      console.log(res);
      this.tableData = res;
    },
    resetValue() {
      this.searchModel = {}; //清空数据 this.search();//重新调用方法
      this.search();
    },
    handleEdit(row) {
      console.log(row);
    },
    handleDelete(row) {
      console.log(row);
    },
  },
  mounted() {},
  computed: {
    
  }
};
</script>
<style scoped>
</style>
