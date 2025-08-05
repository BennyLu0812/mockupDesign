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
}

// 選中的文件
const selectedFiles = ref<string[]>([]);

// 展開的文件夾
const expandedFolders = ref<Set<string>>(new Set());

// 重命名狀態
const renamingFile = ref<string | null>(null);
const newFileName = ref('');

// 模擬文件數據
const fileData = ref<FileItem[]>([
  {
    id: '1',
    name: '法律文件庫',
    type: 'folder',
    lastModified: '2024-01-20 14:30:00',
    lastModifiedBy: 'João Silva',
    children: [
      {
        id: '1-1',
        name: '法規條文',
        type: 'folder',
        lastModified: '2024-01-19 10:15:00',
        lastModifiedBy: 'Maria Santos',
        parentId: '1',
        children: [
          {
            id: '1-1-1',
            name: '基本法.pdf',
            type: 'file',
            size: '2.5 MB',
            lastModified: '2024-01-18 16:20:00',
            lastModifiedBy: 'Pedro Costa',
            parentId: '1-1',
          },
          {
            id: '1-1-2',
            name: '民法典.pdf',
            type: 'file',
            size: '5.8 MB',
            lastModified: '2024-01-17 09:45:00',
            lastModifiedBy: 'João Silva',
            parentId: '1-1',
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
        children: [
          {
            id: '1-2-1',
            name: '終審法院判例集.pdf',
            type: 'file',
            size: '12.3 MB',
            lastModified: '2024-01-15 14:20:00',
            lastModifiedBy: 'Pedro Costa',
            parentId: '1-2',
          },
        ],
      },
    ],
  },
  {
    id: '2',
    name: '合同範本',
    type: 'folder',
    lastModified: '2024-01-14 13:45:00',
    lastModifiedBy: 'João Silva',
    children: [
      {
        id: '2-1',
        name: '勞動合同範本.docx',
        type: 'file',
        size: '156 KB',
        lastModified: '2024-01-13 10:30:00',
        lastModifiedBy: 'Maria Santos',
        parentId: '2',
      },
      {
        id: '2-2',
        name: '租賃合同範本.docx',
        type: 'file',
        size: '203 KB',
        lastModified: '2024-01-12 15:15:00',
        lastModifiedBy: 'Pedro Costa',
        parentId: '2',
      },
    ],
  },
  {
    id: '3',
    name: '項目文件',
    type: 'file',
    size: '8.9 MB',
    lastModified: '2024-01-11 09:20:00',
    lastModifiedBy: 'João Silva',
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
    width: '40%',
  },
  {
    title: $t('page.legalPlatform.lastModifiedTime'),
    dataIndex: 'lastModified',
    key: 'lastModified',
    width: '20%',
  },
  {
    title: $t('page.legalPlatform.lastModifiedBy'),
    dataIndex: 'lastModifiedBy',
    key: 'lastModifiedBy',
    width: '15%',
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
            </Space>
          </template>
        </template>
      </Table>
    </Card>
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
</style>
