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
  owner: '張三',
  creator: '張三',
  createTime: '2024-01-15 10:30:00',
  updateTime: '2024-01-20 14:20:00',
  tags: ['重要', '法律'],
  status: 'active',
  permissions: ['view', 'edit', 'upload', 'download'],
  statistics: {
    totalFiles: 156,
    totalSize: '2.3 GB',
    subFolders: 8,
    recentActivity: 25,
  },
});

// 文件夾樹形結構
const folderTree = ref([
  {
    title: '法律文件庫',
    key: 'legal-documents',
    icon: 'folder',
    children: [
      {
        title: '法規',
        key: 'regulations',
        icon: 'folder',
        children: [
          { title: '民法.pdf', key: 'civil-law.pdf', icon: 'file', size: '2.1 MB' },
          { title: '刑法.pdf', key: 'criminal-law.pdf', icon: 'file', size: '1.8 MB' },
        ],
      },
      {
        title: '判例',
        key: 'cases',
        icon: 'folder',
        children: [
          { title: '最高法院判例.docx', key: 'supreme-court.docx', icon: 'file', size: '856 KB' },
          { title: '地方法院判例.docx', key: 'local-court.docx', icon: 'file', size: '1.2 MB' },
        ],
      },
      {
        title: '合同模板',
        key: 'contract-templates',
        icon: 'folder',
        children: [
          { title: '勞動合同模板.docx', key: 'labor-contract.docx', icon: 'file', size: '245 KB' },
          { title: '租賃合同模板.docx', key: 'lease-contract.docx', icon: 'file', size: '198 KB' },
        ],
      },
    ],
  },
]);

// 當前選中的文件夾
const selectedFolder = ref('legal-documents');

// 文件列表
const fileList = ref([
  {
    id: '1',
    fileName: '民法.pdf',
    fileType: 'pdf',
    fileSize: '2.1 MB',
    uploadTime: '2024-01-15 10:30:00',
    uploader: '張三',
    downloadCount: 45,
    status: 'normal',
  },
  {
    id: '2',
    fileName: '刑法.pdf',
    fileType: 'pdf',
    fileSize: '1.8 MB',
    uploadTime: '2024-01-16 14:20:00',
    uploader: '李四',
    downloadCount: 32,
    status: 'normal',
  },
  {
    id: '3',
    fileName: '最高法院判例.docx',
    fileType: 'docx',
    fileSize: '856 KB',
    uploadTime: '2024-01-17 09:15:00',
    uploader: '王五',
    downloadCount: 28,
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
    title: '下載次數',
    dataIndex: 'downloadCount',
    key: 'downloadCount',
    width: 100,
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

// 文件夾樹選擇
const handleTreeSelect = (selectedKeys: string[]) => {
  if (selectedKeys.length > 0) {
    selectedFolder.value = selectedKeys[0];
    // 根據選中的文件夾加載文件列表
    loadFileList(selectedKeys[0]);
  }
};

// 加載文件列表
const loadFileList = (folderKey: string) => {
  console.log('加載文件夾文件:', folderKey);
  // 這裡應該根據文件夾key調用API加載文件列表
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
      <!-- 左側：文件夾信息和統計 -->
      <Col :span="8">
        <!-- 文件夾信息 -->
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

        <!-- 統計信息 -->
        <Card title="統計信息">
          <Row :gutter="16">
            <Col :span="12">
              <Statistic 
                title="文件總數" 
                :value="folderDetail.statistics.totalFiles" 
                :value-style="{ color: '#3f8600' }"
              />
            </Col>
            <Col :span="12">
              <Statistic 
                title="總大小" 
                :value="folderDetail.statistics.totalSize" 
                :value-style="{ color: '#cf1322' }"
              />
            </Col>
          </Row>
          <Row :gutter="16" class="mt-4">
            <Col :span="12">
              <Statistic 
                title="子文件夾" 
                :value="folderDetail.statistics.subFolders" 
                :value-style="{ color: '#1890ff' }"
              />
            </Col>
            <Col :span="12">
              <Statistic 
                title="最近活動" 
                :value="folderDetail.statistics.recentActivity" 
                :value-style="{ color: '#722ed1' }"
              />
            </Col>
          </Row>
        </Card>
      </Col>

      <!-- 右側：文件夾結構和文件列表 -->
      <Col :span="16">
        <Row :gutter="16">
          <!-- 文件夾樹形結構 -->
          <Col :span="8">
            <Card title="文件夾結構" class="h-96">
              <Tree
                :tree-data="folderTree"
                :selected-keys="[selectedFolder]"
                default-expand-all
                @select="handleTreeSelect"
              >
                <template #title="{ title, icon }">
                  <span class="flex items-center">
                    <span 
                      :class="icon === 'folder' ? 'icon-[lucide--folder] text-yellow-500' : 'icon-[lucide--file] text-blue-500'"
                      class="size-4 mr-1"
                    />
                    {{ title }}
                  </span>
                </template>
              </Tree>
            </Card>
          </Col>

          <!-- 文件列表 -->
          <Col :span="16">
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