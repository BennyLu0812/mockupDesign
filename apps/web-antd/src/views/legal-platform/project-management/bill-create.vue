<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
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
  Table,
  Modal,
  message,
  Popconfirm,
  Divider,
} from 'ant-design-vue';
import { Page } from '@vben/common-ui';
import dayjs from 'dayjs';

const { t } = useI18n();
const router = useRouter();
const route = useRoute();

// 表單數據
const formData = reactive({
  projectName: '',
  projectType: '法案項目',
  projectStatus: '處理中',
  projectStartTime: null,
  projectEndTime: null,
  projectDueTime: null,
  projectParticipants: [],
  projectRemarks: '',
  attachments: [],
  relatedLaws: [], // 關聯的法律法規
});

// 表單驗證規則
const rules = {
  projectName: [
    { required: true, message: '請輸入項目名稱', trigger: 'blur' },
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

// 項目狀態選項
const projectStatusOptions = [
  { label: '處理中', value: '處理中' },
  { label: '已完成', value: '已完成' },
  { label: '已取消', value: '已取消' },
];

// 參與人員選項
const participantOptions = [
  { label: '陳大文', value: '陳大文' },
  { label: '張三', value: '張三' },
  { label: '李四', value: '李四' },
  { label: '王五', value: '王五' },
  { label: '趙六', value: '趙六' },
];

// 法律法規相關數據
const lawsModalVisible = ref(false);
const addLawModalVisible = ref(false);
const availableLaws = ref([
  {
    id: 1,
    name: '中華民國憲法',
    type: '憲法',
    status: '現行',
    publishDate: '1947-01-01',
    description: '中華民國根本大法',
  },
  {
    id: 2,
    name: '民法',
    type: '法律',
    status: '現行',
    publishDate: '1929-05-23',
    description: '規範私人間權利義務關係之基本法律',
  },
  {
    id: 3,
    name: '刑法',
    type: '法律',
    status: '現行',
    publishDate: '1935-01-01',
    description: '規範犯罪與刑罰之基本法律',
  },
  {
    id: 4,
    name: '行政程序法',
    type: '法律',
    status: '現行',
    publishDate: '1999-02-03',
    description: '規範行政機關作成行政處分之程序',
  },
]);

// 新增法律法規表單
const newLawForm = reactive({
  name: '',
  type: '法律',
  status: '現行',
  publishDate: null,
  description: '',
});

const lawTypeOptions = [
  { label: '憲法', value: '憲法' },
  { label: '法律', value: '法律' },
  { label: '法規命令', value: '法規命令' },
  { label: '行政規則', value: '行政規則' },
];

const lawStatusOptions = [
  { label: '現行', value: '現行' },
  { label: '廢止', value: '廢止' },
  { label: '停止適用', value: '停止適用' },
];

// 關聯法律法規表格列配置
const relatedLawsColumns = [
  {
    title: '法律法規名稱',
    dataIndex: 'name',
    key: 'name',
    width: 200,
  },
  {
    title: '類型',
    dataIndex: 'type',
    key: 'type',
    width: 100,
  },
  {
    title: '狀態',
    dataIndex: 'status',
    key: 'status',
    width: 100,
  },
  {
    title: '發布日期',
    dataIndex: 'publishDate',
    key: 'publishDate',
    width: 120,
  },
  {
    title: '描述',
    dataIndex: 'description',
    key: 'description',
    ellipsis: true,
  },
  {
    title: '操作',
    key: 'action',
    width: 100,
    fixed: 'right',
  },
];

// 可選法律法規表格列配置
const availableLawsColumns = [
  {
    title: '法律法規名稱',
    dataIndex: 'name',
    key: 'name',
    width: 200,
  },
  {
    title: '類型',
    dataIndex: 'type',
    key: 'type',
    width: 100,
  },
  {
    title: '狀態',
    dataIndex: 'status',
    key: 'status',
    width: 100,
  },
  {
    title: '發布日期',
    dataIndex: 'publishDate',
    key: 'publishDate',
    width: 120,
  },
  {
    title: '描述',
    dataIndex: 'description',
    key: 'description',
    ellipsis: true,
  },
  {
    title: '操作',
    key: 'action',
    width: 100,
    fixed: 'right',
  },
];

// 附件上傳配置
const uploadProps = {
  name: 'file',
  multiple: true,
  action: '/api/upload',
  beforeUpload: (file: File) => {
    const isValidType = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'video/mp4',
      'audio/mpeg',
    ].includes(file.type);
    
    if (!isValidType) {
      message.error('只能上傳 Word、Excel、PDF、音視頻文件！');
    }
    
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error('文件大小不能超過 10MB！');
    }
    
    return isValidType && isLt10M;
  },
  onChange: (info: any) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} 文件上傳成功`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 文件上傳失敗`);
    }
  },
};

// 日期禁用函數
const disabledDate = (current: any) => {
  return current && current < dayjs().startOf('day');
};

// 關聯法律法規
const handleAssociateLaw = (law: any) => {
  const isAlreadyAssociated = formData.relatedLaws.some(
    (item: any) => item.id === law.id
  );
  
  if (isAlreadyAssociated) {
    message.warning('該法律法規已經關聯');
    return;
  }
  
  formData.relatedLaws.push({ ...law });
  message.success('關聯成功');
};

// 移除關聯的法律法規
const handleRemoveLaw = (lawId: number) => {
  const index = formData.relatedLaws.findIndex(
    (item: any) => item.id === lawId
  );
  if (index > -1) {
    formData.relatedLaws.splice(index, 1);
    message.success('移除成功');
  }
};

// 新增法律法規
const handleAddNewLaw = () => {
  if (!newLawForm.name || !newLawForm.type || !newLawForm.status) {
    message.error('請填寫完整信息');
    return;
  }
  
  const newLaw = {
    id: Date.now(),
    ...newLawForm,
    publishDate: newLawForm.publishDate
      ? dayjs(newLawForm.publishDate).format('YYYY-MM-DD')
      : '',
  };
  
  availableLaws.value.push(newLaw);
  
  // 重置表單
  Object.assign(newLawForm, {
    name: '',
    type: '法律',
    status: '現行',
    publishDate: null,
    description: '',
  });
  
  addLawModalVisible.value = false;
  message.success('新增法律法規成功');
};

// 提交表單
const handleSubmit = () => {
  console.log('提交法案項目數據:', formData);
  message.success('法案項目創建成功！');
  router.push('/legal-platform/project-management/list');
};

// 取消操作
const handleCancel = () => {
  router.back();
};

// 編輯模式檢查
const isEditMode = ref(false);

onMounted(() => {
  const projectId = route.params.id;
  if (projectId && projectId !== 'create') {
    isEditMode.value = true;
    // 模擬加載編輯數據
    Object.assign(formData, {
      projectName: '法案項目示例',
      projectType: '法案項目',
      projectStatus: '處理中',
      projectStartTime: dayjs('2024-01-01'),
      projectEndTime: dayjs('2024-12-31'),
      projectDueTime: dayjs('2024-12-31'),
      projectParticipants: ['陳大文', '張三'],
      projectRemarks: '這是一個法案項目示例',
      relatedLaws: [
        {
          id: 1,
          name: '中華民國憲法',
          type: '憲法',
          status: '現行',
          publishDate: '1947-01-01',
          description: '中華民國根本大法',
        },
      ],
    });
  }
});
</script>

<template>
  <Page :title="isEditMode ? '編輯法案項目' : '新增法案項目'">
    <div class="bill-project-create-container">
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

          <Divider>法律法規管理</Divider>

          <!-- 法律法規關聯管理 -->
          <FormItem
            label="關聯法律法規"
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 18 }"
          >
            <div class="laws-management">
              <div class="laws-actions mb-4">
                <Space>
                  <Button
                    type="primary"
                    @click="addLawModalVisible = true"
                  >
                    <span class="icon-[lucide--plus] size-4 mr-1" />
                    新增法律法規
                  </Button>
                  <Button
                    @click="lawsModalVisible = true"
                  >
                    <span class="icon-[lucide--link] size-4 mr-1" />
                    關聯現有法律法規
                  </Button>
                </Space>
              </div>
              
              <Table
                :columns="relatedLawsColumns"
                :data-source="formData.relatedLaws"
                :pagination="false"
                size="small"
                bordered
              >
                <template #bodyCell="{ column, record }">
                  <template v-if="column.key === 'action'">
                    <Popconfirm
                      title="確定要移除此法律法規嗎？"
                      @confirm="handleRemoveLaw(record.id)"
                    >
                      <Button
                        type="link"
                        danger
                        size="small"
                      >
                        移除
                      </Button>
                    </Popconfirm>
                  </template>
                </template>
              </Table>
              
              <div v-if="formData.relatedLaws.length === 0" class="empty-state">
                <div class="text-center py-8 text-gray-500">
                  <span class="icon-[lucide--file-text] size-8 mb-2 block mx-auto" />
                  <p>尚未關聯任何法律法規</p>
                  <p class="text-sm">點擊上方按鈕新增或關聯法律法規</p>
                </div>
              </div>
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
                {{ isEditMode ? '更新' : '創建' }}
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

    <!-- 關聯現有法律法規彈窗 -->
    <Modal
      v-model:open="lawsModalVisible"
      title="關聯現有法律法規"
      width="800px"
      :footer="null"
    >
      <Table
        :columns="availableLawsColumns"
        :data-source="availableLaws"
        :pagination="{ pageSize: 5 }"
        size="small"
        bordered
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <Button
              type="primary"
              size="small"
              @click="handleAssociateLaw(record)"
              :disabled="formData.relatedLaws.some((item: any) => item.id === record.id)"
            >
              {{ formData.relatedLaws.some((item: any) => item.id === record.id) ? '已關聯' : '關聯' }}
            </Button>
          </template>
        </template>
      </Table>
    </Modal>

    <!-- 新增法律法規彈窗 -->
    <Modal
      v-model:open="addLawModalVisible"
      title="新增法律法規"
      width="600px"
      @ok="handleAddNewLaw"
      @cancel="addLawModalVisible = false"
    >
      <Form
        :model="newLawForm"
        layout="horizontal"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <FormItem label="法律法規名稱" required>
          <Input
            v-model:value="newLawForm.name"
            placeholder="請輸入法律法規名稱"
          />
        </FormItem>
        
        <FormItem label="類型" required>
          <Select
            v-model:value="newLawForm.type"
            placeholder="請選擇類型"
          >
            <SelectOption
              v-for="type in lawTypeOptions"
              :key="type.value"
              :value="type.value"
            >
              {{ type.label }}
            </SelectOption>
          </Select>
        </FormItem>
        
        <FormItem label="狀態" required>
          <Select
            v-model:value="newLawForm.status"
            placeholder="請選擇狀態"
          >
            <SelectOption
              v-for="status in lawStatusOptions"
              :key="status.value"
              :value="status.value"
            >
              {{ status.label }}
            </SelectOption>
          </Select>
        </FormItem>
        
        <FormItem label="發布日期">
          <DatePicker
            v-model:value="newLawForm.publishDate"
            placeholder="請選擇發布日期"
            style="width: 100%"
            format="YYYY-MM-DD"
          />
        </FormItem>
        
        <FormItem label="描述">
          <Input.TextArea
            v-model:value="newLawForm.description"
            placeholder="請輸入描述"
            :rows="3"
          />
        </FormItem>
      </Form>
    </Modal>
  </Page>
</template>

<style scoped>
.bill-project-create-container {
  max-width: 1000px;
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

.laws-management {
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  padding: 16px;
  background-color: #fafafa;
}

.laws-actions {
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 12px;
  margin-bottom: 16px;
}

.empty-state {
  background-color: white;
  border-radius: 6px;
  border: 1px dashed #d9d9d9;
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
  .bill-project-create-container {
    padding: 16px;
  }
  
  .project-form {
    padding: 16px;
  }
}
</style>
