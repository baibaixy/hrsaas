<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-tabs v-model="activeName">
        <el-tab-pane label="角色管理" name="first">
          <el-button
            type="primary"
            @click="addDialogVisible = true"
            v-if="isHas(point.roles.add)"
            >新增角色</el-button
          >
          <!-- 表格 -->
          <el-table :data="tableData" style="width: 100%">
            <el-table-column type="index" label="序号"> </el-table-column>
            <el-table-column prop="name" label="角色"> </el-table-column>
            <el-table-column prop="description" label="描述"> </el-table-column>
            <el-table-column prop="address" label="操作">
              <template slot-scope="{ row }">
                <el-button
                  size="small"
                  type="success"
                  @click="permissionsClick(row.id)"
                  >分配权限</el-button
                >
                <el-button size="small" type="primary">编辑</el-button>
                <el-button size="small" type="danger">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-pagination
            layout="prev, pager, next, sizes"
            :page-size="pagesize"
            :total="total"
            @current-change="currentChange"
            @size-change="handleSizeChange"
            :page-sizes="[5, 8, 10, 20]"
          >
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="公司信息" name="second">
          <el-alert
            title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
            type="info"
            show-icon
            :closable="false"
          >
          </el-alert>
          <el-form ref="form" label-width="80px">
            <el-form-item label="公司名称">
              <el-input disabled v-model="companyInfoForm.name"></el-input>
            </el-form-item>
            <el-form-item label="公司地址">
              <el-input
                disabled
                v-model="companyInfoForm.companyAddress"
              ></el-input>
            </el-form-item>
            <el-form-item label="公司邮箱">
              <el-input disabled v-model="companyInfoForm.mailbox"></el-input>
            </el-form-item>
            <el-form-item label="备注">
              <el-input disabled v-model="companyInfoForm.remarks"></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 添加角色对话框 -->
    <el-dialog
      @close="dialogClose"
      title="新增角色"
      :visible.sync="addDialogVisible"
      width="50%"
    >
      <el-form
        ref="form"
        label-width="80px"
        :model="addRoleForm"
        :rules="addRoleFormRules"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="addRoleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addRoleForm.description"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onClose">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 给角色分配权限 -->
    <el-dialog
      title="给角色分配权限"
      :visible.sync="setRightDialog"
      width="50%"
      destroy-on-close
      @close="setRightClose"
    >
      <el-tree
        default-expand-all
        :data="permissions"
        :props="{ label: 'name' }"
        show-checkbox
        :default-checked-keys="defaultCheckedKeys"
        node-key="id"
        ref="perTree"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialog = false">取 消</el-button>
        <el-button type="primary" @click="onSave">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getRolesApi, addRolesApi, getRolesInfo, assignPerm } from '@/api/role'
import { getCompanyInfo } from '@/api/setting'
import { getPermissionList } from '@/api/permisson'
import { transListToTree } from '@/utils'
// import mixinPermission from '@/mixins/permission'
export default {
  name: 'Setting',
  // mixins: [mixinPermission],
  data() {
    return {
      activeName: 'first',
      tableData: [],
      total: 0,
      pagesize: 3,
      page: 1,
      addDialogVisible: false,
      addRoleForm: {
        name: '', //角色名称
        description: '' //角色描述
      },
      addRoleFormRules: {
        name: [
          {
            required: true,
            message: '请输入角色名称',
            trigger: 'blur'
          }
        ]
      },
      companyInfoForm: {
        // name: '江苏传智播客教育科技股份有限公司',
        // companyAddress: '北京市昌平区建材城西路金燕龙办公楼一层',
        // mailbox: 'bd@itcastcn',
        // remarks: '传智播客官网-好口碑IT培训机构,一样的教育,不一样的品质'
      },
      setRightDialog: false, //给角色分配权限
      permissions: [], //权限树形数据
      defaultCheckedKeys: [], //分配权限
      roleId: ''
    }
  },

  created() {
    this.getRolesApi()
    this.getCompanyInfo()
    this.getPermissionList()
  },

  methods: {
    async getRolesApi() {
      const { rows, total } = await getRolesApi({
        page: this.page,
        pagesize: this.pagesize
      })
      this.tableData = rows
      this.total = total
    },
    currentChange(val) {
      this.page = val
      this.getRolesApi()
    },
    handleSizeChange(val) {
      this.pagesize = val
      this.getRolesApi()
    },
    //点击取消
    onClose() {
      this.addDialogVisible = false
    },
    async addRole() {
      await this.$refs.form.validate()
      await addRolesApi(this.addRoleForm)
      this.$message.success('添加成功')
      this.addDialogVisible = false
      this.getRolesApi()
    },
    dialogClose() {
      this.$refs.form.resetFields()
      this.addRoleForm.description = ''
    },
    async getCompanyInfo() {
      const res = await getCompanyInfo(
        this.$store.state.user.userInfo.companyId
      )
      this.companyInfoForm = res
    },
    async permissionsClick(id) {
      this.roleId = id
      this.setRightDialog = true
      const res = await getRolesInfo(id)
      this.defaultCheckedKeys = res.permIds
    },
    async getPermissionList() {
      const res = await getPermissionList()
      const treePermission = transListToTree(res, '0')
      this.permissions = treePermission
    },
    setRightClose() {
      this.defaultCheckedKeys = []
    },
    async onSave() {
      await assignPerm({
        id: this.roleId,
        permIds: this.$refs.perTree.getCheckedKeys()
      })
      this.$message.success('分配成功')
      this.setRightDialog = false
    },
  }
}
</script>

<style scoped lang="scss">
.el-form {
  margin-top: 10px;
}
</style>
