<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Page } from '@vben/common-ui';
import { $t } from '#/locales';
import {
  Button,
  Card,
  DatePicker,
  Form,
  FormItem,
  Input,
  Select,
  SelectOption,
  Space,
  Upload,
  message,
} from 'ant-design-vue';
import type { Rule } from 'ant-design-vue/es/form';
// 使用 Lucide 圖標替代 ant-design/icons-vue

const router = useRouter();
const route = useRoute();

// 表單數據
const formData = reactive({
  projectCover: '',
  projectName: '',
  projectType: '一般項目',
  projectStartTime: undefined as string | undefined,
  projectEndTime: undefined as string | undefined,
  projectDueTime: undefined as string | undefined,
  projectParticipants: [] as string[],
  projectRemarks: '',
});

// 表單驗證規則
const rules: Record<string, Rule[]> = {
  projectName: [
    { required: true, message: '請輸入項目名稱', trigger: 'blur' },
    { min: 2, max: 50, message: '項目名稱長度在 2 到 50 個字符', trigger: 'blur' },
  ],
  projectType: [
    { required: true, message: '請選擇項目類型', trigger: 'change' },
  ],
  projectStartTime: [
    { required: true, message: '請選擇項目開始時間', trigger: 'change' },
  ],
  projectEndTime: [
    { required: true, message: '請選擇項目結束時間', trigger: 'change' },
  ],
  projectDueTime: [
    { required: true, message: '請選擇項目到期時間', trigger: 'change' },
  ],
};

// 項目參與人員選項
const participantOptions = [
  { value: 'chen-da-wen', label: '陳大文' },
  { value: 'zhang-san', label: '張三' },
  { value: 'li-si', label: '李四' },
];

// 封面上傳配置
const uploadProps = {
  name: 'file',
  action: '/api/upload', // 這裡是mock的上傳地址
  headers: {
    authorization: 'authorization-text',
  },
  beforeUpload: (file: File) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只能上傳 JPG/PNG 格式的圖片!');
      return false;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('圖片大小不能超過 5MB!');
      return false;
    }
    return true;
  },
  onChange: (info: any) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} 文件上傳成功`);
      formData.projectCover = info.file.response?.url || '';
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 文件上傳失敗`);
    }
  },
};

// 處理表單提交
const handleSubmit = async () => {
  try {
    // 這裡應該調用API保存項目數據
    console.log('提交的項目數據:', formData);
    
    // 模擬API調用
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    message.success('項目創建成功!');
    
    // 跳轉到項目列表或其他頁面
    router.push('/legal-platform/project-template-selection');
  } catch (error) {
    message.error('項目創建失敗，請重試');
    console.error('創建項目失敗:', error);
  }
};

// 處理取消
const handleCancel = () => {
  router.back();
};

// 禁用過去的日期
const disabledDate = (current: any) => {
  return current && current < new Date().setHours(0, 0, 0, 0);
};

// 初始化表單數據
onMounted(() => {
  // 根據路由參數設置項目類型
  const templateType = route.query.templateType as string;
  if (templateType) {
    switch (templateType) {
      case 'general':
        formData.projectType = '一般項目';
        break;
      case 'bill':
        formData.projectType = '法案項目';
        break;
      case 'other':
        formData.projectType = '其他項目';
        break;
      default:
        formData.projectType = '一般項目';
    }
  }
});

</script>

<template>
  <Page :title="$t('page.legalPlatform.fillProjectInfo')">
    <div class="project-create-container">
      <Card class="project-form-card">
        <Form
          :model="formData"
          :rules="rules"
          layout="horizontal"
          class="project-form"
        >
          <!-- 項目封面上傳 -->
          <FormItem
            :label="$t('page.legalPlatform.projectCover')"
            name="projectCover"
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 18 }"
          >
            <div class="cover-upload-area">
              <Upload
                v-bind="uploadProps"
                :show-upload-list="false"
                class="cover-uploader"
              >
                <div class="upload-content">
                  <div v-if="formData.projectCover" class="cover-preview">
                    <img :src="formData.projectCover" alt="項目封面" class="cover-image" />
                    <div class="cover-overlay">
                      <span class="icon-[lucide--upload] upload-icon" />
                      <div class="upload-text">{{ $t('page.legalPlatform.clickToModify') }}</div>
                    </div>
                  </div>
                  <div v-else class="upload-placeholder">
                    <span class="icon-[lucide--upload] upload-icon" />
                    <div class="upload-text">{{ $t('page.legalPlatform.uploadCover') }}</div>
                  </div>
                </div>
              </Upload>
            </div>
          </FormItem>

          <!-- 項目基本信息 -->
          <FormItem
            :label="$t('page.legalPlatform.projectName')"
            name="projectName"
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 18 }"
          >
            <Input
              v-model:value="formData.projectName"
              :placeholder="'請輸入' + $t('page.legalPlatform.projectName')"
              size="large"
            />
          </FormItem>

          <FormItem
              :label="$t('page.legalPlatform.project.type')"
              name="projectType"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 18 }"
            >
              <span>{{ formData.projectType }}</span>
            </FormItem>

          <!-- 項目時間信息 -->
          <FormItem
            :label="$t('page.legalPlatform.projectStartTime')"
            name="projectStartTime"
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 18 }"
          >
            <DatePicker
              v-model:value="formData.projectStartTime"
              :placeholder="'請選擇' + $t('page.legalPlatform.projectStartTime')"
              :disabled-date="disabledDate"
              size="large"
              style="width: 100%"
              format="YYYY-MM-DD"
            />
          </FormItem>

          <FormItem
            :label="$t('page.legalPlatform.projectEndTime')"
            name="projectEndTime"
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 18 }"
          >
            <DatePicker
              v-model:value="formData.projectEndTime"
              :placeholder="'請選擇' + $t('page.legalPlatform.projectEndTime')"
              :disabled-date="disabledDate"
              size="large"
              style="width: 100%"
              format="YYYY-MM-DD"
            />
          </FormItem>

          <FormItem
            :label="$t('page.legalPlatform.projectDueTime')"
            name="projectDueTime"
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 18 }"
          >
            <DatePicker
              v-model:value="formData.projectDueTime"
              :placeholder="'請選擇' + $t('page.legalPlatform.projectDueTime')"
              :disabled-date="disabledDate"
              size="large"
              style="width: 100%"
              format="YYYY-MM-DD"
            />
          </FormItem>

          <!-- 項目參與人員 -->
          <FormItem
            :label="$t('page.legalPlatform.projectParticipants')"
            name="projectParticipants"
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 18 }"
          >
            <Select
              v-model:value="formData.projectParticipants"
              mode="multiple"
              :placeholder="'請選擇' + $t('page.legalPlatform.projectParticipants')"
              size="large"
              style="width: 100%"
            >
              <SelectOption
                v-for="participant in participantOptions"
                :key="participant.value"
                :value="participant.value"
              >
                {{ participant.label }}
              </SelectOption>
            </Select>
          </FormItem>

          <!-- 項目備註信息 -->
          <FormItem
            :label="$t('page.legalPlatform.projectRemarks')"
            name="projectRemarks"
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 18 }"
          >
            <Input.TextArea
              v-model:value="formData.projectRemarks"
              :placeholder="'請輸入' + $t('page.legalPlatform.projectRemarks')"
              :rows="4"
              size="large"
            />
          </FormItem>

          <!-- 操作按鈕 -->
          <FormItem class="form-actions">
            <Space size="large">
              <Button
                type="primary"
                size="large"
                @click="handleSubmit"
                class="submit-btn"
              >
                {{ $t('page.legalPlatform.create') }}
              </Button>
              <Button
                size="large"
                @click="handleCancel"
                class="cancel-btn"
              >
                {{ $t('page.legalPlatform.cancel') }}
              </Button>
            </Space>
          </FormItem>
        </Form>
      </Card>
    </div>
  </Page>
</template>

<style scoped>
.project-create-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
}



.project-form-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.project-form {
  padding: 24px;
}

/* 封面上傳樣式 */
.cover-upload-area {
  width: 200px;
  height: 120px;
}

.cover-uploader {
  width: 100%;
  height: 100%;
}

.upload-content {
  width: 100%;
  height: 100%;
  border: 2px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: border-color 0.3s;
}

.upload-content:hover {
  border-color: #2196f3;
}

.cover-preview {
  width: 100%;
  height: 100%;
  position: relative;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
  color: white;
}

.cover-preview:hover .cover-overlay {
  opacity: 1;
}

.upload-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fafafa;
  color: #999;
}

.upload-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.upload-text {
  font-size: 14px;
}

/* 表單操作按鈕 */
.form-actions {
  text-align: center;
  margin-top: 32px;
  margin-bottom: 0;
}

.submit-btn {
  background-color: #2196f3;
  border-color: #2196f3;
  min-width: 120px;
}

.submit-btn:hover {
  background-color: #1976d2;
  border-color: #1976d2;
}

.cancel-btn {
  min-width: 120px;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .project-create-container {
    padding: 16px;
  }
  
  .project-form {
    padding: 16px;
  }
  
  .cover-upload-area {
    width: 100%;
    max-width: 200px;
  }
}
</style>
