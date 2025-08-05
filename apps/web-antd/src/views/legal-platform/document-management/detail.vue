<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Page } from '@vben/common-ui';
import { $t } from '#/locales';
import {
  Button,
  Card,
  Col,
  Row,
  Space,
  Tag,
  Descriptions,
  DescriptionsItem,
  Tabs,
  TabPane,
  Table,
  Input,
  Select,
  SelectOption,
  Modal,
  Form,
  FormItem,
  Textarea,
  message,
  Popconfirm,
  Tooltip,
  Badge,
  Timeline,
  TimelineItem,
  Divider,
  Image,
  Progress,
} from 'ant-design-vue';

const route = useRoute();
const router = useRouter();

// 文件ID
const fileId = route.params.id as string;

// 當前標籤頁
const activeTab = ref('info');

// 文件詳情
const fileDetail = reactive({
  id: 'DOC-2024-001',
  fileName: '合同模板-服務協議.docx',
  originalName: '服務協議模板_v2.1.docx',
  fileSize: '2.5 MB',
  fileType: 'docx',
  mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  fileVersion: 'v2.1',
  fileSource: '本地上傳',
  relatedProject: 'legal-consulting',
  projectName: '法律諮詢項目',
  fileStatus: 'published',
  description: '標準服務協議模板，包含常用條款和法律條文，適用於各類服務合同簽署。',
  tags: ['合同', '模板', '法律'],
  uploader: 'João Silva',
  uploaderId: 'user001',
  uploadTime: '2024-01-15 10:30:00',
  lastModified: '2024-01-20 14:45:00',
  lastModifiedBy: 'Maria Santos',
  downloadCount: 156,
  viewCount: 423,
  printCount: 23,
  shareCount: 12,
  customAttributes: {
    department: 'legal',
    departmentName: '法務部',
    category: 'contract-template',
    categoryName: '合同模板',
    confidentiality: 'internal',
    confidentialityName: '內部',
    approver: 'Pedro Costa',
    approveTime: '2024-01-16 09:15:00',
    expiryDate: '2025-01-15',
    keywords: '服務協議,合同,模板,法律條款',
  },
  permissions: {
    canView: true,
    canDownload: true,
    canPrint: true,
    canEdit: true,
    canDelete: false,
    canShare: true,
  },
  filePath: '/legal-documents/contracts/templates/',
  fileUrl: '/api/files/download/DOC-2024-001',
  previewUrl: '/api/files/preview/DOC-2024-001',
  thumbnailUrl: '/api/files/thumbnail/DOC-2024-001',
});

// 版本歷史
const versionHistory = ref([
  {
    version: 'v2.1',
    uploadTime: '2024-01-20 14:45:00',
    uploader: 'Maria Santos',
    fileSize: '2.5 MB',
    changes: '更新了第三方責任條款，增加了數據保護相關內容',
    isCurrent: true,
  },
  {
    version: 'v2.0',
    uploadTime: '2024-01-15 10:30:00',
    uploader: '張三',
    fileSize: '2.3 MB',
    changes: '重新設計了合同結構，優化了條款表述',
    isCurrent: false,
  },
  {
    version: 'v1.5',
    uploadTime: '2024-01-10 16:20:00',
    uploader: '張三',
    fileSize: '2.1 MB',
    changes: '修正了付款條款中的錯誤，增加了違約責任說明',
    isCurrent: false,
  },
]);

// 操作歷史
const operationHistory = ref([
  {
    id: 1,
    operation: 'upload',
    operationName: '文件上傳',
    operator: 'Maria Santos',
    operatorId: 'user002',
    operationTime: '2024-01-20 14:45:00',
    description: '上傳了新版本 v2.1',
    ipAddress: '192.168.1.100',
    userAgent: 'Chrome 120.0.0.0',
  },
  {
    id: 2,
    operation: 'download',
    operationName: '文件下載',
    operator: 'Pedro Costa',
    operatorId: 'user003',
    operationTime: '2024-01-20 11:30:00',
    description: '下載了文件',
    ipAddress: '192.168.1.105',
    userAgent: 'Chrome 120.0.0.0',
  },
  {
    id: 3,
    operation: 'view',
    operationName: '文件預覽',
    operator: 'Ana Ferreira',
    operatorId: 'user004',
    operationTime: '2024-01-20 09:15:00',
    description: '預覽了文件內容',
    ipAddress: '192.168.1.110',
    userAgent: 'Firefox 121.0.0.0',
  },
  {
    id: 4,
    operation: 'print',
    operationName: '文件列印',
    operator: 'João Silva',
    operatorId: 'user001',
    operationTime: '2024-01-19 15:45:00',
    description: '列印了文件',
    ipAddress: '192.168.1.95',
    userAgent: 'Chrome 120.0.0.0',
  },
  {
    id: 5,
    operation: 'edit',
    operationName: '文件編輯',
    operator: '張三',
    operatorId: 'user001',
    operationTime: '2024-01-15 10:30:00',
    description: '編輯了文件屬性',
    ipAddress: '192.168.1.95',
    userAgent: 'Chrome 120.0.0.0',
  },
]);

// 相關文件
const relatedFiles = ref([
  {
    id: 'DOC-2024-002',
    fileName: '合同模板-採購協議.docx',
    fileType: 'docx',
    fileSize: '1.8 MB',
    uploadTime: '2024-01-18 09:30:00',
    uploader: '李四',
    relation: '同類模板',
  },
  {
    id: 'DOC-2024-003',
    fileName: '法律條款說明.pdf',
    fileType: 'pdf',
    fileSize: '3.2 MB',
    uploadTime: '2024-01-16 14:20:00',
    uploader: 'Pedro Costa',
    relation: '參考文件',
  },
  {
    id: 'DOC-2024-004',
    fileName: '合同範例-已簽署.pdf',
    fileType: 'pdf',
    fileSize: '4.1 MB',
    uploadTime: '2024-01-14 11:45:00',
    uploader: '張三',
    relation: '實例參考',
  },
]);

// 文件統計
const fileStats = reactive({
  totalViews: 423,
  totalDownloads: 156,
  totalPrints: 23,
  totalShares: 12,
  todayViews: 15,
  todayDownloads: 8,
  weeklyViews: 89,
  weeklyDownloads: 34,
});

// 編輯模態框
const editModalVisible = ref(false);
const editForm = reactive({
  fileName: '',
  description: '',
  tags: [],
  customAttributes: {
    department: '',
    category: '',
    confidentiality: '',
    keywords: '',
  },
});

// 分享模態框
const shareModalVisible = ref(false);
const shareForm = reactive({
  shareType: 'link',
  expiryDays: 7,
  password: '',
  allowDownload: true,
  allowPrint: false,
  note: '',
});

// 表格列配置
const versionColumns = [
  {
    title: '版本',
    dataIndex: 'version',
    key: 'version',
    width: 100,
  },
  {
    title: '上傳時間',
    dataIndex: 'uploadTime',
    key: 'uploadTime',
    width: 180,
  },
  {
    title: '上傳者',
    dataIndex: 'uploader',
    key: 'uploader',
    width: 120,
  },
  {
    title: '文件大小',
    dataIndex: 'fileSize',
    key: 'fileSize',
    width: 120,
  },
  {
    title: '變更說明',
    dataIndex: 'changes',
    key: 'changes',
  },
  {
    title: '操作',
    key: 'action',
    width: 200,
  },
];

const historyColumns = [
  {
    title: '操作時間',
    dataIndex: 'operationTime',
    key: 'operationTime',
    width: 180,
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
    width: 120,
  },
  {
    title: 'IP地址',
    dataIndex: 'ipAddress',
    key: 'ipAddress',
    width: 140,
  },
  {
    title: '操作描述',
    dataIndex: 'description',
    key: 'description',
  },
];

const relatedColumns = [
  {
    title: '文件名稱',
    dataIndex: 'fileName',
    key: 'fileName',
  },
  {
    title: '文件類型',
    dataIndex: 'fileType',
    key: 'fileType',
    width: 100,
  },
  {
    title: '文件大小',
    dataIndex: 'fileSize',
    key: 'fileSize',
    width: 120,
  },
  {
    title: '上傳者',
    dataIndex: 'uploader',
    key: 'uploader',
    width: 120,
  },
  {
    title: '關聯關係',
    dataIndex: 'relation',
    key: 'relation',
    width: 120,
  },
  {
    title: '操作',
    key: 'action',
    width: 150,
  },
];

// 選項數據
const departmentOptions = [
  { label: '法務部', value: 'legal' },
  { label: '人事部', value: 'hr' },
  { label: '財務部', value: 'finance' },
  { label: '市場部', value: 'marketing' },
  { label: '技術部', value: 'tech' },
];

const categoryOptions = [
  { label: '合同模板', value: 'contract-template' },
  { label: '案例分析', value: 'case-analysis' },
  { label: '統計報表', value: 'statistics' },
  { label: '會議記錄', value: 'meeting-record' },
  { label: '宣傳材料', value: 'promotion' },
];

const confidentialityOptions = [
  { label: '公開', value: 'public' },
  { label: '內部', value: 'internal' },
  { label: '機密', value: 'confidential' },
  { label: '絕密', value: 'top-secret' },
];

const tagOptions = [
  { label: '合同', value: 'contract' },
  { label: '模板', value: 'template' },
  { label: '法律', value: 'legal' },
  { label: '案例', value: 'case' },
  { label: '分析', value: 'analysis' },
];

// 獲取文件狀態標籤
const getStatusTag = (status: string) => {
  const statusMap = {
    published: { color: 'green', text: $t('page.legalPlatform.published') },
    unpublished: { color: 'orange', text: $t('page.legalPlatform.unpublished') },
    transitional: { color: 'blue', text: $t('page.legalPlatform.transitional') },
  };
  return statusMap[status] || { color: 'default', text: status };
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
  };
  return iconMap[operation] || 'icon-[lucide--activity]';
};

// 文件操作
const handlePreview = () => {
  window.open(fileDetail.previewUrl, '_blank');
};

const handleDownload = () => {
  const link = document.createElement('a');
  link.href = fileDetail.fileUrl;
  link.download = fileDetail.fileName;
  link.click();
  message.success('文件下載已開始');
};

const handlePrint = () => {
  window.open(`${fileDetail.previewUrl}?print=true`, '_blank');
  message.success('文件已發送到列印機');
};

const handleEdit = () => {
  editForm.fileName = fileDetail.fileName;
  editForm.description = fileDetail.description;
  editForm.tags = [...fileDetail.tags];
  editForm.customAttributes = { ...fileDetail.customAttributes };
  editModalVisible.value = true;
};

const handleShare = () => {
  shareModalVisible.value = true;
};

const handleDelete = () => {
  message.success('文件已移至回收站');
  router.push('/legal-platform/document-management/list');
};

// 版本操作
const handleVersionDownload = (version: any) => {
  message.success(`正在下載版本 ${version.version}`);
};

const handleVersionRestore = (version: any) => {
  message.success(`已恢復到版本 ${version.version}`);
};

const handleVersionCompare = (version: any) => {
  message.info(`正在比較當前版本與 ${version.version}`);
};

// 相關文件操作
const handleRelatedFileView = (file: any) => {
  router.push(`/legal-platform/document-management/detail/${file.id}`);
};

// 保存編輯
const handleSaveEdit = () => {
  Object.assign(fileDetail, editForm);
  editModalVisible.value = false;
  message.success('文件信息已更新');
};

// 生成分享鏈接
const handleGenerateShareLink = () => {
  const shareLink = `https://example.com/share/${fileDetail.id}?token=abc123`;
  navigator.clipboard.writeText(shareLink);
  message.success('分享鏈接已複製到剪貼板');
  shareModalVisible.value = false;
};

// 返回列表
const handleBackToList = () => {
  router.push('/legal-platform/document-management/list');
};

// 組件掛載時獲取數據
onMounted(() => {
  // 這裡可以根據 fileId 獲取實際的文件數據
  console.log('Loading file detail for ID:', fileId);
});
</script>

<template>
  <Page>
    <!-- 頁面頭部 -->
    <Card class="mb-4">
      <div class="flex justify-between items-start">
        <div class="flex-1">
          <div class="flex items-center mb-2">
            <span :class="getFileIcon(fileDetail.fileType)" class="size-6 text-blue-500 mr-2" />
            <h2 class="text-xl font-semibold">{{ fileDetail.fileName }}</h2>
            <Tag 
              :color="getStatusTag(fileDetail.fileStatus).color" 
              class="ml-2"
            >
              {{ getStatusTag(fileDetail.fileStatus).text }}
            </Tag>
          </div>
          <div class="text-gray-500 space-x-4">
            <span>文件ID: {{ fileDetail.id }}</span>
            <span>大小: {{ fileDetail.fileSize }}</span>
            <span>版本: {{ fileDetail.fileVersion }}</span>
            <span>上傳者: {{ fileDetail.uploader }}</span>
            <span>上傳時間: {{ fileDetail.uploadTime }}</span>
          </div>
        </div>
        
        <Space>
          <Button @click="handleBackToList">
            <template #icon>
              <span class="icon-[lucide--arrow-left] size-4" />
            </template>
            {{ $t('page.legalPlatform.back') }}
          </Button>
          
          <Button 
            v-if="fileDetail.permissions.canView" 
            type="primary" 
            @click="handlePreview"
          >
            <template #icon>
              <span class="icon-[lucide--eye] size-4" />
            </template>
            {{ $t('page.legalPlatform.preview') }}
          </Button>
          
          <Button 
            v-if="fileDetail.permissions.canDownload" 
            @click="handleDownload"
          >
            <template #icon>
              <span class="icon-[lucide--download] size-4" />
            </template>
            {{ $t('page.legalPlatform.download') }}
          </Button>
          
          <Button 
            v-if="fileDetail.permissions.canPrint" 
            @click="handlePrint"
          >
            <template #icon>
              <span class="icon-[lucide--printer] size-4" />
            </template>
            {{ $t('page.legalPlatform.print') }}
          </Button>
          
          <Button 
            v-if="fileDetail.permissions.canEdit" 
            @click="handleEdit"
          >
            <template #icon>
              <span class="icon-[lucide--edit] size-4" />
            </template>
            {{ $t('page.legalPlatform.edit') }}
          </Button>
          
          <Button 
            v-if="fileDetail.permissions.canShare" 
            @click="handleShare"
          >
            <template #icon>
              <span class="icon-[lucide--share] size-4" />
            </template>
            {{ $t('page.legalPlatform.share') }}
          </Button>
          
          <Popconfirm
            v-if="fileDetail.permissions.canDelete"
            title="確定要刪除這個文件嗎？"
            ok-text="確定"
            cancel-text="取消"
            @confirm="handleDelete"
          >
            <Button danger>
              <template #icon>
                <span class="icon-[lucide--trash] size-4" />
              </template>
              {{ $t('page.legalPlatform.delete') }}
            </Button>
          </Popconfirm>
        </Space>
      </div>
    </Card>

    <!-- 文件統計 -->
    <Row :gutter="16" class="mb-4">
      <Col :span="6">
        <Card>
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-500">{{ fileStats.totalViews }}</div>
            <div class="text-gray-500">總瀏覽次數</div>
            <div class="text-sm text-green-500">今日 +{{ fileStats.todayViews }}</div>
          </div>
        </Card>
      </Col>
      <Col :span="6">
        <Card>
          <div class="text-center">
            <div class="text-2xl font-bold text-green-500">{{ fileStats.totalDownloads }}</div>
            <div class="text-gray-500">總下載次數</div>
            <div class="text-sm text-green-500">今日 +{{ fileStats.todayDownloads }}</div>
          </div>
        </Card>
      </Col>
      <Col :span="6">
        <Card>
          <div class="text-center">
            <div class="text-2xl font-bold text-orange-500">{{ fileStats.totalPrints }}</div>
            <div class="text-gray-500">總列印次數</div>
            <div class="text-sm text-gray-400">本週 {{ fileStats.weeklyViews }}</div>
          </div>
        </Card>
      </Col>
      <Col :span="6">
        <Card>
          <div class="text-center">
            <div class="text-2xl font-bold text-purple-500">{{ fileStats.totalShares }}</div>
            <div class="text-gray-500">總分享次數</div>
            <div class="text-sm text-gray-400">本週 {{ fileStats.weeklyDownloads }}</div>
          </div>
        </Card>
      </Col>
    </Row>

    <!-- 詳細信息標籤頁 -->
    <Card>
      <Tabs v-model:activeKey="activeTab">
        <!-- 基本信息 -->
        <TabPane key="info" tab="基本信息">
          <Row :gutter="24">
            <Col :span="16">
              <Descriptions title="文件信息" :column="2" bordered>
                <DescriptionsItem label="文件名稱">{{ fileDetail.fileName }}</DescriptionsItem>
                <DescriptionsItem label="原始名稱">{{ fileDetail.originalName }}</DescriptionsItem>
                <DescriptionsItem label="文件大小">{{ fileDetail.fileSize }}</DescriptionsItem>
                <DescriptionsItem label="文件類型">{{ fileDetail.fileType.toUpperCase() }}</DescriptionsItem>
                <DescriptionsItem label="MIME類型">{{ fileDetail.mimeType }}</DescriptionsItem>
                <DescriptionsItem label="文件版本">{{ fileDetail.fileVersion }}</DescriptionsItem>
                <DescriptionsItem label="文件來源">{{ fileDetail.fileSource }}</DescriptionsItem>
                <DescriptionsItem label="相關項目">{{ fileDetail.projectName }}</DescriptionsItem>
                <DescriptionsItem label="文件狀態">
                  <Tag :color="getStatusTag(fileDetail.fileStatus).color">
                    {{ getStatusTag(fileDetail.fileStatus).text }}
                  </Tag>
                </DescriptionsItem>
                <DescriptionsItem label="文件路徑">{{ fileDetail.filePath }}</DescriptionsItem>
                <DescriptionsItem label="上傳者">{{ fileDetail.uploader }}</DescriptionsItem>
                <DescriptionsItem label="上傳時間">{{ fileDetail.uploadTime }}</DescriptionsItem>
                <DescriptionsItem label="最後修改">{{ fileDetail.lastModified }}</DescriptionsItem>
                <DescriptionsItem label="修改者">{{ fileDetail.lastModifiedBy }}</DescriptionsItem>
                <DescriptionsItem label="標籤" :span="2">
                  <Space>
                    <Tag v-for="tag in fileDetail.tags" :key="tag" color="blue">{{ tag }}</Tag>
                  </Space>
                </DescriptionsItem>
                <DescriptionsItem label="文件描述" :span="2">
                  {{ fileDetail.description }}
                </DescriptionsItem>
              </Descriptions>
              
              <Divider>自定義屬性</Divider>
              
              <Descriptions :column="2" bordered>
                <DescriptionsItem label="所屬部門">{{ fileDetail.customAttributes.departmentName }}</DescriptionsItem>
                <DescriptionsItem label="文件分類">{{ fileDetail.customAttributes.categoryName }}</DescriptionsItem>
                <DescriptionsItem label="機密等級">{{ fileDetail.customAttributes.confidentialityName }}</DescriptionsItem>
                <DescriptionsItem label="審批人">{{ fileDetail.customAttributes.approver }}</DescriptionsItem>
                <DescriptionsItem label="審批時間">{{ fileDetail.customAttributes.approveTime }}</DescriptionsItem>
                <DescriptionsItem label="到期日期">{{ fileDetail.customAttributes.expiryDate }}</DescriptionsItem>
                <DescriptionsItem label="關鍵詞" :span="2">{{ fileDetail.customAttributes.keywords }}</DescriptionsItem>
              </Descriptions>
            </Col>
            
            <Col :span="8">
              <Card title="文件預覽" class="mb-4">
                <div class="text-center">
                  <Image
                    :src="fileDetail.thumbnailUrl"
                    :alt="fileDetail.fileName"
                    :width="200"
                    :height="250"
                    class="border rounded"
                    fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
                  />
                  <div class="mt-2">
                    <Button type="link" @click="handlePreview">
                      點擊預覽完整文件
                    </Button>
                  </div>
                </div>
              </Card>
              
              <Card title="權限信息">
                <div class="space-y-2">
                  <div class="flex justify-between">
                    <span>查看權限:</span>
                    <Badge :status="fileDetail.permissions.canView ? 'success' : 'error'" />
                  </div>
                  <div class="flex justify-between">
                    <span>下載權限:</span>
                    <Badge :status="fileDetail.permissions.canDownload ? 'success' : 'error'" />
                  </div>
                  <div class="flex justify-between">
                    <span>列印權限:</span>
                    <Badge :status="fileDetail.permissions.canPrint ? 'success' : 'error'" />
                  </div>
                  <div class="flex justify-between">
                    <span>編輯權限:</span>
                    <Badge :status="fileDetail.permissions.canEdit ? 'success' : 'error'" />
                  </div>
                  <div class="flex justify-between">
                    <span>刪除權限:</span>
                    <Badge :status="fileDetail.permissions.canDelete ? 'success' : 'error'" />
                  </div>
                  <div class="flex justify-between">
                    <span>分享權限:</span>
                    <Badge :status="fileDetail.permissions.canShare ? 'success' : 'error'" />
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </TabPane>

        <!-- 版本歷史 -->
        <TabPane key="versions" tab="版本歷史">
          <Table 
            :columns="versionColumns" 
            :data-source="versionHistory" 
            :pagination="false"
            row-key="version"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'version'">
                <div class="flex items-center">
                  <Tag v-if="record.isCurrent" color="green">當前</Tag>
                  <span class="ml-1">{{ record.version }}</span>
                </div>
              </template>
              
              <template v-if="column.key === 'action'">
                <Space>
                  <Button size="small" @click="handleVersionDownload(record)">
                    <template #icon>
                      <span class="icon-[lucide--download] size-3" />
                    </template>
                    下載
                  </Button>
                  <Button 
                    v-if="!record.isCurrent" 
                    size="small" 
                    @click="handleVersionRestore(record)"
                  >
                    <template #icon>
                      <span class="icon-[lucide--rotate-ccw] size-3" />
                    </template>
                    恢復
                  </Button>
                  <Button size="small" @click="handleVersionCompare(record)">
                    <template #icon>
                      <span class="icon-[lucide--git-compare] size-3" />
                    </template>
                    比較
                  </Button>
                </Space>
              </template>
            </template>
          </Table>
        </TabPane>

        <!-- 操作歷史 -->
        <TabPane key="history" tab="操作歷史">
          <Table 
            :columns="historyColumns" 
            :data-source="operationHistory" 
            :pagination="{ pageSize: 10 }"
            row-key="id"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'operationName'">
                <div class="flex items-center">
                  <span :class="getOperationIcon(record.operation)" class="size-4 mr-2" />
                  {{ record.operationName }}
                </div>
              </template>
            </template>
          </Table>
        </TabPane>

        <!-- 相關文件 -->
        <TabPane key="related" tab="相關文件">
          <Table 
            :columns="relatedColumns" 
            :data-source="relatedFiles" 
            :pagination="false"
            row-key="id"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'fileName'">
                <div class="flex items-center">
                  <span :class="getFileIcon(record.fileType)" class="size-4 mr-2 text-blue-500" />
                  <Button type="link" @click="handleRelatedFileView(record)">
                    {{ record.fileName }}
                  </Button>
                </div>
              </template>
              
              <template v-if="column.key === 'fileType'">
                <Tag>{{ record.fileType.toUpperCase() }}</Tag>
              </template>
              
              <template v-if="column.key === 'relation'">
                <Tag color="blue">{{ record.relation }}</Tag>
              </template>
              
              <template v-if="column.key === 'action'">
                <Space>
                  <Button size="small" @click="handleRelatedFileView(record)">
                    <template #icon>
                      <span class="icon-[lucide--eye] size-3" />
                    </template>
                    查看
                  </Button>
                </Space>
              </template>
            </template>
          </Table>
        </TabPane>
      </Tabs>
    </Card>

    <!-- 編輯模態框 -->
    <Modal
      v-model:open="editModalVisible"
      title="編輯文件信息"
      width="600px"
      @ok="handleSaveEdit"
    >
      <Form layout="vertical">
        <FormItem label="文件名稱">
          <Input v-model:value="editForm.fileName" />
        </FormItem>
        
        <FormItem label="文件描述">
          <Textarea v-model:value="editForm.description" :rows="3" />
        </FormItem>
        
        <FormItem label="標籤">
          <Select 
            v-model:value="editForm.tags" 
            mode="multiple" 
            placeholder="選擇標籤"
          >
            <SelectOption 
              v-for="option in tagOptions" 
              :key="option.value" 
              :value="option.value"
            >
              {{ option.label }}
            </SelectOption>
          </Select>
        </FormItem>
        
        <Row :gutter="16">
          <Col :span="8">
            <FormItem label="所屬部門">
              <Select v-model:value="editForm.customAttributes.department">
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
          <Col :span="8">
            <FormItem label="文件分類">
              <Select v-model:value="editForm.customAttributes.category">
                <SelectOption 
                  v-for="option in categoryOptions" 
                  :key="option.value" 
                  :value="option.value"
                >
                  {{ option.label }}
                </SelectOption>
              </Select>
            </FormItem>
          </Col>
          <Col :span="8">
            <FormItem label="機密等級">
              <Select v-model:value="editForm.customAttributes.confidentiality">
                <SelectOption 
                  v-for="option in confidentialityOptions" 
                  :key="option.value" 
                  :value="option.value"
                >
                  {{ option.label }}
                </SelectOption>
              </Select>
            </FormItem>
          </Col>
        </Row>
        
        <FormItem label="關鍵詞">
          <Input v-model:value="editForm.customAttributes.keywords" placeholder="用逗號分隔多個關鍵詞" />
        </FormItem>
      </Form>
    </Modal>

    <!-- 分享模態框 -->
    <Modal
      v-model:open="shareModalVisible"
      title="分享文件"
      width="500px"
      @ok="handleGenerateShareLink"
    >
      <Form layout="vertical">
        <FormItem label="分享方式">
          <Select v-model:value="shareForm.shareType">
            <SelectOption value="link">分享鏈接</SelectOption>
            <SelectOption value="email">郵件分享</SelectOption>
            <SelectOption value="qr">二維碼分享</SelectOption>
          </Select>
        </FormItem>
        
        <FormItem label="有效期">
          <Select v-model:value="shareForm.expiryDays">
            <SelectOption :value="1">1天</SelectOption>
            <SelectOption :value="7">7天</SelectOption>
            <SelectOption :value="30">30天</SelectOption>
            <SelectOption :value="0">永久有效</SelectOption>
          </Select>
        </FormItem>
        
        <FormItem label="訪問密碼">
          <Input v-model:value="shareForm.password" placeholder="可選，留空則無需密碼" />
        </FormItem>
        
        <FormItem label="權限設置">
          <div class="space-y-2">
            <label class="flex items-center">
              <input v-model="shareForm.allowDownload" type="checkbox" class="mr-2" />
              允許下載
            </label>
            <label class="flex items-center">
              <input v-model="shareForm.allowPrint" type="checkbox" class="mr-2" />
              允許列印
            </label>
          </div>
        </FormItem>
        
        <FormItem label="分享備註">
          <Textarea v-model:value="shareForm.note" :rows="2" placeholder="可選的分享說明" />
        </FormItem>
      </Form>
    </Modal>
  </Page>
</template>

<style scoped>
.ant-card {
  border-radius: 8px;
}

.ant-descriptions-item-label {
  font-weight: 500;
}
</style>