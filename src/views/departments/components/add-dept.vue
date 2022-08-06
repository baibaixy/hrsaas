<template>
  <div>
    <el-dialog title="提示" :visible="visible" width="50%" @close="onClose">
      <el-form
        label-width="100px"
        :model="formData"
        :rules="formDataRules"
        ref="formData"
      >
        <el-form-item label="部门名称" prop="name">
          <el-input
            placeholder="请选择部门名称"
            v-model="formData.name"
          ></el-input>
        </el-form-item>
        <el-form-item label="部门编码" prop="code">
          <el-input
            placeholder="请选择部门编码"
            v-model="formData.code"
          ></el-input>
        </el-form-item>
        <el-form-item label="部门负责人" prop="manager">
          <el-select
            placeholder="请选择部门负责人"
            style="width: 100%"
            v-model="formData.manager"
          >
            <el-option
              v-for="item in employees"
              :key="item.id"
              :label="item.username"
              :value="item.username"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门介绍" prop="introduce">
          <el-input
            type="textarea"
            placeholder="请选择部门介绍"
            v-model="formData.introduce"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onClose">取 消</el-button>
        <el-button @click="onSave" type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getDeptsApi, addDeptsApi } from '@/api/department'
import { getEmployeesApi } from '@/api/employees'
export default {
  data() {
    const checkDeptName = (rule, value, callback) => {
      const isRepect = this.currentNode.children?.some(
        (item) => item.name === value
      )
      isRepect ? callback(new Error('部门重复')) : callback()
    }
    const checkDeptCode = async (rule, value, callback) => {
      const { depts } = await getDeptsApi()
      console.log(depts)
      const isRepect = depts.some((item) => item.code === value)
      isRepect ? callback(new Error('编码重复')) : callback()
    }
    return {
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      formDataRules: {
        name: [
          { required: true, message: '请输入部门名称', trigger: 'blur' },
          {
            validator: checkDeptName,
            trigger: 'blur'
          }
        ],
        code: [
          { required: true, message: '请输入部门编码', trigger: 'blur' },
          { validator: checkDeptCode, trigger: 'blur' }
        ],
        manager: [
          { required: true, message: '请输入部门负责人', trigger: 'change' }
        ],
        introduce: [
          { required: true, message: '请输入部门介绍', trigger: 'blur' }
        ]
      },
      employees: []
    }
  },
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    currentNode: {
      type: Object,
      required: true
    }
  },
  created() {
    this.getEmployees()
  },

  methods: {
    async getEmployees() {
      const res = await getEmployeesApi()
      // console.log(res)
      this.employees = res
    },
    onClose() {
      this.$emit('update:visible', false)
    },
    async onSave() {
      await this.$refs.formData.validate()
      this.formData.pid = this.currentNode.id
      await addDeptsApi(this.formData)
      // console.log(this.formData)
      this.$message.success('添加部门成功')
      this.onClose()
    }
  }
}
</script>

<style scoped></style>
