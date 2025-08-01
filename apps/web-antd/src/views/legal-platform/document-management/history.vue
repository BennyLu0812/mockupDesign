<script lang="ts" setup>
import { ref, reactive } from 'vue';
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
  DatePicker,
  message,
  Modal,
  Descriptions,
  DescriptionsItem,
  Timeline,
  TimelineItem,
  Tooltip,
  Badge,
  Divider,
  Tabs,
  TabPane,
} from 'ant-design-vue';

const router = useRouter();

// 當前標籤頁
const activeTab = ref('operations');

// 搜索表單
const searchForm = reactive({
  fileName: '',
  operationType: '',
  operator: '',
  dateRange: [],
  ipAddress: '',
  fileType: '',
});

// 操作歷史數據
const operationHistory = ref([
  {
    id: 'op-001',
    fileName: '合同模板-服務協議.docx',
    fileId: 'DOC-2024-001',
    operationType: 'upload',
    operationName: '文件上傳',
    operator: '張三',
    operatorId: 'user001',
    operationTime: '2024-01-20 14:45:00',
    description: '上傳了新版本 v2.1',
    ipAddress: '192.168.1.100',
    userAgent: 'Chrome 120.0.0.0',
    fileSize: '2.5 MB',
    fileType: 'docx',
    details: {
      version: 'v2.1',
      changes: '更新了第三方責任條款，增加了數據保護相關內容',
      uploadMethod: '本地上傳',
    },
  },
  {
    id: 'op-002',
    fileName: '合同模板-服務協議.docx',
    fileId: 'DOC-2024-001',
    operationType: 'download',
    operationName: '文件下載',
    operator: '李四',
    operatorId: 'user002',
    operationTime: '2024-01-20 11:30:00',
    description: '下載了文件',
    ipAddress: '192.168.1.105',
    userAgent: 'Chrome 120.0.0.0',
    fileSize: '2.5 MB',
    fileType: 'docx',
    details: {
      downloadReason: '業務需要',
      downloadFormat: '原格式',
    },
  },
  {
    id: 'op-003',
    fileName: '法律分析報告.pdf',
    fileId: 'DOC-2024-002',
    operationType: 'view',
    operationName: '文件預覽',
    operator: '王五',
    operatorId: 'user003',
    operationTime: '2024-01-20 09:15:00',
    description: '預覽了文件內容',
    ipAddress: '192.168.1.110',
    userAgent: 'Firefox 121.0.0.0',
    fileSize: '3.2 MB',
    fileType: 'pdf',
    details: {
      viewDuration: '5分鐘',
      viewPages: '1-15頁',
    },
  },
  {
    id: 'op-004',
    fileName: '會議記錄-董事會.docx',
    fileId: 'DOC-2024-003',
    operationType: 'print',
    operationName: '文件列印',
    operator: '趙六',
    operatorId: 'user004',
    operationTime: '2024-01-19 15:45:00',
    description: '列印了文件',
    ipAddress: '192.168.1.95',
    userAgent: 'Chrome 120.0.0.0',
    fileSize: '1.8 MB',
    fileType: 'docx',
    details: {
      printPages: '全部',
      printCopies: 2,
      printer: 'HP LaserJet Pro',
    },
  },
  {
    id: 'op-005',
    fileName: '統計數據.xlsx',
    fileId: 'DOC-2024-004',
    operationType: 'edit',
    operationName: '文件編輯',
    operator: '錢七',
    operatorId: 'user005',
    operationTime: '2024-01-19 10:20:00',
    description: '編輯了文件屬性',
    ipAddress: '192.168.1.120',
    userAgent: 'Chrome 120.0.0.0',
    fileSize: '5.1 MB',
    fileType: 'xlsx',
    details: {
      editType: '屬性修改',
      changedFields: ['標籤', '描述', '機密等級'],
    },
  },
  {
    id: 'op-006',
    fileName: '宣傳材料.pptx',
    fileId: 'DOC-2024-005',
    operationType: 'share',
    operationName: '文件分享',
    operator: '孫八',
    operatorId: 'user006',
    operationTime: '2024-01-18 16:30:00',
    description: '分享了文件鏈接',
    ipAddress: '192.168.1.130',
    userAgent: 'Safari 17.0.0.0',
    fileSize: '8.7 MB',
    fileType: 'pptx',
    details: {
      shareType: '鏈接分享',
      expiryTime: '2024-01-25 16:30:00',
      shareWith: '外部用戶',
    },
  },
  {
    id: 'op-007',
    fileName: '過期合同.pdf',
    fileId: 'DOC-2024-006',
    operationType: 'delete',
    operationName: '文件刪除',
    operator: '周九',
    operatorId: 'user007',
    operationTime: '2024-01-18 14:15:00',
    description: '將文件移至回收站',
    ipAddress: '192.168.1.140',
    userAgent: 'Chrome 120.0.0.0',
    fileSize: '1.2 MB',
    fileType: 'pdf',
    details: {
      deleteReason: '合同到期',
      retentionDays: 30,
    },
  },
]);

// 版本歷史數據
const versionHistory = ref([
  {
    id: 'ver-001',
    fileName: '合同模板-服務協議.docx',
    fileId: 'DOC-2024-001',
    version: 'v2.1',
    uploader: '張三',
    uploadTime: '2024-01-20 14:45:00',
    fileSize: '2.5 MB',
    changes: '更新了第三方責任條款，增加了數據保護相關內容',
    isCurrent: true,
    downloadCount: 15,
  },
  {
    id: 'ver-002',
    fileName: '合同模板-服務協議.docx',
    fileId: 'DOC-2024-001',
    version: 'v2.0',
    uploader: '李四',
    uploadTime: '2024-01-15 10:30:00',
    fileSize: '2.3 MB',
    changes: '重新設計了合同結構，優化了條款表述',
    isCurrent: false,
    downloadCount: 28,
  },
  {
    id: 'ver-003',
    fileName: '合同模板-服務協議.docx',
    fileId: 'DOC-2024-001',
    version: 'v1.5',
    uploader: '王五',
    uploadTime: '2024-01-10 16:20:00',
    fileSize: '2.1 MB',
    changes: '修正了付款條款中的錯誤，增加了違約責任說明',
    isCurrent: false,
    downloadCount: 42,
  },
]);

// 訪問統計數據
const accessStats = ref([
  {
    date: '2024-01-20',
    views: 45,
    downloads: 12,
    prints: 3,
    shares: 2,
    uniqueUsers: 18,
  },
  {
    date: '2024-01-19',
    views: 38,
    downloads: 15,
    prints: 5,
    shares: 1,
    uniqueUsers: 22,
  },
  {
    date: '2024-01-18',
    views: 52,
    downloads: 18,
    prints: 4,
    shares: 3,
    uniqueUsers: 25,
  },
  {
    date: '2024-01-17',
    views: 41,
    downloads: 9,
    prints: 2,
    shares: 1,
    uniqueUsers: 19,
  },
  {
    date: '2024-01-16',
    views: 35,
    downloads: 11,
    prints: 3,
    shares: 2,
    uniqueUsers: 16,
  },
]);

// 分頁配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 7,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number, range: [number, number]) => 
    `第 ${range[0]}-${range[1]} 條，共 ${total} 條`,
});

// 詳情模態框
const detailModalVisible = ref(false);
const currentRecord = ref<any>({});

// 表格列配置
const operationColumns = [
  {
    title: '操作時間',
    dataIndex: 'operationTime',
    key: 'operationTime',
    width: 180,
    sorter: true,
  },
  {
    title: '文件名稱',
    dataIndex: 'fileName',
    key: 'fileName',
    width: 200,
  },
  {
    title: '操作類型',
    dataIndex: 'operationName',
    key: 'operationName',
    width: 120,
  },
  {
    title: '操作者',
    dataIndex: 'operator',
    key: 'operator',
    width: 100,
  },
  {
    title: 'IP地址',
    dataIndex: 'ipAddress',
    key: 'ipAddress',
    width: 140,
  },
  {
    title: '文件類型',
    dataIndex: 'fileType',
    key: 'fileType',
    width: 100,
  },
  {
    title: '操作描述',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: '操作',
    key: 'action',
    width: 120,
    fixed: 'right',
  },
];

const versionColumns = [
  {
    title: '版本',
    dataIndex: 'version',
    key: 'version',
    width: 100,
  },
  {
    title: '文件名稱',
    dataIndex: 'fileName',
    key: 'fileName',
    width: 200,
  },
  {
    title: '上傳者',
    dataIndex: 'uploader',
    key: 'uploader',
    width: 100,
  },
  {
    title: '上傳時間',
    dataIndex: 'uploadTime',
    key: 'uploadTime',
    width: 180,
  },
  {
    title: '文件大小',
    dataIndex: 'fileSize',
    key: 'fileSize',
    width: 100,
  },
  {
    title: '下載次數',
    dataIndex: 'downloadCount',
    key: 'downloadCount',
    width: 100,
  },
  {
    title: '變更說明',
    dataIndex: 'changes',
    key: 'changes',
  },
  {
    title: '操作',
    key: 'action',
    width: 120,
    fixed: 'right',
  },
];

const statsColumns = [
  {
    title: '日期',
    dataIndex: 'date',
    key: 'date',
    width: 120,
  },
  {
    title: '瀏覽次數',
    dataIndex: 'views',
    key: 'views',
    width: 100,
  },
  {
    title: '下載次數',
    dataIndex: 'downloads',
    key: 'downloads',
    width: 100,
  },
  {
    title: '列印次數',
    dataIndex: 'prints',
    key: 'prints',
    width: 100,
  },
  {
    title: '分享次數',
    dataIndex: 'shares',
    key: 'shares',
    width: 100,
  },
  {
    title: '獨立用戶',
    dataIndex: 'uniqueUsers',
    key: 'uniqueUsers',
    width: 100,
  },
];

// 操作類型選項
const operationTypeOptions = [
  { label: '文件上傳', value: 'upload' },
  { label: '文件下載', value: 'download' },
  { label: '文件預覽', value: 'view' },
  { label: '文件編輯', value: 'edit' },
  { label: '文件列印', value: 'print' },
  { label: '文件分享', value: 'share' },
  { label: '文件刪除', value: 'delete' },
  { label: '權限變更', value: 'permission' },
];

// 操作者選項
const operatorOptions = [
  { label: '張三', value: '張三' },
  { label: '李四', value: '李四' },
  { label: '王五', value: '王五' },
  { label: '趙六', value: '趙六' },
  { label: '錢七', value: '錢七' },
  { label: '孫八', value: '孫八' },
  { label: '周九', value: '周九' },
];

// 文件類型選項
const fileTypeOptions = [
  { label: 'PDF', value: 'pdf' },
  { label: 'Word', value: 'docx' },
  { label: 'Excel', value: 'xlsx' },
  { label: 'PowerPoint', value: 'pptx' },
  { label: '圖片', value: 'image' },
  { label: '音頻', value: 'audio' },
  { label: '視頻', value: 'video' },
];

// 獲取操作類型圖標
const getOperationIcon = (operation: string) => {
  const iconMap = {
    upload: 'icon-[lucide--upload]',
    download: 'icon-[lucide--download]',
    view: 'icon-[lucide--eye]',
    edit: 'icon-[lucide--edit]',
    delete: 'icon-[lucide--trash]',
    print: 'icon-[lucide--printer]',
    share: 'icon-[lucide--share]',
    permission: 'icon-[lucide--shield]',
  };
  return iconMap[operation] || 'icon-[lucide--activity]';
};

// 獲取操作類型顏色
const getOperationColor = (operation: string) => {
  const colorMap = {
    upload: 'green',
    download: 'blue',
    view: 'cyan',
    edit: 'orange',
    delete: 'red',
    print: 'purple',
    share: 'magenta',
    permission: 'gold',
  };
  return colorMap[operation] || 'default';
};

// 獲取文件類型圖標
const getFileIcon = (fileType: string) => {
  const iconMap = {
    pdf: 'icon-[lucide--file-text]',
    doc: 'icon-[lucide--file-text]',
    docx: 'icon-[lucide--file-text]',
    xls: 'icon-[lucide--file-spreadsheet]',
    xlsx: 'icon-[lucide--file-spreadsheet]',
    ppt: 'icon-[lucide--presentation]',
    pptx: 'icon-[lucide--presentation]',
    jpg: 'icon-[lucide--image]',
    jpeg: 'icon-[lucide--image]',
    png: 'icon-[lucide--image]',
    gif: 'icon-[lucide--image]',
    mp4: 'icon-[lucide--video]',
    avi: 'icon-[lucide--video]',
    mp3: 'icon-[lucide--music]',
    wav: 'icon-[lucide--music]',
  };
  return iconMap[fileType.toLowerCase()] || 'icon-[lucide--file]';
};

// 搜索
const handleSearch = () => {
  console.log('搜索條件:', searchForm);
  message.success('搜索完成');
};

// 重置搜索
const handleReset = () => {
  Object.assign(searchForm, {
    fileName: '',
    operationType: '',
    operator: '',
    dateRange: [],
    ipAddress: '',
    fileType: '',
  });
  message.info('搜索條件已重置');
};

// 查看詳情
const handleViewDetail = (record: any) => {
  currentRecord.value = record;
  detailModalVisible.value = true;
};

// 導出記錄
const handleExport = () => {
  message.success('導出功能開發中...');
};

// 查看文件
const handleViewFile = (record: any) => {
  router.push(`/legal-platform/document-management/detail/${record.fileId}`);
};

// 下載版本
const handleDownloadVersion = (record: any) => {
  message.success(`正在下載版本 ${record.version}`);
};

// 返回文件列表
const handleBackToList = () => {
  router.push('/legal-platform/document-management/list');
};
</script>

<template>
  <Page>
    <!-- 頁面頭部 -->
    <Card class="mb-4">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-xl font-semibold mb-2">{{ $t('page.legalPlatform.documentHistory') }}</h2>
          <div class="text-gray-500">查看文件的操作歷史、版本變更和訪問統計</div>
        </div>
        <Space>
          <Button @click="handleBackToList">
            <template #icon>
              <span class="icon-[lucide--arrow-left] size-4" />
            </template>
            {{ $t('page.legalPlatform.back') }}
          </Button>
          
          <Button @click="handleExport">
            <template #icon>
              <span class="icon-[lucide--download] size-4" />
            </template>
            導出記錄
          </Button>
        </Space>
      </div>
    </Card>

    <!-- 搜索表單 -->
    <Card class="mb-4">
      <Form layout="inline" :model="searchForm">
        <FormItem label="文件名稱">
          <Input 
            v-model:value="searchForm.fileName" 
            placeholder="請輸入文件名稱" 
            style="width: 200px"
          />
        </FormItem>
        
        <FormItem label="操作類型">
          <Select 
            v-model:value="searchForm.operationType" 
            placeholder="請選擇操作類型" 
            style="width: 150px"
            allow-clear
          >
            <SelectOption 
              v-for="option in operationTypeOptions" 
              :key="option.value" 
              :value="option.value"
            >
              {{ option.label }}
            </SelectOption>
          </Select>
        </FormItem>
        
        <FormItem label="操作者">
          <Select 
            v-model:value="searchForm.operator" 
            placeholder="請選擇操作者" 
            style="width: 150px"
            allow-clear
          >
            <SelectOption 
              v-for="option in operatorOptions" 
              :key="option.value" 
              :value="option.value"
            >
              {{ option.label }}
            </SelectOption>
          </Select>
        </FormItem>
        
        <FormItem label="操作時間">
          <DatePicker.RangePicker 
            v-model:value="searchForm.dateRange" 
            style="width: 300px"
          />
        </FormItem>
        
        <FormItem label="文件類型">
          <Select 
            v-model:value="searchForm.fileType" 
            placeholder="請選擇文件類型" 
            style="width: 150px"
            allow-clear
          >
            <SelectOption 
              v-for="option in fileTypeOptions" 
              :key="option.value" 
              :value="option.value"
            >
              {{ option.label }}
            </SelectOption>
          </Select>
        </FormItem>
        
        <FormItem label="IP地址">
          <Input 
            v-model:value="searchForm.ipAddress" 
            placeholder="請輸入IP地址" 
            style="width: 150px"
          />
        </FormItem>
        
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
                <span class="icon-[lucide--rotate-ccw] size-4" />
              </template>
              {{ $t('page.legalPlatform.reset') }}
            </Button>
          </Space>
        </FormItem>
      </Form>
    </Card>

    <!-- 歷史記錄標籤頁 -->
    <Card>
      <Tabs v-model:activeKey="activeTab">
        <!-- 操作歷史 -->
        <TabPane key="operations" tab="操作歷史">
          <Table
            :columns="operationColumns"
            :data-source="operationHistory"
            :pagination="pagination"
            :scroll="{ x: 1200 }"
            row-key="id"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'fileName'">
                <div class="flex items-center">
                  <span :class="getFileIcon(record.fileType)" class="size-4 mr-2 text-blue-500" />
                  <Tooltip :title="record.fileName">
                    <Button type="link" @click="handleViewFile(record)">
                      {{ record.fileName }}
                    </Button>
                  </Tooltip>
                </div>
              </template>
              
              <template v-if="column.key === 'operationName'">
                <div class="flex items-center">
                  <span :class="getOperationIcon(record.operationType)" class="size-4 mr-2" />
                  <Tag :color="getOperationColor(record.operationType)">
                    {{ record.operationName }}
                  </Tag>
                </div>
              </template>
              
              <template v-if="column.key === 'fileType'">
                <Tag>{{ record.fileType.toUpperCase() }}</Tag>
              </template>
              
              <template v-if="column.key === 'action'">
                <Button size="small" @click="handleViewDetail(record)">
                  <template #icon>
                    <span class="icon-[lucide--eye] size-3" />
                  </template>
                  詳情
                </Button>
              </template>
            </template>
          </Table>
        </TabPane>

        <!-- 版本歷史 -->
        <TabPane key="versions" tab="版本歷史">
          <Table
            :columns="versionColumns"
            :data-source="versionHistory"
            :pagination="false"
            :scroll="{ x: 1000 }"
            row-key="id"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'version'">
                <div class="flex items-center">
                  <Tag v-if="record.isCurrent" color="green">當前</Tag>
                  <span class="ml-1">{{ record.version }}</span>
                </div>
              </template>
              
              <template v-if="column.key === 'fileName'">
                <div class="flex items-center">
                  <span class="icon-[lucide--file-text] size-4 mr-2 text-blue-500" />
                  <Tooltip :title="record.fileName">
                    <Button type="link" @click="handleViewFile(record)">
                      {{ record.fileName }}
                    </Button>
                  </Tooltip>
                </div>
              </template>
              
              <template v-if="column.key === 'downloadCount'">
                <Badge :count="record.downloadCount" :number-style="{ backgroundColor: '#52c41a' }" />
              </template>
              
              <template v-if="column.key === 'action'">
                <Button size="small" @click="handleDownloadVersion(record)">
                  <template #icon>
                    <span class="icon-[lucide--download] size-3" />
                  </template>
                  下載
                </Button>
              </template>
            </template>
          </Table>
        </TabPane>

        <!-- 訪問統計 -->
        <TabPane key="stats" tab="訪問統計">
          <Table
            :columns="statsColumns"
            :data-source="accessStats"
            :pagination="false"
            row-key="date"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'views'">
                <div class="text-center">
                  <div class="font-medium text-blue-500">{{ record.views }}</div>
                </div>
              </template>
              
              <template v-if="column.key === 'downloads'">
                <div class="text-center">
                  <div class="font-medium text-green-500">{{ record.downloads }}</div>
                </div>
              </template>
              
              <template v-if="column.key === 'prints'">
                <div class="text-center">
                  <div class="font-medium text-orange-500">{{ record.prints }}</div>
                </div>
              </template>
              
              <template v-if="column.key === 'shares'">
                <div class="text-center">
                  <div class="font-medium text-purple-500">{{ record.shares }}</div>
                </div>
              </template>
              
              <template v-if="column.key === 'uniqueUsers'">
                <div class="text-center">
                  <div class="font-medium text-cyan-500">{{ record.uniqueUsers }}</div>
                </div>
              </template>
            </template>
          </Table>
        </TabPane>
      </Tabs>
    </Card>

    <!-- 操作詳情模態框 -->
    <Modal
      v-model:open="detailModalVisible"
      title="操作詳情"
      width="700px"
      :footer="null"
    >
      <div class="space-y-4">
        <div class="flex items-center">
          <span :class="getOperationIcon(currentRecord.operationType)" class="size-6 mr-3" />
          <div>
            <div class="font-medium text-lg">{{ currentRecord.operationName }}</div>
            <div class="text-gray-500 text-sm">{{ currentRecord.operationTime }}</div>
          </div>
        </div>
        
        <Descriptions title="基本信息" :column="2" bordered>
          <DescriptionsItem label="文件名稱">{{ currentRecord.fileName }}</DescriptionsItem>
          <DescriptionsItem label="文件ID">{{ currentRecord.fileId }}</DescriptionsItem>
          <DescriptionsItem label="操作者">{{ currentRecord.operator }}</DescriptionsItem>
          <DescriptionsItem label="操作時間">{{ currentRecord.operationTime }}</DescriptionsItem>
          <DescriptionsItem label="IP地址">{{ currentRecord.ipAddress }}</DescriptionsItem>
          <DescriptionsItem label="用戶代理">{{ currentRecord.userAgent }}</DescriptionsItem>
          <DescriptionsItem label="文件大小">{{ currentRecord.fileSize }}</DescriptionsItem>
          <DescriptionsItem label="文件類型">{{ currentRecord.fileType?.toUpperCase() }}</DescriptionsItem>
          <DescriptionsItem label="操作描述" :span="2">{{ currentRecord.description }}</DescriptionsItem>
        </Descriptions>
        
        <div v-if="currentRecord.details">
          <Divider>詳細信息</Divider>
          
          <div class="grid grid-cols-2 gap-4">
            <div v-for="(value, key) in currentRecord.details" :key="key">
              <div class="text-sm text-gray-500">{{ key }}</div>
              <div class="font-medium">{{ value }}</div>
            </div>
          </div>
        </div>
        
        <div class="flex justify-end pt-4 border-t">
          <Button @click="detailModalVisible = false">關閉</Button>
        </div>
      </div>
    </Modal>
  </Page>
</template>

<style scoped>
.ant-card {
  border-radius: 8px;
}
</style>