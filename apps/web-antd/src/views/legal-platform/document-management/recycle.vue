<script lang="ts" setup>
import { ref, reactive } from 'vue';
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
  message,
  Modal,
  Popconfirm,
  Tooltip,
  Alert,
  Progress,
  Checkbox,
} from 'ant-design-vue';

const router = useRouter();

// 搜索表單
const searchForm = reactive({
  fileName: '',
  fileType: '',
  deleteUser: '',
  deleteTimeRange: [],
  originalPath: '',
});

// 表格數據
const tableData = ref([
  {
    id: 'DEL-2024-001',
    fileName: '合同模板-服務協議.docx',
    originalPath: '/legal-documents/contracts/templates/',
    fileSize: '2.5 MB',
    fileType: 'docx',
    deleteUser: '張三',
    deleteTime: '2024-01-20 15:30:00',
    deleteReason: '文件過期',
    retentionDays: 25,
    canRestore: true,
    isSelected: false,
  },
  {
    id: 'DEL-2024-002',
    fileName: '會議記錄-董事會.pdf',
    originalPath: '/legal-documents/meetings/',
    fileSize: '1.8 MB',
    fileType: 'pdf',
    deleteUser: '李四',
    deleteTime: '2024-01-19 10:15:00',
    deleteReason: '誤刪除',
    retentionDays: 26,
    canRestore: true,
    isSelected: false,
  },
  {
    id: 'DEL-2024-003',
    fileName: '法律分析報告.docx',
    originalPath: '/legal-documents/reports/',
    fileSize: '3.2 MB',
    fileType: 'docx',
    deleteUser: '王五',
    deleteTime: '2024-01-18 14:45:00',
    deleteReason: '內容重複',
    retentionDays: 27,
    canRestore: true,
    isSelected: false,
  },
  {
    id: 'DEL-2024-004',
    fileName: '統計數據.xlsx',
    originalPath: '/legal-documents/statistics/',
    fileSize: '5.1 MB',
    fileType: 'xlsx',
    deleteUser: '趙六',
    deleteTime: '2024-01-17 09:20:00',
    deleteReason: '數據錯誤',
    retentionDays: 28,
    canRestore: true,
    isSelected: false,
  },
  {
    id: 'DEL-2024-005',
    fileName: '宣傳材料.pptx',
    originalPath: '/legal-documents/promotion/',
    fileSize: '8.7 MB',
    fileType: 'pptx',
    deleteUser: '錢七',
    deleteTime: '2024-01-16 16:10:00',
    deleteReason: '版本過舊',
    retentionDays: 29,
    canRestore: true,
    isSelected: false,
  },
  {
    id: 'DEL-2024-006',
    fileName: '過期合同.pdf',
    originalPath: '/legal-documents/contracts/expired/',
    fileSize: '1.2 MB',
    fileType: 'pdf',
    deleteUser: '孫八',
    deleteTime: '2024-01-05 11:30:00',
    deleteReason: '合同到期',
    retentionDays: 10,
    canRestore: false,
    isSelected: false,
  },
]);

// 分頁配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 6,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number, range: [number, number]) => 
    `第 ${range[0]}-${range[1]} 條，共 ${total} 條`,
});

// 選中的行
const selectedRowKeys = ref<string[]>([]);

// 批量操作模態框
const batchModalVisible = ref(false);
const batchOperation = ref('');
const batchProgress = reactive({
  visible: false,
  current: 0,
  total: 0,
  status: 'active' as 'active' | 'success' | 'exception',
});

// 文件詳情模態框
const detailModalVisible = ref(false);
const currentFile = ref<any>({});

// 清空回收站確認模態框
const clearModalVisible = ref(false);

// 表格列配置
const columns = [
  {
    title: '文件名稱',
    dataIndex: 'fileName',
    key: 'fileName',
    width: 250,
  },
  {
    title: '原始路徑',
    dataIndex: 'originalPath',
    key: 'originalPath',
    width: 200,
  },
  {
    title: '文件大小',
    dataIndex: 'fileSize',
    key: 'fileSize',
    width: 100,
  },
  {
    title: '文件類型',
    dataIndex: 'fileType',
    key: 'fileType',
    width: 100,
  },
  {
    title: '刪除者',
    dataIndex: 'deleteUser',
    key: 'deleteUser',
    width: 100,
  },
  {
    title: '刪除時間',
    dataIndex: 'deleteTime',
    key: 'deleteTime',
    width: 180,
  },
  {
    title: '保留天數',
    dataIndex: 'retentionDays',
    key: 'retentionDays',
    width: 100,
  },
  {
    title: '狀態',
    key: 'status',
    width: 100,
  },
  {
    title: '操作',
    key: 'action',
    width: 200,
    fixed: 'right',
  },
];

// 文件類型選項
const fileTypeOptions = [
  { label: 'PDF', value: 'pdf' },
  { label: 'Word', value: 'docx' },
  { label: 'Excel', value: 'xlsx' },
  { label: 'PowerPoint', value: 'pptx' },
  { label: '圖片', value: 'image' },
  { label: '音頻', value: 'audio' },
  { label: '視頻', value: 'video' },
];

// 刪除者選項
const deleteUserOptions = [
  { label: '張三', value: '張三' },
  { label: '李四', value: '李四' },
  { label: '王五', value: '王五' },
  { label: '趙六', value: '趙六' },
  { label: '錢七', value: '錢七' },
  { label: '孫八', value: '孫八' },
];

// 獲取文件類型圖標
const getFileIcon = (fileType: string) => {
  const iconMap = {
    pdf: 'icon-[lucide--file-text]',
    doc: 'icon-[lucide--file-text]',
    docx: 'icon-[lucide--file-text]',
    xls: 'icon-[lucide--file-spreadsheet]',
    xlsx: 'icon-[lucide--file-spreadsheet]',
    ppt: 'icon-[lucide--presentation]',
    pptx: 'icon-[lucide--presentation]',
    jpg: 'icon-[lucide--image]',
    jpeg: 'icon-[lucide--image]',
    png: 'icon-[lucide--image]',
    gif: 'icon-[lucide--image]',
    mp4: 'icon-[lucide--video]',
    avi: 'icon-[lucide--video]',
    mp3: 'icon-[lucide--music]',
    wav: 'icon-[lucide--music]',
  };
  return iconMap[fileType.toLowerCase()] || 'icon-[lucide--file]';
};

// 獲取保留狀態
const getRetentionStatus = (days: number) => {
  if (days <= 7) {
    return { color: 'red', text: '即將永久刪除' };
  } else if (days <= 15) {
    return { color: 'orange', text: '保留中' };
  } else {
    return { color: 'green', text: '安全保留' };
  }
};

// 搜索
const handleSearch = () => {
  console.log('搜索條件:', searchForm);
  message.success('搜索完成');
};

// 重置搜索
const handleReset = () => {
  Object.assign(searchForm, {
    fileName: '',
    fileType: '',
    deleteUser: '',
    deleteTimeRange: [],
    originalPath: '',
  });
  message.info('搜索條件已重置');
};

// 恢復文件
const handleRestore = (record: any) => {
  if (!record.canRestore) {
    message.error('該文件已超過保留期限，無法恢復');
    return;
  }
  
  message.success(`文件 "${record.fileName}" 已恢復到原始位置`);
  
  // 從表格中移除該記錄
  const index = tableData.value.findIndex(item => item.id === record.id);
  if (index > -1) {
    tableData.value.splice(index, 1);
    pagination.total--;
  }
};

// 永久刪除
const handlePermanentDelete = (record: any) => {
  message.success(`文件 "${record.fileName}" 已永久刪除`);
  
  // 從表格中移除該記錄
  const index = tableData.value.findIndex(item => item.id === record.id);
  if (index > -1) {
    tableData.value.splice(index, 1);
    pagination.total--;
  }
};

// 查看詳情
const handleViewDetail = (record: any) => {
  currentFile.value = record;
  detailModalVisible.value = true;
};

// 批量恢復
const handleBatchRestore = () => {
  if (selectedRowKeys.value.length === 0) {
    message.warning('請選擇要恢復的文件');
    return;
  }
  
  const canRestoreFiles = tableData.value.filter(
    item => selectedRowKeys.value.includes(item.id) && item.canRestore
  );
  
  if (canRestoreFiles.length === 0) {
    message.error('選中的文件都無法恢復');
    return;
  }
  
  batchOperation.value = 'restore';
  batchModalVisible.value = true;
};

// 批量永久刪除
const handleBatchPermanentDelete = () => {
  if (selectedRowKeys.value.length === 0) {
    message.warning('請選擇要永久刪除的文件');
    return;
  }
  
  batchOperation.value = 'delete';
  batchModalVisible.value = true;
};

// 執行批量操作
const executeBatchOperation = () => {
  batchModalVisible.value = false;
  batchProgress.visible = true;
  batchProgress.current = 0;
  batchProgress.total = selectedRowKeys.value.length;
  batchProgress.status = 'active';
  
  const interval = setInterval(() => {
    batchProgress.current++;
    
    if (batchProgress.current >= batchProgress.total) {
      clearInterval(interval);
      batchProgress.status = 'success';
      
      setTimeout(() => {
        batchProgress.visible = false;
        
        // 移除已處理的記錄
        tableData.value = tableData.value.filter(
          item => !selectedRowKeys.value.includes(item.id)
        );
        pagination.total -= selectedRowKeys.value.length;
        selectedRowKeys.value = [];
        
        const operationText = batchOperation.value === 'restore' ? '恢復' : '永久刪除';
        message.success(`批量${operationText}操作完成`);
      }, 1000);
    }
  }, 500);
};

// 清空回收站
const handleClearRecycle = () => {
  clearModalVisible.value = true;
};

// 確認清空回收站
const confirmClearRecycle = () => {
  clearModalVisible.value = false;
  
  // 只刪除可以永久刪除的文件
  const deletableFiles = tableData.value.filter(item => item.retentionDays <= 30);
  
  tableData.value = tableData.value.filter(item => item.retentionDays > 30);
  pagination.total = tableData.value.length;
  
  message.success(`已清空 ${deletableFiles.length} 個文件`);
};

// 表格行選擇
const rowSelection = {
  selectedRowKeys,
  onChange: (keys: string[]) => {
    selectedRowKeys.value = keys;
  },
  getCheckboxProps: (record: any) => ({
    disabled: false,
  }),
};

// 分頁變化
const handleTableChange = (pag: any) => {
  pagination.current = pag.current;
  pagination.pageSize = pag.pageSize;
};

// 返回文件列表
const handleBackToList = () => {
  router.push('/legal-platform/document-management/list');
};
</script>

<template>
  <Page>
    <!-- 頁面頭部 -->
    <Card class="mb-4">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-xl font-semibold mb-2">{{ $t('page.legalPlatform.recycleBin') }}</h2>
          <div class="text-gray-500">管理已刪除的文件，支持恢復或永久刪除</div>
        </div>
        <Space>
          <Button @click="handleBackToList">
            <template #icon>
              <span class="icon-[lucide--arrow-left] size-4" />
            </template>
            {{ $t('page.legalPlatform.back') }}
          </Button>
          
          <Popconfirm
            title="確定要清空回收站嗎？此操作不可恢復！"
            ok-text="確定"
            cancel-text="取消"
            @confirm="handleClearRecycle"
          >
            <Button danger>
              <template #icon>
                <span class="icon-[lucide--trash-2] size-4" />
              </template>
              清空回收站
            </Button>
          </Popconfirm>
        </Space>
      </div>
    </Card>

    <!-- 搜索表單 -->
    <Card class="mb-4">
      <Form layout="inline" :model="searchForm">
        <FormItem label="文件名稱">
          <Input 
            v-model:value="searchForm.fileName" 
            placeholder="請輸入文件名稱" 
            style="width: 200px"
          />
        </FormItem>
        
        <FormItem label="文件類型">
          <Select 
            v-model:value="searchForm.fileType" 
            placeholder="請選擇文件類型" 
            style="width: 150px"
            allow-clear
          >
            <SelectOption 
              v-for="option in fileTypeOptions" 
              :key="option.value" 
              :value="option.value"
            >
              {{ option.label }}
            </SelectOption>
          </Select>
        </FormItem>
        
        <FormItem label="刪除者">
          <Select 
            v-model:value="searchForm.deleteUser" 
            placeholder="請選擇刪除者" 
            style="width: 150px"
            allow-clear
          >
            <SelectOption 
              v-for="option in deleteUserOptions" 
              :key="option.value" 
              :value="option.value"
            >
              {{ option.label }}
            </SelectOption>
          </Select>
        </FormItem>
        
        <FormItem label="刪除時間">
          <DatePicker.RangePicker 
            v-model:value="searchForm.deleteTimeRange" 
            style="width: 300px"
          />
        </FormItem>
        
        <FormItem label="原始路徑">
          <Input 
            v-model:value="searchForm.originalPath" 
            placeholder="請輸入原始路徑" 
            style="width: 200px"
          />
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
                <span class="icon-[lucide--rotate-ccw] size-4" />
              </template>
              {{ $t('page.legalPlatform.reset') }}
            </Button>
          </Space>
        </FormItem>
      </Form>
    </Card>

    <!-- 批量操作 -->
    <Card class="mb-4" v-if="selectedRowKeys.length > 0">
      <Alert
        :message="`已選擇 ${selectedRowKeys.length} 個文件`"
        type="info"
        show-icon
        class="mb-4"
      />
      
      <Space>
        <Button type="primary" @click="handleBatchRestore">
          <template #icon>
            <span class="icon-[lucide--rotate-ccw] size-4" />
          </template>
          批量恢復
        </Button>
        
        <Button danger @click="handleBatchPermanentDelete">
          <template #icon>
            <span class="icon-[lucide--trash-2] size-4" />
          </template>
          批量永久刪除
        </Button>
      </Space>
    </Card>

    <!-- 數據表格 -->
    <Card>
      <Table
        :columns="columns"
        :data-source="tableData"
        :pagination="pagination"
        :row-selection="rowSelection"
        :scroll="{ x: 1200 }"
        row-key="id"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'fileName'">
            <div class="flex items-center">
              <span :class="getFileIcon(record.fileType)" class="size-4 mr-2 text-blue-500" />
              <Tooltip :title="record.fileName">
                <span class="truncate max-w-[200px]">{{ record.fileName }}</span>
              </Tooltip>
            </div>
          </template>
          
          <template v-if="column.key === 'fileType'">
            <Tag>{{ record.fileType.toUpperCase() }}</Tag>
          </template>
          
          <template v-if="column.key === 'retentionDays'">
            <div class="text-center">
              <div class="font-medium">{{ record.retentionDays }}</div>
              <div class="text-xs text-gray-500">天</div>
            </div>
          </template>
          
          <template v-if="column.key === 'status'">
            <Tag :color="getRetentionStatus(record.retentionDays).color">
              {{ getRetentionStatus(record.retentionDays).text }}
            </Tag>
          </template>
          
          <template v-if="column.key === 'action'">
            <Space>
              <Button size="small" @click="handleViewDetail(record)">
                <template #icon>
                  <span class="icon-[lucide--eye] size-3" />
                </template>
                詳情
              </Button>
              
              <Button 
                v-if="record.canRestore" 
                size="small" 
                type="primary" 
                @click="handleRestore(record)"
              >
                <template #icon>
                  <span class="icon-[lucide--rotate-ccw] size-3" />
                </template>
                恢復
              </Button>
              
              <Popconfirm
                title="確定要永久刪除這個文件嗎？"
                ok-text="確定"
                cancel-text="取消"
                @confirm="handlePermanentDelete(record)"
              >
                <Button size="small" danger>
                  <template #icon>
                    <span class="icon-[lucide--trash-2] size-3" />
                  </template>
                  永久刪除
                </Button>
              </Popconfirm>
            </Space>
          </template>
        </template>
      </Table>
    </Card>

    <!-- 批量操作確認模態框 -->
    <Modal
      v-model:open="batchModalVisible"
      :title="batchOperation === 'restore' ? '批量恢復確認' : '批量永久刪除確認'"
      @ok="executeBatchOperation"
    >
      <div class="py-4">
        <Alert
          :message="batchOperation === 'restore' ? '確定要恢復選中的文件嗎？' : '確定要永久刪除選中的文件嗎？此操作不可恢復！'"
          :type="batchOperation === 'restore' ? 'info' : 'warning'"
          show-icon
          class="mb-4"
        />
        
        <div class="text-gray-600">
          將要處理 <strong>{{ selectedRowKeys.length }}</strong> 個文件
        </div>
      </div>
    </Modal>

    <!-- 批量操作進度模態框 -->
    <Modal
      v-model:open="batchProgress.visible"
      :title="batchOperation === 'restore' ? '批量恢復進度' : '批量刪除進度'"
      :footer="null"
      :closable="false"
    >
      <div class="py-4">
        <Progress 
          :percent="Math.floor((batchProgress.current / batchProgress.total) * 100)" 
          :status="batchProgress.status"
        />
        
        <div class="mt-4 text-center text-gray-600">
          {{ batchProgress.current }} / {{ batchProgress.total }}
        </div>
      </div>
    </Modal>

    <!-- 文件詳情模態框 -->
    <Modal
      v-model:open="detailModalVisible"
      title="文件詳情"
      width="600px"
      :footer="null"
    >
      <div class="space-y-4">
        <div class="flex items-center">
          <span :class="getFileIcon(currentFile.fileType)" class="size-6 text-blue-500 mr-3" />
          <div>
            <div class="font-medium text-lg">{{ currentFile.fileName }}</div>
            <div class="text-gray-500 text-sm">{{ currentFile.fileSize }}</div>
          </div>
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div>
            <div class="text-sm text-gray-500">原始路徑</div>
            <div class="font-medium">{{ currentFile.originalPath }}</div>
          </div>
          <div>
            <div class="text-sm text-gray-500">文件類型</div>
            <div class="font-medium">{{ currentFile.fileType?.toUpperCase() }}</div>
          </div>
          <div>
            <div class="text-sm text-gray-500">刪除者</div>
            <div class="font-medium">{{ currentFile.deleteUser }}</div>
          </div>
          <div>
            <div class="text-sm text-gray-500">刪除時間</div>
            <div class="font-medium">{{ currentFile.deleteTime }}</div>
          </div>
          <div>
            <div class="text-sm text-gray-500">刪除原因</div>
            <div class="font-medium">{{ currentFile.deleteReason }}</div>
          </div>
          <div>
            <div class="text-sm text-gray-500">保留天數</div>
            <div class="font-medium">
              {{ currentFile.retentionDays }} 天
              <Tag 
                :color="getRetentionStatus(currentFile.retentionDays).color" 
                class="ml-2"
              >
                {{ getRetentionStatus(currentFile.retentionDays).text }}
              </Tag>
            </div>
          </div>
        </div>
        
        <div class="flex justify-end space-x-2 pt-4 border-t">
          <Button 
            v-if="currentFile.canRestore" 
            type="primary" 
            @click="handleRestore(currentFile); detailModalVisible = false"
          >
            <template #icon>
              <span class="icon-[lucide--rotate-ccw] size-4" />
            </template>
            恢復文件
          </Button>
          
          <Popconfirm
            title="確定要永久刪除這個文件嗎？"
            ok-text="確定"
            cancel-text="取消"
            @confirm="handlePermanentDelete(currentFile); detailModalVisible = false"
          >
            <Button danger>
              <template #icon>
                <span class="icon-[lucide--trash-2] size-4" />
              </template>
              永久刪除
            </Button>
          </Popconfirm>
        </div>
      </div>
    </Modal>

    <!-- 清空回收站確認模態框 -->
    <Modal
      v-model:open="clearModalVisible"
      title="清空回收站確認"
      @ok="confirmClearRecycle"
    >
      <div class="py-4">
        <Alert
          message="警告：此操作將永久刪除回收站中的所有文件，且無法恢復！"
          type="error"
          show-icon
          class="mb-4"
        />
        
        <div class="text-gray-600">
          <p>將要清空的文件數量：<strong>{{ tableData.filter(item => item.retentionDays <= 30).length }}</strong></p>
          <p class="text-sm text-gray-500 mt-2">注：只會刪除保留期內的文件</p>
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