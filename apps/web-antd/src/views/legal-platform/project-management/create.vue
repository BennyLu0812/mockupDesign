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
  projectName: '',
  projectType: '一般項目',
  projectStatus: '進行中',
  projectStartTime: undefined as string | undefined,
  projectEndTime: undefined as string | undefined,
  projectDueTime: undefined as string | undefined,
  projectParticipants: [] as string[],
  projectRemarks: '',
  attachments: [] as any[],
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
  projectStatus: [
    { required: true, message: '請選擇項目狀態', trigger: 'change' },
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

// 項目狀態選項
const projectStatusOptions = [
  { value: '進行中', label: '進行中' },
  { value: '已完成', label: '已完成' },
  { value: '已取消', label: '已取消' },
  { value: '暫停', label: '暫停' },
  { value: '預備中', label: '預備中' },
];

// 附件上傳配置
const uploadProps = {
  name: 'file',
  multiple: true,
  beforeUpload: (file: File) => {
    const isValidType = [
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/pdf',
      'video/',
      'audio/',
      'image/',
    ].some(type => file.type.startsWith(type.replace('/', '')));
    
    if (!isValidType) {
      message.error('只支持上傳 Word、Excel、PDF、音視頻和圖片文件！');
      return false;
    }
    
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error('文件大小不能超過 10MB！');
      return false;
    }
    
    return false; // 阻止自動上傳，只做本地處理
  },
  onChange: (info: any) => {
    if (info.file.status !== 'removed') {
      formData.attachments.push(info.file);
    }
  },
  onRemove: (file: any) => {
    const index = formData.attachments.findIndex((item: any) => item.uid === file.uid);
    if (index > -1) {
      formData.attachments.splice(index, 1);
    }
  },
};

// 處理表單提交
const handleSubmit = async () => {
  try {
    // 這裡應該調用API保存項目數據
    console.log('提交的項目數據:', formData);
    console.log('編輯模式:', isEditMode.value);
    console.log('項目ID:', projectId.value);
    
    // 模擬API調用
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (isEditMode.value) {
      message.success('項目更新成功!');
      // 跳轉到項目詳情頁面
      router.push(`/legal-platform/project-management/detail/${projectId.value}`);
    } else {
      message.success('項目創建成功!');
      // 跳轉到項目列表頁面
      router.push('/legal-platform/project-management/list');
    }
  } catch (error) {
    const errorMsg = isEditMode.value ? '項目更新失敗，請重試' : '項目創建失敗，請重試';
    message.error(errorMsg);
    console.error('保存項目失敗:', error);
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

// 判斷是否為編輯模式
const isEditMode = ref(false);
const projectId = ref('');

// 模擬項目數據（實際應從API獲取）
const mockProjectData = {
  1: {
    projectName: '法律條文審查項目',
    projectType: '法案項目',
    projectStatus: '進行中',
    projectStartTime: '2024-01-15',
    projectEndTime: '2024-03-15',
    projectDueTime: '2024-03-10',
    projectParticipants: ['chen-da-wen', 'zhang-san'],
    projectRemarks: '本項目旨在對新修訂的法律條文進行全面審查，確保條文的合法性、合理性和可操作性。',
    attachments: [],
  },
};

// 加載項目數據（編輯模式）
const loadProjectData = async (id: string) => {
  try {
    // 實際應該調用API獲取項目數據
    const projectData = mockProjectData[id as keyof typeof mockProjectData];
    if (projectData) {
      Object.assign(formData, projectData);
    }
  } catch (error) {
    message.error('加載項目數據失敗');
    console.error('加載項目數據失敗:', error);
  }
};

// 初始化表單數據
onMounted(() => {
  // 檢查是否為編輯模式
  const id = route.query.id as string;
  const mode = route.query.mode as string;
  
  if (id && mode === 'edit') {
    isEditMode.value = true;
    projectId.value = id;
    loadProjectData(id);
  } else {
    // 根據路由參數設置項目類型（新建模式）
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
  }
});

</script>

<template>
  <Page :title="isEditMode ? '編輯項目' : $t('page.legalPlatform.fillProjectInfo')">
    <div class="project-create-container">
      <Card class="project-form-card">
        <Form
          :model="formData"
          :rules="rules"
          layout="horizontal"
          class="project-form"
        >
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

          <!-- 項目狀態 -->
          <FormItem
            :label="$t('page.legalPlatform.projectStatus')"
            name="projectStatus"
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 18 }"
          >
            <Select
              v-model:value="formData.projectStatus"
              :placeholder="'請選擇' + $t('page.legalPlatform.projectStatus')"
              size="large"
              style="width: 100%"
            >
              <SelectOption
                v-for="status in projectStatusOptions"
                :key="status.value"
                :value="status.value"
              >
                {{ status.label }}
              </SelectOption>
            </Select>
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

          <!-- 附件上傳 -->
          <FormItem
            :label="$t('page.legalPlatform.attachments')"
            name="attachments"
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 18 }"
          >
            <Upload v-bind="uploadProps" :file-list="formData.attachments">
              <Button>
                <span class="icon-[lucide--upload] size-4 mr-1" />
                {{ $t('page.legalPlatform.addAttachment') }}
              </Button>
            </Upload>
            <div class="mt-2 text-sm text-gray-500">
              支持 Word、Excel、PDF、音視頻等多媒體文件上傳
            </div>
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

/* 附件上傳樣式 */
:deep(.ant-upload-list) {
  margin-top: 8px;
}

:deep(.ant-upload-list-item) {
  border-radius: 6px;
}

:deep(.ant-upload-btn) {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  transition: border-color 0.3s;
}

:deep(.ant-upload-btn:hover) {
  border-color: #2196f3;
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
  
  .project-form {
    padding: 16px;
  }
}
</style>
