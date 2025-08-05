<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Page } from '@vben/common-ui';
import { $t } from '#/locales';
import {
  Button,
  Card,
  Col,
  Form,
  FormItem,
  Input,
  Row,
  Select,
  SelectOption,
  Space,
  Table,
  Tag,
  DatePicker,
  Pagination,
  message,
  Tooltip,
  Modal,
  Descriptions,
  DescriptionsItem,
} from 'ant-design-vue';

const router = useRouter();

// 搜索表單
const searchForm = reactive({
  operationType: undefined,
  operator: '',
  startDate: '',
  endDate: '',
  fileName: '',
});

// 日期範圍
const dateRange = ref([]);

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

// 歷史記錄數據
const historyData = ref([
  {
    id: '1',
    operationType: 'create',
    operationName: '創建文件夾',
    targetName: '法律文件/合同模板',
    targetType: 'folder',
    operator: 'João Silva',
    operatorId: 'user001',
    operationTime: '2024-01-20 10:30:00',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    description: '創建了新的文件夾「合同模板」',
    details: {
      folderPath: '/法律文件/合同模板',
      permissions: '繼承父級權限',
      tags: ['合同', '模板'],
    },
  },
  {
    id: '2',
    operationType: 'upload',
    operationName: '上傳文件',
    targetName: '勞動合同模板.docx',
    targetType: 'file',
    operator: 'Maria Santos',
    operatorId: 'user002',
    operationTime: '2024-01-20 11:15:00',
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    description: '上傳了文件「勞動合同模板.docx」',
    details: {
      fileName: '勞動合同模板.docx',
      fileSize: '2.5MB',
      filePath: '/法律文件/合同模板/勞動合同模板.docx',
      fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    },
  },
  {
    id: '3',
    operationType: 'edit',
    operationName: '編輯權限',
    targetName: '法律文件/案例分析',
    targetType: 'folder',
    operator: 'Pedro Costa',
    operatorId: 'user003',
    operationTime: '2024-01-20 14:20:00',
    ipAddress: '192.168.1.102',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    description: '修改了文件夾「案例分析」的權限設置',
    details: {
      folderPath: '/法律文件/案例分析',
      oldPermissions: '部門可讀',
      newPermissions: '部門可讀寫',
      affectedUsers: ['user004', 'user005'],
    },
  },
  {
    id: '4',
    operationType: 'delete',
    operationName: '刪除文件',
    targetName: '舊版合同.doc',
    targetType: 'file',
    operator: '趙六',
    operatorId: 'user004',
    operationTime: '2024-01-20 16:45:00',
    ipAddress: '192.168.1.103',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    description: '刪除了文件「舊版合同.doc」',
    details: {
      fileName: '舊版合同.doc',
      fileSize: '1.2MB',
      filePath: '/法律文件/合同模板/舊版合同.doc',
      deleteReason: '文件已過期',
    },
  },
  {
    id: '5',
    operationType: 'move',
    operationName: '移動文件夾',
    targetName: '歸檔文件',
    targetType: 'folder',
    operator: '錢七',
    operatorId: 'user005',
    operationTime: '2024-01-21 09:30:00',
    ipAddress: '192.168.1.104',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    description: '將文件夾「歸檔文件」移動到新位置',
    details: {
      oldPath: '/法律文件/歸檔文件',
      newPath: '/歷史文件/歸檔文件',
      affectedFiles: 15,
    },
  },
]);

// 表格列配置
const columns = [
  {
    title: '操作時間',
    dataIndex: 'operationTime',
    key: 'operationTime',
    width: 180,
    sorter: true,
  },
  {
    title: '操作類型',
    dataIndex: 'operationType',
    key: 'operationType',
    width: 120,
  },
  {
    title: '目標對象',
    dataIndex: 'targetName',
    key: 'targetName',
    width: 200,
  },
  {
    title: '對象類型',
    dataIndex: 'targetType',
    key: 'targetType',
    width: 100,
  },
  {
    title: '操作人',
    dataIndex: 'operator',
    key: 'operator',
    width: 100,
  },
  {
    title: 'IP地址',
    dataIndex: 'ipAddress',
    key: 'ipAddress',
    width: 140,
  },
  {
    title: '操作描述',
    dataIndex: 'description',
    key: 'description',
    width: 250,
  },
  {
    title: $t('page.legalPlatform.action'),
    key: 'action',
    width: 120,
    fixed: 'right',
  },
];

// 操作類型選項
const operationTypeOptions = [
  { label: '創建', value: 'create' },
  { label: '上傳', value: 'upload' },
  { label: '編輯', value: 'edit' },
  { label: '刪除', value: 'delete' },
  { label: '移動', value: 'move' },
  { label: '複製', value: 'copy' },
  { label: '重命名', value: 'rename' },
  { label: '下載', value: 'download' },
  { label: '預覽', value: 'preview' },
  { label: '分享', value: 'share' },
];

// 詳情模態框
const showDetailModal = ref(false);
const currentRecord = ref({});

// 搜索
const handleSearch = () => {
  console.log('搜索條件:', searchForm);
  // 這裡應該調用API進行搜索
  message.success('搜索成功');
};

// 重置
const handleReset = () => {
  Object.assign(searchForm, {
    operationType: undefined,
    operator: '',
    startDate: '',
    endDate: '',
    fileName: '',
  });
  dateRange.value = [];
  message.success('重置成功');
};

// 查看詳情
const handleViewDetail = (record: any) => {
  currentRecord.value = record;
  showDetailModal.value = true;
};

// 導出記錄
const handleExport = () => {
  console.log('導出歷史記錄');
  message.success('導出成功');
};

// 返回
const handleBack = () => {
  router.back();
};

// 分頁變化
const handlePageChange = (page: number, pageSize: number) => {
  pagination.current = page;
  pagination.pageSize = pageSize;
  // 重新加載數據
};

// 日期範圍變化
const handleDateRangeChange = (dates: any) => {
  if (dates && dates.length === 2) {
    searchForm.startDate = dates[0].format('YYYY-MM-DD');
    searchForm.endDate = dates[1].format('YYYY-MM-DD');
  } else {
    searchForm.startDate = '';
    searchForm.endDate = '';
  }
};

// 獲取操作類型標籤顏色
const getOperationTypeColor = (type: string) => {
  const colorMap: Record<string, string> = {
    create: 'green',
    upload: 'blue',
    edit: 'orange',
    delete: 'red',
    move: 'purple',
    copy: 'cyan',
    rename: 'geekblue',
    download: 'lime',
    preview: 'gold',
    share: 'magenta',
  };
  return colorMap[type] || 'default';
};

// 獲取對象類型標籤顏色
const getTargetTypeColor = (type: string) => {
  return type === 'folder' ? 'blue' : 'green';
};

// 獲取操作類型名稱
const getOperationTypeName = (type: string) => {
  const option = operationTypeOptions.find(opt => opt.value === type);
  return option ? option.label : type;
};

// 組件掛載時加載數據
onMounted(() => {
  pagination.total = historyData.value.length;
});
</script>

<template>
  <Page>
    <!-- 頁面頭部 -->
    <Card class="mb-4">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-xl font-semibold mb-2">文件夾歷史記錄</h2>
          <div class="text-gray-500">查看文件夾和文件的操作歷史記錄</div>
        </div>
        <Space>
          <Button @click="handleExport">
            <template #icon>
              <span class="icon-[lucide--download] size-4" />
            </template>
            導出記錄
          </Button>
          <Button @click="handleBack">
            <template #icon>
              <span class="icon-[lucide--arrow-left] size-4" />
            </template>
            {{ $t('page.legalPlatform.back') }}
          </Button>
        </Space>
      </div>
    </Card>

    <!-- 搜索表單 -->
    <Card class="mb-4">
      <Form layout="vertical">
        <Row :gutter="16">
          <Col :span="6">
            <FormItem label="操作類型">
              <Select 
                v-model:value="searchForm.operationType" 
                placeholder="請選擇操作類型"
                allow-clear
              >
                <SelectOption 
                  v-for="option in operationTypeOptions" 
                  :key="option.value" 
                  :value="option.value"
                >
                  {{ option.label }}
                </SelectOption>
              </Select>
            </FormItem>
          </Col>
          <Col :span="6">
            <FormItem label="操作人">
              <Input 
                v-model:value="searchForm.operator" 
                placeholder="請輸入操作人"
              />
            </FormItem>
          </Col>
          <Col :span="6">
            <FormItem label="時間範圍">
              <DatePicker.RangePicker
                v-model:value="dateRange"
                @change="handleDateRangeChange"
                class="w-full"
              />
            </FormItem>
          </Col>
          <Col :span="6">
            <FormItem label="文件名稱">
              <Input 
                v-model:value="searchForm.fileName" 
                placeholder="請輸入文件名稱"
              />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :span="24">
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
            </Space>
          </Col>
        </Row>
      </Form>
    </Card>

    <!-- 歷史記錄列表 -->
    <Card>
      <Table
        :columns="columns"
        :data-source="historyData"
        :pagination="false"
        :scroll="{ x: 1400 }"
        row-key="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'operationType'">
            {{ getOperationTypeName(record.operationType) }}
          </template>
          <template v-else-if="column.key === 'targetName'">
            <div class="flex items-center">
              <span 
                :class="record.targetType === 'folder' ? 'icon-[lucide--folder]' : 'icon-[lucide--file-text]'"
                class="size-4 mr-2 text-blue-500" 
              />
              <Tooltip :title="record.targetName">
                <span class="truncate max-w-[150px]">{{ record.targetName }}</span>
              </Tooltip>
            </div>
          </template>
          <template v-else-if="column.key === 'targetType'">
            {{ record.targetType === 'folder' ? '文件夾' : '文件' }}
          </template>
          <template v-else-if="column.key === 'operator'">
            <div class="flex items-center">
              <span class="icon-[lucide--user] size-4 mr-2 text-gray-500" />
              {{ record.operator }}
            </div>
          </template>
          <template v-else-if="column.key === 'description'">
            <Tooltip :title="record.description">
              <span class="truncate max-w-[200px]">{{ record.description }}</span>
            </Tooltip>
          </template>
          <template v-else-if="column.key === 'action'">
            <Button type="link" size="small" @click="handleViewDetail(record)">
              <template #icon>
                <span class="icon-[lucide--eye] size-4" />
              </template>
              查看詳情
            </Button>
          </template>
        </template>
      </Table>

      <div class="mt-4 flex justify-end">
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

    <!-- 詳情模態框 -->
    <Modal
      v-model:open="showDetailModal"
      title="操作詳情"
      :footer="null"
      width="800px"
    >
      <Descriptions :column="2" bordered>
        <DescriptionsItem label="操作時間">
          {{ currentRecord.operationTime }}
        </DescriptionsItem>
        <DescriptionsItem label="操作類型">
          {{ getOperationTypeName(currentRecord.operationType) }}
        </DescriptionsItem>
        <DescriptionsItem label="目標對象">
          <div class="flex items-center">
            <span 
              :class="currentRecord.targetType === 'folder' ? 'icon-[lucide--folder]' : 'icon-[lucide--file-text]'"
              class="size-4 mr-2 text-blue-500" 
            />
            {{ currentRecord.targetName }}
          </div>
        </DescriptionsItem>
        <DescriptionsItem label="對象類型">
          {{ currentRecord.targetType === 'folder' ? '文件夾' : '文件' }}
        </DescriptionsItem>
        <DescriptionsItem label="操作人">
          {{ currentRecord.operator }} ({{ currentRecord.operatorId }})
        </DescriptionsItem>
        <DescriptionsItem label="IP地址">
          {{ currentRecord.ipAddress }}
        </DescriptionsItem>
        <DescriptionsItem label="用戶代理" :span="2">
          <div class="text-xs text-gray-500 break-all">
            {{ currentRecord.userAgent }}
          </div>
        </DescriptionsItem>
        <DescriptionsItem label="操作描述" :span="2">
          {{ currentRecord.description }}
        </DescriptionsItem>
      </Descriptions>

      <div class="mt-4">
        <h4 class="text-lg font-medium mb-2">詳細信息</h4>
        <div class="bg-gray-50 p-4 rounded">
          <pre class="text-sm">{{ JSON.stringify(currentRecord.details, null, 2) }}</pre>
        </div>
      </div>
    </Modal>
  </Page>
</template>

<style scoped>
.ant-card {
  border-radius: 8px;
}

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
