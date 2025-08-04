<script lang="ts" setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Page } from '@vben/common-ui';
import { $t } from '#/locales';
import {
  Button,
  Card,
  Col,
  Descriptions,
  DescriptionsItem,
  Input,
  Row,
  Select,
  SelectOption,
  Space,
  Table,
  Tag,
  Tree,
  Upload,
  Modal,
  Progress,
  Statistic,
  message,
  Breadcrumb,
  BreadcrumbItem,
} from 'ant-design-vue';

const router = useRouter();
const route = useRoute();

// 文件庫ID
const libraryId = computed(() => route.params.id);

// 文件庫信息
const libraryInfo = ref({
  id: 1,
  name: '法律條文資料庫',
  description: '存放各類法律條文和相關文件',
  type: '部門文件庫',
  department: '法務部',
  owner: '陳大文',
  status: '啟用',
  fileCount: 1250,
  folderCount: 45,
  totalSize: '2.5 GB',
  usedSize: '2.1 GB',
  createTime: '2024-01-15 10:30:00',
  updateTime: '2024-01-20 14:25:00',
  tags: ['法律', '條文', '重要'],
  permissions: {
    view: ['法務部', '秘書處'],
    edit: ['法務部'],
    delete: ['法務部'],
    upload: ['法務部'],
    download: ['法務部', '秘書處'],
  },
  quota: {
    storageLimit: 20, // GB
    fileCountLimit: 15000,
    singleFileLimit: 200, // MB
  },
  customFields: [
    {
      name: 'priority',
      displayName: '優先級',
      value: '高',
    },
    {
      name: 'category',
      displayName: '分類',
      value: '法律條文',
    },
  ],
});

// 當前路徑
const currentPath = ref('/');
const pathHistory = ref(['/']);

// 文件夾樹結構
const folderTree = ref([
  {
    title: '根目錄',
    key: '/',
    children: [
      {
        title: '法律條文',
        key: '/法律條文',
        children: [
          { title: '民法', key: '/法律條文/民法' },
          { title: '刑法', key: '/法律條文/刑法' },
          { title: '行政法', key: '/法律條文/行政法' },
        ],
      },
      {
        title: '法規解釋',
        key: '/法規解釋',
        children: [
          { title: '司法解釋', key: '/法規解釋/司法解釋' },
          { title: '行政解釋', key: '/法規解釋/行政解釋' },
        ],
      },
      {
        title: '案例分析',
        key: '/案例分析',
      },
      {
        title: '參考資料',
        key: '/參考資料',
      },
    ],
  },
]);

// 文件列表
const fileList = ref([
  {
    id: 1,
    name: '民法總則.pdf',
    type: 'file',
    size: '2.5 MB',
    modifyTime: '2024-01-20 14:25:00',
    creator: '陳大文',
    fileType: 'pdf',
    downloadCount: 125,
    tags: ['法律', '民法'],
  },
  {
    id: 2,
    name: '刑法條文',
    type: 'folder',
    size: '-',
    modifyTime: '2024-01-19 16:30:00',
    creator: '張三',
    fileType: 'folder',
    downloadCount: 0,
    tags: [],
  },
  {
    id: 3,
    name: '行政法規彙編.docx',
    type: 'file',
    size: '1.8 MB',
    modifyTime: '2024-01-18 11:15:00',
    creator: '李四',
    fileType: 'docx',
    downloadCount: 89,
    tags: ['行政法', '法規'],
  },
  {
    id: 4,
    name: '法律條文對照表.xlsx',
    type: 'file',
    size: '856 KB',
    modifyTime: '2024-01-17 09:45:00',
    creator: '王五',
    fileType: 'xlsx',
    downloadCount: 67,
    tags: ['對照表'],
  },
]);

// 表格列配置
const columns = [
  {
    title: '名稱',
    dataIndex: 'name',
    key: 'name',
    width: 300,
  },
  {
    title: '大小',
    dataIndex: 'size',
    key: 'size',
    width: 100,
  },
  {
    title: '修改時間',
    dataIndex: 'modifyTime',
    key: 'modifyTime',
    width: 180,
  },
  {
    title: '創建者',
    dataIndex: 'creator',
    key: 'creator',
    width: 100,
  },

  {
    title: '操作',
    key: 'operation',
    width: 200,
    fixed: 'right',
  },
];

// 搜索關鍵字
const searchKeyword = ref('');

// 視圖模式
const viewMode = ref<'list' | 'grid'>('list');

// 上傳文件模態框
const uploadModalVisible = ref(false);

// 新建文件夾模態框
const newFolderModalVisible = ref(false);
const newFolderName = ref('');

// 計算存儲使用率
const storageUsagePercent = computed(() => {
  const used = parseFloat(libraryInfo.value.usedSize.replace(' GB', ''));
  const total = libraryInfo.value.quota.storageLimit;
  return Math.round((used / total) * 100);
});

// 獲取文件圖標
const getFileIcon = (fileType: string) => {
  const iconMap: Record<string, string> = {
    pdf: 'icon-[lucide--file-text]',
    doc: 'icon-[lucide--file-text]',
    docx: 'icon-[lucide--file-text]',
    xls: 'icon-[lucide--file-spreadsheet]',
    xlsx: 'icon-[lucide--file-spreadsheet]',
    ppt: 'icon-[lucide--presentation]',
    pptx: 'icon-[lucide--presentation]',
    txt: 'icon-[lucide--file-text]',
    folder: 'icon-[lucide--folder]',
  };
  return iconMap[fileType] || 'icon-[lucide--file]';
};

// 獲取文件類型顏色
const getFileTypeColor = (fileType: string) => {
  const colorMap: Record<string, string> = {
    pdf: 'red',
    doc: 'blue',
    docx: 'blue',
    xls: 'green',
    xlsx: 'green',
    ppt: 'orange',
    pptx: 'orange',
    txt: 'default',
    folder: 'cyan',
  };
  return colorMap[fileType] || 'default';
};

// 文件夾樹選擇
const handleTreeSelect = (selectedKeys: string[]) => {
  if (selectedKeys.length > 0) {
    currentPath.value = selectedKeys[0];
    loadFileList();
  }
};

// 雙擊文件/文件夾
const handleDoubleClick = (record: any) => {
  if (record.type === 'folder') {
    const newPath = currentPath.value === '/' ? `/${record.name}` : `${currentPath.value}/${record.name}`;
    currentPath.value = newPath;
    pathHistory.value.push(newPath);
    loadFileList();
  } else {
    // 預覽文件
    handlePreview(record);
  }
};

// 返回上級目錄
const goBack = () => {
  if (pathHistory.value.length > 1) {
    pathHistory.value.pop();
    currentPath.value = pathHistory.value[pathHistory.value.length - 1];
    loadFileList();
  }
};

// 下載文件
const handleDownload = (record: any) => {
  console.log('下載文件:', record);
  message.success(`開始下載 ${record.name}`);
};

// 預覽文件
const handlePreview = (record: any) => {
  console.log('預覽文件:', record);
  message.info(`預覽 ${record.name}`);
};

// 刪除文件/文件夾
const handleDelete = (record: any) => {
  Modal.confirm({
    title: '確認刪除',
    content: `確定要刪除「${record.name}」嗎？此操作不可恢復。`,
    okText: '確定',
    cancelText: '取消',
    onOk() {
      message.success('刪除成功');
      loadFileList();
    },
  });
};

// 重命名
const handleRename = (record: any) => {
  Modal.confirm({
    title: '重命名',
    content: h => {
      const input = h(Input, {
        defaultValue: record.name,
        onPressEnter: (e: any) => {
          const newName = e.target.value;
          if (newName && newName !== record.name) {
            message.success(`重命名為 ${newName}`);
            loadFileList();
          }
        },
      });
      return input;
    },
    okText: '確定',
    cancelText: '取消',
  });
};

// 新建文件夾
const handleCreateFolder = () => {
  if (newFolderName.value) {
    console.log('新建文件夾:', newFolderName.value);
    message.success(`文件夾「${newFolderName.value}」創建成功`);
    newFolderName.value = '';
    newFolderModalVisible.value = false;
    loadFileList();
  }
};

// 上傳文件
const handleUpload = (info: any) => {
  console.log('上傳文件:', info);
  message.success('文件上傳成功');
  uploadModalVisible.value = false;
  loadFileList();
};

// 搜索文件
const handleSearch = () => {
  console.log('搜索:', searchKeyword.value);
  loadFileList();
};

// 加載文件列表
const loadFileList = () => {
  console.log('加載文件列表:', currentPath.value);
  // 這裡應該根據當前路徑調用API加載文件列表
};

// 編輯文件庫
const handleEdit = () => {
  router.push({
    path: '/legal-platform/file-management/library-create',
    query: { id: libraryId.value, mode: 'edit' },
  });
};

// 返回列表
const handleBack = () => {
  router.push('/legal-platform/file-management/library-list');
};

// 組件掛載時加載數據
onMounted(() => {
  console.log('加載文件庫詳情:', libraryId.value);
  loadFileList();
});
</script>

<template>
  <Page :description="libraryInfo.description" :title="libraryInfo.name">
    <!-- 操作按鈕 -->
    <Card class="mb-4">
      <Space>
        <Button @click="handleBack">
          <template #icon>
            <span class="icon-[lucide--arrow-left] size-4" />
          </template>
          返回列表
        </Button>
        <Button type="primary" @click="handleEdit">
          <template #icon>
            <span class="icon-[lucide--edit] size-4" />
          </template>
          編輯文件庫
        </Button>
        <Button @click="uploadModalVisible = true">
          <template #icon>
            <span class="icon-[lucide--upload] size-4" />
          </template>
          上傳文件
        </Button>
        <Button @click="newFolderModalVisible = true">
          <template #icon>
            <span class="icon-[lucide--folder-plus] size-4" />
          </template>
          新建文件夾
        </Button>
      </Space>
    </Card>

    <Row :gutter="16">
      <!-- 左側：文件庫信息和文件夾樹 -->
      <Col :span="6">
        <!-- 文件庫信息 -->
        <Card title="文件庫信息" class="mb-4">
          <Descriptions :column="1" size="small">
            <DescriptionsItem :label="$t('page.legalPlatform.fileLibraryType')">
              <Tag :color="getFileTypeColor('folder')">{{ libraryInfo.type }}</Tag>
            </DescriptionsItem>
            <DescriptionsItem :label="$t('page.legalPlatform.fileLibraryDepartment')">
              {{ libraryInfo.department }}
            </DescriptionsItem>
            <DescriptionsItem :label="$t('page.legalPlatform.fileLibraryOwner')">
              {{ libraryInfo.owner }}
            </DescriptionsItem>
            <DescriptionsItem :label="$t('page.legalPlatform.fileLibraryStatus')">
              <Tag :color="libraryInfo.status === '啟用' ? 'success' : 'default'">
                {{ libraryInfo.status }}
              </Tag>
            </DescriptionsItem>
            <DescriptionsItem :label="$t('page.legalPlatform.createTime')">
              {{ libraryInfo.createTime }}
            </DescriptionsItem>
          </Descriptions>
          
          <!-- 標籤 -->
          <div class="mt-3">
            <div class="text-sm text-gray-500 mb-1">標籤：</div>
            <div class="flex flex-wrap gap-1">
              <Tag v-for="tag in libraryInfo.tags" :key="tag" color="blue">
                {{ tag }}
              </Tag>
            </div>
          </div>
          
          <!-- 自定義字段 -->
          <div class="mt-3" v-if="libraryInfo.customFields.length > 0">
            <div class="text-sm text-gray-500 mb-1">自定義字段：</div>
            <div v-for="field in libraryInfo.customFields" :key="field.name" class="flex justify-between text-sm">
              <span>{{ field.displayName }}：</span>
              <span class="font-medium">{{ field.value }}</span>
            </div>
          </div>
        </Card>




      </Col>

      <!-- 右側：文件列表 -->
      <Col :span="18">
        <Card>
          <!-- 路徑導航和搜索 -->
          <div class="flex justify-between items-center mb-4">
            <div class="flex items-center gap-2">
              <Button v-if="currentPath !== '/'" size="small" @click="goBack">
                <template #icon>
                  <span class="icon-[lucide--arrow-left] size-4" />
                </template>
              </Button>
              <Breadcrumb>
                <BreadcrumbItem v-for="(path, index) in currentPath.split('/').filter(p => p)" :key="index">
                  {{ path || '根目錄' }}
                </BreadcrumbItem>
                <BreadcrumbItem v-if="currentPath === '/'">
                  根目錄
                </BreadcrumbItem>
              </Breadcrumb>
            </div>
            
            <div class="flex items-center gap-2">
              <Input.Search
                v-model:value="searchKeyword"
                placeholder="搜索文件或文件夾"
                style="width: 250px"
                @search="handleSearch"
              />

            </div>
          </div>

          <!-- 文件列表 -->
          <Table
            :columns="columns"
            :data-source="fileList"
            :pagination="false"
            row-key="id"
            @row-dblclick="handleDoubleClick"
          >
            <!-- 文件名 -->
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'name'">
                <div class="flex items-center gap-2">
                  <span :class="getFileIcon(record.fileType)" class="size-5" />
                  <div class="flex flex-col">
                    <span class="font-medium cursor-pointer hover:text-blue-600" @dblclick="handleDoubleClick(record)">
                      {{ record.name }}
                    </span>
                    <div class="flex flex-wrap gap-1 mt-1" v-if="record.tags.length > 0">
                      <Tag v-for="tag in record.tags" :key="tag" size="small" color="blue">
                        {{ tag }}
                      </Tag>
                    </div>
                  </div>
                </div>
              </template>

              <!-- 下載次數 -->
              <template v-else-if="column.key === 'downloadCount'">
                <span v-if="record.type === 'file'">{{ record.downloadCount }}</span>
                <span v-else>-</span>
              </template>

              <!-- 操作 -->
              <template v-else-if="column.key === 'operation'">
                <Space>
                  <Button v-if="record.type === 'file'" type="link" size="small" @click="handlePreview(record)">
                    <template #icon>
                      <span class="icon-[lucide--eye] size-4" />
                    </template>
                    預覽
                  </Button>
                  <Button v-if="record.type === 'file'" type="link" size="small" @click="handleDownload(record)">
                    <template #icon>
                      <span class="icon-[lucide--download] size-4" />
                    </template>
                    下載
                  </Button>
                  <Button type="link" size="small" @click="handleRename(record)">
                    <template #icon>
                      <span class="icon-[lucide--edit] size-4" />
                    </template>
                    重命名
                  </Button>
                  <Button type="link" size="small" danger @click="handleDelete(record)">
                    <template #icon>
                      <span class="icon-[lucide--trash-2] size-4" />
                    </template>
                    刪除
                  </Button>
                </Space>
              </template>
            </template>
          </Table>
        </Card>
      </Col>
    </Row>

    <!-- 上傳文件模態框 -->
    <Modal
      v-model:open="uploadModalVisible"
      title="上傳文件"
      @ok="uploadModalVisible = false"
    >
      <Upload.Dragger
        name="file"
        multiple
        action="/api/upload"
        @change="handleUpload"
      >
        <p class="ant-upload-drag-icon">
          <span class="icon-[lucide--upload] size-12 text-blue-500" />
        </p>
        <p class="ant-upload-text">點擊或拖拽文件到此區域上傳</p>
        <p class="ant-upload-hint">
          支持單個或批量上傳。嚴禁上傳公司數據或其他敏感文件。
        </p>
      </Upload.Dragger>
    </Modal>

    <!-- 新建文件夾模態框 -->
    <Modal
      v-model:open="newFolderModalVisible"
      title="新建文件夾"
      @ok="handleCreateFolder"
    >
      <Input
        v-model:value="newFolderName"
        placeholder="請輸入文件夾名稱"
        @press-enter="handleCreateFolder"
      />
    </Modal>
  </Page>
</template>

<style scoped>
.ant-table-tbody > tr {
  cursor: pointer;
}

.ant-table-tbody > tr:hover {
  background-color: #f5f5f5;
}

.ant-upload-drag-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}
</style>