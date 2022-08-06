<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="box-card" v-loading="loading">
        <TreeTools
          @add="showAddDepts"
          :isRoot="true"
          :treeNode="company"
        ></TreeTools>
        <!-- 树形 -->
        <el-tree :data="departs" :props="defaultProps" default-expand-all>
          <template v-slot="{ data }">
            <TreeTools
              @add="showAddDepts"
              @remove="getDepts"
              :treeNode="data"
              @edit="onEdit"
            ></TreeTools>
          </template>
        </el-tree>
      </el-card>
    </div>
    <add-dept
      ref="addDept"
      @add="getDepts"
      :visible.sync="dialogVisible"
      :currentNode="currentNode"
    ></add-dept>
  </div>
</template>

<script>
import TreeTools from './components/tree-tools.vue'
import { getDeptsApi } from '@/api/department'
import { transListToTree } from '@/utils'
import addDept from './components/add-dept.vue'
export default {
  data() {
    return {
      defaultProps: {
        label: 'name'
      },
      departs: [
        { name: '总裁办', children: [{ name: '董事会' }] },
        { name: '行政部' },
        { name: '人事部' }
      ],
      company: { name: '传值教育', manager: '负责人' },
      dialogVisible: false,
      currentNode: {},
      loading: false
    }
  },
  components: {
    TreeTools,
    addDept
  },
  created() {
    this.getDepts()
  },

  methods: {
    async getDepts() {
      this.loading = true
      const res = await getDeptsApi()
      // console.log(res)
      this.departs = transListToTree(res.depts, '')
      this.loading = false
    },
    showAddDepts(val) {
      this.dialogVisible = true
      this.currentNode = val
    },
    onEdit(val) {
      this.dialogVisible = true
      this.$refs.addDept.getDeptById(val.id)
    }
  }
}
</script>

<style scoped lang="less"></style>
