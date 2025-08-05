<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
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
  Switch,
  TreeSelect,
  Textarea,
  InputNumber,
  Checkbox,
  CheckboxGroup,
  Tag,
  message,
} from 'ant-design-vue';

const router = useRouter();
const route = useRoute();

// 是否為編輯模式
const isEdit = ref(!!route.query.id);
const folderId = ref(route.query.id as string);

// 表單數據
const formData = reactive({
  folderName: '',
  folderDescription: '',
  parentFolder: undefined,
  folderType: 'public',
  department: undefined,
  tags: [],
});

// 表單驗證規則
const rules = {
  folderName: [
    { required: true, message: '請輸入文件夾名稱', trigger: 'blur' },
    { min: 2, max: 50, message: '文件夾名稱長度在 2 到 50 個字符', trigger: 'blur' },
  ],
  folderType: [
    { required: true, message: '請選擇文件夾類型', trigger: 'change' },
  ],
  department: [
    { required: true, message: '請選擇所屬部門', trigger: 'change' },
  ],
};

// 文件夾類型選項
const folderTypeOptions = [
  { label: $t('page.legalPlatform.publicFolder'), value: 'public' },
  { label: $t('page.legalPlatform.privateFolder'), value: 'private' },
  { label: $t('page.legalPlatform.sharedFolder'), value: 'shared' },
];

// 部門選項
const departmentOptions = [
  { label: '法制研究及立法統籌廳', value: 'legal-research' },
  { label: '法律草擬廳', value: 'legal-drafting' },
  { label: '法律翻譯廳', value: 'legal-translation' },
];

// 父文件夾樹形數據
const folderTreeData = [
  {
    title: '根目錄',
    value: 'root',
    children: [
      {
        title: '法律條文資料庫',
        value: 'legal-database',
        children: [
          { title: '法規條文', value: 'legal-regulations' },
          { title: '司法解釋', value: 'judicial-interpretations' },
          { title: '行政法規', value: 'administrative-regulations' },
          { title: '地方法規', value: 'local-regulations' },
        ],
      },
      {
        title: '合同範本庫',
        value: 'contract-templates',
        children: [
          { title: '買賣合同', value: 'sales-contracts' },
          { title: '租賃合同', value: 'lease-contracts' },
          { title: '服務合同', value: 'service-contracts' },
          { title: '勞動合同', value: 'employment-contracts' },
        ],
      },
      {
        title: '項目文件庫',
        value: 'project-files',
        children: [
          { title: '立法項目', value: 'legislative-projects' },
          { title: '法律諮詢', value: 'legal-consultation' },
          { title: '案件檔案', value: 'case-files' },
          { title: '研究報告', value: 'research-reports' },
        ],
      },
    ],
  },
];

// 標籤選項
const tagOptions = [
  { label: '重要', value: 'important', color: 'red' },
  { label: '法律', value: 'legal', color: 'blue' },
  { label: '模板', value: 'template', color: 'green' },
  { label: '合同', value: 'contract', color: 'orange' },
  { label: '案例', value: 'case', color: 'purple' },
  { label: '分析', value: 'analysis', color: 'cyan' },
];



// 表單引用
const formRef = ref();

// 提交表單
const handleSubmit = async () => {
  try {
    await formRef.value.validate();
    console.log('表單數據:', formData);
    
    // 這裡應該調用API保存數據
    if (isEdit.value) {
      message.success('更新文件夾成功');
    } else {
      message.success('創建文件夾成功');
    }
    
    // 返回列表頁
    router.push('/legal-platform/folder-management/list');
  } catch (error) {
    console.error('表單驗證失敗:', error);
  }
};

// 返回
const handleBack = () => {
  router.back();
};

// 重置表單
const handleReset = () => {
  formRef.value.resetFields();
  message.success('重置成功');
};

// 加載文件夾數據（編輯模式）
const loadFolderData = async () => {
  if (isEdit.value && folderId.value) {
    // 這裡應該調用API加載文件夾數據
    // 模擬數據
    Object.assign(formData, {
      folderName: '法律文件庫',
      folderDescription: '存放法律相關文件的文件夾',
      parentFolder: 'root',
      folderType: 'public',
      department: 'legal-research',
      tags: ['important', 'legal'],
    });
  }
};

// 組件掛載時加載數據
onMounted(() => {
  loadFolderData();
});
</script>

<template>
  <Page>
    <Card>
      <div class="mb-4">
        <h2 class="text-xl font-semibold">
          {{ isEdit ? $t('page.legalPlatform.editFolder') : $t('page.legalPlatform.folderCreate') }}
        </h2>
      </div>

      <Form
        ref="formRef"
        :model="formData"
        :rules="rules"
        layout="vertical"
        class="max-w-4xl"
      >
        <!-- 基本信息 -->
        <Card class="mb-6" size="small">
          <template #title>
            <span class="icon-[lucide--info] size-4 mr-2" />
            基本信息
          </template>
          
          <Row :gutter="16">
            <Col :span="12">
              <FormItem name="folderName" :label="$t('page.legalPlatform.folderName')">
                <Input 
                  v-model:value="formData.folderName" 
                  :placeholder="$t('page.legalPlatform.folderName')"
                />
              </FormItem>
            </Col>
            <Col :span="12">
              <FormItem name="folderType" :label="$t('page.legalPlatform.folderType')">
                <Select 
                  v-model:value="formData.folderType" 
                  :placeholder="$t('page.legalPlatform.folderType')"
                >
                  <SelectOption 
                    v-for="option in folderTypeOptions" 
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
              <FormItem name="department" :label="$t('page.legalPlatform.department')">
                <Select 
                  v-model:value="formData.department" 
                  :placeholder="$t('page.legalPlatform.department')"
                >
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
            <Col :span="12">
              <FormItem name="parentFolder" :label="$t('page.legalPlatform.parentFolder')">
                <TreeSelect
                  v-model:value="formData.parentFolder"
                  :tree-data="folderTreeData"
                  :placeholder="$t('page.legalPlatform.parentFolder')"
                  allow-clear
                  tree-default-expand-all
                />
              </FormItem>
            </Col>
          </Row>

          <FormItem name="folderDescription" :label="$t('page.legalPlatform.folderDescription')">
            <Textarea 
              v-model:value="formData.folderDescription" 
              :placeholder="$t('page.legalPlatform.folderDescription')"
              :rows="3"
            />
          </FormItem>

          <FormItem name="tags" :label="$t('page.legalPlatform.folderTags')">
            <CheckboxGroup v-model:value="formData.tags">
              <Row :gutter="[16, 8]">
                <Col v-for="tag in tagOptions" :key="tag.value" :span="6">
                  <Checkbox :value="tag.value">
                    <Tag :color="tag.color">{{ tag.label }}</Tag>
                  </Checkbox>
                </Col>
              </Row>
            </CheckboxGroup>
          </FormItem>
        </Card>

        <!-- 操作按鈕 -->
        <FormItem>
          <Space>
            <Button type="primary" @click="handleSubmit">
              <template #icon>
                <span class="icon-[lucide--save] size-4" />
              </template>
              {{ $t('page.legalPlatform.save') }}
            </Button>
            <Button @click="handleReset">
              <template #icon>
                <span class="icon-[lucide--refresh-cw] size-4" />
              </template>
              {{ $t('page.legalPlatform.reset') }}
            </Button>
            <Button @click="handleBack">
              <template #icon>
                <span class="icon-[lucide--arrow-left] size-4" />
              </template>
              {{ $t('page.legalPlatform.back') }}
            </Button>
          </Space>
        </FormItem>
      </Form>
    </Card>
  </Page>
</template>

<style scoped>
.ant-card {
  border-radius: 8px;
}

.ant-card .ant-card {
  border: 1px solid #f0f0f0;
}
</style>