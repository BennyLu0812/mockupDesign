<template>
  <div class="document-details-system">
    <!-- 頂部導航區 -->
    <div class="header-nav bg-blue-800 text-white p-4">
      <div class="flex justify-between items-center">
        <div class="flex items-center space-x-6">
          <h1 class="text-xl font-bold">{{ $t('page.contentServer.title') }}</h1>
          <nav class="flex space-x-4">
            <a href="#" class="hover:text-blue-200 font-semibold border-b-2 border-white">{{ $t('page.contentServer.addNew') }}</a>
            <a href="#" class="hover:text-blue-200">{{ $t('page.contentServer.myContentServer') }}</a>
            <a href="#" class="hover:text-blue-200">{{ $t('page.contentServer.browseContent') }}</a>
            <a href="#" class="hover:text-blue-200">{{ $t('page.contentServer.contentManagement') }}</a>
            <a href="#" class="hover:text-blue-200">{{ $t('page.contentServer.systemManagement') }}</a>
            <a href="#" class="hover:text-blue-200">{{ $t('page.contentServer.exportReport') }}</a>
          </nav>
        </div>
        <div class="flex items-center space-x-4">
          <!-- 語言切換按鈕 -->
          <Button 
            type="primary" 
            ghost 
            size="small" 
            @click="toggleLanguage"
            class="language-toggle-btn"
          >
            <template #icon>
              <span class="icon-[lucide--globe] size-4" />
            </template>
            {{ $t('page.contentServer.languageSwitch') }}
          </Button>
          <div class="text-sm">
            {{ currentUser }}
          </div>
          <Button type="link" size="small" class="text-white hover:text-blue-200" @click="logout">
            {{ $t('page.contentServer.logout') }}
          </Button>
          <Button type="link" size="small" class="text-white hover:text-blue-200">
            {{ $t('page.contentServer.help') }}
          </Button>
        </div>
      </div>
    </div>

    <div class="main-content flex">
      <!-- 左側文檔詳情區 -->
      <div class="document-details-area flex-1 p-4 bg-gray-50">
        <!-- 基本情況 -->
        <div class="info-section mb-6">
          <div class="section-header bg-blue-100 p-3 border-b border-blue-200">
            <h3 class="text-lg font-semibold text-blue-800">{{ $t('page.contentServer.basicInformation') }}</h3>
          </div>
          <div class="section-content bg-white p-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="info-item">
                <label class="block text-sm font-medium text-gray-600 mb-1">{{ $t('page.contentServer.documentNumber') }}</label>
                <div class="text-sm text-gray-900">{{ currentDocument.documentNumber }}</div>
              </div>
              <div class="info-item">
                <label class="block text-sm font-medium text-gray-600 mb-1">{{ $t('page.contentServer.registrationDate') }}</label>
                <div class="text-sm text-gray-900">{{ currentDocument.registrationDate }}</div>
              </div>
              <div class="info-item">
                <label class="block text-sm font-medium text-gray-600 mb-1">{{ $t('page.contentServer.senderReceiver') }}</label>
                <div class="text-sm text-gray-900">{{ currentDocument.senderReceiver }}</div>
              </div>
              <div class="info-item">
                <label class="block text-sm font-medium text-gray-600 mb-1">{{ $t('page.contentServer.dueDate') }}</label>
                <div class="text-sm text-gray-900">{{ currentDocument.dueDate }}</div>
              </div>
              <div class="info-item">
                <label class="block text-sm font-medium text-gray-600 mb-1">{{ $t('page.contentServer.status') }}</label>
                <Tag :color="getStatusColor(currentDocument.status)">{{ getStatusText(currentDocument.status) }}</Tag>
              </div>
              <div class="info-item">
                <label class="block text-sm font-medium text-gray-600 mb-1">{{ $t('page.contentServer.priority') }}</label>
                <Tag :color="getPriorityColor(currentDocument.priority)">{{ getPriorityText(currentDocument.priority) }}</Tag>
              </div>
              <div class="info-item">
                <label class="block text-sm font-medium text-gray-600 mb-1">{{ $t('page.contentServer.category') }}</label>
                <div class="text-sm text-gray-900">{{ currentDocument.category }}</div>
              </div>
              <div class="info-item">
                <label class="block text-sm font-medium text-gray-600 mb-1">{{ $t('page.contentServer.department') }}</label>
                <div class="text-sm text-gray-900">{{ currentDocument.department }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 信息內容 -->
        <div class="info-section mb-6">
          <div class="section-header bg-blue-100 p-3 border-b border-blue-200">
            <h3 class="text-lg font-semibold text-blue-800">{{ $t('page.contentServer.informationContent') }}</h3>
          </div>
          <div class="section-content bg-white p-4">
            <div class="content-area">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-600 mb-2">{{ $t('page.contentServer.subject') }}</label>
                <div class="text-base text-gray-900 font-medium">{{ currentDocument.subject }}</div>
              </div>
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-600 mb-2">{{ $t('page.contentServer.content') }}</label>
                <div class="text-sm text-gray-900 leading-relaxed bg-gray-50 p-3 rounded border">
                  {{ currentDocument.content }}
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-2">{{ $t('page.contentServer.remarks') }}</label>
                <div class="text-sm text-gray-900 leading-relaxed">
                  {{ currentDocument.remarks }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 附件 -->
        <div class="info-section mb-6">
          <div class="section-header bg-blue-100 p-3 border-b border-blue-200">
            <h3 class="text-lg font-semibold text-blue-800">{{ $t('page.contentServer.attachments') }}</h3>
          </div>
          <div class="section-content bg-white">
            <Table 
              :dataSource="attachments" 
              :columns="attachmentColumns" 
              :pagination="false" 
              size="small"
              class="compact-table"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'fileSize'">
                  <span class="text-xs text-gray-600">{{ formatFileSize(record.fileSize) }}</span>
                </template>
                <template v-else-if="column.key === 'actions'">
                  <Space size="small">
                    <Button type="link" size="small" @click="downloadFile(record)">
                      <template #icon>
                        <span class="icon-[lucide--download] size-3" />
                      </template>
                      {{ $t('page.contentServer.download') }}
                    </Button>
                    <Button type="link" size="small" @click="previewFile(record)">
                      <template #icon>
                        <span class="icon-[lucide--eye] size-3" />
                      </template>
                      {{ $t('page.contentServer.preview') }}
                    </Button>
                  </Space>
                </template>
              </template>
            </Table>
          </div>
        </div>

        <!-- 操作歷史 -->
        <div class="info-section mb-6">
          <div class="section-header bg-blue-100 p-3 border-b border-blue-200">
            <h3 class="text-lg font-semibold text-blue-800">{{ $t('page.contentServer.operationHistory') }}</h3>
          </div>
          <div class="section-content bg-white">
            <Table 
              :dataSource="operationHistory" 
              :columns="historyColumns" 
              :pagination="false" 
              size="small"
              class="compact-table"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'operation'">
                  <Tag :color="getOperationColor(record.operation)">{{ getOperationText(record.operation) }}</Tag>
                </template>
              </template>
            </Table>
          </div>
        </div>
      </div>

      <!-- 右側搜尋區 -->
      <div class="search-area w-80 p-4 bg-white border-l border-gray-200">
        <div class="search-section">
          <h3 class="text-lg font-semibold mb-4 text-blue-800">{{ $t('page.contentServer.search') }}</h3>
          
          <div class="search-form space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">{{ $t('page.contentServer.documentNumberSearch') }}</label>
              <Input v-model:value="searchForm.documentNumber" placeholder="請輸入文件編號" />
            </div>
            
            <div>
              <label class="block text-sm font-medium mb-1">{{ $t('page.contentServer.senderSearch') }}</label>
              <Input v-model:value="searchForm.sender" placeholder="請輸入發送者" />
            </div>
            
            <div>
              <label class="block text-sm font-medium mb-1">{{ $t('page.contentServer.subjectSearch') }}</label>
              <Input v-model:value="searchForm.subject" placeholder="請輸入主旨" />
            </div>
            
            <div>
              <label class="block text-sm font-medium mb-1">{{ $t('page.contentServer.status') }}</label>
              <Select v-model:value="searchForm.status" class="w-full" placeholder="請選擇狀態">
                <SelectOption value="pending">{{ $t('page.contentServer.pending') }}</SelectOption>
                <SelectOption value="completed">{{ $t('page.contentServer.completed') }}</SelectOption>
                <SelectOption value="inProgress">{{ $t('page.contentServer.inProgress') }}</SelectOption>
                <SelectOption value="rejected">{{ $t('page.contentServer.rejected') }}</SelectOption>
                <SelectOption value="approved">{{ $t('page.contentServer.approved') }}</SelectOption>
              </Select>
            </div>
            
            <div class="flex space-x-2">
              <Button type="primary" @click="performSearch" class="flex-1">
                {{ $t('page.contentServer.searchButton') }}
              </Button>
              <Button @click="clearSearch" class="flex-1">
                {{ $t('page.contentServer.clearButton') }}
              </Button>
            </div>
            
            <div>
              <Button type="link" @click="toggleAdvancedSearch" class="p-0">
                {{ $t('page.contentServer.advancedSearch') }}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Button, Input, Select, SelectOption, Space, Table, Tag, message } from 'ant-design-vue';
import { $t, useI18n, loadLocaleMessages } from '#/locales';
import { updatePreferences } from '@vben/preferences';

// 國際化
const { locale } = useI18n();

// 搜尋表單
const searchForm = ref({
  documentNumber: '',
  sender: '',
  subject: '',
  status: undefined
});

// 當前用戶信息
const currentUser = computed(() => {
  if (locale.value === 'zh-CN') {
    return 'DAP ECO, TEST 你好';
  } else {
    return 'DAP ECO, TEST Hello';
  }
});

// 語言切換功能
const toggleLanguage = async () => {
  const newLocale = locale.value === 'zh-CN' ? 'en-US' : 'zh-CN';
  
  updatePreferences({
    app: {
      locale: newLocale,
    },
  });
  
  await loadLocaleMessages(newLocale);
  
  message.success(`Language switched to ${newLocale === 'zh-CN' ? '中文' : 'English'}`);
};

// 當前文檔信息
const currentDocument = computed(() => {
  if (locale.value === 'zh-CN') {
    return {
      documentNumber: 'DOC2024001',
      registrationDate: '2024-01-15',
      senderReceiver: '環保署/立法院',
      dueDate: '2024-02-15',
      status: 'pending',
      priority: 'high',
      category: '法案審查',
      department: '環境保護部',
      subject: '環境保護法修正案審查',
      content: '本次修正案主要針對環境保護法第三章「環境影響評估」進行修訂，增加對新興污染物的管制規定，強化環境監測機制，並提升違法行為的罰則。修正重點包括：1. 擴大環境影響評估適用範圍；2. 建立新興污染物清單制度；3. 強化環境監測數據公開透明；4. 提高違法罰金上限至新台幣一千萬元。',
      remarks: '此修正案已通過初審，目前進入二讀程序，預計於下月完成三讀。'
    };
  } else {
    return {
      documentNumber: 'DOC2024001',
      registrationDate: '2024-01-15',
      senderReceiver: 'EPA/Legislative Yuan',
      dueDate: '2024-02-15',
      status: 'pending',
      priority: 'high',
      category: 'Bill Review',
      department: 'Environmental Protection Department',
      subject: 'Environmental Protection Act Amendment Review',
      content: 'This amendment primarily revises Chapter 3 "Environmental Impact Assessment" of the Environmental Protection Act, adding regulations for emerging pollutants, strengthening environmental monitoring mechanisms, and enhancing penalties for violations. Key amendments include: 1. Expanding the scope of environmental impact assessment; 2. Establishing an emerging pollutants list system; 3. Strengthening transparency of environmental monitoring data; 4. Raising the maximum penalty to NT$10 million.',
      remarks: 'This amendment has passed the first reading and is currently in the second reading process, expected to complete the third reading next month.'
    };
  }
});

// 附件表格列定義
const attachmentColumns = computed(() => [
  {
    title: $t('page.contentServer.fileName'),
    dataIndex: 'fileName',
    key: 'fileName',
  },
  {
    title: $t('page.contentServer.fileFormat'),
    dataIndex: 'fileFormat',
    key: 'fileFormat',
    width: 100,
  },
  {
    title: $t('page.contentServer.fileSize'),
    dataIndex: 'fileSize',
    key: 'fileSize',
    width: 100,
  },
  {
    title: $t('page.contentServer.uploadTime'),
    dataIndex: 'uploadTime',
    key: 'uploadTime',
    width: 150,
  },
  {
    title: $t('page.contentServer.actions'),
    key: 'actions',
    width: 150,
  },
]);

// 操作歷史表格列定義
const historyColumns = computed(() => [
  {
    title: $t('page.contentServer.operationTime'),
    dataIndex: 'operationTime',
    key: 'operationTime',
    width: 150,
  },
  {
    title: $t('page.contentServer.operator'),
    dataIndex: 'operator',
    key: 'operator',
    width: 120,
  },
  {
    title: $t('page.contentServer.operation'),
    dataIndex: 'operation',
    key: 'operation',
    width: 100,
  },
  {
    title: $t('page.contentServer.remarks'),
    dataIndex: 'remarks',
    key: 'remarks',
  },
]);

// Mock 附件數據
const attachments = computed(() => {
  if (locale.value === 'zh-CN') {
    return [
      {
        key: '1',
        fileName: '環境保護法修正案條文對照表.pdf',
        fileFormat: 'PDF',
        fileSize: 2048576,
        uploadTime: '2024-01-15 10:30:00',
      },
      {
        key: '2',
        fileName: '環境影響評估技術規範.docx',
        fileFormat: 'DOCX',
        fileSize: 1536000,
        uploadTime: '2024-01-15 11:15:00',
      },
      {
        key: '3',
        fileName: '新興污染物清單草案.xlsx',
        fileFormat: 'XLSX',
        fileSize: 512000,
        uploadTime: '2024-01-15 14:20:00',
      },
    ];
  } else {
    return [
      {
        key: '1',
        fileName: 'Environmental Protection Act Amendment Comparison Table.pdf',
        fileFormat: 'PDF',
        fileSize: 2048576,
        uploadTime: '2024-01-15 10:30:00',
      },
      {
        key: '2',
        fileName: 'Environmental Impact Assessment Technical Specifications.docx',
        fileFormat: 'DOCX',
        fileSize: 1536000,
        uploadTime: '2024-01-15 11:15:00',
      },
      {
        key: '3',
        fileName: 'Emerging Pollutants List Draft.xlsx',
        fileFormat: 'XLSX',
        fileSize: 512000,
        uploadTime: '2024-01-15 14:20:00',
      },
    ];
  }
});

// Mock 操作歷史數據
const operationHistory = computed(() => {
  if (locale.value === 'zh-CN') {
    return [
      {
        key: '1',
        operationTime: '2024-01-15 09:00:00',
        operator: '張三',
        operation: 'created',
        remarks: '創建文檔',
      },
      {
        key: '2',
        operationTime: '2024-01-15 10:30:00',
        operator: '李四',
        operation: 'modified',
        remarks: '上傳附件文檔',
      },
      {
        key: '3',
        operationTime: '2024-01-16 14:15:00',
        operator: '王五',
        operation: 'reviewed',
        remarks: '完成初步審核',
      },
    ];
  } else {
    return [
      {
        key: '1',
        operationTime: '2024-01-15 09:00:00',
        operator: 'John Smith',
        operation: 'created',
        remarks: 'Document created',
      },
      {
        key: '2',
        operationTime: '2024-01-15 10:30:00',
        operator: 'Jane Doe',
        operation: 'modified',
        remarks: 'Attachment documents uploaded',
      },
      {
        key: '3',
        operationTime: '2024-01-16 14:15:00',
        operator: 'Bob Johnson',
        operation: 'reviewed',
        remarks: 'Preliminary review completed',
      },
    ];
  }
});

// 狀態相關函數
const getStatusColor = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: 'orange',
    completed: 'green',
    inProgress: 'blue',
    rejected: 'red',
    approved: 'green',
  };
  return statusMap[status] || 'default';
};

const getStatusText = (status: string) => {
  return $t(`page.contentServer.${status}`);
};

const getPriorityColor = (priority: string) => {
  const priorityMap: Record<string, string> = {
    high: 'red',
    medium: 'orange',
    low: 'green',
    urgent: 'magenta',
    normal: 'blue',
  };
  return priorityMap[priority] || 'default';
};

const getPriorityText = (priority: string) => {
  return $t(`page.contentServer.${priority}`);
};

const getOperationColor = (operation: string) => {
  const operationMap: Record<string, string> = {
    created: 'blue',
    modified: 'orange',
    reviewed: 'green',
    archived: 'gray',
  };
  return operationMap[operation] || 'default';
};

const getOperationText = (operation: string) => {
  return $t(`page.contentServer.${operation}`);
};

// 文件大小格式化
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// 操作方法
const downloadFile = (record: any) => {
  message.success(`${$t('page.contentServer.download')}: ${record.fileName}`);
};

const previewFile = (record: any) => {
  message.info(`${$t('page.contentServer.preview')}: ${record.fileName}`);
};

const performSearch = () => {
  message.info($t('page.contentServer.searchButton'));
};

const clearSearch = () => {
  searchForm.value = {
    documentNumber: '',
    sender: '',
    subject: '',
    status: undefined
  };
  message.success($t('page.contentServer.clearButton'));
};

const toggleAdvancedSearch = () => {
  message.info($t('page.contentServer.advancedSearch'));
};

const logout = () => {
  message.info($t('page.contentServer.logout'));
};
</script>

<style scoped>
.document-details-system {
  min-height: 100vh;
  background-color: #f8fafc;
}

.header-nav {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  background: linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%);
}

.main-content {
  min-height: calc(100vh - 80px);
}

.document-details-area {
  background: linear-gradient(to bottom, #f8fafc 0%, #f1f5f9 100%);
}

.section-header {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  border-bottom: 2px solid #3b82f6;
}

.section-header h3 {
  color: #1e40af;
  font-weight: 600;
}

.info-section {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.info-section:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-1px);
}

.section-content {
  border-radius: 0 0 8px 8px;
}

.info-item {
  padding: 8px 0;
}

.info-item label {
  color: #4b5563;
  font-weight: 500;
}

.content-area {
  line-height: 1.6;
}

.search-area {
  background-color: white;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
}

.search-form {
  background-color: #f9fafb;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.language-toggle-btn {
  border-color: rgba(255, 255, 255, 0.5) !important;
  color: white !important;
  transition: all 0.3s ease;
}

.language-toggle-btn:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
  border-color: white !important;
  transform: translateY(-1px);
}

:deep(.compact-table) {
  .ant-table-thead > tr > th {
    background-color: #f8fafc;
    border-bottom: 2px solid #e2e8f0;
    font-weight: 600;
    color: #374151;
    padding: 8px 12px;
    font-size: 12px;
  }
  
  .ant-table-tbody > tr > td {
    border-bottom: 1px solid #f1f5f9;
    padding: 6px 12px;
    font-size: 12px;
    transition: background-color 0.2s ease;
  }
  
  .ant-table-tbody > tr:hover > td {
    background-color: #f8fafc;
  }
  
  .ant-btn-link {
    padding: 0 4px;
    height: auto;
    font-size: 11px;
    transition: all 0.2s ease;
  }
  
  .ant-btn-link:hover {
    transform: translateY(-1px);
  }
}

/* 響應式設計 */
@media (max-width: 1024px) {
  .main-content {
    flex-direction: column;
  }
  
  .search-area {
    width: 100%;
    border-left: none;
    border-top: 1px solid #e5e7eb;
  }
}

@media (max-width: 768px) {
  .header-nav .flex {
    flex-direction: column;
    gap: 1rem;
  }
  
  .header-nav nav {
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .grid-cols-2 {
    grid-template-columns: 1fr;
  }
}

/* 動畫效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.info-section {
  animation: fadeIn 0.5s ease-out;
}

.info-section:nth-child(1) {
  animation-delay: 0.1s;
}

.info-section:nth-child(2) {
  animation-delay: 0.2s;
}

.info-section:nth-child(3) {
  animation-delay: 0.3s;
}

.info-section:nth-child(4) {
  animation-delay: 0.4s;
}

/* 狀態高亮 */
.ant-tag {
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 500;
}

/* 內容區域樣式 */
.content-area .bg-gray-50 {
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
}
</style>