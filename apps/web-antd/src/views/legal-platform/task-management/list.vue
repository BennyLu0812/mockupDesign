<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { Page } from '@vben/common-ui';
import { $t } from '#/locales';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Drawer,
  Form,
  FormItem,
  Input,
  InputNumber,
  Modal,
  Pagination,
  Row,
  Select,
  SelectOption,
  Space,
  Table,
  Tag,
  Upload,
  message,
} from 'ant-design-vue';

// 搜索表單
const searchForm = reactive({
  taskName: '',
  taskStatus: undefined,
  taskNumber: '',
  startDate: undefined,
  endDate: undefined,
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

// 表格數據
const tableData = ref([
  {
    id: 1,
    title: '法律條文審查任務',
    status: 'inProgress',
    assignee: '陳大文',
    creator: '張三',
    createTime: '2024-01-15 10:30:00',
    priority: 'high',
    taskNumber: 'LP-2024-001',
    isReferenced: false,
  },
  {
    id: 2,
    title: '合同審核任務',
    status: 'preparing',
    assignee: '李四',
    creator: '陳大文',
    createTime: '2024-01-14 14:20:00',
    priority: 'medium',
    taskNumber: 'LP-2024-002',
    isReferenced: false,
  },
  {
    id: 3,
    title: '法規研究分析',
    status: 'completed',
    assignee: '張三',
    creator: '李四',
    createTime: '2024-01-13 09:15:00',
    priority: 'low',
    taskNumber: 'LP-2024-003',
    isReferenced: true,
  },
]);

// 表格列配置
const columns = [
  {
    title: $t('page.legalPlatform.taskNumber'),
    dataIndex: 'taskNumber',
    key: 'taskNumber',
    width: 140,
  },
  {
    title: $t('page.legalPlatform.taskTitle'),
    dataIndex: 'title',
    key: 'title',
    width: 200,
  },
  {
    title: $t('page.legalPlatform.status'),
    dataIndex: 'status',
    key: 'status',
    width: 120,
  },
  {
    title: $t('page.legalPlatform.assignee'),
    dataIndex: 'assignee',
    key: 'assignee',
    width: 100,
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
    title: $t('page.legalPlatform.priority'),
    dataIndex: 'priority',
    key: 'priority',
    width: 100,
  },
  {
    title: $t('page.legalPlatform.operation'),
    key: 'operation',
    width: 150,
    fixed: 'right',
  },
];

// 狀態選項
const statusOptions = [
  { value: 'preparing', label: $t('page.legalPlatform.preparingStatus') },
  { value: 'inProgress', label: $t('page.legalPlatform.inProgress') },
  { value: 'completed', label: $t('page.legalPlatform.completed') },
  { value: 'cancelled', label: $t('page.legalPlatform.cancelled') },
];



// 優先級選項
const priorityOptions = [
  { value: 'high', label: $t('page.legalPlatform.high') },
  { value: 'medium', label: $t('page.legalPlatform.medium') },
  { value: 'low', label: $t('page.legalPlatform.low') },
];

// 抽屜狀態
const detailDrawerVisible = ref(false);
const createDrawerVisible = ref(false);
const selectedTask = ref<any>(null);

// 新增任務表單數據
const createFormData = reactive({
  taskName: '',
  taskDescription: '',
  taskStatus: 'preparing',
  taskStartTime: undefined,
  taskEndTime: undefined,
  taskParticipants: [],
  taskRemarks: '',
  taskDueTime: undefined,
  estimatedHours: 0,
  attachments: [] as any[],
});

// 任務參與人員選項
const taskParticipantOptions = [
  { value: 'chen', label: '陳大文' },
  { value: 'zhang', label: '張三' },
  { value: 'li', label: '李四' },
];

// 關聯項數量
const relatedItemsCount = ref(0);

// 獲取狀態標籤顏色
const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    preparing: 'blue',
    inProgress: 'green',
    completed: 'gray',
    cancelled: 'gray',
  };
  return colorMap[status] || 'gray';
};

// 獲取狀態文本
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    preparing: $t('page.legalPlatform.preparingStatus'),
    inProgress: $t('page.legalPlatform.inProgress'),
    completed: $t('page.legalPlatform.completed'),
    cancelled: $t('page.legalPlatform.cancelled'),
  };
  return statusMap[status] || status;
};



// 獲取優先級文本和顏色
const getPriorityConfig = (priority: string) => {
  const configMap: Record<string, { text: string; color: string }> = {
    high: { text: $t('page.legalPlatform.high'), color: 'red' },
    medium: { text: $t('page.legalPlatform.medium'), color: 'orange' },
    low: { text: $t('page.legalPlatform.low'), color: 'green' },
  };
  return configMap[priority] || { text: priority, color: 'gray' };
};

// 搜索
const handleSearch = () => {
  console.log('搜索條件:', searchForm);
  // 這裡可以調用API進行搜索
  loadTableData();
};

// 重置搜索
const handleReset = () => {
  Object.assign(searchForm, {
    taskName: '',
    taskStatus: undefined,
    taskNumber: '',
    startDate: undefined,
    endDate: undefined,
  });
  loadTableData();
};

// 查看詳情
const handleDetail = (record: any) => {
  selectedTask.value = { ...record };
  detailDrawerVisible.value = true;
};

// 刪除任務
const handleDelete = (record: any) => {
  // 檢查業務規則
  if (record.status === 'inProgress') {
    message.error($t('page.legalPlatform.cannotDeleteInProgress'));
    return;
  }
  
  if (record.isReferenced) {
    message.error($t('page.legalPlatform.cannotDeleteReferenced'));
    return;
  }
  
  Modal.confirm({
    title: $t('page.legalPlatform.deleteConfirm'),
    onOk: () => {
      const index = tableData.value.findIndex(item => item.id === record.id);
      if (index > -1) {
        tableData.value.splice(index, 1);
        pagination.total--;
        message.success($t('page.legalPlatform.deleteSuccess'));
      }
    },
  });
};

// 新增任務
const handleAddTask = () => {
  createDrawerVisible.value = true;
};

// 關閉詳情抽屜
const closeDetailDrawer = () => {
  detailDrawerVisible.value = false;
  selectedTask.value = null;
};

// 關閉新增抽屜
const closeCreateDrawer = () => {
  createDrawerVisible.value = false;
  // 重置表單
  Object.assign(createFormData, {
    taskName: '',
    taskDescription: '',
    taskStatus: 'preparing',
    taskStartTime: undefined,
    taskEndTime: undefined,
    taskParticipants: [],
    taskRemarks: '',
    taskDueTime: undefined,
    estimatedHours: 0,
    attachments: [],
  });
};

// 保存新增任務
const handleSaveTask = () => {
  if (!createFormData.taskName) {
    message.error('請輸入任務名稱');
    return;
  }
  
  // 模擬保存
  const newTask = {
    id: Date.now(),
    title: createFormData.taskName,
    status: 'preparing', // 固定為預備中狀態
    assignee: '當前用戶',
    creator: '當前用戶',
    createTime: new Date().toLocaleString('zh-CN'),
    priority: 'medium',
    taskNumber: `LP-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
    isReferenced: false,
  };
  
  tableData.value.unshift(newTask);
  pagination.total++;
  message.success('任務創建成功！');
  closeCreateDrawer();
};

// 分頁變化
const handleTableChange = (pag: any) => {
  pagination.current = pag.current;
  pagination.pageSize = pag.pageSize;
  loadTableData();
};

// 加載表格數據
const loadTableData = () => {
  // 這裡可以調用API加載數據
  pagination.total = tableData.value.length;
};

// 文件上傳配置
const uploadProps = {
  name: 'file',
  multiple: true,
  beforeUpload: (file: File) => {
    const isValidType = [
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'video/*',
      'audio/*',
      'image/*',
    ].some(type => file.type.startsWith(type.replace('/*', '')));
    
    if (!isValidType) {
      message.error('只支持上傳 Word、Excel、音視頻和圖片文件！');
      return false;
    }
    
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error('文件大小不能超過 10MB！');
      return false;
    }
    
    return false; // 阻止自動上傳，只做本地處理
  },
  onChange: (info: any) => {
    if (info.file.status !== 'removed') {
      createFormData.attachments.push(info.file);
    }
  },
  onRemove: (file: any) => {
    const index = createFormData.attachments.findIndex((item: any) => item.uid === file.uid);
    if (index > -1) {
      createFormData.attachments.splice(index, 1);
    }
  },
};

// 組件掛載時加載數據
onMounted(() => {
  loadTableData();
});
</script>

<template>
  <Page :title="$t('page.legalPlatform.taskList')">
    <div class="task-list-container">
      <!-- 搜索區域 -->
      <Card class="mb-4">
        <Form layout="inline" :model="searchForm">
          <Row :gutter="16" class="w-full">
            <Col :span="8">
              <FormItem :label="$t('page.legalPlatform.taskName')">
                <Input
                  v-model:value="searchForm.taskName"
                  :placeholder="$t('page.legalPlatform.taskName')"
                />
              </FormItem>
            </Col>
            <Col :span="8">
              <FormItem :label="$t('page.legalPlatform.taskStatus')">
                <Select
                  v-model:value="searchForm.taskStatus"
                  :placeholder="$t('page.legalPlatform.taskStatus')"
                  allow-clear
                >
                  <SelectOption
                    v-for="option in statusOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </SelectOption>
                </Select>
              </FormItem>
            </Col>
            <Col :span="8">
              <FormItem :label="$t('page.legalPlatform.taskNumber')">
                <Input
                  v-model:value="searchForm.taskNumber"
                  :placeholder="$t('page.legalPlatform.taskNumber')"
                />
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="16" class="w-full mt-4">
            <Col :span="8">
              <FormItem :label="$t('page.legalPlatform.startDate')">
                <DatePicker
                  v-model:value="searchForm.startDate"
                  :placeholder="$t('page.legalPlatform.startDate')"
                  class="w-full"
                  format="YYYY-MM-DD"
                />
              </FormItem>
            </Col>
            <Col :span="8">
              <FormItem :label="$t('page.legalPlatform.endDate')">
                <DatePicker
                  v-model:value="searchForm.endDate"
                  :placeholder="$t('page.legalPlatform.endDate')"
                  class="w-full"
                  format="YYYY-MM-DD"
                />
              </FormItem>
            </Col>
            <Col :span="8">
              <!-- 留空位置 -->
            </Col>
          </Row>
          <Row :gutter="16" class="w-full mt-4">
            <Col :span="24" class="text-right">
              <Space>
                <Button @click="handleReset">
                  {{ $t('page.legalPlatform.reset') }}
                </Button>
                <Button type="primary" @click="handleSearch">
                  {{ $t('page.legalPlatform.search') }}
                </Button>
                <Button type="primary" @click="handleAddTask">
                  <span class="icon-[lucide--plus] size-4 mr-1" />
                  {{ $t('page.legalPlatform.addTask') }}
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>

      <!-- 表格區域 -->
      <Card>
        <Table
          :columns="columns"
          :data-source="tableData"
          :pagination="pagination"
          :scroll="{ x: 1200 }"
          @change="handleTableChange"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'status'">
              <Tag :color="getStatusColor(record.status)">
                {{ getStatusText(record.status) }}
              </Tag>
            </template>
            <template v-else-if="column.key === 'priority'">
              <Tag :color="getPriorityConfig(record.priority).color">
                {{ getPriorityConfig(record.priority).text }}
              </Tag>
            </template>
            <template v-else-if="column.key === 'operation'">
              <Space>
                <Button type="link" size="small" @click="handleDetail(record)">
                  {{ $t('page.legalPlatform.detail') }}
                </Button>
                <Button
                  type="link"
                  size="small"
                  danger
                  @click="handleDelete(record)"
                >
                  {{ $t('page.legalPlatform.delete') }}
                </Button>
              </Space>
            </template>
          </template>
        </Table>
      </Card>
    </div>

    <!-- 詳情抽屜 -->
    <Drawer
      v-model:open="detailDrawerVisible"
      :title="$t('page.legalPlatform.detail')"
      placement="right"
      :width="1000"
      @close="closeDetailDrawer"
    >
      <div v-if="selectedTask" class="task-detail-container">
        <div class="grid grid-cols-12 gap-4">
          <!-- 左側主要內容區域 -->
          <div class="col-span-7">
            <Card class="mb-4" :title="$t('page.legalPlatform.taskName')">
              <div class="text-lg font-medium">{{ selectedTask.title }}</div>
            </Card>

            <Card :title="$t('page.legalPlatform.taskDescription')">
              <div class="min-h-[300px] p-4 bg-gray-50 rounded">
                這裡是任務描述內容...
              </div>
            </Card>

            <!-- 關聯項區域 -->
            <Card class="mt-1" :title="$t('page.legalPlatform.relatedItems')">
              <div class="flex items-center justify-between">
                <div>
                  <span class="text-lg font-medium">{{ $t('page.legalPlatform.relatedItemsCount') }}: {{ relatedItemsCount }}</span>
                  <div class="mt-2 text-sm text-gray-500">
                    {{ $t('page.legalPlatform.addAutomationRule') }}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <!-- 右側信息區域 -->
          <div class="col-span-5">
            <Card class="mb-1" title="基礎字段">
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-gray-600">{{ $t('page.legalPlatform.taskStatus') }}:</span>
                  <Tag :color="getStatusColor(selectedTask.status)">
                    {{ getStatusText(selectedTask.status) }}
                  </Tag>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">{{ $t('page.legalPlatform.assignee') }}:</span>
                  <span>{{ selectedTask.assignee }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">{{ $t('page.legalPlatform.creator') }}:</span>
                  <span>{{ selectedTask.creator }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">{{ $t('page.legalPlatform.createTime') }}:</span>
                  <span>{{ selectedTask.createTime }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">{{ $t('page.legalPlatform.priority') }}:</span>
                  <Tag :color="getPriorityConfig(selectedTask.priority).color">
                    {{ getPriorityConfig(selectedTask.priority).text }}
                  </Tag>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Drawer>

    <!-- 新增任務抽屜 -->
    <Drawer
      v-model:open="createDrawerVisible"
      :title="$t('page.legalPlatform.addTask')"
      placement="right"
      :width="1000"
      @close="closeCreateDrawer"
    >
      <div class="task-create-container">
        <div class="grid grid-cols-12 gap-4">
          <!-- 左側主要內容區域 -->
          <div class="col-span-7">
            <Card class="mb-4" :title="$t('page.legalPlatform.taskName')">
              <Input
                v-model:value="createFormData.taskName"
                :placeholder="$t('page.legalPlatform.taskName')"
                size="large"
              />
            </Card>

            <Card :title="$t('page.legalPlatform.taskDescription')">
              <div class="editor-toolbar mb-2">
                <Space>
                  <Button size="small" type="text">
                    <span class="icon-[lucide--bold] size-4" />
                  </Button>
                  <Button size="small" type="text">
                    <span class="icon-[lucide--italic] size-4" />
                  </Button>
                  <Button size="small" type="text">
                    <span class="icon-[lucide--underline] size-4" />
                  </Button>
                  <Button size="small" type="text">
                    <span class="icon-[lucide--list] size-4" />
                  </Button>
                  <Button size="small" type="text">
                    <span class="icon-[lucide--list-ordered] size-4" />
                  </Button>
                </Space>
              </div>
              <Input.TextArea
                v-model:value="createFormData.taskDescription"
                :placeholder="$t('page.legalPlatform.taskDescription')"
                :rows="10"
                class="min-h-[300px]"
              />
            </Card>

            <!-- 關聯項區域 -->
            <Card class="mt-1" :title="$t('page.legalPlatform.relatedItems')">
              <div class="flex items-center justify-between">
                <div>
                  <span class="text-lg font-medium">{{ $t('page.legalPlatform.relatedItemsCount') }}: {{ relatedItemsCount }}</span>
                  <div class="mt-2 text-sm text-gray-500">
                    {{ $t('page.legalPlatform.addAutomationRule') }}
                  </div>
                </div>
                <Button type="dashed">
                  <span class="icon-[lucide--plus] size-4 mr-1" />
                  添加關聯項
                </Button>
              </div>
            </Card>
          </div>

          <!-- 右側信息區域 -->
          <div class="col-span-5">
            <Card class="mb-1" title="基礎字段">
              <Form layout="horizontal" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
                <FormItem :label="$t('page.legalPlatform.taskStatus')">
                  <span class="text-gray-700 font-medium">預備中</span>
                </FormItem>

                <FormItem :label="$t('page.legalPlatform.taskStartTime')">
                  <DatePicker
                    v-model:value="createFormData.taskStartTime"
                    class="w-full"
                    format="YYYY-MM-DD"
                  />
                </FormItem>

                <FormItem :label="$t('page.legalPlatform.taskEndTime')">
                  <DatePicker
                    v-model:value="createFormData.taskEndTime"
                    class="w-full"
                    format="YYYY-MM-DD"
                  />
                </FormItem>

                <FormItem :label="$t('page.legalPlatform.taskParticipants')">
                  <Select
                    v-model:value="createFormData.taskParticipants"
                    mode="multiple"
                    :placeholder="$t('page.legalPlatform.taskParticipants')"
                  >
                    <SelectOption
                      v-for="option in taskParticipantOptions"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </SelectOption>
                  </Select>
                </FormItem>

                <FormItem :label="$t('page.legalPlatform.taskRemarks')">
                  <Input.TextArea
                    v-model:value="createFormData.taskRemarks"
                    :placeholder="$t('page.legalPlatform.taskRemarks')"
                    :rows="3"
                  />
                </FormItem>

                <FormItem :label="$t('page.legalPlatform.taskDueTime')">
                  <DatePicker
                    v-model:value="createFormData.taskDueTime"
                    class="w-full"
                    format="YYYY-MM-DD HH:mm"
                    show-time
                  />
                </FormItem>
              </Form>
            </Card>

            <Card class="mb-1" :title="$t('page.legalPlatform.workHours')">
              <FormItem :label="$t('page.legalPlatform.estimatedHours')">
                <InputNumber
                  v-model:value="createFormData.estimatedHours"
                  :min="0"
                  :step="0.5"
                  class="w-full"
                  :placeholder="$t('page.legalPlatform.estimatedHours')"
                />
              </FormItem>
            </Card>

            <Card class="mb-1" :title="$t('page.legalPlatform.attachments')">
              <Upload v-bind="uploadProps" :file-list="createFormData.attachments">
                <Button>
                  <span class="icon-[lucide--upload] size-4 mr-1" />
                  {{ $t('page.legalPlatform.addAttachment') }}
                </Button>
              </Upload>
              <div class="mt-2 text-sm text-gray-500">
                支持 Word、Excel、音視頻等多媒體文件上傳
              </div>
            </Card>
          </div>
        </div>
      </div>
      
      <template #footer>
        <div class="flex justify-end space-x-2">
          <Button @click="closeCreateDrawer">
            {{ $t('page.legalPlatform.cancel') }}
          </Button>
          <Button type="primary" @click="handleSaveTask">
            {{ $t('page.legalPlatform.save') }}
          </Button>
        </div>
      </template>
    </Drawer>
  </Page>
</template>

<style scoped>
.task-list-container {
  padding: 0;
}

.task-detail-container,
.task-create-container {
  padding: 0;
}

.editor-toolbar {
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 8px;
}

:deep(.ant-card) {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
}

:deep(.ant-card-head) {
  border-bottom: 1px solid #f0f0f0;
}

:deep(.ant-form-item) {
  margin-bottom: 5px;
}

:deep(.ant-form-item-label) {
  font-weight: 500;
  text-align: left !important;
}

:deep(.ant-form-item-control) {
  text-align: left !important;
}

:deep(.ant-drawer-footer) {
  border-top: 1px solid #f0f0f0;
}

/* 確保基礎字段與預估工時對齊 */
:deep(.ant-form-horizontal .ant-form-item-label) {
  text-align: left !important;
  padding-right: 8px;
}

:deep(.ant-form-horizontal .ant-form-item-control-input) {
  text-align: left !important;
}
</style>
