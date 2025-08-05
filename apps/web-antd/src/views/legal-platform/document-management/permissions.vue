<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { Page } from '@vben/common-ui';
import { $t } from '#/locales';
import {
  Button,
  Card,
  Col,
  Form,
  FormItem,
  Input,
  Row,
  Select,
  SelectOption,
  Space,
  Table,
  Tag,
  message,
  Modal,
  Switch,
  Checkbox,
  CheckboxGroup,
  Radio,
  RadioGroup,
  Divider,
  Tabs,
  TabPane,
  Transfer,
  Tree,
  Tooltip,
  Popconfirm,
  DatePicker,
  Alert,
} from 'ant-design-vue';

const router = useRouter();

// 當前標籤頁
const activeTab = ref('user');

// 搜索表單
const searchForm = reactive({
  userName: '',
  roleName: '',
  department: '',
  permissionType: '',
  status: '',
});

// 用戶權限數據
const userPermissions = ref([
  {
    id: 'perm-001',
    userId: 'user001',
    userName: 'João Silva',
    userEmail: 'zhangsan@company.com',
    department: 'legal',
    departmentName: '法務部',
    role: 'manager',
    roleName: '部門經理',
    permissions: {
      view: true,
      download: true,
      print: true,
      edit: true,
      delete: false,
      share: true,
      upload: true,
      manage: true,
    },
    grantTime: '2024-01-10 09:00:00',
    grantBy: '系統管理員',
    expiryTime: '2024-12-31 23:59:59',
    status: 'active',
    lastAccess: '2024-01-20 14:30:00',
  },
  {
    id: 'perm-002',
    userId: 'user002',
    userName: 'Maria Santos',
    userEmail: 'lisi@company.com',
    department: 'legal',
    departmentName: '法務部',
    role: 'staff',
    roleName: '普通員工',
    permissions: {
      view: true,
      download: true,
      print: true,
      edit: false,
      delete: false,
      share: false,
      upload: true,
      manage: false,
    },
    grantTime: '2024-01-12 10:30:00',
    grantBy: 'João Silva',
    expiryTime: '2024-12-31 23:59:59',
    status: 'active',
    lastAccess: '2024-01-20 11:15:00',
  },
  {
    id: 'perm-003',
    userId: 'user003',
    userName: 'Pedro Costa',
    userEmail: 'wangwu@company.com',
    department: 'hr',
    departmentName: '人事部',
    role: 'staff',
    roleName: '普通員工',
    permissions: {
      view: true,
      download: false,
      print: false,
      edit: false,
      delete: false,
      share: false,
      upload: false,
      manage: false,
    },
    grantTime: '2024-01-15 14:20:00',
    grantBy: 'João Silva',
    expiryTime: '2024-06-30 23:59:59',
    status: 'active',
    lastAccess: '2024-01-19 16:45:00',
  },
  {
    id: 'perm-004',
    userId: 'user004',
    userName: 'Ana Ferreira',
    userEmail: 'zhaoliu@company.com',
    department: 'finance',
    departmentName: '財務部',
    role: 'guest',
    roleName: '訪客',
    permissions: {
      view: true,
      download: false,
      print: false,
      edit: false,
      delete: false,
      share: false,
      upload: false,
      manage: false,
    },
    grantTime: '2024-01-18 11:10:00',
    grantBy: 'João Silva',
    expiryTime: '2024-02-18 23:59:59',
    status: 'expired',
    lastAccess: '2024-01-18 15:20:00',
  },
]);

// 角色權限數據
const rolePermissions = ref([
  {
    id: 'role-001',
    roleName: '系統管理員',
    roleKey: 'admin',
    description: '系統最高權限，可以管理所有功能',
    permissions: {
      view: true,
      download: true,
      print: true,
      edit: true,
      delete: true,
      share: true,
      upload: true,
      manage: true,
    },
    userCount: 2,
    createTime: '2024-01-01 00:00:00',
    updateTime: '2024-01-10 10:00:00',
    status: 'active',
  },
  {
    id: 'role-002',
    roleName: '部門經理',
    roleKey: 'manager',
    description: '部門管理權限，可以管理本部門文件',
    permissions: {
      view: true,
      download: true,
      print: true,
      edit: true,
      delete: false,
      share: true,
      upload: true,
      manage: true,
    },
    userCount: 5,
    createTime: '2024-01-01 00:00:00',
    updateTime: '2024-01-15 14:30:00',
    status: 'active',
  },
  {
    id: 'role-003',
    roleName: '普通員工',
    roleKey: 'staff',
    description: '基本操作權限，可以查看和下載文件',
    permissions: {
      view: true,
      download: true,
      print: true,
      edit: false,
      delete: false,
      share: false,
      upload: true,
      manage: false,
    },
    userCount: 15,
    createTime: '2024-01-01 00:00:00',
    updateTime: '2024-01-12 09:20:00',
    status: 'active',
  },
  {
    id: 'role-004',
    roleName: '訪客',
    roleKey: 'guest',
    description: '只讀權限，僅可查看文件',
    permissions: {
      view: true,
      download: false,
      print: false,
      edit: false,
      delete: false,
      share: false,
      upload: false,
      manage: false,
    },
    userCount: 3,
    createTime: '2024-01-01 00:00:00',
    updateTime: '2024-01-08 16:45:00',
    status: 'active',
  },
]);

// 部門權限數據
const departmentPermissions = ref([
  {
    id: 'dept-001',
    departmentName: '法務部',
    departmentKey: 'legal',
    description: '法律事務相關文件管理',
    permissions: {
      view: true,
      download: true,
      print: true,
      edit: true,
      delete: true,
      share: true,
      upload: true,
      manage: true,
    },
    userCount: 8,
    fileCount: 156,
    createTime: '2024-01-01 00:00:00',
    updateTime: '2024-01-18 11:30:00',
    status: 'active',
  },
  {
    id: 'dept-002',
    departmentName: '人事部',
    departmentKey: 'hr',
    description: '人力資源相關文件管理',
    permissions: {
      view: true,
      download: true,
      print: true,
      edit: true,
      delete: false,
      share: true,
      upload: true,
      manage: false,
    },
    userCount: 6,
    fileCount: 89,
    createTime: '2024-01-01 00:00:00',
    updateTime: '2024-01-16 14:20:00',
    status: 'active',
  },
  {
    id: 'dept-003',
    departmentName: '財務部',
    departmentKey: 'finance',
    description: '財務相關文件管理',
    permissions: {
      view: true,
      download: true,
      print: true,
      edit: false,
      delete: false,
      share: false,
      upload: true,
      manage: false,
    },
    userCount: 4,
    fileCount: 67,
    createTime: '2024-01-01 00:00:00',
    updateTime: '2024-01-14 10:15:00',
    status: 'active',
  },
]);

// 分頁配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 4,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number, range: [number, number]) => 
    `第 ${range[0]}-${range[1]} 條，共 ${total} 條`,
});

// 權限編輯模態框
const editModalVisible = ref(false);
const editForm = reactive({
  id: '',
  type: 'user', // user, role, department
  name: '',
  permissions: {
    view: false,
    download: false,
    print: false,
    edit: false,
    delete: false,
    share: false,
    upload: false,
    manage: false,
  },
  expiryTime: '',
  description: '',
});

// 添加用戶模態框
const addUserModalVisible = ref(false);
const addUserForm = reactive({
  users: [],
  role: '',
  permissions: {
    view: true,
    download: false,
    print: false,
    edit: false,
    delete: false,
    share: false,
    upload: false,
    manage: false,
  },
  expiryTime: '',
});

// 可選用戶數據
const availableUsers = ref([
  { key: 'user005', title: 'Carlos Oliveira (carlos@company.com)', department: '市場部' },
  { key: 'user006', title: 'Sofia Rodrigues (sofia@company.com)', department: '技術部' },
  { key: 'user007', title: 'Miguel Pereira (miguel@company.com)', department: '法務部' },
  { key: 'user008', title: 'Luís Costa (luis@company.com)', department: '人事部' },
]);

// 表格列配置
const userColumns = [
  {
    title: '用戶名',
    dataIndex: 'userName',
    key: 'userName',
    width: 120,
  },
  {
    title: '郵箱',
    dataIndex: 'userEmail',
    key: 'userEmail',
    width: 200,
  },
  {
    title: '部門',
    dataIndex: 'departmentName',
    key: 'departmentName',
    width: 100,
  },
  {
    title: '角色',
    dataIndex: 'roleName',
    key: 'roleName',
    width: 100,
  },
  {
    title: '權限',
    key: 'permissions',
    width: 300,
  },
  {
    title: '狀態',
    dataIndex: 'status',
    key: 'status',
    width: 80,
  },
  {
    title: '到期時間',
    dataIndex: 'expiryTime',
    key: 'expiryTime',
    width: 180,
  },
  {
    title: '操作',
    key: 'action',
    width: 200,
    fixed: 'right',
  },
];

const roleColumns = [
  {
    title: '角色名稱',
    dataIndex: 'roleName',
    key: 'roleName',
    width: 150,
  },
  {
    title: '角色描述',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: '權限',
    key: 'permissions',
    width: 300,
  },
  {
    title: '用戶數',
    dataIndex: 'userCount',
    key: 'userCount',
    width: 80,
  },
  {
    title: '狀態',
    dataIndex: 'status',
    key: 'status',
    width: 80,
  },
  {
    title: '操作',
    key: 'action',
    width: 200,
    fixed: 'right',
  },
];

const departmentColumns = [
  {
    title: '部門名稱',
    dataIndex: 'departmentName',
    key: 'departmentName',
    width: 150,
  },
  {
    title: '部門描述',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: '權限',
    key: 'permissions',
    width: 300,
  },
  {
    title: '用戶數',
    dataIndex: 'userCount',
    key: 'userCount',
    width: 80,
  },
  {
    title: '文件數',
    dataIndex: 'fileCount',
    key: 'fileCount',
    width: 80,
  },
  {
    title: '狀態',
    dataIndex: 'status',
    key: 'status',
    width: 80,
  },
  {
    title: '操作',
    key: 'action',
    width: 200,
    fixed: 'right',
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

const roleOptions = [
  { label: '系統管理員', value: 'admin' },
  { label: '部門經理', value: 'manager' },
  { label: '普通員工', value: 'staff' },
  { label: '訪客', value: 'guest' },
];

const statusOptions = [
  { label: '正常', value: 'active' },
  { label: '已過期', value: 'expired' },
  { label: '已禁用', value: 'disabled' },
];

// 權限名稱映射
const permissionLabels = {
  view: '查看',
  download: '下載',
  print: '列印',
  edit: '編輯',
  delete: '刪除',
  share: '分享',
  upload: '上傳',
  manage: '管理',
};

// 獲取權限標籤
const getPermissionTags = (permissions: any) => {
  return Object.entries(permissions)
    .filter(([key, value]) => value)
    .map(([key]) => permissionLabels[key]);
};

// 獲取狀態標籤
const getStatusTag = (status: string) => {
  const statusMap = {
    active: { color: 'green', text: '正常' },
    expired: { color: 'red', text: '已過期' },
    disabled: { color: 'gray', text: '已禁用' },
  };
  return statusMap[status] || { color: 'default', text: status };
};

// 搜索
const handleSearch = () => {
  console.log('搜索條件:', searchForm);
  message.success('搜索完成');
};

// 重置搜索
const handleReset = () => {
  Object.assign(searchForm, {
    userName: '',
    roleName: '',
    department: '',
    permissionType: '',
    status: '',
  });
  message.info('搜索條件已重置');
};

// 編輯權限
const handleEdit = (record: any, type: string) => {
  Object.assign(editForm, {
    id: record.id,
    type,
    name: record.userName || record.roleName || record.departmentName,
    permissions: { ...record.permissions },
    expiryTime: record.expiryTime || '',
    description: record.description || '',
  });
  editModalVisible.value = true;
};

// 刪除權限
const handleDelete = (record: any, type: string) => {
  let dataSource;
  if (type === 'user') {
    dataSource = userPermissions;
  } else if (type === 'role') {
    dataSource = rolePermissions;
  } else {
    dataSource = departmentPermissions;
  }
  
  const index = dataSource.value.findIndex(item => item.id === record.id);
  if (index > -1) {
    dataSource.value.splice(index, 1);
    message.success(`${type === 'user' ? '用戶' : type === 'role' ? '角色' : '部門'}權限已刪除`);
  }
};

// 切換狀態
const handleToggleStatus = (record: any, type: string) => {
  const newStatus = record.status === 'active' ? 'disabled' : 'active';
  record.status = newStatus;
  const statusText = newStatus === 'active' ? '啟用' : '禁用';
  message.success(`已${statusText}該權限`);
};

// 添加用戶
const handleAddUser = () => {
  Object.assign(addUserForm, {
    users: [],
    role: '',
    permissions: {
      view: true,
      download: false,
      print: false,
      edit: false,
      delete: false,
      share: false,
      upload: false,
      manage: false,
    },
    expiryTime: '',
  });
  addUserModalVisible.value = true;
};

// 保存權限編輯
const handleSaveEdit = () => {
  let dataSource;
  if (editForm.type === 'user') {
    dataSource = userPermissions;
  } else if (editForm.type === 'role') {
    dataSource = rolePermissions;
  } else {
    dataSource = departmentPermissions;
  }
  
  const index = dataSource.value.findIndex(item => item.id === editForm.id);
  if (index > -1) {
    dataSource.value[index].permissions = { ...editForm.permissions };
    if (editForm.expiryTime) {
      dataSource.value[index].expiryTime = editForm.expiryTime;
    }
    if (editForm.description) {
      dataSource.value[index].description = editForm.description;
    }
    dataSource.value[index].updateTime = new Date().toLocaleString('zh-CN');
    message.success('權限已更新');
  }
  
  editModalVisible.value = false;
};

// 保存添加用戶
const handleSaveAddUser = () => {
  if (addUserForm.users.length === 0) {
    message.error('請選擇要添加的用戶');
    return;
  }
  
  addUserForm.users.forEach(userId => {
    const user = availableUsers.value.find(u => u.key === userId);
    if (user) {
      const newPermission = {
        id: `perm-${Date.now()}-${userId}`,
        userId,
        userName: user.title.split(' ')[0],
        userEmail: user.title.match(/\((.+)\)/)?.[1] || '',
        department: user.department === '法務部' ? 'legal' : 'hr',
        departmentName: user.department,
        role: addUserForm.role,
        roleName: roleOptions.find(r => r.value === addUserForm.role)?.label || '',
        permissions: { ...addUserForm.permissions },
        grantTime: new Date().toLocaleString('zh-CN'),
        grantBy: '當前用戶',
        expiryTime: addUserForm.expiryTime || '2024-12-31 23:59:59',
        status: 'active',
        lastAccess: '',
      };
      
      userPermissions.value.push(newPermission);
    }
  });
  
  message.success(`已添加 ${addUserForm.users.length} 個用戶權限`);
  addUserModalVisible.value = false;
};

// 批量操作
const handleBatchOperation = (operation: string) => {
  message.info(`批量${operation}功能開發中...`);
};

// 返回文件列表
const handleBackToList = () => {
  router.push('/legal-platform/document-management/list');
};
</script>

<template>
  <Page>
    <!-- 頁面頭部 -->
    <Card class="mb-4">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-xl font-semibold mb-2">{{ $t('page.legalPlatform.documentPermissions') }}</h2>
          <div class="text-gray-500">管理文件的用戶權限、角色權限和部門權限</div>
        </div>
        <Space>
          <Button @click="handleBackToList">
            <template #icon>
              <span class="icon-[lucide--arrow-left] size-4" />
            </template>
            {{ $t('page.legalPlatform.back') }}
          </Button>
        </Space>
      </div>
    </Card>

    <!-- 搜索表單 -->
    <Card class="mb-4">
      <Form layout="inline" :model="searchForm">
        <FormItem label="用戶名" v-if="activeTab === 'user'">
          <Input 
            v-model:value="searchForm.userName" 
            placeholder="請輸入用戶名" 
            style="width: 150px"
          />
        </FormItem>
        
        <FormItem label="角色名" v-if="activeTab === 'role'">
          <Input 
            v-model:value="searchForm.roleName" 
            placeholder="請輸入角色名" 
            style="width: 150px"
          />
        </FormItem>
        
        <FormItem label="部門">
          <Select 
            v-model:value="searchForm.department" 
            placeholder="請選擇部門" 
            style="width: 150px"
            allow-clear
          >
            <SelectOption 
              v-for="option in departmentOptions" 
              :key="option.value" 
              :value="option.value"
            >
              {{ option.label }}
            </SelectOption>
          </Select>
        </FormItem>
        
        <FormItem label="狀態">
          <Select 
            v-model:value="searchForm.status" 
            placeholder="請選擇狀態" 
            style="width: 120px"
            allow-clear
          >
            <SelectOption 
              v-for="option in statusOptions" 
              :key="option.value" 
              :value="option.value"
            >
              {{ option.label }}
            </SelectOption>
          </Select>
        </FormItem>
        
        <FormItem>
          <Space>
            <Button type="primary" @click="handleSearch">
              <template #icon>
                <span class="icon-[lucide--search] size-4" />
              </template>
              {{ $t('page.legalPlatform.search') }}
            </Button>
            <Button @click="handleReset">
              <template #icon>
                <span class="icon-[lucide--rotate-ccw] size-4" />
              </template>
              {{ $t('page.legalPlatform.reset') }}
            </Button>
          </Space>
        </FormItem>
      </Form>
    </Card>

    <!-- 權限管理標籤頁 -->
    <Card>
      <Tabs v-model:activeKey="activeTab">
        <!-- 用戶權限 -->
        <TabPane key="user" tab="用戶權限">
          <div class="mb-4">
            <Space>
              <Button type="primary" @click="handleAddUser">
                <template #icon>
                  <span class="icon-[lucide--user-plus] size-4" />
                </template>
                添加用戶
              </Button>
              
              <Button @click="handleBatchOperation('授權')">
                <template #icon>
                  <span class="icon-[lucide--users] size-4" />
                </template>
                批量授權
              </Button>
              
              <Button @click="handleBatchOperation('撤銷')">
                <template #icon>
                  <span class="icon-[lucide--user-minus] size-4" />
                </template>
                批量撤銷
              </Button>
            </Space>
          </div>
          
          <Table
            :columns="userColumns"
            :data-source="userPermissions"
            :pagination="pagination"
            :scroll="{ x: 1200 }"
            row-key="id"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'permissions'">
                <Space wrap>
                  <Tag 
                    v-for="permission in getPermissionTags(record.permissions)" 
                    :key="permission" 
                    color="blue"
                  >
                    {{ permission }}
                  </Tag>
                </Space>
              </template>
              
              <template v-if="column.key === 'status'">
                <Tag :color="getStatusTag(record.status).color">
                  {{ getStatusTag(record.status).text }}
                </Tag>
              </template>
              
              <template v-if="column.key === 'action'">
                <Space>
                  <Button size="small" @click="handleEdit(record, 'user')">
                    <template #icon>
                      <span class="icon-[lucide--edit] size-3" />
                    </template>
                    編輯
                  </Button>
                  
                  <Button 
                    size="small" 
                    :type="record.status === 'active' ? 'default' : 'primary'"
                    @click="handleToggleStatus(record, 'user')"
                  >
                    <template #icon>
                      <span :class="record.status === 'active' ? 'icon-[lucide--user-x]' : 'icon-[lucide--user-check]'" class="size-3" />
                    </template>
                    {{ record.status === 'active' ? '禁用' : '啟用' }}
                  </Button>
                  
                  <Popconfirm
                    title="確定要刪除這個用戶權限嗎？"
                    ok-text="確定"
                    cancel-text="取消"
                    @confirm="handleDelete(record, 'user')"
                  >
                    <Button size="small" danger>
                      <template #icon>
                        <span class="icon-[lucide--trash] size-3" />
                      </template>
                      刪除
                    </Button>
                  </Popconfirm>
                </Space>
              </template>
            </template>
          </Table>
        </TabPane>

        <!-- 角色權限 -->
        <TabPane key="role" tab="角色權限">
          <div class="mb-4">
            <Alert
              message="角色權限設置"
              description="修改角色權限將影響所有擁有該角色的用戶，請謹慎操作。"
              type="info"
              show-icon
              class="mb-4"
            />
          </div>
          
          <Table
            :columns="roleColumns"
            :data-source="rolePermissions"
            :pagination="false"
            :scroll="{ x: 1000 }"
            row-key="id"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'permissions'">
                <Space wrap>
                  <Tag 
                    v-for="permission in getPermissionTags(record.permissions)" 
                    :key="permission" 
                    color="green"
                  >
                    {{ permission }}
                  </Tag>
                </Space>
              </template>
              
              <template v-if="column.key === 'status'">
                <Tag :color="getStatusTag(record.status).color">
                  {{ getStatusTag(record.status).text }}
                </Tag>
              </template>
              
              <template v-if="column.key === 'action'">
                <Space>
                  <Button size="small" @click="handleEdit(record, 'role')">
                    <template #icon>
                      <span class="icon-[lucide--edit] size-3" />
                    </template>
                    編輯
                  </Button>
                  
                  <Button 
                    size="small" 
                    :type="record.status === 'active' ? 'default' : 'primary'"
                    @click="handleToggleStatus(record, 'role')"
                  >
                    <template #icon>
                      <span :class="record.status === 'active' ? 'icon-[lucide--eye-off]' : 'icon-[lucide--eye]'" class="size-3" />
                    </template>
                    {{ record.status === 'active' ? '禁用' : '啟用' }}
                  </Button>
                </Space>
              </template>
            </template>
          </Table>
        </TabPane>

        <!-- 部門權限 -->
        <TabPane key="department" tab="部門權限">
          <div class="mb-4">
            <Alert
              message="部門權限設置"
              description="部門權限決定了該部門用戶對文件的默認訪問權限。"
              type="info"
              show-icon
              class="mb-4"
            />
          </div>
          
          <Table
            :columns="departmentColumns"
            :data-source="departmentPermissions"
            :pagination="false"
            :scroll="{ x: 1000 }"
            row-key="id"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'permissions'">
                <Space wrap>
                  <Tag 
                    v-for="permission in getPermissionTags(record.permissions)" 
                    :key="permission" 
                    color="orange"
                  >
                    {{ permission }}
                  </Tag>
                </Space>
              </template>
              
              <template v-if="column.key === 'status'">
                <Tag :color="getStatusTag(record.status).color">
                  {{ getStatusTag(record.status).text }}
                </Tag>
              </template>
              
              <template v-if="column.key === 'action'">
                <Space>
                  <Button size="small" @click="handleEdit(record, 'department')">
                    <template #icon>
                      <span class="icon-[lucide--edit] size-3" />
                    </template>
                    編輯
                  </Button>
                  
                  <Button 
                    size="small" 
                    :type="record.status === 'active' ? 'default' : 'primary'"
                    @click="handleToggleStatus(record, 'department')"
                  >
                    <template #icon>
                      <span :class="record.status === 'active' ? 'icon-[lucide--eye-off]' : 'icon-[lucide--eye]'" class="size-3" />
                    </template>
                    {{ record.status === 'active' ? '禁用' : '啟用' }}
                  </Button>
                </Space>
              </template>
            </template>
          </Table>
        </TabPane>
      </Tabs>
    </Card>

    <!-- 權限編輯模態框 -->
    <Modal
      v-model:open="editModalVisible"
      :title="`編輯${editForm.type === 'user' ? '用戶' : editForm.type === 'role' ? '角色' : '部門'}權限`"
      width="600px"
      @ok="handleSaveEdit"
    >
      <Form layout="vertical" :model="editForm">
        <FormItem :label="editForm.type === 'user' ? '用戶名' : editForm.type === 'role' ? '角色名' : '部門名'">
          <Input v-model:value="editForm.name" disabled />
        </FormItem>
        
        <FormItem label="權限設置">
          <div class="grid grid-cols-2 gap-4">
            <Checkbox v-model:checked="editForm.permissions.view">
              <span class="icon-[lucide--eye] size-4 mr-1" />
              查看權限
            </Checkbox>
            <Checkbox v-model:checked="editForm.permissions.download">
              <span class="icon-[lucide--download] size-4 mr-1" />
              下載權限
            </Checkbox>
            <Checkbox v-model:checked="editForm.permissions.print">
              <span class="icon-[lucide--printer] size-4 mr-1" />
              列印權限
            </Checkbox>
            <Checkbox v-model:checked="editForm.permissions.edit">
              <span class="icon-[lucide--edit] size-4 mr-1" />
              編輯權限
            </Checkbox>
            <Checkbox v-model:checked="editForm.permissions.delete">
              <span class="icon-[lucide--trash] size-4 mr-1" />
              刪除權限
            </Checkbox>
            <Checkbox v-model:checked="editForm.permissions.share">
              <span class="icon-[lucide--share] size-4 mr-1" />
              分享權限
            </Checkbox>
            <Checkbox v-model:checked="editForm.permissions.upload">
              <span class="icon-[lucide--upload] size-4 mr-1" />
              上傳權限
            </Checkbox>
            <Checkbox v-model:checked="editForm.permissions.manage">
              <span class="icon-[lucide--settings] size-4 mr-1" />
              管理權限
            </Checkbox>
          </div>
        </FormItem>
        
        <FormItem label="到期時間" v-if="editForm.type === 'user'">
          <DatePicker 
            v-model:value="editForm.expiryTime" 
            show-time 
            format="YYYY-MM-DD HH:mm:ss"
            style="width: 100%"
          />
        </FormItem>
        
        <FormItem label="描述" v-if="editForm.type !== 'user'">
          <Input.TextArea 
            v-model:value="editForm.description" 
            :rows="3" 
            placeholder="請輸入描述"
          />
        </FormItem>
      </Form>
    </Modal>

    <!-- 添加用戶模態框 -->
    <Modal
      v-model:open="addUserModalVisible"
      title="添加用戶權限"
      width="700px"
      @ok="handleSaveAddUser"
    >
      <Form layout="vertical" :model="addUserForm">
        <FormItem label="選擇用戶" required>
          <Transfer
            v-model:target-keys="addUserForm.users"
            :data-source="availableUsers"
            :titles="['可選用戶', '已選用戶']"
            :render="item => item.title"
          />
        </FormItem>
        
        <FormItem label="分配角色" required>
          <Select v-model:value="addUserForm.role" placeholder="請選擇角色">
            <SelectOption 
              v-for="option in roleOptions" 
              :key="option.value" 
              :value="option.value"
            >
              {{ option.label }}
            </SelectOption>
          </Select>
        </FormItem>
        
        <FormItem label="權限設置">
          <div class="grid grid-cols-2 gap-4">
            <Checkbox v-model:checked="addUserForm.permissions.view">
              <span class="icon-[lucide--eye] size-4 mr-1" />
              查看權限
            </Checkbox>
            <Checkbox v-model:checked="addUserForm.permissions.download">
              <span class="icon-[lucide--download] size-4 mr-1" />
              下載權限
            </Checkbox>
            <Checkbox v-model:checked="addUserForm.permissions.print">
              <span class="icon-[lucide--printer] size-4 mr-1" />
              列印權限
            </Checkbox>
            <Checkbox v-model:checked="addUserForm.permissions.edit">
              <span class="icon-[lucide--edit] size-4 mr-1" />
              編輯權限
            </Checkbox>
            <Checkbox v-model:checked="addUserForm.permissions.delete">
              <span class="icon-[lucide--trash] size-4 mr-1" />
              刪除權限
            </Checkbox>
            <Checkbox v-model:checked="addUserForm.permissions.share">
              <span class="icon-[lucide--share] size-4 mr-1" />
              分享權限
            </Checkbox>
            <Checkbox v-model:checked="addUserForm.permissions.upload">
              <span class="icon-[lucide--upload] size-4 mr-1" />
              上傳權限
            </Checkbox>
            <Checkbox v-model:checked="addUserForm.permissions.manage">
              <span class="icon-[lucide--settings] size-4 mr-1" />
              管理權限
            </Checkbox>
          </div>
        </FormItem>
        
        <FormItem label="到期時間">
          <DatePicker 
            v-model:value="addUserForm.expiryTime" 
            show-time 
            format="YYYY-MM-DD HH:mm:ss"
            style="width: 100%"
            placeholder="不設置則永久有效"
          />
        </FormItem>
      </Form>
    </Modal>
  </Page>
</template>

<style scoped>
.ant-card {
  border-radius: 8px;
}
</style>
