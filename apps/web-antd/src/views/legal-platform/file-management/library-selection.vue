<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Page } from '@vben/common-ui';
import { $t } from '#/locales';
import {
  Button,
  Card,
  Col,
  Row,
} from 'ant-design-vue';

const router = useRouter();

// 文件庫類型數據
const libraryTypes = ref([
  {
    id: 'legal-documents',
    name: '法律條文資料庫',
    description: '存儲和管理各類法律條文、法規文件，支持條文檢索和版本管理',
    icon: 'lucide--scale',
    type: 'legal-documents',
    department: '法制研究及立法統籌廳',
  },
  {
    id: 'contract-templates',
    name: '合同範本庫',
    description: '提供標準化合同範本，支持範本分類管理和自定義修改',
    icon: 'lucide--file-text',
    type: 'contract-templates',
    department: '法律草擬廳',
  },
  {
    id: 'project-files',
    name: '項目文件庫',
    description: '管理項目相關文件，包括項目文檔、會議記錄、進度報告等',
    icon: 'lucide--folder',
    type: 'project-files',
    department: '法律翻譯廳',
  },
]);

// 處理文件庫類型選擇
const handleSelectLibraryType = (libraryType: any) => {
  // 跳轉到文件庫創建頁面，並傳遞文件庫類型
  router.push({
    path: '/legal-platform/file-management/library-create',
    query: {
      libraryType: libraryType.type,
    },
  });
};

// 獲取文件庫圖標類名
const getLibraryIconClass = (iconName: string) => {
  const iconMap: Record<string, string> = {
    'lucide--scale': 'icon-[lucide--scale] size-12 text-blue-500',
    'lucide--file-text': 'icon-[lucide--file-text] size-12 text-blue-500',
    'lucide--folder': 'icon-[lucide--folder] size-12 text-blue-500',
    'lucide--database': 'icon-[lucide--database] size-12 text-blue-500',
    'lucide--briefcase': 'icon-[lucide--briefcase] size-12 text-blue-500',
  };
  return iconMap[iconName] || 'icon-[lucide--database] size-12 text-blue-500';
};
</script>

<template>
  <Page title="文件庫選擇">
    <div class="library-selection">
      <!-- 頁面標題 -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-semibold text-gray-800">
          選擇文件庫類型
        </h1>
        <Button type="default" @click="router.back()">
          <span class="icon-[lucide--arrow-left] size-4 mr-1" />
          返回
        </Button>
      </div>

      <!-- 文件庫類型卡片區域 -->
      <Row :gutter="[24, 24]" class="library-cards">
        <Col
          v-for="libraryType in libraryTypes"
          :key="libraryType.id"
          :xs="24"
          :sm="12"
          :md="8"
          :lg="8"
          :xl="8"
        >
          <Card
            class="library-card h-full cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group"
            :hoverable="true"
            @click="handleSelectLibraryType(libraryType)"
          >
            <!-- 圖標區域 -->
            <div class="library-icon-area bg-blue-50 rounded-lg p-6 mb-4 text-center">
              <span :class="getLibraryIconClass(libraryType.icon)" />
            </div>

            <!-- 文件庫信息 -->
            <div class="library-info text-center">
              <h3 class="text-lg font-medium text-gray-800 mb-2">
                {{ libraryType.name }}
                <span class="icon-[lucide--bookmark] size-4 ml-1 text-blue-500" />
              </h3>
              <div class="department-info mb-3">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <span class="icon-[lucide--building] size-3 mr-1" />
                  {{ libraryType.department }}
                </span>
              </div>
              <p class="text-gray-600 text-sm mb-4 leading-relaxed">
                {{ libraryType.description }}
              </p>
            </div>

            <!-- 操作按鈕（懸停時顯示） -->
            <div class="library-action opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <Button
                type="primary"
                block
                size="large"
                class="library-action-btn"
                @click.stop="handleSelectLibraryType(libraryType)"
              >
                <span class="icon-[lucide--plus] size-4 mr-1" />
                選擇此類型
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  </Page>
</template>

<style scoped>
.library-selection {
  padding: 24px;
  background: #f5f5f5;
  min-height: calc(100vh - 120px);
}

.library-cards {
  max-width: 1200px;
  margin: 0 auto;
}

.library-card {
  border: 1px solid #eeeeee;
  border-radius: 12px;
  background: #ffffff;
  overflow: hidden;
  position: relative;
  min-height: 320px;
}

.library-card:hover {
  border-color: #2196f3;
  box-shadow: 0 8px 24px rgba(33, 150, 243, 0.12);
}

.library-icon-area {
  background-color: #e6f3ff !important;
  transition: all 0.3s ease;
}

.library-card:hover .library-icon-area {
  background-color: #d1e9ff !important;
}

.library-action {
  position: absolute;
  bottom: 16px;
  left: 16px;
  right: 16px;
}

.library-card:hover .library-action {
  opacity: 1 !important;
}

.library-action-btn {
  background-color: #2196f3;
  border-color: #2196f3;
  font-weight: 500;
}

.library-action-btn:hover {
  background-color: #1976d2 !important;
  border-color: #1976d2 !important;
}

/* 確保卡片內容區域有足夠空間給懸停按鈕 */
.library-card .ant-card-body {
  padding-bottom: 80px;
  min-height: 280px;
  display: flex;
  flex-direction: column;
}

.library-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>