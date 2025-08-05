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

    <!-- 分享抽屜 -->
    <Drawer
      v-model:open="shareDrawerVisible"
      :title="shareDrawerTitle"
      :width="480"
      placement="right"
      @close="handleShareCancel"
    >
      <div class="share-content">
        <!-- 文件信息區域 -->
        <div class="file-info-section">
          <div class="file-info-header">分享文件</div>
          <div class="file-info-box">
            <div class="file-info-item">
              <span class="file-info-label">文件名：</span>
              <span class="file-info-value">{{ currentShareFile?.name }}</span>
            </div>
            <div class="file-info-item" v-if="currentShareFile?.size">
              <span class="file-info-label">大小：</span>
              <span class="file-info-value">{{ formatFileSize(currentShareFile.size) }}</span>
            </div>
          </div>
        </div>

        <!-- 分享設置區域 -->
        <div class="share-settings-section">
          <Form layout="vertical">
            <!-- 有效期設置 -->
            <FormItem label="有效期">
              <Select v-model:value="shareSettings.expiry" style="width: 100%">
                <SelectOption value="1">1 天</SelectOption>
                <SelectOption value="3">3 天</SelectOption>
                <SelectOption value="7">7 天</SelectOption>
                <SelectOption value="30">30 天</SelectOption>
                <SelectOption value="0">永久</SelectOption>
              </Select>
            </FormItem>

            <!-- 加密設置 -->
            <FormItem label="加密設置">
              <RadioGroup v-model:value="shareSettings.encryption">
                <Radio value="public">公開</Radio>
                <Radio value="encrypted">加密</Radio>
              </RadioGroup>
              <div v-if="shareSettings.encryption === 'encrypted'" class="mt-2">
                <Input
                  v-model:value="shareSettings.password"
                  type="password"
                  placeholder="請輸入訪問密碼"
                  :maxlength="20"
                />
              </div>
            </FormItem>

            <!-- 在線編輯權限 -->
            <FormItem label="在線編輯權限">
              <RadioGroup v-model:value="shareSettings.editPermission">
                <Radio value="none">不開放</Radio>
                <Radio value="open">開放</Radio>
              </RadioGroup>
              <div class="permission-note">
                仅开放给在人员信息中维护了手机号码的人员
              </div>
            </FormItem>
          </Form>
        </div>

        <!-- 生成的分享鏈接 -->
        <div v-if="shareLink" class="share-link-section">
          <div class="share-link-header">分享鏈接</div>
          <div class="share-link-box">
            <Input v-model:value="shareLink" readonly />
            <Button type="primary" @click="copyShareLink" class="ml-2">
              複製鏈接
            </Button>
          </div>
        </div>
      </div>

      <!-- 操作按鈕 -->
      <template #footer>
        <div class="drawer-footer">
          <Space>
            <Button @click="handleShareCancel">取消</Button>
            <Button v-if="!shareLink" type="primary" @click="generateShareLink">
              生成鏈接
            </Button>
            <Button v-if="shareLink" type="primary" @click="copyShareLink">
              複製訪問鏈接
            </Button>
          </Space>
        </div>
      </template>
    </Drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from '@vben/locales';
import {
  Button,
  Drawer,
  Form,
  FormItem,
  Input,
  Modal,
  Radio,
  RadioGroup,
  Select,
  SelectOption,
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

// 分享功能相關數據
const shareDrawerVisible = ref(false);
const currentShareFile = ref<FileItem | null>(null);
const shareLink = ref('');
const shareSettings = ref({
  expiry: '7', // 默認7天
  encryption: 'public', // 默認公開
  password: '',
  editPermission: 'none' // 默認不開放編輯
});

// 分享抽屜標題
const shareDrawerTitle = computed(() => {
  return currentShareFile.value ? `分享：${currentShareFile.value.name}` : '分享文件';
});

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
  if (selectedItems.value.length === 0) {
    message.warning('請選擇要分享的文件');
    return;
  }
  
  // 獲取第一個選中的文件
  const selectedFile = fileList.value.find(item => item.id === selectedItems.value[0]);
  if (selectedFile) {
    currentShareFile.value = selectedFile;
    shareDrawerVisible.value = true;
    // 重置分享設置
    shareSettings.value = {
      expiry: '7',
      encryption: 'public',
      password: '',
      editPermission: 'none'
    };
    shareLink.value = '';
  }
};

// 生成分享鏈接
const generateShareLink = () => {
  if (!currentShareFile.value) return;
  
  // 驗證加密設置
  if (shareSettings.value.encryption === 'encrypted' && !shareSettings.value.password.trim()) {
    message.warning('請輸入訪問密碼');
    return;
  }
  
  // 模擬生成分享鏈接
  const baseUrl = window.location.origin;
  const fileId = currentShareFile.value.id;
  const timestamp = Date.now();
  shareLink.value = `${baseUrl}/share/${fileId}?t=${timestamp}`;
  
  message.success('分享鏈接生成成功');
};

// 複製分享鏈接
const copyShareLink = async () => {
  if (!shareLink.value) return;
  
  try {
    await navigator.clipboard.writeText(shareLink.value);
    message.success('鏈接已複製到剪貼板');
  } catch (err) {
    // 降級方案
    const textArea = document.createElement('textarea');
    textArea.value = shareLink.value;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    message.success('鏈接已複製到剪貼板');
  }
};

// 取消分享
const handleShareCancel = () => {
  shareDrawerVisible.value = false;
  currentShareFile.value = null;
  shareLink.value = '';
  shareSettings.value = {
    expiry: '7',
    encryption: 'public',
    password: '',
    editPermission: 'none'
  };
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

/* 分享抽屜樣式 */
.share-content {
  padding: 0;
}

.file-info-section {
  margin-bottom: 24px;
}

.file-info-header {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #262626;
}

.file-info-box {
  background: #f5f5f5;
  border: 2px solid #ff4d4f;
  border-radius: 6px;
  padding: 16px;
}

.file-info-item {
  display: flex;
  margin-bottom: 8px;
}

.file-info-item:last-child {
  margin-bottom: 0;
}

.file-info-label {
  font-weight: 500;
  color: #595959;
  min-width: 60px;
}

.file-info-value {
  color: #262626;
  word-break: break-all;
}

.share-settings-section {
  margin-bottom: 24px;
}

.permission-note {
  font-size: 12px;
  color: #8c8c8c;
  margin-top: 8px;
  line-height: 1.4;
}

.share-link-section {
  margin-bottom: 24px;
}

.share-link-header {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #262626;
}

.share-link-box {
  display: flex;
  align-items: center;
}

.drawer-footer {
  text-align: right;
  border-top: 1px solid #f0f0f0;
  padding-top: 16px;
}

:deep(.ant-drawer-body) {
  padding: 24px;
}

:deep(.ant-drawer-footer) {
  padding: 16px 24px;
  border-top: 1px solid #f0f0f0;
}
</style>
