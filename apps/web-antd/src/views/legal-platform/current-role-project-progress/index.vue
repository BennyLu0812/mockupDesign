<template>
  <div class="p-4">
    <!-- 頁面標題 -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">
        {{ $t('page.legalPlatform.currentRoleProjectProgress') }}
      </h1>
      <p class="text-gray-600 mt-2">
        {{ $t('page.legalPlatform.personalDashboard') }}
      </p>
    </div>

    <!-- 當前用戶信息 -->
    <Card class="mb-6">
      <div class="flex items-center space-x-4">
        <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
          <span class="icon-[lucide--user] size-8 text-blue-600" />
        </div>
        <div>
          <h2 class="text-xl font-semibold">{{ currentUser.name }}</h2>
          <p class="text-gray-600">{{ currentUser.role }} | {{ currentUser.department }}</p>
          <p class="text-sm text-gray-500">{{ $t('page.legalPlatform.currentRoleStatus') }}: {{ currentUser.status }}</p>
        </div>
      </div>
    </Card>

    <!-- 個人統計概覽 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <Statistic
          :title="$t('page.legalPlatform.participatingProjects')"
          :value="personalStats.participatingProjects"
          :value-style="{ color: '#1890ff' }"
        >
          <template #prefix>
            <span class="icon-[lucide--folder] size-4" />
          </template>
        </Statistic>
      </Card>
      
      <Card>
        <Statistic
          :title="$t('page.legalPlatform.assignedTasks')"
          :value="personalStats.assignedTasks"
          :value-style="{ color: '#52c41a' }"
        >
          <template #prefix>
            <span class="icon-[lucide--clipboard-list] size-4" />
          </template>
        </Statistic>
      </Card>
      
      <Card>
        <Statistic
          :title="$t('page.legalPlatform.completedTasks')"
          :value="personalStats.completedTasks"
          :value-style="{ color: '#3f8600' }"
        >
          <template #prefix>
            <span class="icon-[lucide--check-circle] size-4" />
          </template>
        </Statistic>
      </Card>
      
      <Card>
        <Statistic
          :title="$t('page.legalPlatform.overdueItems')"
          :value="personalStats.overdueItems"
          :value-style="{ color: '#ff4d4f' }"
        >
          <template #prefix>
            <span class="icon-[lucide--alert-circle] size-4" />
          </template>
        </Statistic>
      </Card>
    </div>

    <!-- 篩選表單 -->
    <Card class="mb-6">
      <Form layout="inline" :model="filterForm" class="mb-4">
        <FormItem :label="$t('page.legalPlatform.projectType')">
          <Select v-model:value="filterForm.projectType" style="width: 150px" allow-clear @change="handleProjectTypeChange">
            <SelectOption value="general">{{ $t('page.legalPlatform.generalProject') }}</SelectOption>
            <SelectOption value="bill">{{ $t('page.legalPlatform.billProject') }}</SelectOption>
            <SelectOption value="other">{{ $t('page.legalPlatform.otherProject') }}</SelectOption>
          </Select>
        </FormItem>
        
        <FormItem :label="$t('page.legalPlatform.status')">
          <Select v-model:value="filterForm.status" style="width: 150px" allow-clear @change="handleStatusChange">
            <SelectOption value="inProgress">{{ $t('page.legalPlatform.inProgress') }}</SelectOption>
            <SelectOption value="completed">{{ $t('page.legalPlatform.completed') }}</SelectOption>
            <SelectOption value="pending">{{ $t('page.legalPlatform.pending') }}</SelectOption>
          </Select>
        </FormItem>
        
        <FormItem :label="$t('page.legalPlatform.taskPriority')">
          <Select v-model:value="filterForm.priority" style="width: 120px" allow-clear @change="handlePriorityChange">
            <SelectOption value="high">{{ $t('page.legalPlatform.high') }}</SelectOption>
            <SelectOption value="medium">{{ $t('page.legalPlatform.medium') }}</SelectOption>
            <SelectOption value="low">{{ $t('page.legalPlatform.low') }}</SelectOption>
          </Select>
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

    <!-- 我的項目進度表 -->
    <Card :title="$t('page.legalPlatform.myProjectsProgress')" class="mb-6">
      <Table
        :columns="projectColumns"
        :data-source="projectData"
        :pagination="{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} / ${total}`,
        }"
        @change="handleTableChange"
        :scroll="{ x: 1400 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'projectType'">
            <Tag :color="getProjectTypeColor(record.projectType)">
              {{ getProjectTypeText(record.projectType) }}
            </Tag>
          </template>
          
          <template v-else-if="column.key === 'status'">
            <Tag :color="getStatusColor(record.status)">
              {{ getStatusText(record.status) }}
            </Tag>
          </template>
          
          <template v-else-if="column.key === 'progress'">
            <Progress
              :percent="record.progress"
              :stroke-color="getProgressColor(record.progress)"
              size="small"
            />
          </template>
          
          <template v-else-if="column.key === 'priority'">
            <Tag :color="getPriorityColor(record.priority)">
              {{ getPriorityText(record.priority) }}
            </Tag>
          </template>
          
          <template v-else-if="column.key === 'myRole'">
            <Tag color="blue">
              {{ getRoleText(record.myRole) }}
            </Tag>
          </template>
          
          <template v-else-if="column.key === 'action'">
            <Space>
              <Button type="link" size="small" @click="handleViewProject(record)">
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

    <!-- 我的任務狀態 -->
    <Card :title="$t('page.legalPlatform.myTasksStatus')" class="mb-6">
      <Table
        :columns="taskColumns"
        :data-source="taskData"
        :pagination="{
          current: taskPagination.current,
          pageSize: taskPagination.pageSize,
          total: taskPagination.total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} / ${total}`,
        }"
        @change="handleTaskTableChange"
        :scroll="{ x: 1200 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <Tag :color="getStatusColor(record.status)">
              {{ getStatusText(record.status) }}
            </Tag>
          </template>
          
          <template v-else-if="column.key === 'priority'">
            <Tag :color="getPriorityColor(record.priority)">
              {{ getPriorityText(record.priority) }}
            </Tag>
          </template>
          
          <template v-else-if="column.key === 'progress'">
            <Progress
              :percent="record.progress"
              :stroke-color="getProgressColor(record.progress)"
              size="small"
            />
          </template>
          
          <template v-else-if="column.key === 'action'">
            <Space>
              <Button type="link" size="small" @click="handleViewTask(record)">
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

    <!-- 個人績效圖表 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card :title="$t('page.legalPlatform.personalProgressChart')">
        <div class="h-80 flex items-center justify-center text-gray-500">
          <div class="text-center">
            <span class="icon-[lucide--line-chart] size-12 mb-2 block mx-auto" />
            <p>{{ $t('page.legalPlatform.personalProgressChart') }}</p>
            <p class="text-sm">個人進度趨勢圖</p>
          </div>
        </div>
      </Card>
      
      <Card :title="$t('page.legalPlatform.workloadAnalysis')">
        <div class="h-80 flex items-center justify-center text-gray-500">
          <div class="text-center">
            <span class="icon-[lucide--pie-chart] size-12 mb-2 block mx-auto" />
            <p>{{ $t('page.legalPlatform.workloadAnalysis') }}</p>
            <p class="text-sm">個人工作量分析圖</p>
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
  Button,
  Space,
  Table,
  Statistic,
  Progress,
  Tag,
  message,
} from 'ant-design-vue';
import type { TableColumnsType } from 'ant-design-vue';

// 當前用戶信息
const currentUser = reactive({
  name: '陳大文',
  role: '項目負責人',
  department: '法務部',
  status: '在線',
});

// 個人統計數據
const personalStats = reactive({
  participatingProjects: 8,
  assignedTasks: 24,
  completedTasks: 18,
  overdueItems: 2,
});

// 篩選表單
const filterForm = reactive({
  projectType: undefined,
  status: undefined,
  priority: undefined,
});

// 分頁配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 8,
});

const taskPagination = reactive({
  current: 1,
  pageSize: 10,
  total: 24,
});

// 項目表格列配置
const projectColumns: TableColumnsType = [
  {
    title: '項目名稱',
    dataIndex: 'projectName',
    key: 'projectName',
    width: 200,
    fixed: 'left',
  },
  {
    title: '項目類型',
    dataIndex: 'projectType',
    key: 'projectType',
    width: 100,
    align: 'center',
  },
  {
    title: '狀態',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    align: 'center',
  },
  {
    title: '我的角色',
    dataIndex: 'myRole',
    key: 'myRole',
    width: 120,
    align: 'center',
  },
  {
    title: '項目進度',
    dataIndex: 'progress',
    key: 'progress',
    width: 150,
    align: 'center',
  },
  {
    title: '我的任務數',
    dataIndex: 'myTaskCount',
    key: 'myTaskCount',
    width: 100,
    align: 'center',
  },
  {
    title: '已完成任務',
    dataIndex: 'completedTasks',
    key: 'completedTasks',
    width: 100,
    align: 'center',
  },
  {
    title: '開始時間',
    dataIndex: 'startDate',
    key: 'startDate',
    width: 120,
    align: 'center',
  },
  {
    title: '截止時間',
    dataIndex: 'endDate',
    key: 'endDate',
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

// 任務表格列配置
const taskColumns: TableColumnsType = [
  {
    title: '任務名稱',
    dataIndex: 'taskName',
    key: 'taskName',
    width: 200,
    fixed: 'left',
  },
  {
    title: '所屬項目',
    dataIndex: 'projectName',
    key: 'projectName',
    width: 150,
  },
  {
    title: '狀態',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    align: 'center',
  },
  {
    title: '優先級',
    dataIndex: 'priority',
    key: 'priority',
    width: 100,
    align: 'center',
  },
  {
    title: '進度',
    dataIndex: 'progress',
    key: 'progress',
    width: 150,
    align: 'center',
  },
  {
    title: '開始時間',
    dataIndex: 'startDate',
    key: 'startDate',
    width: 120,
    align: 'center',
  },
  {
    title: '截止時間',
    dataIndex: 'dueDate',
    key: 'dueDate',
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

// 項目數據
const projectData = ref([
  {
    key: '1',
    projectName: '法律條文修訂項目',
    projectType: 'bill',
    status: 'inProgress',
    myRole: 'leader',
    progress: 75,
    myTaskCount: 5,
    completedTasks: 3,
    startDate: '2024-01-15',
    endDate: '2024-03-15',
  },
  {
    key: '2',
    projectName: '合同審查項目',
    projectType: 'general',
    status: 'inProgress',
    myRole: 'member',
    progress: 60,
    myTaskCount: 3,
    completedTasks: 2,
    startDate: '2024-02-01',
    endDate: '2024-04-01',
  },
  {
    key: '3',
    projectName: '法規諮詢項目',
    projectType: 'other',
    status: 'completed',
    myRole: 'observer',
    progress: 100,
    myTaskCount: 2,
    completedTasks: 2,
    startDate: '2023-12-01',
    endDate: '2024-01-31',
  },
]);

// 任務數據
const taskData = ref([
  {
    key: '1',
    taskName: '條文第三章修訂',
    projectName: '法律條文修訂項目',
    status: 'inProgress',
    priority: 'high',
    progress: 80,
    startDate: '2024-01-20',
    dueDate: '2024-02-20',
  },
  {
    key: '2',
    taskName: '合同條款審查',
    projectName: '合同審查項目',
    status: 'pending',
    priority: 'medium',
    progress: 30,
    startDate: '2024-02-05',
    dueDate: '2024-02-25',
  },
  {
    key: '3',
    taskName: '法規解釋文件',
    projectName: '法規諮詢項目',
    status: 'completed',
    priority: 'low',
    progress: 100,
    startDate: '2023-12-15',
    dueDate: '2024-01-15',
  },
]);

// 獲取項目類型顏色
const getProjectTypeColor = (type: string) => {
  switch (type) {
    case 'general':
      return 'blue';
    case 'bill':
      return 'green';
    case 'other':
      return 'orange';
    default:
      return 'default';
  }
};

// 獲取項目類型文本
const getProjectTypeText = (type: string) => {
  switch (type) {
    case 'general':
      return '一般項目';
    case 'bill':
      return '法案項目';
    case 'other':
      return '其他';
    default:
      return '未知';
  }
};

// 獲取狀態顏色
const getStatusColor = (status: string) => {
  switch (status) {
    case 'inProgress':
      return 'processing';
    case 'completed':
      return 'success';
    case 'pending':
      return 'warning';
    case 'cancelled':
      return 'error';
    default:
      return 'default';
  }
};

// 獲取狀態文本
const getStatusText = (status: string) => {
  switch (status) {
    case 'inProgress':
      return '進行中';
    case 'completed':
      return '已完成';
    case 'pending':
      return '待處理';
    case 'cancelled':
      return '已取消';
    default:
      return '未知';
  }
};

// 獲取優先級顏色
const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'red';
    case 'medium':
      return 'orange';
    case 'low':
      return 'green';
    default:
      return 'default';
  }
};

// 獲取優先級文本
const getPriorityText = (priority: string) => {
  switch (priority) {
    case 'high':
      return '高';
    case 'medium':
      return '中';
    case 'low':
      return '低';
    default:
      return '未知';
  }
};

// 獲取角色文本
const getRoleText = (role: string) => {
  switch (role) {
    case 'leader':
      return '項目負責人';
    case 'member':
      return '項目成員';
    case 'observer':
      return '觀察者';
    default:
      return '未知';
  }
};

// 獲取進度條顏色
const getProgressColor = (progress: number) => {
  if (progress >= 80) return '#52c41a';
  if (progress >= 60) return '#faad14';
  return '#ff4d4f';
};

// 處理項目類型變更
const handleProjectTypeChange = () => {
  loadProjectData();
};

// 處理狀態變更
const handleStatusChange = () => {
  loadProjectData();
};

// 處理優先級變更
const handlePriorityChange = () => {
  loadTaskData();
};

// 處理搜索
const handleSearch = () => {
  pagination.current = 1;
  taskPagination.current = 1;
  loadProjectData();
  loadTaskData();
};

// 處理重置
const handleReset = () => {
  filterForm.projectType = undefined;
  filterForm.status = undefined;
  filterForm.priority = undefined;
  pagination.current = 1;
  taskPagination.current = 1;
  loadProjectData();
  loadTaskData();
};

// 處理刷新
const handleRefresh = () => {
  loadProjectData();
  loadTaskData();
  message.success('數據刷新成功');
};

// 處理項目表格變更
const handleTableChange = (pag: any) => {
  pagination.current = pag.current;
  pagination.pageSize = pag.pageSize;
  loadProjectData();
};

// 處理任務表格變更
const handleTaskTableChange = (pag: any) => {
  taskPagination.current = pag.current;
  taskPagination.pageSize = pag.pageSize;
  loadTaskData();
};

// 處理查看項目
const handleViewProject = (record: any) => {
  message.info(`查看項目: ${record.projectName}`);
};

// 處理查看任務
const handleViewTask = (record: any) => {
  message.info(`查看任務: ${record.taskName}`);
};

// 加載項目數據
const loadProjectData = () => {
  // 模擬API調用
  console.log('Loading project data with filters:', filterForm);
};

// 加載任務數據
const loadTaskData = () => {
  // 模擬API調用
  console.log('Loading task data with filters:', filterForm);
};

// 組件掛載時初始化數據
onMounted(() => {
  loadProjectData();
  loadTaskData();
});
</script>

<style scoped>
.ant-statistic-content {
  font-size: 20px;
  font-weight: bold;
}
</style>