<template>
  <div>
    <el-dialog
      :title="diagTitle"
      :visible="visible"
      width="50%"
      @close="onClose"
    >
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
import {
  getDeptsApi,
  addDeptsApi,
  getDeptByIdApi,
  pushDeptByIdApi
} from '@/api/department'
import { getEmployeesApi } from '@/api/employees'
export default {
  name: 'addDept',
  data() {
    const checkDeptName = async (rule, value, callback) => {
      let isRepect
      if (this.formData.id) {
        const { depts } = await getDeptsApi()
        isRepect = depts
          .filter((item) => {
            return (
              item.pid === this.formData.pid && item.id === this.formData.id
            )
          })
          .some((item) => item.name === value)
      } else {
        isRepect = this.currentNode.children?.some(
          (item) => item.name === value
        )
      }
      isRepect ? callback(new Error('部门重复')) : callback()
    }
    const checkDeptCode = async (rule, value, callback) => {
      const { depts } = await getDeptsApi()
      console.log(depts)
      let isRepect
      if (this.formData.id) {
        isRepect = depts
          .filter((item) => item.id !== this.formData.id)
          .some((item) => item.code === value)
      } else {
        isRepect = depts.some((item) => item.code === value)
      }
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
      this.$refs.formData.resetFields()
      this.formData = {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      }
    },
    async onSave() {
      await this.$refs.formData.validate()
      if (!this.formData.id) {
        this.formData.pid = this.currentNode.id
        try {
          await addDeptsApi(this.formData)
          // console.log(this.formData)
          this.$message.success('添加部门成功')
          this.$emit('add')
          this.onClose()
        } catch (error) {
          this.$message.error('添加部门失败')
        }
      } else {
        console.log('编辑')
        await pushDeptByIdApi(this.formData)
        this.$message.success('编辑部门成功')
        this.$emit('add')
        this.onClose()
      }
    },
    async getDeptById(id) {
      this.formData = await getDeptByIdApi(id)
      // console.log(res)
    }
  },
  computed: {
    diagTitle() {
      return this.formData.id ? '编辑部门' : '添加部门'
    }
  }
}
</script>

<style scoped></style>
