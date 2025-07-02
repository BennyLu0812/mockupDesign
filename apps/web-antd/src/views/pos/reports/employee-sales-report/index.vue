<template>
  <Page>
    <Card>
      <template #title>
        <span class="icon-[lucide--users] mr-2" />
        {{ $t('pos.reports.employeeSalesReport.title') }}
      </template>
      
      <!-- 篩選條件 -->
      <div class="mb-4">
        <Row :gutter="16">
          <Col :span="6">
            <div class="mb-2">
              <label class="block text-sm font-medium mb-1">
                {{ $t('pos.reports.employeeSalesReport.startDate') }}
              </label>
              <DatePicker
                v-model:value="filters.startDate"
                :placeholder="$t('pos.reports.employeeSalesReport.startDate')"
                style="width: 100%"
                format="YYYY-MM-DD"
              />
            </div>
          </Col>
          <Col :span="6">
            <div class="mb-2">
              <label class="block text-sm font-medium mb-1">
                {{ $t('pos.reports.employeeSalesReport.endDate') }}
              </label>
              <DatePicker
                v-model:value="filters.endDate"
                :placeholder="$t('pos.reports.employeeSalesReport.endDate')"
                style="width: 100%"
                format="YYYY-MM-DD"
              />
            </div>
          </Col>
          <Col :span="6">
            <div class="mb-2">
              <label class="block text-sm font-medium mb-1">
                {{ $t('pos.reports.employeeSalesReport.employee') }}
              </label>
              <Select
                v-model:value="filters.employee"
                :placeholder="$t('pos.reports.employeeSalesReport.filters.employee')"
                style="width: 100%"
                allow-clear
              >
                <SelectOption value="emp001">
                  {{ $t('pos.reports.employeeSalesReport.employeeOptions.emp001') }}
                </SelectOption>
                <SelectOption value="emp002">
                  {{ $t('pos.reports.employeeSalesReport.employeeOptions.emp002') }}
                </SelectOption>
                <SelectOption value="emp003">
                  {{ $t('pos.reports.employeeSalesReport.employeeOptions.emp003') }}
                </SelectOption>
                <SelectOption value="emp004">
                  {{ $t('pos.reports.employeeSalesReport.employeeOptions.emp004') }}
                </SelectOption>
              </Select>
            </div>
          </Col>
        </Row>
        <Row :gutter="16">
          <Col :span="6">
            <div class="mb-2">
              <label class="block text-sm font-medium mb-1">
                {{ $t('pos.reports.employeeSalesReport.paymentType') }}
              </label>
              <Select
                v-model:value="filters.paymentType"
                :placeholder="$t('pos.reports.employeeSalesReport.filters.paymentType')"
                style="width: 100%"
                allow-clear
              >
                <SelectOption value="cash">
                  {{ $t('pos.reports.employeeSalesReport.paymentTypeOptions.cash') }}
                </SelectOption>
                <SelectOption value="electronic">
                  {{ $t('pos.reports.employeeSalesReport.paymentTypeOptions.electronic') }}
                </SelectOption>
                <SelectOption value="government">
                  {{ $t('pos.reports.employeeSalesReport.paymentTypeOptions.government') }}
                </SelectOption>
                <SelectOption value="bank">
                  {{ $t('pos.reports.employeeSalesReport.paymentTypeOptions.bank') }}
                </SelectOption>
                <SelectOption value="credit">
                  {{ $t('pos.reports.employeeSalesReport.paymentTypeOptions.credit') }}
                </SelectOption>
                <SelectOption value="other">
                  {{ $t('pos.reports.employeeSalesReport.paymentTypeOptions.other') }}
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
                  {{ $t('pos.reports.employeeSalesReport.search') }}
                </Button>
                <Button @click="handleReset">
                  <template #icon>
                    <span class="icon-[lucide--refresh-cw] size-4" />
                  </template>
                  {{ $t('pos.reports.employeeSalesReport.reset') }}
                </Button>
              </Space>
            </div>
          </Col>
        </Row>
        <Row>
          <Col :span="24">
            <div class="text-right">
              <Button type="default" @click="handleExport">
                <template #icon>
                  <span class="icon-[lucide--download] size-4" />
                </template>
                {{ $t('pos.reports.employeeSalesReport.export') }}
              </Button>
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
          <template v-if="column.key === 'salesAmount'">
            <span class="text-green-600 font-medium">
              MOP {{ record.salesAmount.toFixed(2) }}
            </span>
          </template>
          <template v-else-if="column.key === 'orderCount'">
            <span class="font-medium">
              {{ record.orderCount }}
            </span>
          </template>
          <template v-else-if="column.key === 'paymentType'">
            <span class="px-2 py-1 rounded text-xs font-medium" :class="{
              'bg-green-100 text-green-800': record.paymentType === 'cash',
              'bg-blue-100 text-blue-800': record.paymentType === 'electronic',
              'bg-purple-100 text-purple-800': record.paymentType === 'government',
              'bg-orange-100 text-orange-800': record.paymentType === 'bank',
              'bg-red-100 text-red-800': record.paymentType === 'credit',
              'bg-gray-100 text-gray-800': record.paymentType === 'other'
            }">
              {{ $t(`pos.reports.employeeSalesReport.paymentTypeOptions.${record.paymentType}`) }}
            </span>
          </template>
        </template>
      </Table>

      <!-- 統計總計 -->
      <div class="mt-4 p-4 bg-gray-50 rounded-lg">
        <Row :gutter="24">
          <Col :span="12">
            <div class="text-center">
              <div class="text-2xl font-bold text-green-600">
                MOP {{ totalStats.totalSales.toFixed(2) }}
              </div>
              <div class="text-sm text-gray-600">
                {{ $t('pos.reports.employeeSalesReport.totalSales') }}
              </div>
            </div>
          </Col>
          <Col :span="12">
            <div class="text-center">
              <div class="text-2xl font-bold text-blue-600">
                {{ totalStats.totalOrders }}
              </div>
              <div class="text-sm text-gray-600">
                {{ $t('pos.reports.employeeSalesReport.totalOrders') }}
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
  EmployeeSalesReportItem, 
  EmployeeSalesReportSearchParams,
  ReportStats
} from '@vben/types';
import dayjs from 'dayjs';

interface ReportFilters {
  startDate: any;
  endDate: any;
  employee: string;
  paymentType: string;
}

// 篩選條件
const filters = reactive<ReportFilters>({
  startDate: dayjs(),
  endDate: dayjs(),
  employee: '',
  paymentType: ''
});

// 載入狀態
const loading = ref(false);

// 報表數據
const reportData = ref<EmployeeSalesReportItem[]>([]);

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
    title: $t('pos.reports.employeeSalesReport.employeeId'),
    dataIndex: 'employeeId',
    key: 'employeeId',
    width: 120
  },
  {
    title: $t('pos.reports.employeeSalesReport.employeeName'),
    dataIndex: 'employeeName',
    key: 'employeeName',
    width: 120
  },
  {
    title: $t('pos.reports.employeeSalesReport.paymentType'),
    dataIndex: 'paymentType',
    key: 'paymentType',
    width: 120,
    align: 'center'
  },
  {
    title: $t('pos.reports.employeeSalesReport.salesAmount'),
    dataIndex: 'salesAmount',
    key: 'salesAmount',
    width: 150,
    align: 'right'
  },
  {
    title: $t('pos.reports.employeeSalesReport.orderCount'),
    dataIndex: 'orderCount',
    key: 'orderCount',
    width: 120,
    align: 'center'
  },
  {
    title: '統計期間',
    dataIndex: 'dateRange',
    key: 'dateRange',
    width: 200
  }
];

// 統計數據計算
const totalStats = computed(() => {
  const totalSales = reportData.value.reduce((sum, item) => sum + item.salesAmount, 0);
  const totalOrders = reportData.value.reduce((sum, item) => sum + item.orderCount, 0);
  
  return {
    totalSales,
    totalOrders
  };
});

// 模擬數據
const mockReportData = [
  {
    employeeId: 'EMP001',
    employeeName: '張小明',
    salesAmount: 15000.00,
    orderCount: 45,
    dateRange: '2024-01-01 ~ 2024-01-31',
    paymentType: 'cash'
  },
  {
    employeeId: 'EMP002',
    employeeName: '李美華',
    salesAmount: 22000.00,
    orderCount: 60,
    dateRange: '2024-01-01 ~ 2024-01-31',
    paymentType: 'electronic'
  },
  {
    employeeId: 'EMP003',
    employeeName: '王大偉',
    salesAmount: 18500.00,
    orderCount: 52,
    dateRange: '2024-01-01 ~ 2024-01-31',
    paymentType: 'government'
  },
  {
    employeeId: 'EMP004',
    employeeName: '陳小芳',
    salesAmount: 12800.00,
    orderCount: 38,
    dateRange: '2024-01-01 ~ 2024-01-31',
    paymentType: 'bank'
  },
  {
    employeeId: 'EMP005',
    employeeName: '林志強',
    salesAmount: 25600.00,
    orderCount: 72,
    dateRange: '2024-01-01 ~ 2024-01-31',
    paymentType: 'credit'
  },
  {
    employeeId: 'EMP006',
    employeeName: '黃淑雯',
    salesAmount: 19200.00,
    orderCount: 55,
    dateRange: '2024-01-01 ~ 2024-01-31',
    paymentType: 'other'
  }
];

// 查詢數據
const fetchReportData = async () => {
  loading.value = true;
  try {
    // 模擬API調用
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredData = [...mockReportData];
    
    // 按員工篩選
    if (filters.employee) {
      const employeeMap: Record<string, string> = {
        'emp001': 'EMP001',
        'emp002': 'EMP002',
        'emp003': 'EMP003',
        'emp004': 'EMP004'
      };
      filteredData = filteredData.filter(item => item.employeeId === employeeMap[filters.employee]);
    }
    
    // 按支付類型篩選
    if (filters.paymentType) {
      filteredData = filteredData.filter(item => item.paymentType === filters.paymentType);
    }
    
    // 更新日期範圍顯示
    if (filters.startDate && filters.endDate) {
      const dateRange = `${dayjs(filters.startDate).format('YYYY-MM-DD')} ~ ${dayjs(filters.endDate).format('YYYY-MM-DD')}`;
      filteredData = filteredData.map(item => ({
        ...item,
        dateRange
      }));
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
  if (filters.startDate && filters.endDate) {
    if (dayjs(filters.startDate).isAfter(dayjs(filters.endDate))) {
      message.error('開始日期不能晚於結束日期');
      return;
    }
  }
  
  pagination.current = 1;
  fetchReportData();
};

// 重置
const handleReset = () => {
  filters.startDate = dayjs();
  filters.endDate = dayjs();
  filters.employee = '';
  filters.paymentType = '';
  pagination.current = 1;
  fetchReportData();
};

// 導出
const handleExport = () => {
  if (reportData.value.length === 0) {
    message.warning($t('pos.reports.employeeSalesReport.noData'));
    return;
  }
  
  // 模擬導出功能
  const csvContent = generateCSV();
  downloadCSV(csvContent, 'employee-sales-report.csv');
  message.success('導出成功');
};

// 生成CSV內容
const generateCSV = () => {
  const headers = [
    $t('pos.reports.employeeSalesReport.employeeId'),
    $t('pos.reports.employeeSalesReport.employeeName'),
    $t('pos.reports.employeeSalesReport.paymentType'),
    $t('pos.reports.employeeSalesReport.salesAmount'),
    $t('pos.reports.employeeSalesReport.orderCount'),
    '統計期間'
  ];
  
  const rows = reportData.value.map(item => [
    item.employeeId,
    item.employeeName,
    $t(`pos.reports.employeeSalesReport.paymentTypeOptions.${item.paymentType}`),
    `MOP ${item.salesAmount.toFixed(2)}`,
    item.orderCount.toString(),
    item.dateRange
  ]);
  
  // 添加統計行
  rows.push([
    $t('pos.reports.employeeSalesReport.total'),
    '',
    '',
    `MOP ${totalStats.value.totalSales.toFixed(2)}`,
    totalStats.value.totalOrders.toString(),
    ''
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