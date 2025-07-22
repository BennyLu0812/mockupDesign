<template>
  <div class="p-6">
    <!-- 頁面標題 -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">
        {{ $t('page.legalPlatform.projectDeadlineManagement') }}
      </h1>
      <p class="text-gray-600 mt-2">
        {{ $t('page.legalPlatform.projectDeadlineManagementDesc') }}
      </p>
    </div>

    <!-- 篩選表單 -->
    <div class="mb-6 p-4 bg-white rounded-lg shadow">
      <a-form layout="inline" :model="filterForm">
        <a-form-item :label="$t('page.legalPlatform.projectType')">
          <a-select
            v-model:value="filterForm.projectType"
            :placeholder="$t('page.legalPlatform.projectType')"
            style="width: 150px"
            allow-clear
          >
            <a-select-option value="general">{{ $t('page.legalPlatform.generalProject') }}</a-select-option>
            <a-select-option value="bill">{{ $t('page.legalPlatform.billProject') }}</a-select-option>
            <a-select-option value="other">{{ $t('page.legalPlatform.otherProject') }}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item :label="$t('page.legalPlatform.deadlineStatus')">
          <a-select
            v-model:value="filterForm.deadlineStatus"
            :placeholder="$t('page.legalPlatform.deadlineStatus')"
            style="width: 150px"
            allow-clear
          >
            <a-select-option value="normal">{{ $t('page.legalPlatform.normal') }}</a-select-option>
            <a-select-option value="warning">{{ $t('page.legalPlatform.warning') }}</a-select-option>
            <a-select-option value="overdue">{{ $t('page.legalPlatform.overdue') }}</a-select-option>
            <a-select-option value="critical">{{ $t('page.legalPlatform.critical') }}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item>
          <a-space>
            <a-button type="primary" @click="handleFilter">
              <template #icon>
                <span class="icon-[lucide--search] size-4" />
              </template>
              {{ $t('page.legalPlatform.search') }}
            </a-button>
            <a-button @click="handleReset">
              <template #icon>
                <span class="icon-[lucide--refresh-cw] size-4" />
              </template>
              {{ $t('page.legalPlatform.reset') }}
            </a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </div>

    <!-- 統計概覽 -->
    <div class="mb-6">
      <a-row :gutter="16">
        <a-col :span="6">
          <a-card class="text-center">
            <a-statistic
              :title="$t('page.legalPlatform.upcomingDeadlines')"
              :value="statistics.upcomingCount"
              :value-style="{ color: '#faad14' }"
            />
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card class="text-center">
            <a-statistic
              :title="$t('page.legalPlatform.overdueProjects')"
              :value="statistics.overdueCount"
              :value-style="{ color: '#ff4d4f' }"
            />
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card class="text-center">
            <a-statistic
              :title="$t('page.legalPlatform.normal')"
              :value="statistics.normalCount"
              :value-style="{ color: '#52c41a' }"
            />
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card class="text-center">
            <a-statistic
              :title="$t('page.legalPlatform.critical')"
              :value="statistics.criticalCount"
              :value-style="{ color: '#722ed1' }"
            />
          </a-card>
        </a-col>
      </a-row>
    </div>

    <!-- 項目截止日期管理表格 -->
    <div class="bg-white rounded-lg shadow">
      <div class="p-4 border-b border-gray-200">
        <div class="flex justify-between items-center">
          <h2 class="text-lg font-semibold text-gray-800">
            {{ $t('page.legalPlatform.deadlineManagement') }}
          </h2>
          <a-space>
            <a-button @click="handleExport">
              <template #icon>
                <span class="icon-[lucide--download] size-4" />
              </template>
              {{ $t('page.legalPlatform.exportReport') }}
            </a-button>
            <a-button @click="handleRefresh">
              <template #icon>
                <span class="icon-[lucide--refresh-cw] size-4" />
              </template>
              {{ $t('page.legalPlatform.refreshData') }}
            </a-button>
          </a-space>
        </div>
      </div>

      <div class="p-4">
        <a-table
          :columns="columns"
          :data-source="projectList"
          :loading="loading"
          :pagination="{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 條，共 ${total} 條`,
          }"
          @change="handleTableChange"
        />
      </div>
    </div>

    <!-- 修改截止日期彈窗 -->
    <a-modal
      v-model:open="modifyModalVisible"
      :title="$t('page.legalPlatform.modifyDeadline')"
      width="600px"
      @ok="handleModifyConfirm"
      @cancel="handleModifyCancel"
    >
      <a-form :model="modifyForm" layout="vertical">
        <a-form-item :label="$t('page.legalPlatform.projectName')">
          <a-input v-model:value="modifyForm.projectName" disabled />
        </a-form-item>
        
        <a-form-item :label="$t('page.legalPlatform.originalDeadline')">
          <a-input v-model:value="modifyForm.originalDeadline" disabled />
        </a-form-item>
        
        <a-form-item :label="$t('page.legalPlatform.newDeadline')" required>
          <a-date-picker
            v-model:value="modifyForm.newDeadline"
            :placeholder="$t('page.legalPlatform.newDeadline')"
            style="width: 100%"
          />
        </a-form-item>
        
        <a-form-item :label="$t('page.legalPlatform.modificationReason')" required>
          <a-select
            v-model:value="modifyForm.reason"
            :placeholder="$t('page.legalPlatform.modificationReason')"
            style="width: 100%"
          >
            <a-select-option value="urgent">{{ $t('page.legalPlatform.urgentModification') }}</a-select-option>
            <a-select-option value="planned">{{ $t('page.legalPlatform.plannedModification') }}</a-select-option>
            <a-select-option value="client">{{ $t('page.legalPlatform.clientRequest') }}</a-select-option>
            <a-select-option value="resource">{{ $t('page.legalPlatform.resourceConstraint') }}</a-select-option>
            <a-select-option value="scope">{{ $t('page.legalPlatform.scopeChange') }}</a-select-option>
            <a-select-option value="other">{{ $t('page.legalPlatform.otherReason') }}</a-select-option>
          </a-select>
        </a-form-item>
        
        <a-form-item :label="$t('page.legalPlatform.deadlineReason')">
          <a-textarea
            v-model:value="modifyForm.reasonDetail"
            :placeholder="$t('page.legalPlatform.deadlineReason')"
            :rows="3"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { message } from 'ant-design-vue'

const { t } = useI18n()

// 響應式數據
const loading = ref(false)
const modifyModalVisible = ref(false)

// 篩選表單
const filterForm = reactive({
  projectType: undefined,
  deadlineStatus: undefined,
})

// 修改表單
const modifyForm = reactive({
  projectId: '',
  projectName: '',
  originalDeadline: '',
  newDeadline: undefined,
  reason: undefined,
  reasonDetail: '',
})

// 統計數據
const statistics = reactive({
  upcomingCount: 12,
  overdueCount: 3,
  normalCount: 45,
  criticalCount: 2,
})

// 分頁
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
})

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
])

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
]

// 方法
const handleFilter = () => {
  console.log('篩選', filterForm)
  loadData()
}

const handleReset = () => {
  Object.assign(filterForm, {
    projectType: undefined,
    deadlineStatus: undefined,
  })
  loadData()
}

const handleExport = () => {
  message.success('導出成功')
}

const handleRefresh = () => {
  loadData()
}

const handleTableChange = (pag: any) => {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
  loadData()
}

const handleModifyDeadline = (record: any) => {
  modifyForm.projectId = record.id
  modifyForm.projectName = record.projectName
  modifyForm.originalDeadline = record.projectDeadline
  modifyForm.newDeadline = undefined
  modifyForm.reason = undefined
  modifyForm.reasonDetail = ''
  modifyModalVisible.value = true
}

const handleModifyConfirm = () => {
  if (!modifyForm.newDeadline || !modifyForm.reason) {
    message.error('請填寫完整信息')
    return
  }
  
  console.log('修改截止日期', modifyForm)
  message.success('截止日期修改成功')
  modifyModalVisible.value = false
  loadData()
}

const handleModifyCancel = () => {
  modifyModalVisible.value = false
}

const loadData = () => {
  loading.value = true
  // 模擬API調用
  setTimeout(() => {
    pagination.total = projectList.value.length
    loading.value = false
  }, 500)
}

// 組件掛載時初始化數據
onMounted(() => {
  loadData()
})
</script>

<style scoped>
/* 自定義樣式 */
</style>