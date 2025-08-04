<script lang="ts" setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Page } from '@vben/common-ui';
import { $t } from '#/locales';
import {
  Button,
  Card,
  Col,
  Form,
  FormItem,
  Input,
  InputNumber,
  Row,
  Select,
  SelectOption,
  Space,
  Switch,
  Table,
  Tag,
  Tabs,
  TabPane,
  Transfer,
  Tree,
  Modal,
  message,
  Divider,
  Alert,
  Progress,
  Statistic,
} from 'ant-design-vue';

const router = useRouter();
const route = useRoute();

// 表單引用
const formRef = ref();

// 文件庫ID
const libraryId = computed(() => route.query.id);

// 當前活動標籤
const activeTab = ref('permissions');

// 文件庫基本信息
const libraryInfo = ref({
  id: 1,
  name: '法律條文資料庫',
  description: '存放各類法律條文和相關文件',
  type: '部門文件庫',
  department: '法務部',
  owner: '陳大文',
  status: '啟用',
});

// 權限配置
const permissionConfig = reactive({
  inheritParentPermissions: true,
  customPermissions: {
    viewUsers: [] as string[],
    editUsers: [] as string[],
    deleteUsers: [] as string[],
    uploadUsers: [] as string[],
    downloadUsers: [] as string[],
    adminUsers: [] as string[],
  },
  departmentPermissions: {
    viewDepartments: ['法務部', '秘書處'],
    editDepartments: ['法務部'],
    deleteDepartments: ['法務部'],
    uploadDepartments: ['法務部'],
    downloadDepartments: ['法務部', '秘書處'],
  },
  rolePermissions: {
    viewRoles: ['管理員', '編輯者', '查看者'],
    editRoles: ['管理員', '編輯者'],
    deleteRoles: ['管理員'],
    uploadRoles: ['管理員', '編輯者'],
    downloadRoles: ['管理員', '編輯者', '查看者'],
  },
});

// 配額設置
const quotaConfig = reactive({
  storageLimit: 20, // GB
  fileCountLimit: 15000,
  singleFileLimit: 200, // MB
  dailyUploadLimit: 1000, // MB
  dailyDownloadLimit: 5000, // MB
  userQuotas: [
    { userId: '1', userName: '陳大文', storageLimit: 5, fileCountLimit: 3000 },
    { userId: '2', userName: '張三', storageLimit: 3, fileCountLimit: 2000 },
  ],
});

// 安全設置
const securityConfig = reactive({
  enableEncryption: true,
  enableVersionControl: true,
  enableAuditLog: true,
  enableWatermark: false,
  passwordProtection: false,
  allowedIpRanges: [] as string[],
  blockedIpRanges: [] as string[],
  sessionTimeout: 120, // minutes
  maxLoginAttempts: 5,
  enableTwoFactor: false,
});

// 備份設置
const backupConfig = reactive({
  enabled: true,
  frequency: 'daily',
  retention: 30, // days
  backupLocation: 'local',
  compressionEnabled: true,
  encryptionEnabled: true,
  notifyOnFailure: true,
  notifyEmails: ['admin@example.com'],
  excludePatterns: ['*.tmp', '*.log'],
});

// 索引設置
const indexConfig = reactive({
  enableFullTextSearch: true,
  enableMetadataIndex: true,
  indexingSchedule: 'nightly',
  excludeFileTypes: ['exe', 'dll', 'sys'],
  maxFileSize: 100, // MB for indexing
  enableOCR: false,
  ocrLanguages: ['zh-CN', 'en'],
});

// 通知設置
const notificationConfig = reactive({
  enableEmailNotifications: true,
  enableSystemNotifications: true,
  notifyOnUpload: false,
  notifyOnDownload: false,
  notifyOnDelete: true,
  notifyOnPermissionChange: true,
  notifyOnQuotaExceeded: true,
  emailTemplates: {
    upload: '文件上傳通知模板',
    download: '文件下載通知模板',
    delete: '文件刪除通知模板',
  },
});

// 用戶列表（用於權限分配）
const userList = ref([
  { key: '1', title: '陳大文 (法務部)', department: '法務部' },
  { key: '2', title: '張三 (法務部)', department: '法務部' },
  { key: '3', title: '李四 (行政部)', department: '行政部' },
  { key: '4', title: '王五 (秘書處)', department: '秘書處' },
  { key: '5', title: '趙六 (項目組)', department: '項目組' },
]);

// 部門列表
const departmentList = [
  { label: '法務部', value: '法務部' },
  { label: '行政部', value: '行政部' },
  { label: '秘書處', value: '秘書處' },
  { label: '項目組', value: '項目組' },
  { label: '全部門', value: '全部門' },
];

// 角色列表
const roleList = [
  { label: '管理員', value: '管理員' },
  { label: '編輯者', value: '編輯者' },
  { label: '查看者', value: '查看者' },
  { label: '訪客', value: '訪客' },
];

// 備份頻率選項
const backupFrequencyOptions = [
  { label: '每小時', value: 'hourly' },
  { label: '每日', value: 'daily' },
  { label: '每週', value: 'weekly' },
  { label: '每月', value: 'monthly' },
  { label: '手動', value: 'manual' },
];

// 備份位置選項
const backupLocationOptions = [
  { label: '本地存儲', value: 'local' },
  { label: '雲端存儲', value: 'cloud' },
  { label: '網絡存儲', value: 'network' },
];

// 索引計劃選項
const indexingScheduleOptions = [
  { label: '實時', value: 'realtime' },
  { label: '每小時', value: 'hourly' },
  { label: '夜間', value: 'nightly' },
  { label: '週末', value: 'weekend' },
  { label: '手動', value: 'manual' },
];

// 用戶配額表格列
const userQuotaColumns = [
  { title: '用戶名', dataIndex: 'userName', key: 'userName' },
  { title: '存儲限制 (GB)', dataIndex: 'storageLimit', key: 'storageLimit' },
  { title: '文件數量限制', dataIndex: 'fileCountLimit', key: 'fileCountLimit' },
  { title: '操作', key: 'operation', width: 150 },
];

// 添加IP範圍
const newAllowedIp = ref('');
const newBlockedIp = ref('');

const addAllowedIp = () => {
  if (newAllowedIp.value && !securityConfig.allowedIpRanges.includes(newAllowedIp.value)) {
    securityConfig.allowedIpRanges.push(newAllowedIp.value);
    newAllowedIp.value = '';
  }
};

const removeAllowedIp = (ip: string) => {
  const index = securityConfig.allowedIpRanges.indexOf(ip);
  if (index > -1) {
    securityConfig.allowedIpRanges.splice(index, 1);
  }
};

const addBlockedIp = () => {
  if (newBlockedIp.value && !securityConfig.blockedIpRanges.includes(newBlockedIp.value)) {
    securityConfig.blockedIpRanges.push(newBlockedIp.value);
    newBlockedIp.value = '';
  }
};

const removeBlockedIp = (ip: string) => {
  const index = securityConfig.blockedIpRanges.indexOf(ip);
  if (index > -1) {
    securityConfig.blockedIpRanges.splice(index, 1);
  }
};

// 添加用戶配額
const addUserQuota = () => {
  const newQuota = {
    userId: Date.now().toString(),
    userName: '',
    storageLimit: 1,
    fileCountLimit: 1000,
  };
  quotaConfig.userQuotas.push(newQuota);
};

// 移除用戶配額
const removeUserQuota = (index: number) => {
  quotaConfig.userQuotas.splice(index, 1);
};

// 測試備份
const testBackup = () => {
  message.loading('正在執行測試備份...', 2);
  setTimeout(() => {
    message.success('測試備份完成');
  }, 2000);
};

// 重建索引
const rebuildIndex = () => {
  Modal.confirm({
    title: '確認重建索引',
    content: '重建索引可能需要較長時間，期間搜索功能可能受影響。確定要繼續嗎？',
    onOk() {
      message.loading('正在重建索引...', 3);
      setTimeout(() => {
        message.success('索引重建完成');
      }, 3000);
    },
  });
};

// 保存配置
const saveConfig = async () => {
  try {
    // 這裡應該調用API保存配置
    console.log('保存配置:', {
      permissions: permissionConfig,
      quota: quotaConfig,
      security: securityConfig,
      backup: backupConfig,
      index: indexConfig,
      notification: notificationConfig,
    });
    
    message.success('配置保存成功');
  } catch (error) {
    console.error('保存配置失敗:', error);
    message.error('保存配置失敗');
  }
};

// 返回
const handleBack = () => {
  router.back();
};

// 加載配置數據
const loadConfig = async () => {
  if (libraryId.value) {
    // 這裡應該調用API加載配置數據
    console.log('加載文件庫配置:', libraryId.value);
  }
};

// 組件掛載時加載數據
onMounted(() => {
  loadConfig();
});
</script>

<template>
  <Page 
    :description="`配置文件庫「${libraryInfo.name}」的高級設置`"
    title="文件庫配置"
  >
    <!-- 操作按鈕 -->
    <Card class="mb-4">
      <Space>
        <Button @click="handleBack">
          <template #icon>
            <span class="icon-[lucide--arrow-left] size-4" />
          </template>
          返回
        </Button>
        <Button type="primary" @click="saveConfig">
          <template #icon>
            <span class="icon-[lucide--save] size-4" />
          </template>
          保存配置
        </Button>
      </Space>
    </Card>

    <!-- 配置標籤頁 -->
    <Card>
      <Tabs v-model:activeKey="activeTab" type="card">
        <!-- 權限管理 -->
        <TabPane key="permissions" tab="權限管理">
          <Alert
            message="權限設置"
            description="配置文件庫的訪問權限，支持按用戶、部門和角色進行精細化權限控制。"
            type="info"
            show-icon
            class="mb-4"
          />
          
          <!-- 部門權限 -->
          <Card title="部門權限" class="mb-4">
            <Row :gutter="16">
              <Col :span="12">
                <FormItem label="查看權限">
                  <Select 
                    v-model:value="permissionConfig.departmentPermissions.viewDepartments" 
                    mode="multiple"
                    placeholder="選擇可查看的部門"
                  >
                    <SelectOption 
                      v-for="dept in departmentList" 
                      :key="dept.value" 
                      :value="dept.value"
                    >
                      {{ dept.label }}
                    </SelectOption>
                  </Select>
                </FormItem>
              </Col>
              <Col :span="12">
                <FormItem label="編輯權限">
                  <Select 
                    v-model:value="permissionConfig.departmentPermissions.editDepartments" 
                    mode="multiple"
                    placeholder="選擇可編輯的部門"
                  >
                    <SelectOption 
                      v-for="dept in departmentList" 
                      :key="dept.value" 
                      :value="dept.value"
                    >
                      {{ dept.label }}
                    </SelectOption>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            
            <Row :gutter="16">
              <Col :span="12">
                <FormItem label="上傳權限">
                  <Select 
                    v-model:value="permissionConfig.departmentPermissions.uploadDepartments" 
                    mode="multiple"
                    placeholder="選擇可上傳的部門"
                  >
                    <SelectOption 
                      v-for="dept in departmentList" 
                      :key="dept.value" 
                      :value="dept.value"
                    >
                      {{ dept.label }}
                    </SelectOption>
                  </Select>
                </FormItem>
              </Col>
              <Col :span="12">
                <FormItem label="刪除權限">
                  <Select 
                    v-model:value="permissionConfig.departmentPermissions.deleteDepartments" 
                    mode="multiple"
                    placeholder="選擇可刪除的部門"
                  >
                    <SelectOption 
                      v-for="dept in departmentList" 
                      :key="dept.value" 
                      :value="dept.value"
                    >
                      {{ dept.label }}
                    </SelectOption>
                  </Select>
                </FormItem>
              </Col>
            </Row>
          </Card>
          
          <!-- 角色權限 -->
          <Card title="角色權限">
            <Row :gutter="16">
              <Col :span="12">
                <FormItem label="查看角色">
                  <Select 
                    v-model:value="permissionConfig.rolePermissions.viewRoles" 
                    mode="multiple"
                    placeholder="選擇可查看的角色"
                  >
                    <SelectOption 
                      v-for="role in roleList" 
                      :key="role.value" 
                      :value="role.value"
                    >
                      {{ role.label }}
                    </SelectOption>
                  </Select>
                </FormItem>
              </Col>
              <Col :span="12">
                <FormItem label="編輯角色">
                  <Select 
                    v-model:value="permissionConfig.rolePermissions.editRoles" 
                    mode="multiple"
                    placeholder="選擇可編輯的角色"
                  >
                    <SelectOption 
                      v-for="role in roleList" 
                      :key="role.value" 
                      :value="role.value"
                    >
                      {{ role.label }}
                    </SelectOption>
                  </Select>
                </FormItem>
              </Col>
            </Row>
          </Card>
        </TabPane>



        <!-- 安全設置 -->
        <TabPane key="security" tab="安全設置">
          <!-- 基本安全設置 -->
          <Card title="基本安全設置" class="mb-4">
            <Row :gutter="16">
              <Col :span="8">
                <FormItem label="密碼保護">
                  <Switch v-model:checked="securityConfig.passwordProtection" />
                  <div class="text-xs text-gray-500 mt-1">訪問文件庫需要密碼</div>
                </FormItem>
              </Col>
            </Row>
          </Card>
        </TabPane>


      </Tabs>
    </Card>
  </Page>
</template>

<style scoped>
.ant-input-number {
  width: 100%;
}

.ant-tag {
  margin: 2px;
}

.ant-card {
  margin-bottom: 16px;
}
</style>
