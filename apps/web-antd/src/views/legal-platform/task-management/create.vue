<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { Page } from '@vben/common-ui';
import { $t } from '#/locales';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  FormItem,
  Input,
  InputNumber,
  Row,
  Select,
  SelectOption,
  Space,
  Upload,
  message,
} from 'ant-design-vue';
// 移除@ant-design/icons-vue導入，使用Tailwind CSS圖標

const router = useRouter();

// 表單數據
const formData = reactive({
  taskName: '',
  taskDescription: '',
  taskType: 'general',
  taskStatus: 'inProgress',
  taskStartTime: undefined,
  taskEndTime: undefined,
  taskParticipants: [],
  taskRemarks: '',
  taskDueTime: undefined,
  estimatedHours: 0,
  attachments: [] as any[],
});

// 任務類型選項
const taskTypeOptions = [
  { value: 'general', label: $t('page.legalPlatform.generalTask') },
  { value: 'bill', label: $t('page.legalPlatform.billTask') },
  { value: 'other', label: $t('page.legalPlatform.otherTask') },
];

// 任務狀態選項
const taskStatusOptions = [
  { value: 'inProgress', label: $t('page.legalPlatform.inProgress') },
  { value: 'completed', label: $t('page.legalPlatform.completed') },
  { value: 'cancelled', label: $t('page.legalPlatform.cancelled') },
];

// 任務參與人員選項
const participantOptions = [
  { value: 'chen', label: '陳大文' },
  { value: 'zhang', label: '張三' },
  { value: 'li', label: '李四' },
];

// 關聯項數量
const relatedItemsCount = ref(0);

// 文件上傳配置
const uploadProps = {
  name: 'file',
  multiple: true,
  beforeUpload: (file: File) => {
    const isValidType = [
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'video/*',
      'audio/*',
      'image/*',
    ].some(type => file.type.startsWith(type.replace('/*', '')));
    
    if (!isValidType) {
      message.error('只支持上傳 Word、Excel、音視頻和圖片文件！');
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

// 保存表單
const handleSave = () => {
  // 這裡可以添加表單驗證邏輯
  console.log('保存表單數據:', formData);
  message.success('任務創建成功！');
  // 可以在這裡調用API保存數據
};

// 取消操作
const handleCancel = () => {
  router.back();
};

// 返回操作
const handleBack = () => {
  router.back();
};
</script>

<template>
  <Page :title="$t('page.legalPlatform.taskCreate')">
    <div class="task-create-container">
      <div class="grid grid-cols-12 gap-1">
        <!-- 左側主要內容區域 -->
        <div class="col-span-8">
          <Card class="mb-4" :title="$t('page.legalPlatform.taskName')">
            <Input
              v-model:value="formData.taskName"
              :placeholder="$t('page.legalPlatform.taskName')"
              size="large"
            />
          </Card>

          <Card :title="$t('page.legalPlatform.taskDescription')">
            <div class="editor-toolbar mb-2">
              <Space>
                <Button size="small" type="text">
                  <span class="icon-[lucide--bold] size-4" />
                </Button>
                <Button size="small" type="text">
                  <span class="icon-[lucide--italic] size-4" />
                </Button>
                <Button size="small" type="text">
                  <span class="icon-[lucide--underline] size-4" />
                </Button>
                <Button size="small" type="text">
                  <span class="icon-[lucide--list] size-4" />
                </Button>
                <Button size="small" type="text">
                  <span class="icon-[lucide--list-ordered] size-4" />
                </Button>
              </Space>
            </div>
            <Input.TextArea
              v-model:value="formData.taskDescription"
              :placeholder="$t('page.legalPlatform.taskDescription')"
              :rows="10"
              class="min-h-[300px]"
            />
          </Card>

          <!-- 關聯項區域 -->
          <Card class="mt-1" :title="$t('page.legalPlatform.relatedItems')">
            <div class="flex items-center justify-between">
              <div>
                <span class="text-lg font-medium">{{ $t('page.legalPlatform.relatedItemsCount') }}: {{ relatedItemsCount }}</span>
                <div class="mt-2 text-sm text-gray-500">
                  {{ $t('page.legalPlatform.addAutomationRule') }}
                </div>
              </div>
              <Button type="dashed">
                <span class="icon-[lucide--plus] size-4 mr-1" />
                添加關聯項
              </Button>
            </div>
          </Card>
        </div>

        <!-- 右側信息區域 -->
        <div class="col-span-4">
          <Card class="mb-1" title="基礎字段">
            <Form layout="horizontal" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
              <FormItem :label="$t('page.legalPlatform.taskType')">
                <Select v-model:value="formData.taskType">
                  <SelectOption
                    v-for="option in taskTypeOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </SelectOption>
                </Select>
              </FormItem>

              <FormItem :label="$t('page.legalPlatform.taskStatus')">
                <Select v-model:value="formData.taskStatus">
                  <SelectOption
                    v-for="option in taskStatusOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </SelectOption>
                </Select>
              </FormItem>

              <FormItem :label="$t('page.legalPlatform.taskStartTime')">
                <DatePicker
                  v-model:value="formData.taskStartTime"
                  class="w-full"
                  format="YYYY-MM-DD"
                />
              </FormItem>

              <FormItem :label="$t('page.legalPlatform.taskEndTime')">
                <DatePicker
                  v-model:value="formData.taskEndTime"
                  class="w-full"
                  format="YYYY-MM-DD"
                />
              </FormItem>

              <FormItem :label="$t('page.legalPlatform.taskParticipants')">
                <Select
                  v-model:value="formData.taskParticipants"
                  mode="multiple"
                  :placeholder="$t('page.legalPlatform.taskParticipants')"
                >
                  <SelectOption
                    v-for="option in participantOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </SelectOption>
                </Select>
              </FormItem>

              <FormItem :label="$t('page.legalPlatform.taskRemarks')">
                <Input.TextArea
                  v-model:value="formData.taskRemarks"
                  :placeholder="$t('page.legalPlatform.taskRemarks')"
                  :rows="3"
                />
              </FormItem>

              <FormItem :label="$t('page.legalPlatform.taskDueTime')">
                <DatePicker
                  v-model:value="formData.taskDueTime"
                  class="w-full"
                  format="YYYY-MM-DD HH:mm"
                  show-time
                />
              </FormItem>
            </Form>
          </Card>

          <Card class="mb-1" :title="$t('page.legalPlatform.workHours')">
            <FormItem :label="$t('page.legalPlatform.estimatedHours')">
              <InputNumber
                v-model:value="formData.estimatedHours"
                :min="0"
                :step="0.5"
                class="w-full"
                :placeholder="$t('page.legalPlatform.estimatedHours')"
              />
            </FormItem>
          </Card>

          <Card class="mb-1" :title="$t('page.legalPlatform.attachments')">
            <Upload v-bind="uploadProps" :file-list="formData.attachments">
              <Button>
                <span class="icon-[lucide--upload] size-4 mr-1" />
                {{ $t('page.legalPlatform.addAttachment') }}
              </Button>
            </Upload>
            <div class="mt-2 text-sm text-gray-500">
              支持 Word、Excel、音視頻等多媒體文件上傳
            </div>
          </Card>
        </div>
      </div>



      <!-- 底部操作按鈕 -->
      <div class="mt-6 flex justify-end">
        <Space>
          <Button @click="handleCancel">
            {{ $t('page.legalPlatform.cancel') }}
          </Button>
          <Button type="primary" @click="handleSave">
            {{ $t('page.legalPlatform.save') }}
          </Button>
        </Space>
      </div>
    </div>
  </Page>
</template>

<style scoped>
.task-create-container {
  padding: 0;
}

.editor-toolbar {
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 8px;
}

:deep(.ant-card) {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
}

:deep(.ant-card-head) {
  border-bottom: 1px solid #f0f0f0;
}

:deep(.ant-form-item) {
  margin-bottom: 5px;
}

:deep(.ant-form-item-label) {
  font-weight: 500;
  text-align: left !important;
}

:deep(.ant-form-item-control) {
  text-align: left !important;
}

/* 確保基礎字段與預估工時對齊 */
:deep(.ant-form-horizontal .ant-form-item-label) {
  text-align: left !important;
  padding-right: 8px;
}

:deep(.ant-form-horizontal .ant-form-item-control-input) {
  text-align: left !important;
}
</style>
