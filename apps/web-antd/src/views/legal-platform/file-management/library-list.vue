<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Page } from '@vben/common-ui';
import { $t } from '#/locales';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  FormItem,
  Input,
  Pagination,
  Row,
  Select,
  SelectOption,
  Space,
  Table,
  Tag,
  Modal,
  message,
} from 'ant-design-vue';

const router = useRouter();



// 搜索表單
const searchForm = reactive({
  libraryName: '',
  libraryType: undefined,
  department: undefined,
  status: undefined,
  startDate: undefined,
  endDate: undefined,
});

// 日期範圍
const dateRange = ref([undefined, undefined]);

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

// 表格數據
const tableData = ref([
  {
    id: 1,
    name: '法律條文資料庫',
    description: '存放各類法律條文和相關文件',
    type: '部門文件庫',
    department: '法制研究及立法統籌廳',
    owner: 'António Silva',
    status: '啟用',
    totalSize: '2.5 GB',
    createTime: '2024-01-15 10:30:00',
    updateTime: '2024-01-20 14:25:00',
    tags: ['法律', '條文', '重要'],
    permissions: {
      view: ['法制研究及立法統籌廳', '法律草擬廳'],
      edit: ['法制研究及立法統籌廳'],
      delete: ['法制研究及立法統籌廳'],
    },
  },
  {
    id: 2,
    name: '合同範本庫',
    description: '各類合同範本和模板文件',
    type: '公共文件庫',
    department: '法律草擬廳',
    owner: 'João Silva',
    status: '啟用',
    totalSize: '1.2 GB',
    createTime: '2024-01-10 09:15:00',
    updateTime: '2024-01-18 16:40:00',
    tags: ['合同', '範本', '通用'],
    permissions: {
      view: ['法律草擬廳'],
      edit: ['法律草擬廳', '法制研究及立法統籌廳'],
      delete: ['法律草擬廳'],
    },
  },
  {
    id: 3,
    name: '項目文件庫',
    description: '項目相關的所有文件和資料',
    type: '項目文件庫',
    department: '法律翻譯廳',
    owner: 'Maria Santos',
    status: '啟用',
    totalSize: '4.8 GB',
    createTime: '2024-01-05 14:20:00',
    updateTime: '2024-01-22 11:30:00',
    tags: ['項目', '文件', '協作'],
    permissions: {
      view: ['法律翻譯廳', '法制研究及立法統籌廳'],
      edit: ['法律翻譯廳'],
      delete: ['法律翻譯廳'],
    },
  },
]);

// 表格列配置
const columns = [
  {
    title: $t('page.legalPlatform.fileLibraryName'),
    dataIndex: 'name',
    key: 'name',
    width: 200,
  },
  {
    title: $t('page.legalPlatform.fileLibraryDescription'),
    dataIndex: 'description',
    key: 'description',
    width: 250,
  },
  {
    title: $t('page.legalPlatform.fileLibraryType'),
    dataIndex: 'type',
    key: 'type',
    width: 120,
  },
  {
    title: $t('page.legalPlatform.fileLibraryDepartment'),
    dataIndex: 'department',
    key: 'department',
    width: 120,
  },
  {
    title: $t('page.legalPlatform.fileLibraryOwner'),
    dataIndex: 'owner',
    key: 'owner',
    width: 100,
  },

  {
    title: $t('page.legalPlatform.fileLibraryStatus'),
    dataIndex: 'status',
    key: 'status',
    width: 100,
  },
  {
    title: $t('page.legalPlatform.createTime'),
    dataIndex: 'createTime',
    key: 'createTime',
    width: 180,
  },
  {
    title: $t('page.legalPlatform.operation'),
    key: 'operation',
    width: 200,
    fixed: 'right',
  },
];

// 部門選項
const departmentOptions = [
  { label: '法制研究及立法統籌廳', value: '法制研究及立法統籌廳' },
  { label: '法律草擬廳', value: '法律草擬廳' },
  { label: '法律翻譯廳', value: '法律翻譯廳' },
];

// 文件庫類型選項
const libraryTypeOptions = [
  { label: $t('page.legalPlatform.publicLibrary'), value: '公共文件庫' },
  { label: $t('page.legalPlatform.privateLibrary'), value: '私有文件庫' },
  { label: $t('page.legalPlatform.departmentLibrary'), value: '部門文件庫' },
  { label: $t('page.legalPlatform.projectLibrary'), value: '項目文件庫' },
];

// 狀態選項
const statusOptions = [
  { label: $t('page.legalPlatform.active'), value: '啟用' },
  { label: $t('page.legalPlatform.inactive'), value: '停用' },
];

// 搜索
const handleSearch = () => {
  console.log('搜索條件:', searchForm);
  // 這裡應該調用API進行搜索
  message.success('搜索完成');
};

// 重置搜索
const handleReset = () => {
  Object.assign(searchForm, {
    libraryName: '',
    libraryType: undefined,
    department: undefined,
    status: undefined,
    startDate: undefined,
    endDate: undefined,
  });
  handleSearch();
};

// 新增文件庫
const handleCreate = () => {
  router.push('/legal-platform/file-management/library-create');
};

// 查看詳情
const handleDetail = (record: any) => {
  router.push(`/legal-platform/file-management/library-detail/${record.id}`);
};

// 編輯文件庫
const handleEdit = (record: any) => {
  router.push({
    path: '/legal-platform/file-management/library-create',
    query: { id: record.id, mode: 'edit' },
  });
};

// 刪除文件庫
const handleDelete = (record: any) => {
  Modal.confirm({
    title: '確認刪除',
    content: `確定要刪除文件庫「${record.name}」嗎？此操作不可恢復。`,
    okText: '確定',
    cancelText: '取消',
    onOk() {
      // 這裡應該調用API刪除
      message.success('刪除成功');
      // 重新加載數據
      loadData();
    },
  });
};

// 配置文件庫
const handleConfig = (record: any) => {
  router.push({
    path: '/legal-platform/file-management/library-config',
    query: { id: record.id },
  });
};

// 分頁變化
const handlePageChange = (page: number, pageSize: number) => {
  pagination.current = page;
  pagination.pageSize = pageSize;
  loadData();
};

// 加載數據
const loadData = () => {
  // 這裡應該調用API加載數據
  console.log('加載數據');
};

// 獲取狀態標籤顏色
const getStatusColor = (status: string) => {
  return status === '啟用' ? 'success' : 'default';
};





// 組件掛載時加載數據
onMounted(() => {
  loadData();
});
</script>

<template>
  <Page :description="$t('page.legalPlatform.fileManagement')" :title="$t('page.legalPlatform.fileLibraryList')">
    <!-- 搜索表單 -->
    <Card class="mb-4">
      <Form layout="inline" :model="searchForm">
        <Row :gutter="16" class="w-full">
          <Col :span="6">
            <FormItem :label="$t('page.legalPlatform.fileLibraryName')">
              <Input 
                v-model:value="searchForm.libraryName" 
                :placeholder="$t('page.legalPlatform.fileLibraryName')"
                allow-clear
              />
            </FormItem>
          </Col>
          <Col :span="6">
            <FormItem :label="$t('page.legalPlatform.fileLibraryType')">
              <Select 
                v-model:value="searchForm.libraryType" 
                :placeholder="$t('page.legalPlatform.fileLibraryType')"
                allow-clear
              >
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
          <Col :span="6">
            <FormItem :label="$t('page.legalPlatform.fileLibraryDepartment')">
              <Select 
                v-model:value="searchForm.department" 
                :placeholder="$t('page.legalPlatform.fileLibraryDepartment')"
                allow-clear
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
          <Col :span="6">
            <FormItem :label="$t('page.legalPlatform.fileLibraryStatus')">
              <Select 
                v-model:value="searchForm.status" 
                :placeholder="$t('page.legalPlatform.fileLibraryStatus')"
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
          </Col>
        </Row>
        <Row :gutter="16" class="w-full mt-4">
          <Col :span="12">
            <FormItem :label="$t('page.legalPlatform.createTime')">
              <DatePicker.RangePicker 
                v-model:value="dateRange"
                :placeholder="['開始日期', '結束日期']"
                class="w-full"
                @change="(dates) => {
                  searchForm.startDate = dates?.[0];
                  searchForm.endDate = dates?.[1];
                }"
              />
            </FormItem>
          </Col>
          <Col :span="12">
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
                    <span class="icon-[lucide--refresh-cw] size-4" />
                  </template>
                  {{ $t('page.legalPlatform.reset') }}
                </Button>
              </Space>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Card>

    <!-- 操作按鈕 -->
    <Card class="mb-4">
      <Space>
        <Button type="primary" @click="handleCreate">
          <template #icon>
            <span class="icon-[lucide--plus] size-4" />
          </template>
          {{ $t('page.legalPlatform.fileLibraryCreate') }}
        </Button>
        <Button @click="loadData">
          <template #icon>
            <span class="icon-[lucide--refresh-cw] size-4" />
          </template>
          {{ $t('page.legalPlatform.refreshData') }}
        </Button>
      </Space>
    </Card>



    <!-- 數據表格 -->
    <Card>
      <Table
        :columns="columns"
        :data-source="tableData"
        :pagination="false"
        :scroll="{ x: 1500 }"
        row-key="id"
      >
        <!-- 文件庫名稱 -->
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'name'">
            <div class="flex flex-col">
              <span class="font-medium text-blue-600 cursor-pointer hover:text-blue-800" @click="handleDetail(record)">
                {{ record.name }}
              </span>
              <div class="flex flex-wrap gap-1 mt-1">
                <Tag v-for="tag in record.tags" :key="tag" size="small" color="blue">
                  {{ tag }}
                </Tag>
              </div>
            </div>
          </template>

          <!-- 文件庫類型 -->
          <template v-else-if="column.key === 'type'">
            <Tag>
              {{ record.type }}
            </Tag>
          </template>



          <!-- 狀態 -->
          <template v-else-if="column.key === 'status'">
            <Tag :color="getStatusColor(record.status)">
              {{ record.status }}
            </Tag>
          </template>

          <!-- 操作 -->
          <template v-else-if="column.key === 'operation'">
            <Space>
              <Button type="link" size="small" @click="handleDetail(record)">
                <template #icon>
                  <span class="icon-[lucide--eye] size-4" />
                </template>
                {{ $t('page.legalPlatform.detail') }}
              </Button>
              <Button type="link" size="small" @click="handleEdit(record)">
                <template #icon>
                  <span class="icon-[lucide--edit] size-4" />
                </template>
                編輯
              </Button>
              <Button type="link" size="small" @click="handleConfig(record)">
                <template #icon>
                  <span class="icon-[lucide--settings] size-4" />
                </template>
                配置
              </Button>
              <Button type="link" size="small" danger @click="handleDelete(record)">
                <template #icon>
                  <span class="icon-[lucide--trash-2] size-4" />
                </template>
                {{ $t('page.legalPlatform.delete') }}
              </Button>
            </Space>
          </template>
        </template>
      </Table>

      <!-- 分頁 -->
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
  </Page>
</template>

<style scoped>
.ant-table-tbody > tr > td {
  padding: 12px 8px;
}
</style>
