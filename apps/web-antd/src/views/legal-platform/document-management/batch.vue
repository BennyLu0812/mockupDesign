<script lang="ts" setup>
import { ref, reactive, computed } from 'vue';
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
  message,
  Modal,
  Progress,
  Alert,
  Checkbox,
  CheckboxGroup,
  Radio,
  RadioGroup,
  Divider,
  Steps,
  Step,
  Transfer,
  Tree,
  Tooltip,
  Popconfirm,
  Textarea,
} from 'ant-design-vue';

const router = useRouter();

// 當前步驟
const currentStep = ref(0);

// 批量操作類型
const batchOperation = ref('download');

// 文件選擇方式
const selectionMethod = ref('manual');

// 選中的文件
const selectedFiles = ref<string[]>([]);

// 文件數據
const fileData = ref([
  {
    id: 'DOC-2024-001',
    fileName: '合同模板-服務協議.docx',
    filePath: '/legal-documents/contracts/templates/',
    fileSize: '2.5 MB',
    fileType: 'docx',
    uploader: 'João Silva',
    uploadTime: '2024-01-20 14:45:00',
    status: 'published',
    tags: ['合同', '模板'],
    department: 'legal',
    category: 'contract-template',
  },
  {
    id: 'DOC-2024-002',
    fileName: '法律分析報告.pdf',
    filePath: '/legal-documents/reports/',
    fileSize: '3.2 MB',
    fileType: 'pdf',
    uploader: 'Maria Santos',
    uploadTime: '2024-01-19 10:30:00',
    status: 'published',
    tags: ['分析', '報告'],
    department: 'legal',
    category: 'case-analysis',
  },
  {
    id: 'DOC-2024-003',
    fileName: '會議記錄-董事會.docx',
    filePath: '/legal-documents/meetings/',
    fileSize: '1.8 MB',
    fileType: 'docx',
    uploader: 'Pedro Costa',
    uploadTime: '2024-01-18 16:20:00',
    status: 'unpublished',
    tags: ['會議', '記錄'],
    department: 'legal',
    category: 'meeting-record',
  },
  {
    id: 'DOC-2024-004',
    fileName: '統計數據.xlsx',
    filePath: '/legal-documents/statistics/',
    fileSize: '5.1 MB',
    fileType: 'xlsx',
    uploader: 'Ana Ferreira',
    uploadTime: '2024-01-17 11:45:00',
    status: 'published',
    tags: ['統計', '數據'],
    department: 'finance',
    category: 'statistics',
  },
  {
    id: 'DOC-2024-005',
    fileName: '宣傳材料.pptx',
    filePath: '/legal-documents/promotion/',
    fileSize: '8.7 MB',
    fileType: 'pptx',
    uploader: 'Carlos Oliveira',
    uploadTime: '2024-01-16 09:15:00',
    status: 'transitional',
    tags: ['宣傳', '材料'],
    department: 'marketing',
    category: 'promotion',
  },
]);

// 篩選條件
const filterForm = reactive({
  fileType: [],
  status: [],
  department: [],
  category: [],
  uploadTimeRange: [],
  tags: [],
});

// 批量操作配置
const batchConfig = reactive({
  // 下載配置
  download: {
    format: 'original', // original, pdf, zip
    includeMetadata: true,
    compressionLevel: 'medium',
  },
  // 移動配置
  move: {
    targetPath: '',
    createBackup: true,
    notifyUsers: true,
  },
  // 標籤配置
  tag: {
    operation: 'add', // add, remove, replace
    tags: [],
  },
  // 刪除配置
  delete: {
    deleteType: 'soft', // soft, hard
    reason: '',
    notifyUsers: true,
  },
  // 權限配置
  permission: {
    operation: 'grant', // grant, revoke
    users: [],
    roles: [],
    permissions: [],
  },
  // 屬性配置
  attribute: {
    operation: 'update', // update, clear
    attributes: {},
  },
});

// 執行進度
const executionProgress = reactive({
  visible: false,
  current: 0,
  total: 0,
  status: 'active' as 'active' | 'success' | 'exception',
  currentFile: '',
  errors: [] as string[],
  warnings: [] as string[],
  results: [] as any[],
});

// 步驟配置
const steps = [
  { title: '選擇操作', description: '選擇要執行的批量操作類型' },
  { title: '選擇文件', description: '選擇要操作的文件' },
  { title: '配置參數', description: '配置操作的具體參數' },
  { title: '確認執行', description: '確認操作信息並執行' },
  { title: '執行結果', description: '查看執行結果' },
];

// 操作類型選項
const operationOptions = [
  {
    value: 'download',
    label: '批量下載',
    description: '將選中的文件打包下載',
    icon: 'icon-[lucide--download]',
    color: 'blue',
  },
  {
    value: 'move',
    label: '批量移動',
    description: '將文件移動到指定位置',
    icon: 'icon-[lucide--folder-open]',
    color: 'green',
  },
  {
    value: 'tag',
    label: '批量標籤',
    description: '為文件添加或移除標籤',
    icon: 'icon-[lucide--tag]',
    color: 'orange',
  },
  {
    value: 'delete',
    label: '批量刪除',
    description: '刪除選中的文件',
    icon: 'icon-[lucide--trash]',
    color: 'red',
  },
  {
    value: 'permission',
    label: '批量權限',
    description: '批量設置文件權限',
    icon: 'icon-[lucide--shield]',
    color: 'purple',
  },
  {
    value: 'attribute',
    label: '批量屬性',
    description: '批量修改文件屬性',
    icon: 'icon-[lucide--settings]',
    color: 'cyan',
  },
];

// 表格列配置
const columns = [
  {
    title: '文件名稱',
    dataIndex: 'fileName',
    key: 'fileName',
    width: 250,
  },
  {
    title: '文件路徑',
    dataIndex: 'filePath',
    key: 'filePath',
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
    title: '上傳者',
    dataIndex: 'uploader',
    key: 'uploader',
    width: 100,
  },
  {
    title: '狀態',
    dataIndex: 'status',
    key: 'status',
    width: 100,
  },
  {
    title: '標籤',
    dataIndex: 'tags',
    key: 'tags',
    width: 150,
  },
];

// 選項數據
const fileTypeOptions = [
  { label: 'PDF', value: 'pdf' },
  { label: 'Word', value: 'docx' },
  { label: 'Excel', value: 'xlsx' },
  { label: 'PowerPoint', value: 'pptx' },
];

const statusOptions = [
  { label: '已發布', value: 'published' },
  { label: '未發布', value: 'unpublished' },
  { label: '過渡期', value: 'transitional' },
];

const departmentOptions = [
  { label: '法務部', value: 'legal' },
  { label: '人事部', value: 'hr' },
  { label: '財務部', value: 'finance' },
  { label: '市場部', value: 'marketing' },
];

const categoryOptions = [
  { label: '合同模板', value: 'contract-template' },
  { label: '案例分析', value: 'case-analysis' },
  { label: '統計報表', value: 'statistics' },
  { label: '會議記錄', value: 'meeting-record' },
  { label: '宣傳材料', value: 'promotion' },
];

const tagOptions = [
  { label: '合同', value: 'contract' },
  { label: '模板', value: 'template' },
  { label: '法律', value: 'legal' },
  { label: '分析', value: 'analysis' },
  { label: '統計', value: 'statistics' },
  { label: '會議', value: 'meeting' },
  { label: '宣傳', value: 'promotion' },
];

// 計算過濾後的文件
const filteredFiles = computed(() => {
  return fileData.value.filter(file => {
    // 文件類型篩選
    if (filterForm.fileType.length > 0 && !filterForm.fileType.includes(file.fileType)) {
      return false;
    }
    
    // 狀態篩選
    if (filterForm.status.length > 0 && !filterForm.status.includes(file.status)) {
      return false;
    }
    
    // 部門篩選
    if (filterForm.department.length > 0 && !filterForm.department.includes(file.department)) {
      return false;
    }
    
    // 分類篩選
    if (filterForm.category.length > 0 && !filterForm.category.includes(file.category)) {
      return false;
    }
    
    // 標籤篩選
    if (filterForm.tags.length > 0) {
      const hasMatchingTag = filterForm.tags.some(tag => file.tags.includes(tag));
      if (!hasMatchingTag) {
        return false;
      }
    }
    
    return true;
  });
});

// 獲取文件類型圖標
const getFileIcon = (fileType: string) => {
  const iconMap = {
    pdf: 'icon-[lucide--file-text]',
    docx: 'icon-[lucide--file-text]',
    xlsx: 'icon-[lucide--file-spreadsheet]',
    pptx: 'icon-[lucide--presentation]',
  };
  return iconMap[fileType] || 'icon-[lucide--file]';
};

// 獲取狀態標籤
const getStatusTag = (status: string) => {
  const statusMap = {
    published: { color: 'green', text: '已發布' },
    unpublished: { color: 'orange', text: '未發布' },
    transitional: { color: 'blue', text: '過渡期' },
  };
  return statusMap[status] || { color: 'default', text: status };
};

// 下一步
const handleNext = () => {
  if (currentStep.value === 1) {
    if (selectedFiles.value.length === 0) {
      message.error('請選擇要操作的文件');
      return;
    }
  } else if (currentStep.value === 3) {
    // 開始執行
    executeOperation();
    currentStep.value++;
    return;
  }
  
  if (currentStep.value < steps.length - 1) {
    currentStep.value++;
  }
};

// 上一步
const handlePrev = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
};

// 重新開始
const handleRestart = () => {
  currentStep.value = 0;
  selectedFiles.value = [];
  batchOperation.value = 'download';
  selectionMethod.value = 'manual';
  
  // 重置配置
  Object.keys(batchConfig).forEach(key => {
    if (key === 'download') {
      Object.assign(batchConfig[key], {
        format: 'original',
        includeMetadata: true,
        compressionLevel: 'medium',
      });
    } else if (key === 'move') {
      Object.assign(batchConfig[key], {
        targetPath: '',
        createBackup: true,
        notifyUsers: true,
      });
    } else if (key === 'tag') {
      Object.assign(batchConfig[key], {
        operation: 'add',
        tags: [],
      });
    } else if (key === 'delete') {
      Object.assign(batchConfig[key], {
        deleteType: 'soft',
        reason: '',
        notifyUsers: true,
      });
    }
  });
  
  // 重置進度
  executionProgress.visible = false;
  executionProgress.current = 0;
  executionProgress.total = 0;
  executionProgress.errors = [];
  executionProgress.warnings = [];
  executionProgress.results = [];
};

// 應用篩選
const applyFilter = () => {
  if (selectionMethod.value === 'filter') {
    selectedFiles.value = filteredFiles.value.map(file => file.id);
    message.success(`已選擇 ${selectedFiles.value.length} 個文件`);
  }
};

// 清除篩選
const clearFilter = () => {
  Object.assign(filterForm, {
    fileType: [],
    status: [],
    department: [],
    category: [],
    uploadTimeRange: [],
    tags: [],
  });
  selectedFiles.value = [];
};

// 全選/取消全選
const handleSelectAll = (checked: boolean) => {
  if (checked) {
    selectedFiles.value = filteredFiles.value.map(file => file.id);
  } else {
    selectedFiles.value = [];
  }
};

// 執行批量操作
const executeOperation = () => {
  executionProgress.visible = true;
  executionProgress.current = 0;
  executionProgress.total = selectedFiles.value.length;
  executionProgress.status = 'active';
  executionProgress.errors = [];
  executionProgress.warnings = [];
  executionProgress.results = [];
  
  // 模擬執行進度
  const interval = setInterval(() => {
    if (executionProgress.current < executionProgress.total) {
      executionProgress.current++;
      
      const currentFile = fileData.value.find(
        file => file.id === selectedFiles.value[executionProgress.current - 1]
      );
      
      if (currentFile) {
        executionProgress.currentFile = currentFile.fileName;
        
        // 模擬一些錯誤和警告
        if (Math.random() < 0.1) {
          executionProgress.errors.push(`處理文件 "${currentFile.fileName}" 時發生錯誤`);
        } else if (Math.random() < 0.2) {
          executionProgress.warnings.push(`文件 "${currentFile.fileName}" 處理時有警告`);
        } else {
          executionProgress.results.push({
            fileId: currentFile.id,
            fileName: currentFile.fileName,
            status: 'success',
            message: '處理成功',
          });
        }
      }
    } else {
      clearInterval(interval);
      executionProgress.status = executionProgress.errors.length > 0 ? 'exception' : 'success';
      executionProgress.currentFile = '';
      
      const operationText = operationOptions.find(op => op.value === batchOperation.value)?.label;
      message.success(`${operationText}操作完成！`);
    }
  }, 800);
};

// 表格行選擇
const rowSelection = {
  selectedRowKeys: selectedFiles,
  onChange: (keys: string[]) => {
    selectedFiles.value = keys;
  },
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
          <h2 class="text-xl font-semibold mb-2">{{ $t('page.legalPlatform.batchOperations') }}</h2>
          <div class="text-gray-500">對多個文件執行批量操作，提高工作效率</div>
        </div>
        <Space>
          <Button @click="handleBackToList">
            <template #icon>
              <span class="icon-[lucide--arrow-left] size-4" />
            </template>
            {{ $t('page.legalPlatform.back') }}
          </Button>
        </Space>
      </div>
    </Card>

    <!-- 操作嚮導 -->
    <Card>
      <Steps :current="currentStep" class="mb-6">
        <Step 
          v-for="(step, index) in steps" 
          :key="index"
          :title="step.title" 
          :description="step.description"
        />
      </Steps>

      <!-- 步驟 1: 選擇操作 -->
      <div v-if="currentStep === 0">
        <h3 class="text-lg font-medium mb-4">選擇批量操作類型</h3>
        
        <Row :gutter="16">
          <Col 
            v-for="option in operationOptions" 
            :key="option.value" 
            :span="8" 
            class="mb-4"
          >
            <Card 
              class="cursor-pointer border-2 transition-colors h-full"
              :class="batchOperation === option.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'"
              @click="batchOperation = option.value"
            >
              <div class="text-center py-6">
                <span :class="option.icon" class="size-12 mb-4 block mx-auto" :style="{ color: option.color }" />
                <h4 class="text-lg font-medium mb-2">{{ option.label }}</h4>
                <p class="text-gray-500 text-sm">{{ option.description }}</p>
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      <!-- 步驟 2: 選擇文件 -->
      <div v-if="currentStep === 1">
        <h3 class="text-lg font-medium mb-4">選擇要操作的文件</h3>
        
        <!-- 選擇方式 -->
        <Card class="mb-4">
          <RadioGroup v-model:value="selectionMethod" class="mb-4">
            <Radio value="manual">手動選擇</Radio>
            <Radio value="filter">條件篩選</Radio>
          </RadioGroup>
          
          <!-- 條件篩選 -->
          <div v-if="selectionMethod === 'filter'">
            <Form layout="inline">
              <FormItem label="文件類型">
                <Select 
                  v-model:value="filterForm.fileType" 
                  mode="multiple" 
                  placeholder="選擇文件類型" 
                  style="width: 200px"
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
              
              <FormItem label="文件狀態">
                <Select 
                  v-model:value="filterForm.status" 
                  mode="multiple" 
                  placeholder="選擇文件狀態" 
                  style="width: 200px"
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
              
              <FormItem label="所屬部門">
                <Select 
                  v-model:value="filterForm.department" 
                  mode="multiple" 
                  placeholder="選擇部門" 
                  style="width: 200px"
                >
                  <SelectOption 
                    v-for="option in departmentOptions" 
                    :key="option.value" 
                    :value="option.value"
                  >
                    {{ option.label }}
                  </SelectOption>
                </Select>
              </FormItem>
              
              <FormItem label="文件標籤">
                <Select 
                  v-model:value="filterForm.tags" 
                  mode="multiple" 
                  placeholder="選擇標籤" 
                  style="width: 200px"
                >
                  <SelectOption 
                    v-for="option in tagOptions" 
                    :key="option.value" 
                    :value="option.value"
                  >
                    {{ option.label }}
                  </SelectOption>
                </Select>
              </FormItem>
              
              <FormItem>
                <Space>
                  <Button type="primary" @click="applyFilter">
                    應用篩選
                  </Button>
                  <Button @click="clearFilter">
                    清除篩選
                  </Button>
                </Space>
              </FormItem>
            </Form>
          </div>
        </Card>
        
        <!-- 文件列表 -->
        <Card>
          <div class="mb-4 flex justify-between items-center">
            <div>
              <Checkbox 
                :checked="selectedFiles.length === filteredFiles.length && filteredFiles.length > 0"
                :indeterminate="selectedFiles.length > 0 && selectedFiles.length < filteredFiles.length"
                @change="handleSelectAll"
              >
                全選 ({{ selectedFiles.length }} / {{ filteredFiles.length }})
              </Checkbox>
            </div>
            
            <div class="text-gray-500">
              已選擇 {{ selectedFiles.length }} 個文件
            </div>
          </div>
          
          <Table
            :columns="columns"
            :data-source="filteredFiles"
            :row-selection="rowSelection"
            :pagination="{ pageSize: 10 }"
            row-key="id"
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
              
              <template v-if="column.key === 'status'">
                <Tag :color="getStatusTag(record.status).color">
                  {{ getStatusTag(record.status).text }}
                </Tag>
              </template>
              
              <template v-if="column.key === 'tags'">
                <Space>
                  <Tag v-for="tag in record.tags" :key="tag" color="blue">{{ tag }}</Tag>
                </Space>
              </template>
            </template>
          </Table>
        </Card>
      </div>

      <!-- 步驟 3: 配置參數 -->
      <div v-if="currentStep === 2">
        <h3 class="text-lg font-medium mb-4">配置操作參數</h3>
        
        <!-- 下載配置 -->
        <Card v-if="batchOperation === 'download'">
          <h4 class="font-medium mb-4">下載配置</h4>
          
          <Form layout="vertical">
            <FormItem label="下載格式">
              <RadioGroup v-model:value="batchConfig.download.format">
                <Radio value="original">原格式</Radio>
                <Radio value="pdf">轉換為PDF</Radio>
                <Radio value="zip">打包為ZIP</Radio>
              </RadioGroup>
            </FormItem>
            
            <FormItem label="壓縮級別" v-if="batchConfig.download.format === 'zip'">
              <Select v-model:value="batchConfig.download.compressionLevel" style="width: 200px">
                <SelectOption value="low">低壓縮</SelectOption>
                <SelectOption value="medium">中等壓縮</SelectOption>
                <SelectOption value="high">高壓縮</SelectOption>
              </Select>
            </FormItem>
            
            <FormItem>
              <Checkbox v-model:checked="batchConfig.download.includeMetadata">
                包含文件元數據
              </Checkbox>
            </FormItem>
          </Form>
        </Card>
        
        <!-- 移動配置 -->
        <Card v-if="batchOperation === 'move'">
          <h4 class="font-medium mb-4">移動配置</h4>
          
          <Form layout="vertical">
            <FormItem label="目標路徑" required>
              <Input 
                v-model:value="batchConfig.move.targetPath" 
                placeholder="請輸入目標路徑"
              />
            </FormItem>
            
            <FormItem>
              <Checkbox v-model:checked="batchConfig.move.createBackup">
                創建備份
              </Checkbox>
            </FormItem>
            
            <FormItem>
              <Checkbox v-model:checked="batchConfig.move.notifyUsers">
                通知相關用戶
              </Checkbox>
            </FormItem>
          </Form>
        </Card>
        
        <!-- 標籤配置 -->
        <Card v-if="batchOperation === 'tag'">
          <h4 class="font-medium mb-4">標籤配置</h4>
          
          <Form layout="vertical">
            <FormItem label="操作類型">
              <RadioGroup v-model:value="batchConfig.tag.operation">
                <Radio value="add">添加標籤</Radio>
                <Radio value="remove">移除標籤</Radio>
                <Radio value="replace">替換標籤</Radio>
              </RadioGroup>
            </FormItem>
            
            <FormItem label="標籤">
              <Select 
                v-model:value="batchConfig.tag.tags" 
                mode="multiple" 
                placeholder="選擇標籤"
              >
                <SelectOption 
                  v-for="option in tagOptions" 
                  :key="option.value" 
                  :value="option.value"
                >
                  {{ option.label }}
                </SelectOption>
              </Select>
            </FormItem>
          </Form>
        </Card>
        
        <!-- 刪除配置 -->
        <Card v-if="batchOperation === 'delete'">
          <h4 class="font-medium mb-4">刪除配置</h4>
          
          <Form layout="vertical">
            <FormItem label="刪除類型">
              <RadioGroup v-model:value="batchConfig.delete.deleteType">
                <Radio value="soft">軟刪除（移至回收站）</Radio>
                <Radio value="hard">硬刪除（永久刪除）</Radio>
              </RadioGroup>
            </FormItem>
            
            <FormItem label="刪除原因">
              <Textarea 
                v-model:value="batchConfig.delete.reason" 
                :rows="3" 
                placeholder="請輸入刪除原因"
              />
            </FormItem>
            
            <FormItem>
              <Checkbox v-model:checked="batchConfig.delete.notifyUsers">
                通知相關用戶
              </Checkbox>
            </FormItem>
          </Form>
        </Card>
      </div>

      <!-- 步驟 4: 確認執行 -->
      <div v-if="currentStep === 3">
        <h3 class="text-lg font-medium mb-4">確認操作信息</h3>
        
        <Alert
          message="請仔細檢查以下操作信息，確認無誤後點擊開始執行"
          type="warning"
          class="mb-4"
        />
        
        <Card>
          <div class="space-y-4">
            <div>
              <strong>操作類型:</strong> 
              {{ operationOptions.find(op => op.value === batchOperation)?.label }}
            </div>
            <div>
              <strong>文件數量:</strong> {{ selectedFiles.length }} 個
            </div>
            <div>
              <strong>選中文件:</strong>
              <div class="mt-2 max-h-40 overflow-y-auto">
                <Tag 
                  v-for="fileId in selectedFiles.slice(0, 10)" 
                  :key="fileId" 
                  class="mb-1"
                >
                  {{ fileData.find(f => f.id === fileId)?.fileName }}
                </Tag>
                <span v-if="selectedFiles.length > 10" class="text-gray-500">
                  等 {{ selectedFiles.length }} 個文件
                </span>
              </div>
            </div>
            
            <Divider />
            
            <div>
              <strong>操作配置:</strong>
              <div class="mt-2 text-sm text-gray-600">
                <pre>{{ JSON.stringify(batchConfig[batchOperation], null, 2) }}</pre>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <!-- 步驟 5: 執行結果 -->
      <div v-if="currentStep === 4">
        <h3 class="text-lg font-medium mb-4">執行結果</h3>
        
        <Card>
          <div class="space-y-4">
            <Progress 
              :percent="Math.floor((executionProgress.current / executionProgress.total) * 100)" 
              :status="executionProgress.status"
            />
            
            <div class="grid grid-cols-3 gap-4">
              <div>
                <div class="text-sm text-gray-500">當前文件</div>
                <div>{{ executionProgress.currentFile || '已完成' }}</div>
              </div>
              <div>
                <div class="text-sm text-gray-500">處理進度</div>
                <div>{{ executionProgress.current }} / {{ executionProgress.total }}</div>
              </div>
              <div>
                <div class="text-sm text-gray-500">成功數量</div>
                <div class="text-green-500">{{ executionProgress.results.length }}</div>
              </div>
            </div>
            
            <div v-if="executionProgress.warnings.length > 0">
              <h4 class="font-medium text-orange-500 mb-2">警告信息</h4>
              <Alert
                v-for="(warning, index) in executionProgress.warnings"
                :key="index"
                :message="warning"
                type="warning"
                class="mb-2"
              />
            </div>
            
            <div v-if="executionProgress.errors.length > 0">
              <h4 class="font-medium text-red-500 mb-2">錯誤信息</h4>
              <Alert
                v-for="(error, index) in executionProgress.errors"
                :key="index"
                :message="error"
                type="error"
                class="mb-2"
              />
            </div>
            
            <div class="flex justify-center space-x-4 pt-4">
              <Button 
                v-if="executionProgress.status === 'success' || executionProgress.status === 'exception'" 
                type="primary" 
                @click="handleBackToList"
              >
                返回文件列表
              </Button>
              <Button 
                v-if="executionProgress.status === 'success' || executionProgress.status === 'exception'" 
                @click="handleRestart"
              >
                繼續操作
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <!-- 步驟導航 -->
      <div class="flex justify-between mt-6" v-if="currentStep < 4">
        <Button 
          v-if="currentStep > 0" 
          @click="handlePrev"
        >
          上一步
        </Button>
        <div v-else></div>
        
        <Button 
          type="primary" 
          @click="handleNext"
        >
          {{ currentStep === 3 ? '開始執行' : '下一步' }}
        </Button>
      </div>
    </Card>
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
