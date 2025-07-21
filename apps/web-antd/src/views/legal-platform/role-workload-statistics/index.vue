<template>
  <div class="p-4">
    <!-- 頁面標題 -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">
        {{ $t('page.legalPlatform.roleWorkloadStatistics') }}
      </h1>
      <p class="text-gray-600 mt-2">
        {{ $t('page.legalPlatform.workloadVisualization') }}
      </p>
    </div>

    <!-- 篩選表單 -->
    <Card class="mb-6">
      <Form layout="inline" :model="filterForm" class="mb-4">
        <FormItem :label="$t('page.legalPlatform.reportPeriod')">
          <Select v-model:value="filterForm.period" style="width: 150px" @change="handlePeriodChange">
            <SelectOption value="week">{{ $t('page.legalPlatform.weeklyReport') }}</SelectOption>
            <SelectOption value="month">{{ $t('page.legalPlatform.monthlyReport') }}</SelectOption>
            <SelectOption value="halfYear">{{ $t('page.legalPlatform.halfYearReport') }}</SelectOption>
            <SelectOption value="year">{{ $t('page.legalPlatform.yearlyReport') }}</SelectOption>
          </Select>
        </FormItem>
        
        <FormItem :label="$t('page.legalPlatform.projectRole')">
          <Select v-model:value="filterForm.role" style="width: 150px" allow-clear @change="handleRoleChange">
            <SelectOption value="leader">{{ $t('page.legalPlatform.projectLeader') }}</SelectOption>
            <SelectOption value="member">{{ $t('page.legalPlatform.projectMember') }}</SelectOption>
            <SelectOption value="observer">{{ $t('page.legalPlatform.observer') }}</SelectOption>
          </Select>
        </FormItem>
        
        <FormItem :label="$t('page.legalPlatform.startDate')">
          <DatePicker v-model:value="filterForm.startDate" @change="handleDateChange" />
        </FormItem>
        
        <FormItem :label="$t('page.legalPlatform.endDate')">
          <DatePicker v-model:value="filterForm.endDate" @change="handleDateChange" />
        </FormItem>
        
        <FormItem>
          <Space>
            <Button type="primary" @click="handleSearch">
              <template #icon>
                <span class="icon-[lucide--search] size-4" />
              </template>
              {{ $t('page.legalPlatform.search') }}
            </Button>
            <Button @click="handleReset">
              <template #icon>
                <span class="icon-[lucide--refresh-cw] size-4" />
              </template>
              {{ $t('page.legalPlatform.reset') }}
            </Button>
            <Button @click="handleExport">
              <template #icon>
                <span class="icon-[lucide--download] size-4" />
              </template>
              {{ $t('page.legalPlatform.exportReport') }}
            </Button>
            <Button @click="handleRefresh">
              <template #icon>
                <span class="icon-[lucide--refresh-ccw] size-4" />
              </template>
              {{ $t('page.legalPlatform.refreshData') }}
            </Button>
          </Space>
        </FormItem>
      </Form>
    </Card>

    <!-- 統計概覽 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <Statistic
          :title="$t('page.legalPlatform.totalWorkload')"
          :value="statisticsData.totalWorkload"
          :value-style="{ color: '#3f8600' }"
        >
          <template #prefix>
            <span class="icon-[lucide--briefcase] size-4" />
          </template>
        </Statistic>
      </Card>
      
      <Card>
        <Statistic
          :title="$t('page.legalPlatform.completedWorkload')"
          :value="statisticsData.completedWorkload"
          :value-style="{ color: '#1890ff' }"
        >
          <template #prefix>
            <span class="icon-[lucide--check-circle] size-4" />
          </template>
        </Statistic>
      </Card>
      
      <Card>
        <Statistic
          :title="$t('page.legalPlatform.pendingWorkload')"
          :value="statisticsData.pendingWorkload"
          :value-style="{ color: '#faad14' }"
        >
          <template #prefix>
            <span class="icon-[lucide--clock] size-4" />
          </template>
        </Statistic>
      </Card>
      
      <Card>
        <Statistic
          :title="$t('page.legalPlatform.workEfficiency')"
          :value="statisticsData.workEfficiency"
          suffix="%"
          :value-style="{ color: '#52c41a' }"
        >
          <template #prefix>
            <span class="icon-[lucide--trending-up] size-4" />
          </template>
        </Statistic>
      </Card>
    </div>

    <!-- 角色工作量數據表格 -->
    <Card :title="$t('page.legalPlatform.roleBasedWorkload')" class="mb-6">
      <Table
        :columns="workloadColumns"
        :data-source="workloadData"
        :pagination="{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} / ${total}`,
        }"
        @change="handleTableChange"
        :scroll="{ x: 1200 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'workloadProgress'">
            <Progress
              :percent="record.workloadProgress"
              :stroke-color="getProgressColor(record.workloadProgress)"
              size="small"
            />
          </template>
          
          <template v-else-if="column.key === 'efficiency'">
            <Tag :color="getEfficiencyColor(record.efficiency)">
              {{ record.efficiency }}%
            </Tag>
          </template>
          
          <template v-else-if="column.key === 'performance'">
            <Tag :color="getPerformanceColor(record.performance)">
              {{ getPerformanceText(record.performance) }}
            </Tag>
          </template>
          
          <template v-else-if="column.key === 'action'">
            <Space>
              <Button type="link" size="small" @click="handleViewDetails(record)">
                <template #icon>
                  <span class="icon-[lucide--eye] size-4" />
                </template>
                {{ $t('page.legalPlatform.viewDetails') }}
              </Button>
            </Space>
          </template>
        </template>
      </Table>
    </Card>

    <!-- 工作量圖表 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card :title="$t('page.legalPlatform.workloadChart')">
        <div class="h-80 flex items-center justify-center text-gray-500">
          <div class="text-center">
            <span class="icon-[lucide--bar-chart-3] size-12 mb-2 block mx-auto" />
            <p>{{ $t('page.legalPlatform.workloadChart') }}</p>
            <p class="text-sm">工作量分佈圖表</p>
          </div>
        </div>
      </Card>
      
      <Card :title="$t('page.legalPlatform.roleComparison')">
        <div class="h-80 flex items-center justify-center text-gray-500">
          <div class="text-center">
            <span class="icon-[lucide--pie-chart] size-12 mb-2 block mx-auto" />
            <p>{{ $t('page.legalPlatform.roleComparison') }}</p>
            <p class="text-sm">角色工作量對比圖</p>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import {
  Card,
  Form,
  FormItem,
  Select,
  SelectOption,
  DatePicker,
  Button,
  Space,
  Table,
  Statistic,
  Progress,
  Tag,
  message,
} from 'ant-design-vue';
import type { TableColumnsType } from 'ant-design-vue';
import dayjs from 'dayjs';

// 篩選表單
const filterForm = reactive({
  period: 'month',
  role: undefined,
  startDate: dayjs().subtract(1, 'month'),
  endDate: dayjs(),
});

// 統計數據
const statisticsData = reactive({
  totalWorkload: 1250,
  completedWorkload: 980,
  pendingWorkload: 270,
  workEfficiency: 78.4,
});

// 分頁配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 50,
});

// 表格列配置
const workloadColumns: TableColumnsType = [
  {
    title: '角色/人員',
    dataIndex: 'roleName',
    key: 'roleName',
    width: 120,
    fixed: 'left',
  },
  {
    title: '參與項目數',
    dataIndex: 'projectCount',
    key: 'projectCount',
    width: 100,
    align: 'center',
  },
  {
    title: '總工作量',
    dataIndex: 'totalWorkload',
    key: 'totalWorkload',
    width: 100,
    align: 'center',
  },
  {
    title: '已完成',
    dataIndex: 'completedWorkload',
    key: 'completedWorkload',
    width: 100,
    align: 'center',
  },
  {
    title: '進行中',
    dataIndex: 'inProgressWorkload',
    key: 'inProgressWorkload',
    width: 100,
    align: 'center',
  },
  {
    title: '待處理',
    dataIndex: 'pendingWorkload',
    key: 'pendingWorkload',
    width: 100,
    align: 'center',
  },
  {
    title: '工作量進度',
    dataIndex: 'workloadProgress',
    key: 'workloadProgress',
    width: 150,
    align: 'center',
  },
  {
    title: '工作效率',
    dataIndex: 'efficiency',
    key: 'efficiency',
    width: 100,
    align: 'center',
  },
  {
    title: '績效評級',
    dataIndex: 'performance',
    key: 'performance',
    width: 100,
    align: 'center',
  },
  {
    title: '平均完成時間',
    dataIndex: 'avgCompletionTime',
    key: 'avgCompletionTime',
    width: 120,
    align: 'center',
  },
  {
    title: '操作',
    key: 'action',
    width: 100,
    align: 'center',
    fixed: 'right',
  },
];

// 工作量數據
const workloadData = ref([
  {
    key: '1',
    roleName: '陳大文',
    projectCount: 8,
    totalWorkload: 156,
    completedWorkload: 120,
    inProgressWorkload: 28,
    pendingWorkload: 8,
    workloadProgress: 77,
    efficiency: 85,
    performance: 'excellent',
    avgCompletionTime: '3.2天',
  },
  {
    key: '2',
    roleName: '張三',
    projectCount: 6,
    totalWorkload: 124,
    completedWorkload: 95,
    inProgressWorkload: 20,
    pendingWorkload: 9,
    workloadProgress: 77,
    efficiency: 78,
    performance: 'good',
    avgCompletionTime: '4.1天',
  },
  {
    key: '3',
    roleName: '李四',
    projectCount: 5,
    totalWorkload: 98,
    completedWorkload: 72,
    inProgressWorkload: 18,
    pendingWorkload: 8,
    workloadProgress: 73,
    efficiency: 72,
    performance: 'good',
    avgCompletionTime: '4.5天',
  },
  {
    key: '4',
    roleName: '王五',
    projectCount: 4,
    totalWorkload: 86,
    completedWorkload: 58,
    inProgressWorkload: 20,
    pendingWorkload: 8,
    workloadProgress: 67,
    efficiency: 68,
    performance: 'average',
    avgCompletionTime: '5.2天',
  },
  {
    key: '5',
    roleName: '趙六',
    projectCount: 3,
    totalWorkload: 72,
    completedWorkload: 45,
    inProgressWorkload: 18,
    pendingWorkload: 9,
    workloadProgress: 63,
    efficiency: 65,
    performance: 'average',
    avgCompletionTime: '5.8天',
  },
]);

// 獲取進度條顏色
const getProgressColor = (progress: number) => {
  if (progress >= 80) return '#52c41a';
  if (progress >= 60) return '#faad14';
  return '#ff4d4f';
};

// 獲取效率顏色
const getEfficiencyColor = (efficiency: number) => {
  if (efficiency >= 80) return 'green';
  if (efficiency >= 60) return 'orange';
  return 'red';
};

// 獲取績效顏色
const getPerformanceColor = (performance: string) => {
  switch (performance) {
    case 'excellent':
      return 'green';
    case 'good':
      return 'blue';
    case 'average':
      return 'orange';
    case 'poor':
      return 'red';
    default:
      return 'default';
  }
};

// 獲取績效文本
const getPerformanceText = (performance: string) => {
  switch (performance) {
    case 'excellent':
      return '優秀';
    case 'good':
      return '良好';
    case 'average':
      return '一般';
    case 'poor':
      return '較差';
    default:
      return '未知';
  }
};

// 處理週期變更
const handlePeriodChange = () => {
  loadWorkloadData();
};

// 處理角色變更
const handleRoleChange = () => {
  loadWorkloadData();
};

// 處理日期變更
const handleDateChange = () => {
  loadWorkloadData();
};

// 處理搜索
const handleSearch = () => {
  pagination.current = 1;
  loadWorkloadData();
};

// 處理重置
const handleReset = () => {
  filterForm.period = 'month';
  filterForm.role = undefined;
  filterForm.startDate = dayjs().subtract(1, 'month');
  filterForm.endDate = dayjs();
  pagination.current = 1;
  loadWorkloadData();
};

// 處理導出
const handleExport = () => {
  message.success('報表導出成功');
};

// 處理刷新
const handleRefresh = () => {
  loadWorkloadData();
  message.success('數據刷新成功');
};

// 處理表格變更
const handleTableChange = (pag: any) => {
  pagination.current = pag.current;
  pagination.pageSize = pag.pageSize;
  loadWorkloadData();
};

// 處理查看詳情
const handleViewDetails = (record: any) => {
  message.info(`查看 ${record.roleName} 的詳細工作量信息`);
};

// 加載工作量數據
const loadWorkloadData = () => {
  // 模擬API調用
  console.log('Loading workload data with filters:', filterForm);
};

// 組件掛載時初始化數據
onMounted(() => {
  loadWorkloadData();
});
</script>

<style scoped>
.ant-statistic-content {
  font-size: 20px;
  font-weight: bold;
}
</style>