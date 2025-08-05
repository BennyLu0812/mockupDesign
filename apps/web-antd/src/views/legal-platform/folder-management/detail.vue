<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Page } from '@vben/common-ui';
import { $t } from '#/locales';
import {
  Button,
  Card,
  Col,
  Descriptions,
  DescriptionsItem,
  Row,
  Space,
  Table,
  Tag,
  Tree,
  Input,
  Modal,
  Upload,
  Progress,
  Statistic,
  message,
  Dropdown,
  Menu,
  MenuItem,
} from 'ant-design-vue';

const router = useRouter();
const route = useRoute();

// 文件夾ID
const folderId = ref(route.params.id as string);

// 文件夾詳情數據
const folderDetail = ref({
  id: '1',
  folderName: '法律文件庫',
  folderDescription: '存放法律相關文件的文件夾',
  folderPath: '/legal-documents',
  folderType: 'public',
  department: '法務部',
  owner: 'João Silva',
    creator: 'João Silva',
  createTime: '2024-01-15 10:30:00',
  updateTime: '2024-01-20 14:20:00',
  tags: ['重要', '法律'],
  status: 'active',
  permissions: ['view', 'edit', 'upload', 'download'],
});



// 文件列表
const fileList = ref([
  {
    id: '1',
    fileName: '民法.pdf',
    fileType: 'pdf',
    fileSize: '2.1 MB',
    uploadTime: '2024-01-15 10:30:00',
    uploader: 'João Silva',
    status: 'normal',
  },
  {
    id: '2',
    fileName: '刑法.pdf',
    fileType: 'pdf',
    fileSize: '1.8 MB',
    uploadTime: '2024-01-16 14:20:00',
    uploader: 'Maria Santos',
    status: 'normal',
  },
  {
    id: '3',
    fileName: '最高法院判例.docx',
    fileType: 'docx',
    fileSize: '856 KB',
    uploadTime: '2024-01-17 09:15:00',
    uploader: 'Pedro Costa',
    status: 'normal',
  },
]);

// 搜索關鍵字
const searchKeyword = ref('');

// 文件表格列配置
const fileColumns = [
  {
    title: '文件名',
    dataIndex: 'fileName',
    key: 'fileName',
    width: 250,
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
    width: 100,
  },
  {
    title: '上傳時間',
    dataIndex: 'uploadTime',
    key: 'uploadTime',
    width: 180,
  },

  {
    title: '操作',
    key: 'action',
    width: 200,
    fixed: 'right',
  },
];

// 上傳文件配置
const uploadConfig = {
  name: 'file',
  multiple: true,
  action: '/api/upload',
  showUploadList: false,
};

// 返回列表
const handleBack = () => {
  router.push('/legal-platform/folder-management/list');
};

// 編輯文件夾
const handleEdit = () => {
  router.push(`/legal-platform/folder-management/create?id=${folderId.value}`);
};

// 權限管理
const handlePermission = () => {
  router.push(`/legal-platform/folder-management/permission?id=${folderId.value}`);
};



// 搜索文件
const handleSearch = () => {
  console.log('搜索關鍵字:', searchKeyword.value);
  // 這裡應該調用API搜索文件
  message.success('搜索完成');
};

// 上傳文件
const handleUpload = (info: any) => {
  console.log('上傳文件:', info);
  message.success('文件上傳成功');
};

// 新建文件夾
const handleCreateFolder = () => {
  Modal.confirm({
    title: '新建文件夾',
    content: '請輸入文件夾名稱',
    onOk() {
      message.success('文件夾創建成功');
    },
  });
};

// 下載文件
const handleDownload = (record: any) => {
  console.log('下載文件:', record.fileName);
  message.success('開始下載文件');
};

// 預覽文件
const handlePreview = (record: any) => {
  console.log('預覽文件:', record.fileName);
  message.info('打開文件預覽');
};

// 重命名文件
const handleRename = (record: any) => {
  Modal.confirm({
    title: '重命名文件',
    content: `請輸入新的文件名`,
    onOk() {
      message.success('文件重命名成功');
    },
  });
};

// 刪除文件
const handleDeleteFile = (record: any) => {
  Modal.confirm({
    title: '確認刪除',
    content: `確定要刪除文件「${record.fileName}」嗎？`,
    onOk() {
      message.success('文件刪除成功');
    },
  });
};

// 獲取文件類型圖標
const getFileIcon = (fileType: string) => {
  const iconMap: Record<string, string> = {
    pdf: 'lucide--file-text',
    doc: 'lucide--file-text',
    docx: 'lucide--file-text',
    xls: 'lucide--file-spreadsheet',
    xlsx: 'lucide--file-spreadsheet',
    ppt: 'lucide--presentation',
    pptx: 'lucide--presentation',
    jpg: 'lucide--image',
    jpeg: 'lucide--image',
    png: 'lucide--image',
    gif: 'lucide--image',
    txt: 'lucide--file-text',
  };
  return iconMap[fileType] || 'lucide--file';
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
    jpg: 'purple',
    jpeg: 'purple',
    png: 'purple',
    gif: 'purple',
    txt: 'default',
  };
  return colorMap[fileType] || 'default';
};

// 加載文件夾詳情
const loadFolderDetail = async () => {
  // 這裡應該調用API加載文件夾詳情
  console.log('加載文件夾詳情:', folderId.value);
};

// 組件掛載時加載數據
onMounted(() => {
  loadFolderDetail();
});
</script>

<template>
  <Page>
    <!-- 頁面頭部 -->
    <Card class="mb-4">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-xl font-semibold mb-2">{{ folderDetail.folderName }}</h2>
          <div class="text-gray-500">{{ folderDetail.folderDescription }}</div>
        </div>
        <Space>
          <Button @click="handleBack">
            <template #icon>
              <span class="icon-[lucide--arrow-left] size-4" />
            </template>
            {{ $t('page.legalPlatform.back') }}
          </Button>
          <Button type="primary" @click="handleEdit">
            <template #icon>
              <span class="icon-[lucide--edit] size-4" />
            </template>
            {{ $t('page.legalPlatform.edit') }}
          </Button>
          <Button @click="handlePermission">
            <template #icon>
              <span class="icon-[lucide--shield] size-4" />
            </template>
            {{ $t('page.legalPlatform.folderPermission') }}
          </Button>
        </Space>
      </div>
    </Card>

    <Row :gutter="16">
      <!-- 左側：文件夾信息 -->
      <Col :span="6">
        <Card class="mb-4" title="文件夾信息">
          <Descriptions :column="1" size="small">
            <DescriptionsItem :label="$t('page.legalPlatform.folderPath')">
              {{ folderDetail.folderPath }}
            </DescriptionsItem>
            <DescriptionsItem :label="$t('page.legalPlatform.folderType')">
              <Tag color="blue">{{ folderDetail.folderType }}</Tag>
            </DescriptionsItem>
            <DescriptionsItem :label="$t('page.legalPlatform.department')">
              {{ folderDetail.department }}
            </DescriptionsItem>
            <DescriptionsItem :label="$t('page.legalPlatform.folderOwner')">
              {{ folderDetail.owner }}
            </DescriptionsItem>
            <DescriptionsItem :label="$t('page.legalPlatform.folderCreator')">
              {{ folderDetail.creator }}
            </DescriptionsItem>
            <DescriptionsItem :label="$t('page.legalPlatform.createTime')">
              {{ folderDetail.createTime }}
            </DescriptionsItem>
            <DescriptionsItem :label="$t('page.legalPlatform.updateTime')">
              {{ folderDetail.updateTime }}
            </DescriptionsItem>
            <DescriptionsItem :label="$t('page.legalPlatform.folderStatus')">
              <Tag :color="folderDetail.status === 'active' ? 'green' : 'red'">
                {{ folderDetail.status === 'active' ? '啟用' : '停用' }}
              </Tag>
            </DescriptionsItem>
            <DescriptionsItem :label="$t('page.legalPlatform.folderTags')">
              <Space>
                <Tag v-for="tag in folderDetail.tags" :key="tag" color="blue">
                  {{ tag }}
                </Tag>
              </Space>
            </DescriptionsItem>
          </Descriptions>
        </Card>
      </Col>

      <!-- 右側：文件列表 -->
      <Col :span="18">
        <Card title="文件列表">
          <!-- 操作工具欄 -->
          <div class="mb-4 flex justify-between items-center">
            <Space>
              <Input.Search
                v-model:value="searchKeyword"
                placeholder="搜索文件"
                style="width: 200px"
                @search="handleSearch"
              />
              <Upload v-bind="uploadConfig" @change="handleUpload">
                <Button type="primary">
                  <template #icon>
                    <span class="icon-[lucide--upload] size-4" />
                  </template>
                  上傳文件
                </Button>
              </Upload>
              <Button @click="handleCreateFolder">
                <template #icon>
                  <span class="icon-[lucide--folder-plus] size-4" />
                </template>
                新建文件夾
              </Button>
            </Space>
          </div>

          <!-- 文件表格 -->
          <Table
            :columns="fileColumns"
            :data-source="fileList"
            :pagination="false"
            size="small"
            row-key="id"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'fileName'">
                <div class="flex items-center">
                  <span 
                    :class="getFileIcon(record.fileType)"
                    class="size-4 mr-2 text-blue-500"
                  />
                  {{ record.fileName }}
                </div>
              </template>
              <template v-else-if="column.key === 'fileType'">
                <Tag :color="getFileTypeColor(record.fileType)">
                  {{ record.fileType.toUpperCase() }}
                </Tag>
              </template>
              <template v-else-if="column.key === 'action'">
                <Space>
                  <Button type="link" size="small" @click="handlePreview(record)">
                    <template #icon>
                      <span class="icon-[lucide--eye] size-4" />
                    </template>
                    預覽
                  </Button>
                  <Button type="link" size="small" @click="handleDownload(record)">
                    <template #icon>
                      <span class="icon-[lucide--download] size-4" />
                    </template>
                    下載
                  </Button>
                  <Dropdown>
                    <Button type="link" size="small">
                      更多
                      <span class="icon-[lucide--chevron-down] size-4 ml-1" />
                    </Button>
                    <template #overlay>
                      <Menu>
                        <MenuItem @click="handleRename(record)">
                          <span class="icon-[lucide--edit] size-4 mr-2" />
                          重命名
                        </MenuItem>
                        <MenuItem @click="handleDeleteFile(record)">
                          <span class="icon-[lucide--trash-2] size-4 mr-2" />
                          刪除
                        </MenuItem>
                      </Menu>
                    </template>
                  </Dropdown>
                </Space>
              </template>
            </template>
          </Table>
        </Card>
      </Col>
    </Row>
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