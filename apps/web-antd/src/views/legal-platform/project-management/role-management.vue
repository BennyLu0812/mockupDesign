<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { Page } from '@vben/common-ui';
import { $t } from '#/locales';
import {
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  Drawer,
  Form,
  FormItem,
  Input,
  Modal,
  Popconfirm,
  Row,
  Select,
  SelectOption,
  Space,
  Table,
  Tabs,
  TabPane,
  Tag,
  Transfer,
  Typography,
  message,
} from 'ant-design-vue';

const { Title, Text } = Typography;
const route = useRoute();

// 項目ID
const projectId = ref(route.query.projectId || '1');

// 角色列表數據
const roleList = ref([
  {
    id: '1',
    name: '項目負責人',
    description: '負責項目整體規劃和管理',
    memberCount: 1,
    permissions: ['項目管理', '成員管理', '任務分配'],
    members: [
      {
        id: '1',
        name: '陳大文',
        email: 'chen@example.com',
        avatar: '/api/placeholder/40/40',
        joinTime: '2024-01-15',
      },
    ],
  },
  {
    id: '2',
    name: '法律顧問',
    description: '提供專業法律意見和建議',
    memberCount: 2,
    permissions: ['法律審查', '意見提供'],
    members: [
      {
        id: '2',
        name: '張三',
        email: 'zhang@example.com',
        avatar: '/api/placeholder/40/40',
        joinTime: '2024-01-16',
      },
      {
        id: '3',
        name: '王五',
        email: 'wang@example.com',
        avatar: '/api/placeholder/40/40',
        joinTime: '2024-01-18',
      },
    ],
  },
  {
    id: '3',
    name: '研究員',
    description: '負責資料收集和分析工作',
    memberCount: 3,
    permissions: ['資料收集', '分析報告'],
    members: [
      {
        id: '4',
        name: '李四',
        email: 'li@example.com',
        avatar: '/api/placeholder/40/40',
        joinTime: '2024-01-17',
      },
      {
        id: '5',
        name: '趙六',
        email: 'zhao@example.com',
        avatar: '/api/placeholder/40/40',
        joinTime: '2024-01-19',
      },
      {
        id: '6',
        name: '錢七',
        email: 'qian@example.com',
        avatar: '/api/placeholder/40/40',
        joinTime: '2024-01-20',
      },
    ],
  },
]);

// 可用用戶列表（用於添加成員）
const availableUsers = ref([
  {
    key: '7',
    title: '孫八',
    description: 'sun@example.com',
    avatar: '/api/placeholder/40/40',
  },
  {
    key: '8',
    title: '周九',
    description: 'zhou@example.com',
    avatar: '/api/placeholder/40/40',
  },
  {
    key: '9',
    title: '吳十',
    description: 'wu@example.com',
    avatar: '/api/placeholder/40/40',
  },
]);

// 角色表格列配置
const roleColumns = [
  {
    title: '角色名稱',
    dataIndex: 'name',
    key: 'name',
    width: 150,
  },
  {
    title: '描述',
    dataIndex: 'description',
    key: 'description',
    width: 200,
  },
  {
    title: '成員數量',
    dataIndex: 'memberCount',
    key: 'memberCount',
    width: 100,
  },
  {
    title: '權限',
    dataIndex: 'permissions',
    key: 'permissions',
    width: 200,
  },
  {
    title: '操作',
    key: 'operation',
    width: 250,
    fixed: 'right',
  },
];

// 成員表格列配置
const memberColumns = [
  {
    title: '成員',
    dataIndex: 'name',
    key: 'name',
    width: 150,
  },
  {
    title: '郵箱',
    dataIndex: 'email',
    key: 'email',
    width: 200,
  },
  {
    title: '加入時間',
    dataIndex: 'joinTime',
    key: 'joinTime',
    width: 120,
  },
  {
    title: '操作',
    key: 'operation',
    width: 100,
    fixed: 'right',
  },
];

// 表單狀態
const roleFormVisible = ref(false);
const memberDrawerVisible = ref(false);
const addMemberVisible = ref(false);
const editMode = ref(false);
const currentRole = ref<any>({});
const currentRoleMembers = ref<any[]>([]);
const selectedUsers = ref<string[]>([]);

// 角色表單數據
const roleForm = reactive({
  name: '',
  description: '',
  permissions: [],
});

// 權限選項
const permissionOptions = [
  { value: '項目管理', label: '項目管理' },
  { value: '成員管理', label: '成員管理' },
  { value: '任務分配', label: '任務分配' },
  { value: '法律審查', label: '法律審查' },
  { value: '意見提供', label: '意見提供' },
  { value: '資料收集', label: '資料收集' },
  { value: '分析報告', label: '分析報告' },
  { value: '文件編輯', label: '文件編輯' },
  { value: '審核批准', label: '審核批准' },
];

// 工作小組管理相關數據
const workGroupList = ref([
  {
    id: '1',
    name: '法條審查小組',
    description: '負責法條的詳細審查和分析工作',
    leader: {
      id: '1',
      name: '陳大文',
      role: '項目負責人',
      avatar: '/api/placeholder/40/40',
    },
    members: [
      {
        id: '2',
        name: '張三',
        role: '法律顧問',
        avatar: '/api/placeholder/40/40',
        joinTime: '2024-01-16',
      },
      {
        id: '4',
        name: '李四',
        role: '研究員',
        avatar: '/api/placeholder/40/40',
        joinTime: '2024-01-17',
      },
    ],
    createTime: '2024-01-15',
    status: 'active',
    tasks: ['法條第一章審查', '法條第二章審查'],
  },
  {
    id: '2',
    name: '資料收集小組',
    description: '負責收集和整理相關法律資料',
    leader: {
      id: '3',
      name: '王五',
      role: '法律顧問',
      avatar: '/api/placeholder/40/40',
    },
    members: [
      {
        id: '5',
        name: '趙六',
        role: '研究員',
        avatar: '/api/placeholder/40/40',
        joinTime: '2024-01-19',
      },
      {
        id: '6',
        name: '錢七',
        role: '研究員',
        avatar: '/api/placeholder/40/40',
        joinTime: '2024-01-20',
      },
    ],
    createTime: '2024-01-18',
    status: 'active',
    tasks: ['參考資料收集', '案例分析'],
  },
]);

// 工作小組表格列配置
const workGroupColumns = [
  {
    title: '小組名稱',
    dataIndex: 'name',
    key: 'name',
    width: 150,
  },
  {
    title: '描述',
    dataIndex: 'description',
    key: 'description',
    width: 200,
  },
  {
    title: '組長',
    dataIndex: 'leader',
    key: 'leader',
    width: 120,
  },
  {
    title: '成員數量',
    key: 'memberCount',
    width: 100,
  },
  {
    title: '狀態',
    dataIndex: 'status',
    key: 'status',
    width: 80,
  },
  {
    title: '創建時間',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 120,
  },
  {
    title: '操作',
    key: 'operation',
    width: 200,
    fixed: 'right',
  },
];

// 工作小組相關狀態
const activeTab = ref('roles'); // 'roles' | 'workGroups'
const workGroupFormVisible = ref(false);
const workGroupMemberVisible = ref(false);
const workGroupEditMode = ref(false);
const currentWorkGroup = ref<any>({});
const currentWorkGroupMembers = ref<any[]>([]);

// 工作小組表單數據
const workGroupForm = reactive({
  name: '',
  description: '',
  leaderId: '',
  memberIds: [],
});

// 獲取所有可用成員（來自所有角色）
const getAllAvailableMembers = () => {
  const allMembers: any[] = [];
  roleList.value.forEach(role => {
    role.members.forEach(member => {
      allMembers.push({
        ...member,
        role: role.name,
        key: member.id,
        title: member.name,
        description: `${member.email} | ${role.name}`,
      });
    });
  });
  return allMembers;
};

// 新增角色
const handleAddRole = () => {
  editMode.value = false;
  roleForm.name = '';
  roleForm.description = '';
  roleForm.permissions = [];
  roleFormVisible.value = true;
};

// 編輯角色
const handleEditRole = (record: any) => {
  editMode.value = true;
  currentRole.value = record;
  roleForm.name = record.name;
  roleForm.description = record.description;
  roleForm.permissions = [...record.permissions];
  roleFormVisible.value = true;
};

// 刪除角色
const handleDeleteRole = (record: any) => {
  const index = roleList.value.findIndex(role => role.id === record.id);
  if (index > -1) {
    roleList.value.splice(index, 1);
    message.success('角色刪除成功');
  }
};

// 查看角色成員
const handleViewMembers = (record: any) => {
  currentRole.value = record;
  currentRoleMembers.value = [...record.members];
  memberDrawerVisible.value = true;
};

// 保存角色
const handleSaveRole = () => {
  if (!roleForm.name.trim()) {
    message.error('請輸入角色名稱');
    return;
  }
  
  if (editMode.value) {
    // 編輯模式
    const index = roleList.value.findIndex(role => role.id === currentRole.value.id);
    if (index > -1) {
      roleList.value[index] = {
        ...roleList.value[index],
        name: roleForm.name,
        description: roleForm.description,
        permissions: [...roleForm.permissions],
      };
      message.success('角色更新成功');
    }
  } else {
    // 新增模式
    const newRole = {
      id: Date.now().toString(),
      name: roleForm.name,
      description: roleForm.description,
      memberCount: 0,
      permissions: [...roleForm.permissions],
      members: [],
    };
    roleList.value.push(newRole);
    message.success('角色創建成功');
  }
  
  roleFormVisible.value = false;
};

// 添加成員到角色
const handleAddMembers = () => {
  selectedUsers.value = [];
  addMemberVisible.value = true;
};

// 確認添加成員
const handleConfirmAddMembers = () => {
  if (selectedUsers.value.length === 0) {
    message.error('請選擇要添加的成員');
    return;
  }
  
  const newMembers = selectedUsers.value.map(userId => {
    const user = availableUsers.value.find(u => u.key === userId);
    return {
      id: userId,
      name: user?.title || '',
      email: user?.description || '',
      avatar: user?.avatar || '/api/placeholder/40/40',
      joinTime: new Date().toISOString().split('T')[0],
    };
  });
  
  // 更新當前角色的成員列表
  const roleIndex = roleList.value.findIndex(role => role.id === currentRole.value.id);
  if (roleIndex > -1) {
    roleList.value[roleIndex].members.push(...newMembers);
    roleList.value[roleIndex].memberCount = roleList.value[roleIndex].members.length;
    currentRoleMembers.value.push(...newMembers);
  }
  
  // 從可用用戶列表中移除已添加的用戶
  availableUsers.value = availableUsers.value.filter(user => !selectedUsers.value.includes(user.key));
  
  addMemberVisible.value = false;
  message.success(`成功添加 ${newMembers.length} 名成員`);
};

// 從角色中移除成員
const handleRemoveMember = (member: any) => {
  const roleIndex = roleList.value.findIndex(role => role.id === currentRole.value.id);
  if (roleIndex > -1) {
    const memberIndex = roleList.value[roleIndex].members.findIndex(m => m.id === member.id);
    if (memberIndex > -1) {
      roleList.value[roleIndex].members.splice(memberIndex, 1);
      roleList.value[roleIndex].memberCount = roleList.value[roleIndex].members.length;
      
      // 更新當前顯示的成員列表
      const currentMemberIndex = currentRoleMembers.value.findIndex(m => m.id === member.id);
      if (currentMemberIndex > -1) {
        currentRoleMembers.value.splice(currentMemberIndex, 1);
      }
      
      // 將成員重新添加到可用用戶列表
      availableUsers.value.push({
        key: member.id,
        title: member.name,
        description: member.email,
        avatar: member.avatar,
      });
      
      message.success('成員移除成功');
    }
  }
};

// Transfer 組件的渲染函數
const renderTransferItem = (item: any) => {
  return {
    label: item.title,
    value: item.key,
  };
};

// 工作小組管理相關函數
// 新增工作小組
const handleAddWorkGroup = () => {
  workGroupEditMode.value = false;
  workGroupForm.name = '';
  workGroupForm.description = '';
  workGroupForm.leaderId = '';
  workGroupForm.memberIds = [];
  workGroupFormVisible.value = true;
};

// 編輯工作小組
const handleEditWorkGroup = (record: any) => {
  workGroupEditMode.value = true;
  currentWorkGroup.value = record;
  workGroupForm.name = record.name;
  workGroupForm.description = record.description;
  workGroupForm.leaderId = record.leader.id;
  workGroupForm.memberIds = record.members.map((m: any) => m.id);
  workGroupFormVisible.value = true;
};

// 刪除工作小組
const handleDeleteWorkGroup = (record: any) => {
  const index = workGroupList.value.findIndex(group => group.id === record.id);
  if (index > -1) {
    workGroupList.value.splice(index, 1);
    message.success('工作小組刪除成功');
  }
};

// 查看工作小組成員
const handleViewWorkGroupMembers = (record: any) => {
  currentWorkGroup.value = record;
  currentWorkGroupMembers.value = [record.leader, ...record.members];
  workGroupMemberVisible.value = true;
};

// 保存工作小組
const handleSaveWorkGroup = () => {
  if (!workGroupForm.name.trim()) {
    message.error('請輸入工作小組名稱');
    return;
  }
  
  if (!workGroupForm.leaderId) {
    message.error('請選擇組長');
    return;
  }
  
  const allMembers = getAllAvailableMembers();
  const leader = allMembers.find(m => m.id === workGroupForm.leaderId);
  const members = allMembers.filter(m => workGroupForm.memberIds.includes(m.id) && m.id !== workGroupForm.leaderId);
  
  if (workGroupEditMode.value) {
    // 編輯模式
    const index = workGroupList.value.findIndex(group => group.id === currentWorkGroup.value.id);
    if (index > -1) {
      workGroupList.value[index] = {
        ...workGroupList.value[index],
        name: workGroupForm.name,
        description: workGroupForm.description,
        leader: {
          id: leader.id,
          name: leader.name,
          role: leader.role,
          avatar: leader.avatar,
        },
        members: members.map(m => ({
          id: m.id,
          name: m.name,
          role: m.role,
          avatar: m.avatar,
          joinTime: m.joinTime || new Date().toISOString().split('T')[0],
        })),
      };
      message.success('工作小組更新成功');
    }
  } else {
    // 新增模式
    const newWorkGroup = {
      id: Date.now().toString(),
      name: workGroupForm.name,
      description: workGroupForm.description,
      leader: {
        id: leader.id,
        name: leader.name,
        role: leader.role,
        avatar: leader.avatar,
      },
      members: members.map(m => ({
        id: m.id,
        name: m.name,
        role: m.role,
        avatar: m.avatar,
        joinTime: new Date().toISOString().split('T')[0],
      })),
      createTime: new Date().toISOString().split('T')[0],
      status: 'active',
      tasks: [],
    };
    workGroupList.value.push(newWorkGroup);
    message.success('工作小組創建成功');
  }
  
  workGroupFormVisible.value = false;
};

// 獲取工作小組狀態顏色
const getWorkGroupStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    active: 'success',
    inactive: 'default',
    completed: 'processing',
  };
  return colorMap[status] || 'default';
};

// 獲取工作小組狀態文本
const getWorkGroupStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    active: '活躍',
    inactive: '非活躍',
    completed: '已完成',
  };
  return textMap[status] || status;
};

// 切換標籤頁
const handleTabChange = (key: string) => {
  activeTab.value = key;
};

// 組件掛載時的初始化
onMounted(() => {
  // 這裡可以調用API獲取角色數據
  console.log('項目角色管理頁面已加載，項目ID:', projectId.value);
});
</script>

<template>
  <Page :title="$t('page.legalPlatform.projectRoleManagement')">
    <div class="role-management">
      <!-- 頁面標題 -->
      <Card class="mb-4">
        <div>
          <Title :level="3" class="mb-2">
            {{ $t('page.legalPlatform.projectRoleManagement') }}
          </Title>
          <Text type="secondary">
            管理項目中的角色和成員，分配相應的權限
          </Text>
        </div>
      </Card>

      <!-- 標籤頁 -->
      <Card>
        <div class="tabs-container">
          <div class="tab-buttons mb-4">
            <Button
              :type="activeTab === 'roles' ? 'primary' : 'default'"
              @click="handleTabChange('roles')"
              class="mr-2"
            >
              角色管理
            </Button>
            <Button
              :type="activeTab === 'workGroups' ? 'primary' : 'default'"
              @click="handleTabChange('workGroups')"
            >
              工作小組
            </Button>
          </div>

          <!-- 角色管理標籤頁 -->
          <div v-if="activeTab === 'roles'">
            <div class="flex justify-between items-center mb-4">
              <Title :level="4">角色列表</Title>
              <Button type="primary" @click="handleAddRole">
                <span class="icon-[lucide--plus] size-4 mr-1" />
                新增角色
              </Button>
            </div>
            
            <Table
              :columns="roleColumns"
              :data-source="roleList"
              :pagination="false"
              row-key="id"
            >
          <!-- 權限列 -->
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'permissions'">
              <Space wrap>
                <Tag
                  v-for="permission in record.permissions"
                  :key="permission"
                  color="blue"
                >
                  {{ permission }}
                </Tag>
              </Space>
            </template>
            
            <!-- 操作列 -->
            <template v-else-if="column.key === 'operation'">
              <Space>
                <Button
                  type="link"
                  size="small"
                  @click="handleViewMembers(record)"
                >
                  <span class="icon-[lucide--users] size-4 mr-1" />
                  成員管理
                </Button>
                <Button
                  type="link"
                  size="small"
                  @click="handleEditRole(record)"
                >
                  <span class="icon-[lucide--edit] size-4 mr-1" />
                  編輯
                </Button>
                <Popconfirm
                  title="確定要刪除這個角色嗎？"
                  ok-text="確定"
                  cancel-text="取消"
                  @confirm="handleDeleteRole(record)"
                >
                  <Button
                    type="link"
                    size="small"
                    danger
                  >
                    <span class="icon-[lucide--trash-2] size-4 mr-1" />
                    刪除
                  </Button>
                </Popconfirm>
              </Space>
            </template>
          </template>
            </Table>
          </div>

          <!-- 工作小組管理標籤頁 -->
          <div v-if="activeTab === 'workGroups'">
            <div class="flex justify-between items-center mb-4">
              <Title :level="4">工作小組列表</Title>
              <Button type="primary" @click="handleAddWorkGroup">
                <span class="icon-[lucide--plus] size-4 mr-1" />
                新增工作小組
              </Button>
            </div>
            
            <Table
              :columns="workGroupColumns"
              :data-source="workGroupList"
              :pagination="false"
              row-key="id"
            >
              <!-- 組長列 -->
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'leader'">
                  <div class="flex items-center">
                    <Avatar
                      :src="record.leader.avatar"
                      :size="24"
                      class="mr-2"
                    >
                      {{ record.leader.name.charAt(0) }}
                    </Avatar>
                    <div>
                      <div class="font-medium">{{ record.leader.name }}</div>
                      <div class="text-xs text-gray-500">{{ record.leader.role }}</div>
                    </div>
                  </div>
                </template>
                
                <!-- 成員數量列 -->
                <template v-else-if="column.key === 'memberCount'">
                  {{ record.members.length + 1 }}
                </template>
                
                <!-- 狀態列 -->
                <template v-else-if="column.key === 'status'">
                  <Tag :color="getWorkGroupStatusColor(record.status)">
                    {{ getWorkGroupStatusText(record.status) }}
                  </Tag>
                </template>
                
                <!-- 操作列 -->
                <template v-else-if="column.key === 'operation'">
                  <Space>
                    <Button
                      type="link"
                      size="small"
                      @click="handleViewWorkGroupMembers(record)"
                    >
                      <span class="icon-[lucide--users] size-4 mr-1" />
                      查看成員
                    </Button>
                    <Button
                      type="link"
                      size="small"
                      @click="handleEditWorkGroup(record)"
                    >
                      <span class="icon-[lucide--edit] size-4 mr-1" />
                      編輯
                    </Button>
                    <Popconfirm
                      title="確定要刪除這個工作小組嗎？"
                      ok-text="確定"
                      cancel-text="取消"
                      @confirm="handleDeleteWorkGroup(record)"
                    >
                      <Button
                        type="link"
                        size="small"
                        danger
                      >
                        <span class="icon-[lucide--trash-2] size-4 mr-1" />
                        刪除
                      </Button>
                    </Popconfirm>
                  </Space>
                </template>
              </template>
            </Table>
          </div>
        </div>
      </Card>
    </div>

    <!-- 新增/編輯角色抽屜 -->
    <Drawer
      v-model:open="roleFormVisible"
      :title="editMode ? '編輯角色' : '新增角色'"
      :width="600"
      placement="right"
    >
      <div class="role-form-content">
        <Form
          :model="roleForm"
          layout="vertical"
          class="mb-6"
        >
          <FormItem
            label="角色名稱"
            name="name"
            :rules="[{ required: true, message: '請輸入角色名稱' }]"
          >
            <Input
              v-model:value="roleForm.name"
              placeholder="請輸入角色名稱"
            />
          </FormItem>
          
          <FormItem
            label="角色描述"
            name="description"
          >
            <Input.TextArea
              v-model:value="roleForm.description"
              placeholder="請輸入角色描述"
              :rows="3"
            />
          </FormItem>
          
          <FormItem
            label="角色權限"
            name="permissions"
          >
            <Select
              v-model:value="roleForm.permissions"
              mode="multiple"
              placeholder="請選擇角色權限"
              :options="permissionOptions"
            />
          </FormItem>
        </Form>
        
        <!-- 操作按鈕 -->
        <div class="flex justify-end space-x-2 pt-4 border-t">
          <Button @click="roleFormVisible = false">
            取消
          </Button>
          <Button type="primary" @click="handleSaveRole">
            {{ editMode ? '更新' : '創建' }}
          </Button>
        </div>
      </div>
    </Drawer>

    <!-- 成員管理抽屜 -->
    <Drawer
      v-model:open="memberDrawerVisible"
      title="成員管理"
      :width="800"
      placement="right"
    >
      <div class="member-management">
        <!-- 角色信息 -->
        <Card class="mb-4">
          <div class="flex justify-between items-center">
            <div>
              <Title :level="4" class="mb-1">
                {{ currentRole.name }}
              </Title>
              <Text type="secondary">
                {{ currentRole.description }}
              </Text>
            </div>
            <Button type="primary" @click="handleAddMembers">
              <span class="icon-[lucide--user-plus] size-4 mr-1" />
              添加成員
            </Button>
          </div>
        </Card>

        <!-- 成員列表 -->
        <Card>
          <Table
            :columns="memberColumns"
            :data-source="currentRoleMembers"
            :pagination="false"
            row-key="id"
          >
            <!-- 成員列 -->
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'name'">
                <div class="flex items-center">
                  <Avatar
                    :src="record.avatar"
                    :size="32"
                    class="mr-2"
                  >
                    {{ record.name.charAt(0) }}
                  </Avatar>
                  <span>{{ record.name }}</span>
                </div>
              </template>
              
              <!-- 操作列 -->
              <template v-else-if="column.key === 'operation'">
                <Popconfirm
                  title="確定要移除這個成員嗎？"
                  ok-text="確定"
                  cancel-text="取消"
                  @confirm="handleRemoveMember(record)"
                >
                  <Button
                    type="link"
                    size="small"
                    danger
                  >
                    <span class="icon-[lucide--user-minus] size-4 mr-1" />
                    移除
                  </Button>
                </Popconfirm>
              </template>
            </template>
          </Table>
        </Card>
      </div>
    </Drawer>

    <!-- 添加成員彈窗 -->
    <Modal
      v-model:open="addMemberVisible"
      title="添加成員"
      :width="600"
      @ok="handleConfirmAddMembers"
      @cancel="addMemberVisible = false"
    >
      <div class="add-member-content">
        <Text class="block mb-4">
          選擇要添加到「{{ currentRole.name }}」角色的成員：
        </Text>
        
        <div class="available-users">
          <Row :gutter="[16, 16]">
            <Col
              v-for="user in availableUsers"
              :key="user.key"
              :span="12"
            >
              <Card
                size="small"
                :class="{
                  'border-blue-500 bg-blue-50': selectedUsers.includes(user.key),
                  'cursor-pointer hover:border-blue-300': true,
                }"
                @click="() => {
                  const index = selectedUsers.indexOf(user.key);
                  if (index > -1) {
                    selectedUsers.splice(index, 1);
                  } else {
                    selectedUsers.push(user.key);
                  }
                }"
              >
                <div class="flex items-center">
                  <Avatar
                    :src="user.avatar"
                    :size="32"
                    class="mr-3"
                  >
                    {{ user.title.charAt(0) }}
                  </Avatar>
                  <div class="flex-1">
                    <div class="font-medium">{{ user.title }}</div>
                    <div class="text-sm text-gray-500">{{ user.description }}</div>
                  </div>
                  <div v-if="selectedUsers.includes(user.key)" class="text-blue-500">
                    <span class="icon-[lucide--check] size-4" />
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
        
        <div v-if="availableUsers.length === 0" class="text-center py-8">
          <Text type="secondary">
            暫無可添加的用戶
          </Text>
        </div>
      </div>
    </Modal>

    <!-- 新增/編輯工作小組彈窗 -->
    <Modal
      v-model:open="workGroupFormVisible"
      :title="workGroupEditMode ? '編輯工作小組' : '新增工作小組'"
      :width="700"
      @ok="handleSaveWorkGroup"
      @cancel="workGroupFormVisible = false"
    >
      <Form
        :model="workGroupForm"
        layout="vertical"
      >
        <FormItem
          label="小組名稱"
          name="name"
          :rules="[{ required: true, message: '請輸入小組名稱' }]"
        >
          <Input
            v-model:value="workGroupForm.name"
            placeholder="請輸入小組名稱"
          />
        </FormItem>
        
        <FormItem
          label="小組描述"
          name="description"
        >
          <Input.TextArea
            v-model:value="workGroupForm.description"
            placeholder="請輸入小組描述"
            :rows="3"
          />
        </FormItem>
        
        <FormItem
          label="組長"
          name="leaderId"
          :rules="[{ required: true, message: '請選擇組長' }]"
        >
          <Select
            v-model:value="workGroupForm.leaderId"
            placeholder="請選擇組長"
            show-search
            :filter-option="false"
          >
            <SelectOption
              v-for="member in getAllAvailableMembers()"
              :key="member.id"
              :value="member.id"
            >
              <div class="flex items-center">
                <Avatar
                  :src="member.avatar"
                  :size="24"
                  class="mr-2"
                >
                  {{ member.name.charAt(0) }}
                </Avatar>
                <div>
                  <div>{{ member.name }}</div>
                  <div class="text-xs text-gray-500">{{ member.role }}</div>
                </div>
              </div>
            </SelectOption>
          </Select>
        </FormItem>
        
        <FormItem
          label="小組成員"
          name="memberIds"
        >
          <Select
            v-model:value="workGroupForm.memberIds"
            mode="multiple"
            placeholder="請選擇小組成員"
            show-search
            :filter-option="false"
          >
            <SelectOption
              v-for="member in getAllAvailableMembers().filter(m => m.id !== workGroupForm.leaderId)"
              :key="member.id"
              :value="member.id"
            >
              <div class="flex items-center">
                <Avatar
                  :src="member.avatar"
                  :size="24"
                  class="mr-2"
                >
                  {{ member.name.charAt(0) }}
                </Avatar>
                <div>
                  <div>{{ member.name }}</div>
                  <div class="text-xs text-gray-500">{{ member.role }}</div>
                </div>
              </div>
            </SelectOption>
          </Select>
        </FormItem>
      </Form>
    </Modal>

    <!-- 工作小組成員查看抽屜 -->
    <Drawer
      v-model:open="workGroupMemberVisible"
      title="工作小組成員"
      :width="600"
      placement="right"
    >
      <div class="work-group-member-content">
        <!-- 工作小組信息 -->
        <Card class="mb-4">
          <div>
            <Title :level="4" class="mb-1">
              {{ currentWorkGroup.name }}
            </Title>
            <Text type="secondary" class="block mb-2">
              {{ currentWorkGroup.description }}
            </Text>
            <div class="text-sm text-gray-500">
              創建時間：{{ currentWorkGroup.createTime }}
            </div>
          </div>
        </Card>

        <!-- 成員列表 -->
        <Card>
          <Title :level="5" class="mb-3">成員列表</Title>
          <div class="space-y-3">
            <div
              v-for="member in currentWorkGroupMembers"
              :key="member.id"
              class="flex items-center p-3 border rounded-lg"
            >
              <Avatar
                :src="member.avatar"
                :size="40"
                class="mr-3"
              >
                {{ member.name.charAt(0) }}
              </Avatar>
              <div class="flex-1">
                <div class="font-medium">{{ member.name }}</div>
                <div class="text-sm text-gray-500">{{ member.role }}</div>
                <div v-if="member.joinTime" class="text-xs text-gray-400">
                  加入時間：{{ member.joinTime }}
                </div>
              </div>
              <div v-if="member.id === currentWorkGroup.leader?.id">
                <Tag color="gold">組長</Tag>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Drawer>
  </Page>
</template>

<style scoped>
.role-management {
  padding: 0;
}

.member-management {
  padding: 0;
}

.role-form-content {
  padding: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.add-member-content {
  max-height: 400px;
  overflow-y: auto;
}

.available-users .ant-card {
  transition: all 0.3s ease;
}

.available-users .ant-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.ant-table-tbody > tr > td {
  padding: 12px 16px;
}

.ant-table-thead > tr > th {
  background-color: #fafafa;
  font-weight: 600;
}

.tabs-container {
  padding: 0;
}

.tab-buttons {
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 16px;
}

.work-group-member-content {
  padding: 0;
}
</style>
