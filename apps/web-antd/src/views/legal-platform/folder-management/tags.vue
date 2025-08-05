<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
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
  Modal,
  Textarea,
  Pagination,
  message,
  Popconfirm,
} from 'ant-design-vue';

const router = useRouter();

// 搜索表單
const searchForm = reactive({
  tagName: '',
  tagCategory: undefined,
  tagColor: undefined,
});

// 分頁配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number, range: [number, number]) => 
    `第 ${range[0]}-${range[1]} 條，共 ${total} 條`,
});

// 標籤數據
const tagData = ref([
  {
    id: '1',
    tagName: '重要',
    tagColor: '#f50',
    tagCategory: 'system',
    tagDescription: '標記重要的文件夾',
    usageCount: 25,
    createTime: '2024-01-15 10:30:00',
    creator: '系統',
    status: 'active',
  },
  {
    id: '2',
    tagName: '法律',
    tagColor: '#2db7f5',
    tagCategory: 'custom',
    tagDescription: '法律相關文件夾',
    usageCount: 18,
    createTime: '2024-01-16 14:20:00',
    creator: 'João Silva',
    status: 'active',
  },
  {
    id: '3',
    tagName: '模板',
    tagColor: '#87d068',
    tagCategory: 'custom',
    tagDescription: '文件模板存放',
    usageCount: 12,
    createTime: '2024-01-17 09:15:00',
    creator: 'Maria Santos',
    status: 'active',
  },
  {
    id: '4',
    tagName: '合同',
    tagColor: '#ff7a45',
    tagCategory: 'custom',
    tagDescription: '合同相關文件',
    usageCount: 8,
    createTime: '2024-01-18 11:45:00',
    creator: 'Pedro Costa',
    status: 'inactive',
  },
  {
    id: '5',
    tagName: '案例',
    tagColor: '#722ed1',
    tagCategory: 'custom',
    tagDescription: '法律案例分析',
    usageCount: 15,
    createTime: '2024-01-19 16:30:00',
    creator: 'Ana Ferreira',
    status: 'active',
  },
]);

// 表格列配置
const columns = [
  {
    title: $t('page.legalPlatform.tagName'),
    dataIndex: 'tagName',
    key: 'tagName',
    width: 150,
  },
  {
    title: $t('page.legalPlatform.tagColor'),
    dataIndex: 'tagColor',
    key: 'tagColor',
    width: 100,
  },
  {
    title: $t('page.legalPlatform.tagCategory'),
    dataIndex: 'tagCategory',
    key: 'tagCategory',
    width: 120,
  },
  {
    title: $t('page.legalPlatform.tagDescription'),
    dataIndex: 'tagDescription',
    key: 'tagDescription',
    width: 200,
  },
  {
    title: '使用次數',
    dataIndex: 'usageCount',
    key: 'usageCount',
    width: 100,
  },
  {
    title: '創建者',
    dataIndex: 'creator',
    key: 'creator',
    width: 100,
  },
  {
    title: $t('page.legalPlatform.createTime'),
    dataIndex: 'createTime',
    key: 'createTime',
    width: 180,
  },
  {
    title: '狀態',
    dataIndex: 'status',
    key: 'status',
    width: 100,
  },
  {
    title: $t('page.legalPlatform.action'),
    key: 'action',
    width: 200,
    fixed: 'right',
  },
];

// 標籤分類選項
const categoryOptions = [
  { label: $t('page.legalPlatform.systemTags'), value: 'system' },
  { label: $t('page.legalPlatform.customTags'), value: 'custom' },
];

// 顏色選項
const colorOptions = [
  { label: '紅色', value: '#f50' },
  { label: '藍色', value: '#2db7f5' },
  { label: '綠色', value: '#87d068' },
  { label: '橙色', value: '#ff7a45' },
  { label: '紫色', value: '#722ed1' },
  { label: '青色', value: '#13c2c2' },
  { label: '粉色', value: '#eb2f96' },
  { label: '黃色', value: '#faad14' },
];

// 狀態選項
const statusOptions = [
  { label: '啟用', value: 'active' },
  { label: '停用', value: 'inactive' },
];

// 新增/編輯標籤表單
const tagForm = reactive({
  id: '',
  tagName: '',
  tagColor: '#2db7f5',
  tagCategory: 'custom',
  tagDescription: '',
  status: 'active',
});

// 表單驗證規則
const rules = {
  tagName: [
    { required: true, message: '請輸入標籤名稱', trigger: 'blur' },
    { min: 2, max: 20, message: '標籤名稱長度在 2 到 20 個字符', trigger: 'blur' },
  ],
  tagColor: [
    { required: true, message: '請選擇標籤顏色', trigger: 'change' },
  ],
  tagCategory: [
    { required: true, message: '請選擇標籤分類', trigger: 'change' },
  ],
};

// 模態框顯示狀態
const showModal = ref(false);
const isEdit = ref(false);
const formRef = ref();

// 搜索
const handleSearch = () => {
  console.log('搜索條件:', searchForm);
  // 這裡應該調用API進行搜索
  message.success('搜索成功');
};

// 重置
const handleReset = () => {
  Object.assign(searchForm, {
    tagName: '',
    tagCategory: undefined,
    tagColor: undefined,
  });
  message.success('重置成功');
};

// 新增標籤
const handleCreate = () => {
  isEdit.value = false;
  Object.assign(tagForm, {
    id: '',
    tagName: '',
    tagColor: '#2db7f5',
    tagCategory: 'custom',
    tagDescription: '',
    status: 'active',
  });
  showModal.value = true;
};

// 編輯標籤
const handleEdit = (record: any) => {
  isEdit.value = true;
  Object.assign(tagForm, record);
  showModal.value = true;
};

// 刪除標籤
const handleDelete = (record: any) => {
  console.log('刪除標籤:', record.id);
  message.success('標籤刪除成功');
};

// 切換狀態
const handleToggleStatus = (record: any) => {
  const newStatus = record.status === 'active' ? 'inactive' : 'active';
  console.log('切換狀態:', record.id, newStatus);
  record.status = newStatus;
  message.success(`標籤已${newStatus === 'active' ? '啟用' : '停用'}`);
};

// 保存標籤
const handleSave = async () => {
  try {
    await formRef.value.validate();
    console.log('保存標籤:', tagForm);
    
    if (isEdit.value) {
      message.success('標籤更新成功');
    } else {
      message.success('標籤創建成功');
    }
    
    showModal.value = false;
  } catch (error) {
    console.error('表單驗證失敗:', error);
  }
};

// 取消
const handleCancel = () => {
  showModal.value = false;
};

// 返回
const handleBack = () => {
  router.back();
};

// 分頁變化
const handlePageChange = (page: number, pageSize: number) => {
  pagination.current = page;
  pagination.pageSize = pageSize;
  // 重新加載數據
};

// 獲取分類標籤顏色
const getCategoryColor = (category: string) => {
  return category === 'system' ? 'blue' : 'green';
};

// 獲取狀態標籤顏色
const getStatusColor = (status: string) => {
  return status === 'active' ? 'green' : 'red';
};

// 組件掛載時加載數據
onMounted(() => {
  pagination.total = tagData.value.length;
});
</script>

<template>
  <Page>
    <!-- 頁面頭部 -->
    <Card class="mb-4">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-xl font-semibold mb-2">文件夾標籤管理</h2>
          <div class="text-gray-500">管理文件夾標籤，支持自定義標籤和系統標籤</div>
        </div>
        <Space>
          <Button @click="handleBack">
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
      <Form layout="vertical">
        <Row :gutter="16">
          <Col :span="6">
            <FormItem :label="$t('page.legalPlatform.tagName')">
              <Input 
                v-model:value="searchForm.tagName" 
                :placeholder="$t('page.legalPlatform.tagName')"
              />
            </FormItem>
          </Col>
          <Col :span="6">
            <FormItem :label="$t('page.legalPlatform.tagCategory')">
              <Select 
                v-model:value="searchForm.tagCategory" 
                :placeholder="$t('page.legalPlatform.tagCategory')"
                allow-clear
              >
                <SelectOption 
                  v-for="option in categoryOptions" 
                  :key="option.value" 
                  :value="option.value"
                >
                  {{ option.label }}
                </SelectOption>
              </Select>
            </FormItem>
          </Col>
          <Col :span="6">
            <FormItem :label="$t('page.legalPlatform.tagColor')">
              <Select 
                v-model:value="searchForm.tagColor" 
                :placeholder="$t('page.legalPlatform.tagColor')"
                allow-clear
              >
                <SelectOption 
                  v-for="option in colorOptions" 
                  :key="option.value" 
                  :value="option.value"
                >
                  <div class="flex items-center">
                    <div 
                      class="w-4 h-4 rounded mr-2" 
                      :style="{ backgroundColor: option.value }"
                    />
                    {{ option.label }}
                  </div>
                </SelectOption>
              </Select>
            </FormItem>
          </Col>
          <Col :span="6">
            <FormItem>
              <Space class="mt-6">
                <Button type="primary" @click="handleSearch">
                  <template #icon>
                    <span class="icon-[lucide--search] size-4" />
                  </template>
                  {{ $t('page.legalPlatform.search') }}
                </Button>
                <Button @click="handleReset">
                  <template #icon>
                    <span class="icon-[lucide--refresh-cw] size-4" />
                  </template>
                  {{ $t('page.legalPlatform.reset') }}
                </Button>
                <Button type="primary" @click="handleCreate">
                  <template #icon>
                    <span class="icon-[lucide--plus] size-4" />
                  </template>
                  {{ $t('page.legalPlatform.addTag') }}
                </Button>
              </Space>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Card>

    <!-- 標籤列表 -->
    <Card>
      <Table
        :columns="columns"
        :data-source="tagData"
        :pagination="false"
        :scroll="{ x: 1200 }"
        row-key="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'tagName'">
            <Tag :color="record.tagColor" class="text-white">
              {{ record.tagName }}
            </Tag>
          </template>
          <template v-else-if="column.key === 'tagColor'">
            <div class="flex items-center">
              <div 
                class="w-6 h-6 rounded border" 
                :style="{ backgroundColor: record.tagColor }"
              />
              <span class="ml-2 text-xs text-gray-500">{{ record.tagColor }}</span>
            </div>
          </template>
          <template v-else-if="column.key === 'tagCategory'">
            <Tag :color="getCategoryColor(record.tagCategory)">
              {{ categoryOptions.find(opt => opt.value === record.tagCategory)?.label }}
            </Tag>
          </template>
          <template v-else-if="column.key === 'status'">
            <Tag :color="getStatusColor(record.status)">
              {{ statusOptions.find(opt => opt.value === record.status)?.label }}
            </Tag>
          </template>
          <template v-else-if="column.key === 'action'">
            <Space>
              <Button type="link" size="small" @click="handleEdit(record)">
                <template #icon>
                  <span class="icon-[lucide--edit] size-4" />
                </template>
                {{ $t('page.legalPlatform.editTag') }}
              </Button>
              <Button 
                type="link" 
                size="small" 
                @click="handleToggleStatus(record)"
                :class="record.status === 'active' ? 'text-orange-500' : 'text-green-500'"
              >
                <template #icon>
                  <span 
                    :class="record.status === 'active' ? 'icon-[lucide--pause]' : 'icon-[lucide--play]'"
                    class="size-4" 
                  />
                </template>
                {{ record.status === 'active' ? '停用' : '啟用' }}
              </Button>
              <Popconfirm
                title="確定要刪除這個標籤嗎？"
                @confirm="handleDelete(record)"
              >
                <Button type="link" size="small" danger>
                  <template #icon>
                    <span class="icon-[lucide--trash-2] size-4" />
                  </template>
                  {{ $t('page.legalPlatform.deleteTag') }}
                </Button>
              </Popconfirm>
            </Space>
          </template>
        </template>
      </Table>

      <div class="mt-4 flex justify-end">
        <Pagination
          v-model:current="pagination.current"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          :show-size-changer="pagination.showSizeChanger"
          :show-quick-jumper="pagination.showQuickJumper"
          :show-total="pagination.showTotal"
          @change="handlePageChange"
        />
      </div>
    </Card>

    <!-- 新增/編輯標籤模態框 -->
    <Modal
      v-model:open="showModal"
      :title="isEdit ? $t('page.legalPlatform.editTag') : $t('page.legalPlatform.addTag')"
      @ok="handleSave"
      @cancel="handleCancel"
    >
      <Form
        ref="formRef"
        :model="tagForm"
        :rules="rules"
        layout="vertical"
      >
        <FormItem name="tagName" :label="$t('page.legalPlatform.tagName')">
          <Input 
            v-model:value="tagForm.tagName" 
            :placeholder="$t('page.legalPlatform.tagName')"
          />
        </FormItem>
        
        <FormItem name="tagColor" :label="$t('page.legalPlatform.tagColor')">
          <Select 
            v-model:value="tagForm.tagColor" 
            :placeholder="$t('page.legalPlatform.tagColor')"
          >
            <SelectOption 
              v-for="option in colorOptions" 
              :key="option.value" 
              :value="option.value"
            >
              <div class="flex items-center">
                <div 
                  class="w-4 h-4 rounded mr-2" 
                  :style="{ backgroundColor: option.value }"
                />
                {{ option.label }}
              </div>
            </SelectOption>
          </Select>
          <div class="mt-2">
            <Tag :color="tagForm.tagColor" class="text-white">
              {{ tagForm.tagName || '預覽標籤' }}
            </Tag>
          </div>
        </FormItem>

        <FormItem name="tagCategory" :label="$t('page.legalPlatform.tagCategory')">
          <Select 
            v-model:value="tagForm.tagCategory" 
            :placeholder="$t('page.legalPlatform.tagCategory')"
          >
            <SelectOption 
              v-for="option in categoryOptions" 
              :key="option.value" 
              :value="option.value"
            >
              {{ option.label }}
            </SelectOption>
          </Select>
        </FormItem>

        <FormItem name="tagDescription" :label="$t('page.legalPlatform.tagDescription')">
          <Textarea 
            v-model:value="tagForm.tagDescription" 
            :placeholder="$t('page.legalPlatform.tagDescription')"
            :rows="3"
          />
        </FormItem>

        <FormItem name="status" label="狀態">
          <Select 
            v-model:value="tagForm.status" 
            placeholder="請選擇狀態"
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
      </Form>
    </Modal>
  </Page>
</template>

<style scoped>
.ant-card {
  border-radius: 8px;
}
</style>