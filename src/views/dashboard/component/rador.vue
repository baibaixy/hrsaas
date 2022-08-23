<template>
  <div class="rador" id="main"></div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  data() {
    return {}
  },

  created() {},
  mounted() {
    this.initRador()
  },
  methods: {
    initRador() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('main'))
      // 绘制图表
      myChart.setOption({
        title: {
          text: '人员绩效表'
        },
        radar: {
          // shape: 'circle',
          indicator: [
            { name: '考勤', max: 100 },
            { name: '技术', max: 100 },
            { name: '管理 Technology', max: 100 },
            { name: '分享 Support', max: 100 },
            { name: 'bug', max: 100 },
            { name: '助人', max: 100 }
          ]
        },
        series: [
          {
            name: 'Budget vs spending',
            type: 'radar',
            data: [
              {
                value: [40, 30, 20, 30, 50, 100],
                name: 'Allocated Budget'
              },
              {
                value: [50, 100, 20, 20, 40, 20],
                name: 'Actual Spending'
              }
            ]
          }
        ]
      })
    }
  }
}
</script>

<style scoped lang="scss">
.rador {
  width: 700px;
  height: 500px;
}
</style>
