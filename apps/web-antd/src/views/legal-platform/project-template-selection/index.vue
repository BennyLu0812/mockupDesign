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
  Space,
} from 'ant-design-vue';

const router = useRouter();

// 項目模板數據
const projectTemplates = ref([
  {
    id: 'general',
    name: $t('page.legalPlatform.generalProjectTemplate'),
    description: $t('page.legalPlatform.generalProjectDesc'),
    icon: 'lucide--file-text',
    type: 'general',
  },
  {
    id: 'bill',
    name: $t('page.legalPlatform.billProjectTemplate'),
    description: $t('page.legalPlatform.billProjectDesc'),
    icon: 'lucide--scale',
    type: 'bill',
  },
  {
    id: 'other',
    name: $t('page.legalPlatform.otherProjectTemplate'),
    description: $t('page.legalPlatform.otherProjectDesc'),
    icon: 'lucide--folder',
    type: 'other',
  },
]);

// 處理模板選擇
const handleSelectTemplate = (template: any) => {
  // 跳轉到新增項目頁面，並傳遞模板類型
  router.push({
    path: '/legal-platform/project-management/create',
    query: {
      templateType: template.type,
    },
  });
};

// 處理模板管理
const handleTemplateManagement = () => {
  // 這裡可以跳轉到模板管理頁面
  console.log('模板管理功能待實現');
};
</script>

<template>
  <Page :title="$t('page.legalPlatform.projectTemplateSelection')">
    <div class="project-template-selection">
      <!-- 頁面標題和操作按鈕 -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-semibold text-gray-800">
          {{ $t('page.legalPlatform.projectTemplateSelection') }}
        </h1>
        <Button type="primary" @click="handleTemplateManagement">
          <span class="icon-[lucide--settings] size-4 mr-1" />
          {{ $t('page.legalPlatform.templateManagement') }}
        </Button>
      </div>

      <!-- 模板卡片區域 -->
      <Row :gutter="[24, 24]" class="template-cards">
        <Col
          v-for="template in projectTemplates"
          :key="template.id"
          :xs="24"
          :sm="12"
          :md="8"
          :lg="8"
          :xl="8"
        >
          <Card
            class="template-card h-full cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group"
            :hoverable="true"
            @click="handleSelectTemplate(template)"
          >
            <!-- 圖標區域 -->
            <div class="template-icon-area bg-blue-50 rounded-lg p-6 mb-4 text-center">
              <span :class="`icon-[${template.icon}] size-12 text-blue-500`" />
            </div>

            <!-- 模板信息 -->
            <div class="template-info text-center">
              <h3 class="text-lg font-medium text-gray-800 mb-2">
                {{ template.name }}
                <span class="icon-[lucide--bookmark] size-4 ml-1 text-blue-500" />
              </h3>
              <p class="text-gray-600 text-sm mb-4 leading-relaxed">
                {{ template.description }}
              </p>
            </div>

            <!-- 操作按鈕（懸停時顯示） -->
            <div class="template-action opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <Button
                type="primary"
                block
                size="large"
                class="template-action-btn"
                @click.stop="handleSelectTemplate(template)"
              >
                <span class="icon-[lucide--plus] size-4 mr-1" />
                {{ $t('page.legalPlatform.useThisTemplate') }}
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  </Page>
</template>

<style scoped>
.project-template-selection {
  padding: 24px;
  background: #f5f5f5;
  min-height: calc(100vh - 120px);
}

.template-cards {
  max-width: 1200px;
  margin: 0 auto;
}

.template-card {
  border: 1px solid #eeeeee;
  border-radius: 12px;
  background: #ffffff;
  overflow: hidden;
  position: relative;
  min-height: 320px;
}

.template-card:hover {
  border-color: #2196f3;
  box-shadow: 0 8px 24px rgba(33, 150, 243, 0.12);
}

.template-icon-area {
  background-color: #e6f3ff !important;
  transition: all 0.3s ease;
}

.template-card:hover .template-icon-area {
  background-color: #d1e9ff !important;
}

.template-action {
  position: absolute;
  bottom: 16px;
  left: 16px;
  right: 16px;
}

.template-card:hover .template-action {
  opacity: 1 !important;
}

.template-action-btn {
  background-color: #2196f3;
  border-color: #2196f3;
  font-weight: 500;
}

.template-action-btn:hover {
  background-color: #1976d2 !important;
  border-color: #1976d2 !important;
}

/* 確保卡片內容區域有足夠空間給懸停按鈕 */
.template-card .ant-card-body {
  padding-bottom: 80px;
  min-height: 280px;
  display: flex;
  flex-direction: column;
}

.template-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
