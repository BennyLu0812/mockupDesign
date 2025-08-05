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

  Divider,
  Empty,
  message,
} from 'ant-design-vue';

const router = useRouter();

// 報表週期選項
const reportPeriodOptions = [
  { value: 'week', label: $t('page.legalPlatform.weeklyReport') },
  { value: 'month', label: $t('page.legalPlatform.monthlyReport') },
  { value: 'halfYear', label: $t('page.legalPlatform.halfYearReport') },
  { value: 'year', label: $t('page.legalPlatform.yearlyReport') },
];

// 篩選表單
const filterForm = reactive({
  period: 'month',
  startDate: undefined,
  endDate: undefined,
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



// 項目進度數據
const projectProgressData = ref([
  {
    id: 1,
    name: '法律條文審查項目',
    type: '法案項目',
    status: '進行中',

    startDate: '2024-01-15',
    endDate: '2024-03-15',
    dueDate: '2024-03-10',
    taskCount: 12,
    completedTasks: 9,
    currentTasks: '第三章條文審查',
    relatedLaws: '民法典修正案',
    currentProgress: '專家意見收集中',
    processingStatus: '正常進行',
    deadlineNode: '2024-02-28',
    teamLeader: 'António Silva',
    riskLevel: 'low',
  },
  {
    id: 2,
    name: '合同審核專案',
    type: '一般項目',
    status: '進行中',

    startDate: '2024-01-20',
    endDate: '2024-02-28',
    dueDate: '2024-02-25',
    taskCount: 8,
    completedTasks: 3,
    currentTasks: '合同條款審查',
    relatedLaws: '合同法相關條文',
    currentProgress: '初步審查完成',
    processingStatus: '需要加速',
    deadlineNode: '2024-02-15',
    teamLeader: 'João Silva',
    riskLevel: 'medium',
  },
  {
    id: 3,
    name: '法規研究分析',
    type: '其他項目',
    status: '已完成',

    startDate: '2024-01-10',
    endDate: '2024-01-25',
    dueDate: '2024-01-25',
    taskCount: 6,
    completedTasks: 6,
    currentTasks: '項目總結',
    relatedLaws: '行政法規彙編',
    currentProgress: '已完成交付',
    processingStatus: '已完成',
    deadlineNode: '2024-01-25',
    teamLeader: 'Maria Santos',
    riskLevel: 'low',
  },
  {
    id: 4,
    name: '知識產權保護項目',
    type: '法案項目',
    status: '準備中',

    startDate: '2024-02-01',
    endDate: '2024-04-30',
    dueDate: '2024-04-25',
    taskCount: 15,
    completedTasks: 1,
    currentTasks: '項目啟動會議',
    relatedLaws: '知識產權法',
    currentProgress: '資源準備中',
    processingStatus: '正常準備',
    deadlineNode: '2024-02-10',
    teamLeader: 'Pedro Costa',
    riskLevel: 'low',
  },
  {
    id: 5,
    name: '勞動法修訂研究',
    type: '法案項目',
    status: '進行中',

    startDate: '2024-01-05',
    endDate: '2024-03-20',
    dueDate: '2024-03-15',
    taskCount: 10,
    completedTasks: 6,
    currentTasks: '條文對比分析',
    relatedLaws: '勞動法及相關法規',
    currentProgress: '中期評估完成',
    processingStatus: '正常進行',
    deadlineNode: '2024-02-20',
    teamLeader: 'Ana Ferreira',
    riskLevel: 'medium',
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
    title: $t('page.legalPlatform.taskCompletion'),
    key: 'taskCompletion',
    width: 120,
  },
  {
    title: $t('page.legalPlatform.currentTasks'),
    dataIndex: 'currentTasks',
    key: 'currentTasks',
    width: 160,
  },
  {
    title: $t('page.legalPlatform.relatedLawsRegulations'),
    dataIndex: 'relatedLaws',
    key: 'relatedLaws',
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

// 篩選後的項目數據
const filteredProjectData = computed(() => {
  let filtered = projectProgressData.value;
  
  if (filterForm.projectType) {
    filtered = filtered.filter(project => project.type === filterForm.projectType);
  }
  
  if (filterForm.projectStatus) {
    filtered = filtered.filter(project => project.status === filterForm.projectStatus);
  }
  
  return filtered;
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



// 處理篩選
const handleFilter = () => {
  console.log('篩選條件:', filterForm);
  message.success('篩選功能已應用');
};

// 重置篩選
const handleReset = () => {
  Object.assign(filterForm, {
    period: 'month',
    startDate: undefined,
    endDate: undefined,
    projectType: undefined,
    projectStatus: undefined,
  });
  message.success('篩選條件已重置');
};

// 導出報表
const handleExportReport = () => {
  console.log('導出報表:', filterForm.period);
  message.success('報表導出功能待實現');
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

// 組件掛載時初始化數據
onMounted(() => {
  console.log('項目進度管理統計表頁面已加載');
});
</script>

<template>
  <Page :title="$t('page.legalPlatform.projectProgressStatistics')">
    <div class="project-progress-statistics">
      <!-- 篩選區域 -->
      <Card class="mb-4">
        <Form
          :model="filterForm"
          layout="inline"
          class="filter-form"
        >
          <Row :gutter="16" class="w-full">
            <Col :span="4">
              <FormItem :label="$t('page.legalPlatform.reportPeriod')">
                <Select
                  v-model:value="filterForm.period"
                  :placeholder="$t('page.legalPlatform.selectPeriod')"
                >
                  <SelectOption
                    v-for="option in reportPeriodOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </SelectOption>
                </Select>
              </FormItem>
            </Col>
            <Col :span="5">
              <FormItem :label="$t('page.legalPlatform.startDate')">
                <DatePicker
                  v-model:value="filterForm.startDate"
                  :placeholder="$t('page.legalPlatform.startDate')"
                  class="w-full"
                />
              </FormItem>
            </Col>
            <Col :span="5">
              <FormItem :label="$t('page.legalPlatform.endDate')">
                <DatePicker
                  v-model:value="filterForm.endDate"
                  :placeholder="$t('page.legalPlatform.endDate')"
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
            <Col :span="6">
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



      <!-- 項目進度數據表 -->
      <Card :title="$t('page.legalPlatform.projectItemsSummary')">
        <Table
          :columns="columns"
          :data-source="filteredProjectData"
          :scroll="{ x: 1500 }"
          :pagination="{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 條，共 ${total} 條`,
          }"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'status'">
              <Tag :color="getStatusColor(record.status)">
                {{ record.status }}
              </Tag>
            </template>

            <template v-else-if="column.key === 'taskCompletion'">
              <div class="text-center">
                <div class="text-sm font-medium">
                  {{ record.completedTasks }}/{{ record.taskCount }}
                </div>
                <div class="text-xs text-gray-500">
                  {{ Math.round((record.completedTasks / record.taskCount) * 100) }}%
                </div>
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
    </div>
  </Page>
</template>

<style scoped>
.project-progress-statistics {
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

.ant-table-wrapper {
  margin-top: 16px;
}

.ant-progress {
  margin: 0;
}

@media (max-width: 1200px) {
  .filter-form .ant-col {
    margin-bottom: 16px;
  }
}

@media (max-width: 768px) {
  .ant-statistic-content {
    font-size: 20px;
  }
  
  .ant-col {
    margin-bottom: 16px;
  }
}
</style>
