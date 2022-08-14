<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools>
        <span slot="left-tag">共166条记录</span>
        <template slot="right">
          <el-button
            size="small"
            type="warning"
            @click="$router.push('/import')"
            >导入</el-button
          >
          <el-button size="small" type="danger">导出</el-button>
          <el-button size="small" type="primary" @click="addEmployeeDialog"
            >新增员工</el-button
          >
        </template>
      </page-tools>
      <!-- 放置表格和分页 -->
      <el-card v-loading="loading">
        <el-table :data="employee">
          <el-table-column label="序号" sortable="" type="index" />
          <el-table-column label="姓名" sortable="" prop="username" />
          <el-table-column label="员工">
            <template slot-scope="{ row }">
              <img
                v-imgError="require('@/assets/小猫咪/8888.png')"
                :src="row.staffPhoto"
                alt=""
                style="border-radius: 50%; width: 100px; hight: 100px padding:10px"
              />
            </template>
          </el-table-column>
          <el-table-column label="工号" sortable="" prop="workNumber" />
          <el-table-column
            label="聘用形式"
            sortable=""
            prop="formOfEmployment"
            :formatter="formatterFormOfEmployment"
          />
          <el-table-column label="部门" sortable="" prop="departmentName" />
          <el-table-column label="入职时间" sortable="">
            <template slot-scope="{ row }">
              {{ row.timeOfEntry | formatTime }}
            </template>
          </el-table-column>
          <el-table-column label="账户状态" sortable="">
            <template slot-scope="{ row }">
              <el-switch
                :value="row.enableState === 1"
                active-color="#13ce66"
                inactive-color="#ff4949"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template slot-scope="{ row }">
              <el-button type="text" size="small">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small">角色</el-button>
              <el-button type="text" size="small" @click="delFn(row.id)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row
          type="flex"
          justify="center"
          align="middle"
          style="height: 60px"
        >
          <el-pagination
            layout="prev, pager, next"
            :page-size="pages.size"
            :current-page="pages.page"
            :total="pages.total"
            @current-change="changePage"
          />
        </el-row>
      </el-card>
    </div>
    <addDialog
      @add-success="getEmployeesInfo"
      :visible.sync="dialogVisible"
    ></addDialog>
  </div>
</template>

<script>
import { getEmployeesInfoApi, delEmployee } from '@/api/employees'
import employee from '@/constant/employees'
import addDialog from './components/add-employes.vue'

export default {
  data() {
    return {
      employee: [],
      pages: {
        page: 1,
        size: 10,
        total: 0
      },
      dialogVisible: false,
      loading: false
    }
  },

  created() {
    this.getEmployeesInfo()
  },
  components: {
    addDialog
  },
  methods: {
    async getEmployeesInfo() {
      const res = await getEmployeesInfoApi(this.pages)
      console.log(res)
      this.employee = res.rows
      this.pages.total = res.total
    },
    changePage(val) {
      this.pages.page = val
      this.getEmployeesInfo()
    },
    formatterFormOfEmployment(row, column, cellValue, index) {
      const findHireType = employee.hireType.find(
        (item) => item.id === cellValue
      )
      return findHireType ? findHireType.value : '未知'
    },
    async delFn(id) {
      await this.$confirm('是否删除')
      await delEmployee(id)
      this.$message.success('删除成功')
      this.getEmployeesInfo()
    },
    addEmployeeDialog() {
      this.dialogVisible = true
    }
  }
}
</script>

<style scoped lang="less"></style>
