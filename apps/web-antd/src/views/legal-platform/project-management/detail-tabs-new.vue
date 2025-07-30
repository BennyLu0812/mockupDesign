<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Page } from '@vben/common-ui';
import { $t } from '#/locales';
import {
  Avatar,
  AvatarGroup,
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Drawer,
  Empty,
  Form,
  FormItem,
  Input,
  Modal,
  Popconfirm,
  Radio,
  RadioGroup,
  Row,
  Select,
  SelectOption,
  Space,
  Switch,
  Table,
  Tag,
  Tabs,
  TabPane,
  Textarea,
  Timeline,
  TimelineItem,
  Typography,
  Upload,
  message,
} from 'ant-design-vue';

const { Title, Text, Paragraph } = Typography;
const route = useRoute();
const router = useRouter();

// 當前活動的tab
const activeTab = ref('projectInfo');

// 項目基本信息
const projectInfo = reactive({
  id: route.params.id || '1',
  name: '法律條文審查項目',
  type: '法案項目',
  status: '處理中',
  creator: '陳大文',
  createTime: '2024-01-15 10:30:00',
  startTime: '2024-01-15',
  endTime: '2024-03-15',
  dueTime: '2024-03-10',
  description: '本項目旨在對新修訂的法律條文進行全面審查，確保條文的合法性、合理性和可操作性。項目將涉及多個法律領域的專業知識，需要團隊成員密切配合。',
  cover: '/api/placeholder/300/200',
  visibility: '公開',
});

// 關注功能相關狀態
const isFollowing = ref(false);
const followersCount = ref(12);

// 項目標籤
const projectTags = ref([
  { id: 1, name: '法律審查', color: 'blue' },
  { id: 2, name: '緊急', color: 'red' },
  { id: 3, name: '政府項目', color: 'green' },
]);

// 任務表格列配置
const taskColumns = [
  {
    title: '任務編號',
    dataIndex: 'taskNumber',
    key: 'taskNumber',
    width: 140,
  },
  {
    title: '任務名稱',
    dataIndex: 'title',
    key: 'title',
    width: 200,
  },
  {
    title: '狀態',
    dataIndex: 'status',
    key: 'status',
    width: 100,
  },
  {
    title: '負責人',
    dataIndex: 'assignee',
    key: 'assignee',
    width: 100,
  },
  {
    title: '創建人',
    dataIndex: 'creator',
    key: 'creator',
    width: 100,
  },
  {
    title: '創建時間',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 160,
  },
  {
    title: '優先級',
    dataIndex: 'priority',
    key: 'priority',
    width: 100,
  },
  {
    title: '操作',
    key: 'operation',
    width: 100,
    fixed: 'right',
  },
];

// 項目成員
const projectMembers = ref([
  {
    id: '1',
    name: '陳大文',
    role: '項目負責人',
    avatar: '/api/placeholder/40/40',
    email: 'chen@example.com',
    phone: '0912-345-678',
    department: '法務部',
    joinTime: '2024-01-15',
  },
  {
    id: '2',
    name: '李小美',
    role: '法律顧問',
    avatar: '/api/placeholder/40/40',
    email: 'li@example.com',
    phone: '0923-456-789',
    department: '法務部',
    joinTime: '2024-01-16',
  },
  {
    id: '3',
    name: '王志明',
    role: '審查員',
    avatar: '/api/placeholder/40/40',
    email: 'wang@example.com',
    phone: '0934-567-890',
    department: '審查部',
    joinTime: '2024-01-17',
  },
]);

// 最新任務
const recentTasks = ref([
  {
    id: 1,
    title: '法律條文審核任務',
    projectName: '法律條文審查項目',
    status: 'inProgress',
    assignee: '陳志華',
    creator: '陳大文',
    createTime: '2024-01-20 10:30:00',
    priority: 'high',
    taskNumber: 'LP-2024-001',
  },
  {
    id: 2,
    title: '法條比對分析',
    projectName: '法律條文審查項目',
    status: 'preparing',
    assignee: '林雅婷',
    creator: '陳大文',
    createTime: '2024-01-22 14:20:00',
    priority: 'medium',
    taskNumber: 'LP-2024-002',
  },
  {
    id: 3,
    title: '專家意見整理',
    projectName: '法律條文審查項目',
    status: 'completed',
    assignee: '黃建國',
    creator: '陳大文',
    createTime: '2024-01-18 09:15:00',
    priority: 'medium',
    taskNumber: 'LP-2024-003',
  },
  {
    id: 4,
    title: '法規對比研究',
    projectName: '法律條文審查項目',
    status: 'inProgress',
    assignee: '陳志華',
    creator: '陳大文',
    createTime: '2024-01-25 11:00:00',
    priority: 'low',
    taskNumber: 'LP-2024-004',
  },
  {
    id: 5,
    title: '初稿撰寫',
    projectName: '法律條文審查項目',
    status: 'preparing',
    assignee: '林雅婷',
    creator: '陳大文',
    createTime: '2024-01-26 16:30:00',
    priority: 'high',
    taskNumber: 'LP-2024-005',
  },
]);

// 項目附件
const attachments = ref([
  {
    id: '1',
    name: '法律條文草案.pdf',
    type: 'pdf',
    size: '2.5MB',
    uploadTime: '2024-01-20 14:30:00',
    uploader: '陳大文',
    tags: ['草案', '重要'],
    remark: '第一版草案，需要仔細審查',
    comments: [
      {
        id: '1',
        user: '李小美',
        content: '第三條需要修改',
        time: '2024-01-21 09:00:00',
        avatar: '/api/placeholder/40/40',
        replies: [
          {
            id: '1',
            user: '陳大文',
            content: '已記錄，會在下一版本修改',
            time: '2024-01-21 10:00:00',
            avatar: '/api/placeholder/40/40',
          },
        ],
      },
    ],
  },
]);

// 里程碑數據
const milestones = ref([
  {
    id: '1',
    title: '項目啟動',
    description: '項目正式啟動，團隊成員確認',
    date: '2024-01-15',
    status: 'completed',
  },
  {
    id: '2',
    title: '初步審查',
    description: '完成法律條文的初步審查工作',
    date: '2024-02-15',
    status: 'inProgress',
  },
  {
    id: '3',
    title: '最終審核',
    description: '完成最終審核並提交報告',
    date: '2024-03-10',
    status: 'pending',
  },
]);

// 動態數據
const activities = ref([
  {
    id: '1',
    user: '陳大文',
    content: '創建了項目',
    time: '2024-01-15 10:30:00',
    type: 'create',
    avatar: '/api/placeholder/40/40',
  },
  {
    id: '2',
    user: '李小美',
    content: '上傳了附件「法律條文草案.pdf」',
    time: '2024-01-20 14:30:00',
    type: 'upload',
    avatar: '/api/placeholder/40/40',
  },
]);

// 知悉數據
const acknowledgments = ref([
  {
    id: '1',
    taskName: '條文初審任務',
    assignee: '李小美',
    status: 'acknowledged',
    time: '2024-01-21 09:00:00',
    content: '已確認收到任務，將在期限內完成',
  },
]);

// 通知記錄
const notificationHistory = ref([
  {
    id: '1',
    title: '任務分配通知',
    content: '您有新的任務需要處理',
    recipients: ['李小美', '王志明'],
    methods: ['email', 'sms'],
    status: 'sent',
    sendTime: '2024-01-20 09:00:00',
  },
]);

// 工具函數
const getStatusColor = (status: string) => {
  const colorMap = {
    pending: 'orange',
    inProgress: 'blue',
    completed: 'green',
    cancelled: 'red',
  };
  return colorMap[status] || 'default';
};

const getStatusText = (status: string) => {
  const textMap = {
    pending: '待處理',
    inProgress: '處理中',
    completed: '已完成',
    cancelled: '已取消',
  };
  return textMap[status] || status;
};

const getPriorityColor = (priority: string) => {
  const colorMap = {
    low: 'green',
    medium: 'orange',
    high: 'red',
  };
  return colorMap[priority] || 'default';
};

const getPriorityText = (priority: string) => {
  const textMap = {
    low: '低',
    medium: '中',
    high: '高',
  };
  return textMap[priority] || priority;
};

const getFileIconClass = (type: string) => {
  const iconMap = {
    'pdf': 'icon-[lucide--file-text] text-red-500',
    'doc': 'icon-[lucide--file-text] text-blue-500',
    'docx': 'icon-[lucide--file-text] text-blue-500',
    'xls': 'icon-[lucide--file-spreadsheet] text-green-500',
    'xlsx': 'icon-[lucide--file-spreadsheet] text-green-500',
    'jpg': 'icon-[lucide--image] text-purple-500',
    'jpeg': 'icon-[lucide--image] text-purple-500',
    'png': 'icon-[lucide--image] text-purple-500',
  };
  return iconMap[type.toLowerCase()] || 'icon-[lucide--file] text-gray-500';
};

const getActivityIconClass = (type: string) => {
  const iconMap = {
    create: 'icon-[lucide--plus-circle] text-green-500',
    upload: 'icon-[lucide--upload] text-blue-500',
    comment: 'icon-[lucide--message-circle] text-orange-500',
    update: 'icon-[lucide--edit] text-purple-500',
  };
  return iconMap[type] || 'icon-[lucide--activity] text-gray-500';
};

const getNotificationStatusColor = (status: string) => {
  const colorMap = {
    sent: 'green',
    pending: 'orange',
    failed: 'red',
  };
  return colorMap[status] || 'default';
};

const getNotificationStatusText = (status: string) => {
  const textMap = {
    sent: '已發送',
    pending: '待發送',
    failed: '發送失敗',
  };
  return textMap[status] || status;
};

const getNotificationMethodText = (method: string) => {
  const textMap = {
    email: '郵件',
    sms: '簡訊',
    push: '推送',
  };
  return textMap[method] || method;
};

// 事件處理函數
const handleToggleFollow = () => {
  isFollowing.value = !isFollowing.value;
  if (isFollowing.value) {
    followersCount.value++;
    message.success('已關注此項目');
  } else {
    followersCount.value--;
    message.success('已取消關注');
  }
};

const handleInviteMember = () => {
  message.info('邀請成員功能開發中');
};

const handleViewAllTasks = () => {
  message.info('查看全部任務功能開發中');
};

const handleUploadAttachment = () => {
  message.info('打開上傳附件彈窗');
};

const handlePreviewAttachment = (attachment) => {
  message.info(`預覽附件：${attachment.name}`);
};

const handleEditAttachment = (attachment) => {
  message.info(`編輯附件：${attachment.name}`);
};

const handleDownloadAttachment = (attachment) => {
  message.info(`下載附件：${attachment.name}`);
};

const handleDeleteAttachment = (attachment) => {
  message.success(`已刪除附件：${attachment.name}`);
};

const handleReplyComment = (attachment, comment) => {
  message.info(`回復評論：${comment.content}`);
};

const handleViewTaskDetail = (task) => {
  message.info(`查看任務詳情：${task.title}`);
};

const handleViewMoreTasks = () => {
  router.push('/legal-platform/project-management/task-management/list');
};

const handleViewAcknowledgmentDetail = (ack) => {
  message.info(`查看知悉詳情：${ack.taskName}`);
};

const handleViewMoreAcknowledments = () => {
  message.info('查看更多知悉記錄');
};

onMounted(() => {
  console.log('項目詳情Tab頁面加載，項目ID:', route.params.id);
});
</script>

<template>
  <Page :title="$t('page.legalPlatform.projectDetail')">
    <div class="project-detail-tabs">
      <!-- 頁面標題 -->
      <div class="mb-6">
        <div class="flex items-center justify-between">
          <div>
            <Title :level="2" class="!mb-2">
              {{ projectInfo.name }}
            </Title>
            <Space size="small">
              <Tag v-for="tag in projectTags" :key="tag.id" :color="tag.color">
                {{ tag.name }}
              </Tag>
            </Space>
          </div>
          <Space size="small">
            <Button 
              :type="isFollowing ? 'default' : 'primary'"
              :class="isFollowing ? 'text-orange-500 border-orange-500' : ''"
              @click="handleToggleFollow"
            >
              <span :class="isFollowing ? 'icon-[lucide--heart] text-orange-500' : 'icon-[lucide--heart]'" class="size-4 mr-1" />
              {{ isFollowing ? '已關注' : '關注' }}
              <span class="ml-1 text-xs">({{ followersCount }})</span>
            </Button>
          </Space>
        </div>
      </div>
      
      <!-- Tab 內容 -->
      <Tabs v-model:activeKey="activeTab" type="card" class="project-tabs">
        <!-- 項目信息 Tab -->
        <TabPane key="projectInfo" tab="項目信息">
          <Row :gutter="24">
            <Col :xs="24" :lg="16">
              <Card title="基本信息" class="mb-6">
                <div class="project-details space-y-3">
                  <div>
                    <Text type="secondary">項目名稱：</Text>
                    <Text strong>{{ projectInfo.name }}</Text>
                  </div>
                  <div>
                    <Text type="secondary">項目類型：</Text>
                    <Text>{{ projectInfo.type }}</Text>
                  </div>
                  <div>
                    <Text type="secondary">項目狀態：</Text>
                    <Tag :color="getStatusColor(projectInfo.status)">{{ projectInfo.status }}</Tag>
                  </div>
                  <div>
                    <Text type="secondary">創建人：</Text>
                    <Text>{{ projectInfo.creator }}</Text>
                  </div>
                  <div>
                    <Text type="secondary">創建時間：</Text>
                    <Text>{{ projectInfo.createTime }}</Text>
                  </div>
                  <div>
                    <Text type="secondary">開始時間：</Text>
                    <Text>{{ projectInfo.startTime }}</Text>
                  </div>
                  <div>
                    <Text type="secondary">結束時間：</Text>
                    <Text>{{ projectInfo.endTime }}</Text>
                  </div>
                  <div>
                    <Text type="secondary">到期時間：</Text>
                    <Text>{{ projectInfo.dueTime }}</Text>
                  </div>
                </div>
                <Divider />
                <div>
                  <Text type="secondary">項目描述：</Text>
                  <Paragraph class="!mt-2">
                    {{ projectInfo.description }}
                  </Paragraph>
                </div>
              </Card>
            </Col>
            <Col :xs="24" :lg="8">
              <Card title="項目統計" class="mb-6">
                <div class="space-y-4">
                  <div class="flex justify-between">
                    <Text type="secondary">總任務數</Text>
                    <Text strong>{{ recentTasks.length }}</Text>
                  </div>
                  <div class="flex justify-between">
                    <Text type="secondary">團隊成員</Text>
                    <Text strong>{{ projectMembers.length }}</Text>
                  </div>
                  <div class="flex justify-between">
                    <Text type="secondary">項目附件</Text>
                    <Text strong>{{ attachments.length }}</Text>
                  </div>
                  <div class="flex justify-between">
                    <Text type="secondary">關注人數</Text>
                    <Text strong>{{ followersCount }}</Text>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </TabPane>
        
        <!-- 成員管理 Tab -->
        <TabPane key="members" tab="成員管理">
          <Card>
            <template #title>
              <div class="flex items-center justify-between">
                <span>項目成員</span>
                <Button type="primary" @click="handleInviteMember">
                  <span class="icon-[lucide--user-plus] size-4 mr-1" />
                  邀請成員
                </Button>
              </div>
            </template>
            <div class="members-list">
              <Row :gutter="[16, 16]">
                <Col v-for="member in projectMembers" :key="member.id" :xs="24" :sm="12" :md="8" :lg="6">
                  <Card class="member-card" size="small">
                    <div class="flex flex-col items-center text-center p-4">
                      <Avatar :src="member.avatar" :size="64" class="mb-3">
                        {{ member.name.charAt(0) }}
                      </Avatar>
                      <div class="font-medium text-base mb-1">{{ member.name }}</div>
                      <div class="text-sm text-gray-500 mb-2">{{ member.role }}</div>
                      <div class="text-xs text-gray-400 space-y-1">
                        <div>{{ member.email }}</div>
                        <div>{{ member.phone }}</div>
                        <div>{{ member.department }}</div>
                        <div>加入時間：{{ member.joinTime }}</div>
                      </div>
                    </div>
                  </Card>
                </Col>
              </Row>
            </div>
          </Card>
        </TabPane>
        
        <!-- 任務管理 Tab -->
        <TabPane key="tasks" tab="任務管理">
          <Card>
            <template #title>
              <div class="flex items-center justify-between">
                <span>項目任務</span>
                <Button type="primary" @click="handleViewMoreTasks">
                  <span class="icon-[lucide--plus] size-4 mr-1" />
                  新增任務
                </Button>
              </div>
            </template>
            <div v-if="recentTasks.length > 0">
              <Table 
                :columns="taskColumns"
                :dataSource="recentTasks" 
                :pagination="false"
                :scroll="{ x: 1000 }"
              >
                <template #bodyCell="{ column, record }">
                  <!-- 狀態列 -->
                  <template v-if="column.key === 'status'">
                    <Tag :color="getStatusColor(record.status)">{{ getStatusText(record.status) }}</Tag>
                  </template>
                  
                  <!-- 優先級列 -->
                  <template v-else-if="column.key === 'priority'">
                    <Tag :color="getPriorityColor(record.priority)">{{ getPriorityText(record.priority) }}</Tag>
                  </template>
                  
                  <!-- 操作列 -->
                  <template v-else-if="column.key === 'operation'">
                    <Button type="link" size="small" @click="handleViewTaskDetail(record)">
                      查看詳情
                    </Button>
                  </template>
                </template>
              </Table>
              
              <!-- 查看更多按鈕 -->
              <div class="text-center mt-4">
                <Button type="primary" @click="handleViewMoreTasks">
                  查看更多
                </Button>
              </div>
            </div>
            <Empty v-else description="暫無任務數據" />
          </Card>
        </TabPane>
        
        <!-- 附件管理 Tab -->
        <TabPane key="attachments" tab="附件管理">
          <Card>
            <template #title>
              <div class="flex items-center justify-between">
                <span>項目附件</span>
                <Button type="primary" @click="handleUploadAttachment">
                  <span class="icon-[lucide--upload] size-4 mr-1" />
                  上傳附件
                </Button>
              </div>
            </template>
            <div v-if="attachments.length > 0" class="attachments-list space-y-4">
              <div v-for="attachment in attachments" :key="attachment.id" class="attachment-item">
                <div class="flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50">
                  <!-- 文件圖標 -->
                  <div class="flex-shrink-0">
                    <span :class="getFileIconClass(attachment.type)" class="size-10" />
                  </div>
                  
                  <!-- 文件信息 -->
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between mb-2">
                      <Text strong class="text-lg">{{ attachment.name }}</Text>
                      <div class="flex items-center space-x-2">
                        <Button type="link" size="small" @click="handlePreviewAttachment(attachment)">
                          <span class="icon-[lucide--eye] size-4" />
                        </Button>
                        <Button type="link" size="small" @click="handleEditAttachment(attachment)">
                          <span class="icon-[lucide--edit] size-4" />
                        </Button>
                        <Button type="link" size="small" @click="handleDownloadAttachment(attachment)">
                          <span class="icon-[lucide--download] size-4" />
                        </Button>
                        <Popconfirm
                          title="確定要刪除這個附件嗎？"
                          ok-text="確定"
                          cancel-text="取消"
                          @confirm="handleDeleteAttachment(attachment)"
                        >
                          <Button type="link" size="small" danger>
                            <span class="icon-[lucide--trash-2] size-4" />
                          </Button>
                        </Popconfirm>
                      </div>
                    </div>
                    
                    <!-- 文件詳情 -->
                    <div class="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                      <span>{{ attachment.size }}</span>
                      <span>{{ attachment.type }}</span>
                      <span>{{ attachment.uploadTime }}</span>
                      <span>上傳者：{{ attachment.uploader }}</span>
                    </div>
                    
                    <!-- 標籤 -->
                    <div v-if="attachment.tags && attachment.tags.length > 0" class="mb-2">
                      <Tag v-for="tag in attachment.tags" :key="tag" size="small" class="mr-1">
                        {{ tag }}
                      </Tag>
                    </div>
                    
                    <!-- 備註 -->
                    <div v-if="attachment.remark" class="text-sm text-gray-600 mb-3">
                      <Text type="secondary">備註：{{ attachment.remark }}</Text>
                    </div>
                    
                    <!-- 評論區域 -->
                    <div v-if="attachment.comments && attachment.comments.length > 0" class="comments-section">
                      <Divider class="!my-3" />
                      <div class="space-y-3">
                        <div v-for="comment in attachment.comments" :key="comment.id" class="comment-item">
                          <div class="flex items-start space-x-3">
                            <Avatar :src="comment.avatar" :size="32">
                              {{ comment.user.charAt(0) }}
                            </Avatar>
                            <div class="flex-1">
                              <div class="text-sm">
                                <Text strong>{{ comment.user }}</Text>
                                <Text type="secondary" class="ml-2">{{ comment.time }}</Text>
                              </div>
                              <div class="text-sm text-gray-600 mt-1">{{ comment.content }}</div>
                              
                              <!-- 回復 -->
                              <div v-if="comment.replies && comment.replies.length > 0" class="ml-4 mt-2 space-y-2">
                                <div v-for="reply in comment.replies" :key="reply.id" class="reply-item">
                                  <div class="flex items-start space-x-2">
                                    <Avatar :src="reply.avatar" :size="24">
                                      {{ reply.user.charAt(0) }}
                                    </Avatar>
                                    <div class="flex-1">
                                      <div class="text-xs">
                                        <Text strong>{{ reply.user }}</Text>
                                        <Text type="secondary" class="ml-2">{{ reply.time }}</Text>
                                      </div>
                                      <div class="text-xs text-gray-600 mt-1">{{ reply.content }}</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <Button type="link" size="small" class="text-xs p-0 h-auto mt-2" @click="handleReplyComment(attachment, comment)">
                                回復
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Empty v-else description="暫無附件數據" />
          </Card>
        </TabPane>
        
        <!-- 里程碑 Tab -->
        <TabPane key="milestones" tab="里程碑">
          <Card>
            <template #title>
              <div class="flex items-center justify-between">
                <span>項目里程碑</span>
                <Button type="primary">
                  <span class="icon-[lucide--plus] size-4 mr-1" />
                  新增里程碑
                </Button>
              </div>
            </template>
            <div v-if="milestones.length > 0">
              <Timeline>
                <TimelineItem
                  v-for="milestone in milestones"
                  :key="milestone.id"
                  :color="getStatusColor(milestone.status)"
                >
                  <div class="milestone-item">
                    <div class="flex items-center justify-between mb-2">
                      <Text strong class="text-lg">{{ milestone.title }}</Text>
                      <Text type="secondary" class="text-sm">{{ milestone.date }}</Text>
                    </div>
                    <Text type="secondary" class="text-sm">{{ milestone.description }}</Text>
                    <div class="mt-2">
                      <Tag :color="getStatusColor(milestone.status)" size="small">
                        {{ getStatusText(milestone.status) }}
                      </Tag>
                    </div>
                  </div>
                </TimelineItem>
              </Timeline>
            </div>
            <Empty v-else description="暫無里程碑數據" />
          </Card>
        </TabPane>
        
        <!-- 動態 Tab -->
        <TabPane key="activities" tab="動態">
          <Card title="項目動態">
            <div v-if="activities.length > 0" class="activities-list space-y-4">
              <div v-for="activity in activities" :key="activity.id" class="activity-item flex space-x-3">
                <Avatar :src="activity.avatar" :size="40">
                  {{ activity.user.charAt(0) }}
                </Avatar>
                <div class="flex-1">
                  <div class="activity-content">
                    <Text strong>{{ activity.user }}</Text>
                    <Text class="ml-1">{{ activity.content }}</Text>
                  </div>
                  <Text type="secondary" class="text-sm">{{ activity.time }}</Text>
                </div>
                <span :class="getActivityIconClass(activity.type)" />
              </div>
            </div>
            <Empty v-else description="暫無動態數據" />
          </Card>
        </TabPane>
        
        <!-- 知悉 Tab -->
        <TabPane key="acknowledgments" tab="知悉">
          <Card title="知悉記錄">
            <div v-if="acknowledgments.length > 0" class="acknowledgments-list space-y-4">
              <div v-for="ack in acknowledgments" :key="ack.id" class="ack-item">
                <div class="flex items-center justify-between mb-2">
                  <Text strong class="text-base cursor-pointer hover:text-blue-500" @click="handleViewAcknowledgmentDetail(ack)">
                    {{ ack.taskName }}
                  </Text>
                  <Tag :color="getStatusColor(ack.status)" size="small">
                    {{ getStatusText(ack.status) }}
                  </Tag>
                </div>
                <div class="flex items-center justify-between">
                  <Text type="secondary" class="text-sm">負責人：{{ ack.assignee }}</Text>
                  <Text type="secondary" class="text-sm">{{ ack.time }}</Text>
                </div>
                <div v-if="ack.content" class="mt-2">
                  <Text type="secondary" class="text-sm">{{ ack.content }}</Text>
                </div>
              </div>
            </div>
            <Empty v-else description="暫無知悉記錄" />
            <div v-if="acknowledgments.length > 3" class="mt-4">
              <Button type="link" block @click="handleViewMoreAcknowledments">
                查看更多
              </Button>
            </div>
          </Card>
        </TabPane>
        
        <!-- 通知記錄 Tab -->
        <TabPane key="notifications" tab="通知記錄">
          <Card title="通知記錄">
            <div v-if="notificationHistory.length > 0" class="notification-history-list space-y-4">
              <div v-for="notification in notificationHistory" :key="notification.id" class="notification-item">
                <div class="flex items-start justify-between mb-3">
                  <div class="flex-1">
                    <div class="flex items-center space-x-2 mb-2">
                      <Text strong class="text-base">{{ notification.title }}</Text>
                      <Tag :color="getNotificationStatusColor(notification.status)" size="small">
                        {{ getNotificationStatusText(notification.status) }}
                      </Tag>
                    </div>
                    <Text type="secondary" class="text-sm block mb-2">{{ notification.content }}</Text>
                    <div class="flex items-center space-x-2 text-sm text-gray-500">
                      <span>接收人：{{ notification.recipients.join(', ') }}</span>
                    </div>
                  </div>
                </div>
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-1">
                    <Tag v-for="method in notification.methods" :key="method" size="small" color="blue">
                      {{ getNotificationMethodText(method) }}
                    </Tag>
                  </div>
                  <Text type="secondary" class="text-sm">{{ notification.sendTime }}</Text>
                </div>
              </div>
            </div>
            <Empty v-else description="暫無通知記錄" />
          </Card>
        </TabPane>
      </Tabs>
    </div>
  </Page>
</template>

<style scoped>
.project-detail-tabs {
  padding: 0;
}

.project-tabs :deep(.ant-tabs-content-holder) {
  padding-top: 16px;
}

.member-card {
  transition: all 0.3s ease;
}

.member-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.task-item,
.attachment-item {
  transition: all 0.3s ease;
}

.task-item:hover,
.attachment-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.milestone-item {
  padding: 12px 0;
}

.comment-item {
  padding: 8px 0;
}

.comment-item:not(:last-child) {
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 12px;
  margin-bottom: 12px;
}

.reply-item {
  background-color: #f5f5f5;
  border-radius: 4px;
  padding: 8px;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .project-detail-tabs {
    padding: 0;
  }
  
  .project-details {
    margin-top: 16px;
  }
  
  .attachment-item .flex {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .attachment-item .flex > div:first-child {
    margin-bottom: 8px;
  }
}
</style>
