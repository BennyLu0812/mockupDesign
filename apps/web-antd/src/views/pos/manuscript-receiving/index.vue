<script setup lang="ts">
import { ref, reactive, onMounted, watch, h } from 'vue';
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
    title: t('pos.manuscriptReceiving.list.status'),
    key: 'status',
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

// 監聽接收稿件模態框狀態，防止頁面滾動
watch(receiveModalVisible, (visible) => {
  if (visible) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

// 監聽編輯模態框狀態，防止頁面滾動
watch(editModalVisible, (visible) => {
  if (visible) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

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
          <template v-else-if="column.key === 'status'">
            <span :class="{
              'text-green-600': record.amountType === 'pricing',
              'text-orange-600': record.amountType === 'deposit'
            }">
              {{ record.amountType === 'pricing' 
                ? $t('pos.manuscriptReceiving.statusTypes.completed') 
                : $t('pos.manuscriptReceiving.statusTypes.pendingPayment') 
              }}
            </span>
          </template>
        </template>
      </Table>
    </div>

    <!-- 編輯滑動面板 -->
    <div class="edit-panel-container" :class="{ 'container-open': editModalVisible }">
      <!-- 遮罩層 -->
      <div 
        v-if="editModalVisible" 
        class="edit-overlay"
        @click="editModalVisible = false"
      ></div>
      
      <!-- 滑動面板 -->
      <div 
        class="edit-panel" 
        :class="{ 'panel-open': editModalVisible }"
      >
        <!-- 頭部 -->
        <div class="edit-header">
          <div class="header-content">
            <Button 
              type="text" 
              size="large" 
              @click="editModalVisible = false"
              class="close-btn"
            >
              <template #icon>
                <span class="icon-[lucide--x] size-5" />
              </template>
            </Button>
            <h2 class="header-title">{{ $t('pos.manuscriptReceiving.editModal.title') }}</h2>
          </div>
        </div>

        <!-- 內容區域 -->
        <div class="edit-content">
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
        </div>
        
        <!-- 底部操作區 -->
        <div class="edit-footer">
          <Space>
            <Button size="large" @click="editModalVisible = false">
              {{ $t('pos.manuscriptReceiving.editModal.cancel') }}
            </Button>
            <Button
              type="primary"
              size="large"
              @click="handleEditSave"
            >
              {{ $t('pos.manuscriptReceiving.editModal.save') }}
            </Button>
          </Space>
        </div>
      </div>
    </div>

    <!-- 接收稿件滑動面板 -->
     <div class="receive-panel-container" :class="{ 'container-open': receiveModalVisible }">
       <!-- 遮罩層 -->
       <div 
         v-if="receiveModalVisible" 
         class="receive-overlay"
         @click="receiveModalVisible = false"
       ></div>
       
       <!-- 滑動面板 -->
       <div 
         class="receive-panel" 
         :class="{ 'panel-open': receiveModalVisible }"
       >
        <!-- 頭部 -->
        <div class="receive-header">
          <div class="header-content">
            <Button 
              type="text" 
              size="large" 
              @click="receiveModalVisible = false"
              class="close-btn"
            >
              <template #icon>
                <span class="icon-[lucide--x] size-5" />
              </template>
            </Button>
            <h2 class="header-title">{{ $t('pos.manuscriptReceiving.receiveModal.title') }}</h2>
          </div>
        </div>

        <!-- 內容區域 -->
        <div class="receive-content">
      
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
        </div>
        
        <!-- 底部操作區 -->
        <div class="receive-footer">
          <Space>
            <Button size="large" @click="receiveModalVisible = false">
              {{ $t('pos.manuscriptReceiving.receiveModal.cancel') }}
            </Button>
            <Button
              v-if="receiveForm.amountType === 'pricing'"
              type="primary"
              size="large"
              @click="handleReceiveSave"
            >
              {{ $t('pos.manuscriptReceiving.receiveModal.generateReceipt') }}
            </Button>
            <Button
              v-if="receiveForm.amountType === 'deposit'"
              type="primary"
              size="large"
              @click="handleReceiveSave"
            >
              {{ $t('pos.manuscriptReceiving.receiveModal.temporaryReceipt') }}
            </Button>
          </Space>
        </div>
      </div>
    </div>
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

/* 接收稿件滑動面板樣式 */
.receive-panel-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  pointer-events: none;
}

.receive-panel-container.container-open {
  pointer-events: auto;
}

.receive-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.45);
  z-index: 1000;
  pointer-events: auto;
}

.receive-panel {
  position: fixed;
  top: 0;
  right: -100%;
  width: 600px;
  height: 100%;
  background: white;
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.15);
  transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  z-index: 1001;
  pointer-events: auto;
}

.receive-panel.panel-open {
  right: 0;
}

.receive-header {
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
  background: #fafafa;
  flex-shrink: 0;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.close-btn {
  padding: 4px;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background-color: rgba(0, 0, 0, 0.06);
}

.header-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #262626;
}

.receive-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.receive-footer {
  padding: 16px 24px;
  border-top: 1px solid #f0f0f0;
  background: #fafafa;
  flex-shrink: 0;
  display: flex;
  justify-content: flex-end;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .receive-panel {
    width: 100%;
    right: -100%;
  }
}

/* 編輯滑動面板樣式 */
.edit-panel-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  pointer-events: none;
}

.edit-panel-container.container-open {
  pointer-events: auto;
}

.edit-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.45);
  z-index: 1000;
  pointer-events: auto;
}

.edit-panel {
  position: fixed;
  top: 0;
  right: -100%;
  width: 600px;
  height: 100%;
  background: white;
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.15);
  transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  z-index: 1001;
  pointer-events: auto;
}

.edit-panel.panel-open {
  right: 0;
}

.edit-header {
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
  background: #fafafa;
  flex-shrink: 0;
}

.edit-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.edit-footer {
  padding: 16px 24px;
  border-top: 1px solid #f0f0f0;
  background: #fafafa;
  flex-shrink: 0;
  display: flex;
  justify-content: flex-end;
}

/* 編輯面板響應式設計 */
@media (max-width: 768px) {
  .edit-panel {
    width: 100%;
    right: -100%;
  }
}
</style>