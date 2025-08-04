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

        <!-- 配額管理 -->
        <TabPane key="quota" tab="配額管理">
          <Alert
            message="配額設置"
            description="設置文件庫的存儲配額和使用限制，防止過度使用存儲資源。"
            type="info"
            show-icon
            class="mb-4"
          />
          
          <!-- 全局配額 -->
          <Card title="全局配額" class="mb-4">
            <Row :gutter="16">
              <Col :span="8">
                <FormItem label="存儲限制">
                  <InputNumber 
                    v-model:value="quotaConfig.storageLimit" 
                    :min="1" 
                    :max="1000"
                    addon-after="GB"
                    class="w-full"
                  />
                </FormItem>
              </Col>
              <Col :span="8">
                <FormItem label="文件數量限制">
                  <InputNumber 
                    v-model:value="quotaConfig.fileCountLimit" 
                    :min="100" 
                    :max="100000"
                    class="w-full"
                  />
                </FormItem>
              </Col>
              <Col :span="8">
                <FormItem label="單文件大小限制">
                  <InputNumber 
                    v-model:value="quotaConfig.singleFileLimit" 
                    :min="1" 
                    :max="1000"
                    addon-after="MB"
                    class="w-full"
                  />
                </FormItem>
              </Col>
            </Row>
            
            <Row :gutter="16">
              <Col :span="12">
                <FormItem label="每日上傳限制">
                  <InputNumber 
                    v-model:value="quotaConfig.dailyUploadLimit" 
                    :min="100" 
                    :max="10000"
                    addon-after="MB"
                    class="w-full"
                  />
                </FormItem>
              </Col>
              <Col :span="12">
                <FormItem label="每日下載限制">
                  <InputNumber 
                    v-model:value="quotaConfig.dailyDownloadLimit" 
                    :min="100" 
                    :max="50000"
                    addon-after="MB"
                    class="w-full"
                  />
                </FormItem>
              </Col>
            </Row>
          </Card>
          
          <!-- 用戶配額 -->
          <Card title="用戶配額">
            <div class="mb-4">
              <Button type="dashed" @click="addUserQuota">
                <template #icon>
                  <span class="icon-[lucide--plus] size-4" />
                </template>
                添加用戶配額
              </Button>
            </div>
            
            <Table
              :columns="userQuotaColumns"
              :data-source="quotaConfig.userQuotas"
              :pagination="false"
              row-key="userId"
            >
              <template #bodyCell="{ column, record, index }">
                <template v-if="column.key === 'userName'">
                  <Input v-model:value="record.userName" placeholder="用戶名" />
                </template>
                <template v-else-if="column.key === 'storageLimit'">
                  <InputNumber v-model:value="record.storageLimit" :min="0.1" :max="100" :step="0.1" />
                </template>
                <template v-else-if="column.key === 'fileCountLimit'">
                  <InputNumber v-model:value="record.fileCountLimit" :min="100" :max="10000" />
                </template>
                <template v-else-if="column.key === 'operation'">
                  <Button type="link" danger @click="removeUserQuota(index)">
                    <template #icon>
                      <span class="icon-[lucide--trash-2] size-4" />
                    </template>
                    刪除
                  </Button>
                </template>
              </template>
            </Table>
          </Card>
        </TabPane>

        <!-- 安全設置 -->
        <TabPane key="security" tab="安全設置">
          <Alert
            message="安全配置"
            description="配置文件庫的安全策略，包括加密、訪問控制和審計等功能。"
            type="warning"
            show-icon
            class="mb-4"
          />
          
          <!-- 基本安全設置 -->
          <Card title="基本安全設置" class="mb-4">
            <Row :gutter="16">
              <Col :span="8">
                <FormItem label="啟用加密">
                  <Switch v-model:checked="securityConfig.enableEncryption" />
                  <div class="text-xs text-gray-500 mt-1">對存儲的文件進行加密</div>
                </FormItem>
              </Col>
              <Col :span="8">
                <FormItem label="版本控制">
                  <Switch v-model:checked="securityConfig.enableVersionControl" />
                  <div class="text-xs text-gray-500 mt-1">保留文件的歷史版本</div>
                </FormItem>
              </Col>
              <Col :span="8">
                <FormItem label="審計日誌">
                  <Switch v-model:checked="securityConfig.enableAuditLog" />
                  <div class="text-xs text-gray-500 mt-1">記錄所有操作日誌</div>
                </FormItem>
              </Col>
            </Row>
            
            <Row :gutter="16">
              <Col :span="8">
                <FormItem label="水印保護">
                  <Switch v-model:checked="securityConfig.enableWatermark" />
                  <div class="text-xs text-gray-500 mt-1">在文件上添加水印</div>
                </FormItem>
              </Col>
              <Col :span="8">
                <FormItem label="密碼保護">
                  <Switch v-model:checked="securityConfig.passwordProtection" />
                  <div class="text-xs text-gray-500 mt-1">訪問文件庫需要密碼</div>
                </FormItem>
              </Col>
              <Col :span="8">
                <FormItem label="雙因子認證">
                  <Switch v-model:checked="securityConfig.enableTwoFactor" />
                  <div class="text-xs text-gray-500 mt-1">啟用雙因子認證</div>
                </FormItem>
              </Col>
            </Row>
          </Card>
          
          <!-- 訪問控制 -->
          <Card title="訪問控制" class="mb-4">
            <Row :gutter="16">
              <Col :span="12">
                <FormItem label="會話超時 (分鐘)">
                  <InputNumber 
                    v-model:value="securityConfig.sessionTimeout" 
                    :min="5" 
                    :max="480"
                    class="w-full"
                  />
                </FormItem>
              </Col>
              <Col :span="12">
                <FormItem label="最大登錄嘗試次數">
                  <InputNumber 
                    v-model:value="securityConfig.maxLoginAttempts" 
                    :min="3" 
                    :max="10"
                    class="w-full"
                  />
                </FormItem>
              </Col>
            </Row>
          </Card>
          
          <!-- IP 訪問控制 -->
          <Card title="IP 訪問控制">
            <Row :gutter="16">
              <Col :span="12">
                <FormItem label="允許的IP範圍">
                  <div class="flex flex-wrap gap-2 mb-2">
                    <Tag 
                      v-for="ip in securityConfig.allowedIpRanges" 
                      :key="ip" 
                      color="green"
                      closable 
                      @close="removeAllowedIp(ip)"
                    >
                      {{ ip }}
                    </Tag>
                  </div>
                  <div class="flex gap-2">
                    <Input 
                      v-model:value="newAllowedIp" 
                      placeholder="輸入IP地址或範圍"
                      @press-enter="addAllowedIp"
                    />
                    <Button @click="addAllowedIp">添加</Button>
                  </div>
                </FormItem>
              </Col>
              <Col :span="12">
                <FormItem label="禁止的IP範圍">
                  <div class="flex flex-wrap gap-2 mb-2">
                    <Tag 
                      v-for="ip in securityConfig.blockedIpRanges" 
                      :key="ip" 
                      color="red"
                      closable 
                      @close="removeBlockedIp(ip)"
                    >
                      {{ ip }}
                    </Tag>
                  </div>
                  <div class="flex gap-2">
                    <Input 
                      v-model:value="newBlockedIp" 
                      placeholder="輸入IP地址或範圍"
                      @press-enter="addBlockedIp"
                    />
                    <Button @click="addBlockedIp">添加</Button>
                  </div>
                </FormItem>
              </Col>
            </Row>
          </Card>
        </TabPane>

        <!-- 備份設置 -->
        <TabPane key="backup" tab="備份設置">
          <Alert
            message="備份配置"
            description="配置文件庫的自動備份策略，確保數據安全。"
            type="info"
            show-icon
            class="mb-4"
          />
          
          <Card title="備份策略" class="mb-4">
            <Row :gutter="16">
              <Col :span="8">
                <FormItem label="啟用自動備份">
                  <Switch v-model:checked="backupConfig.enabled" />
                </FormItem>
              </Col>
              <Col :span="8">
                <FormItem label="備份頻率">
                  <Select v-model:value="backupConfig.frequency" :disabled="!backupConfig.enabled">
                    <SelectOption 
                      v-for="option in backupFrequencyOptions" 
                      :key="option.value" 
                      :value="option.value"
                    >
                      {{ option.label }}
                    </SelectOption>
                  </Select>
                </FormItem>
              </Col>
              <Col :span="8">
                <FormItem label="保留天數">
                  <InputNumber 
                    v-model:value="backupConfig.retention" 
                    :min="1" 
                    :max="365"
                    :disabled="!backupConfig.enabled"
                    addon-after="天"
                    class="w-full"
                  />
                </FormItem>
              </Col>
            </Row>
            
            <Row :gutter="16">
              <Col :span="8">
                <FormItem label="備份位置">
                  <Select v-model:value="backupConfig.backupLocation" :disabled="!backupConfig.enabled">
                    <SelectOption 
                      v-for="option in backupLocationOptions" 
                      :key="option.value" 
                      :value="option.value"
                    >
                      {{ option.label }}
                    </SelectOption>
                  </Select>
                </FormItem>
              </Col>
              <Col :span="8">
                <FormItem label="啟用壓縮">
                  <Switch v-model:checked="backupConfig.compressionEnabled" :disabled="!backupConfig.enabled" />
                </FormItem>
              </Col>
              <Col :span="8">
                <FormItem label="備份加密">
                  <Switch v-model:checked="backupConfig.encryptionEnabled" :disabled="!backupConfig.enabled" />
                </FormItem>
              </Col>
            </Row>
          </Card>
          
          <Card title="備份通知">
            <Row :gutter="16">
              <Col :span="12">
                <FormItem label="失敗時通知">
                  <Switch v-model:checked="backupConfig.notifyOnFailure" :disabled="!backupConfig.enabled" />
                </FormItem>
              </Col>
              <Col :span="12">
                <FormItem label="通知郵箱">
                  <Select 
                    v-model:value="backupConfig.notifyEmails" 
                    mode="tags"
                    placeholder="輸入郵箱地址"
                    :disabled="!backupConfig.enabled || !backupConfig.notifyOnFailure"
                  />
                </FormItem>
              </Col>
            </Row>
            
            <div class="mt-4">
              <Button type="primary" @click="testBackup" :disabled="!backupConfig.enabled">
                <template #icon>
                  <span class="icon-[lucide--play] size-4" />
                </template>
                測試備份
              </Button>
            </div>
          </Card>
        </TabPane>

        <!-- 索引設置 -->
        <TabPane key="index" tab="索引設置">
          <Alert
            message="索引配置"
            description="配置文件內容索引和搜索功能，提高文件檢索效率。"
            type="info"
            show-icon
            class="mb-4"
          />
          
          <Card title="索引策略" class="mb-4">
            <Row :gutter="16">
              <Col :span="8">
                <FormItem label="全文搜索">
                  <Switch v-model:checked="indexConfig.enableFullTextSearch" />
                  <div class="text-xs text-gray-500 mt-1">索引文件內容以支持全文搜索</div>
                </FormItem>
              </Col>
              <Col :span="8">
                <FormItem label="元數據索引">
                  <Switch v-model:checked="indexConfig.enableMetadataIndex" />
                  <div class="text-xs text-gray-500 mt-1">索引文件元數據信息</div>
                </FormItem>
              </Col>
              <Col :span="8">
                <FormItem label="OCR識別">
                  <Switch v-model:checked="indexConfig.enableOCR" />
                  <div class="text-xs text-gray-500 mt-1">對圖片文件進行OCR文字識別</div>
                </FormItem>
              </Col>
            </Row>
            
            <Row :gutter="16">
              <Col :span="12">
                <FormItem label="索引計劃">
                  <Select v-model:value="indexConfig.indexingSchedule">
                    <SelectOption 
                      v-for="option in indexingScheduleOptions" 
                      :key="option.value" 
                      :value="option.value"
                    >
                      {{ option.label }}
                    </SelectOption>
                  </Select>
                </FormItem>
              </Col>
              <Col :span="12">
                <FormItem label="最大索引文件大小">
                  <InputNumber 
                    v-model:value="indexConfig.maxFileSize" 
                    :min="1" 
                    :max="1000"
                    addon-after="MB"
                    class="w-full"
                  />
                </FormItem>
              </Col>
            </Row>
          </Card>
          
          <Card title="索引排除">
            <FormItem label="排除文件類型">
              <Select 
                v-model:value="indexConfig.excludeFileTypes" 
                mode="tags"
                placeholder="輸入要排除的文件擴展名"
              />
            </FormItem>
            
            <div class="mt-4">
              <Button type="primary" @click="rebuildIndex">
                <template #icon>
                  <span class="icon-[lucide--refresh-cw] size-4" />
                </template>
                重建索引
              </Button>
            </div>
          </Card>
        </TabPane>

        <!-- 通知設置 -->
        <TabPane key="notification" tab="通知設置">
          <Alert
            message="通知配置"
            description="配置文件庫操作的通知策略，及時了解重要事件。"
            type="info"
            show-icon
            class="mb-4"
          />
          
          <Card title="通知開關" class="mb-4">
            <Row :gutter="16">
              <Col :span="12">
                <FormItem label="郵件通知">
                  <Switch v-model:checked="notificationConfig.enableEmailNotifications" />
                  <div class="text-xs text-gray-500 mt-1">發送郵件通知</div>
                </FormItem>
              </Col>
              <Col :span="12">
                <FormItem label="系統通知">
                  <Switch v-model:checked="notificationConfig.enableSystemNotifications" />
                  <div class="text-xs text-gray-500 mt-1">顯示系統內通知</div>
                </FormItem>
              </Col>
            </Row>
          </Card>
          
          <Card title="事件通知">
            <Row :gutter="16">
              <Col :span="12">
                <FormItem label="文件上傳通知">
                  <Switch v-model:checked="notificationConfig.notifyOnUpload" />
                </FormItem>
              </Col>
              <Col :span="12">
                <FormItem label="文件下載通知">
                  <Switch v-model:checked="notificationConfig.notifyOnDownload" />
                </FormItem>
              </Col>
            </Row>
            
            <Row :gutter="16">
              <Col :span="12">
                <FormItem label="文件刪除通知">
                  <Switch v-model:checked="notificationConfig.notifyOnDelete" />
                </FormItem>
              </Col>
              <Col :span="12">
                <FormItem label="權限變更通知">
                  <Switch v-model:checked="notificationConfig.notifyOnPermissionChange" />
                </FormItem>
              </Col>
            </Row>
            
            <Row :gutter="16">
              <Col :span="12">
                <FormItem label="配額超限通知">
                  <Switch v-model:checked="notificationConfig.notifyOnQuotaExceeded" />
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
