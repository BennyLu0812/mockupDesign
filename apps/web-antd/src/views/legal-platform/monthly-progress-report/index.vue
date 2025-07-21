<script lang="ts" setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { Page } from '@vben/common-ui';
import { $t } from '#/locales';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  FormItem,
  Row,
  Select,
  SelectOption,
  Space,
  Table,
  Tag,
  Statistic,
  Progress,
  Divider,
  Empty,
  message,
  Tabs,
  TabPane,
} from 'ant-design-vue';

const router = useRouter();

// 月份選項
const monthOptions = [
  { value: 'current', label: $t('page.legalPlatform.currentMonth') },
  { value: 'next', label: $t('page.legalPlatform.nextMonth') },
];

// 篩選表單
const filterForm = reactive({
  monthType: 'current',
  selectedMonth: undefined,
  projectType: undefined,
  projectStatus: undefined,
});

// 項目類型選項
const projectTypeOptions = [
  { value: '一般項目', label: '一般項目' },
  { value: '法案項目', label: '法案項目' },
  { value: '其他項目', label: '其他項目' },
];

// 項目狀態選項
const projectStatusOptions = [
  { value: '準備中', label: '準備中' },
  { value: '進行中', label: '進行中' },
  { value: '已完成', label: '已完成' },
  { value: '已取消', label: '已取消' },
];

// 當月統計概覽數據
const currentMonthStatistics = ref({
  totalProjects: 28,
  completedProjects: 12,
  inProgressProjects: 14,
  pendingProjects: 2,
  monthlyCompletionRate: 85.7,
  monthlyTaskCount: 156,
  monthlyOverdueRate: 8.3,
});

// 下月統計概覽數據
const nextMonthStatistics = ref({
  totalProjects: 32,
  completedProjects: 0,
  inProgressProjects: 8,
  pendingProjects: 24,
  monthlyCompletionRate: 0,
  monthlyTaskCount: 189,
  monthlyOverdueRate: 0,
});

// 當月項目數據
const currentMonthProjects = ref([
  {
    id: 1,
    name: '法律條文審查項目',
    type: '法案項目',
    status: '進行中',
    progress: 75,
    startDate: '2024-01-15',
    endDate: '2024-02-28',
    dueDate: '2024-02-25',
    taskCount: 12,
    completedTasks: 9,
    currentTasks: '第三章條文審查',
    relatedLaws: '民法典修正案',
    currentProgress: '專家意見收集中',
    processingStatus: '正常進行',
    deadlineNode: '2024-02-20',
    teamLeader: '陳大文',
    riskLevel: 'low',
    monthlyDeliverables: '條文審查報告',
    monthlyMilestones: '專家評審完成',
  },
  {
    id: 2,
    name: '合同審核專案',
    type: '一般項目',
    status: '進行中',
    progress: 90,
    startDate: '2024-01-20',
    endDate: '2024-02-28',
    dueDate: '2024-02-25',
    taskCount: 8,
    completedTasks: 7,
    currentTasks: '最終審查',
    relatedLaws: '合同法相關條文',
    currentProgress: '即將完成',
    processingStatus: '正常進行',
    deadlineNode: '2024-02-25',
    teamLeader: '張三',
    riskLevel: 'low',
    monthlyDeliverables: '合同審核報告',
    monthlyMilestones: '合同條款確認',
  },
  {
    id: 3,
    name: '法規研究分析',
    type: '其他項目',
    status: '已完成',
    progress: 100,
    startDate: '2024-01-10',
    endDate: '2024-02-15',
    dueDate: '2024-02-15',
    taskCount: 6,
    completedTasks: 6,
    currentTasks: '項目總結',
    relatedLaws: '行政法規彙編',
    currentProgress: '已完成交付',
    processingStatus: '已完成',
    deadlineNode: '2024-02-15',
    teamLeader: '李四',
    riskLevel: 'low',
    monthlyDeliverables: '法規分析報告',
    monthlyMilestones: '研究報告提交',
  },
]);

// 下月項目數據
const nextMonthProjects = ref([
  {
    id: 4,
    name: '知識產權保護項目',
    type: '法案項目',
    status: '準備中',
    progress: 5,
    startDate: '2024-03-01',
    endDate: '2024-04-30',
    dueDate: '2024-04-25',
    taskCount: 15,
    completedTasks: 0,
    currentTasks: '項目啟動準備',
    relatedLaws: '知識產權法',
    currentProgress: '資源準備中',
    processingStatus: '準備階段',
    deadlineNode: '2024-03-10',
    teamLeader: '王五',
    riskLevel: 'medium',
    monthlyDeliverables: '項目啟動方案',
    monthlyMilestones: '項目啟動會議',
  },
  {
    id: 5,
    name: '勞動法修訂研究',
    type: '法案項目',
    status: '準備中',
    progress: 10,
    startDate: '2024-03-05',
    endDate: '2024-05-20',
    dueDate: '2024-05-15',
    taskCount: 18,
    completedTasks: 1,
    currentTasks: '前期調研',
    relatedLaws: '勞動法及相關法規',
    currentProgress: '調研計劃制定',
    processingStatus: '準備階段',
    deadlineNode: '2024-03-15',
    teamLeader: '趙六',
    riskLevel: 'low',
    monthlyDeliverables: '調研計劃書',
    monthlyMilestones: '調研啟動',
  },
  {
    id: 6,
    name: '環保法規更新',
    type: '其他項目',
    status: '準備中',
    progress: 0,
    startDate: '2024-03-10',
    endDate: '2024-04-15',
    dueDate: '2024-04-10',
    taskCount: 10,
    completedTasks: 0,
    currentTasks: '需求分析',
    relatedLaws: '環境保護法',
    currentProgress: '項目規劃中',
    processingStatus: '準備階段',
    deadlineNode: '2024-03-20',
    teamLeader: '錢七',
    riskLevel: 'low',
    monthlyDeliverables: '需求分析報告',
    monthlyMilestones: '需求確認',
  },
]);

// 表格列配置
const columns = [
  {
    title: $t('page.legalPlatform.projectName'),
    dataIndex: 'name',
    key: 'name',
    width: 180,
    fixed: 'left',
  },
  {
    title: $t('page.legalPlatform.projectType'),
    dataIndex: 'type',
    key: 'type',
    width: 120,
  },
  {
    title: $t('page.legalPlatform.projectStatus'),
    dataIndex: 'status',
    key: 'status',
    width: 100,
  },
  {
    title: $t('page.legalPlatform.progressPercentage'),
    dataIndex: 'progress',
    key: 'progress',
    width: 150,
  },
  {
    title: $t('page.legalPlatform.monthlyDeliverables'),
    dataIndex: 'monthlyDeliverables',
    key: 'monthlyDeliverables',
    width: 160,
  },
  {
    title: $t('page.legalPlatform.monthlyMilestones'),
    dataIndex: 'monthlyMilestones',
    key: 'monthlyMilestones',
    width: 160,
  },
  {
    title: $t('page.legalPlatform.currentProgress'),
    dataIndex: 'currentProgress',
    key: 'currentProgress',
    width: 140,
  },
  {
    title: $t('page.legalPlatform.processingStatus'),
    dataIndex: 'processingStatus',
    key: 'processingStatus',
    width: 120,
  },
  {
    title: $t('page.legalPlatform.deadlineNode'),
    dataIndex: 'deadlineNode',
    key: 'deadlineNode',
    width: 120,
  },
  {
    title: $t('page.legalPlatform.operation'),
    key: 'operation',
    width: 100,
    fixed: 'right',
  },
];

// 當前顯示的統計數據
const currentStatistics = computed(() => {
  return filterForm.monthType === 'current' ? currentMonthStatistics.value : nextMonthStatistics.value;
});

// 當前顯示的項目數據
const currentProjectData = computed(() => {
  let data = filterForm.monthType === 'current' ? currentMonthProjects.value : nextMonthProjects.value;
  
  if (filterForm.projectType) {
    data = data.filter(project => project.type === filterForm.projectType);
  }
  
  if (filterForm.projectStatus) {
    data = data.filter(project => project.status === filterForm.projectStatus);
  }
  
  return data;
});

// 獲取狀態標籤顏色
const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    '準備中': 'blue',
    '進行中': 'green',
    '已完成': 'gray',
    '已取消': 'red',
  };
  return colorMap[status] || 'default';
};

// 獲取風險等級顏色
const getRiskColor = (riskLevel: string) => {
  const colorMap: Record<string, string> = {
    'low': 'green',
    'medium': 'orange',
    'high': 'red',
  };
  return colorMap[riskLevel] || 'default';
};

// 獲取進度條顏色
const getProgressColor = (progress: number) => {
  if (progress >= 80) return '#52c41a';
  if (progress >= 60) return '#1890ff';
  if (progress >= 40) return '#faad14';
  return '#ff4d4f';
};

// 處理篩選
const handleFilter = () => {
  console.log('篩選條件:', filterForm);
  message.success('篩選功能已應用');
};

// 重置篩選
const handleReset = () => {
  Object.assign(filterForm, {
    monthType: 'current',
    selectedMonth: undefined,
    projectType: undefined,
    projectStatus: undefined,
  });
  message.success('篩選條件已重置');
};

// 導出報表
const handleExportReport = () => {
  const monthText = filterForm.monthType === 'current' ? '當月' : '下月';
  console.log(`導出${monthText}報表:`, filterForm);
  message.success(`${monthText}報表導出功能待實現`);
};

// 刷新數據
const handleRefreshData = () => {
  console.log('刷新數據');
  message.success('數據已刷新');
};

// 查看項目詳情
const handleViewDetail = (record: any) => {
  router.push(`/legal-platform/project-management/detail/${record.id}`);
};

// 月份類型變更處理
const handleMonthTypeChange = () => {
  console.log('月份類型變更:', filterForm.monthType);
};

// 組件掛載時初始化數據
onMounted(() => {
  console.log('當月/下月進度表頁面已加載');
});
</script>

<template>
  <Page :title="$t('page.legalPlatform.monthlyProgressReport')">
    <div class="monthly-progress-report">
      <!-- 篩選區域 -->
      <Card class="mb-4">
        <Form
          :model="filterForm"
          layout="inline"
          class="filter-form"
        >
          <Row :gutter="16" class="w-full">
            <Col :span="4">
              <FormItem :label="$t('page.legalPlatform.monthSelection')">
                <Select
                  v-model:value="filterForm.monthType"
                  :placeholder="$t('page.legalPlatform.monthSelection')"
                  @change="handleMonthTypeChange"
                >
                  <SelectOption
                    v-for="option in monthOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </SelectOption>
                </Select>
              </FormItem>
            </Col>
            <Col :span="5">
              <FormItem :label="$t('page.legalPlatform.selectedMonth')">
                <DatePicker
                  v-model:value="filterForm.selectedMonth"
                  picker="month"
                  :placeholder="$t('page.legalPlatform.selectedMonth')"
                  class="w-full"
                />
              </FormItem>
            </Col>
            <Col :span="4">
              <FormItem :label="$t('page.legalPlatform.projectType')">
                <Select
                  v-model:value="filterForm.projectType"
                  :placeholder="$t('page.legalPlatform.projectType')"
                  allow-clear
                >
                  <SelectOption
                    v-for="option in projectTypeOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </SelectOption>
                </Select>
              </FormItem>
            </Col>
            <Col :span="4">
              <FormItem :label="$t('page.legalPlatform.projectStatus')">
                <Select
                  v-model:value="filterForm.projectStatus"
                  :placeholder="$t('page.legalPlatform.projectStatus')"
                  allow-clear
                >
                  <SelectOption
                    v-for="option in projectStatusOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </SelectOption>
                </Select>
              </FormItem>
            </Col>
            <Col :span="7">
              <FormItem>
                <Space>
                  <Button type="primary" @click="handleFilter">
                    <template #icon>
                      <span class="icon-[lucide--search] size-4" />
                    </template>
                    {{ $t('page.legalPlatform.search') }}
                  </Button>
                  <Button @click="handleReset">
                    <template #icon>
                      <span class="icon-[lucide--rotate-ccw] size-4" />
                    </template>
                    {{ $t('page.legalPlatform.reset') }}
                  </Button>
                  <Button @click="handleExportReport">
                    <template #icon>
                      <span class="icon-[lucide--download] size-4" />
                    </template>
                    {{ $t('page.legalPlatform.exportReport') }}
                  </Button>
                  <Button @click="handleRefreshData">
                    <template #icon>
                      <span class="icon-[lucide--refresh-cw] size-4" />
                    </template>
                    {{ $t('page.legalPlatform.refreshData') }}
                  </Button>
                </Space>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Card>

      <!-- 月度統計概覽 -->
      <Card class="mb-4" :title="$t('page.legalPlatform.monthlyOverview')">
        <Row :gutter="16">
          <Col :span="4">
            <Statistic
              :title="$t('page.legalPlatform.monthlyProjectCount')"
              :value="currentStatistics.totalProjects"
              :value-style="{ color: '#1890ff' }"
            >
              <template #prefix>
                <span class="icon-[lucide--folder] size-4" />
              </template>
            </Statistic>
          </Col>
          <Col :span="4">
            <Statistic
              :title="$t('page.legalPlatform.completedProjects')"
              :value="currentStatistics.completedProjects"
              :value-style="{ color: '#52c41a' }"
            >
              <template #prefix>
                <span class="icon-[lucide--check-circle] size-4" />
              </template>
            </Statistic>
          </Col>
          <Col :span="4">
            <Statistic
              :title="$t('page.legalPlatform.inProgressProjects')"
              :value="currentStatistics.inProgressProjects"
              :value-style="{ color: '#faad14' }"
            >
              <template #prefix>
                <span class="icon-[lucide--clock] size-4" />
              </template>
            </Statistic>
          </Col>
          <Col :span="4">
            <Statistic
              :title="$t('page.legalPlatform.monthlyCompletionRate')"
              :value="currentStatistics.monthlyCompletionRate"
              suffix="%"
              :value-style="{ color: '#722ed1' }"
            >
              <template #prefix>
                <span class="icon-[lucide--trending-up] size-4" />
              </template>
            </Statistic>
          </Col>
          <Col :span="4">
            <Statistic
              :title="$t('page.legalPlatform.monthlyTaskCount')"
              :value="currentStatistics.monthlyTaskCount"
              :value-style="{ color: '#13c2c2' }"
            >
              <template #prefix>
                <span class="icon-[lucide--list-checks] size-4" />
              </template>
            </Statistic>
          </Col>
          <Col :span="4">
            <Statistic
              :title="$t('page.legalPlatform.monthlyOverdueRate')"
              :value="currentStatistics.monthlyOverdueRate"
              suffix="%"
              :value-style="{ color: '#ff4d4f' }"
            >
              <template #prefix>
                <span class="icon-[lucide--alert-triangle] size-4" />
              </template>
            </Statistic>
          </Col>
        </Row>
      </Card>

      <!-- 月度項目進度表 -->
      <Card :title="filterForm.monthType === 'current' ? $t('page.legalPlatform.currentMonthReport') : $t('page.legalPlatform.nextMonthReport')">
        <Table
          :columns="columns"
          :data-source="currentProjectData"
          :scroll="{ x: 1500 }"
          :pagination="{
            total: currentProjectData.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total: number) => `共 ${total} 條記錄`,
          }"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'status'">
              <Tag :color="getStatusColor(record.status)">
                {{ record.status }}
              </Tag>
            </template>
            <template v-else-if="column.key === 'progress'">
              <div class="flex items-center space-x-2">
                <Progress
                  :percent="record.progress"
                  :stroke-color="getProgressColor(record.progress)"
                  :show-info="false"
                  class="flex-1"
                />
                <span class="text-sm font-medium">{{ record.progress }}%</span>
              </div>
            </template>
            <template v-else-if="column.key === 'operation'">
              <Space>
                <Button
                  type="link"
                  size="small"
                  @click="handleViewDetail(record)"
                >
                  {{ $t('page.legalPlatform.viewDetails') }}
                </Button>
              </Space>
            </template>
          </template>
        </Table>
      </Card>

      <!-- 月度圖表分析區域 -->
      <Row :gutter="16" class="mt-4">
        <Col :span="12">
          <Card :title="$t('page.legalPlatform.monthlyProjectStatus')">
            <div class="h-64 flex items-center justify-center bg-gray-50 rounded">
              <div class="text-center text-gray-500">
                <span class="icon-[lucide--bar-chart-3] size-8 mb-2" />
                <p>{{ $t('page.legalPlatform.monthlyProjectStatus') }}圖表</p>
                <p class="text-sm">（開發中...）</p>
              </div>
            </div>
          </Card>
        </Col>
        <Col :span="12">
          <Card :title="$t('page.legalPlatform.monthlyTaskDistribution')">
            <div class="h-64 flex items-center justify-center bg-gray-50 rounded">
              <div class="text-center text-gray-500">
                <span class="icon-[lucide--pie-chart] size-8 mb-2" />
                <p>{{ $t('page.legalPlatform.monthlyTaskDistribution') }}圖表</p>
                <p class="text-sm">（開發中...）</p>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Row :gutter="16" class="mt-4">
        <Col :span="12">
          <Card :title="$t('page.legalPlatform.monthlyPerformance')">
            <div class="h-64 flex items-center justify-center bg-gray-50 rounded">
              <div class="text-center text-gray-500">
                <span class="icon-[lucide--trending-up] size-8 mb-2" />
                <p>{{ $t('page.legalPlatform.monthlyPerformance') }}圖表</p>
                <p class="text-sm">（開發中...）</p>
              </div>
            </div>
          </Card>
        </Col>
        <Col :span="12">
          <Card :title="$t('page.legalPlatform.monthlyComparisonAnalysis')">
            <div class="h-64 flex items-center justify-center bg-gray-50 rounded">
              <div class="text-center text-gray-500">
                <span class="icon-[lucide--line-chart] size-8 mb-2" />
                <p>{{ $t('page.legalPlatform.monthlyComparisonAnalysis') }}圖表</p>
                <p class="text-sm">（開發中...）</p>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  </Page>
</template>

<style scoped>
.monthly-progress-report {
  padding: 0;
}

.filter-form {
  width: 100%;
}

.filter-form .ant-form-item {
  margin-bottom: 16px;
}

.ant-statistic {
  text-align: center;
}

.ant-statistic-title {
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
}

.ant-statistic-content {
  font-size: 24px;
  font-weight: 600;
}

.ant-progress {
  margin: 0;
}

.ant-table {
  background: white;
}

.ant-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.ant-card-head-title {
  font-size: 16px;
  font-weight: 600;
}

.text-center {
  text-align: center;
}

.text-gray-500 {
  color: #6b7280;
}

.bg-gray-50 {
  background-color: #f9fafb;
}

.rounded {
  border-radius: 0.375rem;
}

.h-64 {
  height: 16rem;
}

.size-8 {
  width: 2rem;
  height: 2rem;
}

.mb-2 {
  margin-bottom: 0.5rem;
}

.text-sm {
  font-size: 0.875rem;
}
</style>