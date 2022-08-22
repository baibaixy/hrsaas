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
            v-isHas="point.employees.import"
            >导入</el-button
          >
          <el-button size="small" type="danger" @click="exportExcel"
            >导出</el-button
          >
          <el-button
            v-if="isHas(point.employees.add)"
            size="small"
            type="primary"
            @click="addEmployeeDialog"
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
                @click="showErWeiMa(row.staffPhoto)"
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
              <el-button
                type="text"
                size="small"
                @click="$router.push('/employees/detail/' + row.id)"
                >查看</el-button
              >
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button
                type="text"
                size="small"
                @click="showAssignRole(row.id)"
                >角色</el-button
              >
              <el-button
                type="text"
                size="small"
                @click="delFn(row.id)"
                v-if="isHas(point.employees.del)"
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
    <el-dialog title="用户头像" :visible.sync="Visible">
      <canvas id="canvas"></canvas>
    </el-dialog>
    <assignRole
      :visible.sync="visible"
      :currentEmployeeId="currentEmployeeId"
    ></assignRole>
  </div>
</template>

<script>
import { getEmployeesInfoApi, delEmployee } from '@/api/employees'
import employee from '@/constant/employees'
import addDialog from './components/add-employes.vue'
import assignRole from './components/assign-role.vue'
const { exportExcelMapPath, hireType } = employee
import QRCode from 'qrcode'
import permissionPoint from '@/constant/permission'
// import mixinPermission from '@/mixins/permission'
export default {
  // mixins: [mixinPermission],
  data() {
    return {
      employee: [],
      pages: {
        page: 1,
        size: 10,
        total: 0
      },
      dialogVisible: false,
      loading: false,
      Visible: false,
      visible: false,
      currentEmployeeId: '',
      point: permissionPoint
    }
  },

  created() {
    this.getEmployeesInfo()
  },
  components: {
    addDialog,
    assignRole
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
    showAssignRole(id) {
      this.currentEmployeeId = id
      this.visible = true
    },
    async delFn(id) {
      await this.$confirm('是否删除')
      await delEmployee(id)
      this.$message.success('删除成功')
      this.getEmployeesInfo()
    },
    addEmployeeDialog() {
      this.dialogVisible = true
    },

    async exportExcel() {
      const { export_json_to_excel } = await import('@/vendor/Export2Excel')
      const { rows } = await getEmployeesInfoApi({
        page: 1,
        size: this.pages.total
      })
      const header = Object.keys(exportExcelMapPath)
      const data = rows.map((item) => {
        return header.map((h) => {
          if (h === '聘用形式') {
            const findItem = hireType.find((hire) => {
              return hire.id === item[exportExcelMapPath[h]]
            })
            return findItem ? findItem.value : '未知'
          } else {
            return item[exportExcelMapPath[h]]
          }
        })
      })

      export_json_to_excel({
        header, //表头 必填
        data, //具体数据 必填
        filename: '员工列表', //非必填
        autoWidth: true, //非必填
        bookType: 'xlsx' //非必填
        // multiHeader:[['手机号','其他信息']]
      })
    },
    showErWeiMa(staffPhoto) {
      if (!staffPhoto) {
        return this.$message.error('该用户无头像')
      }
      this.Visible = true
      this.$nextTick(() => {
        const canvas = document.getElementById('canvas')
        QRCode.toCanvas(canvas, staffPhoto)
      })
    },
    isHas(){
      
    }
  }
}
</script>

<style scoped lang="less"></style>
