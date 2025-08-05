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
  TreeSelect,
} from 'ant-design-vue';

const router = useRouter();

// 搜索表單
const searchForm = reactive({
  folderName: '',
  folderType: undefined,
  department: undefined,
  status: undefined,
  parentFolder: undefined,
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
    id: '1',
    folderName: '法律文件庫',
    folderPath: '/legal-documents',
    folderType: 'public',
    department: '法制研究及立法統籌廳',
    owner: 'João Silva',
    status: 'active',
    createTime: '2024-01-15 10:30:00',
    updateTime: '2024-01-20 14:20:00',
    tags: ['重要', '法律'],
    permissions: ['view', 'edit', 'upload'],
  },
  {
    id: '2',
    folderName: '合同模板',
    folderPath: '/contract-templates',
    folderType: 'public',
    department: '法律草擬廳',
    owner: 'Maria Santos',
    status: 'active',
    createTime: '2024-01-10 09:15:00',
    updateTime: '2024-01-18 16:45:00',
    tags: ['模板', '合同'],
    permissions: ['view', 'download'],
  },
  {
    id: '3',
    folderName: '案例分析',
    folderPath: '/case-analysis',
    folderType: 'private',
    department: '法律翻譯廳',
    owner: 'Pedro Costa',
    status: 'inactive',
    createTime: '2024-01-05 11:20:00',
    updateTime: '2024-01-12 13:30:00',
    tags: ['案例', '分析'],
    permissions: ['view'],
  },
]);

// 表格列配置
const columns = [
  {
    title: $t('page.legalPlatform.folderName'),
    dataIndex: 'folderName',
    key: 'folderName',
    width: 200,
  },
  {
    title: $t('page.legalPlatform.folderPath'),
    dataIndex: 'folderPath',
    key: 'folderPath',
    width: 200,
  },
  {
    title: $t('page.legalPlatform.folderType'),
    dataIndex: 'folderType',
    key: 'folderType',
    width: 120,
  },
  {
    title: $t('page.legalPlatform.department'),
    dataIndex: 'department',
    key: 'department',
    width: 120,
  },
  {
    title: $t('page.legalPlatform.folderOwner'),
    dataIndex: 'owner',
    key: 'owner',
    width: 100,
  },
  {
    title: $t('page.legalPlatform.folderStatus'),
    dataIndex: 'status',
    key: 'status',
    width: 100,
  },
  {
    title: $t('page.legalPlatform.updateTime'),
    dataIndex: 'updateTime',
    key: 'updateTime',
    width: 180,
  },
  {
    title: $t('page.legalPlatform.action'),
    key: 'action',
    width: 200,
    fixed: 'right',
  },
];

// 文件夾類型選項
const folderTypeOptions = [
  { label: $t('page.legalPlatform.publicFolder'), value: 'public' },
  { label: $t('page.legalPlatform.privateFolder'), value: 'private' },
];

// 部門選項
const departmentOptions = [
  { label: '法制研究及立法統籌廳', value: 'legal-research' },
  { label: '法律草擬廳', value: 'legal-drafting' },
  { label: '法律翻譯廳', value: 'legal-translation' },
];

// 狀態選項
const statusOptions = [
  { label: $t('page.legalPlatform.active'), value: 'active' },
  { label: $t('page.legalPlatform.inactive'), value: 'inactive' },
];

// 父文件夾樹形數據
const folderTreeData = [
  {
    title: '根目錄',
    value: 'root',
    children: [
      {
        title: '法律文件庫',
        value: 'legal-documents',
        children: [
          { title: '法規', value: 'regulations' },
          { title: '判例', value: 'cases' },
        ],
      },
      {
        title: '合同模板',
        value: 'contract-templates',
      },
    ],
  },
];

// 搜索
const handleSearch = () => {
  console.log('搜索條件:', searchForm);
  // 這裡應該調用API進行搜索
  message.success('搜索成功');
};

// 重置
const handleReset = () => {
  Object.assign(searchForm, {
    folderName: '',
    folderType: undefined,
    department: undefined,
    status: undefined,
    parentFolder: undefined,
    startDate: undefined,
    endDate: undefined,
  });
  dateRange.value = [undefined, undefined];
  message.success('重置成功');
};

// 新增文件夾
const handleCreate = () => {
  router.push('/legal-platform/folder-management/create');
};

// 查看詳情
const handleView = (record: any) => {
  router.push(`/legal-platform/folder-management/detail/${record.id}`);
};

// 編輯
const handleEdit = (record: any) => {
  router.push(`/legal-platform/folder-management/create?id=${record.id}`);
};

// 刪除
const handleDelete = (record: any) => {
  Modal.confirm({
    title: '確認刪除',
    content: `確定要刪除文件夾「${record.folderName}」嗎？`,
    onOk() {
      console.log('刪除文件夾:', record.id);
      message.success('刪除成功');
    },
  });
};

// 權限管理
const handlePermission = (record: any) => {
  router.push(`/legal-platform/folder-management/permission?id=${record.id}`);
};

// 分頁變化
const handlePageChange = (page: number, pageSize: number) => {
  pagination.current = page;
  pagination.pageSize = pageSize;
  // 重新加載數據
};

// 獲取狀態標籤顏色
const getStatusColor = (status: string) => {
  return status === 'active' ? 'green' : 'red';
};



// 組件掛載時加載數據
onMounted(() => {
  pagination.total = tableData.value.length;
});
</script>

<template>
  <Page>
    <Card class="mb-4">
      <Form layout="vertical">
        <Row :gutter="16">
          <Col :span="6">
            <FormItem :label="$t('page.legalPlatform.folderName')">
              <Input 
                v-model:value="searchForm.folderName" 
                :placeholder="$t('page.legalPlatform.folderName')"
              />
            </FormItem>
          </Col>
          <Col :span="6">
            <FormItem :label="$t('page.legalPlatform.folderType')">
              <Select 
                v-model:value="searchForm.folderType" 
                :placeholder="$t('page.legalPlatform.folderType')"
                allow-clear
              >
                <SelectOption 
                  v-for="option in folderTypeOptions" 
                  :key="option.value" 
                  :value="option.value"
                >
                  {{ option.label }}
                </SelectOption>
              </Select>
            </FormItem>
          </Col>
          <Col :span="6">
            <FormItem :label="$t('page.legalPlatform.department')">
              <Select 
                v-model:value="searchForm.department" 
                :placeholder="$t('page.legalPlatform.department')"
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
            <FormItem :label="$t('page.legalPlatform.folderStatus')">
              <Select 
                v-model:value="searchForm.status" 
                :placeholder="$t('page.legalPlatform.folderStatus')"
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
        <Row :gutter="16" class="mt-4">
          <Col :span="6">
            <FormItem :label="$t('page.legalPlatform.parentFolder')">
              <TreeSelect
                v-model:value="searchForm.parentFolder"
                :tree-data="folderTreeData"
                :placeholder="$t('page.legalPlatform.parentFolder')"
                allow-clear
                tree-default-expand-all
              />
            </FormItem>
          </Col>
          <Col :span="6">
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
                  {{ $t('page.legalPlatform.folderCreate') }}
                </Button>
              </Space>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Card>

    <Card>
      <Table
        :columns="columns"
        :data-source="tableData"
        :pagination="false"
        :scroll="{ x: 1400 }"
        row-key="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'folderType'">
            <span>
              {{ folderTypeOptions.find(opt => opt.value === record.folderType)?.label }}
            </span>
          </template>
          <template v-else-if="column.key === 'status'">
            <Tag :color="getStatusColor(record.status)">
              {{ statusOptions.find(opt => opt.value === record.status)?.label }}
            </Tag>
          </template>
          <template v-else-if="column.key === 'action'">
            <Space>
              <Button type="link" size="small" @click="handleView(record)">
                <template #icon>
                  <span class="icon-[lucide--eye] size-4" />
                </template>
                {{ $t('page.legalPlatform.view') }}
              </Button>
              <Button type="link" size="small" @click="handleEdit(record)">
                <template #icon>
                  <span class="icon-[lucide--edit] size-4" />
                </template>
                {{ $t('page.legalPlatform.edit') }}
              </Button>
              <Button type="link" size="small" @click="handlePermission(record)">
                <template #icon>
                  <span class="icon-[lucide--shield] size-4" />
                </template>
                {{ $t('page.legalPlatform.folderPermission') }}
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
.ant-card {
  border-radius: 8px;
}
</style>