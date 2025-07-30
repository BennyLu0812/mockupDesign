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
  InputNumber,
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

// 通知功能相關數據
const notificationModalVisible = ref(false);
const notificationForm = reactive({
  content: '',
  recipients: [],
});

// 可選的通知接收人（項目成員）
const notificationRecipients = ref([
  {
    id: '1',
    name: '陳大文',
    role: '項目負責人',
    email: 'chen@example.com',
    avatar: '/api/placeholder/32/32',
    selected: false,
  },
  {
    id: '2',
    name: '陳志華',
    role: '法律顧問',
    email: 'chen.zh@example.com',
    avatar: '/api/placeholder/32/32',
    selected: false,
  },
  {
    id: '3',
    name: '林雅婷',
    role: '項目助理',
    email: 'lin@example.com',
    avatar: '/api/placeholder/32/32',
    selected: false,
  },
  {
    id: '4',
    name: '黃建國',
    role: '技術專家',
    email: 'huang@example.com',
    avatar: '/api/placeholder/32/32',
    selected: false,
  },
]);

// 新增任務抽屜狀態
const createTaskDrawerVisible = ref(false);

// 新增任務表單數據
const createTaskFormData = reactive({
  taskName: '',
  taskDescription: '',
  projectName: projectInfo.name, // 默認為當前項目
  taskStatus: 'preparing',
  taskResponsible: '',
  taskStartTime: undefined,
  taskEndTime: undefined,
  taskParticipants: [],
  taskRemarks: '',
  taskDueTime: undefined,
  estimatedHours: 0,
  attachments: [] as any[],
});

// 任務負責人選項
const taskResponsibleOptions = [
  { value: 'chen', label: '陳大文' },
  { value: 'zhang', label: '陳志華' },
  { value: 'li', label: '林雅婷' },
  { value: 'wang', label: '黃建國' },
  { value: 'zhao', label: '趙六' },
  { value: 'qian', label: '錢七' },
];

// 任務參與人員選項（包含個人和小組）
const taskParticipantOptions = [
  // 個人選項
  { value: 'chen', label: '陳大文', type: 'person' },
  { value: 'zhang', label: '陳志華', type: 'person' },
  { value: 'li', label: '林雅婷', type: 'person' },
  { value: 'wang', label: '黃建國', type: 'person' },
  { value: 'zhao', label: '趙六', type: 'person' },
  { value: 'qian', label: '錢七', type: 'person' },
  // 小組選項
  { value: 'group_legal_review', label: '法律審查小組', type: 'group' },
  { value: 'group_data_collection', label: '資料收集小組', type: 'group' },
];

// 項目名稱選項
const projectNameOptions = [
  { value: 'project1', label: '法律諮詢系統開發' },
  { value: 'project2', label: '合同管理平台' },
  { value: 'project3', label: '法規檢索系統' },
  { value: 'project4', label: '案件管理系統' },
  { value: 'project5', label: '文件歸檔系統' },
];

// 項目標籤
const projectTags = ref([
  {
    id: '1',
    name: '法律審查',
    color: 'blue',
    description: '項目法律審查標籤',
    createTime: '2024-01-15 10:30:00',
    creator: '陳大文',
  },
  {
    id: '2',
    name: '緊急',
    color: 'red',
    description: '緊急處理標籤',
    createTime: '2024-01-15 11:00:00',
    creator: '陳大文',
  },
  {
    id: '3',
    name: '政府項目',
    color: 'green',
    description: '政府相關項目標籤',
    createTime: '2024-01-15 12:00:00',
    creator: '陳大文',
  },
]);

// 標籤管理相關數據
const tagManagementVisible = ref(false);
const tagForm = reactive({
  id: '',
  name: '',
  color: 'blue',
  description: '',
});
const isEditingTag = ref(false);
const tagColors = [
  { value: 'blue', label: '藍色' },
  { value: 'green', label: '綠色' },
  { value: 'red', label: '紅色' },
  { value: 'orange', label: '橙色' },
  { value: 'purple', label: '紫色' },
  { value: 'cyan', label: '青色' },
  { value: 'magenta', label: '洋紅' },
  { value: 'gold', label: '金色' },
  { value: 'lime', label: '檸檬綠' },
  { value: 'volcano', label: '火山紅' },
];

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

// 控制評論顯示狀態
const commentVisibility = ref({});

// 控制版本顯示狀態
const versionVisibility = ref({});

// 流程狀態指示器相關數據
const processSteps = ref([
  {
    id: 1,
    name: '待處理',
    status: 'pending', // pending, active, completed
    number: '1'
  },
  {
    id: 2,
    name: '處理中',
    status: 'active',
    number: '2'
  },
  {
    id: 3,
    name: '已完成',
    status: 'pending',
    number: '✓'
  }
]);

// 項目流程節點記錄
const processNodes = ref([
  {
    id: '1',
    nodeName: '項目創建',
    status: 'completed',
    operator: '陳大文',
    operatorAvatar: '/api/placeholder/32/32',
    operateTime: '2024-01-15 10:30:00',
    description: '項目正式創建，初始化項目基本信息',
    duration: '30分鐘',
  },
  {
    id: '2',
    nodeName: '團隊組建',
    status: 'completed',
    operator: '陳大文',
    operatorAvatar: '/api/placeholder/32/32',
    operateTime: '2024-01-15 14:20:00',
    description: '邀請團隊成員加入項目，分配初始角色',
    duration: '2小時',
  },
  {
    id: '3',
    nodeName: '需求分析',
    status: 'completed',
    operator: '陳志華',
    operatorAvatar: '/api/placeholder/32/32',
    operateTime: '2024-01-16 09:15:00',
    description: '完成項目需求分析，確定審查範圍和標準',
    duration: '1天',
  },
  {
    id: '4',
    nodeName: '初步審查',
    status: 'inProgress',
    operator: '林雅婷',
    operatorAvatar: '/api/placeholder/32/32',
    operateTime: '2024-01-18 08:30:00',
    description: '正在進行法律條文的初步審查工作',
    duration: '處理中',
  },
  {
    id: '5',
    nodeName: '專家評審',
    status: 'pending',
    operator: '',
    operatorAvatar: '',
    operateTime: '',
    description: '等待外部專家進行評審',
    duration: '待定',
  },
  {
    id: '6',
    nodeName: '最終報告',
    status: 'pending',
    operator: '',
    operatorAvatar: '',
    operateTime: '',
    description: '提交最終審查報告',
    duration: '待定',
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
    version: '3.0',
    versions: [
      {
        id: 'v1',
        version: '1.0',
        name: '法律條文草案_v1.0.pdf',
        size: '2.1MB',
        uploadTime: '2024-01-15 10:00:00',
        uploader: '陳大文',
        remark: '初始版本',
        changes: '創建初始草案文件',
      },
      {
        id: 'v2',
        version: '2.0',
        name: '法律條文草案_v2.0.pdf',
        size: '2.3MB',
        uploadTime: '2024-01-18 16:20:00',
        uploader: '林雅婷',
        remark: '修正第三條內容',
        changes: '根據專家意見修改第三條法律條文',
      },
      {
        id: 'v3',
        version: '3.0',
        name: '法律條文草案.pdf',
        size: '2.5MB',
        uploadTime: '2024-01-20 14:30:00',
        uploader: '陳大文',
        remark: '第一版草案，需要仔細審查',
        changes: '增加附錄說明，完善法條解釋',
        isCurrent: true,
      },
    ],
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
    preparing: 'purple',
  };
  return colorMap[status] || 'default';
};

const getStatusText = (status: string) => {
  const textMap = {
    pending: '待處理',
    inProgress: '處理中',
    completed: '已完成',
    cancelled: '已取消',
    preparing: '準備中',
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

// 通知功能相關處理函數
// 打開通知設置彈窗
const handleOpenNotificationModal = () => {
  notificationModalVisible.value = true;
  // 初始化表單數據
  notificationForm.content = '';
  notificationForm.recipients = notificationRecipients.value.filter(r => r.selected).map(r => r.id);
};

// 關閉通知設置彈窗
const handleCloseNotificationModal = () => {
  notificationModalVisible.value = false;
};

// 發送通知
const handleSendNotification = () => {
  if (!notificationForm.content.trim()) {
    message.warning('請輸入通知內容');
    return;
  }
  if (notificationForm.recipients.length === 0) {
    message.warning('請選擇通知接收人');
    return;
  }

  // 模擬發送通知
  const newNotification = {
    id: Date.now().toString(),
    title: '項目通知',
    content: notificationForm.content,
    recipients: notificationForm.recipients.map(id => {
      const recipient = notificationRecipients.value.find(r => r.id === id);
      return recipient?.name || '';
    }).filter(Boolean),
    methods: ['email'],
    sendTime: new Date().toLocaleString('zh-CN'),
    status: 'sent',
  };

  notificationHistory.value.unshift(newNotification);
  message.success('通知發送成功');
  handleCloseNotificationModal();
};

// 切換接收人選擇狀態
const handleToggleRecipient = (recipientId: string) => {
  const recipient = notificationRecipients.value.find(r => r.id === recipientId);
  if (recipient) {
    recipient.selected = !recipient.selected;
    // 更新表單中的接收人列表
    notificationForm.recipients = notificationRecipients.value.filter(r => r.selected).map(r => r.id);
  }
};

const handleInviteMember = () => {
  message.info('邀請成員功能開發中');
};

const handleViewAllTasks = () => {
  message.info('查看全部任務功能開發中');
};

// 獲取參與人員標籤
const getParticipantLabel = (participantValue: string) => {
  const participant = taskParticipantOptions.find(option => option.value === participantValue);
  return participant ? participant.label : participantValue;
};

// 新增任務處理函數
const handleAddTask = () => {
  createTaskDrawerVisible.value = true;
};

// 關閉新增任務抽屜
const closeCreateTaskDrawer = () => {
  createTaskDrawerVisible.value = false;
  // 重置表單
  Object.assign(createTaskFormData, {
    taskName: '',
    taskDescription: '',
    projectName: projectInfo.name,
    taskStatus: 'preparing',
    taskResponsible: '',
    taskStartTime: undefined,
    taskEndTime: undefined,
    taskParticipants: [],
    taskRemarks: '',
    taskDueTime: undefined,
    estimatedHours: 0,
    attachments: [],
  });
};

// 保存新增任務
const handleSaveTask = () => {
  if (!createTaskFormData.taskName) {
    message.error('請輸入任務名稱');
    return;
  }
  
  if (!createTaskFormData.taskResponsible) {
    message.error('請選擇任務負責人');
    return;
  }
  
  // 模擬保存
  const newTask = {
    id: Date.now(),
    title: createTaskFormData.taskName,
    description: createTaskFormData.taskDescription,
    projectName: createTaskFormData.projectName,
    status: 'preparing',
    assignee: taskResponsibleOptions.find(opt => opt.value === createTaskFormData.taskResponsible)?.label || '未知',
    creator: '當前用戶',
    createTime: new Date().toLocaleString('zh-CN'),
    priority: 'medium',
    dueDate: createTaskFormData.taskDueTime,
    taskNumber: `T${Date.now().toString().slice(-6)}`,
  };
  
  // 添加到最新任務列表
  recentTasks.value.unshift(newTask);
  if (recentTasks.value.length > 5) {
    recentTasks.value = recentTasks.value.slice(0, 5);
  }
  
  message.success('任務創建成功');
  closeCreateTaskDrawer();
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

// 切換評論顯示狀態
const toggleComments = (attachmentId) => {
  commentVisibility.value[attachmentId] = !commentVisibility.value[attachmentId];
};

// 檢查評論是否顯示
const isCommentsVisible = (attachmentId) => {
  return commentVisibility.value[attachmentId] || false;
};

// 切換版本顯示狀態
const toggleVersions = (attachmentId) => {
  versionVisibility.value[attachmentId] = !versionVisibility.value[attachmentId];
};

// 檢查版本是否顯示
const isVersionsVisible = (attachmentId) => {
  return versionVisibility.value[attachmentId] || false;
};

// 下載指定版本
const handleDownloadVersion = (attachment, version) => {
  message.success(`下載版本 ${version.version}: ${version.name}`);
};

// 恢復到指定版本
const handleRestoreVersion = (attachment, version) => {
  message.success(`恢復到版本 ${version.version}`);
};

// 標籤管理相關函數
// 打開標籤管理模態框
const handleOpenTagManagement = () => {
  tagManagementVisible.value = true;
};

// 關閉標籤管理模態框
const handleCloseTagManagement = () => {
  tagManagementVisible.value = false;
  resetTagForm();
};

// 重置標籤表單
const resetTagForm = () => {
  tagForm.id = '';
  tagForm.name = '';
  tagForm.color = 'blue';
  tagForm.description = '';
  isEditingTag.value = false;
};

// 添加新標籤
const handleAddTag = () => {
  if (!tagForm.name.trim()) {
    message.warning('請輸入標籤名稱');
    return;
  }
  
  // 檢查標籤名稱是否重複
  const existingTag = projectTags.value.find(tag => tag.name === tagForm.name.trim());
  if (existingTag && existingTag.id !== tagForm.id) {
    message.warning('標籤名稱已存在');
    return;
  }
  
  if (isEditingTag.value) {
    // 編輯現有標籤
    const tagIndex = projectTags.value.findIndex(tag => tag.id === tagForm.id);
    if (tagIndex > -1) {
      projectTags.value[tagIndex] = {
        ...projectTags.value[tagIndex],
        name: tagForm.name.trim(),
        color: tagForm.color,
        description: tagForm.description.trim(),
      };
      message.success('標籤更新成功');
    }
  } else {
    // 添加新標籤
    const newTag = {
      id: Date.now().toString(),
      name: tagForm.name.trim(),
      color: tagForm.color,
      description: tagForm.description.trim(),
      createTime: new Date().toLocaleString('zh-CN'),
      creator: '當前用戶', // 這裡應該從用戶狀態獲取
    };
    projectTags.value.push(newTag);
    message.success('標籤添加成功');
  }
  
  resetTagForm();
};

// 編輯標籤
const handleEditTag = (tag: any) => {
  tagForm.id = tag.id;
  tagForm.name = tag.name;
  tagForm.color = tag.color;
  tagForm.description = tag.description;
  isEditingTag.value = true;
};

// 刪除標籤
const handleDeleteTag = (tagId: string) => {
  const tagIndex = projectTags.value.findIndex(tag => tag.id === tagId);
  if (tagIndex > -1) {
    projectTags.value.splice(tagIndex, 1);
    message.success('標籤刪除成功');
  }
};

// 獲取顏色預覽樣式
const getColorPreviewStyle = (color: string) => {
  return {
    backgroundColor: getTagColor(color),
    width: '16px',
    height: '16px',
    borderRadius: '2px',
    display: 'inline-block',
  };
};

// 獲取標籤顏色
const getTagColor = (color: string) => {
  const colorMap: Record<string, string> = {
    blue: '#1890ff',
    green: '#52c41a',
    red: '#ff4d4f',
    orange: '#fa8c16',
    purple: '#722ed1',
    cyan: '#13c2c2',
    magenta: '#eb2f96',
    gold: '#faad14',
    lime: '#a0d911',
    volcano: '#fa541c',
  };
  return colorMap[color] || '#1890ff';
};

// 根據項目狀態更新流程步驟
const updateProcessSteps = () => {
  const status = projectInfo.status;
  
  // 重置所有步驟為 pending
  processSteps.value.forEach(step => {
    step.status = 'pending';
  });
  
  if (status === '待處理') {
    processSteps.value[0].status = 'active';
  } else if (status === '處理中') {
    processSteps.value[0].status = 'completed';
    processSteps.value[1].status = 'active';
  } else if (status === '已完成') {
    processSteps.value[0].status = 'completed';
    processSteps.value[1].status = 'completed';
    processSteps.value[2].status = 'completed';
  }
};

// 獲取步驟圓形樣式
const getStepCircleStyle = (step) => {
  if (step.status === 'pending') {
    return {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      border: '2px solid #E5E7EB',
      backgroundColor: '#FFFFFF',
      color: '#9CA3AF',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold'
    };
  } else if (step.status === 'active') {
    return {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      backgroundColor: '#F97316',
      color: '#FFFFFF',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold'
    };
  } else { // completed
    return {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      backgroundColor: '#10B981',
      color: '#FFFFFF',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold'
    };
  }
};

// 獲取步驟文字樣式
const getStepTextStyle = (step) => {
  if (step.status === 'pending') {
    return {
      fontSize: '14px',
      color: '#9CA3AF',
      marginTop: '8px',
      textAlign: 'center',
      fontWeight: '500'
    };
  } else if (step.status === 'active') {
    return {
      fontSize: '14px',
      color: '#F97316',
      marginTop: '8px',
      textAlign: 'center',
      fontWeight: '600'
    };
  } else { // completed
    return {
      fontSize: '14px',
      color: '#10B981',
      marginTop: '8px',
      textAlign: 'center',
      fontWeight: '600'
    };
  }
};

// 獲取連接線樣式
const getConnectorStyle = (index) => {
  const currentStep = processSteps.value[index];
  const nextStep = processSteps.value[index + 1];
  
  if (currentStep.status === 'completed' && nextStep.status !== 'pending') {
    return {
      width: '60px',
      height: '2px',
      backgroundColor: '#10B981',
      margin: '0 16px'
    };
  } else {
    return {
      width: '60px',
      height: '2px',
      backgroundColor: '#E5E7EB',
      margin: '0 16px'
    };
  }
};

// 獲取節點狀態顏色
const getNodeStatusColor = (status) => {
  const colorMap = {
    completed: 'text-green-500',
    inProgress: 'text-blue-500',
    pending: 'text-gray-400',
  };
  return colorMap[status] || 'text-gray-400';
};

// 獲取節點連接線樣式
const getNodeLineClass = (status, isLast) => {
  if (isLast) return 'hidden';
  const baseClass = 'w-px h-12 ml-3 border-l-2';
  const colorMap = {
    completed: 'border-green-500',
    inProgress: 'border-blue-500',
    pending: 'border-gray-300',
  };
  return `${baseClass} ${colorMap[status] || 'border-gray-300'}`;
};

const handleViewAcknowledgmentDetail = (ack) => {
  message.info(`查看知悉詳情：${ack.taskName}`);
};

const handleViewMoreAcknowledments = () => {
  message.info('查看更多知悉記錄');
};

onMounted(() => {
  console.log('項目詳情Tab頁面加載，項目ID:', route.params.id);
  updateProcessSteps();
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
              <Button size="small" type="dashed" @click="handleOpenTagManagement">
                <span class="icon-[lucide--tag] size-4 mr-1" />
                標籤管理
              </Button>
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
            <Button @click="handleOpenNotificationModal">
              <span class="icon-[lucide--bell] size-4 mr-1" />
              發送通知
            </Button>
            <Button type="primary" @click="handleAddTask">
              <span class="icon-[lucide--plus] size-4 mr-1" />
              新增任務
            </Button>
          </Space>
        </div>
      </div>
      
      <!-- Tab 內容 -->
      <Tabs v-model:activeKey="activeTab" type="card" class="project-tabs">
        <!-- 項目信息 Tab -->
        <TabPane key="projectInfo" tab="項目信息">
          <Row :gutter="5">
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
          <Card title="項目任務">
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
                    
                    <!-- 控制按鈕組 -->
                    <div class="mb-3 flex items-center space-x-4">
                      <!-- 評論控制按鈕 -->
                      <Button 
                        v-if="attachment.comments && attachment.comments.length > 0"
                        type="link" 
                        size="small" 
                        @click="toggleComments(attachment.id)"
                        class="p-0 h-auto text-blue-600"
                      >
                        <span :class="isCommentsVisible(attachment.id) ? 'icon-[lucide--chevron-up]' : 'icon-[lucide--chevron-down]'" class="size-4 mr-1" />
                        {{ isCommentsVisible(attachment.id) ? '隱藏評論' : `查看評論 (${attachment.comments.length})` }}
                      </Button>
                      
                      <!-- 版本控制按鈕 -->
                      <Button 
                        v-if="attachment.versions && attachment.versions.length > 1"
                        type="link" 
                        size="small" 
                        @click="toggleVersions(attachment.id)"
                        class="p-0 h-auto text-green-600"
                      >
                        <span :class="isVersionsVisible(attachment.id) ? 'icon-[lucide--chevron-up]' : 'icon-[lucide--chevron-down]'" class="size-4 mr-1" />
                        {{ isVersionsVisible(attachment.id) ? '隱藏版本' : `查看版本 (${attachment.versions.length})` }}
                      </Button>
                    </div>
                    
                    <!-- 評論區域 -->
                    <div v-if="attachment.comments && attachment.comments.length > 0 && isCommentsVisible(attachment.id)" class="comments-section">
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
                    
                    <!-- 版本歷史區域 -->
                    <div v-if="attachment.versions && attachment.versions.length > 1 && isVersionsVisible(attachment.id)" class="versions-section">
                      <Divider class="!my-3" />
                      <div class="space-y-3">
                        <div class="text-sm font-medium text-gray-700 mb-3">版本歷史</div>
                        <div v-for="version in attachment.versions" :key="version.id" class="version-item">
                          <div class="flex items-start justify-between p-3 border rounded-lg hover:bg-gray-50">
                            <div class="flex-1">
                              <div class="flex items-center space-x-2 mb-2">
                                <Tag :color="version.isCurrent ? 'green' : 'blue'" size="small">
                                  v{{ version.version }}
                                </Tag>
                                <Text strong class="text-sm">{{ version.name }}</Text>
                                <Text v-if="version.isCurrent" type="success" class="text-xs">(當前版本)</Text>
                              </div>
                              
                              <div class="flex items-center space-x-4 text-xs text-gray-500 mb-2">
                                <span>{{ version.size }}</span>
                                <span>{{ version.uploadTime }}</span>
                                <span>上傳者：{{ version.uploader }}</span>
                              </div>
                              
                              <div v-if="version.remark" class="text-xs text-gray-600 mb-1">
                                <Text type="secondary">備註：{{ version.remark }}</Text>
                              </div>
                              
                              <div v-if="version.changes" class="text-xs text-gray-600">
                                <Text type="secondary">變更說明：{{ version.changes }}</Text>
                              </div>
                            </div>
                            
                            <div class="flex items-center space-x-2 ml-4">
                              <Button type="link" size="small" @click="handleDownloadVersion(attachment, version)">
                                <span class="icon-[lucide--download] size-3" />
                              </Button>
                              <Button 
                                v-if="!version.isCurrent" 
                                type="link" 
                                size="small" 
                                @click="handleRestoreVersion(attachment, version)"
                              >
                                <span class="icon-[lucide--rotate-ccw] size-3" />
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
        
        <!-- 流程 Tab -->
        <TabPane key="process" tab="流程">
          <Card title="項目流程">
            <!-- 流程狀態指示器 -->
            <div class="process-indicator mb-8">
              <div class="flex items-center justify-center">
                <div v-for="(step, index) in processSteps" :key="step.id" class="flex items-center">
                  <!-- 步驟圓形 -->
                  <div class="flex flex-col items-center">
                    <div :style="getStepCircleStyle(step)">
                      {{ step.number }}
                    </div>
                    <div :style="getStepTextStyle(step)">
                      {{ step.name }}
                    </div>
                  </div>
                  
                  <!-- 連接線 -->
                  <div v-if="index < processSteps.length - 1" :style="getConnectorStyle(index)"></div>
                </div>
              </div>
            </div>
            

          </Card>
        </TabPane>
      </Tabs>
    </div>
    
    <!-- 標籤管理模態框 -->
    <Modal
      v-model:open="tagManagementVisible"
      title="標籤管理"
      width="800px"
      :footer="null"
      @cancel="handleCloseTagManagement"
    >
      <div class="tag-management-content">
        <!-- 現有標籤列表 -->
        <Card title="現有標籤" class="mb-4">
          <div v-if="projectTags.length > 0" class="tags-list space-y-3">
            <div v-for="tag in projectTags" :key="tag.id" class="tag-item">
              <div class="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div class="flex items-center space-x-3">
                  <div :style="getColorPreviewStyle(tag.color)"></div>
                  <div>
                    <Text strong class="text-sm">{{ tag.name }}</Text>
                    <Text type="secondary" class="text-xs block">{{ tag.description || '無描述' }}</Text>
                    <Text type="secondary" class="text-xs">創建時間：{{ tag.createTime }} | 創建者：{{ tag.creator }}</Text>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <Button size="small" @click="handleEditTag(tag)">
                    <span class="icon-[lucide--edit] size-4" />
                  </Button>
                  <Popconfirm
                    title="確定要刪除這個標籤嗎？"
                    ok-text="確定"
                    cancel-text="取消"
                    @confirm="handleDeleteTag(tag.id)"
                  >
                    <Button size="small" danger>
                      <span class="icon-[lucide--trash-2] size-4" />
                    </Button>
                  </Popconfirm>
                </div>
              </div>
            </div>
          </div>
          <Empty v-else description="暫無標籤" />
        </Card>
        
        <!-- 添加/編輯標籤表單 -->
        <Card :title="isEditingTag ? '編輯標籤' : '添加標籤'">
          <Form layout="vertical">
            <FormItem label="標籤名稱" required>
              <Input 
                v-model:value="tagForm.name" 
                placeholder="請輸入標籤名稱"
                :maxlength="20"
              />
            </FormItem>
            
            <FormItem label="標籤顏色" required>
              <Select v-model:value="tagForm.color" placeholder="請選擇標籤顏色">
                <SelectOption v-for="color in tagColors" :key="color.value" :value="color.value">
                  <div class="flex items-center space-x-2">
                    <div :style="getColorPreviewStyle(color.value)"></div>
                    <span>{{ color.label }}</span>
                  </div>
                </SelectOption>
              </Select>
            </FormItem>
            
            <FormItem label="標籤描述">
              <Input.TextArea 
                v-model:value="tagForm.description" 
                placeholder="請輸入標籤描述（可選）"
                :rows="3" 
                :maxlength="100"
              />
            </FormItem>
            
            <FormItem>
              <Space>
                <Button type="primary" @click="handleAddTag">
                  {{ isEditingTag ? '更新標籤' : '添加標籤' }}
                </Button>
                <Button v-if="isEditingTag" @click="resetTagForm">
                  取消編輯
                </Button>
              </Space>
            </FormItem>
          </Form>
        </Card>
       </div>
     </Modal>
     
     <!-- 通知功能模態框 -->
     <Modal
       v-model:open="notificationModalVisible"
       title="發送通知"
       width="600px"
       :footer="null"
       @cancel="handleCloseNotificationModal"
     >
       <div class="notification-modal-content">
         <Form layout="vertical">
           <FormItem label="通知內容">
             <Input.TextArea 
               v-model:value="notificationForm.content" 
               :rows="6" 
               placeholder="請輸入通知內容"
             />
           </FormItem>
           
           <FormItem label="接收人員">
             <div class="recipients-list space-y-2">
               <div v-for="recipient in notificationRecipients" :key="recipient.id" class="recipient-item">
                 <Checkbox 
                   :checked="notificationForm.recipients.includes(recipient.id)"
                   @change="handleToggleRecipient(recipient.id)"
                 >
                   <div class="flex items-center space-x-2">
                     <Avatar :src="recipient.avatar" size="small" />
                     <div>
                       <Text class="text-sm">{{ recipient.name }}</Text>
                       <Text type="secondary" class="text-xs block">{{ recipient.role }} | {{ recipient.email }}</Text>
                     </div>
                   </div>
                 </Checkbox>
               </div>
             </div>
           </FormItem>
           
           <FormItem>
             <Space>
               <Button type="primary" @click="handleSendNotification">
                 發送通知
               </Button>
               <Button @click="handleCloseNotificationModal">
                 取消
               </Button>
             </Space>
           </FormItem>
         </Form>
       </div>
     </Modal>

    <!-- 新增任務抽屜 -->
    <Drawer
      v-model:open="createTaskDrawerVisible"
      title="新增任務"
      width="600"
      @close="closeCreateTaskDrawer"
    >
      <Form
        :model="createTaskFormData"
        layout="vertical"
        class="space-y-4"
      >
        <FormItem label="任務名稱" required>
          <Input
            v-model:value="createTaskFormData.taskName"
            placeholder="請輸入任務名稱"
          />
        </FormItem>
        
        <FormItem label="任務描述">
          <Textarea
            v-model:value="createTaskFormData.taskDescription"
            placeholder="請輸入任務描述"
            :rows="4"
          />
        </FormItem>
        
        <FormItem label="所屬項目">
          <Select
            v-model:value="createTaskFormData.projectName"
            placeholder="請選擇項目"
          >
            <SelectOption
              v-for="project in projectNameOptions"
              :key="project.value"
              :value="project.value"
            >
              {{ project.label }}
            </SelectOption>
          </Select>
        </FormItem>
        
        <FormItem label="任務負責人" required>
          <Select
            v-model:value="createTaskFormData.taskResponsible"
            placeholder="請選擇負責人"
          >
            <SelectOption
              v-for="person in taskResponsibleOptions"
              :key="person.value"
              :value="person.value"
            >
              {{ person.label }}
            </SelectOption>
          </Select>
        </FormItem>
        
        <FormItem label="參與人員">
          <Select
            v-model:value="createTaskFormData.taskParticipants"
            mode="multiple"
            placeholder="請選擇參與人員"
          >
            <SelectOption
              v-for="participant in taskParticipantOptions"
              :key="participant.value"
              :value="participant.value"
            >
              {{ participant.label }}
              <span v-if="participant.type === 'group'" class="text-xs text-gray-500 ml-1">(小組)</span>
            </SelectOption>
          </Select>
        </FormItem>
        
        <Row :gutter="16">
          <Col :span="12">
            <FormItem label="開始時間">
              <DatePicker
                v-model:value="createTaskFormData.taskStartTime"
                show-time
                format="YYYY-MM-DD HH:mm:ss"
                placeholder="選擇開始時間"
                class="w-full"
              />
            </FormItem>
          </Col>
          <Col :span="12">
            <FormItem label="結束時間">
              <DatePicker
                v-model:value="createTaskFormData.taskEndTime"
                show-time
                format="YYYY-MM-DD HH:mm:ss"
                placeholder="選擇結束時間"
                class="w-full"
              />
            </FormItem>
          </Col>
        </Row>
        
        <FormItem label="到期時間">
          <DatePicker
            v-model:value="createTaskFormData.taskDueTime"
            show-time
            format="YYYY-MM-DD HH:mm:ss"
            placeholder="選擇到期時間"
            class="w-full"
          />
        </FormItem>
        
        <FormItem label="預估工時（小時）">
          <InputNumber
            v-model:value="createTaskFormData.estimatedHours"
            :min="0"
            :max="1000"
            placeholder="請輸入預估工時"
            class="w-full"
          />
        </FormItem>
        
        <FormItem label="備註">
          <Textarea
            v-model:value="createTaskFormData.taskRemarks"
            placeholder="請輸入備註信息"
            :rows="3"
          />
        </FormItem>
      </Form>
      
      <template #footer>
        <div class="flex justify-end space-x-2">
          <Button @click="closeCreateTaskDrawer">取消</Button>
          <Button type="primary" @click="handleSaveTask">保存</Button>
        </div>
      </template>
    </Drawer>
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

/* 流程狀態指示器樣式 */
.process-indicator {
  background: rgba(249, 250, 251, 0.8);
  border-radius: 12px;
  padding: 24px;
  border: 1px solid rgba(229, 231, 235, 0.6);
}

.process-nodes {
  background: #ffffff;
}

/* 流程節點樣式 */
.process-node-item {
  position: relative;
}

.process-node-item:not(:last-child)::after {
  content: '';
  position: absolute;
  left: 12px;
  top: 32px;
  bottom: -16px;
  width: 2px;
  background: #e5e7eb;
}

.process-node-item.completed:not(:last-child)::after {
  background: #10b981;
}

.process-node-item.in-progress:not(:last-child)::after {
  background: #3b82f6;
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
