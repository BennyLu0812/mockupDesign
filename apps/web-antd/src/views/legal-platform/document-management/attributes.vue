<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
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
  Table,
  Tag,
  message,
  Modal,
  Popconfirm,
  Switch,
  InputNumber,
  Textarea,
  Radio,
  RadioGroup,
  Checkbox,
  CheckboxGroup,
  Divider,
  Tabs,
  TabPane,
} from 'ant-design-vue';

const router = useRouter();

// 當前標籤頁
const activeTab = ref('custom');

// 搜索表單
const searchForm = reactive({
  attributeName: '',
  attributeType: '',
  isRequired: '',
  status: '',
});

// 自定義屬性數據
const customAttributes = ref([
  {
    id: 'attr-001',
    name: '所屬部門',
    key: 'department',
    type: 'select',
    description: '文件所屬的部門',
    isRequired: true,
    isSystem: false,
    status: 'active',
    options: ['法務部', '人事部', '財務部', '市場部', '技術部'],
    defaultValue: '法務部',
    sortOrder: 1,
    createTime: '2024-01-10 09:00:00',
    updateTime: '2024-01-15 14:30:00',
  },
  {
    id: 'attr-002',
    name: '文件分類',
    key: 'category',
    type: 'select',
    description: '文件的業務分類',
    isRequired: true,
    isSystem: false,
    status: 'active',
    options: ['合同模板', '案例分析', '統計報表', '會議記錄', '宣傳材料'],
    defaultValue: '合同模板',
    sortOrder: 2,
    createTime: '2024-01-10 09:15:00',
    updateTime: '2024-01-18 10:20:00',
  },
  {
    id: 'attr-003',
    name: '機密等級',
    key: 'confidentiality',
    type: 'radio',
    description: '文件的機密程度',
    isRequired: true,
    isSystem: false,
    status: 'active',
    options: ['公開', '內部', '機密', '絕密'],
    defaultValue: '內部',
    sortOrder: 3,
    createTime: '2024-01-10 09:30:00',
    updateTime: '2024-01-20 16:45:00',
  },
  {
    id: 'attr-004',
    name: '關鍵詞',
    key: 'keywords',
    type: 'text',
    description: '文件的關鍵詞，用逗號分隔',
    isRequired: false,
    isSystem: false,
    status: 'active',
    options: [],
    defaultValue: '',
    sortOrder: 4,
    createTime: '2024-01-10 10:00:00',
    updateTime: '2024-01-16 11:15:00',
  },
  {
    id: 'attr-005',
    name: '有效期',
    key: 'expiryDate',
    type: 'date',
    description: '文件的有效截止日期',
    isRequired: false,
    isSystem: false,
    status: 'active',
    options: [],
    defaultValue: '',
    sortOrder: 5,
    createTime: '2024-01-12 14:20:00',
    updateTime: '2024-01-19 09:30:00',
  },
  {
    id: 'attr-006',
    name: '重要程度',
    key: 'importance',
    type: 'number',
    description: '文件重要程度評分（1-10）',
    isRequired: false,
    isSystem: false,
    status: 'inactive',
    options: [],
    defaultValue: '5',
    sortOrder: 6,
    createTime: '2024-01-14 16:45:00',
    updateTime: '2024-01-21 13:20:00',
  },
]);

// 系統屬性數據
const systemAttributes = ref([
  {
    id: 'sys-001',
    name: '文件名稱',
    key: 'fileName',
    type: 'text',
    description: '文件的顯示名稱',
    isRequired: true,
    isSystem: true,
    status: 'active',
    isEditable: false,
  },
  {
    id: 'sys-002',
    name: '文件大小',
    key: 'fileSize',
    type: 'text',
    description: '文件的存儲大小',
    isRequired: false,
    isSystem: true,
    status: 'active',
    isEditable: false,
  },
  {
    id: 'sys-003',
    name: '文件類型',
    key: 'fileType',
    type: 'text',
    description: '文件的格式類型',
    isRequired: false,
    isSystem: true,
    status: 'active',
    isEditable: false,
  },
  {
    id: 'sys-004',
    name: '上傳者',
    key: 'uploader',
    type: 'text',
    description: '文件的上傳用戶',
    isRequired: false,
    isSystem: true,
    status: 'active',
    isEditable: false,
  },
  {
    id: 'sys-005',
    name: '上傳時間',
    key: 'uploadTime',
    type: 'datetime',
    description: '文件的上傳時間',
    isRequired: false,
    isSystem: true,
    status: 'active',
    isEditable: false,
  },
  {
    id: 'sys-006',
    name: '最後修改時間',
    key: 'lastModified',
    type: 'datetime',
    description: '文件的最後修改時間',
    isRequired: false,
    isSystem: true,
    status: 'active',
    isEditable: false,
  },
]);

// 分頁配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 6,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number, range: [number, number]) => 
    `第 ${range[0]}-${range[1]} 條，共 ${total} 條`,
});

// 屬性編輯模態框
const editModalVisible = ref(false);
const editForm = reactive({
  id: '',
  name: '',
  key: '',
  type: 'text',
  description: '',
  isRequired: false,
  status: 'active',
  options: [],
  defaultValue: '',
  sortOrder: 1,
});

// 屬性類型選項
const attributeTypeOptions = [
  { label: '文本', value: 'text' },
  { label: '數字', value: 'number' },
  { label: '日期', value: 'date' },
  { label: '日期時間', value: 'datetime' },
  { label: '單選', value: 'radio' },
  { label: '多選', value: 'checkbox' },
  { label: '下拉選擇', value: 'select' },
  { label: '多行文本', value: 'textarea' },
  { label: '開關', value: 'switch' },
];

// 狀態選項
const statusOptions = [
  { label: '啟用', value: 'active' },
  { label: '禁用', value: 'inactive' },
];

// 表格列配置
const customColumns = [
  {
    title: '屬性名稱',
    dataIndex: 'name',
    key: 'name',
    width: 150,
  },
  {
    title: '屬性鍵',
    dataIndex: 'key',
    key: 'key',
    width: 120,
  },
  {
    title: '類型',
    dataIndex: 'type',
    key: 'type',
    width: 100,
  },
  {
    title: '必填',
    dataIndex: 'isRequired',
    key: 'isRequired',
    width: 80,
  },
  {
    title: '狀態',
    dataIndex: 'status',
    key: 'status',
    width: 80,
  },
  {
    title: '排序',
    dataIndex: 'sortOrder',
    key: 'sortOrder',
    width: 80,
  },
  {
    title: '描述',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: '操作',
    key: 'action',
    width: 200,
    fixed: 'right',
  },
];

const systemColumns = [
  {
    title: '屬性名稱',
    dataIndex: 'name',
    key: 'name',
    width: 150,
  },
  {
    title: '屬性鍵',
    dataIndex: 'key',
    key: 'key',
    width: 120,
  },
  {
    title: '類型',
    dataIndex: 'type',
    key: 'type',
    width: 100,
  },
  {
    title: '必填',
    dataIndex: 'isRequired',
    key: 'isRequired',
    width: 80,
  },
  {
    title: '狀態',
    dataIndex: 'status',
    key: 'status',
    width: 80,
  },
  {
    title: '描述',
    dataIndex: 'description',
    key: 'description',
  },
];

// 獲取屬性類型標籤
const getTypeTag = (type: string) => {
  const typeMap = {
    text: { color: 'blue', text: '文本' },
    number: { color: 'green', text: '數字' },
    date: { color: 'orange', text: '日期' },
    datetime: { color: 'purple', text: '日期時間' },
    radio: { color: 'cyan', text: '單選' },
    checkbox: { color: 'magenta', text: '多選' },
    select: { color: 'geekblue', text: '下拉選擇' },
    textarea: { color: 'lime', text: '多行文本' },
    switch: { color: 'gold', text: '開關' },
  };
  return typeMap[type] || { color: 'default', text: type };
};

// 搜索
const handleSearch = () => {
  console.log('搜索條件:', searchForm);
  message.success('搜索完成');
};

// 重置搜索
const handleReset = () => {
  Object.assign(searchForm, {
    attributeName: '',
    attributeType: '',
    isRequired: '',
    status: '',
  });
  message.info('搜索條件已重置');
};

// 新增屬性
const handleCreate = () => {
  Object.assign(editForm, {
    id: '',
    name: '',
    key: '',
    type: 'text',
    description: '',
    isRequired: false,
    status: 'active',
    options: [],
    defaultValue: '',
    sortOrder: customAttributes.value.length + 1,
  });
  editModalVisible.value = true;
};

// 編輯屬性
const handleEdit = (record: any) => {
  Object.assign(editForm, {
    ...record,
    options: [...(record.options || [])],
  });
  editModalVisible.value = true;
};

// 刪除屬性
const handleDelete = (record: any) => {
  const index = customAttributes.value.findIndex(item => item.id === record.id);
  if (index > -1) {
    customAttributes.value.splice(index, 1);
    pagination.total--;
    message.success(`屬性 "${record.name}" 已刪除`);
  }
};

// 切換狀態
const handleToggleStatus = (record: any) => {
  record.status = record.status === 'active' ? 'inactive' : 'active';
  const statusText = record.status === 'active' ? '啟用' : '禁用';
  message.success(`屬性 "${record.name}" 已${statusText}`);
};

// 保存屬性
const handleSave = () => {
  if (!editForm.name || !editForm.key) {
    message.error('請填寫屬性名稱和屬性鍵');
    return;
  }
  
  // 檢查屬性鍵是否重複
  const existingAttr = customAttributes.value.find(
    item => item.key === editForm.key && item.id !== editForm.id
  );
  if (existingAttr) {
    message.error('屬性鍵已存在，請使用其他鍵值');
    return;
  }
  
  if (editForm.id) {
    // 編輯
    const index = customAttributes.value.findIndex(item => item.id === editForm.id);
    if (index > -1) {
      customAttributes.value[index] = {
        ...editForm,
        updateTime: new Date().toLocaleString('zh-CN'),
      };
      message.success('屬性已更新');
    }
  } else {
    // 新增
    const newAttr = {
      ...editForm,
      id: `attr-${Date.now()}`,
      createTime: new Date().toLocaleString('zh-CN'),
      updateTime: new Date().toLocaleString('zh-CN'),
      isSystem: false,
    };
    customAttributes.value.push(newAttr);
    pagination.total++;
    message.success('屬性已創建');
  }
  
  editModalVisible.value = false;
};

// 添加選項
const addOption = () => {
  editForm.options.push('');
};

// 移除選項
const removeOption = (index: number) => {
  editForm.options.splice(index, 1);
};

// 上移
const handleMoveUp = (record: any) => {
  const index = customAttributes.value.findIndex(item => item.id === record.id);
  if (index > 0) {
    const temp = customAttributes.value[index];
    customAttributes.value[index] = customAttributes.value[index - 1];
    customAttributes.value[index - 1] = temp;
    
    // 更新排序
    customAttributes.value[index].sortOrder = index + 1;
    customAttributes.value[index - 1].sortOrder = index;
    
    message.success('已上移');
  }
};

// 下移
const handleMoveDown = (record: any) => {
  const index = customAttributes.value.findIndex(item => item.id === record.id);
  if (index < customAttributes.value.length - 1) {
    const temp = customAttributes.value[index];
    customAttributes.value[index] = customAttributes.value[index + 1];
    customAttributes.value[index + 1] = temp;
    
    // 更新排序
    customAttributes.value[index].sortOrder = index + 1;
    customAttributes.value[index + 1].sortOrder = index + 2;
    
    message.success('已下移');
  }
};

// 返回文件列表
const handleBackToList = () => {
  router.push('/legal-platform/document-management/list');
};
</script>

<template>
  <Page>
    <!-- 頁面頭部 -->
    <Card class="mb-4">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-xl font-semibold mb-2">{{ $t('page.legalPlatform.documentAttributes') }}</h2>
          <div class="text-gray-500">管理文件的自定義屬性和系統屬性</div>
        </div>
        <Space>
          <Button @click="handleBackToList">
            <template #icon>
              <span class="icon-[lucide--arrow-left] size-4" />
            </template>
            {{ $t('page.legalPlatform.back') }}
          </Button>
        </Space>
      </div>
    </Card>

    <!-- 搜索表單 -->
    <Card class="mb-4">
      <Form layout="inline" :model="searchForm">
        <FormItem label="屬性名稱">
          <Input 
            v-model:value="searchForm.attributeName" 
            placeholder="請輸入屬性名稱" 
            style="width: 200px"
          />
        </FormItem>
        
        <FormItem label="屬性類型">
          <Select 
            v-model:value="searchForm.attributeType" 
            placeholder="請選擇屬性類型" 
            style="width: 150px"
            allow-clear
          >
            <SelectOption 
              v-for="option in attributeTypeOptions" 
              :key="option.value" 
              :value="option.value"
            >
              {{ option.label }}
            </SelectOption>
          </Select>
        </FormItem>
        
        <FormItem label="是否必填">
          <Select 
            v-model:value="searchForm.isRequired" 
            placeholder="請選擇" 
            style="width: 120px"
            allow-clear
          >
            <SelectOption value="true">是</SelectOption>
            <SelectOption value="false">否</SelectOption>
          </Select>
        </FormItem>
        
        <FormItem label="狀態">
          <Select 
            v-model:value="searchForm.status" 
            placeholder="請選擇狀態" 
            style="width: 120px"
            allow-clear
          >
            <SelectOption 
              v-for="option in statusOptions" 
              :key="option.value" 
              :value="option.value"
            >
              {{ option.label }}
            </SelectOption>
          </Select>
        </FormItem>
        
        <FormItem>
          <Space>
            <Button type="primary" @click="handleSearch">
              <template #icon>
                <span class="icon-[lucide--search] size-4" />
              </template>
              {{ $t('page.legalPlatform.search') }}
            </Button>
            <Button @click="handleReset">
              <template #icon>
                <span class="icon-[lucide--rotate-ccw] size-4" />
              </template>
              {{ $t('page.legalPlatform.reset') }}
            </Button>
          </Space>
        </FormItem>
      </Form>
    </Card>

    <!-- 屬性管理標籤頁 -->
    <Card>
      <Tabs v-model:activeKey="activeTab">
        <!-- 自定義屬性 -->
        <TabPane key="custom" tab="自定義屬性">
          <div class="mb-4">
            <Button type="primary" @click="handleCreate">
              <template #icon>
                <span class="icon-[lucide--plus] size-4" />
              </template>
              新增屬性
            </Button>
          </div>
          
          <Table
            :columns="customColumns"
            :data-source="customAttributes"
            :pagination="pagination"
            :scroll="{ x: 1000 }"
            row-key="id"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'type'">
                <Tag :color="getTypeTag(record.type).color">
                  {{ getTypeTag(record.type).text }}
                </Tag>
              </template>
              
              <template v-if="column.key === 'isRequired'">
                <Tag :color="record.isRequired ? 'red' : 'default'">
                  {{ record.isRequired ? '是' : '否' }}
                </Tag>
              </template>
              
              <template v-if="column.key === 'status'">
                <Tag :color="record.status === 'active' ? 'green' : 'red'">
                  {{ record.status === 'active' ? '啟用' : '禁用' }}
                </Tag>
              </template>
              
              <template v-if="column.key === 'action'">
                <Space>
                  <Button size="small" @click="handleEdit(record)">
                    <template #icon>
                      <span class="icon-[lucide--edit] size-3" />
                    </template>
                    編輯
                  </Button>
                  
                  <Button 
                    size="small" 
                    :type="record.status === 'active' ? 'default' : 'primary'"
                    @click="handleToggleStatus(record)"
                  >
                    <template #icon>
                      <span :class="record.status === 'active' ? 'icon-[lucide--eye-off]' : 'icon-[lucide--eye]'" class="size-3" />
                    </template>
                    {{ record.status === 'active' ? '禁用' : '啟用' }}
                  </Button>
                  
                  <Button size="small" @click="handleMoveUp(record)">
                    <template #icon>
                      <span class="icon-[lucide--arrow-up] size-3" />
                    </template>
                    上移
                  </Button>
                  
                  <Button size="small" @click="handleMoveDown(record)">
                    <template #icon>
                      <span class="icon-[lucide--arrow-down] size-3" />
                    </template>
                    下移
                  </Button>
                  
                  <Popconfirm
                    title="確定要刪除這個屬性嗎？"
                    ok-text="確定"
                    cancel-text="取消"
                    @confirm="handleDelete(record)"
                  >
                    <Button size="small" danger>
                      <template #icon>
                        <span class="icon-[lucide--trash] size-3" />
                      </template>
                      刪除
                    </Button>
                  </Popconfirm>
                </Space>
              </template>
            </template>
          </Table>
        </TabPane>

        <!-- 系統屬性 -->
        <TabPane key="system" tab="系統屬性">
          <Table
            :columns="systemColumns"
            :data-source="systemAttributes"
            :pagination="false"
            row-key="id"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'type'">
                <Tag :color="getTypeTag(record.type).color">
                  {{ getTypeTag(record.type).text }}
                </Tag>
              </template>
              
              <template v-if="column.key === 'isRequired'">
                <Tag :color="record.isRequired ? 'red' : 'default'">
                  {{ record.isRequired ? '是' : '否' }}
                </Tag>
              </template>
              
              <template v-if="column.key === 'status'">
                <Tag :color="record.status === 'active' ? 'green' : 'red'">
                  {{ record.status === 'active' ? '啟用' : '禁用' }}
                </Tag>
              </template>
            </template>
          </Table>
        </TabPane>
      </Tabs>
    </Card>

    <!-- 屬性編輯模態框 -->
    <Modal
      v-model:open="editModalVisible"
      :title="editForm.id ? '編輯屬性' : '新增屬性'"
      width="600px"
      @ok="handleSave"
    >
      <Form layout="vertical" :model="editForm">
        <Row :gutter="16">
          <Col :span="12">
            <FormItem label="屬性名稱" required>
              <Input v-model:value="editForm.name" placeholder="請輸入屬性名稱" />
            </FormItem>
          </Col>
          <Col :span="12">
            <FormItem label="屬性鍵" required>
              <Input 
                v-model:value="editForm.key" 
                placeholder="請輸入屬性鍵（英文）" 
                :disabled="!!editForm.id"
              />
            </FormItem>
          </Col>
        </Row>
        
        <Row :gutter="16">
          <Col :span="12">
            <FormItem label="屬性類型">
              <Select v-model:value="editForm.type">
                <SelectOption 
                  v-for="option in attributeTypeOptions" 
                  :key="option.value" 
                  :value="option.value"
                >
                  {{ option.label }}
                </SelectOption>
              </Select>
            </FormItem>
          </Col>
          <Col :span="12">
            <FormItem label="排序">
              <InputNumber 
                v-model:value="editForm.sortOrder" 
                :min="1" 
                style="width: 100%"
              />
            </FormItem>
          </Col>
        </Row>
        
        <FormItem label="屬性描述">
          <Textarea 
            v-model:value="editForm.description" 
            :rows="2" 
            placeholder="請輸入屬性描述"
          />
        </FormItem>
        
        <Row :gutter="16">
          <Col :span="12">
            <FormItem label="是否必填">
              <Switch v-model:checked="editForm.isRequired" />
            </FormItem>
          </Col>
          <Col :span="12">
            <FormItem label="狀態">
              <RadioGroup v-model:value="editForm.status">
                <Radio value="active">啟用</Radio>
                <Radio value="inactive">禁用</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>
        
        <!-- 選項配置（僅對選擇類型顯示） -->
        <div v-if="['select', 'radio', 'checkbox'].includes(editForm.type)">
          <Divider>選項配置</Divider>
          
          <FormItem label="選項列表">
            <div class="space-y-2">
              <div 
                v-for="(option, index) in editForm.options" 
                :key="index" 
                class="flex items-center space-x-2"
              >
                <Input 
                  v-model:value="editForm.options[index]" 
                  placeholder="請輸入選項值"
                />
                <Button 
                  size="small" 
                  danger 
                  @click="removeOption(index)"
                >
                  <template #icon>
                    <span class="icon-[lucide--minus] size-3" />
                  </template>
                </Button>
              </div>
              
              <Button type="dashed" @click="addOption">
                <template #icon>
                  <span class="icon-[lucide--plus] size-4" />
                </template>
                添加選項
              </Button>
            </div>
          </FormItem>
        </div>
        
        <FormItem label="默認值">
          <Input 
            v-model:value="editForm.defaultValue" 
            placeholder="請輸入默認值（可選）"
          />
        </FormItem>
      </Form>
    </Modal>
  </Page>
</template>

<style scoped>
.ant-card {
  border-radius: 8px;
}
</style>