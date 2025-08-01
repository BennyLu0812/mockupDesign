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
  Modal,
  Checkbox,
  Tooltip,
  Popconfirm,
  Upload,
  Progress,
} from 'ant-design-vue';

const router = useRouter();

// 搜索表單
const searchForm = reactive({
  fileName: '',
  fileType: undefined,
  uploader: '',
  fileStatus: undefined,
  startDate: '',
  endDate: '',
  relatedProject: '',
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

// 文件數據
const fileData = ref([
  {
    id: '1',
    fileName: '勞動合同模板.docx',
    fileSize: '2.5MB',
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    fileExtension: 'docx',
    uploadTime: '2024-01-20 10:30:00',
    uploader: '張三',
    uploaderId: 'user001',
    fileVersion: 'v1.2',
    fileSource: '本地上傳',
    relatedProject: '人事管理系統',
    fileStatus: 'published',
    downloadCount: 25,
    previewCount: 48,
    lastModified: '2024-01-19 16:20:00',
    tags: ['合同', '模板', '人事'],
    customAttributes: {
      department: '人事部',
      category: '合同模板',
      confidentiality: '內部',
    },
  },
  {
    id: '2',
    fileName: '法律案例分析報告.pdf',
    fileSize: '5.8MB',
    fileType: 'application/pdf',
    fileExtension: 'pdf',
    uploadTime: '2024-01-19 14:15:00',
    uploader: '李四',
    uploaderId: 'user002',
    fileVersion: 'v2.0',
    fileSource: '掃描上傳',
    relatedProject: '法律諮詢項目',
    fileStatus: 'published',
    downloadCount: 12,
    previewCount: 35,
    lastModified: '2024-01-19 14:15:00',
    tags: ['法律', '案例', '分析'],
    customAttributes: {
      department: '法務部',
      category: '案例分析',
      confidentiality: '機密',
    },
  },
  {
    id: '3',
    fileName: '項目進度統計表.xlsx',
    fileSize: '1.2MB',
    fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    fileExtension: 'xlsx',
    uploadTime: '2024-01-18 09:45:00',
    uploader: '王五',
    uploaderId: 'user003',
    fileVersion: 'v1.0',
    fileSource: '本地上傳',
    relatedProject: '項目管理系統',
    fileStatus: 'unpublished',
    downloadCount: 8,
    previewCount: 15,
    lastModified: '2024-01-18 11:30:00',
    tags: ['統計', '進度', '項目'],
    customAttributes: {
      department: '項目部',
      category: '統計報表',
      confidentiality: '內部',
    },
  },
  {
    id: '4',
    fileName: '會議錄音.mp3',
    fileSize: '15.6MB',
    fileType: 'audio/mpeg',
    fileExtension: 'mp3',
    uploadTime: '2024-01-17 16:20:00',
    uploader: '趙六',
    uploaderId: 'user004',
    fileVersion: 'v1.0',
    fileSource: '本地上傳',
    relatedProject: '董事會會議',
    fileStatus: 'transitional',
    downloadCount: 3,
    previewCount: 7,
    lastModified: '2024-01-17 16:20:00',
    tags: ['會議', '錄音', '董事會'],
    customAttributes: {
      department: '秘書處',
      category: '會議記錄',
      confidentiality: '機密',
    },
  },
  {
    id: '5',
    fileName: '產品宣傳視頻.mp4',
    fileSize: '125.3MB',
    fileType: 'video/mp4',
    fileExtension: 'mp4',
    uploadTime: '2024-01-16 11:10:00',
    uploader: '錢七',
    uploaderId: 'user005',
    fileVersion: 'v1.1',
    fileSource: '本地上傳',
    relatedProject: '市場推廣',
    fileStatus: 'published',
    downloadCount: 45,
    previewCount: 128,
    lastModified: '2024-01-16 15:45:00',
    tags: ['宣傳', '視頻', '產品'],
    customAttributes: {
      department: '市場部',
      category: '宣傳材料',
      confidentiality: '公開',
    },
  },
]);

// 表格列配置
const columns = [
  {
    title: '',
    dataIndex: 'selection',
    key: 'selection',
    width: 50,
  },
  {
    title: $t('page.legalPlatform.fileName'),
    dataIndex: 'fileName',
    key: 'fileName',
    width: 250,
  },
  {
    title: $t('page.legalPlatform.fileSize'),
    dataIndex: 'fileSize',
    key: 'fileSize',
    width: 100,
  },
  {
    title: $t('page.legalPlatform.fileType'),
    dataIndex: 'fileExtension',
    key: 'fileExtension',
    width: 100,
  },
  {
    title: $t('page.legalPlatform.uploader'),
    dataIndex: 'uploader',
    key: 'uploader',
    width: 100,
  },
  {
    title: $t('page.legalPlatform.uploadTime'),
    dataIndex: 'uploadTime',
    key: 'uploadTime',
    width: 180,
  },
  {
    title: $t('page.legalPlatform.fileStatus'),
    dataIndex: 'fileStatus',
    key: 'fileStatus',
    width: 100,
  },
  {
    title: $t('page.legalPlatform.action'),
    key: 'action',
    width: 300,
    fixed: 'right',
  },
];

// 文件類型選項
const fileTypeOptions = [
  { label: 'PDF', value: 'pdf' },
  { label: 'Word', value: 'docx' },
  { label: 'Excel', value: 'xlsx' },
  { label: '圖片', value: 'image' },
  { label: '音頻', value: 'audio' },
  { label: '視頻', value: 'video' },
  { label: 'TIFF', value: 'tiff' },
];

// 文件狀態選項
const fileStatusOptions = [
  { label: $t('page.legalPlatform.published'), value: 'published' },
  { label: $t('page.legalPlatform.unpublished'), value: 'unpublished' },
  { label: $t('page.legalPlatform.transitional'), value: 'transitional' },
];

// 選中的文件
const selectedFiles = ref([]);
const selectAll = ref(false);

// 批量操作模態框
const showBatchModal = ref(false);
const batchOperation = ref('');

// 搜索
const handleSearch = () => {
  console.log('搜索條件:', searchForm);
  message.success('搜索成功');
};

// 重置
const handleReset = () => {
  Object.assign(searchForm, {
    fileName: '',
    fileType: undefined,
    uploader: '',
    fileStatus: undefined,
    startDate: '',
    endDate: '',
    relatedProject: '',
  });
  dateRange.value = [];
  message.success('重置成功');
};

// 上傳文件
const handleUpload = () => {
  router.push('/legal-platform/document-management/upload');
};

// 查看文件詳情
const handleViewDetail = (record: any) => {
  router.push(`/legal-platform/document-management/detail/${record.id}`);
};

// 預覽文件
const handlePreview = (record: any) => {
  console.log('預覽文件:', record.fileName);
  message.success('正在打開預覽...');
};

// 下載文件
const handleDownload = (record: any) => {
  console.log('下載文件:', record.fileName);
  message.success('文件下載開始');
};

// 列印文件
const handlePrint = (record: any) => {
  console.log('列印文件:', record.fileName);
  message.success('正在準備列印...');
};

// 編輯文件
const handleEdit = (record: any) => {
  console.log('編輯文件:', record.fileName);
  if (record.fileExtension === 'docx') {
    message.success('正在用Word打開文件...');
  } else {
    message.info('該文件類型不支持編輯');
  }
};

// 軟刪除文件
const handleSoftDelete = (record: any) => {
  console.log('軟刪除文件:', record.fileName);
  message.success('文件已移至軟刪除區');
};

// 硬刪除文件
const handleHardDelete = (record: any) => {
  console.log('硬刪除文件:', record.fileName);
  message.success('文件已永久刪除');
};

// 重命名文件
const handleRename = (record: any) => {
  console.log('重命名文件:', record.fileName);
  // 這裡可以打開重命名模態框
  message.success('重命名成功');
};

// 移動文件
const handleMove = (record: any) => {
  console.log('移動文件:', record.fileName);
  message.success('文件移動成功');
};

// 複製文件
const handleCopy = (record: any) => {
  console.log('複製文件:', record.fileName);
  message.success('文件複製成功');
};

// 全選/取消全選
const handleSelectAll = (checked: boolean) => {
  if (checked) {
    selectedFiles.value = fileData.value.map(item => item.id);
  } else {
    selectedFiles.value = [];
  }
};

// 單選文件
const handleSelectFile = (fileId: string, checked: boolean) => {
  if (checked) {
    selectedFiles.value.push(fileId);
  } else {
    const index = selectedFiles.value.indexOf(fileId);
    if (index > -1) {
      selectedFiles.value.splice(index, 1);
    }
  }
  selectAll.value = selectedFiles.value.length === fileData.value.length;
};

// 批量操作
const handleBatchOperation = (operation: string) => {
  if (selectedFiles.value.length === 0) {
    message.warning('請先選擇文件');
    return;
  }
  batchOperation.value = operation;
  showBatchModal.value = true;
};

// 執行批量操作
const executeBatchOperation = () => {
  console.log('批量操作:', batchOperation.value, selectedFiles.value);
  message.success(`批量${batchOperation.value}操作完成`);
  showBatchModal.value = false;
  selectedFiles.value = [];
  selectAll.value = false;
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

// 分頁變化
const handlePageChange = (page: number, pageSize: number) => {
  pagination.current = page;
  pagination.pageSize = pageSize;
};

// 獲取文件圖標
const getFileIcon = (extension: string) => {
  const iconMap: Record<string, string> = {
    pdf: 'icon-[lucide--file-text]',
    docx: 'icon-[lucide--file-text]',
    xlsx: 'icon-[lucide--file-spreadsheet]',
    mp3: 'icon-[lucide--file-audio]',
    mp4: 'icon-[lucide--file-video]',
    jpg: 'icon-[lucide--file-image]',
    png: 'icon-[lucide--file-image]',
    tiff: 'icon-[lucide--file-image]',
  };
  return iconMap[extension] || 'icon-[lucide--file]';
};

// 獲取文件狀態顏色
const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    published: 'green',
    unpublished: 'orange',
    transitional: 'blue',
  };
  return colorMap[status] || 'default';
};

// 獲取文件狀態名稱
const getStatusName = (status: string) => {
  const option = fileStatusOptions.find(opt => opt.value === status);
  return option ? option.label : status;
};

// 組件掛載時加載數據
onMounted(() => {
  pagination.total = fileData.value.length;
});
</script>

<template>
  <Page>
    <!-- 頁面頭部 -->
    <Card class="mb-4">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-xl font-semibold mb-2">{{ $t('page.legalPlatform.documentList') }}</h2>
          <div class="text-gray-500">管理和查看所有文件，支持多種格式預覽和編輯</div>
        </div>
        <Space>
          <Button type="primary" @click="handleUpload">
            <template #icon>
              <span class="icon-[lucide--upload] size-4" />
            </template>
            {{ $t('page.legalPlatform.documentUpload') }}
          </Button>
          <Button @click="() => router.push('/legal-platform/document-management/recycle-bin')">
            <template #icon>
              <span class="icon-[lucide--trash-2] size-4" />
            </template>
            {{ $t('page.legalPlatform.documentRecycleBin') }}
          </Button>
        </Space>
      </div>
    </Card>

    <!-- 搜索表單 -->
    <Card class="mb-4">
      <Form layout="vertical">
        <Row :gutter="16">
          <Col :span="6">
            <FormItem :label="$t('page.legalPlatform.fileName')">
              <Input 
                v-model:value="searchForm.fileName" 
                :placeholder="$t('page.legalPlatform.fileName')"
              />
            </FormItem>
          </Col>
          <Col :span="6">
            <FormItem :label="$t('page.legalPlatform.fileType')">
              <Select 
                v-model:value="searchForm.fileType" 
                :placeholder="$t('page.legalPlatform.fileType')"
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
          </Col>
          <Col :span="6">
            <FormItem :label="$t('page.legalPlatform.uploader')">
              <Input 
                v-model:value="searchForm.uploader" 
                :placeholder="$t('page.legalPlatform.uploader')"
              />
            </FormItem>
          </Col>
          <Col :span="6">
            <FormItem :label="$t('page.legalPlatform.fileStatus')">
              <Select 
                v-model:value="searchForm.fileStatus" 
                :placeholder="$t('page.legalPlatform.fileStatus')"
                allow-clear
              >
                <SelectOption 
                  v-for="option in fileStatusOptions" 
                  :key="option.value" 
                  :value="option.value"
                >
                  {{ option.label }}
                </SelectOption>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="16">
          <Col :span="6">
            <FormItem label="上傳時間">
              <DatePicker.RangePicker
                v-model:value="dateRange"
                @change="handleDateRangeChange"
                class="w-full"
              />
            </FormItem>
          </Col>
          <Col :span="6">
            <FormItem :label="$t('page.legalPlatform.relatedProject')">
              <Input 
                v-model:value="searchForm.relatedProject" 
                :placeholder="$t('page.legalPlatform.relatedProject')"
              />
            </FormItem>
          </Col>
          <Col :span="12">
            <FormItem>
              <Space class="mt-6">
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
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Card>

    <!-- 批量操作工具欄 -->
    <Card class="mb-4" v-if="selectedFiles.length > 0">
      <div class="flex justify-between items-center">
        <div class="text-sm text-gray-600">
          {{ $t('page.legalPlatform.selectedCount') }}: {{ selectedFiles.length }} / {{ $t('page.legalPlatform.totalCount') }}: {{ fileData.length }}
        </div>
        <Space>
          <Button @click="() => handleBatchOperation('下載')">
            <template #icon>
              <span class="icon-[lucide--download] size-4" />
            </template>
            {{ $t('page.legalPlatform.batchDownload') }}
          </Button>
          <Button @click="() => handleBatchOperation('移動')">
            <template #icon>
              <span class="icon-[lucide--move] size-4" />
            </template>
            {{ $t('page.legalPlatform.batchMove') }}
          </Button>
          <Button @click="() => handleBatchOperation('標籤')">
            <template #icon>
              <span class="icon-[lucide--tag] size-4" />
            </template>
            {{ $t('page.legalPlatform.batchTag') }}
          </Button>
          <Button danger @click="() => handleBatchOperation('刪除')">
            <template #icon>
              <span class="icon-[lucide--trash-2] size-4" />
            </template>
            {{ $t('page.legalPlatform.batchDelete') }}
          </Button>
        </Space>
      </div>
    </Card>

    <!-- 文件列表 -->
    <Card>
      <Table
        :columns="columns"
        :data-source="fileData"
        :pagination="false"
        :scroll="{ x: 1400 }"
        row-key="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'selection'">
            <Checkbox 
              :checked="selectedFiles.includes(record.id)"
              @change="(e) => handleSelectFile(record.id, e.target.checked)"
            />
          </template>
          <template v-else-if="column.key === 'fileName'">
            <div class="flex items-center">
              <span 
                :class="getFileIcon(record.fileExtension)"
                class="size-5 mr-3 text-blue-500" 
              />
              <div>
                <div class="font-medium cursor-pointer hover:text-blue-500" @click="handleViewDetail(record)">
                  {{ record.fileName }}
                </div>
                <div class="text-xs text-gray-500">{{ record.fileVersion }} | {{ record.fileSource }}</div>
                <div class="flex flex-wrap gap-1 mt-1">
                  <Tag 
                    v-for="tag in record.tags" 
                    :key="tag" 
                    size="small" 
                    color="blue"
                  >
                    {{ tag }}
                  </Tag>
                </div>
              </div>
            </div>
          </template>
          <template v-else-if="column.key === 'fileExtension'">
            <Tag color="blue">{{ record.fileExtension.toUpperCase() }}</Tag>
          </template>
          <template v-else-if="column.key === 'uploader'">
            <div class="flex items-center">
              <span class="icon-[lucide--user] size-4 mr-2 text-gray-500" />
              {{ record.uploader }}
            </div>
          </template>
          <template v-else-if="column.key === 'fileStatus'">
            <Tag :color="getStatusColor(record.fileStatus)">
              {{ getStatusName(record.fileStatus) }}
            </Tag>
          </template>
          <template v-else-if="column.key === 'action'">
            <Space>
              <Button type="link" size="small" @click="handlePreview(record)">
                <template #icon>
                  <span class="icon-[lucide--eye] size-4" />
                </template>
                {{ $t('page.legalPlatform.filePreview') }}
              </Button>
              <Button type="link" size="small" @click="handleDownload(record)">
                <template #icon>
                  <span class="icon-[lucide--download] size-4" />
                </template>
                {{ $t('page.legalPlatform.fileDownload') }}
              </Button>
              <Button type="link" size="small" @click="handleEdit(record)" v-if="record.fileExtension === 'docx'">
                <template #icon>
                  <span class="icon-[lucide--edit] size-4" />
                </template>
                {{ $t('page.legalPlatform.wordEdit') }}
              </Button>
              <Button type="link" size="small" @click="handlePrint(record)">
                <template #icon>
                  <span class="icon-[lucide--printer] size-4" />
                </template>
                {{ $t('page.legalPlatform.filePrint') }}
              </Button>
              <Button type="link" size="small" @click="handleRename(record)">
                <template #icon>
                  <span class="icon-[lucide--edit-3] size-4" />
                </template>
                {{ $t('page.legalPlatform.renameFile') }}
              </Button>
              <Popconfirm
                title="確定要軟刪除這個文件嗎？"
                @confirm="handleSoftDelete(record)"
              >
                <Button type="link" size="small" danger>
                  <template #icon>
                    <span class="icon-[lucide--trash-2] size-4" />
                  </template>
                  {{ $t('page.legalPlatform.softDelete') }}
                </Button>
              </Popconfirm>
            </Space>
          </template>
        </template>
        
        <template #title>
          <div class="flex justify-between items-center">
            <Checkbox 
              v-model:checked="selectAll"
              @change="handleSelectAll"
            >
              {{ $t('page.legalPlatform.selectFiles') }}
            </Checkbox>
            <div class="text-sm text-gray-500">
              共 {{ fileData.length }} 個文件
            </div>
          </div>
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

    <!-- 批量操作確認模態框 -->
    <Modal
      v-model:open="showBatchModal"
      :title="`批量${batchOperation}`"
      @ok="executeBatchOperation"
    >
      <p>確定要對選中的 {{ selectedFiles.length }} 個文件執行{{ batchOperation }}操作嗎？</p>
      <div class="mt-4 p-3 bg-gray-50 rounded">
        <div class="text-sm text-gray-600">選中的文件：</div>
        <div class="mt-2">
          <Tag 
            v-for="fileId in selectedFiles.slice(0, 5)" 
            :key="fileId" 
            class="mb-1"
          >
            {{ fileData.find(f => f.id === fileId)?.fileName }}
          </Tag>
          <span v-if="selectedFiles.length > 5" class="text-gray-500">等 {{ selectedFiles.length }} 個文件</span>
        </div>
      </div>
    </Modal>
  </Page>
</template>

<style scoped>
.ant-card {
  border-radius: 8px;
}
</style>