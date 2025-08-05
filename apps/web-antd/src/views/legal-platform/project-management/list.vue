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
  message,
} from 'ant-design-vue';

const router = useRouter();

// 搜索表單
const searchForm = reactive({
  projectName: '',
  projectType: undefined,
  projectStatus: undefined,
  startDate: undefined,
  endDate: undefined,
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

// 表格數據
const tableData = ref([
  {
    id: 1,
    projectNumber: 'LP-2024-001',
    name: '法律條文審查項目',
    type: '法案項目',
    status: '處理中',
    creator: '陳大文',
    createTime: '2024-01-15 10:30:00',
    startTime: '2024-01-15',
    endTime: '2024-03-15',
    dueTime: '2024-03-10',
    memberCount: 5,
    taskCount: 12,
    completedTaskCount: 8,
  },
  {
    id: 2,
    projectNumber: 'LP-2024-002',
    name: '合同審核專案',
    type: '一般項目',
    status: '待處理',
    creator: 'João Silva',
    createTime: '2024-01-14 14:20:00',
    startTime: '2024-01-20',
    endTime: '2024-02-28',
    dueTime: '2024-02-25',
    memberCount: 3,
    taskCount: 8,
    completedTaskCount: 2,
  },
  {
    id: 3,
    projectNumber: 'LP-2024-003',
    name: '法規研究分析',
    type: '其他項目',
    status: '已完成',
    creator: 'Maria Santos',
    createTime: '2024-01-10 09:15:00',
    startTime: '2024-01-10',
    endTime: '2024-01-25',
    dueTime: '2024-01-25',
    memberCount: 4,
    taskCount: 6,
    completedTaskCount: 6,
  },
]);

// 表格列配置
const columns = [
  {
    title: '項目編號',
    dataIndex: 'projectNumber',
    key: 'projectNumber',
    width: 140,
  },
  {
    title: $t('page.legalPlatform.projectName'),
    dataIndex: 'name',
    key: 'name',
    width: 200,
  },
  {
    title: $t('page.legalPlatform.projectType'),
    dataIndex: 'type',
    key: 'type',
    width: 120,
  },
  {
    title: $t('page.legalPlatform.projectStatus'),
    dataIndex: 'status',
    key: 'status',
    width: 100,
  },
  {
    title: $t('page.legalPlatform.creator'),
    dataIndex: 'creator',
    key: 'creator',
    width: 100,
  },
  {
    title: $t('page.legalPlatform.createTime'),
    dataIndex: 'createTime',
    key: 'createTime',
    width: 160,
  },
  {
    title: $t('page.legalPlatform.operation'),
    key: 'operation',
    width: 200,
    fixed: 'right',
  },
];

// 項目類型選項
const projectTypeOptions = [
  { value: '一般項目', label: '一般項目' },
  { value: '法案項目', label: '法案項目' },
  { value: '其他項目', label: '其他項目' },
];

// 項目狀態選項
const projectStatusOptions = [
  { value: '待處理', label: '待處理' },
  { value: '處理中', label: '處理中' },
  { value: '已完成', label: '已完成' },
  { value: '已取消', label: '已取消' },
];

// 搜索項目
const handleSearch = () => {
  console.log('搜索項目:', searchForm);
  // 這裡實現搜索邏輯
  message.success('搜索功能待實現');
};

// 重置搜索
const handleReset = () => {
  Object.assign(searchForm, {
    projectName: '',
    projectType: undefined,
    projectStatus: undefined,
    startDate: undefined,
    endDate: undefined,
  });
};

// 新增項目
const handleCreate = () => {
  router.push('/legal-platform/project-management/project-template-selection');
};

// 查看項目詳情
const handleViewDetail = (record: any) => {
  router.push(`/legal-platform/project-management/detail/${record.id}`);
};

// 編輯項目
const handleEdit = (record: any) => {
  router.push({
    path: '/legal-platform/project-management/create',
    query: { id: record.id, mode: 'edit' },
  });
};

// 刪除項目
const handleDelete = (record: any) => {
  console.log('刪除項目:', record);
  message.success('刪除功能待實現');
};

// 獲取狀態標籤顏色
const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    '待處理': 'blue',
    '處理中': 'green',
    '已完成': 'gray',
    '已取消': 'red',
  };
  return colorMap[status] || 'default';
};

// 分頁變化
const handlePageChange = (page: number, pageSize: number) => {
  pagination.current = page;
  pagination.pageSize = pageSize;
  // 這裡實現分頁邏輯
};

// 組件掛載時獲取數據
onMounted(() => {
  // 這裡可以調用API獲取項目列表數據
  pagination.total = tableData.value.length;
});
</script>

<template>
  <Page :title="$t('page.legalPlatform.projectList')">
    <div class="project-list">
      <!-- 搜索區域 -->
      <Card class="mb-4">
        <Form
          :model="searchForm"
          layout="inline"
          class="search-form"
        >
          <Row :gutter="16" class="w-full">
            <Col :span="6">
              <FormItem label="項目名稱">
                <Input
                  v-model:value="searchForm.projectName"
                  placeholder="請輸入項目名稱"
                  allow-clear
                />
              </FormItem>
            </Col>
            <Col :span="6">
              <FormItem label="項目類型">
                <Select
                  v-model:value="searchForm.projectType"
                  placeholder="請選擇項目類型"
                  allow-clear
                >
                  <SelectOption
                    v-for="option in projectTypeOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </SelectOption>
                </Select>
              </FormItem>
            </Col>
            <Col :span="6">
              <FormItem label="項目狀態">
                <Select
                  v-model:value="searchForm.projectStatus"
                  placeholder="請選擇項目狀態"
                  allow-clear
                >
                  <SelectOption
                    v-for="option in projectStatusOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </SelectOption>
                </Select>
              </FormItem>
            </Col>
            <Col :span="6">
              <FormItem>
                <Space>
                  <Button type="primary" @click="handleSearch">
                    <span class="icon-[lucide--search] size-4 mr-1" />
                    搜索
                  </Button>
                  <Button @click="handleReset">
                    <span class="icon-[lucide--refresh-cw] size-4 mr-1" />
                    重置
                  </Button>
                  <Button type="primary" @click="handleCreate">
                    <span class="icon-[lucide--plus] size-4 mr-1" />
                    新增項目
                  </Button>
                </Space>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Card>



      <!-- 表格區域 -->
      <Card>
        <Table
          :columns="columns"
          :data-source="tableData"
          :pagination="false"
          :scroll="{ x: 1200 }"
          row-key="id"
        >
          <!-- 項目狀態列 -->
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'status'">
              <Tag :color="getStatusColor(record.status)">
                {{ record.status }}
              </Tag>
            </template>
            
            <!-- 操作列 -->
            <template v-else-if="column.key === 'operation'">
              <Space>
                <Button
                  type="link"
                  size="small"
                  @click="handleViewDetail(record)"
                >
                  <span class="icon-[lucide--eye] size-4 mr-1" />
                  查看
                </Button>
                <Button
                  type="link"
                  size="small"
                  @click="handleEdit(record)"
                >
                  <span class="icon-[lucide--edit] size-4 mr-1" />
                  編輯
                </Button>
                <Button
                  type="link"
                  size="small"
                  danger
                  @click="handleDelete(record)"
                >
                  <span class="icon-[lucide--trash-2] size-4 mr-1" />
                  刪除
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
    </div>
  </Page>
</template>

<style scoped>
.project-list {
  padding: 0;
}

.search-form .ant-form-item {
  margin-bottom: 16px;
}

.ant-table-tbody > tr > td {
  padding: 12px 16px;
}

.ant-table-thead > tr > th {
  background-color: #fafafa;
  font-weight: 600;
}
</style>
