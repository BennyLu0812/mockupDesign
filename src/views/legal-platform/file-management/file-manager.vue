<template>
  <div class="file-manager-container">
    <!-- 頂部操作欄 -->
    <div class="toolbar mb-4">
      <Space>
        <Button type="primary" @click="handleUploadFile">
          <template #icon>
            <span class="icon-[lucide--upload] size-4" />
          </template>
          {{ $t('page.fileManager.uploadFile') }}
        </Button>
        <Button @click="handleUploadFolder">
          <template #icon>
            <span class="icon-[lucide--folder-plus] size-4" />
          </template>
          {{ $t('page.fileManager.uploadFolder') }}
        </Button>
        <Button @click="handleCreateFolder">
          <template #icon>
            <span class="icon-[lucide--folder-plus] size-4" />
          </template>
          {{ $t('page.fileManager.newFolder') }}
        </Button>
        <Button @click="handleDownload" :disabled="selectedItems.length === 0">
          <template #icon>
            <span class="icon-[lucide--download] size-4" />
          </template>
          {{ $t('page.fileManager.download') }}
        </Button>
        <Button @click="handleShare" :disabled="selectedItems.length === 0">
          <template #icon>
            <span class="icon-[lucide--share-2] size-4" />
          </template>
          {{ $t('page.fileManager.share') }}
        </Button>
        <Button @click="handleMove" :disabled="selectedItems.length === 0">
          <template #icon>
            <span class="icon-[lucide--move] size-4" />
          </template>
          {{ $t('page.fileManager.moveTo') }}
        </Button>
        <Button danger @click="handleDelete" :disabled="selectedItems.length === 0">
          <template #icon>
            <span class="icon-[lucide--trash-2] size-4" />
          </template>
          {{ $t('page.fileManager.delete') }}
        </Button>
      </Space>
    </div>

    <!-- 文件列表 -->
    <Table
      :columns="columns"
      :data-source="fileList"
      :row-selection="rowSelection"
      :pagination="false"
      :scroll="{ x: 800 }"
      row-key="id"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'name'">
          <div class="file-name-cell" :style="{ paddingLeft: `${record.level * 20}px` }">
            <span
              v-if="record.type === 'folder'"
              class="folder-toggle"
              @click="toggleFolder(record)"
            >
              <span
                :class="[
                  record.expanded ? 'icon-[lucide--chevron-down]' : 'icon-[lucide--chevron-right]',
                  'size-4 cursor-pointer'
                ]"
              />
            </span>
            <span
              :class="[
                record.type === 'folder' ? 'icon-[lucide--folder]' : getFileIcon(record.name),
                'size-4 mr-2'
              ]"
            />
            <span>{{ record.name }}</span>
          </div>
        </template>
        <template v-else-if="column.key === 'size'">
          {{ record.type === 'folder' ? '-' : formatFileSize(record.size) }}
        </template>
        <template v-else-if="column.key === 'action'">
          <Space>
            <Button size="small" @click="handleDownloadSingle(record)">
              <template #icon>
                <span class="icon-[lucide--download] size-3" />
              </template>
              {{ $t('page.fileManager.download') }}
            </Button>
            <Button size="small" @click="handleRename(record)">
              <template #icon>
                <span class="icon-[lucide--edit] size-3" />
              </template>
              {{ $t('page.fileManager.rename') }}
            </Button>
            <Button size="small" danger @click="handleDeleteSingle(record)">
              <template #icon>
                <span class="icon-[lucide--trash-2] size-3" />
              </template>
              {{ $t('page.fileManager.delete') }}
            </Button>
          </Space>
        </template>
      </template>
    </Table>

    <!-- 重命名對話框 -->
    <Modal
      v-model:open="renameModalVisible"
      :title="$t('page.fileManager.rename')"
      @ok="handleRenameConfirm"
      @cancel="handleRenameCancel"
    >
      <Form>
        <FormItem :label="$t('page.fileManager.fileName')">
          <Input v-model:value="newFileName" :placeholder="$t('page.fileManager.enterFileName')" />
        </FormItem>
      </Form>
    </Modal>

    <!-- 新建文件夾對話框 -->
    <Modal
      v-model:open="createFolderModalVisible"
      :title="$t('page.fileManager.newFolder')"
      @ok="handleCreateFolderConfirm"
      @cancel="handleCreateFolderCancel"
    >
      <Form>
        <FormItem :label="$t('page.fileManager.folderName')">
          <Input v-model:value="newFolderName" :placeholder="$t('page.fileManager.enterFolderName')" />
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from '@vben/locales';
import {
  Button,
  Form,
  FormItem,
  Input,
  Modal,
  Space,
  Table,
  message,
} from 'ant-design-vue';

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: number;
  lastModified: string;
  lastModifiedBy: string;
  level: number;
  parentId?: string;
  expanded?: boolean;
  visible?: boolean;
}

const { t } = useI18n();

// 響應式數據
const selectedItems = ref<string[]>([]);
const renameModalVisible = ref(false);
const createFolderModalVisible = ref(false);
const newFileName = ref('');
const newFolderName = ref('');
const currentRenameItem = ref<FileItem | null>(null);

// 模擬文件數據
const fileData = ref<FileItem[]>([
  {
    id: '1',
    name: '文檔資料',
    type: 'folder',
    lastModified: '2024-01-15 10:30',
    lastModifiedBy: '張三',
    level: 0,
    expanded: false,
    visible: true,
  },
  {
    id: '2',
    name: '法律條文.pdf',
    type: 'file',
    size: 2048576,
    lastModified: '2024-01-15 09:15',
    lastModifiedBy: '李四',
    level: 1,
    parentId: '1',
    visible: false,
  },
  {
    id: '3',
    name: '合同範本.docx',
    type: 'file',
    size: 1024000,
    lastModified: '2024-01-14 16:45',
    lastModifiedBy: '王五',
    level: 1,
    parentId: '1',
    visible: false,
  },
  {
    id: '4',
    name: '圖片資源',
    type: 'folder',
    lastModified: '2024-01-13 14:20',
    lastModifiedBy: '趙六',
    level: 0,
    expanded: false,
    visible: true,
  },
  {
    id: '5',
    name: 'logo.png',
    type: 'file',
    size: 512000,
    lastModified: '2024-01-13 14:20',
    lastModifiedBy: '趙六',
    level: 1,
    parentId: '4',
    visible: false,
  },
  {
    id: '6',
    name: '報告.xlsx',
    type: 'file',
    size: 3072000,
    lastModified: '2024-01-12 11:30',
    lastModifiedBy: '錢七',
    level: 0,
    visible: true,
  },
]);

// 計算可見的文件列表
const fileList = computed(() => {
  return fileData.value.filter(item => item.visible);
});

// 表格列配置
const columns = [
  {
    title: () => t('page.fileManager.fileName'),
    dataIndex: 'name',
    key: 'name',
    width: 300,
  },
  {
    title: () => t('page.fileManager.lastModified'),
    dataIndex: 'lastModified',
    key: 'lastModified',
    width: 180,
  },
  {
    title: () => t('page.fileManager.lastModifiedBy'),
    dataIndex: 'lastModifiedBy',
    key: 'lastModifiedBy',
    width: 120,
  },
  {
    title: () => t('page.fileManager.size'),
    dataIndex: 'size',
    key: 'size',
    width: 100,
  },
  {
    title: () => t('page.fileManager.action'),
    key: 'action',
    width: 200,
  },
];

// 行選擇配置
const rowSelection = {
  selectedRowKeys: selectedItems,
  onChange: (selectedRowKeys: string[]) => {
    selectedItems.value = selectedRowKeys;
  },
};

// 切換文件夾展開/折疊
const toggleFolder = (folder: FileItem) => {
  folder.expanded = !folder.expanded;
  const children = fileData.value.filter(item => item.parentId === folder.id);
  children.forEach(child => {
    child.visible = folder.expanded;
  });
};

// 獲取文件圖標
const getFileIcon = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'pdf':
      return 'icon-[lucide--file-text]';
    case 'doc':
    case 'docx':
      return 'icon-[lucide--file-text]';
    case 'xls':
    case 'xlsx':
      return 'icon-[lucide--file-spreadsheet]';
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
      return 'icon-[lucide--image]';
    default:
      return 'icon-[lucide--file]';
  }
};

// 格式化文件大小
const formatFileSize = (bytes?: number) => {
  if (!bytes) return '0 B';
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${Math.round(bytes / Math.pow(1024, i) * 100) / 100} ${sizes[i]}`;
};

// 事件處理函數
const handleUploadFile = () => {
  message.info(t('page.fileManager.uploadFileSuccess'));
};

const handleUploadFolder = () => {
  message.info(t('page.fileManager.uploadFolderSuccess'));
};

const handleCreateFolder = () => {
  createFolderModalVisible.value = true;
  newFolderName.value = '';
};

const handleDownload = () => {
  message.info(t('page.fileManager.downloadSuccess'));
};

const handleShare = () => {
  message.info(t('page.fileManager.shareSuccess'));
};

const handleMove = () => {
  message.info(t('page.fileManager.moveSuccess'));
};

const handleDelete = () => {
  Modal.confirm({
    title: t('page.fileManager.confirmDelete'),
    content: t('page.fileManager.confirmDeleteContent'),
    onOk() {
      message.success(t('page.fileManager.deleteSuccess'));
      selectedItems.value = [];
    },
  });
};

const handleDownloadSingle = (record: FileItem) => {
  message.info(`${t('page.fileManager.downloading')} ${record.name}`);
};

const handleRename = (record: FileItem) => {
  currentRenameItem.value = record;
  newFileName.value = record.name;
  renameModalVisible.value = true;
};

const handleDeleteSingle = (record: FileItem) => {
  Modal.confirm({
    title: t('page.fileManager.confirmDelete'),
    content: `${t('page.fileManager.confirmDeleteSingle')} "${record.name}"?`,
    onOk() {
      message.success(t('page.fileManager.deleteSuccess'));
    },
  });
};

const handleRenameConfirm = () => {
  if (currentRenameItem.value && newFileName.value.trim()) {
    currentRenameItem.value.name = newFileName.value.trim();
    message.success(t('page.fileManager.renameSuccess'));
    renameModalVisible.value = false;
  }
};

const handleRenameCancel = () => {
  renameModalVisible.value = false;
  newFileName.value = '';
  currentRenameItem.value = null;
};

const handleCreateFolderConfirm = () => {
  if (newFolderName.value.trim()) {
    const newFolder: FileItem = {
      id: Date.now().toString(),
      name: newFolderName.value.trim(),
      type: 'folder',
      lastModified: new Date().toLocaleString('zh-CN'),
      lastModifiedBy: '當前用戶',
      level: 0,
      expanded: false,
      visible: true,
    };
    fileData.value.push(newFolder);
    message.success(t('page.fileManager.createFolderSuccess'));
    createFolderModalVisible.value = false;
  }
};

const handleCreateFolderCancel = () => {
  createFolderModalVisible.value = false;
  newFolderName.value = '';
};
</script>

<style scoped>
.file-manager-container {
  padding: 16px;
}

.toolbar {
  background: #fafafa;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #d9d9d9;
}

.file-name-cell {
  display: flex;
  align-items: center;
}

.folder-toggle {
  margin-right: 8px;
  display: inline-flex;
  align-items: center;
}

:deep(.ant-table-tbody > tr > td) {
  padding: 8px 16px;
}

:deep(.ant-table-thead > tr > th) {
  background: #fafafa;
  font-weight: 600;
}
</style>