<template>
  <Page>
    <Card>
      <template #title>
        <span class="icon-[lucide--bar-chart-3] mr-2" />
        {{ $t('pos.reports.cashBoxReport.title') }}
      </template>
      
      <!-- 篩選條件 -->
      <div class="mb-4">
        <Row :gutter="16">
          <Col :span="6">
            <div class="mb-2">
              <label class="block text-sm font-medium mb-1">
                {{ $t('pos.reports.cashBoxReport.date') }}
              </label>
              <DatePicker
                v-model:value="filters.date"
                :placeholder="$t('pos.reports.cashBoxReport.filters.date')"
                style="width: 100%"
                format="YYYY-MM-DD"
              />
            </div>
          </Col>
          <Col :span="6">
            <div class="mb-2">
              <label class="block text-sm font-medium mb-1">
                {{ $t('pos.reports.cashBoxReport.location') }}
              </label>
              <Select
                v-model:value="filters.location"
                :placeholder="$t('pos.reports.cashBoxReport.filters.location')"
                style="width: 100%"
                allow-clear
                @change="handleLocationChange"
              >
                <SelectOption value="store1">
                  {{ $t('pos.reports.cashBoxReport.locationOptions.store1') }}
                </SelectOption>
                <SelectOption value="store2">
                  {{ $t('pos.reports.cashBoxReport.locationOptions.store2') }}
                </SelectOption>
                <SelectOption value="store3">
                  {{ $t('pos.reports.cashBoxReport.locationOptions.store3') }}
                </SelectOption>
              </Select>
            </div>
          </Col>
          <Col :span="6">
            <div class="mb-2">
              <label class="block text-sm font-medium mb-1">
                {{ $t('pos.reports.cashBoxReport.cashBox') }}
              </label>
              <Select
                v-model:value="filters.cashBox"
                :placeholder="$t('pos.reports.cashBoxReport.filters.cashBox')"
                style="width: 100%"
                allow-clear
                :disabled="!filters.location"
              >
                <SelectOption
                  v-for="cashBox in availableCashBoxes"
                  :key="cashBox.value"
                  :value="cashBox.value"
                >
                  {{ cashBox.label }}
                </SelectOption>
              </Select>
            </div>
          </Col>
          <Col :span="6">
            <div class="mb-2">
              <label class="block text-sm font-medium mb-1">&nbsp;</label>
              <Space>
                <Button type="primary" @click="handleSearch">
                  <template #icon>
                    <span class="icon-[lucide--search] size-4" />
                  </template>
                  {{ $t('pos.reports.cashBoxReport.search') }}
                </Button>
                <Button @click="handleReset">
                  <template #icon>
                    <span class="icon-[lucide--refresh-cw] size-4" />
                  </template>
                  {{ $t('pos.reports.cashBoxReport.reset') }}
                </Button>
                <Button type="default" @click="handleExport">
                  <template #icon>
                    <span class="icon-[lucide--download] size-4" />
                  </template>
                  {{ $t('pos.reports.cashBoxReport.export') }}
                </Button>
              </Space>
            </div>
          </Col>
        </Row>
      </div>

      <!-- 報表表格 -->
      <Table
        :columns="columns"
        :data-source="reportData"
        :pagination="pagination"
        :loading="loading"
        row-key="id"
        :scroll="{ x: 800 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'income'">
            <span class="text-green-600 font-medium">
              MOP {{ record.income.toFixed(2) }}
            </span>
          </template>
          <template v-else-if="column.key === 'change'">
            <span class="text-orange-600 font-medium">
              MOP {{ record.change.toFixed(2) }}
            </span>
          </template>
        </template>
      </Table>

      <!-- 統計總計 -->
      <div class="mt-4 p-4 bg-gray-50 rounded-lg">
        <Row :gutter="24">
          <Col :span="8">
            <div class="text-center">
              <div class="text-2xl font-bold text-green-600">
                MOP {{ totalStats.totalIncome.toFixed(2) }}
              </div>
              <div class="text-sm text-gray-600">
                {{ $t('pos.reports.cashBoxReport.totalIncome') }}
              </div>
            </div>
          </Col>
          <Col :span="8">
            <div class="text-center">
              <div class="text-2xl font-bold text-orange-600">
                MOP {{ totalStats.totalChange.toFixed(2) }}
              </div>
              <div class="text-sm text-gray-600">
                {{ $t('pos.reports.cashBoxReport.totalChange') }}
              </div>
            </div>
          </Col>
          <Col :span="8">
            <div class="text-center">
              <div class="text-2xl font-bold text-blue-600">
                MOP {{ totalStats.netIncome.toFixed(2) }}
              </div>
              <div class="text-sm text-gray-600">
                {{ $t('pos.reports.cashBoxReport.netIncome') }}
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </Card>
  </Page>
</template>

<script setup lang="ts">
import { computed, ref, reactive, onMounted } from 'vue';
import { Page } from '@vben/common-ui';
import { $t } from '#/locales';
import { 
  Button, 
  Card, 
  Table, 
  Select, 
  SelectOption,
  Space, 
  Row, 
  Col, 
  DatePicker,
  message
} from 'ant-design-vue';
import type { TableColumnsType } from 'ant-design-vue';
import type { 
  CashBoxReportItem, 
  CashBoxReportSearchParams,
  ReportStats
} from '@vben/types';
import dayjs from 'dayjs';

interface ReportFilters {
  date: any;
  location: string;
  cashBox: string;
}

// 篩選條件
const filters = reactive<ReportFilters>({
  date: dayjs(),
  location: '',
  cashBox: ''
});

// 載入狀態
const loading = ref(false);

// 報表數據
const reportData = ref<CashBoxReportItem[]>([]);

// 銀錢箱選項映射
const cashBoxOptions = {
  store1: [
    { value: 'cashbox1', label: '銀錢箱1' },
    { value: 'cashbox2', label: '銀錢箱2' },
    { value: 'cashbox3', label: '銀錢箱3' }
  ],
  store2: [
    { value: 'cashbox1', label: '銀錢箱1' },
    { value: 'cashbox2', label: '銀錢箱2' }
  ],
  store3: [
    { value: 'cashbox1', label: '銀錢箱1' },
    { value: 'cashbox3', label: '銀錢箱3' }
  ]
};

// 可用的銀錢箱選項
const availableCashBoxes = computed(() => {
  if (!filters.location) {
    return [];
  }
  return cashBoxOptions[filters.location as keyof typeof cashBoxOptions] || [];
});

// 處理銷售點變更
const handleLocationChange = () => {
  // 清空銀錢箱選擇
  filters.cashBox = '';
};

// 分頁配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 條記錄`
});

// 表格列配置
const columns: TableColumnsType = [
  {
    title: $t('pos.reports.cashBoxReport.orderNumber'),
    dataIndex: 'orderNumber',
    key: 'orderNumber',
    width: 150
  },
  {
    title: $t('pos.reports.cashBoxReport.income'),
    dataIndex: 'income',
    key: 'income',
    width: 120,
    align: 'right'
  },
  {
    title: $t('pos.reports.cashBoxReport.change'),
    dataIndex: 'change',
    key: 'change',
    width: 120,
    align: 'right'
  },
  {
    title: $t('pos.reports.cashBoxReport.date'),
    dataIndex: 'date',
    key: 'date',
    width: 120
  },
  {
    title: $t('pos.reports.cashBoxReport.location'),
    dataIndex: 'location',
    key: 'location',
    width: 120
  }
];

// 統計數據
const totalStats = computed(() => {
  const totalIncome = reportData.value.reduce((sum, item) => sum + item.income, 0);
  const totalChange = reportData.value.reduce((sum, item) => sum + item.change, 0);
  const netIncome = totalIncome - totalChange;
  
  return {
    totalIncome,
    totalChange,
    netIncome
  };
});

// 模擬數據
const mockReportData: CashBoxReportItem[] = [
  {
    id: '1',
    orderNumber: 'ORD20240101001',
    income: 125.00,
    change: 5.00,
    date: '2024-01-01',
    location: '實體店1'
  },
  {
    id: '2',
    orderNumber: 'ORD20240101002',
    income: 85.50,
    change: 14.50,
    date: '2024-01-01',
    location: '實體店1'
  },
  {
    id: '3',
    orderNumber: 'ORD20240101003',
    income: 200.00,
    change: 0.00,
    date: '2024-01-01',
    location: '實體店2'
  },
  {
    id: '4',
    orderNumber: 'ORD20240101004',
    income: 65.00,
    change: 35.00,
    date: '2024-01-01',
    location: '實體店1'
  },
  {
    id: '5',
    orderNumber: 'ORD20240101005',
    income: 150.00,
    change: 0.00,
    date: '2024-01-01',
    location: '實體店3'
  }
];

// 查詢數據
const fetchReportData = async () => {
  loading.value = true;
  try {
    // 模擬API調用
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredData = [...mockReportData];
    
    // 按日期篩選
    if (filters.date) {
      const selectedDate = dayjs(filters.date).format('YYYY-MM-DD');
      filteredData = filteredData.filter(item => item.date === selectedDate);
    }
    
    // 按銷售點篩選
    if (filters.location) {
      const locationMap: Record<string, string> = {
        'store1': '實體店1',
        'store2': '實體店2',
        'store3': '實體店3'
      };
      filteredData = filteredData.filter(item => item.location === locationMap[filters.location]);
    }
    
    reportData.value = filteredData;
    pagination.total = filteredData.length;
    
  } catch (error) {
    message.error('查詢失敗，請重試');
  } finally {
    loading.value = false;
  }
};

// 搜索
const handleSearch = () => {
  pagination.current = 1;
  fetchReportData();
};

// 重置
const handleReset = () => {
  filters.date = dayjs();
  filters.location = '';
  filters.cashBox = '';
  pagination.current = 1;
  fetchReportData();
};

// 導出
const handleExport = () => {
  if (reportData.value.length === 0) {
    message.warning($t('pos.reports.cashBoxReport.noData'));
    return;
  }
  
  // 模擬導出功能
  const csvContent = generateCSV();
  downloadCSV(csvContent, 'cash-box-report.csv');
  message.success('導出成功');
};

// 生成CSV內容
const generateCSV = () => {
  const headers = [
    $t('pos.reports.cashBoxReport.orderNumber'),
    $t('pos.reports.cashBoxReport.income'),
    $t('pos.reports.cashBoxReport.change'),
    $t('pos.reports.cashBoxReport.date'),
    $t('pos.reports.cashBoxReport.location')
  ];
  
  const rows = reportData.value.map(item => [
    item.orderNumber,
    `MOP ${item.income.toFixed(2)}`,
    `MOP ${item.change.toFixed(2)}`,
    item.date,
    item.location
  ]);
  
  // 添加統計行
  rows.push([
    $t('pos.reports.cashBoxReport.total'),
    `MOP ${totalStats.value.totalIncome.toFixed(2)}`,
    `MOP ${totalStats.value.totalChange.toFixed(2)}`,
    '',
    `${$t('pos.reports.cashBoxReport.netIncome')}: MOP ${totalStats.value.netIncome.toFixed(2)}`
  ]);
  
  return [headers, ...rows].map(row => row.join(',')).join('\n');
};

// 下載CSV文件
const downloadCSV = (content: string, filename: string) => {
  const blob = new Blob([`\uFEFF${content}`], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// 初始化
onMounted(() => {
  fetchReportData();
});
</script>

<style scoped>
.ant-table {
  background: white;
}

.ant-table-thead > tr > th {
  background: #fafafa;
  font-weight: 600;
}

.ant-statistic-content {
  font-size: 24px;
  font-weight: bold;
}
</style>