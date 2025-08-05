<template>
  <div class="personnel-workload-statistics">
    <!-- 頁面標題 -->
    <div class="page-header">
      <h2>{{ $t('page.legalPlatform.personnelWorkloadStatistics') }}</h2>
    </div>

    <!-- 篩選表單 -->
    <div class="filter-form">
      <a-card :bordered="false" class="mb-4">
        <a-form layout="inline" :model="filterForm" @finish="handleSearch">
          <a-form-item :label="$t('page.legalPlatform.department')" name="department">
            <a-select
              v-model:value="filterForm.department"
              :placeholder="$t('page.legalPlatform.department')"
              style="width: 150px"
              allow-clear
            >
              <a-select-option value="legal">法務部</a-select-option>
              <a-select-option value="admin">行政部</a-select-option>
              <a-select-option value="finance">財務部</a-select-option>
              <a-select-option value="hr">人事部</a-select-option>
            </a-select>
          </a-form-item>



          <a-form-item :label="$t('page.legalPlatform.reportPeriod')" name="period">
            <a-range-picker
              v-model:value="filterForm.dateRange"
              :placeholder="[$t('page.legalPlatform.startDate'), $t('page.legalPlatform.endDate')]"
              style="width: 250px"
            />
          </a-form-item>

          <a-form-item>
            <a-button type="primary" html-type="submit" :icon="h(Search)">
              {{ $t('page.legalPlatform.search') }}
            </a-button>
            <a-button class="ml-2" @click="handleReset" :icon="h(RotateCw)">
              {{ $t('page.legalPlatform.reset') }}
            </a-button>
          </a-form-item>
        </a-form>
      </a-card>
    </div>



    <!-- 功能按鈕 -->
    <div class="action-buttons mb-4">
      <a-space>
        <a-button type="primary" @click="showWorkEntryModal" :icon="h(Plus)">
          {{ $t('page.legalPlatform.addWorkEntry') }}
        </a-button>
        <a-button @click="handleExport">
          <span class="icon-[lucide--download] size-4" />
          {{ $t('page.legalPlatform.exportWorkload') }}
        </a-button>
        <a-button @click="handleGenerateReport">
          <span class="icon-[lucide--file-text] size-4" />
          {{ $t('page.legalPlatform.generateReport') }}
        </a-button>
        <a-button @click="handleRefresh" :icon="h(RotateCw)">
          {{ $t('page.legalPlatform.refreshData') }}
        </a-button>
      </a-space>
    </div>

    <!-- 人員工作量統計表 -->
    <div class="workload-table">
      <a-card :bordered="false">
        <template #title>
          <span>{{ $t('page.legalPlatform.personnelWorkloadReport') }}</span>
        </template>
        
        <a-table
          :columns="workloadColumns"
          :data-source="workloadData"
          :loading="loading"
          :pagination="pagination"
          :scroll="{ x: 1200 }"
          row-key="id"
          @change="handleTableChange"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'completionRate'">
              <a-progress
                :percent="record.completionRate"
                :status="record.completionRate >= 80 ? 'success' : record.completionRate >= 60 ? 'normal' : 'exception'"
                size="small"
              />
            </template>

            <template v-else-if="column.key === 'action'">
              <a-space>
                <a-button type="link" size="small" @click="viewWorkDetails(record)">
                  {{ $t('page.legalPlatform.viewDetails') }}
                </a-button>
                <a-button type="link" size="small" @click="editWorkEntry(record)">
                  {{ $t('page.legalPlatform.editWorkEntry') }}
                </a-button>
                <a-popconfirm
                  :title="$t('page.legalPlatform.confirmDelete')"
                  @confirm="deleteWorkEntry(record)"
                >
                  <a-button type="link" size="small" danger>
                    {{ $t('page.legalPlatform.delete') }}
                  </a-button>
                </a-popconfirm>
              </a-space>
            </template>
          </template>
        </a-table>
      </a-card>
    </div>

    <!-- 工作記錄抽屜 -->
    <a-drawer
      v-model:open="workEntryDrawerVisible"
      :title="workEntryModalTitle"
      width="800px"
      placement="right"
      @close="handleWorkEntryCancel"
    >
      <div class="drawer-content">
        <a-form
        ref="workEntryFormRef"
        :model="workEntryForm"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-form-item
          :label="$t('page.legalPlatform.personnelName')"
          name="personnelName"
          :rules="[{ required: true, message: $t('page.legalPlatform.personnelName') + '不能為空' }]"
        >
          <a-input v-model:value="workEntryForm.personnelName" :placeholder="$t('page.legalPlatform.personnelName')" />
        </a-form-item>

        <a-form-item
          :label="$t('page.legalPlatform.department')"
          name="department"
          :rules="[{ required: true, message: $t('page.legalPlatform.department') + '不能為空' }]"
        >
          <a-select v-model:value="workEntryForm.department" :placeholder="$t('page.legalPlatform.department')">
            <a-select-option value="legal">法務部</a-select-option>
            <a-select-option value="admin">行政部</a-select-option>
            <a-select-option value="finance">財務部</a-select-option>
            <a-select-option value="hr">人事部</a-select-option>
          </a-select>
        </a-form-item>



        <a-form-item
          :label="$t('page.legalPlatform.workCategory')"
          name="workCategory"
          :rules="[{ required: true, message: $t('page.legalPlatform.workCategory') + '不能為空' }]"
        >
          <a-select v-model:value="workEntryForm.workCategory" :placeholder="$t('page.legalPlatform.workCategory')">
            <a-select-option value="project">{{ $t('page.legalPlatform.projectWork') }}</a-select-option>
            <a-select-option value="administrative">{{ $t('page.legalPlatform.administrativeWork') }}</a-select-option>
            <a-select-option value="meeting">{{ $t('page.legalPlatform.meetingWork') }}</a-select-option>
            <a-select-option value="training">{{ $t('page.legalPlatform.trainingWork') }}</a-select-option>
            <a-select-option value="research">{{ $t('page.legalPlatform.researchWork') }}</a-select-option>
            <a-select-option value="other">{{ $t('page.legalPlatform.otherWork') }}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          :label="$t('page.legalPlatform.workDate')"
          name="workDate"
          :rules="[{ required: true, message: $t('page.legalPlatform.workDate') + '不能為空' }]"
        >
          <a-date-picker v-model:value="workEntryForm.workDate" :placeholder="$t('page.legalPlatform.workDate')" style="width: 100%" />
        </a-form-item>

        <a-form-item
          :label="$t('page.legalPlatform.workTime')"
          name="workTime"
          :rules="[{ required: true, message: $t('page.legalPlatform.workTime') + '不能為空' }]"
        >
          <a-time-range-picker
            v-model:value="workEntryForm.workTime"
            :placeholder="[$t('page.legalPlatform.workStartTime'), $t('page.legalPlatform.workEndTime')]"
            style="width: 100%"
          />
        </a-form-item>

        <a-form-item
          :label="$t('page.legalPlatform.workHours')"
          name="workHours"
          :rules="[{ required: true, message: $t('page.legalPlatform.workHours') + '不能為空' }]"
        >
          <a-input-number
            v-model:value="workEntryForm.workHours"
            :placeholder="$t('page.legalPlatform.workHours')"
            :min="0"
            :max="24"
            :step="0.5"
            style="width: 100%"
          />
        </a-form-item>

        <a-form-item
          :label="$t('page.legalPlatform.workDescription')"
          name="workDescription"
          :rules="[{ required: true, message: $t('page.legalPlatform.workDescription') + '不能為空' }]"
        >
          <a-textarea
            v-model:value="workEntryForm.workDescription"
            :placeholder="$t('page.legalPlatform.workDescription')"
            :rows="4"
          />
        </a-form-item>

        <a-form-item
          :label="$t('page.legalPlatform.workLocation')"
          name="workLocation"
        >
          <a-input v-model:value="workEntryForm.workLocation" :placeholder="$t('page.legalPlatform.workLocation')" />
        </a-form-item>

        <a-form-item
          :label="$t('page.legalPlatform.workResult')"
          name="workResult"
        >
          <a-textarea
            v-model:value="workEntryForm.workResult"
            :placeholder="$t('page.legalPlatform.workResult')"
            :rows="3"
          />
        </a-form-item>

        <a-form-item
          :label="$t('page.legalPlatform.workNotes')"
          name="workNotes"
        >
          <a-textarea
            v-model:value="workEntryForm.workNotes"
            :placeholder="$t('page.legalPlatform.workNotes')"
            :rows="3"
          />
        </a-form-item>
        </a-form>
      </div>
      
      <!-- 底部按鈕區域 -->
      <div class="drawer-footer">
        <a-space>
          <a-button @click="handleWorkEntryCancel">取消</a-button>
          <a-button type="primary" @click="handleWorkEntrySubmit">確定</a-button>
        </a-space>
      </div>
    </a-drawer>

    <!-- 工作詳情抽屜 -->
    <a-drawer
      v-model:open="workDetailDrawerVisible"
      :title="$t('page.legalPlatform.workEntryDetail')"
      width="800px"
      placement="right"
    >
      <a-descriptions :column="2" bordered>
        <a-descriptions-item :label="$t('page.legalPlatform.personnelName')">
          {{ selectedWorkDetail.personnelName }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('page.legalPlatform.department')">
          {{ selectedWorkDetail.department }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('page.legalPlatform.workHours')">
          {{ selectedWorkDetail.workHours }} 小時
        </a-descriptions-item>
        <a-descriptions-item :label="$t('page.legalPlatform.taskCount')">
          {{ selectedWorkDetail.taskCount }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('page.legalPlatform.completionRate')">
          {{ selectedWorkDetail.completionRate }}%
        </a-descriptions-item>

      </a-descriptions>
    </a-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, h, defineOptions } from 'vue'
import { useI18n } from 'vue-i18n'
import { 
  message,
  Card,
  Form,
  FormItem,
  Select,
  SelectOption,
  DatePicker,
  RangePicker,
  Button,
  Space,
  Row,
  Col,
  Statistic,
  Table,
  Progress,
  Tag,
  Popconfirm,
  Modal,
  Input,
  InputNumber,
  Textarea,
  TimePicker,
  Descriptions,
  DescriptionsItem,
  Drawer
} from 'ant-design-vue'
import { TimePicker as TimeRangePicker } from 'ant-design-vue'
import { Search, RotateCw, Plus } from '@vben/icons'
import type { TableColumnsType, TableProps } from 'ant-design-vue'
import dayjs from 'dayjs'

defineOptions({
  components: {
    ACard: Card,
    AForm: Form,
    AFormItem: FormItem,
    ASelect: Select,
    ASelectOption: SelectOption,
    ADatePicker: DatePicker,
    ARangePicker: RangePicker,
    AButton: Button,
    ASpace: Space,
    ARow: Row,
    ACol: Col,
    AStatistic: Statistic,
    ATable: Table,
    AProgress: Progress,
    ATag: Tag,
    APopconfirm: Popconfirm,
    AModal: Modal,
    AInput: Input,
    AInputNumber: InputNumber,
    ATextarea: Textarea,
    ATimePicker: TimePicker,
    ATimeRangePicker: RangePicker,
    ADescriptions: Descriptions,
    ADescriptionsItem: DescriptionsItem,
    ADrawer: Drawer
  }
})

const { t } = useI18n()

// 響應式數據
const loading = ref(false)
const workEntryDrawerVisible = ref(false)
const workDetailDrawerVisible = ref(false)
const workEntryFormRef = ref()
const isEdit = ref(false)

// 篩選表單
const filterForm = reactive({
  department: undefined,
  dateRange: undefined,
})

// 統計數據
const statisticsData = reactive({
  totalWorkload: 2856,
  totalPersonnel: 24,
  avgCompletionRate: 87.5,
  avgEfficiency: 92.3,
})

// 工作記錄表單
const workEntryForm = reactive({
  id: undefined,
  personnelName: '',
  department: undefined,
  workCategory: undefined,
  workDate: undefined,
  workTime: undefined,
  workHours: undefined,
  workDescription: '',
  workLocation: '',
  workResult: '',
  workNotes: '',
})

// 選中的工作詳情
const selectedWorkDetail = reactive({
  personnelName: '',
  department: '',
  workHours: 0,
  taskCount: 0,
  completionRate: 0,

})

// 分頁配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number, range: [number, number]) => 
    `第 ${range[0]}-${range[1]} 條，共 ${total} 條`,
})

// 表格列配置
const workloadColumns: TableColumnsType = [
  {
    title: t('page.legalPlatform.personnelName'),
    dataIndex: 'personnelName',
    key: 'personnelName',
    width: 120,
    fixed: 'left',
  },
  {
    title: t('page.legalPlatform.department'),
    dataIndex: 'department',
    key: 'department',
    width: 100,
  },

  {
    title: t('page.legalPlatform.workHours'),
    dataIndex: 'workHours',
    key: 'workHours',
    width: 100,
    sorter: true,
  },
  {
    title: t('page.legalPlatform.taskCount'),
    dataIndex: 'taskCount',
    key: 'taskCount',
    width: 100,
    sorter: true,
  },
  {
    title: t('page.legalPlatform.completionRate'),
    dataIndex: 'completionRate',
    key: 'completionRate',
    width: 150,
    sorter: true,
  },

  {
    title: t('page.legalPlatform.operation'),
    key: 'action',
    width: 200,
    fixed: 'right',
  },
]

// 模擬數據
const workloadData = ref([
  {
    id: 1,
    personnelName: 'João Silva',
    department: '法務部',

    workHours: 168,
    taskCount: 12,
    completionRate: 95,

  },
  {
    id: 2,
    personnelName: 'Maria Santos',
    department: '法務部',

    workHours: 152,
    taskCount: 10,
    completionRate: 88,

  },
  {
    id: 3,
    personnelName: 'Pedro Costa',
    department: '行政部',

    workHours: 140,
    taskCount: 8,
    completionRate: 75,

  },
  {
    id: 4,
    personnelName: 'Ana Ferreira',
    department: '財務部',

    workHours: 160,
    taskCount: 15,
    completionRate: 92,

  },
  {
    id: 5,
    personnelName: 'Carlos Oliveira',
    department: '人事部',
    workHours: 145,
    taskCount: 9,
    completionRate: 82,

  },
])

// 計算屬性
const workEntryModalTitle = computed(() => {
  return isEdit.value ? t('page.legalPlatform.editWorkEntry') : t('page.legalPlatform.addWorkEntry')
})

// 方法
const handleSearch = () => {
  loading.value = true
  // 模擬搜索
  setTimeout(() => {
    loading.value = false
    message.success(t('page.legalPlatform.searchCompleted'))
  }, 1000)
}

const handleReset = () => {
  Object.assign(filterForm, {
    department: undefined,
    dateRange: undefined,
  })
  handleSearch()
}

const handleTableChange: TableProps['onChange'] = (pag, filters, sorter) => {
  pagination.current = pag?.current || 1
  pagination.pageSize = pag?.pageSize || 10
  // 這裡可以添加排序和篩選邏輯
}



const showWorkEntryModal = () => {
  isEdit.value = false
  resetWorkEntryForm()
  workEntryDrawerVisible.value = true
}

const editWorkEntry = (record: any) => {
  isEdit.value = true
  Object.assign(workEntryForm, {
    id: record.id,
    personnelName: record.personnelName,
    department: record.department,
    workCategory: 'project',
    workDate: dayjs(),
    workTime: [dayjs('09:00', 'HH:mm'), dayjs('18:00', 'HH:mm')],
    workHours: record.workHours,
    workDescription: '項目相關工作',
    workLocation: '辦公室',
    workResult: '完成預期目標',
    workNotes: '工作順利進行',
  })
  workEntryDrawerVisible.value = true
}

const viewWorkDetails = (record: any) => {
  Object.assign(selectedWorkDetail, record)
  workDetailDrawerVisible.value = true
}

const deleteWorkEntry = (record: any) => {
  // 模擬刪除
  const index = workloadData.value.findIndex(item => item.id === record.id)
  if (index > -1) {
    workloadData.value.splice(index, 1)
    message.success(t('page.legalPlatform.deleteSuccess'))
  }
}

const handleWorkEntrySubmit = async () => {
  try {
    await workEntryFormRef.value.validate()
    // 模擬提交
    if (isEdit.value) {
      message.success(t('page.legalPlatform.workEntrySuccess'))
    } else {
      const newEntry = {
        id: Date.now(),
        personnelName: workEntryForm.personnelName,
        department: workEntryForm.department,
        workHours: workEntryForm.workHours,
        taskCount: Math.floor(Math.random() * 10) + 5,
        completionRate: Math.floor(Math.random() * 30) + 70,

      }
      workloadData.value.unshift(newEntry)
      message.success(t('page.legalPlatform.workEntrySuccess'))
    }
    workEntryDrawerVisible.value = false
    resetWorkEntryForm()
  } catch (error) {
    message.error(t('page.legalPlatform.workEntryError'))
  }
}

const handleWorkEntryCancel = () => {
  workEntryDrawerVisible.value = false
  resetWorkEntryForm()
}

const resetWorkEntryForm = () => {
  Object.assign(workEntryForm, {
    id: undefined,
    personnelName: '',
    department: undefined,
    workCategory: undefined,
    workDate: undefined,
    workTime: undefined,
    workHours: undefined,
    workDescription: '',
    workLocation: '',
    workResult: '',
    workNotes: '',
  })
  workEntryFormRef.value?.resetFields()
}

const handleExport = () => {
  message.info(t('page.legalPlatform.exportInDevelopment'))
}

const handleGenerateReport = () => {
  message.info('報表生成功能開發中...')
}

const handleRefresh = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    message.success(t('page.legalPlatform.refreshData'))
  }, 1000)
}

// 生命週期
onMounted(() => {
  pagination.total = workloadData.value.length
})
</script>

<style scoped>
.personnel-workload-statistics {
  padding: 16px;
}

.page-header {
  margin-bottom: 16px;
}

.page-header h2 {
  margin: 0;
  color: #1890ff;
  font-size: 24px;
  font-weight: 600;
}

.filter-form .ant-form-item {
  margin-bottom: 16px;
}

.statistics-overview .ant-card {
  text-align: center;
}

.action-buttons {
  display: flex;
  justify-content: flex-start;
}

.workload-table .ant-table {
  background: #fff;
}

.ml-2 {
  margin-left: 8px;
}

.mb-4 {
  margin-bottom: 16px;
}

.drawer-content {
  padding-bottom: 80px;
}

.drawer-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px 24px;
  border-top: 1px solid #f0f0f0;
  background: #fff;
  text-align: right;
}
</style>
