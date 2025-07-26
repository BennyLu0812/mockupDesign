<template>
  <div class="content-server-system">
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
            {{ $t('page.contentServer.userInfo') }}
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
      <!-- 左側文檔管理區 -->
      <div class="document-area flex-1 p-4 bg-gray-50">
        <!-- 收件箱 -->
        <div class="document-section mb-6">
          <div class="section-header bg-blue-100 p-3 border-b border-blue-200">
            <h3 class="text-lg font-semibold text-blue-800">{{ $t('page.contentServer.inbox') }}</h3>
          </div>
          <div class="table-container bg-white">
            <Table 
              :dataSource="inboxDocuments" 
              :columns="documentColumns" 
              :pagination="false" 
              size="small"
              class="compact-table"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'status'">
                  <Tag :color="getStatusColor(record.status)">{{ getStatusText(record.status) }}</Tag>
                </template>
                <template v-else-if="column.key === 'actions'">
                  <Space size="small">
                    <Button type="link" size="small" @click="viewDocument(record)">
                      {{ $t('page.contentServer.view') }}
                    </Button>
                    <Button type="link" size="small" @click="processDocument(record)">
                      {{ $t('page.contentServer.process') }}
                    </Button>
                  </Space>
                </template>
              </template>
            </Table>
          </div>
        </div>

        <!-- 有待完成 -->
        <div class="document-section mb-6">
          <div class="section-header bg-blue-100 p-3 border-b border-blue-200">
            <h3 class="text-lg font-semibold text-blue-800">{{ $t('page.contentServer.pendingCompletion') }}</h3>
          </div>
          <div class="table-container bg-white">
            <Table 
              :dataSource="pendingDocuments" 
              :columns="documentColumns" 
              :pagination="false" 
              size="small"
              class="compact-table"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'status'">
                  <Tag :color="getStatusColor(record.status)">{{ getStatusText(record.status) }}</Tag>
                </template>
                <template v-else-if="column.key === 'actions'">
                  <Space size="small">
                    <Button type="link" size="small" @click="viewDocument(record)">
                      {{ $t('page.contentServer.view') }}
                    </Button>
                    <Button type="link" size="small" @click="editDocument(record)">
                      {{ $t('page.contentServer.edit') }}
                    </Button>
                    <Button type="link" size="small" danger @click="deleteDocument(record)">
                      {{ $t('page.contentServer.delete') }}
                    </Button>
                  </Space>
                </template>
              </template>
            </Table>
          </div>
        </div>

        <!-- 有待存驗 -->
        <div class="document-section mb-6">
          <div class="section-header bg-blue-100 p-3 border-b border-blue-200">
            <h3 class="text-lg font-semibold text-blue-800">{{ $t('page.contentServer.pendingVerification') }}</h3>
          </div>
          <div class="table-container bg-white">
            <Table 
              :dataSource="verificationDocuments" 
              :columns="documentColumns" 
              :pagination="false" 
              size="small"
              class="compact-table"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'status'">
                  <Tag :color="getStatusColor(record.status)">{{ getStatusText(record.status) }}</Tag>
                </template>
                <template v-else-if="column.key === 'actions'">
                  <Space size="small">
                    <Button type="link" size="small" @click="viewDocument(record)">
                      {{ $t('page.contentServer.view') }}
                    </Button>
                    <Button type="link" size="small" @click="verifyDocument(record)">
                      {{ $t('page.contentServer.verify') }}
                    </Button>
                  </Space>
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

// 表格列定義
const documentColumns = computed(() => [
  {
    title: $t('page.contentServer.applicationNumber'),
    dataIndex: 'applicationNumber',
    key: 'applicationNumber',
    width: 120,
  },
  {
    title: $t('page.contentServer.subject'),
    dataIndex: 'subject',
    key: 'subject',
  },
  {
    title: $t('page.contentServer.documentNumber'),
    dataIndex: 'documentNumber',
    key: 'documentNumber',
    width: 140,
  },
  {
    title: $t('page.contentServer.senderReceiver'),
    dataIndex: 'senderReceiver',
    key: 'senderReceiver',
    width: 150,
  },
  {
    title: $t('page.contentServer.registrationDate'),
    dataIndex: 'registrationDate',
    key: 'registrationDate',
    width: 120,
  },
  {
    title: $t('page.contentServer.dueDate'),
    dataIndex: 'dueDate',
    key: 'dueDate',
    width: 120,
  },
  {
    title: $t('page.contentServer.actions'),
    key: 'actions',
    width: 150,
  },
  {
    title: $t('page.contentServer.status'),
    key: 'status',
    width: 100,
  },
]);

// Mock 數據
const inboxDocuments = computed(() => {
  if (locale.value === 'zh-CN') {
    return [
      {
        key: '1',
        applicationNumber: 'APP001',
        subject: '環境保護法修正案審查',
        documentNumber: 'DOC2024001',
        senderReceiver: '環保署/立法院',
        registrationDate: '2024-01-15',
        dueDate: '2024-02-15',
        status: 'pending',
      },
      {
        key: '2',
        applicationNumber: 'APP002',
        subject: '能源政策白皮書',
        documentNumber: 'DOC2024002',
        senderReceiver: '經濟部/行政院',
        registrationDate: '2024-01-16',
        dueDate: '2024-02-16',
        status: 'inProgress',
      },
    ];
  } else {
    return [
      {
        key: '1',
        applicationNumber: 'APP001',
        subject: 'Environmental Protection Act Amendment Review',
        documentNumber: 'DOC2024001',
        senderReceiver: 'EPA/Legislative Yuan',
        registrationDate: '2024-01-15',
        dueDate: '2024-02-15',
        status: 'pending',
      },
      {
        key: '2',
        applicationNumber: 'APP002',
        subject: 'Energy Policy White Paper',
        documentNumber: 'DOC2024002',
        senderReceiver: 'MOEA/Executive Yuan',
        registrationDate: '2024-01-16',
        dueDate: '2024-02-16',
        status: 'inProgress',
      },
    ];
  }
});

const pendingDocuments = computed(() => {
  if (locale.value === 'zh-CN') {
    return [
      {
        key: '3',
        applicationNumber: 'APP003',
        subject: '數位發展部組織法草案',
        documentNumber: 'DOC2024003',
        senderReceiver: '數位發展部/行政院',
        registrationDate: '2024-01-17',
        dueDate: '2024-02-17',
        status: 'pending',
      },
    ];
  } else {
    return [
      {
        key: '3',
        applicationNumber: 'APP003',
        subject: 'Ministry of Digital Affairs Organization Act Draft',
        documentNumber: 'DOC2024003',
        senderReceiver: 'MODA/Executive Yuan',
        registrationDate: '2024-01-17',
        dueDate: '2024-02-17',
        status: 'pending',
      },
    ];
  }
});

const verificationDocuments = computed(() => {
  if (locale.value === 'zh-CN') {
    return [
      {
        key: '4',
        applicationNumber: 'APP004',
        subject: '金融科技發展與創新實驗條例',
        documentNumber: 'DOC2024004',
        senderReceiver: '金管會/立法院',
        registrationDate: '2024-01-18',
        dueDate: '2024-02-18',
        status: 'approved',
      },
    ];
  } else {
    return [
      {
        key: '4',
        applicationNumber: 'APP004',
        subject: 'Financial Technology Development and Innovation Experimentation Act',
        documentNumber: 'DOC2024004',
        senderReceiver: 'FSC/Legislative Yuan',
        registrationDate: '2024-01-18',
        dueDate: '2024-02-18',
        status: 'approved',
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

// 操作方法
const viewDocument = (record: any) => {
  message.info(`${$t('page.contentServer.view')}: ${record.subject}`);
};

const processDocument = (record: any) => {
  message.info(`${$t('page.contentServer.process')}: ${record.subject}`);
};

const editDocument = (record: any) => {
  message.info(`${$t('page.contentServer.edit')}: ${record.subject}`);
};

const deleteDocument = (record: any) => {
  message.warning(`${$t('page.contentServer.delete')}: ${record.subject}`);
};

const verifyDocument = (record: any) => {
  message.success(`${$t('page.contentServer.verify')}: ${record.subject}`);
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
.content-server-system {
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

.document-area {
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

.document-section {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.document-section:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-1px);
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

.document-section {
  animation: fadeIn 0.5s ease-out;
}

.document-section:nth-child(1) {
  animation-delay: 0.1s;
}

.document-section:nth-child(2) {
  animation-delay: 0.2s;
}

.document-section:nth-child(3) {
  animation-delay: 0.3s;
}
</style>
