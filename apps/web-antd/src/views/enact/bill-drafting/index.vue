<template>
  <div class="bill-drafting-system">
    <!-- 頂部導航區 -->
    <div class="header-nav bg-blue-800 text-white p-4">
      <div class="flex justify-between items-center">
        <div class="flex items-center space-x-6">
          <h1 class="text-xl font-bold">{{ $t('page.enact.title') }} {{ $t('page.enact.systemVersion') }} 4.3</h1>
          <nav class="flex space-x-4">
            <a href="#" class="hover:text-blue-200 font-semibold border-b-2 border-white">{{ $t('page.enact.draftingFiles') }}</a>
            <a href="#" class="hover:text-blue-200">{{ $t('page.enact.search') }}</a>
            <a href="#" class="hover:text-blue-200">{{ $t('page.enact.administration') }}</a>
            <a href="#" class="hover:text-blue-200">{{ $t('page.enact.logout') }}</a>
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
            {{ $t('page.enact.languageSwitch') }}
          </Button>
          <div class="text-sm">
            {{ $t('page.enact.userInfo') }}: {{ currentUser.name }} | {{ $t('page.enact.lastLogin') }}: {{ currentUser.lastLogin }}
          </div>
        </div>
      </div>
    </div>

    <!-- 子功能導航 -->
    <div class="sub-nav bg-gray-100 p-3 border-b">
      <div class="flex space-x-6">
        <a href="#" class="text-blue-600 hover:text-blue-800">{{ $t('page.enact.definitions') }}</a>
        <a href="#" class="text-blue-600 hover:text-blue-800 font-semibold border-b-2 border-blue-600">{{ $t('page.enact.currentFiles') }}</a>
        <a href="#" class="text-blue-600 hover:text-blue-800">{{ $t('page.enact.allFiles') }}</a>
        <a href="#" class="text-blue-600 hover:text-blue-800">{{ $t('page.enact.myActivities') }}</a>
      </div>
    </div>

    <!-- 文件信息區 -->
    <div class="file-info bg-white p-4 border-b shadow-sm">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-lg font-semibold">{{ currentBill.name }}</h2>
          <p class="text-gray-600">{{ currentBill.activity }}</p>
        </div>
        <div class="flex space-x-2">
          <span 
            :class="['px-3 py-1 rounded text-sm cursor-pointer transition-colors', 
                     activeTab === 'documents' ? 'bg-blue-100 text-blue-700 font-semibold' : 'bg-gray-200 text-gray-700 hover:bg-gray-300']"
            @click="activeTab = 'documents'"
          >
            {{ $t('page.enact.documents') }}
          </span>
          <span 
            :class="['px-3 py-1 rounded text-sm cursor-pointer transition-colors', 
                     activeTab === 'fileDetails' ? 'bg-blue-100 text-blue-700 font-semibold' : 'bg-gray-200 text-gray-700 hover:bg-gray-300']"
            @click="activeTab = 'fileDetails'"
          >
            {{ $t('page.enact.fileDetails') }}
          </span>
          <span 
            :class="['px-3 py-1 rounded text-sm cursor-pointer transition-colors', 
                     activeTab === 'notes' ? 'bg-blue-100 text-blue-700 font-semibold' : 'bg-gray-200 text-gray-700 hover:bg-gray-300']"
            @click="activeTab = 'notes'"
          >
            {{ $t('page.enact.notes') }}
          </span>
          <span 
            :class="['px-3 py-1 rounded text-sm cursor-pointer transition-colors', 
                     activeTab === 'nextStage' ? 'bg-blue-100 text-blue-700 font-semibold' : 'bg-gray-200 text-gray-700 hover:bg-gray-300']"
            @click="activeTab = 'nextStage'"
          >
            {{ $t('page.enact.nextDraftingStage') }}
          </span>
        </div>
      </div>
    </div>

    <!-- 文檔管理區 -->
    <div class="document-management p-4 bg-gray-50 min-h-screen">
      <!-- 篩選區 -->
      <div class="filters mb-6 bg-white p-4 rounded-lg shadow-sm">
        <div class="flex space-x-4">
          <Select v-model:value="selectedVersion" class="w-48">
            <SelectOption value="current">{{ $t('page.enact.currentVersions') }}</SelectOption>
            <SelectOption value="all">{{ $t('page.enact.allVersions') }}</SelectOption>
          </Select>
          <Select v-model:value="selectedDocType" class="w-48">
            <SelectOption value="all">{{ $t('page.enact.documentTypes') }}</SelectOption>
            <SelectOption value="bill">{{ $t('page.enact.bill') }}</SelectOption>
            <SelectOption value="amendment">{{ $t('page.enact.amendment') }}</SelectOption>
            <SelectOption value="report">{{ $t('page.enact.report') }}</SelectOption>
          </Select>
        </div>
      </div>

      <!-- 文檔列表 -->
      <div class="document-list space-y-6">
        <!-- Bill Documents -->
        <div class="document-group bg-white rounded-lg shadow-sm overflow-hidden">
          <div class="group-header bg-gray-50 p-4 border-b">
            <h3 class="text-lg font-semibold flex items-center">
              <span class="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
              {{ $t('page.enact.billDocuments') }}
            </h3>
          </div>
          <div class="table-container">
            <Table 
              :dataSource="billDocuments" 
              :columns="documentColumns" 
              :pagination="false" 
              size="small"
              class="compact-table"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'status'">
                  <span :class="getStatusClass(record.status)" class="w-3 h-3 rounded-full inline-block"></span>
                </template>
                <template v-else-if="column.key === 'operations'">
                  <Space size="small">
                    <Button type="link" size="small" danger @click="deleteDocument(record)">
                      {{ $t('page.enact.delete') }}
                    </Button>
                    <Button type="link" size="small" @click="downloadDocument(record)">
                      {{ $t('page.enact.download') }}
                    </Button>
                    <Button type="link" size="small" @click="createAmendment(record)">
                      {{ $t('page.enact.createAmendmentBill') }}
                    </Button>
                  </Space>
                </template>
              </template>
            </Table>
          </div>
        </div>

        <!-- Amendment Documents -->
        <div class="document-group bg-white rounded-lg shadow-sm overflow-hidden">
          <div class="group-header bg-gray-50 p-4 border-b">
            <h3 class="text-lg font-semibold flex items-center">
              <span class="w-3 h-3 bg-orange-500 rounded-full mr-3"></span>
              {{ $t('page.enact.amendmentDocuments') }}
            </h3>
          </div>
          <div class="table-container">
            <Table 
              :dataSource="amendmentDocuments" 
              :columns="documentColumns" 
              :pagination="false" 
              size="small"
              class="compact-table"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'status'">
                  <span :class="getStatusClass(record.status)" class="w-3 h-3 rounded-full inline-block"></span>
                </template>
                <template v-else-if="column.key === 'operations'">
                  <Space size="small">
                    <Button type="link" size="small" danger @click="deleteDocument(record)">
                      {{ $t('page.enact.delete') }}
                    </Button>
                    <Button type="link" size="small" @click="downloadDocument(record)">
                      {{ $t('page.enact.download') }}
                    </Button>
                  </Space>
                </template>
              </template>
            </Table>
          </div>
        </div>

        <!-- Report Documents -->
        <div class="document-group bg-white rounded-lg shadow-sm overflow-hidden">
          <div class="group-header bg-gray-50 p-4 border-b">
            <h3 class="text-lg font-semibold flex items-center">
              <span class="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
              {{ $t('page.enact.reportDocuments') }}
            </h3>
          </div>
          <div class="table-container">
            <Table 
              :dataSource="reportDocuments" 
              :columns="documentColumns" 
              :pagination="false" 
              size="small"
              class="compact-table"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'status'">
                  <span :class="getStatusClass(record.status)" class="w-3 h-3 rounded-full inline-block"></span>
                </template>
                <template v-else-if="column.key === 'operations'">
                  <Space size="small">
                    <Button type="link" size="small" danger @click="deleteDocument(record)">
                      {{ $t('page.enact.delete') }}
                    </Button>
                    <Button type="link" size="small" @click="downloadDocument(record)">
                      {{ $t('page.enact.download') }}
                    </Button>
                  </Space>
                </template>
              </template>
            </Table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Button, Select, SelectOption, Space, Table, message } from 'ant-design-vue';
import { $t, useI18n, loadLocaleMessages } from '#/locales';
import { updatePreferences, preferences } from '@vben/preferences';

// 國際化
const { locale } = useI18n();

// 響應式數據
const selectedVersion = ref('current');
const selectedDocType = ref('all');
const activeTab = ref('documents');

// 當前用戶信息
const currentUser = ref({
  name: 'Administrator',
  lastLogin: '2024-01-15 10:30:22'
});

// 當前法案信息
const currentBill = computed(() => {
  if (locale.value === 'zh-CN') {
    return {
      name: '草案法案：環境保護修正法案 2024',
      activity: '活動：立法審查程序'
    };
  } else {
    return {
      name: 'Draft Bill: Environmental Protection Amendment Act 2024',
      activity: 'Activity: Legislative Review Process'
    };
  }
});

// 語言切換功能
const toggleLanguage = async () => {
  const newLocale = locale.value === 'zh-CN' ? 'en-US' : 'zh-CN';
  
  // 更新偏好設置
  updatePreferences({
    app: {
      locale: newLocale,
    },
  });
  
  // 加載新語言的消息
  await loadLocaleMessages(newLocale);
  
  message.success(`Language switched to ${newLocale === 'zh-CN' ? '中文' : 'English'}`);
};

// 表格列定義
const documentColumns = computed(() => [
  {
    title: $t('page.enact.version'),
    dataIndex: 'version',
    key: 'version',
    width: 100,
  },
  {
    title: $t('page.enact.title'),
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: $t('page.enact.timestamp'),
    dataIndex: 'timestamp',
    key: 'timestamp',
    width: 180,
  },
  {
    title: $t('page.enact.status'),
    dataIndex: 'status',
    key: 'status',
    width: 80,
  },
  {
    title: $t('page.enact.operations'),
    key: 'operations',
    width: 300,
  },
]);

// Mock 數據 - 根據語言動態生成
const billDocuments = computed(() => {
  if (locale.value === 'zh-CN') {
    return [
      {
        key: '1',
        version: 'v1.0',
        title: '環境保護修正法案 2024 - 一讀',
        timestamp: '2024-01-15 14:30:22',
        status: 'draft',
      },
      {
        key: '2',
        version: 'v1.1',
        title: '環境保護修正法案 2024 - 委員會審查',
        timestamp: '2024-01-16 09:15:45',
        status: 'review',
      },
    ];
  } else {
    return [
      {
        key: '1',
        version: 'v1.0',
        title: 'Environmental Protection Amendment Act 2024 - First Reading',
        timestamp: '2024-01-15 14:30:22',
        status: 'draft',
      },
      {
        key: '2',
        version: 'v1.1',
        title: 'Environmental Protection Amendment Act 2024 - Committee Review',
        timestamp: '2024-01-16 09:15:45',
        status: 'review',
      },
    ];
  }
});

const amendmentDocuments = computed(() => {
  if (locale.value === 'zh-CN') {
    return [
      {
        key: '3',
        version: 'v1.0',
        title: '修正案 A1 - 碳排放標準',
        timestamp: '2024-01-17 11:20:33',
        status: 'pending',
      },
      {
        key: '4',
        version: 'v1.0',
        title: '修正案 A2 - 可再生能源激勵',
        timestamp: '2024-01-17 15:45:12',
        status: 'approved',
      },
    ];
  } else {
    return [
      {
        key: '3',
        version: 'v1.0',
        title: 'Amendment A1 - Carbon Emission Standards',
        timestamp: '2024-01-17 11:20:33',
        status: 'pending',
      },
      {
        key: '4',
        version: 'v1.0',
        title: 'Amendment A2 - Renewable Energy Incentives',
        timestamp: '2024-01-17 15:45:12',
        status: 'approved',
      },
    ];
  }
});

const reportDocuments = computed(() => {
  if (locale.value === 'zh-CN') {
    return [
      {
        key: '5',
        version: 'v1.0',
        title: '環境影響評估報告',
        timestamp: '2024-01-18 10:30:15',
        status: 'final',
      },
      {
        key: '6',
        version: 'v1.0',
        title: '立法委員會審查報告',
        timestamp: '2024-01-18 16:22:08',
        status: 'draft',
      },
    ];
  } else {
    return [
      {
        key: '5',
        version: 'v1.0',
        title: 'Environmental Impact Assessment Report',
        timestamp: '2024-01-18 10:30:15',
        status: 'final',
      },
      {
        key: '6',
        version: 'v1.0',
        title: 'Legislative Committee Review Report',
        timestamp: '2024-01-18 16:22:08',
        status: 'draft',
      },
    ];
  }
});

// 狀態樣式
const getStatusClass = (status: string) => {
  const statusMap: Record<string, string> = {
    draft: 'bg-red-500',
    review: 'bg-orange-500',
    pending: 'bg-yellow-500',
    approved: 'bg-green-500',
    final: 'bg-blue-500',
  };
  return statusMap[status] || 'bg-gray-500';
};

// 操作方法
const deleteDocument = (record: any) => {
  message.warning(`${$t('page.enact.delete')}: ${record.title}`);
};

const downloadDocument = (record: any) => {
  message.success(`${$t('page.enact.download')}: ${record.title}`);
};

const createAmendment = (record: any) => {
  message.info(`${$t('page.enact.createAmendmentBill')}: ${record.title}`);
};
</script>

<style scoped>
.bill-drafting-system {
  min-height: 100vh;
  background-color: #f8fafc;
}

.header-nav {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  background: linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%);
}

.sub-nav {
  border-bottom: 1px solid #e5e7eb;
  background-color: #f9fafb;
}

.file-info {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.document-management {
  background: linear-gradient(to bottom, #f8fafc 0%, #f1f5f9 100%);
}

.document-group {
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.document-group:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.group-header {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-bottom: 1px solid #e2e8f0;
}

.group-header h3 {
  color: #374151;
  font-weight: 600;
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
    padding: 12px 16px;
  }
  
  .ant-table-tbody > tr > td {
    border-bottom: 1px solid #f1f5f9;
    padding: 10px 16px;
    transition: background-color 0.2s ease;
  }
  
  .ant-table-tbody > tr:hover > td {
    background-color: #f8fafc;
  }
  
  .ant-btn-link {
    padding: 0 6px;
    height: auto;
    font-size: 12px;
    transition: all 0.2s ease;
  }
  
  .ant-btn-link:hover {
    transform: translateY(-1px);
  }
}

.filters {
  border: 1px solid #e2e8f0;
}

.table-container {
  overflow-x: auto;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .header-nav .flex {
    flex-direction: column;
    gap: 1rem;
  }
  
  .sub-nav .flex {
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .file-info .flex {
    flex-direction: column;
    gap: 1rem;
  }
  
  .filters .flex {
    flex-direction: column;
    gap: 1rem;
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

.document-group {
  animation: fadeIn 0.5s ease-out;
}

.document-group:nth-child(1) {
  animation-delay: 0.1s;
}

.document-group:nth-child(2) {
  animation-delay: 0.2s;
}

.document-group:nth-child(3) {
  animation-delay: 0.3s;
}
</style>