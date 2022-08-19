<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-tabs v-model="activeName">
        <el-tab-pane label="角色管理" name="first">
          <el-button type="primary" @click="dialogVisible = true"
            >新增角色</el-button
          >
          <!-- 表格 -->
          <el-table :data="tableData" style="width: 100%">
            <el-table-column type="index" label="序号"> </el-table-column>
            <el-table-column prop="name" label="角色"> </el-table-column>
            <el-table-column prop="description" label="描述"> </el-table-column>
            <el-table-column prop="address" label="操作">
              <template>
                <el-button size="small" type="success" @click="showRightDialog"
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
          <el-alert title="消息提示的文案" type="info" show-icon> </el-alert>

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
    <el-dialog
      @close="closeDialog"
      title="新增角色"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <el-form ref="form" :model="form" label-width="80px" :rules="formRules">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="form.description"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onClose">取 消</el-button>
        <el-button type="primary" @click="onConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="给角色分配权限"
      :visible="setRightVisible"
      @close="closeFn"
    >
      <el-tree
        :data="permission"
        default-expand-all
        show-checkbox
        node-key="id"
        :default-checked-keys="defaultCheckKeys"
        :props="{ label: 'name' }"
        @node-click="handleNodeClick"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeFn">取 消</el-button>
        <el-button type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getRolesApi, addRolesApi } from '@/api/role'
import { getCompanyIdApi } from '@/api/setting'
import { getPermissionList } from '@/api/permission'
import { transListToTree } from '@/utils'
export default {
  name: 'Setting',
  data() {
    return {
      activeName: 'first',
      tableData: [],
      total: 0,
      pagesize: 3,
      page: 1,
      dialogVisible: false,
      form: { name: '', description: '' },
      formRules: {
        name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }]
      },
      setRightVisible: false,
      companyInfoForm: {},
      permission: {},
      defaultCheckKeys: ['1', '1063315016368918528']
    }
  },

  created() {
    this.getRolesApi()
    this.getCompanyId()
    this.getPermissions()
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
    onClose() {
      this.dialogVisible = false
    },
    async onConfirm() {
      await this.$refs.form.validate()
      await addRolesApi(this.form)
      this.$message.success('添加成功')
      this.dialogVisible = false
      this.getRolesApi()
    },
    closeDialog() {
      this.$refs.form.restFields()
      this.form.description = ''
    },
    async getCompanyId() {
      const { data } = await getCompanyIdApi(
        this.$store.state.user.userInfo.companyId
      )
    },
    showRightDialog() {
      this.setRightVisible = true
    },
    closeFn() {
      this.setRightVisible = false
    },
    async getPermissions() {
      const res = await getPermissionList()
      const treePermission = transListToTree(res, '0')
      this.permission = treePermission
      console.log(this.permission)
    }
  }
}
</script>

<style scoped lang="scss">
.el-form {
  margin-top: 10px;
}
</style>
