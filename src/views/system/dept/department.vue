<template>
  <el-main>
    <el-form :model="searchModel" ref="searchForm" label-width="80px" :inline="true" size="small">
      <el-form-item>
        <el-input placeholder="请输入部门名称" v-model="searchModel.departmentName"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
        <el-button icon="el-icon-refresh-right">重置</el-button>
        <el-button type="success" icon="el-icon-plus" @click="openAddWindow()">新增</el-button>
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
      <el-table-column prop="tips" label="部门描述"></el-table-column>
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
    <!-- 窗口-->
    <system-dialog
      :title="deptDialog.title"
      :visible="deptDialog.visible"
      :width="deptDialog.width"
      :height="deptDialog.height"
      @onClose="onClose()"
      @onConfirm="onConfirm()"
    >
      <div slot="content">
        <el-form
          :model="dept"
          ref="deptForm"
          :rules="rules"
          label-width="80px"
          :inline="true"
          size="small"
        >
          <el-form-item label="上级部门" prop="parentName">
            <el-input v-model="dept.parentName" @click.native="selectDepartment()" :readonly="true"></el-input>
          </el-form-item>
          <el-form-item label="部门全称" prop="fullName">
            <el-input v-model="dept.fullName"></el-input>
          </el-form-item>
          <el-form-item label="部门简称">
            <el-input v-model="dept.simpleName"></el-input>
          </el-form-item>
          <el-form-item label="部门描述">
            <el-input v-model="dept.tips"></el-input>
          </el-form-item>
          <el-form-item label="序号">
            <el-input v-model="dept.num"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </system-dialog>
    <system-dialog
      :title="parDialog.title"
      :visible="parDialog.visible"
      :width="parDialog.width"
      :height="parDialog.height"
      @onClose="onParClose()"
      @onConfirm="onParConfirm()"
    >
      <div slot="content">
        <el-tree
          ref="parentTree"
          :data="treeList"
          node-key="id"
          :props="defaultProps"
          :default-expand-all="true"
          :highlight-current="true"
          :expand-on-click-node="false"
          @node-click="handleNodeClick"
        >
          <div class="customer-tree-node" slot-scope="{ node, data }">
            <span v-if="data.children.length === 0">
              <i class="el-icon-document"></i>
            </span>
            <span v-else @click="openBtn(data)">
              <svg-icon v-if="data.open" icon-class="eye" />
              <svg-icon v-else icon-class="eye-open" />
            </span>
            <span style="margin-left: 5px">{{ node.label }}</span>
          </div>
        </el-tree>
      </div>
    </system-dialog>
  </el-main>
</template> 

<script>
import { list, save, del,parList } from "@/api/system/dept";
import SystemDialog from "@/components/SystemDialog";
export default {
  name: "department",
  components: { SystemDialog },
  data() {
    return {
      //主页面显示
      searchModel: {
        departmentName: ""
      },
      tableData: [],

      //新增部门弹窗
      deptDialog: {
        title: "新增部门",
        visible: false,
        //是否显示
        width: 600,
        height: 170
      },
      //X新增部门对象
      dept: {
        id: "",
        pid: "",
        parentName: "",
        fullName: "",
        simpleName: "",
        
        tips: "",
        num: ""
      },
      rules: {
        parentName: [
          { required: true, trigger: "change", message: "请选择上级部门" }
        ],
        fullName: [
          { required: true, trigger: "blur", message: "请输入部门名称" }
        ]
      },

      // 选择上级部门弹窗
      parDialog: {
        title: "新增部门",
        visible: false,
        //是否显示
        width: 300,
        height: 400
      },
      treeList: [],
      defaultProps: { children: "children", label: "fullName" }
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
      this.$objCopy(row, this.dept); 
      //this.dept.parentName
      //设置窗口标题 
      this.deptDialog.title = "编辑部门"; 
      //显示编辑部门窗口 
      this.deptDialog.visible = true;
    },
    handleDelete(row) {
      console.log(row);
    },
    //弹窗验证
    onConfirm() {
      //表单验证
      var self = this
      this.$refs.deptForm.validate( async (valid) => {
        //如果验证通过
        if (valid) {
          //关闭窗口
          let res =null;
          let menuData ={
            id : null,
            simpleName: self.dept.simpleName, 
            fullName: self.dept.fullName, 
            num: parseInt(self.dept.num), 
            pid: self.dept.pid, 
            tips: self.dept.tips 
          }
          if(self.dept.id !==''){
            menuData.id= parseInt( self.dept.id);
          }
          debugger;
          console.log(menuData);
          res = await save(menuData);
          if(res){
            this.$message.success("操作成功");
             this.deptDialog.visible = false;
            
          }else{
            this.$message.success("操作失败，请联系相关人员");
          }
          this.search();
        }
      });
    },
    onClose() {
      //关闭窗口
      this.deptDialog.visible = false;
    },
    openAddWindow() {
      this.$resetForm("deptForm", this.dept);
      //设置窗口标题
      this.deptDialog.title = "新增部门";
      //显示添加部门窗口
      this.deptDialog.visible = true;
    },
    //选择上级部门点击事件
    async selectDepartment() {
      this.parDialog.visible = true;
      //设置窗口标题
      this.parDialog.title = "选择所属部门";
      //查询部门列表
      let res = await parList();
      this.treeList = res;
    },
    onParClose() {
      this.parDialog.visible = false;
    },
    onParConfirm() {
      this.parDialog.visible = false;
    },
    handleNodeClick(data) {
      //当点击树节点时，赋予选中的值
      console.log(data);
      this.dept.pid = data.id;
      this.dept.parentName = data.fullName;
    },
    openBtn(data) {
      //修改折叠展开状态
      data.open = !data.open;
      this.$refs.parentTree.store.nodesMap[data.id].expanded = !data.open;
    }
  },
  mounted() {},
  computed: {}
};
</script>
<style lang="scss" scoped>
::v-deep .el-tree {
  .el-tree-node {
    position: relative;
    padding-left: 10px;
  }
  .el-tree-node__children {
    padding-left: 20px;
  }
  .el-tree-node :last-child:before {
    height: 40px;
  }
  .el-tree > .el-tree-node:before {
    border-left: none;
  }
  .el-tree > .el-tree-node:after {
    border-top: none;
  }
  .el-tree-node:before,
  .el-tree-node:after {
    content: "";
    left: -4px;
    position: absolute;
    right: auto;
    border-width: 1px;
  }
  .tree :first-child .el-tree-node:before {
    border-left: none;
  }
  .el-tree-node:before {
    border-left: 1px dotted #d9d9d9;
    bottom: 0px;
    height: 100%;
    top: -25px;
    width: 1px;
  }
  .el-tree-node:after {
    border-top: 1px dotted #d9d9d9;
    height: 20px;
    top: 14px;
    width: 24px;
  }
  .el-tree-node__expand-icon.is-leaf {
    width: 8px;
  }
  .el-tree-node__content > .el-tree-node__expand-icon {
    display: none;
  }
  .el-tree-node__content {
    line-height: 30px;
    height: 30px;
    padding-left: 10px !important;
  }
}
::v-deep .el-tree > div {
  &::before {
    display: none;
  }
  &::after {
    display: none;
  }
}
</style>
