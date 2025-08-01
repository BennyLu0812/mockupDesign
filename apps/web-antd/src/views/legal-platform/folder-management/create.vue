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
  permissions: {
    inheritFromParent: true,
    customPermissions: [],
  },
  settings: {
    maxFileSize: 100,
    maxFileCount: 1000,
    allowedFileTypes: [],
    autoBackup: true,
    enableVersionControl: true,
    enableAuditLog: true,
  },
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
  { label: '法務部', value: 'legal' },
  { label: '研究部', value: 'research' },
  { label: '行政部', value: 'admin' },
];

// 父文件夾樹形數據
const folderTreeData = [
  {
    title: '根目錄',
    value: 'root',
    children: [
      {
        title: '法律文件庫',
        value: 'legal-documents',
        children: [
          { title: '法規', value: 'regulations' },
          { title: '判例', value: 'cases' },
        ],
      },
      {
        title: '合同模板',
        value: 'contract-templates',
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

// 權限選項
const permissionOptions = [
  { label: $t('page.legalPlatform.viewPermission'), value: 'view' },
  { label: $t('page.legalPlatform.editPermission'), value: 'edit' },
  { label: $t('page.legalPlatform.deletePermission'), value: 'delete' },
  { label: $t('page.legalPlatform.uploadPermission'), value: 'upload' },
  { label: $t('page.legalPlatform.downloadPermission'), value: 'download' },
  { label: $t('page.legalPlatform.sharePermission'), value: 'share' },
];

// 文件類型選項
const fileTypeOptions = [
  { label: 'PDF', value: 'pdf' },
  { label: 'Word', value: 'doc,docx' },
  { label: 'Excel', value: 'xls,xlsx' },
  { label: 'PowerPoint', value: 'ppt,pptx' },
  { label: '圖片', value: 'jpg,jpeg,png,gif' },
  { label: '文本', value: 'txt' },
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
      department: 'legal',
      tags: ['important', 'legal'],
      permissions: {
        inheritFromParent: false,
        customPermissions: ['view', 'edit', 'upload'],
      },
      settings: {
        maxFileSize: 200,
        maxFileCount: 2000,
        allowedFileTypes: ['pdf', 'doc,docx'],
        autoBackup: true,
        enableVersionControl: true,
        enableAuditLog: true,
      },
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

        <!-- 權限設置 -->
        <Card class="mb-6" size="small">
          <template #title>
            <span class="icon-[lucide--shield] size-4 mr-2" />
            權限設置
          </template>
          
          <FormItem name="inheritFromParent" label="繼承父文件夾權限">
            <Switch v-model:checked="formData.permissions.inheritFromParent" />
            <div class="text-gray-500 text-sm mt-1">
              開啟後將自動繼承父文件夾的權限設置
            </div>
          </FormItem>

          <FormItem 
            v-if="!formData.permissions.inheritFromParent" 
            name="customPermissions" 
            label="自定義權限"
          >
            <CheckboxGroup v-model:value="formData.permissions.customPermissions">
              <Row :gutter="[16, 8]">
                <Col v-for="permission in permissionOptions" :key="permission.value" :span="8">
                  <Checkbox :value="permission.value">
                    {{ permission.label }}
                  </Checkbox>
                </Col>
              </Row>
            </CheckboxGroup>
          </FormItem>
        </Card>

        <!-- 高級設置 -->
        <Card class="mb-6" size="small">
          <template #title>
            <span class="icon-[lucide--settings] size-4 mr-2" />
            高級設置
          </template>
          
          <Row :gutter="16">
            <Col :span="12">
              <FormItem name="maxFileSize" label="單文件大小限制 (MB)">
                <InputNumber 
                  v-model:value="formData.settings.maxFileSize" 
                  :min="1" 
                  :max="1024" 
                  class="w-full"
                />
              </FormItem>
            </Col>
            <Col :span="12">
              <FormItem name="maxFileCount" label="文件數量限制">
                <InputNumber 
                  v-model:value="formData.settings.maxFileCount" 
                  :min="1" 
                  :max="10000" 
                  class="w-full"
                />
              </FormItem>
            </Col>
          </Row>

          <FormItem name="allowedFileTypes" label="允許的文件類型">
            <CheckboxGroup v-model:value="formData.settings.allowedFileTypes">
              <Row :gutter="[16, 8]">
                <Col v-for="fileType in fileTypeOptions" :key="fileType.value" :span="6">
                  <Checkbox :value="fileType.value">
                    {{ fileType.label }}
                  </Checkbox>
                </Col>
              </Row>
            </CheckboxGroup>
          </FormItem>

          <Row :gutter="16">
            <Col :span="8">
              <FormItem name="autoBackup" label="自動備份">
                <Switch v-model:checked="formData.settings.autoBackup" />
              </FormItem>
            </Col>
            <Col :span="8">
              <FormItem name="enableVersionControl" label="版本控制">
                <Switch v-model:checked="formData.settings.enableVersionControl" />
              </FormItem>
            </Col>
            <Col :span="8">
              <FormItem name="enableAuditLog" label="審計日誌">
                <Switch v-model:checked="formData.settings.enableAuditLog" />
              </FormItem>
            </Col>
          </Row>
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