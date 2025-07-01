<template>
  <div class="p-4">
    <!-- 搜索篩選區域 -->
    <Card class="mb-4">
      <Form layout="inline" :model="searchParams" @finish="handleSearch">
        <FormItem :label="$t('pos.inventory.filters.location')">
          <Select
            v-model:value="searchParams.location"
            :placeholder="$t('pos.inventory.filters.location')"
            style="width: 200px"
            allow-clear
          >
            <SelectOption value="store1">{{ $t('pos.inventory.locationOptions.store1') }}</SelectOption>
            <SelectOption value="store2">{{ $t('pos.inventory.locationOptions.store2') }}</SelectOption>
            <SelectOption value="online">{{ $t('pos.inventory.locationOptions.online') }}</SelectOption>
          </Select>
        </FormItem>
        
        <FormItem :label="$t('pos.inventory.filters.productCode')">
          <Input
            v-model:value="searchParams.productCode"
            :placeholder="$t('pos.inventory.filters.productCode')"
            style="width: 200px"
          />
        </FormItem>
        
        <FormItem :label="$t('pos.inventory.filters.productName')">
          <Input
            v-model:value="searchParams.productName"
            :placeholder="$t('pos.inventory.filters.productName')"
            style="width: 200px"
          />
        </FormItem>
        
        <FormItem>
          <Space>
            <Button type="primary" html-type="submit" :loading="loading">
              <template #icon>
                <span class="icon-[lucide--search] size-4" />
              </template>
              {{ $t('pos.inventory.search') }}
            </Button>
            <Button @click="handleReset">
              <template #icon>
                <span class="icon-[lucide--refresh-cw] size-4" />
              </template>
              {{ $t('pos.inventory.reset') }}
            </Button>
          </Space>
        </FormItem>
      </Form>
    </Card>

    <!-- 數據表格 -->
    <Card>
      <Table
        :columns="columns"
        :data-source="inventoryRecords"
        :pagination="pagination"
        :loading="loading"
        row-key="id"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'location'">
            <span>{{ getLocationText(record.location) }}</span>
          </template>
        </template>
      </Table>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { $t } from '#/locales';
import {
  Button,
  Card,
  Form,
  FormItem,
  Input,
  Select,
  SelectOption,
  Space,
  Table,
} from 'ant-design-vue';
import type { InventoryRecord, InventorySearchParams, SalesLocation } from '@vben/types';
import type { TableColumnsType, TableProps } from 'ant-design-vue';

// 響應式數據
const loading = ref(false);

// 搜索參數
const searchParams = reactive<InventorySearchParams>({
  location: undefined,
  productCode: '',
  productName: '',
  page: 1,
  pageSize: 10,
});

// 模擬數據
const inventoryRecords = ref<InventoryRecord[]>([
  {
    id: '1',
    location: 'store1',
    productCode: 'BOOK-001',
    productName: '澳門特別行政區基本法',
    printDate: '2024-01-10',
    stockInTime: '2024-01-15 09:30:00',
    stockQuantity: 150,
  },
  {
    id: '2',
    location: 'store1',
    productCode: 'BOOK-002',
    productName: '澳門民法典',
    printDate: '2024-01-08',
    stockInTime: '2024-01-12 14:20:00',
    stockQuantity: 85,
  },
  {
    id: '3',
    location: 'store2',
    productCode: 'BOOK-003',
    productName: '澳門刑法典',
    printDate: '2024-01-05',
    stockInTime: '2024-01-10 11:15:00',
    stockQuantity: 120,
  },
  {
    id: '4',
    location: 'online',
    productCode: 'BOOK-004',
    productName: '澳門行政程序法典',
    printDate: '2024-01-12',
    stockInTime: '2024-01-18 16:45:00',
    stockQuantity: 200,
  },
  {
    id: '5',
    location: 'store1',
    productCode: 'BOOK-005',
    productName: '澳門商法典',
    printDate: '2024-01-03',
    stockInTime: '2024-01-08 10:00:00',
    stockQuantity: 95,
  },
  {
    id: '6',
    location: 'store2',
    productCode: 'BOOK-006',
    productName: '澳門教育制度綱要法',
    printDate: '2024-01-15',
    stockInTime: '2024-01-20 13:30:00',
    stockQuantity: 75,
  },
  {
    id: '7',
    location: 'online',
    productCode: 'BOOK-007',
    productName: '澳門經濟發展報告',
    printDate: '2024-01-18',
    stockInTime: '2024-01-22 15:10:00',
    stockQuantity: 180,
  },
  {
    id: '8',
    location: 'store1',
    productCode: 'BOOK-008',
    productName: '澳門歷史文化概覽',
    printDate: '2024-01-20',
    stockInTime: '2024-01-25 09:45:00',
    stockQuantity: 110,
  },
]);

// 表格列定義
const columns: TableColumnsType<InventoryRecord> = [
  {
    title: () => $t('pos.inventory.location'),
    dataIndex: 'location',
    key: 'location',
    width: 150,
  },
  {
    title: () => $t('pos.inventory.productCode'),
    dataIndex: 'productCode',
    key: 'productCode',
    width: 150,
  },
  {
    title: () => $t('pos.inventory.productName'),
    dataIndex: 'productName',
    key: 'productName',
    width: 250,
  },
  {
    title: () => $t('pos.inventory.printDate'),
    dataIndex: 'printDate',
    key: 'printDate',
    width: 120,
  },
  {
    title: () => $t('pos.inventory.stockInTime'),
    dataIndex: 'stockInTime',
    key: 'stockInTime',
    width: 180,
  },
  {
    title: () => $t('pos.inventory.stockQuantity'),
    dataIndex: 'stockQuantity',
    key: 'stockQuantity',
    width: 120,
    align: 'right',
  },
];

// 分頁配置
const pagination = computed(() => ({
  current: searchParams.page,
  pageSize: searchParams.pageSize,
  total: inventoryRecords.value.length,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number, range: [number, number]) => 
    `第 ${range[0]}-${range[1]} 條，共 ${total} 條`,
}));

// 獲取銷售地點文本
const getLocationText = (location: SalesLocation): string => {
  const locationMap = {
    store1: $t('pos.inventory.locationOptions.store1'),
    store2: $t('pos.inventory.locationOptions.store2'),
    online: $t('pos.inventory.locationOptions.online'),
  };
  return locationMap[location] || location;
};

// 搜索處理
const handleSearch = () => {
  loading.value = true;
  // 模擬API調用
  setTimeout(() => {
    // 這裡應該調用實際的API
    console.log('搜索參數:', searchParams);
    loading.value = false;
  }, 1000);
};

// 重置搜索
const handleReset = () => {
  searchParams.location = undefined;
  searchParams.productCode = '';
  searchParams.productName = '';
  searchParams.page = 1;
  handleSearch();
};

// 表格變化處理
const handleTableChange: TableProps['onChange'] = (pag) => {
  if (pag) {
    searchParams.page = pag.current || 1;
    searchParams.pageSize = pag.pageSize || 10;
    handleSearch();
  }
};

// 組件掛載時加載數據
onMounted(() => {
  handleSearch();
});
</script>

<style scoped>
.detail-item {
  @apply flex items-center mb-2;
}

.detail-label {
  @apply font-medium text-gray-600 w-24 flex-shrink-0;
}

.detail-value {
  @apply text-gray-900;
}
</style>