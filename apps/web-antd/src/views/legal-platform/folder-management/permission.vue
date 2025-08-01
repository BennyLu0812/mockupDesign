<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
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
  Row,
  Select,
  SelectOption,
  Space,
  Table,
  Tag,
  Modal,
  Switch,
  Checkbox,
  CheckboxGroup,
  Transfer,
  Tabs,
  TabPane,
  message,
  Divider,
} from 'ant-design-vue';

const router = useRouter();
const route = useRoute();

// 文件夾ID
const folderId = ref(route.query.id as string);

// 當前選中的標籤頁
const activeTab = ref('department');

// 部門權限數據
const departmentPermissions = ref([
  {
    id: '1',
    departmentName: '法務部',
    permissions: ['view', 'edit', 'upload', 'download', 'delete'],
    permissionLevel: 'fullAccess',
    inheritFromParent: false,
    createTime: '2024-01-15 10:30:00',
  },
  {
    id: '2',
    departmentName: '研究部',
    permissions: ['view', 'download'],
    permissionLevel: 'readOnly',
    inheritFromParent: true,
    createTime: '2024-01-16 14:20:00',
  },
  {
    id: '3',
    departmentName: '行政部',
    permissions: ['view', 'upload'],
    permissionLevel: 'custom',
    inheritFromParent: false,
    createTime: '2024-01-17 09:15:00',
  },
]);

// 角色權限數據
const rolePermissions = ref([
  {
    id: '1',
    roleName: '管理員',
    permissions: ['view', 'edit', 'upload', 'download', 'delete', 'manage'],
    permissionLevel: 'fullAccess',
    userCount: 5,
    createTime: '2024-01-15 10:30:00',
  },
  {
    id: '2',
    roleName: '編輯者',
    permissions: ['view', 'edit', 'upload', 'download'],
    permissionLevel: 'readWrite',
    userCount: 12,
    createTime: '2024-01-16 14:20:00',
  },
  {
    id: '3',
    roleName: '查看者',
    permissions: ['view', 'download'],
    permissionLevel: 'readOnly',
    userCount: 25,
    createTime: '2024-01-17 09:15:00',
  },
]);

// 用戶權限數據
const userPermissions = ref([
  {
    id: '1',
    userName: '張三',
    userEmail: 'zhangsan@example.com',
    department: '法務部',
    role: '管理員',
    permissions: ['view', 'edit', 'upload', 'download', 'delete'],
    permissionLevel: 'fullAccess',
    lastAccess: '2024-01-20 15:30:00',
  },
  {
    id: '2',
    userName: '李四',
    userEmail: 'lisi@example.com',
    department: '研究部',
    role: '編輯者',
    permissions: ['view', 'edit', 'upload', 'download'],
    permissionLevel: 'readWrite',
    lastAccess: '2024-01-19 11:20:00',
  },
  {
    id: '3',
    userName: '王五',
    userEmail: 'wangwu@example.com',
    department: '行政部',
    role: '查看者',
    permissions: ['view', 'download'],
    permissionLevel: 'readOnly',
    lastAccess: '2024-01-18 09:45:00',
  },
]);

// 權限選項
const permissionOptions = [
  { label: $t('page.legalPlatform.viewPermission'), value: 'view' },
  { label: $t('page.legalPlatform.editPermission'), value: 'edit' },
  { label: $t('page.legalPlatform.deletePermission'), value: 'delete' },
  { label: $t('page.legalPlatform.uploadPermission'), value: 'upload' },
  { label: $t('page.legalPlatform.downloadPermission'), value: 'download' },
  { label: $t('page.legalPlatform.sharePermission'), value: 'share' },
  { label: $t('page.legalPlatform.managePermission'), value: 'manage' },
];

// 權限級別選項
const permissionLevelOptions = [
  { label: $t('page.legalPlatform.fullAccess'), value: 'fullAccess' },
  { label: $t('page.legalPlatform.readWrite'), value: 'readWrite' },
  { label: $t('page.legalPlatform.readOnly'), value: 'readOnly' },
  { label: $t('page.legalPlatform.noAccess'), value: 'noAccess' },
  { label: $t('page.legalPlatform.customPermissions'), value: 'custom' },
];

// 部門選項
const departmentOptions = [
  { label: '法務部', value: 'legal' },
  { label: '研究部', value: 'research' },
  { label: '行政部', value: 'admin' },
  { label: '財務部', value: 'finance' },
];

// 角色選項
const roleOptions = [
  { label: '管理員', value: 'admin' },
  { label: '編輯者', value: 'editor' },
  { label: '查看者', value: 'viewer' },
];

// 部門權限表格列
const departmentColumns = [
  {
    title: '部門名稱',
    dataIndex: 'departmentName',
    key: 'departmentName',
    width: 150,
  },
  {
    title: '權限級別',
    dataIndex: 'permissionLevel',
    key: 'permissionLevel',
    width: 120,
  },
  {
    title: '具體權限',
    dataIndex: 'permissions',
    key: 'permissions',
    width: 300,
  },
  {
    title: '繼承父級',
    dataIndex: 'inheritFromParent',
    key: 'inheritFromParent',
    width: 100,
  },
  {
    title: '創建時間',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 180,
  },
  {
    title: '操作',
    key: 'action',
    width: 150,
    fixed: 'right',
  },
];

// 角色權限表格列
const roleColumns = [
  {
    title: '角色名稱',
    dataIndex: 'roleName',
    key: 'roleName',
    width: 120,
  },
  {
    title: '權限級別',
    dataIndex: 'permissionLevel',
    key: 'permissionLevel',
    width: 120,
  },
  {
    title: '具體權限',
    dataIndex: 'permissions',
    key: 'permissions',
    width: 300,
  },
  {
    title: '用戶數量',
    dataIndex: 'userCount',
    key: 'userCount',
    width: 100,
  },
  {
    title: '創建時間',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 180,
  },
  {
    title: '操作',
    key: 'action',
    width: 150,
    fixed: 'right',
  },
];

// 用戶權限表格列
const userColumns = [
  {
    title: '用戶名',
    dataIndex: 'userName',
    key: 'userName',
    width: 100,
  },
  {
    title: '郵箱',
    dataIndex: 'userEmail',
    key: 'userEmail',
    width: 180,
  },
  {
    title: '部門',
    dataIndex: 'department',
    key: 'department',
    width: 100,
  },
  {
    title: '角色',
    dataIndex: 'role',
    key: 'role',
    width: 100,
  },
  {
    title: '權限級別',
    dataIndex: 'permissionLevel',
    key: 'permissionLevel',
    width: 120,
  },
  {
    title: '最後訪問',
    dataIndex: 'lastAccess',
    key: 'lastAccess',
    width: 180,
  },
  {
    title: '操作',
    key: 'action',
    width: 150,
    fixed: 'right',
  },
];

// 新增部門權限表單
const departmentForm = reactive({
  department: undefined,
  permissionLevel: 'readOnly',
  permissions: [],
  inheritFromParent: false,
});

// 新增角色權限表單
const roleForm = reactive({
  role: undefined,
  permissionLevel: 'readOnly',
  permissions: [],
});

// 新增用戶權限表單
const userForm = reactive({
  users: [],
  permissionLevel: 'readOnly',
  permissions: [],
});

// 可選用戶列表（用於穿梭框）
const availableUsers = ref([
  { key: '1', title: '張三 (zhangsan@example.com)' },
  { key: '2', title: '李四 (lisi@example.com)' },
  { key: '3', title: '王五 (wangwu@example.com)' },
  { key: '4', title: '趙六 (zhaoliu@example.com)' },
  { key: '5', title: '錢七 (qianqi@example.com)' },
]);

// 模態框顯示狀態
const showDepartmentModal = ref(false);
const showRoleModal = ref(false);
const showUserModal = ref(false);

// 返回
const handleBack = () => {
  router.back();
};

// 添加部門權限
const handleAddDepartment = () => {
  showDepartmentModal.value = true;
};

// 添加角色權限
const handleAddRole = () => {
  showRoleModal.value = true;
};

// 添加用戶權限
const handleAddUser = () => {
  showUserModal.value = true;
};

// 編輯權限
const handleEdit = (record: any, type: string) => {
  console.log('編輯權限:', record, type);
  message.info('打開編輯權限對話框');
};

// 刪除權限
const handleDelete = (record: any, type: string) => {
  Modal.confirm({
    title: '確認刪除',
    content: `確定要刪除該${type}權限嗎？`,
    onOk() {
      message.success('權限刪除成功');
    },
  });
};

// 保存部門權限
const handleSaveDepartment = () => {
  console.log('保存部門權限:', departmentForm);
  message.success('部門權限添加成功');
  showDepartmentModal.value = false;
};

// 保存角色權限
const handleSaveRole = () => {
  console.log('保存角色權限:', roleForm);
  message.success('角色權限添加成功');
  showRoleModal.value = false;
};

// 保存用戶權限
const handleSaveUser = () => {
  console.log('保存用戶權限:', userForm);
  message.success('用戶權限添加成功');
  showUserModal.value = false;
};

// 獲取權限級別顏色
const getPermissionLevelColor = (level: string) => {
  const colorMap: Record<string, string> = {
    fullAccess: 'green',
    readWrite: 'blue',
    readOnly: 'orange',
    noAccess: 'red',
    custom: 'purple',
  };
  return colorMap[level] || 'default';
};

// 獲取權限標籤
const getPermissionTags = (permissions: string[]) => {
  return permissions.map(permission => {
    const option = permissionOptions.find(opt => opt.value === permission);
    return option ? option.label : permission;
  });
};

// 組件掛載時加載數據
onMounted(() => {
  console.log('加載文件夾權限:', folderId.value);
});
</script>

<template>
  <Page>
    <!-- 頁面頭部 -->
    <Card class="mb-4">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-xl font-semibold mb-2">文件夾權限管理</h2>
          <div class="text-gray-500">管理文件夾的部門、角色和用戶權限</div>
        </div>
        <Space>
          <Button @click="handleBack">
            <template #icon>
              <span class="icon-[lucide--arrow-left] size-4" />
            </template>
            {{ $t('page.legalPlatform.back') }}
          </Button>
        </Space>
      </div>
    </Card>

    <!-- 權限管理標籤頁 -->
    <Card>
      <Tabs v-model:activeKey="activeTab">
        <!-- 部門權限 -->
        <TabPane key="department" tab="部門權限">
          <div class="mb-4">
            <Button type="primary" @click="handleAddDepartment">
              <template #icon>
                <span class="icon-[lucide--plus] size-4" />
              </template>
              添加部門權限
            </Button>
          </div>

          <Table
            :columns="departmentColumns"
            :data-source="departmentPermissions"
            :pagination="false"
            row-key="id"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'permissionLevel'">
                <Tag :color="getPermissionLevelColor(record.permissionLevel)">
                  {{ permissionLevelOptions.find(opt => opt.value === record.permissionLevel)?.label }}
                </Tag>
              </template>
              <template v-else-if="column.key === 'permissions'">
                <Space wrap>
                  <Tag 
                    v-for="permission in getPermissionTags(record.permissions)" 
                    :key="permission" 
                    color="blue"
                    size="small"
                  >
                    {{ permission }}
                  </Tag>
                </Space>
              </template>
              <template v-else-if="column.key === 'inheritFromParent'">
                <Tag :color="record.inheritFromParent ? 'green' : 'orange'">
                  {{ record.inheritFromParent ? '是' : '否' }}
                </Tag>
              </template>
              <template v-else-if="column.key === 'action'">
                <Space>
                  <Button type="link" size="small" @click="handleEdit(record, '部門')">
                    <template #icon>
                      <span class="icon-[lucide--edit] size-4" />
                    </template>
                    編輯
                  </Button>
                  <Button type="link" size="small" danger @click="handleDelete(record, '部門')">
                    <template #icon>
                      <span class="icon-[lucide--trash-2] size-4" />
                    </template>
                    刪除
                  </Button>
                </Space>
              </template>
            </template>
          </Table>
        </TabPane>

        <!-- 角色權限 -->
        <TabPane key="role" tab="角色權限">
          <div class="mb-4">
            <Button type="primary" @click="handleAddRole">
              <template #icon>
                <span class="icon-[lucide--plus] size-4" />
              </template>
              添加角色權限
            </Button>
          </div>

          <Table
            :columns="roleColumns"
            :data-source="rolePermissions"
            :pagination="false"
            row-key="id"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'permissionLevel'">
                <Tag :color="getPermissionLevelColor(record.permissionLevel)">
                  {{ permissionLevelOptions.find(opt => opt.value === record.permissionLevel)?.label }}
                </Tag>
              </template>
              <template v-else-if="column.key === 'permissions'">
                <Space wrap>
                  <Tag 
                    v-for="permission in getPermissionTags(record.permissions)" 
                    :key="permission" 
                    color="blue"
                    size="small"
                  >
                    {{ permission }}
                  </Tag>
                </Space>
              </template>
              <template v-else-if="column.key === 'action'">
                <Space>
                  <Button type="link" size="small" @click="handleEdit(record, '角色')">
                    <template #icon>
                      <span class="icon-[lucide--edit] size-4" />
                    </template>
                    編輯
                  </Button>
                  <Button type="link" size="small" danger @click="handleDelete(record, '角色')">
                    <template #icon>
                      <span class="icon-[lucide--trash-2] size-4" />
                    </template>
                    刪除
                  </Button>
                </Space>
              </template>
            </template>
          </Table>
        </TabPane>

        <!-- 用戶權限 -->
        <TabPane key="user" tab="用戶權限">
          <div class="mb-4">
            <Button type="primary" @click="handleAddUser">
              <template #icon>
                <span class="icon-[lucide--plus] size-4" />
              </template>
              添加用戶權限
            </Button>
          </div>

          <Table
            :columns="userColumns"
            :data-source="userPermissions"
            :pagination="false"
            row-key="id"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'permissionLevel'">
                <Tag :color="getPermissionLevelColor(record.permissionLevel)">
                  {{ permissionLevelOptions.find(opt => opt.value === record.permissionLevel)?.label }}
                </Tag>
              </template>
              <template v-else-if="column.key === 'action'">
                <Space>
                  <Button type="link" size="small" @click="handleEdit(record, '用戶')">
                    <template #icon>
                      <span class="icon-[lucide--edit] size-4" />
                    </template>
                    編輯
                  </Button>
                  <Button type="link" size="small" danger @click="handleDelete(record, '用戶')">
                    <template #icon>
                      <span class="icon-[lucide--trash-2] size-4" />
                    </template>
                    刪除
                  </Button>
                </Space>
              </template>
            </template>
          </Table>
        </TabPane>
      </Tabs>
    </Card>

    <!-- 添加部門權限模態框 -->
    <Modal
      v-model:open="showDepartmentModal"
      title="添加部門權限"
      @ok="handleSaveDepartment"
    >
      <Form :model="departmentForm" layout="vertical">
        <FormItem label="選擇部門" name="department">
          <Select v-model:value="departmentForm.department" placeholder="請選擇部門">
            <SelectOption v-for="dept in departmentOptions" :key="dept.value" :value="dept.value">
              {{ dept.label }}
            </SelectOption>
          </Select>
        </FormItem>
        
        <FormItem label="權限級別" name="permissionLevel">
          <Select v-model:value="departmentForm.permissionLevel" placeholder="請選擇權限級別">
            <SelectOption v-for="level in permissionLevelOptions" :key="level.value" :value="level.value">
              {{ level.label }}
            </SelectOption>
          </Select>
        </FormItem>

        <FormItem v-if="departmentForm.permissionLevel === 'custom'" label="自定義權限" name="permissions">
          <CheckboxGroup v-model:value="departmentForm.permissions">
            <Row :gutter="[16, 8]">
              <Col v-for="permission in permissionOptions" :key="permission.value" :span="12">
                <Checkbox :value="permission.value">
                  {{ permission.label }}
                </Checkbox>
              </Col>
            </Row>
          </CheckboxGroup>
        </FormItem>

        <FormItem label="繼承父級權限" name="inheritFromParent">
          <Switch v-model:checked="departmentForm.inheritFromParent" />
        </FormItem>
      </Form>
    </Modal>

    <!-- 添加角色權限模態框 -->
    <Modal
      v-model:open="showRoleModal"
      title="添加角色權限"
      @ok="handleSaveRole"
    >
      <Form :model="roleForm" layout="vertical">
        <FormItem label="選擇角色" name="role">
          <Select v-model:value="roleForm.role" placeholder="請選擇角色">
            <SelectOption v-for="role in roleOptions" :key="role.value" :value="role.value">
              {{ role.label }}
            </SelectOption>
          </Select>
        </FormItem>
        
        <FormItem label="權限級別" name="permissionLevel">
          <Select v-model:value="roleForm.permissionLevel" placeholder="請選擇權限級別">
            <SelectOption v-for="level in permissionLevelOptions" :key="level.value" :value="level.value">
              {{ level.label }}
            </SelectOption>
          </Select>
        </FormItem>

        <FormItem v-if="roleForm.permissionLevel === 'custom'" label="自定義權限" name="permissions">
          <CheckboxGroup v-model:value="roleForm.permissions">
            <Row :gutter="[16, 8]">
              <Col v-for="permission in permissionOptions" :key="permission.value" :span="12">
                <Checkbox :value="permission.value">
                  {{ permission.label }}
                </Checkbox>
              </Col>
            </Row>
          </CheckboxGroup>
        </FormItem>
      </Form>
    </Modal>

    <!-- 添加用戶權限模態框 -->
    <Modal
      v-model:open="showUserModal"
      title="添加用戶權限"
      width="800px"
      @ok="handleSaveUser"
    >
      <Form :model="userForm" layout="vertical">
        <FormItem label="選擇用戶" name="users">
          <Transfer
            v-model:target-keys="userForm.users"
            :data-source="availableUsers"
            :titles="['可選用戶', '已選用戶']"
            :render="item => item.title"
          />
        </FormItem>
        
        <FormItem label="權限級別" name="permissionLevel">
          <Select v-model:value="userForm.permissionLevel" placeholder="請選擇權限級別">
            <SelectOption v-for="level in permissionLevelOptions" :key="level.value" :value="level.value">
              {{ level.label }}
            </SelectOption>
          </Select>
        </FormItem>

        <FormItem v-if="userForm.permissionLevel === 'custom'" label="自定義權限" name="permissions">
          <CheckboxGroup v-model:value="userForm.permissions">
            <Row :gutter="[16, 8]">
              <Col v-for="permission in permissionOptions" :key="permission.value" :span="12">
                <Checkbox :value="permission.value">
                  {{ permission.label }}
                </Checkbox>
              </Col>
            </Row>
          </CheckboxGroup>
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