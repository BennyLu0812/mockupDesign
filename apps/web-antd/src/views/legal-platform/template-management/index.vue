<script lang="ts" setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { $t } from '#/locales';

// 定義事件
const emit = defineEmits<{
  templateAdded: [template: any];
  templateUpdated: [template: any];
  templateDeleted: [templateId: string];
}>();
import {
  Button,
  Card,
  Table,
  Space,
  Modal,
  Form,
  FormItem,
  Input,
  Select,
  SelectOption,
  Switch,
  Drawer,
  Divider,
  Popconfirm,
  message,
} from 'ant-design-vue';

// 字段類型選項
const fieldTypeOptions = [
  { value: 'text', label: $t('page.legalPlatform.textField') },
  { value: 'number', label: $t('page.legalPlatform.numberField') },
  { value: 'date', label: $t('page.legalPlatform.dateField') },
  { value: 'select', label: $t('page.legalPlatform.selectField') },
  { value: 'textarea', label: $t('page.legalPlatform.textareaField') },
];

// 默認字段
const defaultFields = [
  { name: 'projectName', label: $t('page.legalPlatform.projectName'), type: 'text', required: true },
  { name: 'projectStartTime', label: $t('page.legalPlatform.projectStartTime'), type: 'date', required: true },
  { name: 'projectEndTime', label: $t('page.legalPlatform.projectEndTime'), type: 'date', required: true },
  { name: 'projectParticipants', label: $t('page.legalPlatform.projectParticipants'), type: 'select', required: true },
  { name: 'projectRemarks', label: $t('page.legalPlatform.projectRemarks'), type: 'textarea', required: false },
  { name: 'projectDueTime', label: $t('page.legalPlatform.projectDueTime'), type: 'date', required: true },
];

// 模版數據
const templates = ref([
  {
    id: 1,
    name: '一般項目模版',
    description: '適用於一般性的法律事務處理',
    type: 'general',
    fields: [...defaultFields],
    createTime: '2024-01-15 10:30:00',
    updateTime: '2024-01-15 10:30:00',
  },
  {
    id: 2,
    name: '法案項目模版',
    description: '適用於法案相關的項目管理',
    type: 'bill',
    fields: [
      ...defaultFields,
      { name: 'billNumber', label: '法案編號', type: 'text', required: true },
      { name: 'legalBasis', label: '法律依據', type: 'textarea', required: true },
    ],
    createTime: '2024-01-15 10:30:00',
    updateTime: '2024-01-15 10:30:00',
  },
  {
    id: 3,
    name: '其他項目模版',
    description: '適用於其他類型的項目',
    type: 'other',
    fields: [...defaultFields],
    createTime: '2024-01-15 10:30:00',
    updateTime: '2024-01-15 10:30:00',
  },
]);

// 表格列配置
const columns = [
  {
    title: $t('page.legalPlatform.templateName'),
    dataIndex: 'name',
    key: 'name',
    width: 200,
  },
  {
    title: $t('page.legalPlatform.templateDescription'),
    dataIndex: 'description',
    key: 'description',
    width: 300,
  },
  {
    title: '字段數量',
    key: 'fieldCount',
    width: 120,
  },
  {
    title: $t('page.legalPlatform.createTime'),
    dataIndex: 'createTime',
    key: 'createTime',
    width: 160,
  },
  {
    title: $t('page.legalPlatform.operation'),
    key: 'operation',
    width: 200,
    fixed: 'right',
  },
];

// 抽屜狀態
const drawerVisible = ref(false);
const drawerTitle = ref('');
const isEdit = ref(false);
const currentTemplateId = ref<number | null>(null);

// 表單數據
const formData = reactive({
  name: '',
  description: '',
  type: 'general',
  fields: [...defaultFields],
});

// 新字段表單
const newField = reactive({
  name: '',
  label: '',
  type: 'text',
  required: false,
});

// 重置表單
const resetForm = () => {
  Object.assign(formData, {
    name: '',
    description: '',
    type: 'general',
    fields: [...defaultFields],
  });
  Object.assign(newField, {
    name: '',
    label: '',
    type: 'text',
    required: false,
  });
};

// 新增模版
const handleAdd = () => {
  resetForm();
  drawerTitle.value = $t('page.legalPlatform.addTemplate');
  isEdit.value = false;
  currentTemplateId.value = null;
  drawerVisible.value = true;
};

// 編輯模版
const handleEdit = (record: any) => {
  const template = templates.value.find(t => t.id === record.id);
  if (template) {
    Object.assign(formData, {
      name: template.name,
      description: template.description,
      type: template.type,
      fields: [...template.fields],
    });
    drawerTitle.value = $t('page.legalPlatform.editTemplate');
    isEdit.value = true;
    currentTemplateId.value = record.id;
    drawerVisible.value = true;
  }
};

// 刪除模版
const handleDelete = (record: any) => {
  const index = templates.value.findIndex(t => t.id === record.id);
  if (index > -1) {
    templates.value.splice(index, 1);
    emit('templateDeleted', record.id.toString());
    message.success($t('page.legalPlatform.templateDeleteSuccess'));
  }
};

// 添加字段
const handleAddField = () => {
  if (!newField.name || !newField.label) {
    message.error('請填寫字段名稱和標籤');
    return;
  }
  
  // 檢查字段名稱是否重複
  const exists = formData.fields.some(field => field.name === newField.name);
  if (exists) {
    message.error('字段名稱已存在');
    return;
  }
  
  formData.fields.push({
    name: newField.name,
    label: newField.label,
    type: newField.type,
    required: newField.required,
  });
  
  // 重置新字段表單
  Object.assign(newField, {
    name: '',
    label: '',
    type: 'text',
    required: false,
  });
};

// 移除字段
const handleRemoveField = (index: number) => {
  // 不允許刪除默認字段
  if (index < defaultFields.length) {
    message.error('不能刪除默認字段');
    return;
  }
  formData.fields.splice(index, 1);
};

// 保存模版
const handleSave = () => {
  if (!formData.name || !formData.description) {
    message.error('請填寫模版名稱和描述');
    return;
  }
  
  const now = new Date().toLocaleString('zh-CN');
  
  if (isEdit.value && currentTemplateId.value) {
    // 編輯模式
    const index = templates.value.findIndex(t => t.id === currentTemplateId.value);
    if (index > -1) {
      const updatedTemplate = {
        ...templates.value[index],
        name: formData.name,
        description: formData.description,
        type: formData.type,
        fields: [...formData.fields],
        updateTime: now,
      };
      templates.value[index] = updatedTemplate;
      emit('templateUpdated', updatedTemplate);
    }
  } else {
    // 新增模式
    const newTemplate = {
      id: Date.now(),
      name: formData.name,
      description: formData.description,
      type: formData.type,
      fields: [...formData.fields],
      createTime: now,
      updateTime: now,
    };
    templates.value.push(newTemplate);
    emit('templateAdded', newTemplate);
  }
  
  message.success($t('page.legalPlatform.templateSaveSuccess'));
  drawerVisible.value = false;
};

// 取消操作
const handleCancel = () => {
  drawerVisible.value = false;
};

// 獲取字段類型標籤
const getFieldTypeLabel = (type: string) => {
  const option = fieldTypeOptions.find(opt => opt.value === type);
  return option ? option.label : type;
};

// 組件掛載時初始化數據
onMounted(() => {
  // 這裡可以調用API獲取模版列表數據
});
</script>

<template>
  <div class="template-management">
      <!-- 操作區域 -->
      <Card class="mb-4">
        <div class="flex justify-between items-center">
          <h2 class="text-lg font-medium">{{ $t('page.legalPlatform.templateManagementPage') }}</h2>
          <Button type="primary" @click="handleAdd">
            <span class="icon-[lucide--plus] size-4 mr-1" />
            {{ $t('page.legalPlatform.addTemplate') }}
          </Button>
        </div>
      </Card>

      <!-- 模版列表 -->
      <Card>
        <Table
          :columns="columns"
          :data-source="templates"
          :pagination="{ pageSize: 10 }"
          row-key="id"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'fieldCount'">
              <span>{{ record.fields.length }}</span>
            </template>
            <template v-else-if="column.key === 'operation'">
              <Space>
                <Button type="link" size="small" @click="handleEdit(record)">
                  <span class="icon-[lucide--edit] size-4 mr-1" />
                  {{ $t('page.legalPlatform.editTemplate') }}
                </Button>
                <Popconfirm
                  :title="$t('page.legalPlatform.confirmDeleteTemplate')"
                  @confirm="handleDelete(record)"
                >
                  <Button type="link" danger size="small">
                    <span class="icon-[lucide--trash-2] size-4 mr-1" />
                    {{ $t('page.legalPlatform.deleteTemplate') }}
                  </Button>
                </Popconfirm>
              </Space>
            </template>
          </template>
        </Table>
      </Card>

      <!-- 新增/編輯模版抽屜 -->
      <Drawer
        v-model:open="drawerVisible"
        :title="drawerTitle"
        width="600"
        :closable="true"
        @close="handleCancel"
      >
        <div class="template-form">
          <!-- 基本信息 -->
          <Card class="mb-4" :title="'基本信息'">
            <Form layout="vertical">
              <FormItem :label="$t('page.legalPlatform.templateName')" required>
                <Input
                  v-model:value="formData.name"
                  :placeholder="'請輸入模版名稱'"
                />
              </FormItem>
              <FormItem :label="$t('page.legalPlatform.templateDescription')" required>
                <Input.TextArea
                  v-model:value="formData.description"
                  :placeholder="'請輸入模版描述'"
                  :rows="3"
                />
              </FormItem>
            </Form>
          </Card>

          <!-- 默認字段 -->
          <Card class="mb-4" :title="$t('page.legalPlatform.defaultFields')">
            <div class="space-y-3">
              <div
                v-for="(field, index) in defaultFields"
                :key="field.name"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div class="flex-1">
                  <div class="font-medium">{{ field.label }}</div>
                  <div class="text-sm text-gray-500">
                    {{ getFieldTypeLabel(field.type) }} • 
                    {{ field.required ? $t('page.legalPlatform.required') : $t('page.legalPlatform.optional') }}
                  </div>
                </div>
                <div class="text-gray-400">
                  <span class="icon-[lucide--lock] size-4" />
                </div>
              </div>
            </div>
          </Card>

          <!-- 自定義字段 -->
          <Card class="mb-4" :title="$t('page.legalPlatform.customFields')">
            <!-- 現有自定義字段 -->
            <div v-if="formData.fields.length > defaultFields.length" class="mb-4">
              <div class="space-y-3">
                <div
                  v-for="(field, index) in formData.fields.slice(defaultFields.length)"
                  :key="field.name"
                  class="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
                >
                  <div class="flex-1">
                    <div class="font-medium">{{ field.label }}</div>
                    <div class="text-sm text-gray-500">
                      {{ getFieldTypeLabel(field.type) }} • 
                      {{ field.required ? $t('page.legalPlatform.required') : $t('page.legalPlatform.optional') }}
                    </div>
                  </div>
                  <Button
                    type="text"
                    danger
                    size="small"
                    @click="handleRemoveField(index + defaultFields.length)"
                  >
                    <span class="icon-[lucide--x] size-4" />
                  </Button>
                </div>
              </div>
              <Divider />
            </div>

            <!-- 添加新字段 -->
            <div class="add-field-form">
              <h4 class="mb-3 font-medium">{{ $t('page.legalPlatform.addField') }}</h4>
              <Form layout="vertical">
                <div class="grid grid-cols-2 gap-4">
                  <FormItem :label="$t('page.legalPlatform.fieldName')">
                    <Input
                      v-model:value="newField.name"
                      placeholder="請輸入字段名稱"
                    />
                  </FormItem>
                  <FormItem label="字段標籤">
                    <Input
                      v-model:value="newField.label"
                      placeholder="請輸入字段標籤"
                    />
                  </FormItem>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <FormItem :label="$t('page.legalPlatform.fieldType')">
                    <Select v-model:value="newField.type">
                      <SelectOption
                        v-for="option in fieldTypeOptions"
                        :key="option.value"
                        :value="option.value"
                      >
                        {{ option.label }}
                      </SelectOption>
                    </Select>
                  </FormItem>
                  <FormItem :label="$t('page.legalPlatform.fieldRequired')">
                    <Switch v-model:checked="newField.required" />
                  </FormItem>
                </div>
                <FormItem>
                  <Button type="dashed" block @click="handleAddField">
                    <span class="icon-[lucide--plus] size-4 mr-1" />
                    {{ $t('page.legalPlatform.addField') }}
                  </Button>
                </FormItem>
              </Form>
            </div>
          </Card>
        </div>

        <!-- 抽屜底部操作按鈕 -->
        <template #footer>
          <div class="flex justify-end space-x-2">
            <Button @click="handleCancel">
              {{ $t('page.legalPlatform.cancel') }}
            </Button>
            <Button type="primary" @click="handleSave">
              {{ $t('page.legalPlatform.save') }}
            </Button>
          </div>
        </template>
      </Drawer>
    </div>
</template>

<style scoped>
.template-management {
  .template-form {
    max-height: calc(100vh - 200px);
    overflow-y: auto;
  }
  
  .add-field-form {
    border: 1px dashed #d9d9d9;
    border-radius: 8px;
    padding: 16px;
    background-color: #fafafa;
  }
}
</style>