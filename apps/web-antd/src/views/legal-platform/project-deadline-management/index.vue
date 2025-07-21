<template>
  <div class="p-4">
    <!-- 頁面標題 -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">
        {{ $t('page.legalPlatform.projectDeadlineManagement') }}
      </h1>
    </div>

    <!-- 篩選表單 -->
    <div class="mb-6 p-4 bg-white rounded-lg shadow">
      <Form layout="inline" :model="filterForm">
        <FormItem :label="$t('page.legalPlatform.projectType')">
          <Select
            v-model:value="filterForm.projectType"
            :placeholder="$t('page.legalPlatform.projectType')"
            style="width: 150px"
            allow-clear
          >
            <Select.Option value="general">{{ $t('page.legalPlatform.generalProject') }}</Select.Option>
            <Select.Option value="bill">{{ $t('page.legalPlatform.billProject') }}</Select.Option>
            <Select.Option value="other">{{ $t('page.legalPlatform.otherProject') }}</Select.Option>
          </Select>
        </FormItem>

        <FormItem :label="$t('page.legalPlatform.deadlineStatus')">
          <Select
            v-model:value="filterForm.deadlineStatus"
            :placeholder="$t('page.legalPlatform.deadlineStatus')"
            style="width: 150px"
            allow-clear
          >
            <Select.Option value="normal">{{ $t('page.legalPlatform.normal') }}</Select.Option>
            <Select.Option value="warning">{{ $t('page.legalPlatform.warning') }}</Select.Option>
            <Select.Option value="overdue">{{ $t('page.legalPlatform.overdue') }}</Select.Option>
            <Select.Option value="critical">{{ $t('page.legalPlatform.critical') }}</Select.Option>
          </Select>
        </FormItem>

        <FormItem :label="$t('page.legalPlatform.reminderDays')">
          <Select
            v-model:value="filterForm.reminderDays"
            :placeholder="$t('page.legalPlatform.reminderDays')"
            style="width: 150px"
            allow-clear
          >
            <Select.Option value="1">1天</Select.Option>
            <Select.Option value="3">3天</Select.Option>
            <Select.Option value="7">7天</Select.Option>
            <Select.Option value="15">15天</Select.Option>
            <Select.Option value="30">30天</Select.Option>
          </Select>
        </FormItem>

        <FormItem :label="$t('page.legalPlatform.startDate')">
          <DatePicker
            v-model:value="filterForm.startDate"
            :placeholder="$t('page.legalPlatform.startDate')"
            style="width: 150px"
          />
        </FormItem>

        <FormItem :label="$t('page.legalPlatform.endDate')">
          <DatePicker
            v-model:value="filterForm.endDate"
            :placeholder="$t('page.legalPlatform.endDate')"
            style="width: 150px"
          />
        </FormItem>

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
                <span class="icon-[lucide--refresh-cw] size-4" />
              </template>
              {{ $t('page.legalPlatform.reset') }}
            </Button>
          </Space>
        </FormItem>
      </Form>
    </div>

    <!-- 統計概覽 -->
    <div class="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="p-4 bg-white rounded-lg shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">{{ $t('page.legalPlatform.upcomingDeadlines') }}</p>
            <p class="text-2xl font-bold text-orange-600">{{ statistics.upcomingCount }}</p>
          </div>
          <span class="icon-[lucide--clock] size-8 text-orange-500" />
        </div>
      </div>

      <div class="p-4 bg-white rounded-lg shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">{{ $t('page.legalPlatform.overdueProjects') }}</p>
            <p class="text-2xl font-bold text-red-600">{{ statistics.overdueCount }}</p>
          </div>
          <span class="icon-[lucide--alert-triangle] size-8 text-red-500" />
        </div>
      </div>

      <div class="p-4 bg-white rounded-lg shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">{{ $t('page.legalPlatform.normal') }}</p>
            <p class="text-2xl font-bold text-green-600">{{ statistics.normalCount }}</p>
          </div>
          <span class="icon-[lucide--check-circle] size-8 text-green-500" />
        </div>
      </div>

      <div class="p-4 bg-white rounded-lg shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">{{ $t('page.legalPlatform.critical') }}</p>
            <p class="text-2xl font-bold text-purple-600">{{ statistics.criticalCount }}</p>
          </div>
          <span class="icon-[lucide--zap] size-8 text-purple-500" />
        </div>
      </div>
    </div>

    <!-- 項目截止日期管理表格 -->
    <div class="bg-white rounded-lg shadow">
      <div class="p-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900">
            {{ $t('page.legalPlatform.deadlineManagement') }}
          </h2>
          <Space>
            <Button @click="handleExport">
              <template #icon>
                <span class="icon-[lucide--download] size-4" />
              </template>
              {{ $t('page.legalPlatform.exportReport') }}
            </Button>
            <Button @click="handleRefresh">
              <template #icon>
                <span class="icon-[lucide--refresh-cw] size-4" />
              </template>
              {{ $t('page.legalPlatform.refreshData') }}
            </Button>
          </Space>
        </div>
      </div>

      <div class="p-4">
        <Table
          :columns="columns"
          :data-source="projectList"
          :loading="loading"
          :pagination="{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 項，共 ${total} 項`,
          }"
          @change="handleTableChange"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'deadlineStatus'">
              <Tag :color="getDeadlineStatusColor(record.deadlineStatus)">
                {{ getDeadlineStatusText(record.deadlineStatus) }}
              </Tag>
            </template>
            <template v-else-if="column.key === 'daysRemaining'">
              <span :class="getDaysRemainingClass(record.daysRemaining)">
                {{ formatDaysRemaining(record.daysRemaining) }}
              </span>
            </template>
            <template v-else-if="column.key === 'projectDeadline'">
              <div class="flex items-center space-x-2">
                <span>{{ record.projectDeadline }}</span>
                <Button
                  v-if="record.canModifyDeadline"
                  type="link"
                  size="small"
                  @click="handleModifyDeadline(record)"
                >
                  <template #icon>
                    <span class="icon-[lucide--edit] size-3" />
                  </template>
                </Button>
              </div>
            </template>
            <template v-else-if="column.key === 'action'">
              <Space>
                <Button type="link" size="small" @click="handleViewDetails(record)">
                  {{ $t('page.legalPlatform.viewDetails') }}
                </Button>
                <Button
                  v-if="record.canModifyDeadline"
                  type="link"
                  size="small"
                  @click="handleModifyDeadline(record)"
                >
                  {{ $t('page.legalPlatform.modifyDeadline') }}
                </Button>
                <Button type="link" size="small" @click="handleViewHistory(record)">
                  {{ $t('page.legalPlatform.deadlineHistory') }}
                </Button>
              </Space>
            </template>
          </template>
        </Table>
      </div>
    </div>

    <!-- 修改截止日期彈窗 -->
    <Modal
      v-model:open="modifyModalVisible"
      :title="$t('page.legalPlatform.modifyDeadline')"
      width="600px"
      @ok="handleModifyConfirm"
      @cancel="handleModifyCancel"
    >
      <Form :model="modifyForm" layout="vertical">
        <FormItem :label="$t('page.legalPlatform.projectName')">
          <Input v-model:value="modifyForm.projectName" disabled />
        </FormItem>
        
        <FormItem :label="$t('page.legalPlatform.originalDeadline')">
          <Input v-model:value="modifyForm.originalDeadline" disabled />
        </FormItem>
        
        <FormItem :label="$t('page.legalPlatform.newDeadline')" required>
          <DatePicker
            v-model:value="modifyForm.newDeadline"
            :placeholder="$t('page.legalPlatform.newDeadline')"
            style="width: 100%"
          />
        </FormItem>
        
        <FormItem :label="$t('page.legalPlatform.modificationReason')" required>
          <Select
            v-model:value="modifyForm.reason"
            :placeholder="$t('page.legalPlatform.modificationReason')"
            style="width: 100%"
          >
            <Select.Option value="urgent">{{ $t('page.legalPlatform.urgentModification') }}</Select.Option>
            <Select.Option value="planned">{{ $t('page.legalPlatform.plannedModification') }}</Select.Option>
            <Select.Option value="client">{{ $t('page.legalPlatform.clientRequest') }}</Select.Option>
            <Select.Option value="resource">{{ $t('page.legalPlatform.resourceConstraint') }}</Select.Option>
            <Select.Option value="scope">{{ $t('page.legalPlatform.scopeChange') }}</Select.Option>
            <Select.Option value="other">{{ $t('page.legalPlatform.otherReason') }}</Select.Option>
          </Select>
        </FormItem>
        
        <FormItem :label="$t('page.legalPlatform.deadlineReason')">
          <Input.TextArea
            v-model:value="modifyForm.reasonDetail"
            :placeholder="$t('page.legalPlatform.deadlineReason')"
            :rows="3"
          />
        </FormItem>
      </Form>
    </Modal>

    <!-- 截止日期修改歷史彈窗 -->
    <Modal
      v-model:open="historyModalVisible"
      :title="$t('page.legalPlatform.deadlineHistory')"
      width="800px"
      :footer="null"
    >
      <Table
        :columns="historyColumns"
        :data-source="historyList"
        :pagination="false"
        size="small"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'modificationType'">
            <Tag :color="record.modificationType === 'extension' ? 'orange' : 'blue'">
              {{ record.modificationType === 'extension' ? $t('page.legalPlatform.deadlineExtension') : $t('page.legalPlatform.deadlineAdvance') }}
            </Tag>
          </template>
        </template>
      </Table>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import {
  Button,
  Form,
  FormItem,
  Input,
  Select,
  Space,
  Table,
  Tag,
  DatePicker,
  Modal,
  message,
} from 'ant-design-vue';

// 響應式數據
const loading = ref(false);
const modifyModalVisible = ref(false);
const historyModalVisible = ref(false);

// 篩選表單
const filterForm = reactive({
  projectType: undefined,
  deadlineStatus: undefined,
  reminderDays: undefined,
  startDate: undefined,
  endDate: undefined,
});

// 修改表單
const modifyForm = reactive({
  projectId: '',
  projectName: '',
  originalDeadline: '',
  newDeadline: undefined,
  reason: undefined,
  reasonDetail: '',
});

// 統計數據
const statistics = reactive({
  upcomingCount: 12,
  overdueCount: 3,
  normalCount: 45,
  criticalCount: 2,
});

// 分頁
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
});

// 項目列表
const projectList = ref([
  {
    id: '1',
    projectName: '法案審查項目A',
    projectType: 'bill',
    projectDeadline: '2024-02-15',
    deadlineStatus: 'warning',
    daysRemaining: 3,
    assignee: '張三',
    canModifyDeadline: true,
  },
  {
    id: '2',
    projectName: '一般法律事務B',
    projectType: 'general',
    projectDeadline: '2024-02-10',
    deadlineStatus: 'overdue',
    daysRemaining: -2,
    assignee: '李四',
    canModifyDeadline: true,
  },
  {
    id: '3',
    projectName: '合同審核項目C',
    projectType: 'other',
    projectDeadline: '2024-03-01',
    deadlineStatus: 'normal',
    daysRemaining: 18,
    assignee: '王五',
    canModifyDeadline: false,
  },
]);

// 修改歷史列表
const historyList = ref([
  {
    id: '1',
    originalDeadline: '2024-02-10',
    newDeadline: '2024-02-15',
    modificationType: 'extension',
    reason: '客戶要求',
    modifier: '張三',
    modifyTime: '2024-01-20 10:30:00',
  },
]);

// 表格列配置
const columns = [
  {
    title: '項目名稱',
    dataIndex: 'projectName',
    key: 'projectName',
    width: 200,
  },
  {
    title: '項目類型',
    dataIndex: 'projectType',
    key: 'projectType',
    width: 120,
    customRender: ({ text }: any) => {
      const typeMap: Record<string, string> = {
        general: '一般項目',
        bill: '法案項目',
        other: '其他',
      };
      return typeMap[text] || text;
    },
  },
  {
    title: '截止日期',
    dataIndex: 'projectDeadline',
    key: 'projectDeadline',
    width: 150,
  },
  {
    title: '截止狀態',
    dataIndex: 'deadlineStatus',
    key: 'deadlineStatus',
    width: 120,
  },
  {
    title: '剩餘/逾期天數',
    dataIndex: 'daysRemaining',
    key: 'daysRemaining',
    width: 150,
  },
  {
    title: '負責人',
    dataIndex: 'assignee',
    key: 'assignee',
    width: 100,
  },
  {
    title: '操作',
    key: 'action',
    width: 200,
  },
];

// 歷史記錄表格列配置
const historyColumns = [
  {
    title: '原截止日期',
    dataIndex: 'originalDeadline',
    key: 'originalDeadline',
  },
  {
    title: '新截止日期',
    dataIndex: 'newDeadline',
    key: 'newDeadline',
  },
  {
    title: '修改類型',
    dataIndex: 'modificationType',
    key: 'modificationType',
  },
  {
    title: '修改原因',
    dataIndex: 'reason',
    key: 'reason',
  },
  {
    title: '修改人',
    dataIndex: 'modifier',
    key: 'modifier',
  },
  {
    title: '修改時間',
    dataIndex: 'modifyTime',
    key: 'modifyTime',
  },
];

// 方法
const handleFilter = () => {
  console.log('篩選', filterForm);
  loadData();
};

const handleReset = () => {
  Object.assign(filterForm, {
    projectType: undefined,
    deadlineStatus: undefined,
    reminderDays: undefined,
    startDate: undefined,
    endDate: undefined,
  });
  loadData();
};

const handleExport = () => {
  message.success('導出成功');
};

const handleRefresh = () => {
  loadData();
};

const handleTableChange = (pag: any) => {
  pagination.current = pag.current;
  pagination.pageSize = pag.pageSize;
  loadData();
};

const handleViewDetails = (record: any) => {
  console.log('查看詳情', record);
};

const handleModifyDeadline = (record: any) => {
  modifyForm.projectId = record.id;
  modifyForm.projectName = record.projectName;
  modifyForm.originalDeadline = record.projectDeadline;
  modifyForm.newDeadline = undefined;
  modifyForm.reason = undefined;
  modifyForm.reasonDetail = '';
  modifyModalVisible.value = true;
};

const handleModifyConfirm = () => {
  if (!modifyForm.newDeadline || !modifyForm.reason) {
    message.error('請填寫完整信息');
    return;
  }
  
  console.log('修改截止日期', modifyForm);
  message.success('截止日期修改成功');
  modifyModalVisible.value = false;
  loadData();
};

const handleModifyCancel = () => {
  modifyModalVisible.value = false;
};

const handleViewHistory = (record: any) => {
  console.log('查看修改歷史', record);
  historyModalVisible.value = true;
};

const getDeadlineStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    normal: 'green',
    warning: 'orange',
    overdue: 'red',
    critical: 'purple',
  };
  return colorMap[status] || 'default';
};

const getDeadlineStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    normal: '正常',
    warning: '警告',
    overdue: '逾期',
    critical: '緊急',
  };
  return textMap[status] || status;
};

const getDaysRemainingClass = (days: number) => {
  if (days < 0) return 'text-red-600 font-bold';
  if (days <= 3) return 'text-orange-600 font-bold';
  if (days <= 7) return 'text-yellow-600';
  return 'text-green-600';
};

const formatDaysRemaining = (days: number) => {
  if (days < 0) return `逾期 ${Math.abs(days)} 天`;
  return `剩餘 ${days} 天`;
};

const loadData = () => {
  loading.value = true;
  // 模擬API調用
  setTimeout(() => {
    pagination.total = projectList.value.length;
    loading.value = false;
  }, 500);
};

// 組件掛載時初始化數據
onMounted(() => {
  loadData();
});
</script>

<style scoped>
/* 自定義樣式 */
</style>