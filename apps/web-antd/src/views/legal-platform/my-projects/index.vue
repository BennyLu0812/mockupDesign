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
  Input,
  Pagination,
  Row,
  Select,
  SelectOption,
  Space,
  Table,
  Tag,
  message,
} from 'ant-design-vue';

const router = useRouter();

// 當前用戶信息（模擬）
const currentUser = ref({
  id: 1,
  name: '陳大文',
  role: 'admin',
});

// 搜索表單
const searchForm = reactive({
  projectName: '',
  projectType: undefined,
  projectStatus: undefined,
  myRole: undefined,
  startDate: undefined,
  endDate: undefined,
});

// 快速篩選狀態
const quickFilter = ref({
  createdByMe: false,
  servedByMe: false,
});

// 分頁配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number, range: [number, number]) => 
    `第 ${range[0]}-${range[1]} 條，共 ${total} 條`,
});

// 我的項目數據（模擬當前用戶參與的項目）
const myProjectsData = ref([
  {
    id: 1,
    name: '法律條文審查項目',
    type: '法案項目',
    status: '進行中',
    creator: '陳大文',
    createTime: '2024-01-15 10:30:00',
    startTime: '2024-01-15',
    endTime: '2024-03-15',
    dueTime: '2024-03-10',
    memberCount: 5,
    taskCount: 12,
    completedTaskCount: 8,
    myRole: '項目負責人',
    progress: 67, // 項目進度百分比
    taskProgress: 67, // 任務進度百分比
    participants: ['António Silva', 'João Silva', 'Maria Santos', 'Pedro Costa', 'Ana Ferreira'],
  },
  {
    id: 2,
    name: '合同審核專案',
    type: '一般項目',
    status: '進行中',
    creator: 'João Silva',
    createTime: '2024-01-14 14:20:00',
    startTime: '2024-01-20',
    endTime: '2024-02-28',
    dueTime: '2024-02-25',
    memberCount: 3,
    taskCount: 8,
    completedTaskCount: 3,
    myRole: '項目成員',
    progress: 38,
    taskProgress: 38,
    participants: ['João Silva', 'António Silva', 'Maria Santos'],
  },
  {
    id: 3,
    name: '法規研究分析',
    type: '其他項目',
    status: '已完成',
    creator: 'Maria Santos',
    createTime: '2024-01-10 09:15:00',
    startTime: '2024-01-10',
    endTime: '2024-01-25',
    dueTime: '2024-01-25',
    memberCount: 4,
    taskCount: 6,
    completedTaskCount: 6,
    myRole: '觀察者',
    progress: 100,
    taskProgress: 100,
    participants: ['Maria Santos', 'António Silva', 'Pedro Costa', 'Ana Ferreira'],
  },
  {
    id: 4,
    name: '企業法律風險評估',
    type: '一般項目',
    status: '準備中',
    creator: 'Pedro Costa',
    createTime: '2024-01-20 16:45:00',
    startTime: '2024-02-01',
    endTime: '2024-03-30',
    dueTime: '2024-03-25',
    memberCount: 6,
    taskCount: 15,
    completedTaskCount: 0,
    myRole: '項目成員',
    progress: 0,
    taskProgress: 0,
    participants: ['Pedro Costa', 'António Silva', 'João Silva', 'Maria Santos', 'Ana Ferreira', 'Carlos Oliveira'],
  },
]);

// 過濾後的項目數據
const filteredProjects = computed(() => {
  return myProjectsData.value.filter(project => {
    // 確保項目包含當前用戶
    if (!project.participants.includes(currentUser.value.name)) {
      return false;
    }
    
    // 快速篩選：由我創建
    if (quickFilter.value.createdByMe && project.creator !== currentUser.value.name) {
      return false;
    }
    
    // 快速篩選：由我服務（參與但非創建者）
    if (quickFilter.value.servedByMe && project.creator === currentUser.value.name) {
      return false;
    }
    
    // 項目名稱篩選
    if (searchForm.projectName && !project.name.includes(searchForm.projectName)) {
      return false;
    }
    
    // 項目類型篩選
    if (searchForm.projectType && project.type !== searchForm.projectType) {
      return false;
    }
    
    // 項目狀態篩選
    if (searchForm.projectStatus && project.status !== searchForm.projectStatus) {
      return false;
    }
    
    // 我的角色篩選
    if (searchForm.myRole && project.myRole !== searchForm.myRole) {
      return false;
    }
    
    return true;
  });
});

// 表格列配置
const columns = [
  {
    title: $t('page.legalPlatform.projectName'),
    dataIndex: 'name',
    key: 'name',
    width: 200,
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
    title: $t('page.legalPlatform.myRole'),
    dataIndex: 'myRole',
    key: 'myRole',
    width: 120,
  },

  {
    title: $t('page.legalPlatform.creator'),
    dataIndex: 'creator',
    key: 'creator',
    width: 100,
  },
  {
    title: $t('page.legalPlatform.createTime'),
    dataIndex: 'createTime',
    key: 'createTime',
    width: 160,
  },
  {
    title: $t('page.legalPlatform.operation'),
    key: 'operation',
    width: 150,
    fixed: 'right',
  },
];

// 項目類型選項
const projectTypeOptions = [
  { value: '一般項目', label: '一般項目' },
  { value: '法案項目', label: '法案項目' },
  { value: '其他項目', label: '其他項目' },
];

// 項目狀態選項
const projectStatusOptions = [
  { value: '待處理', label: '待處理' },
  { value: '處理中', label: '處理中' },
  { value: '已完成', label: '已完成' },
  { value: '已取消', label: '已取消' },
];

// 角色選項
const roleOptions = [
  { value: '項目負責人', label: '項目負責人' },
  { value: '項目成員', label: '項目成員' },
  { value: '觀察者', label: '觀察者' },
];

// 搜索項目
const handleSearch = () => {
  console.log('搜索我的項目:', searchForm);
  pagination.current = 1;
  updatePagination();
};

// 重置搜索
const handleReset = () => {
  Object.assign(searchForm, {
    projectName: '',
    projectType: undefined,
    projectStatus: undefined,
    myRole: undefined,
    startDate: undefined,
    endDate: undefined,
  });
  // 重置快速篩選
  quickFilter.value.createdByMe = false;
  quickFilter.value.servedByMe = false;
  pagination.current = 1;
  updatePagination();
};

// 由我創建篩選
const handleCreatedByMe = () => {
  quickFilter.value.createdByMe = !quickFilter.value.createdByMe;
  quickFilter.value.servedByMe = false; // 互斥
  pagination.current = 1;
  updatePagination();
};

// 由我負責篩選（原來的由我服務）
const handleServedByMe = () => {
  quickFilter.value.servedByMe = !quickFilter.value.servedByMe;
  quickFilter.value.createdByMe = false; // 互斥
  pagination.current = 1;
  updatePagination();
};

// 查看項目詳情
const handleViewDetail = (record: any) => {
  router.push(`/legal-platform/project-management/detail/${record.id}`);
};

// 獲取狀態標籤顏色
const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    '待處理': 'blue',
    '處理中': 'green',
    '已完成': 'gray',
    '已取消': 'red',
  };
  return colorMap[status] || 'default';
};

// 獲取角色標籤顏色
const getRoleColor = (role: string) => {
  const colorMap: Record<string, string> = {
    '項目負責人': 'red',
    '項目成員': 'blue',
    '觀察者': 'gray',
  };
  return colorMap[role] || 'default';
};

// 更新分頁信息
const updatePagination = () => {
  pagination.total = filteredProjects.value.length;
};

// 分頁變化
const handlePageChange = (page: number, pageSize: number) => {
  pagination.current = page;
  pagination.pageSize = pageSize;
};

// 獲取當前頁數據
const currentPageData = computed(() => {
  const start = (pagination.current - 1) * pagination.pageSize;
  const end = start + pagination.pageSize;
  return filteredProjects.value.slice(start, end);
});

// 組件掛載時初始化數據
onMounted(() => {
  updatePagination();
});
</script>

<template>
  <Page :title="$t('page.legalPlatform.myProjects')">
    <div class="my-projects">
      <!-- 搜索區域 -->
      <Card class="mb-4">
        <Form
          :model="searchForm"
          layout="inline"
          class="search-form"
        >
          <Row :gutter="16" class="w-full">
            <Col :span="6">
              <FormItem :label="$t('page.legalPlatform.projectName')">
                <Input
                  v-model:value="searchForm.projectName"
                  :placeholder="`請輸入${$t('page.legalPlatform.projectName')}`"
                  allow-clear
                />
              </FormItem>
            </Col>
            <Col :span="6">
              <FormItem :label="$t('page.legalPlatform.projectType')">
                <Select
                  v-model:value="searchForm.projectType"
                  :placeholder="`請選擇${$t('page.legalPlatform.projectType')}`"
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
              <FormItem :label="$t('page.legalPlatform.projectStatus')">
                <Select
                  v-model:value="searchForm.projectStatus"
                  :placeholder="`請選擇${$t('page.legalPlatform.projectStatus')}`"
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
            <Col :span="6">
              <FormItem :label="$t('page.legalPlatform.myRole')">
                <Select
                  v-model:value="searchForm.myRole"
                  :placeholder="`請選擇${$t('page.legalPlatform.myRole')}`"
                  allow-clear
                >
                  <SelectOption
                    v-for="option in roleOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </SelectOption>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="16" class="w-full mt-4">
            <Col :span="6">
              <FormItem :label="$t('page.legalPlatform.startDate')">
                <DatePicker
                  v-model:value="searchForm.startDate"
                  :placeholder="`請選擇${$t('page.legalPlatform.startDate')}`"
                  class="w-full"
                />
              </FormItem>
            </Col>
            <Col :span="6">
              <FormItem :label="$t('page.legalPlatform.endDate')">
                <DatePicker
                  v-model:value="searchForm.endDate"
                  :placeholder="`請選擇${$t('page.legalPlatform.endDate')}`"
                  class="w-full"
                />
              </FormItem>
            </Col>
            <Col :span="12">
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
                  <Button 
                    :type="quickFilter.createdByMe ? 'primary' : 'default'"
                    @click="handleCreatedByMe"
                  >
                    <template #icon>
                      <span class="icon-[lucide--user-plus] size-4" />
                    </template>
                    由我創建
                  </Button>
                  <Button 
                    :type="quickFilter.servedByMe ? 'primary' : 'default'"
                    @click="handleServedByMe"
                  >
                    <template #icon>
                      <span class="icon-[lucide--users] size-4" />
                    </template>
                    由我負責
                  </Button>
                </Space>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Card>

      <!-- 項目列表 -->
      <Card>
        <Table
          :columns="columns"
          :data-source="currentPageData"
          :pagination="false"
          :scroll="{ x: 1200 }"
          row-key="id"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'status'">
              <Tag :color="getStatusColor(record.status)">
                {{ record.status }}
              </Tag>
            </template>
            <template v-else-if="column.key === 'myRole'">
              <Tag :color="getRoleColor(record.myRole)">
                {{ record.myRole }}
              </Tag>
            </template>

            <template v-else-if="column.key === 'operation'">
              <Space>
                <Button
                  type="link"
                  size="small"
                  @click="handleViewDetail(record)"
                >
                  <template #icon>
                    <span class="icon-[lucide--eye] size-4" />
                  </template>
                  {{ $t('page.legalPlatform.detail') }}
                </Button>
              </Space>
            </template>
          </template>
        </Table>

        <!-- 分頁 -->
        <div class="flex justify-end mt-4">
          <Pagination
            v-model:current="pagination.current"
            v-model:page-size="pagination.pageSize"
            :total="pagination.total"
            :show-size-changer="pagination.showSizeChanger"
            :show-quick-jumper="pagination.showQuickJumper"
            :show-total="pagination.showTotal"
            @change="handlePageChange"
          />
        </div>
      </Card>
    </div>
  </Page>
</template>

<style scoped>
.my-projects {
  padding: 0;
}

.search-form .ant-form-item {
  margin-bottom: 16px;
}

.ant-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.ant-table {
  border-radius: 8px;
}

.ant-progress-line {
  margin: 0;
}

.text-center {
  text-align: center;
}

.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.justify-end {
  justify-content: flex-end;
}

.space-x-2 > * + * {
  margin-left: 8px;
}

.flex-1 {
  flex: 1;
}

.w-full {
  width: 100%;
}

.mb-4 {
  margin-bottom: 16px;
}

.mb-6 {
  margin-bottom: 24px;
}

.mt-1 {
  margin-top: 4px;
}

.mt-4 {
  margin-top: 16px;
}

.text-2xl {
  font-size: 24px;
}

.font-bold {
  font-weight: bold;
}

.text-blue-600 {
  color: #1890ff;
}

.text-green-600 {
  color: #52c41a;
}

.text-gray-600 {
  color: #666;
}

.text-orange-600 {
  color: #fa8c16;
}

.text-gray-500 {
  color: #999;
}

.text-sm {
  font-size: 14px;
}
</style>
