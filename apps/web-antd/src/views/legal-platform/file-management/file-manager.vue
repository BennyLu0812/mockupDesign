<script lang="ts" setup>
import { ref, reactive, computed } from 'vue';
import { Page } from '@vben/common-ui';
import { $t } from '#/locales';
import {
  Button,
  Card,
  Space,
  Table,
  Tag,
  Modal,
  message,
  Dropdown,
  Menu,
  MenuItem,
  Input,
  Tooltip,
  Drawer,
  Radio,
  RadioGroup,
  Select,
  SelectOption,
  Descriptions,
  DescriptionsItem,
} from 'ant-design-vue';

// 文件/文件夾數據接口
interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: string;
  lastModified: string;
  lastModifiedBy: string;
  parentId?: string;
  children?: FileItem[];
  expanded?: boolean;
  level?: number;
  tags?: string[];
}

// 選中的文件
const selectedFiles = ref<string[]>([]);

// 展開的文件夾
const expandedFolders = ref<Set<string>>(new Set());

// 重命名狀態
const renamingFile = ref<string | null>(null);
const newFileName = ref('');

// 分享功能相關狀態
const shareDrawerVisible = ref(false);
const currentShareFile = ref<FileItem | null>(null);
const shareLink = ref('');
const shareSettings = reactive({
  expiry: '7days',
  password: '',
  allowEdit: false,
  allowDownload: true,
});

// 分享抽屜標題
const shareDrawerTitle = computed(() => {
  return currentShareFile.value ? `分享 "${currentShareFile.value.name}"` : '分享文件';
});

// 模擬文件數據
const fileData = ref<FileItem[]>([
  {
    id: '1',
    name: '法律文件庫',
    type: 'folder',
    lastModified: '2024-01-20 14:30:00',
    lastModifiedBy: 'João Silva',
    tags: ['已公佈', '出街'],
    children: [
      {
        id: '1-1',
        name: '法規條文',
        type: 'folder',
        lastModified: '2024-01-19 10:15:00',
        lastModifiedBy: 'Maria Santos',
        parentId: '1',
        tags: ['已公佈'],
        children: [
          {
            id: '1-1-1',
            name: '基本法.pdf',
            type: 'file',
            size: '2.5 MB',
            lastModified: '2024-01-18 16:20:00',
            lastModifiedBy: 'Pedro Costa',
            parentId: '1-1',
            tags: ['已公佈', '出街'],
          },
          {
            id: '1-1-2',
            name: '民法典.pdf',
            type: 'file',
            size: '5.8 MB',
            lastModified: '2024-01-17 09:45:00',
            lastModifiedBy: 'João Silva',
            parentId: '1-1',
            tags: ['已公佈'],
          },
        ],
      },
      {
        id: '1-2',
        name: '判例文件',
        type: 'folder',
        lastModified: '2024-01-16 11:30:00',
        lastModifiedBy: 'Maria Santos',
        parentId: '1',
        tags: ['不出街'],
        children: [
          {
            id: '1-2-1',
            name: '終審法院判例集.pdf',
            type: 'file',
            size: '12.3 MB',
            lastModified: '2024-01-15 14:20:00',
            lastModifiedBy: 'Pedro Costa',
            parentId: '1-2',
            tags: ['不出街', '過度文件'],
          },
        ],
      },
    ],
  },
]);

// 扁平化文件列表用於表格顯示
const flattenedFiles = computed(() => {
  const result: (FileItem & { level: number })[] = [];
  
  const flatten = (items: FileItem[], level = 0, parentExpanded = true) => {
    items.forEach(item => {
      if (parentExpanded) {
        result.push({ ...item, level });
      }
      
      if (item.type === 'folder' && item.children && expandedFolders.value.has(item.id)) {
        flatten(item.children, level + 1, parentExpanded && expandedFolders.value.has(item.id));
      }
    });
  };
  
  flatten(fileData.value);
  return result;
});

// 表格列配置
const columns = [
  {
    title: $t('page.legalPlatform.fileName'),
    dataIndex: 'name',
    key: 'name',
    width: '30%',
  },
  {
    title: '標籤',
    dataIndex: 'tags',
    key: 'tags',
    width: '20%',
  },
  {
    title: $t('page.legalPlatform.lastModifiedTime'),
    dataIndex: 'lastModified',
    key: 'lastModified',
    width: '15%',
  },
  {
    title: $t('page.legalPlatform.lastModifiedBy'),
    dataIndex: 'lastModifiedBy',
    key: 'lastModifiedBy',
    width: '10%',
  },
  {
    title: $t('page.legalPlatform.fileSize'),
    dataIndex: 'size',
    key: 'size',
    width: '10%',
  },
  {
    title: $t('page.legalPlatform.action'),
    key: 'action',
    width: '15%',
  },
];

// 切換文件夾展開/收起
const toggleFolder = (folderId: string) => {
  if (expandedFolders.value.has(folderId)) {
    expandedFolders.value.delete(folderId);
  } else {
    expandedFolders.value.add(folderId);
  }
};

// 為標籤分配顏色
const getTagColor = (tag: string) => {
  const colorMap: Record<string, string> = {
    '出街': 'green',
    '不出街': 'red',
    '已公佈': 'blue',
    '過度文件': 'orange'
  };
  return colorMap[tag] || 'default';
};

// 文件選擇
const onSelectChange = (selectedRowKeys: string[]) => {
  selectedFiles.value = selectedRowKeys;
};

// 上傳文件
const handleUploadFile = () => {
  message.info($t('page.legalPlatform.uploadFile'));
};

// 上傳文件夾
const handleUploadFolder = () => {
  message.info($t('page.legalPlatform.uploadFolder'));
};

// 新建文件夾
const handleNewFolder = () => {
  message.info($t('page.legalPlatform.newFolder'));
};

// 下載
const handleDownload = () => {
  if (selectedFiles.value.length === 0) {
    message.warning('請選擇要下載的文件');
    return;
  }
  message.success(`下載 ${selectedFiles.value.length} 個文件`);
};


// 共享
const handleShare = () => {
  if (selectedFiles.value.length === 0) {
    message.warning('請選擇要共享的文件');
    return;
  }
  
  // 獲取第一個選中的文件
  const firstSelectedId = selectedFiles.value[0];
  const findFileById = (files: FileItem[], id: string): FileItem | null => {
    for (const file of files) {
      if (file.id === id) return file;
      if (file.children) {
        const found = findFileById(file.children, id);
        if (found) return found;
      }
    }
    return null;
  };
  
  currentShareFile.value = findFileById(fileData.value, firstSelectedId);
  shareDrawerVisible.value = true;
  
  // 重置分享設置
  Object.assign(shareSettings, {
    expiry: '7days',
    password: '',
    allowEdit: false,
    allowDownload: true,
  });
  shareLink.value = '';
};

// 生成分享鏈接
const generateShareLink = () => {
  if (!currentShareFile.value) return;
  
  const baseUrl = window.location.origin;
  const fileId = currentShareFile.value.id;
  const token = Math.random().toString(36).substring(2, 15);
  
  shareLink.value = `${baseUrl}/share/${fileId}?token=${token}&expires=${shareSettings.expiry}`;
  message.success('分享鏈接已生成');
};

// 複製分享鏈接
const copyShareLink = async () => {
  if (!shareLink.value) {
    message.warning('請先生成分享鏈接');
    return;
  }
  
  try {
    await navigator.clipboard.writeText(shareLink.value);
    message.success('分享鏈接已複製到剪貼板');
  } catch (error) {
    message.error('複製失敗，請手動複製');
  }
};

// 取消分享
const handleShareCancel = () => {
  shareDrawerVisible.value = false;
  currentShareFile.value = null;
  shareLink.value = '';
};

// 移動到
const handleMoveTo = () => {
  if (selectedFiles.value.length === 0) {
    message.warning('請選擇要移動的文件');
    return;
  }
  message.info($t('page.legalPlatform.moveTo'));
};

// 刪除
const handleDelete = () => {
  if (selectedFiles.value.length === 0) {
    message.warning('請選擇要刪除的文件');
    return;
  }
  Modal.confirm({
    title: '確認刪除',
    content: `確定要刪除選中的 ${selectedFiles.value.length} 個文件嗎？`,
    onOk() {
      message.success(`已刪除 ${selectedFiles.value.length} 個文件`);
      selectedFiles.value = [];
    },
  });
};

// 單個文件下載
const handleSingleDownload = (file: FileItem) => {
  message.success(`下載文件: ${file.name}`);
};

// 開始重命名
const startRename = (file: FileItem) => {
  renamingFile.value = file.id;
  newFileName.value = file.name;
};

// 確認重命名
const confirmRename = (file: FileItem) => {
  if (newFileName.value.trim()) {
    message.success(`文件 "${file.name}" 已重命名為 "${newFileName.value}"`);
    // 這裡應該更新實際數據
    renamingFile.value = null;
    newFileName.value = '';
  }
};

// 取消重命名
const cancelRename = () => {
  renamingFile.value = null;
  newFileName.value = '';
};

// 單個文件刪除
const handleSingleDelete = (file: FileItem) => {
  Modal.confirm({
    title: '確認刪除',
    content: `確定要刪除 "${file.name}" 嗎？`,
    onOk() {
      message.success(`已刪除文件: ${file.name}`);
    },
  });
};

// 預覽文件
const handlePreview = (file: FileItem) => {
  message.info(`預覽文件: ${file.name}`);
};

// 版本歷史抽屜相關
const versionDrawerVisible = ref(false);
const currentFileVersions = ref(null);

// 文件庫信息
const libraryInfo = ref({
  id: 1,
  name: '法律條文資料庫',
  description: '存放各類法律條文和相關文件',
  type: '部門文件庫',
  department: '法制研究及立法統籌廳',
  owner: 'António Silva',
  status: '啟用',
  fileCount: 156,
  folderCount: 12,
  totalSize: '1.2 GB',
  usedSize: '0.8 GB',
  createTime: '2024-01-15 10:30:00',
  updateTime: '2024-01-20 14:25:00',
  tags: ['法律', '文件', '重要'],
  customFields: [
    {
      name: 'priority',
      displayName: '優先級',
      value: '高',
    },
    {
      name: 'category',
      displayName: '分類',
      value: '法律文件',
    },
  ],
});

// 查看版本
const handleViewVersions = (file: FileItem) => {
  // 模擬版本數據
  currentFileVersions.value = {
    id: file.id,
    name: file.name,
    type: file.type,
    size: file.size,
    lastModified: file.lastModified,
    versions: [
      {
        id: '1',
        version: '3.0',
        name: file.name,
        size: file.size,
        uploadTime: file.lastModified,
        uploader: 'António Silva',
        isCurrent: true,
        remark: '最新版本，修復了格式問題',
        changes: '修正了文檔格式，更新了部分內容'
      },
      {
        id: '2',
        version: '2.1',
        name: file.name,
        size: '1.8MB',
        uploadTime: '2024-01-15 14:30:00',
        uploader: 'João Ferreira',
        isCurrent: false,
        remark: '修復了內容錯誤',
        changes: '修正了第三章節的內容錯誤'
      },
      {
        id: '3',
        version: '2.0',
        name: file.name,
        size: '1.7MB',
        uploadTime: '2024-01-10 09:15:00',
        uploader: 'Ana Ferreira',
        isCurrent: false,
        remark: '重大更新',
        changes: '重新組織了文檔結構，添加了新的章節'
      },
      {
        id: '4',
        version: '1.0',
        name: file.name,
        size: '1.5MB',
        uploadTime: '2024-01-05 16:20:00',
        uploader: 'António Silva',
        isCurrent: false,
        remark: '初始版本',
        changes: '創建了文檔的初始版本'
      }
    ]
  };
  versionDrawerVisible.value = true;
};

// 關閉版本歷史抽屜
const closeVersionDrawer = () => {
  versionDrawerVisible.value = false;
  currentFileVersions.value = null;
};

// 版本操作方法
const handlePreviewVersion = (version) => {
  message.info(`預覽版本 ${version.version}: ${version.name}`);
};

const handleViewVersion = (version) => {
  message.info(`查看版本 ${version.version}: ${version.name}`);
};

const handleRestoreVersion = (version) => {
  message.success(`已恢復到版本 ${version.version}`);
  // 更新當前版本狀態
  if (currentFileVersions.value) {
    currentFileVersions.value.versions.forEach(v => {
      v.isCurrent = v.id === version.id;
    });
  }
};

const handleDownloadVersion = (version) => {
  message.success(`下載版本 ${version.version}: ${version.name}`);
};

// 獲取文件類型顏色
const getFileTypeColor = (fileType: string) => {
  const colorMap: Record<string, string> = {
    folder: 'blue',
    pdf: 'red',
    doc: 'blue',
    docx: 'blue',
    xls: 'green',
    xlsx: 'green',
    ppt: 'orange',
    pptx: 'orange',
    txt: 'gray',
  };
  return colorMap[fileType] || 'default';
};

// 行選擇配置
const rowSelection = {
  selectedRowKeys: selectedFiles,
  onChange: onSelectChange,
  getCheckboxProps: (record: FileItem) => ({
    name: record.name,
  }),
};
</script>

<template>
  <Page>
    <!-- 文件庫信息區域 -->
    <Card title="文件庫信息" class="mb-4">
      <div class="flex justify-between items-start">
        <div class="flex-1">
          <Descriptions :column="4" size="small">
            <DescriptionsItem :label="$t('page.legalPlatform.fileLibraryName')">
              <span class="font-medium text-lg">{{ libraryInfo.name }}</span>
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
            <DescriptionsItem label="描述">
              {{ libraryInfo.description }}
            </DescriptionsItem>
            <DescriptionsItem label="標籤">
              <div class="flex flex-wrap gap-1">
                <Tag v-for="tag in libraryInfo.tags" :key="tag" color="blue">
                  {{ tag }}
                </Tag>
              </div>
            </DescriptionsItem>
          </Descriptions>
          

        </div>
      </div>
    </Card>
    
    <!-- 文件管理區域 -->
    <Card>
      <!-- 頂部操作欄 -->
      <div class="mb-4">
        <Space wrap>
          <Button type="primary" @click="handleUploadFile">
            <template #icon>
              <span class="icon-[lucide--upload] size-4" />
            </template>
            {{ $t('page.legalPlatform.uploadFile') }}
          </Button>
          
          <Button @click="handleUploadFolder">
            <template #icon>
              <span class="icon-[lucide--folder-up] size-4" />
            </template>
            {{ $t('page.legalPlatform.uploadFolder') }}
          </Button>
          
          <Button @click="handleNewFolder">
            <template #icon>
              <span class="icon-[lucide--folder-plus] size-4" />
            </template>
            {{ $t('page.legalPlatform.newFolder') }}
          </Button>
          
          <Button 
            :disabled="selectedFiles.length === 0" 
            @click="handleDownload"
          >
            <template #icon>
              <span class="icon-[lucide--download] size-4" />
            </template>
            {{ $t('page.legalPlatform.download') }}
          </Button>
          
          <Button 
            :disabled="selectedFiles.length === 0" 
            @click="handleShare"
          >
            <template #icon>
              <span class="icon-[lucide--share-2] size-4" />
            </template>
            {{ $t('page.legalPlatform.share') }}
          </Button>

          <Button 
            :disabled="selectedFiles.length === 0" 
            @click="handleMoveTo"
          >
            <template #icon>
              <span class="icon-[lucide--move] size-4" />
            </template>
            {{ $t('page.legalPlatform.moveTo') }}
          </Button>
          
          <Button 
            danger 
            :disabled="selectedFiles.length === 0" 
            @click="handleDelete"
          >
            <template #icon>
              <span class="icon-[lucide--trash-2] size-4" />
            </template>
            {{ $t('page.legalPlatform.delete') }}
          </Button>
        </Space>
      </div>
      
      <!-- 文件列表表格 -->
      <Table
        :columns="columns"
        :data-source="flattenedFiles"
        :row-selection="rowSelection"
        :pagination="false"
        row-key="id"
        size="middle"
      >
        <!-- 文件名列 -->
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'name'">
            <div 
              class="flex items-center"
              :style="{ paddingLeft: `${record.level * 20}px` }"
            >
              <!-- 文件夾展開/收起圖標 -->
              <template v-if="record.type === 'folder'">
                <Button
                  type="text"
                  size="small"
                  class="mr-1 p-0 w-4 h-4"
                  @click="toggleFolder(record.id)"
                >
                  <span 
                    v-if="expandedFolders.has(record.id)"
                    class="icon-[lucide--chevron-down] size-3"
                  />
                  <span 
                    v-else
                    class="icon-[lucide--chevron-right] size-3"
                  />
                </Button>
              </template>
              <template v-else>
                <div class="w-4 mr-1"></div>
              </template>
              
              <!-- 文件/文件夾圖標 -->
              <span 
                v-if="record.type === 'folder'"
                class="icon-[lucide--folder] size-4 mr-2 text-blue-500"
              />
              <span 
                v-else
                class="icon-[lucide--file-text] size-4 mr-2 text-gray-500"
              />
              
              <!-- 文件名 -->
              <template v-if="renamingFile === record.id">
                <Input
                  v-model:value="newFileName"
                  size="small"
                  class="w-48"
                  @press-enter="confirmRename(record)"
                  @blur="cancelRename"
                  @keyup.esc="cancelRename"
                />
              </template>
              <template v-else>
                <span class="cursor-pointer hover:text-blue-500">
                  {{ record.name }}
                </span>
              </template>
            </div>
          </template>
          
          <!-- 標籤列 -->
          <template v-else-if="column.key === 'tags'">
            <Space v-if="record.tags && record.tags.length > 0" wrap>
              <Tag 
                v-for="tag in record.tags" 
                :key="tag"
                :color="getTagColor(tag)"
                class="mb-1"
              >
                {{ tag }}
              </Tag>
            </Space>
            <span v-else class="text-gray-400">--</span>
          </template>
          
          <!-- 文件大小列 -->
          <template v-else-if="column.key === 'size'">
            <span v-if="record.type === 'file'">{{ record.size }}</span>
            <span v-else class="text-gray-400">--</span>
          </template>
          
          <!-- 操作列 -->
          <template v-else-if="column.key === 'action'">
            <Space>
              <Button 
                type="text" 
                size="small"
                @click="handleSingleDownload(record)"
              >
                {{ $t('page.legalPlatform.download') }}
              </Button>
              
              <Button 
                type="text" 
                size="small"
                @click="startRename(record)"
              >
                {{ $t('page.legalPlatform.rename') }}
              </Button>
              
              <Button 
                v-if="record.type === 'file'"
                type="text" 
                size="small"
                @click="handlePreview(record)"
              >
                {{ $t('page.legalPlatform.preview') }}
              </Button>
              
              <Button 
                type="text" 
                size="small"
                danger
                @click="handleSingleDelete(record)"
              >
                {{ $t('page.legalPlatform.delete') }}
              </Button>
              
              <Dropdown v-if="record.type === 'file'">
                <template #overlay>
                  <Menu>
                    <MenuItem 
                      key="viewVersions"
                      @click="handleViewVersions(record)"
                    >
                      {{ $t('page.legalPlatform.viewVersions') }}
                    </MenuItem>
                  </Menu>
                </template>
                <Button type="text" size="small">
                  更多
                  <span class="icon-[lucide--chevron-down] size-3 ml-1" />
                </Button>
              </Dropdown>
            </Space>
          </template>
        </template>
      </Table>
    </Card>

    <!-- 版本歷史抽屜 -->
    <Drawer
      v-model:open="versionDrawerVisible"
      :title="currentFileVersions ? `${currentFileVersions.name} - 版本歷史` : '版本歷史'"
      :width="800"
      placement="right"
      @close="closeVersionDrawer"
    >
      <div v-if="currentFileVersions" class="version-drawer-content">
        <!-- 文件信息 -->
        <div class="file-info-section">
          <h4>文件信息</h4>
          <div class="file-info">
            <div class="info-item">
              <span class="label">文件名稱：</span>
              <span class="value">{{ currentFileVersions.name }}</span>
            </div>
            <div class="info-item">
              <span class="label">文件類型：</span>
              <span class="value">{{ currentFileVersions.type === 'folder' ? '文件夾' : '文件' }}</span>
            </div>
            <div v-if="currentFileVersions.size" class="info-item">
              <span class="label">當前大小：</span>
              <span class="value">{{ currentFileVersions.size }}</span>
            </div>
            <div class="info-item">
              <span class="label">最後修改：</span>
              <span class="value">{{ currentFileVersions.lastModified }}</span>
            </div>
          </div>
        </div>

        <!-- 版本列表 -->
        <div class="versions-section">
          <h4>版本歷史</h4>
          <div class="versions-list">
            <div 
              v-for="version in currentFileVersions.versions" 
              :key="version.id"
              class="version-item"
              :class="{ 'current-version': version.isCurrent }"
            >
              <div class="version-header">
                <div class="version-info">
                  <div class="version-title">
                    <span class="version-number">版本 {{ version.version }}</span>
                    <Tag v-if="version.isCurrent" color="green">當前版本</Tag>
                  </div>
                  <div class="version-meta">
                    <span class="upload-time">{{ version.uploadTime }}</span>
                    <span class="uploader">由 {{ version.uploader }} 上傳</span>
                    <span class="file-size">{{ version.size }}</span>
                  </div>
                </div>
                <div class="version-actions">
                  <Space>
                    <Button 
                      size="small" 
                      @click="handlePreviewVersion(version)"
                    >
                      預覽
                    </Button>
                    <Button 
                      size="small" 
                      @click="handleViewVersion(version)"
                    >
                      查看
                    </Button>
                    <Button 
                      size="small" 
                      @click="handleDownloadVersion(version)"
                    >
                      下載
                    </Button>
                    <Button 
                      v-if="!version.isCurrent"
                      size="small" 
                      type="primary"
                      @click="handleRestoreVersion(version)"
                    >
                      恢復此版本
                    </Button>
                  </Space>
                </div>
              </div>
              
              <div v-if="version.remark" class="version-remark">
                 <strong>備註：</strong>{{ version.remark }}
               </div>
            </div>
          </div>
        </div>
      </div>
    </Drawer>

    <!-- 分享抽屜 -->
    <Drawer
      v-model:open="shareDrawerVisible"
      :title="shareDrawerTitle"
      :width="500"
      placement="right"
      @close="handleShareCancel"
    >
      <div class="share-drawer-content">
        <!-- 文件信息 -->
        <div v-if="currentShareFile" class="file-info-section">
          <h4>文件信息</h4>
          <div class="file-info">
            <div class="info-item">
              <span class="label">文件名稱：</span>
              <span class="value">{{ currentShareFile.name }}</span>
            </div>
            <div class="info-item">
              <span class="label">文件類型：</span>
              <span class="value">{{ currentShareFile.type === 'folder' ? '文件夾' : '文件' }}</span>
            </div>
            <div v-if="currentShareFile.size" class="info-item">
              <span class="label">文件大小：</span>
              <span class="value">{{ currentShareFile.size }}</span>
            </div>
            <div class="info-item">
              <span class="label">最後修改：</span>
              <span class="value">{{ currentShareFile.lastModified }}</span>
            </div>
          </div>
        </div>

        <!-- 分享設置 -->
        <div class="share-settings-section">
          <h4>分享設置</h4>
          
          <div class="setting-item">
            <label>有效期：</label>
            <Select v-model:value="shareSettings.expiry" style="width: 200px">
              <SelectOption value="1day">1天</SelectOption>
              <SelectOption value="7days">7天</SelectOption>
              <SelectOption value="30days">30天</SelectOption>
              <SelectOption value="never">永不過期</SelectOption>
            </Select>
          </div>

          <div class="setting-item">
            <label>訪問密碼：</label>
            <Input
              v-model:value="shareSettings.password"
              placeholder="可選，留空則無需密碼"
              style="width: 200px"
            />
          </div>

          <div class="setting-item">
            <label>權限設置：</label>
            <div class="permission-options">
              <div>
                <input
                  id="allowDownload"
                  v-model="shareSettings.allowDownload"
                  type="checkbox"
                />
                <label for="allowDownload">允許下載</label>
              </div>
              <div>
                <input
                  id="allowEdit"
                  v-model="shareSettings.allowEdit"
                  type="checkbox"
                />
                <label for="allowEdit">允許在線編輯</label>
              </div>
            </div>
          </div>
        </div>

        <!-- 分享鏈接 -->
        <div class="share-link-section">
          <h4>分享鏈接</h4>
          <div class="link-actions">
            <Button type="primary" @click="generateShareLink">
              生成分享鏈接
            </Button>
          </div>
          
          <div v-if="shareLink" class="link-display">
            <Input
              :value="shareLink"
              readonly
              class="link-input"
            />
            <Button @click="copyShareLink">
              複製鏈接
            </Button>
          </div>
        </div>

        <!-- 操作按鈕 -->
        <div class="drawer-actions">
          <Space>
            <Button @click="handleShareCancel">取消</Button>
            <Button type="primary" @click="handleShareCancel">完成</Button>
          </Space>
        </div>
      </div>
    </Drawer>
  </Page>
</template>

<style scoped>
.ant-table-tbody > tr:hover {
  background-color: #f5f5f5;
}

.ant-table-tbody > tr.ant-table-row-selected {
  background-color: #e6f7ff;
}

.ant-table-tbody > tr.ant-table-row-selected:hover {
  background-color: #bae7ff;
}

/* 分享抽屜樣式 */
.share-drawer-content {
  padding: 0;
}

.file-info-section,
.share-settings-section,
.share-link-section {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.file-info-section:last-child,
.share-settings-section:last-child,
.share-link-section:last-child {
  border-bottom: none;
}

.file-info-section h4,
.share-settings-section h4,
.share-link-section h4 {
  margin-bottom: 12px;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.file-info .info-item {
  display: flex;
  margin-bottom: 8px;
}

.file-info .label {
  width: 80px;
  color: #8c8c8c;
  font-size: 14px;
}

.file-info .value {
  flex: 1;
  color: #262626;
  font-size: 14px;
}

.setting-item {
  margin-bottom: 16px;
}

.setting-item label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #262626;
}

.permission-options {
  margin-top: 8px;
}

.permission-options > div {
  margin-bottom: 8px;
}

.permission-options input[type="checkbox"] {
  margin-right: 8px;
}

.permission-options label {
  margin-bottom: 0;
  font-weight: normal;
  cursor: pointer;
}

.link-actions {
  margin-bottom: 16px;
}

.link-display {
  display: flex;
  gap: 8px;
  align-items: center;
}

.link-input {
  flex: 1;
}

.drawer-actions {
  margin-top: 32px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
  text-align: right;
}

/* 版本歷史抽屜樣式 */
.version-drawer-content {
  padding: 0;
}

.versions-section {
  margin-bottom: 24px;
}

.versions-section h4 {
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.versions-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.version-item {
  padding: 16px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  background-color: #fafafa;
  transition: all 0.3s ease;
}

.version-item:hover {
  border-color: #d9d9d9;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.version-item.current-version {
  border-color: #52c41a;
  background-color: #f6ffed;
}

.version-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.version-info {
  flex: 1;
}

.version-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.version-number {
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.version-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 14px;
  color: #8c8c8c;
}

.version-meta span {
  display: block;
}

.version-actions {
  flex-shrink: 0;
}

.version-remark {
   margin-bottom: 8px;
   font-size: 14px;
   line-height: 1.5;
 }
 
 .version-remark strong {
   color: #262626;
   margin-right: 8px;
 }


</style>
