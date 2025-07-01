<script setup lang="ts">
import { ref, reactive, onMounted, h } from 'vue';
import { $t } from '#/locales';
import {
  Button,
  Table,
  Space,
  Input,
  DatePicker,
  Modal,
  Form,
  FormItem,
  Select,
  Upload,
  message,
  Popconfirm,
} from 'ant-design-vue';

import type { TableColumnsType, UploadProps } from 'ant-design-vue';
import type { ManuscriptRecord, ManuscriptReceiveForm, AmountType } from '@vben/types';
import dayjs from 'dayjs';

// 使用項目的國際化函數
const t = $t;

// 表格數據
const dataSource = ref<ManuscriptRecord[]>([]);
const loading = ref(false);
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 條記錄`,
});

// 搜索表單
const searchForm = reactive({
  manuscriptName: '',
  receiveTimeRange: [] as any[],
});

// 編輯模態框
const editModalVisible = ref(false);
const editForm = reactive<ManuscriptRecord>({
  id: '',
  number: '',
  receiveTime: '',
  receiverName: '',
  uploader: '',
  manuscriptName: '',
  amountType: 'pricing' as AmountType,
  amount: 0,
});

// 接收稿件模態框
const receiveModalVisible = ref(false);
const receiveForm = reactive<ManuscriptReceiveForm>({
  receiverName: '',
  uploader: '',
  manuscriptName: '',
  amountType: 'pricing' as AmountType,
  amount: 0,
  file: null,
});
const uploadMode = ref<'auto' | 'manual'>('auto');

// 表格列定義
const columns: TableColumnsType<ManuscriptRecord> = [
  {
    title: t('pos.manuscriptReceiving.list.number'),
    dataIndex: 'number',
    key: 'number',
    width: 120,
  },
  {
    title: t('pos.manuscriptReceiving.list.receiveTime'),
    dataIndex: 'receiveTime',
    key: 'receiveTime',
    width: 180,
  },
  {
    title: t('pos.manuscriptReceiving.list.receiverName'),
    dataIndex: 'receiverName',
    key: 'receiverName',
    width: 120,
  },
  {
    title: t('pos.manuscriptReceiving.list.uploader'),
    dataIndex: 'uploader',
    key: 'uploader',
    width: 120,
  },
  {
    title: t('pos.manuscriptReceiving.list.manuscriptName'),
    dataIndex: 'manuscriptName',
    key: 'manuscriptName',
    ellipsis: true,
  },
  {
    title: t('pos.manuscriptReceiving.list.amountType'),
    dataIndex: 'amountType',
    key: 'amountType',
    width: 100,
  },
  {
    title: t('pos.manuscriptReceiving.list.amount'),
    dataIndex: 'amount',
    key: 'amount',
    width: 120,
  },
  {
    title: t('pos.manuscriptReceiving.list.operation'),
    key: 'operation',
    width: 200,
  },
];

// 模擬數據
const mockData: ManuscriptRecord[] = [
  {
    id: '1',
    number: 'MS001',
    receiveTime: '2024-01-15 10:30:00',
    receiverName: '張三',
    uploader: '李四',
    manuscriptName: '政府公告稿件.pdf',
    amountType: 'pricing',
    amount: 150,
    fileName: '政府公告稿件.pdf',
  },
  {
    id: '2',
    number: 'MS002',
    receiveTime: '2024-01-15 14:20:00',
    receiverName: '王五',
    uploader: '趙六',
    manuscriptName: '法律條文修訂.docx',
    amountType: 'deposit',
    amount: 200,
    fileName: '法律條文修訂.docx',
  },
  {
    id: '3',
    number: 'MS003',
    receiveTime: '2024-01-16 09:15:00',
    receiverName: '陳七',
    uploader: '劉八',
    manuscriptName: '教育政策文件.pdf',
    amountType: 'pricing',
    amount: 300,
    fileName: '教育政策文件.pdf',
  },
];

// 獲取數據
const fetchData = async () => {
  loading.value = true;
  try {
    // 模擬API調用
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredData = [...mockData];
    
    // 按稿件名稱篩選
    if (searchForm.manuscriptName) {
      filteredData = filteredData.filter(item => 
        item.manuscriptName.includes(searchForm.manuscriptName)
      );
    }
    
    // 按接收時間範圍篩選
    if (searchForm.receiveTimeRange && searchForm.receiveTimeRange.length === 2) {
      const [startDate, endDate] = searchForm.receiveTimeRange;
      filteredData = filteredData.filter(item => {
        const receiveTime = dayjs(item.receiveTime);
        return receiveTime.isAfter(startDate) && receiveTime.isBefore(endDate.add(1, 'day'));
      });
    }
    
    pagination.total = filteredData.length;
    const start = (pagination.current - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    dataSource.value = filteredData.slice(start, end);
  } catch (error) {
    console.error('獲取數據失敗:', error);
  } finally {
    loading.value = false;
  }
};

// 搜索
const handleSearch = () => {
  pagination.current = 1;
  fetchData();
};

// 重置搜索
const handleReset = () => {
  searchForm.manuscriptName = '';
  searchForm.receiveTimeRange = [];
  pagination.current = 1;
  fetchData();
};

// 分頁變化
const handleTableChange = (pag: any) => {
  pagination.current = pag.current;
  pagination.pageSize = pag.pageSize;
  fetchData();
};

// 下載文件
const handleDownload = (record: ManuscriptRecord) => {
  // 模擬下載
  const link = document.createElement('a');
  link.href = '#';
  link.download = record.fileName || record.manuscriptName;
  link.click();
  message.success('下載開始');
};

// 編輯稿件
const handleEdit = (record: ManuscriptRecord) => {
  Object.assign(editForm, record);
  editModalVisible.value = true;
};

// 保存編輯
const handleEditSave = async () => {
  try {
    // 模擬API調用
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 更新數據
    const index = mockData.findIndex(item => item.id === editForm.id);
    if (index !== -1) {
      mockData[index] = { ...mockData[index], ...editForm };
    }
    
    message.success(t('pos.manuscriptReceiving.messages.editSuccess'));
    editModalVisible.value = false;
    fetchData();
  } catch (error) {
    console.error('編輯失敗:', error);
  }
};

// 刪除稿件
const handleDelete = async (id: string) => {
  try {
    // 模擬API調用
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = mockData.findIndex(item => item.id === id);
    if (index !== -1) {
      mockData.splice(index, 1);
    }
    
    message.success(t('pos.manuscriptReceiving.messages.deleteSuccess'));
    fetchData();
  } catch (error) {
    console.error('刪除失敗:', error);
  }
};

// 接收稿件
const handleReceiveManuscript = () => {
  receiveForm.receiverName = '';
  receiveForm.uploader = '';
  receiveForm.manuscriptName = '';
  receiveForm.amountType = 'pricing';
  receiveForm.amount = 0;
  receiveForm.file = null;
  uploadMode.value = 'auto';
  receiveModalVisible.value = true;
};

// 文件上傳配置
const uploadProps: UploadProps = {
  name: 'file',
  multiple: false,
  beforeUpload: (file) => {
    receiveForm.file = file;
    receiveForm.manuscriptName = file.name;
    
    // 模擬自動計算價格
    if (uploadMode.value === 'auto') {
      const fileSize = file.size / 1024 / 1024; // MB
      receiveForm.amount = Math.ceil(fileSize * 50); // 每MB 50 MOP
    }
    
    message.success(t('pos.manuscriptReceiving.messages.uploadSuccess'));
    return false; // 阻止自動上傳
  },
};

// 保存接收稿件
const handleReceiveSave = async () => {
  // 驗證表單
  if (!receiveForm.file) {
    message.error(t('pos.manuscriptReceiving.messages.pleaseUploadFile'));
    return;
  }
  if (!receiveForm.receiverName) {
    message.error(t('pos.manuscriptReceiving.messages.pleaseInputReceiverName'));
    return;
  }
  if (!receiveForm.uploader) {
    message.error(t('pos.manuscriptReceiving.messages.pleaseInputUploader'));
    return;
  }
  if (!receiveForm.amount) {
    message.error(t('pos.manuscriptReceiving.messages.pleaseInputAmount'));
    return;
  }
  
  try {
    // 模擬API調用
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 添加新記錄
    const newRecord: ManuscriptRecord = {
      id: Date.now().toString(),
      number: `MS${String(mockData.length + 1).padStart(3, '0')}`,
      receiveTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      receiverName: receiveForm.receiverName,
      uploader: receiveForm.uploader,
      manuscriptName: receiveForm.manuscriptName,
      amountType: receiveForm.amountType,
      amount: receiveForm.amount,
      fileName: receiveForm.file.name,
    };
    
    mockData.unshift(newRecord);
    
    message.success(t('pos.manuscriptReceiving.messages.receiveSuccess'));
    receiveModalVisible.value = false;
    fetchData();
  } catch (error) {
    console.error('接收稿件失敗:', error);
  }
};

// 切換計算模式
const handleModeChange = (mode: 'auto' | 'manual') => {
  uploadMode.value = mode;
  if (mode === 'auto' && receiveForm.file) {
    const fileSize = receiveForm.file.size / 1024 / 1024;
    receiveForm.amount = Math.ceil(fileSize * 50);
  }
};

onMounted(() => {
  fetchData();
});
</script>

<template>
  <div class="manuscript-receiving-page">
    <!-- 搜索區域 -->
    <div class="search-area mb-4 p-4 bg-white rounded-lg shadow">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium mb-1">
            {{ $t('pos.manuscriptReceiving.filters.manuscriptName') }}
          </label>
          <Input
            v-model:value="searchForm.manuscriptName"
            :placeholder="$t('pos.manuscriptReceiving.filters.manuscriptName')"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">
            {{ $t('pos.manuscriptReceiving.filters.receiveTimeRange') }}
          </label>
          <DatePicker.RangePicker
            v-model:value="searchForm.receiveTimeRange"
            class="w-full"
            format="YYYY-MM-DD"
          />
        </div>
        <div class="flex items-end gap-2">
          <Button type="primary" @click="handleSearch">
            <template #icon>
              <span class="icon-[lucide--search] size-4" />
            </template>
            {{ $t('pos.manuscriptReceiving.list.search') }}
          </Button>
          <Button @click="handleReset">
            <template #icon>
              <span class="icon-[lucide--refresh-cw] size-4" />
            </template>
            {{ $t('pos.manuscriptReceiving.list.reset') }}
          </Button>
        </div>
      </div>
    </div>

    <!-- 操作區域 -->
    <div class="action-area mb-4">
      <Button type="primary" @click="handleReceiveManuscript">
        <template #icon>
          <span class="icon-[lucide--file-plus] size-4" />
        </template>
        {{ $t('pos.manuscriptReceiving.list.receiveManuscript') }}
      </Button>
    </div>

    <!-- 表格區域 -->
    <div class="table-area bg-white rounded-lg shadow">
      <Table
        :columns="columns"
        :data-source="dataSource"
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
        row-key="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'operation'">
            <Space>
              <Button size="small" @click="handleDownload(record)">
                {{ $t('pos.manuscriptReceiving.list.download') }}
              </Button>
              <Button 
                v-if="record.amountType === 'deposit'"
                size="small" 
                @click="handleEdit(record)"
              >
                {{ $t('pos.manuscriptReceiving.list.edit') }}
              </Button>
              <Popconfirm
                :title="$t('pos.manuscriptReceiving.messages.deleteConfirm')"
                @confirm="handleDelete(record.id)"
              >
                <Button size="small" danger>
                  {{ $t('pos.manuscriptReceiving.list.delete') }}
                </Button>
              </Popconfirm>
            </Space>
          </template>
          <template v-else-if="column.key === 'amountType'">
            {{ $t(`pos.manuscriptReceiving.amountTypes.${record.amountType}`) }}
          </template>
          <template v-else-if="column.key === 'amount'">
            {{ record.amount }} MOP
          </template>
        </template>
      </Table>
    </div>

    <!-- 編輯模態框 -->
    <Modal
      v-model:open="editModalVisible"
      :title="$t('pos.manuscriptReceiving.editModal.title')"
      @ok="handleEditSave"
      @cancel="editModalVisible = false"
    >
      <Form layout="vertical">
        <FormItem :label="$t('pos.manuscriptReceiving.list.number')">
          <Input v-model:value="editForm.number" disabled />
        </FormItem>
        <FormItem :label="$t('pos.manuscriptReceiving.list.receiveTime')">
          <Input v-model:value="editForm.receiveTime" disabled />
        </FormItem>
        <FormItem :label="$t('pos.manuscriptReceiving.list.receiverName')">
          <Input v-model:value="editForm.receiverName" disabled />
        </FormItem>
        <FormItem :label="$t('pos.manuscriptReceiving.list.uploader')">
          <Input v-model:value="editForm.uploader" disabled />
        </FormItem>
        <FormItem :label="$t('pos.manuscriptReceiving.list.manuscriptName')">
          <Input v-model:value="editForm.manuscriptName" disabled />
        </FormItem>
        <FormItem :label="$t('pos.manuscriptReceiving.editModal.amountType')">
          <Select v-model:value="editForm.amountType">
            <Select.Option value="pricing">
              {{ $t('pos.manuscriptReceiving.amountTypes.pricing') }}
            </Select.Option>
            <Select.Option value="deposit">
              {{ $t('pos.manuscriptReceiving.amountTypes.deposit') }}
            </Select.Option>
          </Select>
        </FormItem>
        <FormItem :label="$t('pos.manuscriptReceiving.editModal.amount')">
          <Input v-model:value="editForm.amount" type="number" />
        </FormItem>
      </Form>
    </Modal>

    <!-- 接收稿件模態框 -->
    <Modal
      v-model:open="receiveModalVisible"
      :title="$t('pos.manuscriptReceiving.receiveModal.title')"
      width="600px"
      @cancel="receiveModalVisible = false"
    >
      <template #footer>
        <Space>
          <Button @click="receiveModalVisible = false">
            {{ $t('pos.manuscriptReceiving.receiveModal.cancel') }}
          </Button>
          <Button
            v-if="receiveForm.amountType === 'pricing'"
            type="primary"
            @click="handleReceiveSave"
          >
            {{ $t('pos.manuscriptReceiving.receiveModal.generateReceipt') }}
          </Button>
          <Button
            v-if="receiveForm.amountType === 'deposit'"
            type="primary"
            @click="handleReceiveSave"
          >
            {{ $t('pos.manuscriptReceiving.receiveModal.temporaryReceipt') }}
          </Button>
        </Space>
      </template>
      
      <Form layout="vertical">
        <!-- 文件上傳 -->
        <FormItem :label="$t('pos.manuscriptReceiving.receiveModal.upload')">
          <Upload.Dragger v-bind="uploadProps">
            <p class="ant-upload-drag-icon">
              <span class="icon-[lucide--inbox] size-8" />
            </p>
            <p class="ant-upload-text">
              {{ $t('pos.manuscriptReceiving.receiveModal.uploadTip') }}
            </p>
            <p class="ant-upload-hint">
              {{ $t('pos.manuscriptReceiving.receiveModal.uploadDescription') }}
            </p>
          </Upload.Dragger>
        </FormItem>

        <!-- 基本信息 -->
        <FormItem :label="$t('pos.manuscriptReceiving.receiveModal.receiverName')">
          <Input v-model:value="receiveForm.receiverName" />
        </FormItem>
        <FormItem :label="$t('pos.manuscriptReceiving.receiveModal.uploader')">
          <Input v-model:value="receiveForm.uploader" />
        </FormItem>
        <FormItem :label="$t('pos.manuscriptReceiving.receiveModal.manuscriptName')">
          <Input v-model:value="receiveForm.manuscriptName" />
        </FormItem>

        <!-- 計算模式選擇 -->
        <FormItem label="計算模式">
          <Space>
            <Button
              :type="uploadMode === 'auto' ? 'primary' : 'default'"
              @click="handleModeChange('auto')"
            >
              {{ $t('pos.manuscriptReceiving.receiveModal.autoCalculate') }}
            </Button>
            <Button
              :type="uploadMode === 'manual' ? 'primary' : 'default'"
              @click="handleModeChange('manual')"
            >
              {{ $t('pos.manuscriptReceiving.receiveModal.manualInput') }}
            </Button>
          </Space>
        </FormItem>

        <!-- 金額類型和金額 -->
        <FormItem :label="$t('pos.manuscriptReceiving.editModal.amountType')">
          <Select v-model:value="receiveForm.amountType">
            <Select.Option value="pricing">
              {{ $t('pos.manuscriptReceiving.amountTypes.pricing') }}
            </Select.Option>
            <Select.Option value="deposit">
              {{ $t('pos.manuscriptReceiving.amountTypes.deposit') }}
            </Select.Option>
          </Select>
        </FormItem>
        <FormItem
          :label="receiveForm.amountType === 'pricing' 
            ? $t('pos.manuscriptReceiving.receiveModal.pricingAmount')
            : $t('pos.manuscriptReceiving.receiveModal.depositAmount')"
        >
          <Input
            v-model:value="receiveForm.amount"
            type="number"
            :disabled="uploadMode === 'auto'"
          />
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<style scoped>
.manuscript-receiving-page {
  padding: 16px;
}

.search-area {
  border: 1px solid #e8e8e8;
}

.table-area {
  border: 1px solid #e8e8e8;
  padding: 16px;
}

:deep(.ant-upload-drag) {
  background: #fafafa;
}

:deep(.ant-table-thead > tr > th) {
  background: #f5f5f5;
  font-weight: 600;
}
</style>