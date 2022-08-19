<template>
  <div>
    <el-dialog
      title="分配角色"
      :visible="visible"
      @open="onOpen"
      @close="closeFn"
    >
      <el-checkbox-group v-model="checkList">
        <el-checkbox
          v-for="item in rolesList"
          :key="item.id"
          :label="item.id"
          >{{ item.name }}</el-checkbox
        >
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeFn">取 消</el-button>
        <el-button type="primary" @click="onConfirm">确 定</el-button>
      </span>
    </el-dialog>    
  </div>
</template>

<script>
import { getRolesApi } from '@/api/role'
import { getUserDetail } from '@/api/user'
import { assignRoles } from '@/api/employees'
export default {
  data() {
    return {
      checkList: [],
      rolesList: []
    }
  },
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    currentEmployeeId: {
      type: String,
      required: true
    }
  },
  created() {},

  methods: {
    onOpen() {
      this.getRoles()
      this.getEmployeesRoles()
    },
    async getRoles() {
      const roles = await getRolesApi()
      //   console.log(roles)
      this.rolesList = roles.rows
    },
    async getEmployeesRoles() {
      const res = await getUserDetail(this.currentEmployeeId)
      console.log(res)
      this.checkList = res.roleIds
    },

    closeFn() {
      this.$emit('update:visible', false)
    },
    async onConfirm() {
      if (!this.checkList.length) return this.$message.error('请选择角色')
      await assignRoles({
        id: this.currentEmployeeId,
        roleIds: this.checkList
      })
      this.$message.success('分配成功')
      this.closeFn()
    }
  }
}
</script>

<style scoped></style>
