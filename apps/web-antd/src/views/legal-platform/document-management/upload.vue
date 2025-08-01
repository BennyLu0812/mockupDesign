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
  Upload,
  message,
  Progress,
  Tag,
  Textarea,
  DatePicker,
  Radio,
  RadioGroup,
  Divider,
  Steps,
  Step,
  Alert,
} from 'ant-design-vue';

const router = useRouter();

// 當前步驟
const currentStep = ref(0);

// 上傳方式
const uploadMethod = ref('local');

// 文件列表
const fileList = ref([]);

// 文件信息表單
const fileForm = reactive({
  fileName: '',
  fileVersion: 'v1.0',
  fileSource: '本地上傳',
  relatedProject: '',
  fileStatus: 'unpublished',
  description: '',
  tags: [],
  customAttributes: {
    department: '',
    category: '',
    confidentiality: 'internal',
  },
});

// 批量文件信息
const batchFileInfo = reactive({
  fileSource: '本地上傳',
  relatedProject: '',
  fileStatus: 'unpublished',
  tags: [],
  customAttributes: {
    department: '',
    category: '',
    confidentiality: 'internal',
  },
});

// 上傳進度
const uploadProgress = reactive({
  isUploading: false,
  currentFile: '',
  uploadedCount: 0,
  totalCount: 0,
  percentage: 0,
  speed: '0 MB/s',
  timeRemaining: '計算中...',
  errors: [],
  warnings: [],
});

// 表單驗證規則
const rules = {
  fileName: [
    { required: true, message: '請輸入文件名稱', trigger: 'blur' },
  ],
  fileVersion: [
    { required: true, message: '請輸入文件版本', trigger: 'blur' },
  ],
  relatedProject: [
    { required: true, message: '請選擇相關項目', trigger: 'change' },
  ],
};

// 項目選項
const projectOptions = [
  { label: '人事管理系統', value: 'hr-system' },
  { label: '法律諮詢項目', value: 'legal-consulting' },
  { label: '項目管理系統', value: 'project-management' },
  { label: '董事會會議', value: 'board-meeting' },
  { label: '市場推廣', value: 'marketing' },
];

// 文件狀態選項
const fileStatusOptions = [
  { label: $t('page.legalPlatform.published'), value: 'published' },
  { label: $t('page.legalPlatform.unpublished'), value: 'unpublished' },
  { label: $t('page.legalPlatform.transitional'), value: 'transitional' },
];

// 部門選項
const departmentOptions = [
  { label: '法務部', value: 'legal' },
  { label: '人事部', value: 'hr' },
  { label: '財務部', value: 'finance' },
  { label: '市場部', value: 'marketing' },
  { label: '技術部', value: 'tech' },
];

// 分類選項
const categoryOptions = [
  { label: '合同模板', value: 'contract-template' },
  { label: '案例分析', value: 'case-analysis' },
  { label: '統計報表', value: 'statistics' },
  { label: '會議記錄', value: 'meeting-record' },
  { label: '宣傳材料', value: 'promotion' },
];

// 機密等級選項
const confidentialityOptions = [
  { label: '公開', value: 'public' },
  { label: '內部', value: 'internal' },
  { label: '機密', value: 'confidential' },
  { label: '絕密', value: 'top-secret' },
];

// 標籤選項
const tagOptions = [
  { label: '合同', value: 'contract' },
  { label: '模板', value: 'template' },
  { label: '法律', value: 'legal' },
  { label: '案例', value: 'case' },
  { label: '分析', value: 'analysis' },
  { label: '統計', value: 'statistics' },
  { label: '會議', value: 'meeting' },
  { label: '宣傳', value: 'promotion' },
];

// 步驟配置
const steps = [
  { title: '選擇上傳方式', description: '選擇本地上傳或掃描上傳' },
  { title: '選擇文件', description: '選擇要上傳的文件' },
  { title: '填寫信息', description: '填寫文件相關信息' },
  { title: '確認上傳', description: '確認信息並開始上傳' },
  { title: '上傳進度', description: '監控上傳進度' },
];

// 支持的文件格式
const supportedFormats = [
  'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',
  'txt', 'rtf', 'tiff', 'tif', 'jpg', 'jpeg', 'png', 'gif',
  'mp3', 'wav', 'mp4', 'avi', 'mov', 'wmv'
];

const formRef = ref();

// 文件上傳前檢查
const beforeUpload = (file: any) => {
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  
  if (!supportedFormats.includes(fileExtension)) {
    message.error(`不支持的文件格式: ${fileExtension}`);
    return false;
  }
  
  const isLt100M = file.size / 1024 / 1024 < 100;
  if (!isLt100M) {
    message.error('文件大小不能超過 100MB!');
    return false;
  }
  
  return true;
};

// 文件上傳變化
const handleUploadChange = (info: any) => {
  fileList.value = info.fileList;
  
  if (fileList.value.length === 1 && !fileForm.fileName) {
    const fileName = fileList.value[0].name;
    fileForm.fileName = fileName.substring(0, fileName.lastIndexOf('.'));
  }
};

// 移除文件
const handleRemoveFile = (file: any) => {
  const index = fileList.value.findIndex(item => item.uid === file.uid);
  if (index > -1) {
    fileList.value.splice(index, 1);
  }
};

// 下一步
const handleNext = () => {
  if (currentStep.value === 1) {
    if (fileList.value.length === 0) {
      message.error('請選擇要上傳的文件');
      return;
    }
  } else if (currentStep.value === 2) {
    // 驗證表單
    if (fileList.value.length === 1) {
      // 單文件上傳，驗證詳細信息
      if (!fileForm.fileName || !fileForm.relatedProject) {
        message.error('請填寫完整的文件信息');
        return;
      }
    } else {
      // 批量上傳，驗證基本信息
      if (!batchFileInfo.relatedProject) {
        message.error('請選擇相關項目');
        return;
      }
    }
  } else if (currentStep.value === 3) {
    // 開始上傳
    startUpload();
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
  fileList.value = [];
  uploadProgress.isUploading = false;
  uploadProgress.percentage = 0;
  uploadProgress.uploadedCount = 0;
  uploadProgress.totalCount = 0;
  uploadProgress.errors = [];
  uploadProgress.warnings = [];
  
  // 重置表單
  Object.assign(fileForm, {
    fileName: '',
    fileVersion: 'v1.0',
    fileSource: '本地上傳',
    relatedProject: '',
    fileStatus: 'unpublished',
    description: '',
    tags: [],
    customAttributes: {
      department: '',
      category: '',
      confidentiality: 'internal',
    },
  });
};

// 開始上傳
const startUpload = () => {
  uploadProgress.isUploading = true;
  uploadProgress.totalCount = fileList.value.length;
  uploadProgress.uploadedCount = 0;
  uploadProgress.percentage = 0;
  uploadProgress.errors = [];
  uploadProgress.warnings = [];
  
  // 模擬上傳進度
  const interval = setInterval(() => {
    if (uploadProgress.uploadedCount < uploadProgress.totalCount) {
      uploadProgress.uploadedCount++;
      uploadProgress.percentage = Math.floor(
        (uploadProgress.uploadedCount / uploadProgress.totalCount) * 100
      );
      uploadProgress.currentFile = fileList.value[uploadProgress.uploadedCount - 1]?.name || '';
      uploadProgress.speed = `${(Math.random() * 5 + 2).toFixed(1)} MB/s`;
      
      const remaining = uploadProgress.totalCount - uploadProgress.uploadedCount;
      uploadProgress.timeRemaining = remaining > 0 ? `約 ${remaining * 2} 秒` : '已完成';
      
      // 模擬一些警告
      if (Math.random() < 0.1 && uploadProgress.warnings.length < 2) {
        uploadProgress.warnings.push(`警告: 文件 ${uploadProgress.currentFile} 可能包含敏感信息`);
      }
    } else {
      uploadProgress.isUploading = false;
      uploadProgress.percentage = 100;
      uploadProgress.currentFile = '';
      uploadProgress.timeRemaining = '已完成';
      clearInterval(interval);
      message.success('文件上傳完成！');
    }
  }, 1000);
};

// 停止上傳
const stopUpload = () => {
  uploadProgress.isUploading = false;
  message.warning('上傳已停止');
};

// 返回文件列表
const handleBackToList = () => {
  router.push('/legal-platform/document-management/list');
};

// 掃描上傳
const handleScanUpload = () => {
  message.info('正在連接掃描設備...');
  // 這裡可以集成掃描設備的API
};
</script>

<template>
  <Page>
    <!-- 頁面頭部 -->
    <Card class="mb-4">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-xl font-semibold mb-2">{{ $t('page.legalPlatform.documentUpload') }}</h2>
          <div class="text-gray-500">上傳文件到系統，支持多種格式和批量上傳</div>
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

    <!-- 上傳嚮導 -->
    <Card>
      <Steps :current="currentStep" class="mb-6">
        <Step 
          v-for="(step, index) in steps" 
          :key="index"
          :title="step.title" 
          :description="step.description"
        />
      </Steps>

      <!-- 步驟 1: 選擇上傳方式 -->
      <div v-if="currentStep === 0">
        <h3 class="text-lg font-medium mb-4">選擇上傳方式</h3>
        
        <Row :gutter="24">
          <Col :span="12">
            <Card 
              class="cursor-pointer border-2 transition-colors"
              :class="uploadMethod === 'local' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'"
              @click="uploadMethod = 'local'"
            >
              <div class="text-center py-8">
                <span class="icon-[lucide--upload] size-12 text-blue-500 mb-4 block mx-auto" />
                <h4 class="text-lg font-medium mb-2">{{ $t('page.legalPlatform.localUpload') }}</h4>
                <p class="text-gray-500">從本地計算機選擇文件上傳</p>
                <div class="mt-4">
                  <Tag color="blue">支持批量上傳</Tag>
                  <Tag color="green">支持拖拽上傳</Tag>
                </div>
              </div>
            </Card>
          </Col>
          
          <Col :span="12">
            <Card 
              class="cursor-pointer border-2 transition-colors"
              :class="uploadMethod === 'scan' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'"
              @click="uploadMethod = 'scan'"
            >
              <div class="text-center py-8">
                <span class="icon-[lucide--scanner] size-12 text-green-500 mb-4 block mx-auto" />
                <h4 class="text-lg font-medium mb-2">{{ $t('page.legalPlatform.scanUpload') }}</h4>
                <p class="text-gray-500">通過掃描設備直接上傳文件</p>
                <div class="mt-4">
                  <Tag color="green">高清掃描</Tag>
                  <Tag color="orange">OCR識別</Tag>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
        
        <Alert
          class="mt-4"
          message="支持的文件格式"
          :description="`${supportedFormats.join(', ').toUpperCase()}`"
          type="info"
        />
      </div>

      <!-- 步驟 2: 選擇文件 -->
      <div v-if="currentStep === 1">
        <h3 class="text-lg font-medium mb-4">選擇文件</h3>
        
        <div v-if="uploadMethod === 'local'">
          <Upload.Dragger
            v-model:file-list="fileList"
            :before-upload="beforeUpload"
            @change="handleUploadChange"
            @remove="handleRemoveFile"
            multiple
            :show-upload-list="{ showRemoveIcon: true, showPreviewIcon: false }"
          >
            <p class="ant-upload-drag-icon">
              <span class="icon-[lucide--upload-cloud] size-12 text-blue-500" />
            </p>
            <p class="ant-upload-text">點擊或拖拽文件到此區域上傳</p>
            <p class="ant-upload-hint">
              支持單個或批量上傳。嚴禁上傳公司數據或其他敏感文件。
            </p>
          </Upload.Dragger>
        </div>
        
        <div v-else>
          <div class="text-center py-12 border-2 border-dashed border-gray-300 rounded">
            <span class="icon-[lucide--scanner] size-16 text-gray-400 mb-4 block mx-auto" />
            <h4 class="text-lg font-medium mb-2">掃描上傳</h4>
            <p class="text-gray-500 mb-4">請確保掃描設備已連接並開啟</p>
            <Button type="primary" @click="handleScanUpload">
              <template #icon>
                <span class="icon-[lucide--scanner] size-4" />
              </template>
              開始掃描
            </Button>
          </div>
        </div>
        
        <div v-if="fileList.length > 0" class="mt-4">
          <Alert
            :message="`已選擇 ${fileList.length} 個文件`"
            type="success"
          />
        </div>
      </div>

      <!-- 步驟 3: 填寫信息 -->
      <div v-if="currentStep === 2">
        <h3 class="text-lg font-medium mb-4">填寫文件信息</h3>
        
        <!-- 單文件詳細信息 -->
        <div v-if="fileList.length === 1">
          <Form
            ref="formRef"
            :model="fileForm"
            :rules="rules"
            layout="vertical"
          >
            <Row :gutter="16">
              <Col :span="12">
                <FormItem name="fileName" :label="$t('page.legalPlatform.fileName')">
                  <Input v-model:value="fileForm.fileName" />
                </FormItem>
              </Col>
              <Col :span="12">
                <FormItem name="fileVersion" :label="$t('page.legalPlatform.fileVersion')">
                  <Input v-model:value="fileForm.fileVersion" />
                </FormItem>
              </Col>
            </Row>
            
            <Row :gutter="16">
              <Col :span="12">
                <FormItem name="fileSource" :label="$t('page.legalPlatform.fileSource')">
                  <Input v-model:value="fileForm.fileSource" readonly />
                </FormItem>
              </Col>
              <Col :span="12">
                <FormItem name="relatedProject" :label="$t('page.legalPlatform.relatedProject')">
                  <Select v-model:value="fileForm.relatedProject">
                    <SelectOption 
                      v-for="option in projectOptions" 
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
              <Col :span="12">
                <FormItem name="fileStatus" :label="$t('page.legalPlatform.fileStatus')">
                  <Select v-model:value="fileForm.fileStatus">
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
              <Col :span="12">
                <FormItem name="tags" label="標籤">
                  <Select 
                    v-model:value="fileForm.tags" 
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
              </Col>
            </Row>
            
            <FormItem name="description" label="文件描述">
              <Textarea 
                v-model:value="fileForm.description" 
                :rows="3" 
                placeholder="請輸入文件描述"
              />
            </FormItem>
            
            <Divider>自定義屬性</Divider>
            
            <Row :gutter="16">
              <Col :span="8">
                <FormItem label="所屬部門">
                  <Select v-model:value="fileForm.customAttributes.department">
                    <SelectOption 
                      v-for="option in departmentOptions" 
                      :key="option.value" 
                      :value="option.value"
                    >
                      {{ option.label }}
                    </SelectOption>
                  </Select>
                </FormItem>
              </Col>
              <Col :span="8">
                <FormItem label="文件分類">
                  <Select v-model:value="fileForm.customAttributes.category">
                    <SelectOption 
                      v-for="option in categoryOptions" 
                      :key="option.value" 
                      :value="option.value"
                    >
                      {{ option.label }}
                    </SelectOption>
                  </Select>
                </FormItem>
              </Col>
              <Col :span="8">
                <FormItem label="機密等級">
                  <Select v-model:value="fileForm.customAttributes.confidentiality">
                    <SelectOption 
                      v-for="option in confidentialityOptions" 
                      :key="option.value" 
                      :value="option.value"
                    >
                      {{ option.label }}
                    </SelectOption>
                  </Select>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
        
        <!-- 批量文件基本信息 -->
        <div v-else>
          <Alert
            :message="`批量上傳 ${fileList.length} 個文件`"
            description="以下信息將應用到所有文件，上傳後可以單獨編輯每個文件的詳細信息。"
            type="info"
            class="mb-4"
          />
          
          <Form layout="vertical">
            <Row :gutter="16">
              <Col :span="12">
                <FormItem :label="$t('page.legalPlatform.relatedProject')">
                  <Select v-model:value="batchFileInfo.relatedProject">
                    <SelectOption 
                      v-for="option in projectOptions" 
                      :key="option.value" 
                      :value="option.value"
                    >
                      {{ option.label }}
                    </SelectOption>
                  </Select>
                </FormItem>
              </Col>
              <Col :span="12">
                <FormItem :label="$t('page.legalPlatform.fileStatus')">
                  <Select v-model:value="batchFileInfo.fileStatus">
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
              <Col :span="8">
                <FormItem label="所屬部門">
                  <Select v-model:value="batchFileInfo.customAttributes.department">
                    <SelectOption 
                      v-for="option in departmentOptions" 
                      :key="option.value" 
                      :value="option.value"
                    >
                      {{ option.label }}
                    </SelectOption>
                  </Select>
                </FormItem>
              </Col>
              <Col :span="8">
                <FormItem label="文件分類">
                  <Select v-model:value="batchFileInfo.customAttributes.category">
                    <SelectOption 
                      v-for="option in categoryOptions" 
                      :key="option.value" 
                      :value="option.value"
                    >
                      {{ option.label }}
                    </SelectOption>
                  </Select>
                </FormItem>
              </Col>
              <Col :span="8">
                <FormItem label="機密等級">
                  <Select v-model:value="batchFileInfo.customAttributes.confidentiality">
                    <SelectOption 
                      v-for="option in confidentialityOptions" 
                      :key="option.value" 
                      :value="option.value"
                    >
                      {{ option.label }}
                    </SelectOption>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            
            <FormItem label="標籤">
              <Select 
                v-model:value="batchFileInfo.tags" 
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
        </div>
      </div>

      <!-- 步驟 4: 確認上傳 -->
      <div v-if="currentStep === 3">
        <h3 class="text-lg font-medium mb-4">確認上傳信息</h3>
        
        <Alert
          message="請仔細檢查以下上傳信息，確認無誤後點擊開始上傳"
          type="warning"
          class="mb-4"
        />
        
        <Card>
          <div class="space-y-4">
            <div>
              <strong>上傳方式:</strong> {{ uploadMethod === 'local' ? '本地上傳' : '掃描上傳' }}
            </div>
            <div>
              <strong>文件數量:</strong> {{ fileList.length }} 個
            </div>
            <div>
              <strong>文件列表:</strong>
              <div class="mt-2">
                <Tag 
                  v-for="file in fileList.slice(0, 5)" 
                  :key="file.uid" 
                  class="mb-1"
                >
                  {{ file.name }}
                </Tag>
                <span v-if="fileList.length > 5" class="text-gray-500">等 {{ fileList.length }} 個文件</span>
              </div>
            </div>
            <Divider />
            <div v-if="fileList.length === 1">
              <strong>文件信息:</strong>
              <div class="mt-2 grid grid-cols-2 gap-4">
                <div>文件名稱: {{ fileForm.fileName }}</div>
                <div>文件版本: {{ fileForm.fileVersion }}</div>
                <div>相關項目: {{ projectOptions.find(p => p.value === fileForm.relatedProject)?.label }}</div>
                <div>文件狀態: {{ fileStatusOptions.find(s => s.value === fileForm.fileStatus)?.label }}</div>
                <div>所屬部門: {{ departmentOptions.find(d => d.value === fileForm.customAttributes.department)?.label }}</div>
                <div>機密等級: {{ confidentialityOptions.find(c => c.value === fileForm.customAttributes.confidentiality)?.label }}</div>
              </div>
            </div>
            <div v-else>
              <strong>批量信息:</strong>
              <div class="mt-2 grid grid-cols-2 gap-4">
                <div>相關項目: {{ projectOptions.find(p => p.value === batchFileInfo.relatedProject)?.label }}</div>
                <div>文件狀態: {{ fileStatusOptions.find(s => s.value === batchFileInfo.fileStatus)?.label }}</div>
                <div>所屬部門: {{ departmentOptions.find(d => d.value === batchFileInfo.customAttributes.department)?.label }}</div>
                <div>機密等級: {{ confidentialityOptions.find(c => c.value === batchFileInfo.customAttributes.confidentiality)?.label }}</div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <!-- 步驟 5: 上傳進度 -->
      <div v-if="currentStep === 4">
        <h3 class="text-lg font-medium mb-4">上傳進度</h3>
        
        <Card>
          <div class="space-y-4">
            <Progress 
              :percent="uploadProgress.percentage" 
              :status="uploadProgress.isUploading ? 'active' : 'success'"
            />
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <div class="text-sm text-gray-500">當前文件</div>
                <div>{{ uploadProgress.currentFile || '準備中...' }}</div>
              </div>
              <div>
                <div class="text-sm text-gray-500">上傳進度</div>
                <div>{{ uploadProgress.uploadedCount }} / {{ uploadProgress.totalCount }}</div>
              </div>
              <div>
                <div class="text-sm text-gray-500">上傳速度</div>
                <div>{{ uploadProgress.speed }}</div>
              </div>
              <div>
                <div class="text-sm text-gray-500">剩餘時間</div>
                <div>{{ uploadProgress.timeRemaining }}</div>
              </div>
            </div>
            
            <div v-if="uploadProgress.warnings.length > 0">
              <Alert
                v-for="(warning, index) in uploadProgress.warnings"
                :key="index"
                :message="warning"
                type="warning"
                class="mb-2"
              />
            </div>
            
            <div v-if="uploadProgress.errors.length > 0">
              <Alert
                v-for="(error, index) in uploadProgress.errors"
                :key="index"
                :message="error"
                type="error"
                class="mb-2"
              />
            </div>
            
            <div class="flex justify-center space-x-4">
              <Button 
                v-if="uploadProgress.isUploading" 
                type="primary" 
                danger 
                @click="stopUpload"
              >
                停止上傳
              </Button>
              <Button 
                v-if="!uploadProgress.isUploading && uploadProgress.percentage === 100" 
                type="primary" 
                @click="handleBackToList"
              >
                返回文件列表
              </Button>
              <Button 
                v-if="!uploadProgress.isUploading && uploadProgress.percentage === 100" 
                @click="handleRestart"
              >
                繼續上傳
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
          {{ currentStep === 3 ? '開始上傳' : '下一步' }}
        </Button>
      </div>
    </Card>
  </Page>
</template>

<style scoped>
.ant-card {
  border-radius: 8px;
}
</style>