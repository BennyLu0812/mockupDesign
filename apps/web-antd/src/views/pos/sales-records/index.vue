<template>
  <div class="p-4">
    <!-- 搜索篩選區域 -->
    <Card class="mb-4">
      <Form layout="inline" :model="searchParams" @finish="handleSearch">
        <FormItem :label="$t('pos.salesRecords.filters.location')">
          <Select
            v-model:value="searchParams.location"
            :placeholder="$t('pos.salesRecords.filters.location')"
            style="width: 200px"
            allow-clear
          >
            <SelectOption value="store1">{{ $t('pos.salesRecords.locationOptions.store1') }}</SelectOption>
            <SelectOption value="store2">{{ $t('pos.salesRecords.locationOptions.store2') }}</SelectOption>
            <SelectOption value="online">{{ $t('pos.salesRecords.locationOptions.online') }}</SelectOption>
          </Select>
        </FormItem>
        
        <FormItem :label="$t('pos.salesRecords.filters.dateRange')">
          <RangePicker
            v-model:value="dateRange"
            style="width: 300px"
            @change="handleDateRangeChange"
          />
        </FormItem>
        
        <FormItem :label="$t('pos.salesRecords.filters.status')">
          <Select
            v-model:value="searchParams.status"
            :placeholder="$t('pos.salesRecords.filters.status')"
            style="width: 150px"
            allow-clear
          >
            <SelectOption value="pending">{{ $t('pos.salesRecords.statusOptions.pending') }}</SelectOption>
            <SelectOption value="settled">{{ $t('pos.salesRecords.statusOptions.settled') }}</SelectOption>
            <SelectOption value="settling">{{ $t('pos.salesRecords.statusOptions.settling') }}</SelectOption>
            <SelectOption value="refunded">{{ $t('pos.salesRecords.statusOptions.refunded') }}</SelectOption>
          </Select>
        </FormItem>
        
        <FormItem :label="$t('pos.salesRecords.filters.salesPersonId')">
          <Input
            v-model:value="searchParams.salesPersonId"
            :placeholder="$t('pos.salesRecords.filters.salesPersonId')"
            style="width: 150px"
          />
        </FormItem>
        
        <FormItem :label="$t('pos.salesRecords.filters.productName')">
          <Input
            v-model:value="searchParams.productName"
            :placeholder="$t('pos.salesRecords.filters.productName')"
            style="width: 200px"
          />
        </FormItem>
        
        <FormItem>
          <Space>
            <Button type="primary" html-type="submit" :loading="loading">
              <template #icon>
                <span class="icon-[lucide--search] size-4" />
              </template>
              {{ $t('pos.salesRecords.search') }}
            </Button>
            <Button @click="handleReset">
              <template #icon>
                <span class="icon-[lucide--refresh-cw] size-4" />
              </template>
              {{ $t('pos.salesRecords.reset') }}
            </Button>
          </Space>
        </FormItem>
      </Form>
    </Card>

    <!-- 數據表格 -->
    <Card>
      <Table
        :columns="columns"
        :data-source="salesRecords"
        :pagination="pagination"
        :loading="loading"
        row-key="id"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'location'">
            <span>{{ getLocationText(record.location) }}</span>
          </template>
          
          <template v-if="column.key === 'status'">
            <Tag :color="getStatusColor(record.status)">
              {{ getStatusText(record.status) }}
            </Tag>
          </template>
          
          <template v-if="column.key === 'paymentType'">
            <span>{{ getPaymentTypeText(record.paymentType) }}</span>
          </template>
          
          <template v-if="column.key === 'totalAmount'">
            <span>{{ formatCurrency(record.totalAmount) }}</span>
          </template>
          
          <template v-if="column.key === 'unitPrice'">
            <span>{{ formatCurrency(record.unitPrice) }}</span>
          </template>
          
          <template v-if="column.key === 'actions'">
            <Space>
              <Button type="link" size="small" @click="showDetail(record)">
                <template #icon>
                  <span class="icon-[lucide--eye] size-4" />
                </template>
                {{ $t('pos.salesRecords.detail') }}
              </Button>
              
              <Dropdown>
                <Button type="link" size="small">
                  <template #icon>
                    <span class="icon-[lucide--more-horizontal] size-4" />
                  </template>
                </Button>
                <template #overlay>
                  <Menu>
                    <MenuItem @click="handleInvoice(record)">
                      <span class="icon-[lucide--file-text] size-4 mr-2" />
                      {{ $t('pos.salesRecords.invoice') }}
                    </MenuItem>
                    <MenuItem @click="handleReceipt(record)">
                      <span class="icon-[lucide--receipt] size-4 mr-2" />
                      {{ $t('pos.salesRecords.receipt') }}
                    </MenuItem>
                    <MenuItem @click="handleTempReceipt(record)">
                      <span class="icon-[lucide--file-plus] size-4 mr-2" />
                      {{ $t('pos.salesRecords.tempReceipt') }}
                    </MenuItem>
                    <MenuItem @click="handleDeliveryNote(record)">
                      <span class="icon-[lucide--truck] size-4 mr-2" />
                      {{ $t('pos.salesRecords.deliveryNote') }}
                    </MenuItem>
                    <MenuItem @click="handleQuotation(record)">
                      <span class="icon-[lucide--calculator] size-4 mr-2" />
                      {{ $t('pos.salesRecords.quotation') }}
                    </MenuItem>
                  </Menu>
                </template>
              </Dropdown>
            </Space>
          </template>
        </template>
      </Table>
    </Card>

    <!-- 詳情模態框 -->
    <Modal
      v-model:open="detailVisible"
      :title="$t('pos.salesRecords.detailModal.title')"
      width="800px"
      :footer="null"
    >
      <div v-if="selectedRecord" class="space-y-4">
        <Row :gutter="16">
          <Col :span="12">
            <div class="detail-item">
              <span class="detail-label">{{ $t('pos.salesRecords.location') }}:</span>
              <span class="detail-value">{{ getLocationText(selectedRecord.location) }}</span>
            </div>
          </Col>
          <Col :span="12">
            <div class="detail-item">
              <span class="detail-label">{{ $t('pos.salesRecords.documentNumber') }}:</span>
              <span class="detail-value">{{ selectedRecord.documentNumber }}</span>
            </div>
          </Col>
        </Row>
        
        <Row :gutter="16">
          <Col :span="12">
            <div class="detail-item">
              <span class="detail-label">{{ $t('pos.salesRecords.saleDate') }}:</span>
              <span class="detail-value">{{ selectedRecord.saleDate }}</span>
            </div>
          </Col>
          <Col :span="12">
            <div class="detail-item">
              <span class="detail-label">{{ $t('pos.salesRecords.salesPersonId') }}:</span>
              <span class="detail-value">{{ selectedRecord.salesPersonId }}</span>
            </div>
          </Col>
        </Row>
        
        <Row :gutter="16">
          <Col :span="24">
            <div class="detail-item">
              <span class="detail-label">{{ $t('pos.salesRecords.productName') }}:</span>
              <span class="detail-value">{{ selectedRecord.productName }}</span>
            </div>
          </Col>
        </Row>
        
        <Row :gutter="16">
          <Col :span="8">
            <div class="detail-item">
              <span class="detail-label">{{ $t('pos.salesRecords.quantity') }}:</span>
              <span class="detail-value">{{ selectedRecord.quantity }}</span>
            </div>
          </Col>
          <Col :span="8">
            <div class="detail-item">
              <span class="detail-label">{{ $t('pos.salesRecords.unitPrice') }}:</span>
              <span class="detail-value">{{ formatCurrency(selectedRecord.unitPrice) }}</span>
            </div>
          </Col>
          <Col :span="8">
            <div class="detail-item">
              <span class="detail-label">{{ $t('pos.salesRecords.totalAmount') }}:</span>
              <span class="detail-value">{{ formatCurrency(selectedRecord.totalAmount) }}</span>
            </div>
          </Col>
        </Row>
        
        <Row :gutter="16">
          <Col :span="12">
            <div class="detail-item">
              <span class="detail-label">{{ $t('pos.salesRecords.status') }}:</span>
              <Tag :color="getStatusColor(selectedRecord.status)">
                {{ getStatusText(selectedRecord.status) }}
              </Tag>
            </div>
          </Col>
          <Col :span="12">
            <div class="detail-item">
              <span class="detail-label">{{ $t('pos.salesRecords.paymentType') }}:</span>
              <span class="detail-value">{{ getPaymentTypeText(selectedRecord.paymentType) }}</span>
            </div>
          </Col>
        </Row>
        
        <div class="mt-6 text-center">
          <Space>
            <Button type="primary" @click="handleInvoice(selectedRecord)">
              <template #icon>
                <span class="icon-[lucide--file-text] size-4" />
              </template>
              {{ $t('pos.salesRecords.invoice') }}
            </Button>
            <Button @click="handleReceipt(selectedRecord)">
              <template #icon>
                <span class="icon-[lucide--receipt] size-4" />
              </template>
              {{ $t('pos.salesRecords.receipt') }}
            </Button>
            <Button @click="handleTempReceipt(selectedRecord)">
              <template #icon>
                <span class="icon-[lucide--file-plus] size-4" />
              </template>
              {{ $t('pos.salesRecords.tempReceipt') }}
            </Button>
            <Button @click="handleDeliveryNote(selectedRecord)">
              <template #icon>
                <span class="icon-[lucide--truck] size-4" />
              </template>
              {{ $t('pos.salesRecords.deliveryNote') }}
            </Button>
            <Button @click="handleQuotation(selectedRecord)">
              <template #icon>
                <span class="icon-[lucide--calculator] size-4" />
              </template>
              {{ $t('pos.salesRecords.quotation') }}
            </Button>
          </Space>
        </div>
      </div>
      
      <template #footer>
        <Button @click="detailVisible = false">
          {{ $t('pos.salesRecords.detailModal.close') }}
        </Button>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { $t } from '#/locales';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Dropdown,
  Form,
  FormItem,
  Input,
  Menu,
  MenuItem,
  Modal,
  Row,
  Select,
  SelectOption,
  Space,
  Table,
  Tag,
  message,
} from 'ant-design-vue';
import type { SalesRecord, SalesRecordSearchParams, SalesStatus, SalesLocation, SettlementType } from '@vben/types';
import type { TableColumnsType, TableProps } from 'ant-design-vue';
import type { Dayjs } from 'dayjs';

const { RangePicker } = DatePicker;

// 響應式數據
const loading = ref(false);
const detailVisible = ref(false);
const selectedRecord = ref<SalesRecord | null>(null);
const dateRange = ref<[Dayjs, Dayjs] | null>(null);

// 搜索參數
const searchParams = reactive<SalesRecordSearchParams>({
  location: undefined,
  startDate: undefined,
  endDate: undefined,
  status: undefined,
  salesPersonId: '',
  productName: '',
  page: 1,
  pageSize: 10,
});

// 模擬數據
const salesRecords = ref<SalesRecord[]>([
  {
    id: '1',
    location: 'store1',
    documentNumber: 'DOC-2024-001',
    productName: '澳門特別行政區基本法',
    saleDate: '2024-01-15',
    salesPersonId: 'SP001',
    quantity: 2,
    unitPrice: 25.00,
    totalAmount: 50.00,
    status: 'settled',
    paymentType: 'cash',
  },
  {
    id: '2',
    location: 'online',
    documentNumber: 'DOC-2024-002',
    productName: '中國歷史文化讀本',
    saleDate: '2024-01-16',
    salesPersonId: 'SP002',
    quantity: 1,
    unitPrice: 35.00,
    totalAmount: 35.00,
    status: 'pending',
    paymentType: 'electronic',
  },
  {
    id: '3',
    location: 'store2',
    documentNumber: 'DOC-2024-003',
    productName: '經濟學原理',
    saleDate: '2024-01-17',
    salesPersonId: 'SP001',
    quantity: 3,
    unitPrice: 45.00,
    totalAmount: 135.00,
    status: 'settling',
    paymentType: 'electronic',
  },
  {
    id: '4',
    location: 'store1',
    documentNumber: 'DOC-2024-004',
    productName: '葡萄牙語學習指南',
    saleDate: '2024-01-18',
    salesPersonId: 'SP003',
    quantity: 1,
    unitPrice: 28.00,
    totalAmount: 28.00,
    status: 'refunded',
    paymentType: 'cash',
  },
  {
    id: '5',
    location: 'online',
    documentNumber: 'DOC-2024-005',
    productName: '藝術欣賞入門',
    saleDate: '2024-01-19',
    salesPersonId: 'SP002',
    quantity: 2,
    unitPrice: 32.00,
    totalAmount: 64.00,
    status: 'settled',
    paymentType: 'electronic',
  },
]);

// 分頁配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 5,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number, range: [number, number]) => 
    `第 ${range[0]}-${range[1]} 條，共 ${total} 條`,
});

// 表格列配置
const columns: TableColumnsType<SalesRecord> = [
  {
    title: () => $t('pos.salesRecords.location'),
    dataIndex: 'location',
    key: 'location',
    width: 120,
  },
  {
    title: () => $t('pos.salesRecords.documentNumber'),
    dataIndex: 'documentNumber',
    key: 'documentNumber',
    width: 150,
  },
  {
    title: () => $t('pos.salesRecords.productName'),
    dataIndex: 'productName',
    key: 'productName',
    width: 200,
    ellipsis: true,
  },
  {
    title: () => $t('pos.salesRecords.saleDate'),
    dataIndex: 'saleDate',
    key: 'saleDate',
    width: 120,
  },
  {
    title: () => $t('pos.salesRecords.salesPersonId'),
    dataIndex: 'salesPersonId',
    key: 'salesPersonId',
    width: 120,
  },
  {
    title: () => $t('pos.salesRecords.quantity'),
    dataIndex: 'quantity',
    key: 'quantity',
    width: 80,
    align: 'center',
  },
  {
    title: () => $t('pos.salesRecords.unitPrice'),
    dataIndex: 'unitPrice',
    key: 'unitPrice',
    width: 100,
    align: 'right',
  },
  {
    title: () => $t('pos.salesRecords.totalAmount'),
    dataIndex: 'totalAmount',
    key: 'totalAmount',
    width: 120,
    align: 'right',
  },
  {
    title: () => $t('pos.salesRecords.status'),
    dataIndex: 'status',
    key: 'status',
    width: 100,
    align: 'center',
  },
  {
    title: () => $t('pos.salesRecords.paymentType'),
    dataIndex: 'paymentType',
    key: 'paymentType',
    width: 120,
  },
  {
    title: '操作',
    key: 'actions',
    width: 150,
    fixed: 'right',
  },
];

// 工具函數
const getLocationText = (location: SalesLocation): string => {
  return $t(`pos.salesRecords.locationOptions.${location}`);
};

const getStatusText = (status: SalesStatus): string => {
  return $t(`pos.salesRecords.statusOptions.${status}`);
};

const getStatusColor = (status: SalesStatus): string => {
  const colorMap = {
    pending: 'orange',
    settled: 'green',
    settling: 'blue',
    refunded: 'red',
  };
  return colorMap[status];
};

const getPaymentTypeText = (paymentType: SettlementType): string => {
  return $t(`pos.salesRecords.paymentTypeOptions.${paymentType}`);
};

const formatCurrency = (amount: number): string => {
  return `MOP ${amount.toFixed(2)}`;
};

// 事件處理
const handleDateRangeChange = (dates: [Dayjs, Dayjs] | null) => {
  if (dates) {
    searchParams.startDate = dates[0].format('YYYY-MM-DD');
    searchParams.endDate = dates[1].format('YYYY-MM-DD');
  } else {
    searchParams.startDate = undefined;
    searchParams.endDate = undefined;
  }
};

const handleSearch = () => {
  loading.value = true;
  // 模擬API調用
  setTimeout(() => {
    loading.value = false;
    message.success('搜索完成');
  }, 1000);
};

const handleReset = () => {
  Object.assign(searchParams, {
    location: undefined,
    startDate: undefined,
    endDate: undefined,
    status: undefined,
    salesPersonId: '',
    productName: '',
    page: 1,
    pageSize: 10,
  });
  dateRange.value = null;
  handleSearch();
};

const handleTableChange: TableProps['onChange'] = (pag) => {
  if (pag) {
    pagination.current = pag.current || 1;
    pagination.pageSize = pag.pageSize || 10;
    searchParams.page = pagination.current;
    searchParams.pageSize = pagination.pageSize;
    handleSearch();
  }
};

const showDetail = (record: SalesRecord) => {
  selectedRecord.value = record;
  detailVisible.value = true;
};

const handleInvoice = (record: SalesRecord) => {
  message.success(`正在為單據 ${record.documentNumber} 開發票`);
};

const handleReceipt = (record: SalesRecord) => {
  message.success(`正在為單據 ${record.documentNumber} 開收據`);
};

const handleTempReceipt = (record: SalesRecord) => {
  message.success(`正在為單據 ${record.documentNumber} 開臨時收據`);
};

const handleDeliveryNote = (record: SalesRecord) => {
  message.success(`正在為單據 ${record.documentNumber} 開送貨單`);
};

const handleQuotation = (record: SalesRecord) => {
  message.success(`正在為單據 ${record.documentNumber} 開報價單`);
};

// 生命週期
onMounted(() => {
  handleSearch();
});
</script>

<style scoped>
.detail-item {
  @apply flex items-center py-2;
}

.detail-label {
  @apply font-medium text-gray-600 min-w-[120px];
}

.detail-value {
  @apply text-gray-900;
}
</style>