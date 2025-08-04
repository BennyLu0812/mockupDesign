<script lang="ts" setup>
import { ref, reactive, onMounted, computed } from 'vue';
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
  InputNumber,
  Row,
  Select,
  SelectOption,
  Space,
  Switch,
  Tag,
  Upload,
  message,
  Divider,
} from 'ant-design-vue';

const router = useRouter();
const route = useRoute();

// 表單引用
const formRef = ref();

// 是否編輯模式
const isEdit = computed(() => route.query.mode === 'edit');
const libraryId = computed(() => route.query.id);

// 表單數據
const formData = reactive({
  name: '',
  description: '',
  type: '部門文件庫',
  department: '',
  owner: '',
  status: true,
  tags: [] as string[],
  permissions: {
    viewDepartments: [] as string[],
    editDepartments: [] as string[],
    deleteDepartments: [] as string[],
    uploadDepartments: [] as string[],
    downloadDepartments: [] as string[],
  },
  quota: {
    storageLimit: 10, // GB
    fileCountLimit: 10000,
    singleFileLimit: 100, // MB
  },
  allowedFileTypes: [] as string[],
  forbiddenFileTypes: [] as string[],
  customFields: [] as Array<{
    id: string;
    name: string;
    displayName: string;
    dataType: string;
    required: boolean;
    defaultValue: string;
    validationRules: string;
  }>,
  backup: {
    enabled: true,
    frequency: 'daily',
    retention: 30, // days
  },
});

// 表單驗證規則
const rules = {
  name: [
    { required: true, message: '請輸入文件庫名稱', trigger: 'blur' },
    { min: 2, max: 50, message: '文件庫名稱長度應在2-50個字符之間', trigger: 'blur' },
  ],
  description: [
    { required: true, message: '請輸入文件庫描述', trigger: 'blur' },
    { max: 200, message: '描述長度不能超過200個字符', trigger: 'blur' },
  ],
  type: [
    { required: true, message: '請選擇文件庫類型', trigger: 'change' },
  ],
  department: [
    { required: true, message: '請選擇所屬部門', trigger: 'change' },
  ],
  owner: [
    { required: true, message: '請選擇文件庫負責人', trigger: 'change' },
  ],
};

// 部門選項
const departmentOptions = [
  { label: '法務部', value: '法務部' },
  { label: '行政部', value: '行政部' },
  { label: '秘書處', value: '秘書處' },
  { label: '項目組', value: '項目組' },
  { label: '全部門', value: '全部門' },
];

// 文件庫類型選項
const libraryTypeOptions = [
  { label: $t('page.legalPlatform.publicLibrary'), value: '公共文件庫' },
  { label: $t('page.legalPlatform.privateLibrary'), value: '私有文件庫' },
  { label: $t('page.legalPlatform.departmentLibrary'), value: '部門文件庫' },
  { label: $t('page.legalPlatform.projectLibrary'), value: '項目文件庫' },
];

// 用戶選項
const userOptions = [
  { label: '陳大文', value: '陳大文' },
  { label: '張三', value: '張三' },
  { label: '李四', value: '李四' },
  { label: '王五', value: '王五' },
];

// 數據類型選項
const dataTypeOptions = [
  { label: '文本', value: 'text' },
  { label: '數字', value: 'number' },
  { label: '日期', value: 'date' },
  { label: '選擇', value: 'select' },
  { label: '多行文本', value: 'textarea' },
  { label: '布爾值', value: 'boolean' },
];

// 備份頻率選項
const backupFrequencyOptions = [
  { label: '每日', value: 'daily' },
  { label: '每週', value: 'weekly' },
  { label: '每月', value: 'monthly' },
  { label: '手動', value: 'manual' },
];

// 常見文件類型
const commonFileTypes = [
  'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',
  'txt', 'rtf', 'jpg', 'jpeg', 'png', 'gif', 'bmp',
  'zip', 'rar', '7z', 'mp4', 'avi', 'mov', 'mp3', 'wav'
];

// 標籤輸入
const tagInput = ref('');
const allowedFileTypeInput = ref('');
const forbiddenFileTypeInput = ref('');

// 添加標籤
const addTag = () => {
  if (tagInput.value && !formData.tags.includes(tagInput.value)) {
    formData.tags.push(tagInput.value);
    tagInput.value = '';
  }
};

// 移除標籤
const removeTag = (tag: string) => {
  const index = formData.tags.indexOf(tag);
  if (index > -1) {
    formData.tags.splice(index, 1);
  }
};

// 添加允許的文件類型
const addAllowedFileType = () => {
  if (allowedFileTypeInput.value && !formData.allowedFileTypes.includes(allowedFileTypeInput.value)) {
    formData.allowedFileTypes.push(allowedFileTypeInput.value);
    allowedFileTypeInput.value = '';
  }
};

// 移除允許的文件類型
const removeAllowedFileType = (type: string) => {
  const index = formData.allowedFileTypes.indexOf(type);
  if (index > -1) {
    formData.allowedFileTypes.splice(index, 1);
  }
};

// 添加禁止的文件類型
const addForbiddenFileType = () => {
  if (forbiddenFileTypeInput.value && !formData.forbiddenFileTypes.includes(forbiddenFileTypeInput.value)) {
    formData.forbiddenFileTypes.push(forbiddenFileTypeInput.value);
    forbiddenFileTypeInput.value = '';
  }
};

// 移除禁止的文件類型
const removeForbiddenFileType = (type: string) => {
  const index = formData.forbiddenFileTypes.indexOf(type);
  if (index > -1) {
    formData.forbiddenFileTypes.splice(index, 1);
  }
};

// 添加自定義字段
const addCustomField = () => {
  const newField = {
    id: Date.now().toString(),
    name: '',
    displayName: '',
    dataType: 'text',
    required: false,
    defaultValue: '',
    validationRules: '',
  };
  formData.customFields.push(newField);
};

// 移除自定義字段
const removeCustomField = (index: number) => {
  formData.customFields.splice(index, 1);
};

// 快速添加文件類型
const addCommonFileType = (type: string, target: 'allowed' | 'forbidden') => {
  if (target === 'allowed' && !formData.allowedFileTypes.includes(type)) {
    formData.allowedFileTypes.push(type);
  } else if (target === 'forbidden' && !formData.forbiddenFileTypes.includes(type)) {
    formData.forbiddenFileTypes.push(type);
  }
};

// 保存表單
const handleSave = async () => {
  try {
    await formRef.value.validate();
    
    // 這裡應該調用API保存數據
    console.log('保存數據:', formData);
    
    message.success(isEdit.value ? '文件庫更新成功' : '文件庫創建成功');
    router.push('/legal-platform/file-management/library-list');
  } catch (error) {
    console.error('表單驗證失敗:', error);
  }
};

// 取消操作
const handleCancel = () => {
  router.back();
};

// 加載數據（編輯模式）
const loadData = async () => {
  if (isEdit.value && libraryId.value) {
    // 這裡應該調用API加載數據
    console.log('加載文件庫數據:', libraryId.value);
    
    // 模擬數據
    Object.assign(formData, {
      name: '法律條文資料庫',
      description: '存放各類法律條文和相關文件',
      type: '部門文件庫',
      department: '法務部',
      owner: '陳大文',
      status: true,
      tags: ['法律', '條文', '重要'],
      permissions: {
        viewDepartments: ['法務部', '秘書處'],
        editDepartments: ['法務部'],
        deleteDepartments: ['法務部'],
        uploadDepartments: ['法務部'],
        downloadDepartments: ['法務部', '秘書處'],
      },
      quota: {
        storageLimit: 20,
        fileCountLimit: 15000,
        singleFileLimit: 200,
      },
      allowedFileTypes: ['pdf', 'doc', 'docx', 'txt'],
      forbiddenFileTypes: ['exe', 'bat'],
      customFields: [
        {
          id: '1',
          name: 'priority',
          displayName: '優先級',
          dataType: 'select',
          required: false,
          defaultValue: '中',
          validationRules: '高,中,低',
        },
      ],
      backup: {
        enabled: true,
        frequency: 'daily',
        retention: 30,
      },
    });
  }
};

// 組件掛載時加載數據
onMounted(() => {
  loadData();
});
</script>

<template>
  <Page 
    :description="isEdit ? '編輯文件庫信息和配置' : '創建新的文件庫'"
    :title="isEdit ? '編輯文件庫' : $t('page.legalPlatform.fileLibraryCreate')"
  >
    <Form
      ref="formRef"
      :model="formData"
      :rules="rules"
      layout="vertical"
    >
      <!-- 基本信息 -->
      <Card title="基本信息" class="mb-4">
        <Row :gutter="16">
          <Col :span="12">
            <FormItem :label="$t('page.legalPlatform.fileLibraryName')" name="name">
              <Input 
                v-model:value="formData.name" 
                :placeholder="$t('page.legalPlatform.fileLibraryName')"
              />
            </FormItem>
          </Col>
          <Col :span="12">
            <FormItem :label="$t('page.legalPlatform.fileLibraryType')" name="type">
              <Select v-model:value="formData.type">
                <SelectOption 
                  v-for="option in libraryTypeOptions" 
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
            <FormItem :label="$t('page.legalPlatform.fileLibraryDepartment')" name="department">
              <Select v-model:value="formData.department">
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
            <FormItem :label="$t('page.legalPlatform.fileLibraryOwner')" name="owner">
              <Select v-model:value="formData.owner">
                <SelectOption 
                  v-for="option in userOptions" 
                  :key="option.value" 
                  :value="option.value"
                >
                  {{ option.label }}
                </SelectOption>
              </Select>
            </FormItem>
          </Col>
        </Row>
        
        <FormItem :label="$t('page.legalPlatform.fileLibraryDescription')" name="description">
          <Input.TextArea 
            v-model:value="formData.description" 
            :placeholder="$t('page.legalPlatform.fileLibraryDescription')"
            :rows="3"
          />
        </FormItem>
        
        <FormItem :label="$t('page.legalPlatform.fileLibraryStatus')">
          <Switch v-model:checked="formData.status" />
          <span class="ml-2">{{ formData.status ? $t('page.legalPlatform.active') : $t('page.legalPlatform.inactive') }}</span>
        </FormItem>
        
        <!-- 標籤 -->
        <FormItem :label="$t('page.legalPlatform.fileLibraryTags')">
          <div class="flex flex-wrap gap-2 mb-2">
            <Tag 
              v-for="tag in formData.tags" 
              :key="tag" 
              closable 
              @close="removeTag(tag)"
            >
              {{ tag }}
            </Tag>
          </div>
          <div class="flex gap-2">
            <Input 
              v-model:value="tagInput" 
              placeholder="輸入標籤名稱"
              style="width: 200px"
              @press-enter="addTag"
            />
            <Button @click="addTag">添加標籤</Button>
          </div>
        </FormItem>
      </Card>

      <!-- 權限設置 -->
      <Card title="權限設置" class="mb-4">
        <Row :gutter="16">
          <Col :span="12">
            <FormItem :label="$t('page.legalPlatform.viewPermission')">
              <Select 
                v-model:value="formData.permissions.viewDepartments" 
                mode="multiple"
                placeholder="選擇可查看的部門"
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
            <FormItem :label="$t('page.legalPlatform.editPermission')">
              <Select 
                v-model:value="formData.permissions.editDepartments" 
                mode="multiple"
                placeholder="選擇可編輯的部門"
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
        </Row>
        
        <Row :gutter="16">
          <Col :span="12">
            <FormItem :label="$t('page.legalPlatform.uploadPermission')">
              <Select 
                v-model:value="formData.permissions.uploadDepartments" 
                mode="multiple"
                placeholder="選擇可上傳的部門"
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
            <FormItem :label="$t('page.legalPlatform.deletePermission')">
              <Select 
                v-model:value="formData.permissions.deleteDepartments" 
                mode="multiple"
                placeholder="選擇可刪除的部門"
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
        </Row>
      </Card>



      <!-- 文件類型限制 -->
      <Card title="文件類型限制" class="mb-4">
        <!-- 允許的文件類型 -->
        <FormItem :label="$t('page.legalPlatform.allowedFileTypes')">
          <div class="flex flex-wrap gap-2 mb-2">
            <Tag 
              v-for="type in formData.allowedFileTypes" 
              :key="type" 
              color="green"
              closable 
              @close="removeAllowedFileType(type)"
            >
              .{{ type }}
            </Tag>
          </div>
          <div class="flex gap-2 mb-2">
            <Input 
              v-model:value="allowedFileTypeInput" 
              placeholder="輸入文件擴展名（如：pdf）"
              style="width: 200px"
              @press-enter="addAllowedFileType"
            />
            <Button @click="addAllowedFileType">添加</Button>
          </div>
          <div class="text-sm text-gray-500 mb-2">常用文件類型：</div>
          <div class="flex flex-wrap gap-1">
            <Tag 
              v-for="type in commonFileTypes" 
              :key="type" 
              class="cursor-pointer"
              @click="addCommonFileType(type, 'allowed')"
            >
              .{{ type }}
            </Tag>
          </div>
        </FormItem>
        
        <Divider />
        
        <!-- 禁止的文件類型 -->
        <FormItem :label="$t('page.legalPlatform.forbiddenFileTypes')">
          <div class="flex flex-wrap gap-2 mb-2">
            <Tag 
              v-for="type in formData.forbiddenFileTypes" 
              :key="type" 
              color="red"
              closable 
              @close="removeForbiddenFileType(type)"
            >
              .{{ type }}
            </Tag>
          </div>
          <div class="flex gap-2">
            <Input 
              v-model:value="forbiddenFileTypeInput" 
              placeholder="輸入文件擴展名（如：exe）"
              style="width: 200px"
              @press-enter="addForbiddenFileType"
            />
            <Button @click="addForbiddenFileType">添加</Button>
          </div>
        </FormItem>
      </Card>

      <!-- 自定義字段 -->
      <Card title="自定義字段" class="mb-4">
        <div v-for="(field, index) in formData.customFields" :key="field.id" class="mb-4 p-4 border border-gray-200 rounded">
          <Row :gutter="16">
            <Col :span="6">
              <FormItem label="字段名稱">
                <Input v-model:value="field.name" placeholder="字段名稱" />
              </FormItem>
            </Col>
            <Col :span="6">
              <FormItem :label="$t('page.legalPlatform.fieldDisplayName')">
                <Input v-model:value="field.displayName" placeholder="顯示名稱" />
              </FormItem>
            </Col>
            <Col :span="6">
              <FormItem :label="$t('page.legalPlatform.fieldDataType')">
                <Select v-model:value="field.dataType">
                  <SelectOption 
                    v-for="option in dataTypeOptions" 
                    :key="option.value" 
                    :value="option.value"
                  >
                    {{ option.label }}
                  </SelectOption>
                </Select>
              </FormItem>
            </Col>
            <Col :span="6">
              <FormItem label="操作">
                <div class="flex items-center gap-2">
                  <Switch v-model:checked="field.required" size="small" />
                  <span class="text-sm">必填</span>
                  <Button type="link" danger size="small" @click="removeCustomField(index)">
                    <template #icon>
                      <span class="icon-[lucide--trash-2] size-4" />
                    </template>
                  </Button>
                </div>
              </FormItem>
            </Col>
          </Row>
          
          <Row :gutter="16">
            <Col :span="12">
              <FormItem :label="$t('page.legalPlatform.fieldDefaultValue')">
                <Input v-model:value="field.defaultValue" placeholder="默認值" />
              </FormItem>
            </Col>
            <Col :span="12">
              <FormItem :label="$t('page.legalPlatform.fieldValidationRules')">
                <Input v-model:value="field.validationRules" placeholder="驗證規則" />
              </FormItem>
            </Col>
          </Row>
        </div>
        
        <Button type="dashed" block @click="addCustomField">
          <template #icon>
            <span class="icon-[lucide--plus] size-4" />
          </template>
          {{ $t('page.legalPlatform.addCustomField') }}
        </Button>
      </Card>



      <!-- 操作按鈕 -->
      <Card>
        <Space>
          <Button type="primary" @click="handleSave">
            <template #icon>
              <span class="icon-[lucide--save] size-4" />
            </template>
            {{ $t('page.legalPlatform.save') }}
          </Button>
          <Button @click="handleCancel">
            <template #icon>
              <span class="icon-[lucide--arrow-left] size-4" />
            </template>
            {{ $t('page.legalPlatform.cancel') }}
          </Button>
        </Space>
      </Card>
    </Form>
  </Page>
</template>

<style scoped>
.ant-input-number {
  width: 100%;
}

.ant-tag {
  margin: 2px;
}
</style>