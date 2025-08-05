<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
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
  Pagination,
  message,
  Modal,
  Transfer,
  Tabs,
  TabPane,
  Avatar,
  Tooltip,
  Popconfirm,
  Badge,
} from 'ant-design-vue';

const router = useRouter();

// 搜索表單
const searchForm = reactive({
  userName: '',
  department: undefined,
  role: undefined,
  status: undefined,
});

// 分頁配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number, range: [number, number]) => 
    `第 ${range[0]}-${range[1]} 條，共 ${total} 條`,
});

// 用戶數據
const userData = ref([
  {
    id: 'user001',
    userName: 'João Silva',
    email: 'zhangsan@company.com',
    department: '法制研究及立法統籌廳',
    departmentId: 'dept001',
    role: '部門經理',
    roleId: 'role001',
    avatar: '',
    phone: '13800138001',
    joinTime: '2023-01-15',
    lastLoginTime: '2024-01-20 10:30:00',
    status: 'active',
    permissions: {
      folderAccess: ['read', 'write', 'delete'],
      fileAccess: ['read', 'write', 'upload', 'download'],
      adminAccess: ['manage_users', 'manage_permissions'],
    },

    storageUsed: '2.5GB',
  },
  {
    id: 'user002',
    userName: 'Maria Santos',
    email: 'lisi@company.com',
    department: '法制研究及立法統籌廳',
    departmentId: 'dept001',
    role: '法務專員',
    roleId: 'role002',
    avatar: '',
    phone: '13800138002',
    joinTime: '2023-03-20',
    lastLoginTime: '2024-01-20 09:15:00',
    status: 'active',
    permissions: {
      folderAccess: ['read', 'write'],
      fileAccess: ['read', 'write', 'upload', 'download'],
      adminAccess: [],
    },

    storageUsed: '1.2GB',
  },
  {
    id: 'user003',
    userName: 'Pedro Costa',
    email: 'wangwu@company.com',
    department: '法律草擬廳',
    departmentId: 'dept002',
    role: '人事專員',
    roleId: 'role003',
    avatar: '',
    phone: '13800138003',
    joinTime: '2023-06-10',
    lastLoginTime: '2024-01-19 16:45:00',
    status: 'active',
    permissions: {
      folderAccess: ['read'],
      fileAccess: ['read', 'download'],
      adminAccess: [],
    },

    storageUsed: '0.5GB',
  },
  {
    id: 'user004',
    userName: 'Ana Ferreira',
    email: 'zhaoliu@company.com',
    department: '法務部',
    departmentId: 'dept001',
    role: '實習生',
    roleId: 'role004',
    avatar: '',
    phone: '13800138004',
    joinTime: '2023-09-01',
    lastLoginTime: '2024-01-18 14:20:00',
    status: 'inactive',
    permissions: {
      folderAccess: ['read'],
      fileAccess: ['read'],
      adminAccess: [],
    },

    storageUsed: '0.1GB',
  },
]);

// 表格列配置
const columns = [
  {
    title: '用戶信息',
    dataIndex: 'userName',
    key: 'userName',
    width: 200,
  },
  {
    title: '部門',
    dataIndex: 'department',
    key: 'department',
    width: 120,
  },
  {
    title: '角色',
    dataIndex: 'role',
    key: 'role',
    width: 120,
  },

  {
    title: '存儲使用',
    dataIndex: 'storageUsed',
    key: 'storageUsed',
    width: 100,
  },
  {
    title: '最後登錄',
    dataIndex: 'lastLoginTime',
    key: 'lastLoginTime',
    width: 180,
  },
  {
    title: '狀態',
    dataIndex: 'status',
    key: 'status',
    width: 100,
  },
  {
    title: $t('page.legalPlatform.action'),
    key: 'action',
    width: 250,
    fixed: 'right',
  },
];

// 部門選項
const departmentOptions = [
  { label: '法制研究及立法統籌廳', value: 'dept001' },
  { label: '法律草擬廳', value: 'dept002' },
  { label: '法律翻譯廳', value: 'dept003' },
  { label: '技術部', value: 'dept004' },
];

// 角色選項
const roleOptions = [
  { label: '部門經理', value: 'role001' },
  { label: '法務專員', value: 'role002' },
  { label: '人事專員', value: 'role003' },
  { label: '實習生', value: 'role004' },
];

// 狀態選項
const statusOptions = [
  { label: '啟用', value: 'active' },
  { label: '停用', value: 'inactive' },
];

// 權限選項
const permissionOptions = {
  folderAccess: [
    { label: '查看', value: 'read' },
    { label: '編輯', value: 'write' },
    { label: '刪除', value: 'delete' },
    { label: '管理', value: 'manage' },
  ],
  fileAccess: [
    { label: '查看', value: 'read' },
    { label: '編輯', value: 'write' },
    { label: '上傳', value: 'upload' },
    { label: '下載', value: 'download' },
    { label: '刪除', value: 'delete' },
  ],
  adminAccess: [
    { label: '用戶管理', value: 'manage_users' },
    { label: '權限管理', value: 'manage_permissions' },
    { label: '系統設置', value: 'system_settings' },
  ],
};

// 模態框狀態
const showPermissionModal = ref(false);
const showAddUserModal = ref(false);
const currentUser = ref({});
const activeTab = ref('folderAccess');

// 添加用戶表單
const addUserForm = reactive({
  userIds: [],
  permissions: {
    folderAccess: ['read'],
    fileAccess: ['read'],
    adminAccess: [],
  },
});

// 可添加的用戶列表
const availableUsers = ref([
  { key: 'user005', title: 'Carlos Oliveira (carlos@company.com)', department: '法制研究及立法統籌廳' },
  { key: 'user006', title: 'Sofia Rodrigues (sofia@company.com)', department: '法律草擬廳' },
  { key: 'user007', title: 'Miguel Pereira (miguel@company.com)', department: '法律翻譯廳' },
  { key: 'user008', title: 'Luís Costa (luis@company.com)', department: '技術部' },
]);

// 搜索
const handleSearch = () => {
  console.log('搜索條件:', searchForm);
  message.success('搜索成功');
};

// 重置
const handleReset = () => {
  Object.assign(searchForm, {
    userName: '',
    department: undefined,
    role: undefined,
    status: undefined,
  });
  message.success('重置成功');
};

// 管理權限
const handleManagePermissions = (record: any) => {
  currentUser.value = { ...record };
  showPermissionModal.value = true;
};

// 移除用戶
const handleRemoveUser = (record: any) => {
  console.log('移除用戶:', record.id);
  message.success('用戶移除成功');
};

// 切換用戶狀態
const handleToggleStatus = (record: any) => {
  const newStatus = record.status === 'active' ? 'inactive' : 'active';
  console.log('切換用戶狀態:', record.id, newStatus);
  record.status = newStatus;
  message.success(`用戶已${newStatus === 'active' ? '啟用' : '停用'}`);
};

// 查看用戶詳情
const handleViewDetail = (record: any) => {
  console.log('查看用戶詳情:', record.id);
  // 這裡可以跳轉到用戶詳情頁面或打開詳情模態框
};

// 添加用戶
const handleAddUser = () => {
  addUserForm.userIds = [];
  addUserForm.permissions = {
    folderAccess: ['read'],
    fileAccess: ['read'],
    adminAccess: [],
  };
  showAddUserModal.value = true;
};

// 保存權限
const handleSavePermissions = () => {
  console.log('保存權限:', currentUser.value);
  message.success('權限保存成功');
  showPermissionModal.value = false;
};

// 保存添加用戶
const handleSaveAddUser = () => {
  if (addUserForm.userIds.length === 0) {
    message.error('請選擇要添加的用戶');
    return;
  }
  console.log('添加用戶:', addUserForm);
  message.success('用戶添加成功');
  showAddUserModal.value = false;
};

// 返回
const handleBack = () => {
  router.back();
};

// 分頁變化
const handlePageChange = (page: number, pageSize: number) => {
  pagination.current = page;
  pagination.pageSize = pageSize;
};

// 獲取狀態標籤顏色
const getStatusColor = (status: string) => {
  return status === 'active' ? 'green' : 'red';
};

// 獲取權限標籤顏色
const getPermissionColor = (permission: string) => {
  const colorMap: Record<string, string> = {
    read: 'blue',
    write: 'green',
    delete: 'red',
    upload: 'cyan',
    download: 'purple',
    manage: 'orange',
    manage_users: 'magenta',
    manage_permissions: 'volcano',
    system_settings: 'geekblue',
  };
  return colorMap[permission] || 'default';
};

// 獲取權限名稱
const getPermissionName = (permission: string) => {
  const nameMap: Record<string, string> = {
    read: '查看',
    write: '編輯',
    delete: '刪除',
    upload: '上傳',
    download: '下載',
    manage: '管理',
    manage_users: '用戶管理',
    manage_permissions: '權限管理',
    system_settings: '系統設置',
  };
  return nameMap[permission] || permission;
};

// 組件掛載時加載數據
onMounted(() => {
  pagination.total = userData.value.length;
});
</script>

<template>
  <Page>
    <!-- 頁面頭部 -->
    <Card class="mb-4">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-xl font-semibold mb-2">文件夾用戶管理</h2>
          <div class="text-gray-500">管理有權限訪問文件夾的用戶</div>
        </div>
        <Space>
          <Button type="primary" @click="handleAddUser">
            <template #icon>
              <span class="icon-[lucide--user-plus] size-4" />
            </template>
            添加用戶
          </Button>
          <Button @click="handleBack">
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
      <Form layout="vertical">
        <Row :gutter="16">
          <Col :span="6">
            <FormItem label="用戶名稱">
              <Input 
                v-model:value="searchForm.userName" 
                placeholder="請輸入用戶名稱"
              />
            </FormItem>
          </Col>
          <Col :span="6">
            <FormItem label="部門">
              <Select 
                v-model:value="searchForm.department" 
                placeholder="請選擇部門"
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
          </Col>
          <Col :span="6">
            <FormItem label="角色">
              <Select 
                v-model:value="searchForm.role" 
                placeholder="請選擇角色"
                allow-clear
              >
                <SelectOption 
                  v-for="option in roleOptions" 
                  :key="option.value" 
                  :value="option.value"
                >
                  {{ option.label }}
                </SelectOption>
              </Select>
            </FormItem>
          </Col>
          <Col :span="6">
            <FormItem>
              <Space class="mt-6">
                <Button type="primary" @click="handleSearch">
                  <template #icon>
                    <span class="icon-[lucide--search] size-4" />
                  </template>
                  {{ $t('page.legalPlatform.search') }}
                </Button>
                <Button @click="handleReset">
                  <template #icon>
                    <span class="icon-[lucide--refresh-cw] size-4" />
                  </template>
                  {{ $t('page.legalPlatform.reset') }}
                </Button>
              </Space>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Card>

    <!-- 用戶列表 -->
    <Card>
      <Table
        :columns="columns"
        :data-source="userData"
        :pagination="false"
        :scroll="{ x: 1400 }"
        row-key="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'userName'">
            <div class="flex items-center">
              <Avatar class="mr-3">
                <template #icon>
                  <span class="icon-[lucide--user] size-4" />
                </template>
              </Avatar>
              <div>
                <div class="font-medium">{{ record.userName }}</div>
                <div class="text-xs text-gray-500">{{ record.email }}</div>
                <div class="text-xs text-gray-500">{{ record.phone }}</div>
              </div>
            </div>
          </template>
          <template v-else-if="column.key === 'department'">
            <Tag color="blue">{{ record.department }}</Tag>
          </template>
          <template v-else-if="column.key === 'role'">
            <Tag color="green">{{ record.role }}</Tag>
          </template>
          <template v-else-if="column.key === 'folderCount'">
            <Badge :count="record.folderCount" :number-style="{ backgroundColor: '#52c41a' }" />
          </template>
          <template v-else-if="column.key === 'fileCount'">
            <Badge :count="record.fileCount" :number-style="{ backgroundColor: '#1890ff' }" />
          </template>
          <template v-else-if="column.key === 'status'">
            <Tag :color="getStatusColor(record.status)">
              {{ statusOptions.find(opt => opt.value === record.status)?.label }}
            </Tag>
          </template>
          <template v-else-if="column.key === 'action'">
            <Space>
              <Button type="link" size="small" @click="handleViewDetail(record)">
                <template #icon>
                  <span class="icon-[lucide--eye] size-4" />
                </template>
                查看詳情
              </Button>
              <Button type="link" size="small" @click="handleManagePermissions(record)">
                <template #icon>
                  <span class="icon-[lucide--shield] size-4" />
                </template>
                管理權限
              </Button>
              <Button 
                type="link" 
                size="small" 
                @click="handleToggleStatus(record)"
                :class="record.status === 'active' ? 'text-orange-500' : 'text-green-500'"
              >
                <template #icon>
                  <span 
                    :class="record.status === 'active' ? 'icon-[lucide--pause]' : 'icon-[lucide--play]'"
                    class="size-4" 
                  />
                </template>
                {{ record.status === 'active' ? '停用' : '啟用' }}
              </Button>
              <Popconfirm
                title="確定要移除這個用戶嗎？"
                @confirm="handleRemoveUser(record)"
              >
                <Button type="link" size="small" danger>
                  <template #icon>
                    <span class="icon-[lucide--user-minus] size-4" />
                  </template>
                  移除
                </Button>
              </Popconfirm>
            </Space>
          </template>
        </template>
      </Table>

      <div class="mt-4 flex justify-end">
        <Pagination
          v-model:current="pagination.current"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          :show-size-changer="pagination.showSizeChanger"
          :show-quick-jumper="pagination.showQuickJumper"
          :show-total="pagination.showTotal"
          @change="handlePageChange"
        />
      </div>
    </Card>

    <!-- 權限管理模態框 -->
    <Modal
      v-model:open="showPermissionModal"
      title="管理用戶權限"
      @ok="handleSavePermissions"
      width="600px"
    >
      <div class="mb-4">
        <div class="flex items-center mb-2">
          <Avatar class="mr-3">
            <template #icon>
              <span class="icon-[lucide--user] size-4" />
            </template>
          </Avatar>
          <div>
            <div class="font-medium">{{ currentUser.userName }}</div>
            <div class="text-sm text-gray-500">{{ currentUser.email }}</div>
          </div>
        </div>
      </div>

      <Tabs v-model:activeKey="activeTab">
        <TabPane key="folderAccess" tab="文件夾權限">
          <div class="space-y-2">
            <div 
              v-for="permission in permissionOptions.folderAccess" 
              :key="permission.value"
              class="flex items-center justify-between p-2 border rounded"
            >
              <div>
                <div class="font-medium">{{ permission.label }}</div>
                <div class="text-sm text-gray-500">{{ permission.value }}</div>
              </div>
              <input 
                type="checkbox" 
                :checked="currentUser.permissions?.folderAccess?.includes(permission.value)"
                @change="(e) => {
                  if (e.target.checked) {
                    if (!currentUser.permissions.folderAccess.includes(permission.value)) {
                      currentUser.permissions.folderAccess.push(permission.value);
                    }
                  } else {
                    const index = currentUser.permissions.folderAccess.indexOf(permission.value);
                    if (index > -1) {
                      currentUser.permissions.folderAccess.splice(index, 1);
                    }
                  }
                }"
              />
            </div>
          </div>
        </TabPane>
        
        <TabPane key="fileAccess" tab="文件權限">
          <div class="space-y-2">
            <div 
              v-for="permission in permissionOptions.fileAccess" 
              :key="permission.value"
              class="flex items-center justify-between p-2 border rounded"
            >
              <div>
                <div class="font-medium">{{ permission.label }}</div>
                <div class="text-sm text-gray-500">{{ permission.value }}</div>
              </div>
              <input 
                type="checkbox" 
                :checked="currentUser.permissions?.fileAccess?.includes(permission.value)"
                @change="(e) => {
                  if (e.target.checked) {
                    if (!currentUser.permissions.fileAccess.includes(permission.value)) {
                      currentUser.permissions.fileAccess.push(permission.value);
                    }
                  } else {
                    const index = currentUser.permissions.fileAccess.indexOf(permission.value);
                    if (index > -1) {
                      currentUser.permissions.fileAccess.splice(index, 1);
                    }
                  }
                }"
              />
            </div>
          </div>
        </TabPane>
        
        <TabPane key="adminAccess" tab="管理權限">
          <div class="space-y-2">
            <div 
              v-for="permission in permissionOptions.adminAccess" 
              :key="permission.value"
              class="flex items-center justify-between p-2 border rounded"
            >
              <div>
                <div class="font-medium">{{ permission.label }}</div>
                <div class="text-sm text-gray-500">{{ permission.value }}</div>
              </div>
              <input 
                type="checkbox" 
                :checked="currentUser.permissions?.adminAccess?.includes(permission.value)"
                @change="(e) => {
                  if (e.target.checked) {
                    if (!currentUser.permissions.adminAccess.includes(permission.value)) {
                      currentUser.permissions.adminAccess.push(permission.value);
                    }
                  } else {
                    const index = currentUser.permissions.adminAccess.indexOf(permission.value);
                    if (index > -1) {
                      currentUser.permissions.adminAccess.splice(index, 1);
                    }
                  }
                }"
              />
            </div>
          </div>
        </TabPane>
      </Tabs>
    </Modal>

    <!-- 添加用戶模態框 -->
    <Modal
      v-model:open="showAddUserModal"
      title="添加用戶"
      @ok="handleSaveAddUser"
      width="800px"
    >
      <div class="mb-4">
        <h4 class="text-lg font-medium mb-2">選擇用戶</h4>
        <Transfer
          v-model:target-keys="addUserForm.userIds"
          :data-source="availableUsers"
          :titles="['可選用戶', '已選用戶']"
          :render="item => item.title"
        />
      </div>

      <div class="mt-6">
        <h4 class="text-lg font-medium mb-2">設置權限</h4>
        <Tabs>
          <TabPane key="folderAccess" tab="文件夾權限">
            <div class="grid grid-cols-2 gap-2">
              <div 
                v-for="permission in permissionOptions.folderAccess" 
                :key="permission.value"
                class="flex items-center"
              >
                <input 
                  type="checkbox" 
                  :checked="addUserForm.permissions.folderAccess.includes(permission.value)"
                  @change="(e) => {
                    if (e.target.checked) {
                      if (!addUserForm.permissions.folderAccess.includes(permission.value)) {
                        addUserForm.permissions.folderAccess.push(permission.value);
                      }
                    } else {
                      const index = addUserForm.permissions.folderAccess.indexOf(permission.value);
                      if (index > -1) {
                        addUserForm.permissions.folderAccess.splice(index, 1);
                      }
                    }
                  }"
                  class="mr-2"
                />
                <span>{{ permission.label }}</span>
              </div>
            </div>
          </TabPane>
          
          <TabPane key="fileAccess" tab="文件權限">
            <div class="grid grid-cols-2 gap-2">
              <div 
                v-for="permission in permissionOptions.fileAccess" 
                :key="permission.value"
                class="flex items-center"
              >
                <input 
                  type="checkbox" 
                  :checked="addUserForm.permissions.fileAccess.includes(permission.value)"
                  @change="(e) => {
                    if (e.target.checked) {
                      if (!addUserForm.permissions.fileAccess.includes(permission.value)) {
                        addUserForm.permissions.fileAccess.push(permission.value);
                      }
                    } else {
                      const index = addUserForm.permissions.fileAccess.indexOf(permission.value);
                      if (index > -1) {
                        addUserForm.permissions.fileAccess.splice(index, 1);
                      }
                    }
                  }"
                  class="mr-2"
                />
                <span>{{ permission.label }}</span>
              </div>
            </div>
          </TabPane>
        </Tabs>
      </div>
    </Modal>
  </Page>
</template>

<style scoped>
.ant-card {
  border-radius: 8px;
}
</style>
