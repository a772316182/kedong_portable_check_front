<script setup lang="ts">
// Sample data for the dashboard
const factoryStationCount = ref(66)
const reportCount = ref(850)

const chartData = ref([
  { month: '2020-10', value: 130 },
  { month: '2020-11', value: 110 },
  { month: '2020-12', value: 180 },
  { month: '2021-1', value: 140 },
  { month: '2021-2', value: 70 },
  { month: '2021-3', value: 50 }
])

const rankingData = ref([
  { station: 'xxx变电站', score: 96 },
  { station: 'xxx变电站', score: 95 },
  { station: 'xxx变电站', score: 94 },
  { station: 'xxx变电站', score: 90 },
  { station: 'xxx变电站', score: 89 },
  { station: 'xxx变电站', score: 89 },
  { station: 'xxx变电站', score: 88 }
])

const recentReports = ref([
  {
    person: 'xxx',
    station: 'xxx变电站安全检查报告',
    date: '2021-3-1 08:00:00',
    status: '待审核'
  },
  {
    person: 'xxx',
    station: 'xxx变电站安全检查报告',
    date: '2021-3-1 08:00:00',
    status: '待审核'
  },
  {
    person: 'xxx',
    station: 'xxx变电站安全检查报告',
    date: '2021-3-1 08:00:00',
    status: '待审核'
  }
])
</script>

<template>
  <div class="dashboard-container">
    <div class="row q-col-gutter-md">
      <!-- Left Column -->
      <div class="col-12 col-md-7">
        <!-- Top Stats Cards -->
        <div class="row q-col-gutter-md q-mb-md">
          <div class="col-6">
            <q-card class="stats-card">
              <q-card-section class="q-pa-lg">
                <div class="stats-content">
                  <div class="stats-icon stats-icon--orange">
                    <q-icon name="factory" size="24px" />
                  </div>
                  <div class="stats-info">
                    <div class="stats-label">检查厂站数量</div>
                    <div class="stats-value">{{ factoryStationCount }}</div>
                    <div class="stats-unit">家</div>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-6">
            <q-card class="stats-card">
              <q-card-section class="q-pa-lg">
                <div class="stats-content">
                  <div class="stats-icon stats-icon--green">
                    <q-icon name="description" size="24px" />
                  </div>
                  <div class="stats-info">
                    <div class="stats-label">检查报告数量</div>
                    <div class="stats-value">{{ reportCount }}</div>
                    <div class="stats-unit">份</div>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <!-- Chart Card -->
        <q-card class="chart-card">
          <q-card-section>
            <div class="chart-title">验收次数</div>
            <div class="chart-container">
              <div
                  v-for="(item, index) in chartData"
                  :key="index"
                  class="chart-bar-wrapper"
              >
                <div
                    class="chart-bar"
                    :style="{ height: `${Math.max((item.value / 200) * 100, 5)}%` }"
                />
                <div class="chart-label">{{ item.month }}</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Right Column -->
      <div class="col-12 col-md-5">
        <div class="right-column">
          <!-- Ranking Card -->
          <q-card class="ranking-card">
            <q-card-section>
              <div class="card-title">基础核查问题数量排行</div>
              <div class="ranking-list">
                <div
                    v-for="(item, index) in rankingData"
                    :key="index"
                    class="ranking-item"
                >
                  <div class="ranking-bullet" />
                  <div class="ranking-station">{{ item.station }}</div>
                  <div class="ranking-score">{{ item.score }}</div>
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- Reports Card -->
          <q-card class="reports-card">
            <q-card-section>
              <div class="card-header">
                <div class="card-title">最新验收报告</div>
                <q-icon name="description" color="primary" size="24px" />
              </div>
              <div class="reports-list">
                <div
                    v-for="(report, index) in recentReports"
                    :key="index"
                    class="report-item"
                >
                  <div class="report-bullet" />
                  <div class="report-content">
                    <div class="report-title">{{ report.station }}</div>
                    <div class="report-meta">
                      <span>负责人：{{ report.person }}</span>
                      <span>{{ report.date }}</span>
                    </div>
                  </div>
                  <q-btn
                      size="sm"
                      color="grey-5"
                      text-color="dark"
                      :label="report.status"
                      flat
                      dense
                      class="report-status-btn"
                  />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  padding: 16px;
  height: 100%;
}

/* Stats Cards */
.stats-card {
  height: 120px;
  transition: box-shadow 0.3s ease;
}

.stats-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stats-content {
  display: flex;
  align-items: center;
  gap: 16px;
  height: 100%;
}

.stats-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.stats-icon--orange {
  background: linear-gradient(135deg, #ff9800, #f57c00);
}

.stats-icon--green {
  background: linear-gradient(135deg, #4caf50, #388e3c);
}

.stats-info {
  flex: 1;
}

.stats-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
}

.stats-value {
  font-size: 32px;
  font-weight: bold;
  color: #333;
  line-height: 1;
  margin-bottom: 2px;
}

.stats-unit {
  font-size: 14px;
  color: #666;
}

/* Chart Card */
.chart-card {
  min-height: 400px;
}

.chart-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 24px;
  color: #333;
}

.chart-container {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  height: 300px;
  padding: 20px 0;
  background: #fafafa;
  border-radius: 8px;
}

.chart-bar-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  justify-content: flex-end;
}

.chart-bar {
  width: 50px;
  background: linear-gradient(to top, #e0e0e0, #f5f5f5);
  border-radius: 6px 6px 0 0;
  margin-bottom: 12px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.chart-bar:hover {
  background: linear-gradient(to top, #2196f3, #64b5f6);
  transform: translateY(-2px);
}

.chart-label {
  font-size: 12px;
  color: #666;
  text-align: center;
  font-weight: 500;
}

/* Right Column */
.right-column {
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

/* Ranking Card */
.ranking-card {
  flex: 1;
  min-height: 280px;
}

.ranking-list {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.ranking-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  transition: background-color 0.2s ease;
  border-radius: 4px;
}

.ranking-item:hover {
  background-color: #f5f5f5;
}

.ranking-bullet {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #f44336;
  flex-shrink: 0;
}

.ranking-station {
  flex: 1;
  font-size: 14px;
  color: #333;
}

.ranking-score {
  font-weight: bold;
  color: #ff9800;
  font-size: 16px;
}

/* Reports Card */
.reports-card {
  flex: 1;
  min-height: 280px;
}

.reports-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.report-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s ease;
  border-radius: 4px;
}

.report-item:hover {
  background-color: #f9f9f9;
}

.report-item:last-child {
  border-bottom: none;
}

.report-bullet {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #f44336;
  flex-shrink: 0;
  margin-top: 6px;
}

.report-content {
  flex: 1;
}

.report-title {
  font-size: 14px;
  margin-bottom: 6px;
  color: #333;
  font-weight: 500;
}

.report-meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 12px;
  color: #666;
}

.report-status-btn {
  flex-shrink: 0;
  border-radius: 12px;
}

/* Responsive Design */
@media (max-width: 1023px) {
  .right-column {
    margin-top: 16px;
  }

  .stats-value {
    font-size: 28px;
  }

  .chart-bar {
    width: 40px;
  }
}

@media (max-width: 599px) {
  .dashboard-container {
    padding: 8px;
  }

  .stats-content {
    gap: 12px;
  }

  .stats-icon {
    width: 40px;
    height: 40px;
  }

  .stats-value {
    font-size: 24px;
  }

  .chart-container {
    height: 250px;
    padding: 15px 0;
  }

  .chart-bar {
    width: 35px;
  }
}
</style>