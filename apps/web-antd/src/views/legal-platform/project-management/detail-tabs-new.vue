<script lang="ts" setup>
import { ref, reactive, onMounted, computed } from 'vue';
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
  Pagination,
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
  creator: 'António Silva',
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
    name: 'António Silva',
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
  { value: 'ana', label: 'Ana Ferreira' },
  { value: 'carlos', label: 'Carlos Oliveira' },
];

// 任務參與人員選項（包含個人和小組）
const taskParticipantOptions = [
  // 個人選項
  { value: 'chen', label: 'António Silva', type: 'person' },
  { value: 'zhang', label: 'João Silva', type: 'person' },
  { value: 'li', label: 'Maria Santos', type: 'person' },
  { value: 'wang', label: 'Pedro Costa', type: 'person' },
  { value: 'ana', label: 'Ana Ferreira', type: 'person' },
  { value: 'carlos', label: 'Carlos Oliveira', type: 'person' },
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
    creator: 'António Silva',
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
    name: 'António Silva',
    role: '項目負責人',
    avatar: '/api/placeholder/40/40',
    email: 'chen@example.com',
    phone: '0912-345-678',
    department: '法務部',
    joinTime: '2024-01-15',
  },
  {
    id: '2',
    name: 'Maria Santos',
    role: '法律顧問',
    avatar: '/api/placeholder/40/40',
    email: 'li@example.com',
    phone: '0923-456-789',
    department: '法務部',
    joinTime: '2024-01-16',
  },
  {
    id: '3',
    name: 'Pedro Costa',
    role: '審查員',
    avatar: '/api/placeholder/40/40',
    email: 'wang@example.com',
    phone: '0934-567-890',
    department: '審查部',
    joinTime: '2024-01-17',
  },
]);

// 所有任務數據
const allTasks = ref([
  {
    id: 1,
    title: '法律條文審核任務',
    projectName: '法律條文審查項目',
    status: 'inProgress',
    assignee: 'João Silva',
    creator: 'António Silva',
    createTime: '2024-01-20 10:30:00',
    priority: 'high',
    taskNumber: 'LP-2024-001',
  },
  {
    id: 2,
    title: '法條比對分析',
    projectName: '法律條文審查項目',
    status: 'preparing',
    assignee: 'Maria Santos',
    creator: 'António Silva',
    createTime: '2024-01-22 14:20:00',
    priority: 'medium',
    taskNumber: 'LP-2024-002',
  },
  {
    id: 3,
    title: '專家意見整理',
    projectName: '法律條文審查項目',
    status: 'completed',
    assignee: 'Carlos Oliveira',
    creator: 'António Silva',
    createTime: '2024-01-18 09:15:00',
    priority: 'medium',
    taskNumber: 'LP-2024-003',
  },
  {
    id: 4,
    title: '法規對比研究',
    projectName: '法律條文審查項目',
    status: 'inProgress',
    assignee: 'João Ferreira',
    creator: 'António Silva',
    createTime: '2024-01-25 11:00:00',
    priority: 'low',
    taskNumber: 'LP-2024-004',
  },
  {
    id: 5,
    title: '初稿撰寫',
    projectName: '法律條文審查項目',
    status: 'preparing',
    assignee: 'Ana Ferreira',
    creator: 'António Silva',
    createTime: '2024-01-26 16:30:00',
    priority: 'high',
    taskNumber: 'LP-2024-005',
  },
  {
    id: 6,
    title: '法規條文修訂',
    projectName: '法律條文審查項目',
    status: 'pending',
    assignee: 'Miguel Santos',
    creator: 'António Silva',
    createTime: '2024-01-27 09:00:00',
    priority: 'medium',
    taskNumber: 'LP-2024-006',
  },
  {
    id: 7,
    title: '法律意見書撰寫',
    projectName: '法律條文審查項目',
    status: 'inProgress',
    assignee: 'Sofia Costa',
    creator: 'António Silva',
    createTime: '2024-01-28 14:30:00',
    priority: 'high',
    taskNumber: 'LP-2024-007',
  },
  {
    id: 8,
    title: '合規性檢查',
    projectName: '法律條文審查項目',
    status: 'completed',
    assignee: 'João Silva',
    creator: '陳大文',
    createTime: '2024-01-29 11:15:00',
    priority: 'low',
    taskNumber: 'LP-2024-008',
  },
  {
    id: 9,
    title: '風險評估報告',
    projectName: '法律條文審查項目',
    status: 'preparing',
    assignee: 'Ricardo Silva',
    creator: 'António Silva',
    createTime: '2024-01-30 16:45:00',
    priority: 'medium',
    taskNumber: 'LP-2024-009',
  },
  {
    id: 10,
    title: '最終審核確認',
    projectName: '法律條文審查項目',
    status: 'pending',
    assignee: 'Catarina Oliveira',
    creator: 'António Silva',
    createTime: '2024-01-31 10:00:00',
    priority: 'high',
    taskNumber: 'LP-2024-010',
  },
]);

// 任務分頁配置
const taskPagination = reactive({
  current: 1,
  pageSize: 5,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total, range) => `第 ${range[0]}-${range[1]} 條，共 ${total} 條`,
});

// 任務查詢表單
const taskSearchForm = reactive({
  searchColumn: '',
  searchValue: '',
});

// 可查詢的列選項
const searchableColumns = [
  { value: 'taskNumber', label: '任務編號' },
  { value: 'title', label: '任務名稱' },
  { value: 'status', label: '狀態' },
  { value: 'assignee', label: '負責人' },
  { value: 'creator', label: '創建人' },
  { value: 'priority', label: '優先級' },
];

// 狀態選項
const statusOptions = [
  { value: 'pending', label: '待處理' },
  { value: 'inProgress', label: '處理中' },
  { value: 'completed', label: '已完成' },
  { value: 'cancelled', label: '已取消' },
  { value: 'preparing', label: '準備中' },
];

// 優先級選項
const priorityOptions = [
  { value: 'low', label: '低' },
  { value: 'medium', label: '中' },
  { value: 'high', label: '高' },
];

// 過濾後的任務數據
const filteredTasks = computed(() => {
  let filtered = allTasks.value;
  
  if (taskSearchForm.searchColumn && taskSearchForm.searchValue) {
    filtered = allTasks.value.filter(task => {
      const value = task[taskSearchForm.searchColumn];
      
      // 對於狀態和優先級，進行精確匹配
      if (['status', 'priority'].includes(taskSearchForm.searchColumn)) {
        return value === taskSearchForm.searchValue;
      }
      
      // 對於其他字段，進行模糊匹配
      if (typeof value === 'string') {
        return value.toLowerCase().includes(taskSearchForm.searchValue.toLowerCase());
      }
      
      return false;
    });
  }
  
  return filtered;
});

// 當前頁任務數據
const recentTasks = computed(() => {
  const start = (taskPagination.current - 1) * taskPagination.pageSize;
  const end = start + taskPagination.pageSize;
  taskPagination.total = filteredTasks.value.length;
  return filteredTasks.value.slice(start, end);
});

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
    operator: 'António Silva',
    operatorAvatar: '/api/placeholder/32/32',
    operateTime: '2024-01-15 10:30:00',
    description: '項目正式創建，初始化項目基本信息',
    duration: '30分鐘',
  },
  {
    id: '2',
    nodeName: '團隊組建',
    status: 'completed',
    operator: 'António Silva',
    operatorAvatar: '/api/placeholder/32/32',
    operateTime: '2024-01-15 14:20:00',
    description: '邀請團隊成員加入項目，分配初始角色',
    duration: '2小時',
  },
  {
    id: '3',
    nodeName: '需求分析',
    status: 'completed',
    operator: 'João Ferreira',
    operatorAvatar: '/api/placeholder/32/32',
    operateTime: '2024-01-16 09:15:00',
    description: '完成項目需求分析，確定審查範圍和標準',
    duration: '1天',
  },
  {
    id: '4',
    nodeName: '初步審查',
    status: 'inProgress',
    operator: 'Ana Ferreira',
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
    name: '第149/2025號行政長官批示.docx',
    type: 'docx',
    size: '2.5MB',
    uploadTime: '2024-01-20 14:30:00',
    uploader: 'António Silva',
    tags: ['批示', '重要'],
    remark: '第一版批示文件，需要仔細審查',
    version: '3.0',
    versions: [
      {
        id: 'v3',
        version: '3.0',
        name: '第149/2025號行政長官批示.docx',
        size: '2.5MB',
        uploadTime: '2024-01-20 14:30:00',
        uploader: 'António Silva',

        isCurrent: true,
      },
      {
        id: 'v2',
        version: '2.0',
        name: '第149/2025號行政長官批示_v2.0.docx',
        size: '2.3MB',
        uploadTime: '2024-01-18 16:20:00',
        uploader: 'Ana Ferreira',

      },
      {
        id: 'v1',
        version: '1.0',
        name: '第149/2025號行政長官批示_v1.0.docx',
        size: '2.1MB',
        uploadTime: '2024-01-15 10:00:00',
        uploader: 'António Silva',

      },
    ],
    comments: [
      {
        id: '1',
        user: 'Sofia Costa',
        content: '第三條需要修改',
        time: '2024-01-21 09:00:00',
        avatar: '/api/placeholder/40/40',
        replies: [
          {
            id: '1',
            user: 'António Silva',
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
    user: 'António Silva',
    content: '創建了項目',
    time: '2024-01-15 10:30:00',
    type: 'create',
    avatar: '/api/placeholder/40/40',
  },
  {
    id: '2',
    user: 'Sofia Costa',
    content: '上傳了附件「法律條文草案.excel」',
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
    assignee: 'Sofia Costa',
    status: 'acknowledged',
    time: '2024-01-21 09:00:00',
    content: '已確認收到任務，將在期限內完成',
  },
  {
    id: '2',
    taskName: '法規研究分析',
    assignee: 'Miguel Santos',
    status: 'pending',
    time: '2024-01-20 14:30:00',
    content: '等待確認中',
  },
  {
    id: '3',
    taskName: '合同審核任務',
    assignee: 'António Silva',
    status: 'acknowledged',
    time: '2024-01-19 16:45:00',
    content: '已知悉，正在處理中',
  },
  {
    id: '4',
    taskName: '項目進度報告',
    assignee: 'Sofia Costa',
    status: 'acknowledged',
    time: '2024-01-18 11:20:00',
    content: '報告已收到並審閱',
  },
  {
    id: '5',
    taskName: '法律意見書撰寫',
    assignee: 'Miguel Santos',
    status: 'pending',
    time: '2024-01-17 13:15:00',
    content: '待確認任務詳情',
  },
  {
    id: '6',
    taskName: '會議紀要整理',
    assignee: 'António Silva',
    status: 'acknowledged',
    time: '2024-01-16 09:30:00',
    content: '會議紀要已整理完成',
  },
]);

// 知悉表格列配置
const acknowledgmentColumns = [
  {
    title: '任務名稱',
    dataIndex: 'taskName',
    key: 'taskName',
    width: 200,
    ellipsis: true
  },
  {
    title: '狀態',
    dataIndex: 'status',
    key: 'status',
    width: 100
  },
  {
    title: '負責人',
    dataIndex: 'assignee',
    key: 'assignee',
    width: 100
  },
  {
    title: '時間',
    dataIndex: 'time',
    key: 'time',
    width: 150
  },
  {
    title: '操作',
    key: 'operation',
    width: 100,
    fixed: 'right'
  }
];

// 知悉表格數據（最新5筆）
const acknowledgmentTableData = computed(() => {
  return acknowledgments.value.slice(0, 5);
});

// 通知記錄
const notificationHistory = ref([
  {
    id: '1',
    title: '任務分配通知',
    content: '您有新的任務需要處理',
    recipients: ['李小美', '王志明'],
    methods: ['email', 'sms'],
    sendTime: '2024-01-21 10:30:00',
    status: 'sent',
  },
]);

// 統計數據
const statistics = reactive({
  inProgressTasks: 8,
  cancelledTasks: 2,
  completedTasks: 15,
  totalTasks: 25,
});

// 工具函數
const getStatusColor = (status: string) => {
  const colorMap = {
    pending: 'orange',
    inProgress: 'blue',
    completed: 'green',
    cancelled: 'red',
    preparing: 'purple',
    acknowledged: 'green',
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
    acknowledged: '已知悉',
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

// 處理查看更多統計
const handleViewMoreStats = () => {
  message.info('查看更多統計功能開發中');
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

const handleViewAttachment = (attachment) => {
  message.info(`查看附件：${attachment.name}`);
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

// 查看任務詳情相關狀態
const viewTaskDrawerVisible = ref(false);
const viewTaskData = ref({});

const handleViewTaskDetail = (task) => {
  viewTaskData.value = { ...task };
  viewTaskDrawerVisible.value = true;
};

// 關閉查看任務詳情抽屜
const closeViewTaskDrawer = () => {
  viewTaskDrawerVisible.value = false;
  viewTaskData.value = {};
};

// 編輯任務相關狀態
const editTaskDrawerVisible = ref(false);
const editTaskFormData = ref({});

// 處理編輯任務
const handleEditTask = (task) => {
  editTaskFormData.value = { ...task };
  editTaskDrawerVisible.value = true;
};

// 關閉編輯任務抽屜
const closeEditTaskDrawer = () => {
  editTaskDrawerVisible.value = false;
  editTaskFormData.value = {};
};

// 保存編輯任務
const handleSaveEditTask = () => {
  // 找到要編輯的任務並更新
  const index = allTasks.value.findIndex(task => task.id === editTaskFormData.value.id);
  if (index !== -1) {
    allTasks.value[index] = { ...editTaskFormData.value };
    message.success('任務編輯成功');
    closeEditTaskDrawer();
  }
};

// 處理任務分頁變化
const handleTaskPageChange = (page, pageSize) => {
  taskPagination.current = page;
  taskPagination.pageSize = pageSize;
};

// 處理任務查詢
const handleTaskSearch = () => {
  taskPagination.current = 1; // 重置到第一頁
};

// 重置任務查詢
const handleTaskSearchReset = () => {
  taskSearchForm.searchColumn = '';
  taskSearchForm.searchValue = '';
  taskPagination.current = 1;
};

// 獲取查詢值的選項（用於狀態和優先級的下拉選擇）
const getSearchValueOptions = computed(() => {
  if (taskSearchForm.searchColumn === 'status') {
    return statusOptions;
  } else if (taskSearchForm.searchColumn === 'priority') {
    return priorityOptions;
  }
  return [];
});

// 判斷是否顯示下拉選擇器
const isSelectSearch = computed(() => {
  return ['status', 'priority'].includes(taskSearchForm.searchColumn);
});

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

// 查看指定版本
const handleViewVersion = (attachment, version) => {
  message.info(`查看版本 ${version.version}: ${version.name}`);
};

// 預覽指定版本
const handlePreviewVersion = (attachment, version) => {
  message.info(`預覽版本 ${version.version}: ${version.name}`);
};

// 版本對比相關變量
const versionCompareVisible = ref(false);
const compareVersions = ref({
  current: null,
  previous: null,
  attachment: null
});

// 版本對比
const handleVersionCompare = (attachment) => {
  // 獲取當前版本和前一個版本
  const versions = attachment.versions || [];
  const currentVersion = versions.find(v => v.isCurrent);
  const previousVersion = versions.find(v => !v.isCurrent);
  
  if (currentVersion && previousVersion) {
    compareVersions.value = {
      current: currentVersion,
      previous: previousVersion,
      attachment: attachment
    };
    versionCompareVisible.value = true;
  } else {
    message.warning('需要至少兩個版本才能進行對比');
  }
};

// 關閉版本對比抽屜
const closeVersionCompare = () => {
  versionCompareVisible.value = false;
  compareVersions.value = {
    current: null,
    previous: null,
    attachment: null
  };
};

// 模擬文檔內容數據
const getDocumentContent = (version) => {
  if (version.version === '3.0') {
    return {
      title: '第149/2025號行政長官批示',
      content: [
        '行政長官行使《澳門特別行政區基本法》第五十條賦予的職權，並根據第3/2001號法律通過的《澳門特別行政區立法會選舉法》第八十二條第三款的規定，作出本批示。',
        '',
        '一、二零二五年立法會選舉的直選及間選每一候選名單於澳門廣播電視股份有限公司電視台及電台的競選活動廣播時間訂定如下：',
        '',
        '（一）在澳門廣播電視股份有限公司（電視台）中文頻道共進行33次廣播，每次為時1分30秒；在葡文頻道共進行25次廣播，每次為時1分30秒；而中文頻道和葡文頻道的最後一次廣播均在九月十二日進行。',
        '',
        '（二）在澳門廣播電視股份有限公司（電台）中文頻道共進行54次廣播，每次為時1分鐘；在葡文頻道共進行36次廣播，每次為時1分鐘；而中文頻道和葡文頻道的最後一次廣播均在九月十二日進行。',
        '',
        '二、本批示自公佈翌日起生效。',
        '',
        '二零二五年七月二十八日',
        '',
        '行政長官　岑浩輝'
      ]
    };
  } else if (version.version === '2.0') {
    return {
      title: '第149/2025號行政長官批示',
      content: [
        '行政長官行使《澳門特別行政區基本法》第五十條賦予的職權，並根據第3/2001號法律通過的《澳門特別行政區立法會選舉法》第八十二條第三款的規定，作出本批示。',
        '',
        '一、二零二五年立法會選舉的直選及間選每一候選名單於澳門廣播電視股份有限公司電視台及電台的競選活動廣播時間訂定如下：',
        '',
        '（一）在澳門廣播電視股份有限公司（電視台）中文頻道共進行30次廣播，每次為時1分30秒；在葡文頻道共進行20次廣播，每次為時1分30秒；而中文頻道和葡文頻道的最後一次廣播均在九月十日進行。',
        '',
        '（二）在澳門廣播電視股份有限公司（電台）中文頻道共進行50次廣播，每次為時1分鐘；在葡文頻道共進行30次廣播，每次為時1分鐘；而中文頻道和葡文頻道的最後一次廣播均在九月十日進行。',
        '',
        '二、本批示自公佈翌日起生效。',
        '',
        '二零二五年七月二十五日',
        '',
        '行政長官　岑浩輝'
      ]
    };
  }
  return { title: '', content: [] };
};

// 計算文檔差異
const calculateDifferences = (oldContent, newContent) => {
  const differences = [];
  const maxLength = Math.max(oldContent.length, newContent.length);
  
  for (let i = 0; i < maxLength; i++) {
    const oldLine = oldContent[i] || '';
    const newLine = newContent[i] || '';
    
    if (oldLine !== newLine) {
      differences.push({
        lineNumber: i + 1,
        type: oldLine === '' ? 'added' : newLine === '' ? 'removed' : 'modified',
        oldText: oldLine,
        newText: newLine
      });
    } else {
      differences.push({
        lineNumber: i + 1,
        type: 'unchanged',
        oldText: oldLine,
        newText: newLine
      });
    }
  }
  
  return differences;
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
              <Card title="統計" class="mb-6">
                <div class="statistics-grid space-y-4">
                  <div class="stat-item flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                      <span class="icon-[lucide--clock] size-4 text-blue-500" />
                      <Text>進行中任務</Text>
                    </div>
                    <Text strong class="text-blue-500">{{ statistics.inProgressTasks }}</Text>
                  </div>
                  <div class="stat-item flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                      <span class="icon-[lucide--x-circle] size-4 text-red-500" />
                      <Text>已取消任務</Text>
                    </div>
                    <Text strong class="text-red-500">{{ statistics.cancelledTasks }}</Text>
                  </div>
                  <div class="stat-item flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                      <span class="icon-[lucide--check-circle] size-4 text-green-500" />
                      <Text>已完成任務</Text>
                    </div>
                    <Text strong class="text-green-500">{{ statistics.completedTasks }}</Text>
                  </div>
                  <Divider class="!my-3" />
                  <div class="stat-item flex items-center justify-between">
                    <Text strong>總任務數</Text>
                    <Text strong class="text-lg">{{ statistics.totalTasks }}</Text>
                  </div>
                </div>
                <div class="mt-4">
                  <Button type="link" block @click="handleViewMoreStats">
                    查看更多
                  </Button>
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
            <!-- 查詢表單 -->
            <div class="mb-4">
              <Form layout="inline" :model="taskSearchForm">
                <FormItem label="查詢列">
                  <Select
                    v-model:value="taskSearchForm.searchColumn"
                    placeholder="選擇查詢列"
                    style="width: 120px"
                    @change="taskSearchForm.searchValue = ''"
                  >
                    <SelectOption
                      v-for="column in searchableColumns"
                      :key="column.value"
                      :value="column.value"
                    >
                      {{ column.label }}
                    </SelectOption>
                  </Select>
                </FormItem>
                <FormItem label="查詢值">
                  <!-- 文本輸入 -->
                  <Input
                    v-if="!isSelectSearch"
                    v-model:value="taskSearchForm.searchValue"
                    placeholder="請輸入查詢值"
                    style="width: 200px"
                    @pressEnter="handleTaskSearch"
                  />
                  <!-- 下拉選擇 -->
                  <Select
                    v-else
                    v-model:value="taskSearchForm.searchValue"
                    placeholder="請選擇查詢值"
                    style="width: 200px"
                  >
                    <SelectOption
                      v-for="option in getSearchValueOptions"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </SelectOption>
                  </Select>
                </FormItem>
                <FormItem>
                  <Space>
                    <Button type="primary" @click="handleTaskSearch">
                      查詢
                    </Button>
                    <Button @click="handleTaskSearchReset">
                      重置
                    </Button>
                  </Space>
                </FormItem>
              </Form>
            </div>
            
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
                    <Space>
                      <Button type="link" size="small" @click="handleViewTaskDetail(record)">
                        查看詳情
                      </Button>
                      <Button type="link" size="small" @click="handleEditTask(record)">
                        編輯
                      </Button>
                    </Space>
                  </template>
                </template>
              </Table>
              
              <!-- 分頁組件 -->
              <div class="mt-4 flex justify-end">
                <Pagination
                  v-model:current="taskPagination.current"
                  v-model:page-size="taskPagination.pageSize"
                  :total="taskPagination.total"
                  :show-size-changer="taskPagination.showSizeChanger"
                  :show-quick-jumper="taskPagination.showQuickJumper"
                  :show-total="taskPagination.showTotal"
                  @change="handleTaskPageChange"
                />
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
                          預覽
                        </Button>
                        <Button type="link" size="small" @click="handleViewAttachment(attachment)">
                          查看
                        </Button>
                        <Button type="link" size="small" @click="handleVersionCompare(attachment)">
                          版本對比
                        </Button>
                        <Button type="link" size="small" @click="handleDownloadAttachment(attachment)">
                          下載
                        </Button>
                        <Popconfirm
                          title="確定要刪除這個附件嗎？"
                          ok-text="確定"
                          cancel-text="取消"
                          @confirm="handleDeleteAttachment(attachment)"
                        >
                          <Button type="link" size="small" danger>
                            刪除
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
                              <Button type="link" size="small" @click="handlePreviewVersion(attachment, version)">
                                預覽
                              </Button>
                              <Button type="link" size="small" @click="handleViewVersion(attachment, version)">
                                查看
                              </Button>
                              <Button 
                                v-if="!version.isCurrent" 
                                type="link" 
                                size="small" 
                                @click="handleRestoreVersion(attachment, version)"
                              >
                                還原
                              </Button>
                              <Button type="link" size="small" @click="handleDownloadVersion(attachment, version)">
                                下載
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
            <Table 
              :columns="acknowledgmentColumns" 
              :data-source="acknowledgmentTableData" 
              :pagination="false"
              size="middle"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'status'">
                  <Tag :color="getStatusColor(record.status)">
                    {{ getStatusText(record.status) }}
                  </Tag>
                </template>
                <template v-else-if="column.key === 'operation'">
                  <Button type="link" size="small" @click="handleViewAcknowledgmentDetail(record)">
                    查看詳情
                  </Button>
                </template>
              </template>
            </Table>
            <div v-if="acknowledgments.length > 5" class="mt-4 text-center">
              <Button type="link" @click="handleViewMoreAcknowledments">
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

    <!-- 編輯任務抽屜 -->
    <Drawer
      v-model:open="editTaskDrawerVisible"
      title="編輯任務"
      width="600"
      @close="closeEditTaskDrawer"
    >
      <Form
        :model="editTaskFormData"
        layout="vertical"
        class="space-y-4"
      >
        <FormItem label="任務編號">
          <Input
            v-model:value="editTaskFormData.taskNumber"
            disabled
          />
        </FormItem>
        
        <FormItem label="任務名稱" required>
          <Input
            v-model:value="editTaskFormData.title"
            placeholder="請輸入任務名稱"
          />
        </FormItem>
        
        <FormItem label="項目名稱">
          <Input
            v-model:value="editTaskFormData.projectName"
            placeholder="請輸入項目名稱"
          />
        </FormItem>
        
        <FormItem label="狀態" required>
          <Select
            v-model:value="editTaskFormData.status"
            placeholder="請選擇狀態"
          >
            <SelectOption
              v-for="status in statusOptions"
              :key="status.value"
              :value="status.value"
            >
              {{ status.label }}
            </SelectOption>
          </Select>
        </FormItem>
        
        <FormItem label="負責人" required>
          <Input
            v-model:value="editTaskFormData.assignee"
            placeholder="請輸入負責人"
          />
        </FormItem>
        
        <FormItem label="創建人">
          <Input
            v-model:value="editTaskFormData.creator"
            placeholder="請輸入創建人"
          />
        </FormItem>
        
        <FormItem label="創建時間">
          <Input
            v-model:value="editTaskFormData.createTime"
            disabled
          />
        </FormItem>
        
        <FormItem label="優先級" required>
          <Select
            v-model:value="editTaskFormData.priority"
            placeholder="請選擇優先級"
          >
            <SelectOption
              v-for="priority in priorityOptions"
              :key="priority.value"
              :value="priority.value"
            >
              {{ priority.label }}
            </SelectOption>
          </Select>
        </FormItem>
      </Form>
      
      <template #footer>
        <div class="flex justify-end space-x-2">
          <Button @click="closeEditTaskDrawer">取消</Button>
          <Button type="primary" @click="handleSaveEditTask">保存</Button>
        </div>
      </template>
     </Drawer>

    <!-- 查看任務詳情抽屜 -->
    <Drawer
      v-model:open="viewTaskDrawerVisible"
      title="查看任務詳情"
      width="600"
      @close="closeViewTaskDrawer"
    >
      <Form
        :model="viewTaskData"
        layout="vertical"
        class="space-y-4"
      >
        <FormItem label="任務編號">
          <Input
            v-model:value="viewTaskData.taskNumber"
            disabled
          />
        </FormItem>
        
        <FormItem label="任務名稱">
          <Input
            v-model:value="viewTaskData.title"
            disabled
          />
        </FormItem>
        
        <FormItem label="項目名稱">
          <Input
            v-model:value="viewTaskData.projectName"
            disabled
          />
        </FormItem>
        
        <FormItem label="狀態">
          <Input
            :value="getStatusText(viewTaskData.status)"
            disabled
          />
        </FormItem>
        
        <FormItem label="負責人">
          <Input
            v-model:value="viewTaskData.assignee"
            disabled
          />
        </FormItem>
        
        <FormItem label="創建人">
          <Input
            v-model:value="viewTaskData.creator"
            disabled
          />
        </FormItem>
        
        <FormItem label="創建時間">
          <Input
            v-model:value="viewTaskData.createTime"
            disabled
          />
        </FormItem>
        
        <FormItem label="優先級">
          <Input
            :value="getPriorityText(viewTaskData.priority)"
            disabled
          />
        </FormItem>
      </Form>
      
      <template #footer>
        <div class="flex justify-end">
          <Button @click="closeViewTaskDrawer">關閉</Button>
        </div>
      </template>
    </Drawer>

    <!-- 版本對比抽屜 -->
    <Drawer
      v-model:open="versionCompareVisible"
      title="版本對比"
      placement="right"
      :width="1200"
      :closable="true"
      @close="closeVersionCompare"
    >
      <div v-if="compareVersions.current && compareVersions.previous" class="version-compare-container">
        <!-- 版本信息頭部 -->
        <div class="flex justify-between items-center mb-6 p-4 bg-gray-50 rounded-lg">
          <div class="flex items-center space-x-4">
            <div class="text-center">
              <Tag color="red" size="large">v{{ compareVersions.previous.version }}</Tag>
              <div class="text-sm text-gray-600 mt-1">{{ compareVersions.previous.uploadTime }}</div>
              <div class="text-xs text-gray-500">{{ compareVersions.previous.uploader }}</div>
            </div>
            <div class="flex items-center space-x-2">
              <span class="icon-[lucide--arrow-right] size-6 text-gray-400" />
            </div>
            <div class="text-center">
              <Tag color="green" size="large">v{{ compareVersions.current.version }}</Tag>
              <div class="text-sm text-gray-600 mt-1">{{ compareVersions.current.uploadTime }}</div>
              <div class="text-xs text-gray-500">{{ compareVersions.current.uploader }}</div>
            </div>
          </div>
          <div class="text-right">
            <div class="text-lg font-semibold">{{ compareVersions.attachment.name }}</div>
            <div class="text-sm text-gray-600">文檔版本對比</div>
          </div>
        </div>

        <!-- 對比內容 -->
        <div class="version-diff-content">
          <div class="grid grid-cols-2 gap-4 h-full">
            <!-- 舊版本 -->
            <div class="border rounded-lg overflow-hidden">
              <div class="bg-red-50 border-b px-4 py-2 flex items-center">
                <span class="icon-[lucide--minus-circle] size-4 text-red-500 mr-2" />
                <span class="font-medium text-red-700">v{{ compareVersions.previous.version }} (舊版本)</span>
              </div>
              <div class="p-4 bg-white max-h-96 overflow-y-auto">
                <div class="space-y-2">
                  <div 
                    v-for="(line, index) in getDocumentContent(compareVersions.previous).content" 
                    :key="`old-${index}`"
                    class="flex items-start"
                  >
                    <span class="text-xs text-gray-400 w-8 flex-shrink-0 text-right mr-2">{{ index + 1 }}</span>
                    <div 
                      class="flex-1 min-h-[1.5rem] px-2 py-1 rounded"
                      :class="{
                        'bg-red-100 text-red-800': calculateDifferences(getDocumentContent(compareVersions.previous).content, getDocumentContent(compareVersions.current).content)[index]?.type === 'removed',
                        'bg-yellow-100 text-yellow-800': calculateDifferences(getDocumentContent(compareVersions.previous).content, getDocumentContent(compareVersions.current).content)[index]?.type === 'modified',
                        'text-gray-700': calculateDifferences(getDocumentContent(compareVersions.previous).content, getDocumentContent(compareVersions.current).content)[index]?.type === 'unchanged'
                      }"
                    >
                      {{ line || '　' }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 新版本 -->
            <div class="border rounded-lg overflow-hidden">
              <div class="bg-green-50 border-b px-4 py-2 flex items-center">
                <span class="icon-[lucide--plus-circle] size-4 text-green-500 mr-2" />
                <span class="font-medium text-green-700">v{{ compareVersions.current.version }} (新版本)</span>
              </div>
              <div class="p-4 bg-white max-h-96 overflow-y-auto">
                <div class="space-y-2">
                  <div 
                    v-for="(line, index) in getDocumentContent(compareVersions.current).content" 
                    :key="`new-${index}`"
                    class="flex items-start"
                  >
                    <span class="text-xs text-gray-400 w-8 flex-shrink-0 text-right mr-2">{{ index + 1 }}</span>
                    <div 
                      class="flex-1 min-h-[1.5rem] px-2 py-1 rounded"
                      :class="{
                        'bg-green-100 text-green-800': calculateDifferences(getDocumentContent(compareVersions.previous).content, getDocumentContent(compareVersions.current).content)[index]?.type === 'added',
                        'bg-yellow-100 text-yellow-800': calculateDifferences(getDocumentContent(compareVersions.previous).content, getDocumentContent(compareVersions.current).content)[index]?.type === 'modified',
                        'text-gray-700': calculateDifferences(getDocumentContent(compareVersions.previous).content, getDocumentContent(compareVersions.current).content)[index]?.type === 'unchanged'
                      }"
                    >
                      {{ line || '　' }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 差異統計 -->
          <div class="mt-6 p-4 bg-gray-50 rounded-lg">
            <div class="text-sm font-medium text-gray-700 mb-2">變更統計</div>
            <div class="flex items-center space-x-6 text-sm">
              <div class="flex items-center">
                <span class="icon-[lucide--plus-circle] size-4 text-green-500 mr-1" />
                <span class="text-green-700">
                  新增: {{ calculateDifferences(getDocumentContent(compareVersions.previous).content, getDocumentContent(compareVersions.current).content).filter(d => d.type === 'added').length }} 行
                </span>
              </div>
              <div class="flex items-center">
                <span class="icon-[lucide--minus-circle] size-4 text-red-500 mr-1" />
                <span class="text-red-700">
                  刪除: {{ calculateDifferences(getDocumentContent(compareVersions.previous).content, getDocumentContent(compareVersions.current).content).filter(d => d.type === 'removed').length }} 行
                </span>
              </div>
              <div class="flex items-center">
                <span class="icon-[lucide--edit] size-4 text-yellow-500 mr-1" />
                <span class="text-yellow-700">
                  修改: {{ calculateDifferences(getDocumentContent(compareVersions.previous).content, getDocumentContent(compareVersions.current).content).filter(d => d.type === 'modified').length }} 行
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end space-x-2">
          <Button @click="closeVersionCompare">關閉</Button>
        </div>
      </template>
    </Drawer>
  </Page>
</template>

<style scoped>
.project-detail-tabs {
  padding: 24px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin: 16px;
}

/* 版本對比樣式 */
.version-compare-container {
  height: calc(100vh - 200px);
  overflow: hidden;
}

.version-diff-content {
  height: calc(100% - 120px);
}

.version-diff-content .grid {
  height: 100%;
}

.version-diff-content .border {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.version-diff-content .max-h-96 {
  max-height: none;
  flex: 1;
  overflow-y: auto;
}

/* 差異高亮樣式 */
.bg-red-100 {
  background-color: #fee2e2 !important;
  border-left: 3px solid #ef4444;
}

.bg-green-100 {
  background-color: #dcfce7 !important;
  border-left: 3px solid #22c55e;
}

.bg-yellow-100 {
  background-color: #fef3c7 !important;
  border-left: 3px solid #f59e0b;
}

/* 行號樣式 */
.version-diff-content .text-xs {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

/* 內容樣式 */
.version-diff-content .flex-1 {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-all;
}

/* 滾動條樣式 */
.version-diff-content .overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.version-diff-content .overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.version-diff-content .overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.version-diff-content .overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
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
