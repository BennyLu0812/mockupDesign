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
  Tag,
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
const getStepCircleStyle = (step: any) => {
  if (step.status === 'pending') {
    return {
      width: '24px',
      height: '24px',
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
      width: '24px',
      height: '24px',
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
      width: '24px',
      height: '24px',
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
const getStepTextStyle = (step: any) => {
  if (step.status === 'pending') {
    return {
      fontSize: '14px',
      color: '#9CA3AF',
      marginTop: '8px',
      textAlign: 'center'
    };
  } else if (step.status === 'active') {
    return {
      fontSize: '14px',
      color: '#F97316',
      marginTop: '8px',
      textAlign: 'center'
    };
  } else { // completed
    return {
      fontSize: '14px',
      color: '#10B981',
      marginTop: '8px',
      textAlign: 'center'
    };
  }
};

// 獲取連接線樣式
const getConnectorStyle = (index: number) => {
  const currentStep = processSteps.value[index];
  const nextStep = processSteps.value[index + 1];
  
  if (currentStep.status === 'completed') {
    return {
      width: '40px',
      height: '2px',
      backgroundColor: currentStep.status === 'completed' && nextStep?.status === 'active' ? '#F97316' : 
                       currentStep.status === 'completed' && nextStep?.status === 'completed' ? '#10B981' : '#E5E7EB',
      margin: '0 8px'
    };
  } else {
    return {
      width: '40px',
      height: '2px',
      backgroundColor: '#E5E7EB',
      margin: '0 8px'
    };
  }
};

// 內聯版本的樣式函數
// 獲取步驟圓形樣式（內聯版本）
const getStepCircleStyleInline = (step: any) => {
  if (step.status === 'pending') {
    return {
      width: '18px',
      height: '18px',
      borderRadius: '50%',
      border: '1.5px solid #E5E7EB',
      backgroundColor: '#FFFFFF',
      color: '#9CA3AF',
      fontSize: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold'
    };
  } else if (step.status === 'active') {
    return {
      width: '18px',
      height: '18px',
      borderRadius: '50%',
      backgroundColor: '#F97316',
      color: '#FFFFFF',
      fontSize: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold'
    };
  } else { // completed
    return {
      width: '18px',
      height: '18px',
      borderRadius: '50%',
      backgroundColor: '#10B981',
      color: '#FFFFFF',
      fontSize: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold'
    };
  }
};

// 獲取步驟文字樣式（內聯版本）
const getStepTextStyleInline = (step: any) => {
  if (step.status === 'pending') {
    return {
      fontSize: '10px',
      color: '#9CA3AF',
      marginTop: '2px',
      textAlign: 'center'
    };
  } else if (step.status === 'active') {
    return {
      fontSize: '10px',
      color: '#F97316',
      marginTop: '2px',
      textAlign: 'center'
    };
  } else { // completed
    return {
      fontSize: '10px',
      color: '#10B981',
      marginTop: '2px',
      textAlign: 'center'
    };
  }
};

// 獲取連接線樣式（內聯版本）
const getConnectorStyleInline = (index: number) => {
  const currentStep = processSteps.value[index];
  const nextStep = processSteps.value[index + 1];
  
  if (currentStep.status === 'completed') {
    return {
      width: '24px',
      height: '1.5px',
      backgroundColor: currentStep.status === 'completed' && nextStep?.status === 'active' ? '#F97316' : 
                       currentStep.status === 'completed' && nextStep?.status === 'completed' ? '#10B981' : '#E5E7EB',
      margin: '0 4px'
    };
  } else {
    return {
      width: '24px',
      height: '1.5px',
      backgroundColor: '#E5E7EB',
      margin: '0 4px'
    };
  }
};

// 項目成員
const projectMembers = ref([
  {
    id: '1',
    name: '陳大文',
    role: '項目負責人',
    avatar: '/api/placeholder/40/40',
    status: 'online',
  },
  {
    id: '2',
    name: '陳志華',
    role: '法律顧問',
    avatar: '/api/placeholder/40/40',
    status: 'offline',
  },
  {
    id: '3',
    name: '林雅婷',
    role: '研究員',
    avatar: '/api/placeholder/40/40',
    status: 'online',
  },
]);

// 項目附件數據
const attachments = ref([
  {
    id: '1',
    name: '法律條文審查報告.pdf',
    type: 'pdf',
    size: '2.5MB',
    uploadTime: '2024-01-20 10:30:00',
    uploader: '陳大文',
    tags: ['重要', '審查報告'],
    remark: '這是初步審查報告，包含了對法條的詳細分析',
    url: '/api/files/report.pdf',
    version: '1.2',
    history: [
      {
        version: '1.0',
        uploadTime: '2024-01-15 09:30:00',
        uploader: '陳大文',
        size: '2.1MB',
        url: '/api/files/report_v1.pdf',
        remark: '初始版本'
      },
      {
        version: '1.1',
        uploadTime: '2024-01-18 14:20:00',
        uploader: '陳大文',
        size: '2.3MB',
        url: '/api/files/report_v1.1.pdf',
        remark: '修正了第二章的錯誤'
      },
      {
        version: '1.2',
        uploadTime: '2024-01-20 10:30:00',
        uploader: '陳大文',
        size: '2.5MB',
        url: '/api/files/report.pdf',
        remark: '添加了第四章的內容'
      }
    ],
    comments: [
      {
        id: '1',
        user: '陳志華',
        avatar: '/api/placeholder/20/20',
        content: '報告內容很詳細，建議在第三章增加更多案例分析',
        time: '2024-01-20 14:30:00',
        replies: [
          {
            id: '1',
            user: '陳大文',
            avatar: '/api/placeholder/16/16',
            content: '好的，我會在下個版本中補充',
            time: '2024-01-20 15:00:00',
          },
        ],
      },
    ],
  },
  {
    id: '2',
    name: '參考資料匯總.docx',
    type: 'docx',
    size: '1.8MB',
    uploadTime: '2024-01-18 16:45:00',
    uploader: '林雅婷',
    tags: ['參考資料'],
    remark: '收集的相關法律參考資料',
    url: '/api/files/references.docx',
    version: '2.0',
    history: [
      {
        version: '1.0',
        uploadTime: '2024-01-16 11:20:00',
        uploader: '林雅婷',
        size: '1.2MB',
        url: '/api/files/references_v1.docx',
        remark: '初始版本'
      },
      {
        version: '2.0',
        uploadTime: '2024-01-18 16:45:00',
        uploader: '林雅婷',
        size: '1.8MB',
        url: '/api/files/references.docx',
        remark: '增加了新的參考資料'
      }
    ],
    comments: [],
  },
  {
    id: '3',
    name: '項目進度圖表.xlsx',
    type: 'xlsx',
    size: '856KB',
    uploadTime: '2024-01-19 09:15:00',
    uploader: '陳志華',
    tags: ['進度管理', '圖表'],
    remark: '項目各階段進度統計',
    url: '/api/files/progress.xlsx',
    version: '2.1',
    history: [
      {
        version: '1.0',
        uploadTime: '2024-01-17 14:30:00',
        uploader: '陳志華',
        size: '650KB',
        url: '/api/files/progress_v1.xlsx',
        remark: '初始版本'
      },
      {
        version: '2.0',
        uploadTime: '2024-01-18 16:20:00',
        uploader: '陳志華',
        size: '780KB',
        url: '/api/files/progress_v2.xlsx',
        remark: '更新了進度數據'
      },
      {
        version: '2.1',
        uploadTime: '2024-01-19 09:15:00',
        uploader: '陳志華',
        size: '856KB',
        url: '/api/files/progress.xlsx',
        remark: '添加了新的進度圖表'
      }
    ],
    comments: [
      {
        id: '1',
        user: '陳大文',
        avatar: '/api/placeholder/20/20',
        content: '圖表很清晰，方便跟蹤進度',
        time: '2024-01-19 11:20:00',
        replies: [],
      },
    ],
  },
]);

// 新評論輸入
const newComment = ref<Record<string, string>>({});

// 標籤管理相關數據
const tagManagementVisible = ref(false);
const projectTags = ref([
  {
    id: '1',
    name: '標籤1',
    color: 'blue',
    description: '項目重要標籤',
    createTime: '2024-01-15 10:30:00',
    creator: '陳大文',
  },
  {
    id: '2',
    name: '標籤2',
    color: 'green',
    description: '項目狀態標籤',
    createTime: '2024-01-15 11:00:00',
    creator: '陳大文',
  },
]);

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

// 流程節點彈窗顯示狀態
const processModalVisible = ref(false);

// 通知功能相關數據
// 通知設置彈窗顯示狀態
const notificationModalVisible = ref(false);

// 通知歷史記錄
const notificationHistory = ref([
  {
    id: '1',
    type: 'project_update',
    title: '項目進度更新',
    content: '項目「法律條文審查項目」已進入初步審查階段',
    recipients: ['陳大文', '陳志華', '林雅婷'],
    methods: ['email', 'sms'],
    sendTime: '2024-01-18 08:35:00',
    status: 'sent',
  },
  {
    id: '2',
    type: 'milestone_change',
    title: '里程碑狀態變更',
    content: '里程碑「需求分析」已完成',
    recipients: ['陳大文', '陳志華'],
    methods: ['email'],
    sendTime: '2024-01-16 17:20:00',
    status: 'sent',
  },
  {
    id: '3',
    type: 'document_upload',
    title: '新文檔上傳',
    content: '林雅婷上傳了新文檔「參考資料匯總.docx」',
    recipients: ['陳大文', '陳志華'],
    methods: ['email'],
    sendTime: '2024-01-18 16:50:00',
    status: 'sent',
  },
]);

// 可選的通知接收人（項目成員）
const notificationRecipients = ref([
  {
    id: '1',
    name: '陳大文',
    role: '項目負責人',
    email: 'chen@example.com',
    phone: '+886-912-345-678',
    avatar: '/api/placeholder/32/32',
    selected: true,
  },
  {
    id: '2',
    name: '陳志華',
    role: '法律顧問',
    email: 'chen.zh@example.com',
    phone: '+886-912-345-679',
    avatar: '/api/placeholder/32/32',
    selected: true,
  },
  {
    id: '3',
    name: '林雅婷',
    role: '研究員',
    email: 'lin.yt@example.com',
    phone: '+886-912-345-680',
    avatar: '/api/placeholder/32/32',
    selected: false,
  },
]);

// 發送通知表單數據
const notificationForm = reactive({
  content: '',
  recipients: [],
});

// 新增知悉功能相關狀態
const notificationDrawerVisible = ref(false);
const selectedAttachment = ref(null);
const submittingNotification = ref(false);
const notificationFormRef = ref();

// 附件歷史版本相關狀態
const historyVersionDrawerVisible = ref(false);
const selectedAttachmentHistory = ref<any>(null);

// 新增知悉表單數據
const attachmentNotificationForm = reactive({
  title: '',
  content: '',
  recipientType: 'all',
  selectedRoles: [],
  selectedUsers: [],
  priority: 'medium',
  sendType: 'immediate',
  scheduledTime: null,
});

// 新增知悉表單驗證規則
const attachmentNotificationFormRules = {
  title: [
    { required: true, message: '請輸入知悉標題', trigger: 'blur' },
    { min: 2, max: 50, message: '標題長度應在2-50個字符之間', trigger: 'blur' },
  ],
  content: [
    { required: true, message: '請輸入知悉內容', trigger: 'blur' },
    { min: 10, max: 1000, message: '內容長度應在10-1000個字符之間', trigger: 'blur' },
  ],
};

// 里程碑數據
const milestones = ref([
  {
    id: '1',
    title: '項目啟動',
    date: '2024-01-15',
    status: 'completed',
    description: '項目正式啟動，團隊成員確認',
  },
  {
    id: '2',
    title: '初步審查',
    date: '2024-02-01',
    status: 'inProgress',
    description: '對法律條文進行初步審查',
  },
  {
    id: '3',
    title: '專家評審',
    date: '2024-02-15',
    status: 'pending',
    description: '邀請外部專家進行評審',
  },
  {
    id: '4',
    title: '最終報告',
    date: '2024-03-10',
    status: 'pending',
    description: '提交最終審查報告',
  },
]);

// 新增任務數據（替換里程碑在左側顯示）
const recentTasks = ref([
  {
    id: '1',
    title: '法條第三章審查',
    assignee: '陳大文',
    status: 'inProgress',
    priority: 'high',
    dueDate: '2024-01-25',
    createTime: '2024-01-20 14:30:00',
    description: '對法律條文第三章進行詳細審查和分析',
  },
  {
    id: '2',
    title: '專家意見整理',
    assignee: '陳志華',
    status: 'completed',
    priority: 'medium',
    dueDate: '2024-01-22',
    createTime: '2024-01-19 16:45:00',
    description: '整理外部專家提供的審查意見',
  },
  {
    id: '3',
    title: '法規對比分析',
    assignee: '林雅婷',
    status: 'pending',
    priority: 'medium',
    dueDate: '2024-01-28',
    createTime: '2024-01-18 09:15:00',
    description: '與現有法規進行對比分析',
  },
  {
    id: '4',
    title: '初稿撰寫',
    assignee: '黃建國',
    status: 'inProgress',
    priority: 'high',
    dueDate: '2024-01-30',
    createTime: '2024-01-17 11:20:00',
    description: '根據審查結果撰寫法條初稿',
  },
  {
    id: '5',
    title: '資料收集',
    assignee: '趙六',
    status: 'completed',
    priority: 'low',
    dueDate: '2024-01-20',
    createTime: '2024-01-15 10:30:00',
    description: '收集相關法律資料和案例',
  },
]);

// 統計數據
const statistics = reactive({
  inProgressTasks: 8,
  cancelledTasks: 2,
  completedTasks: 15,
  totalTasks: 25,
});

// 動態記錄
const activities = ref([
  {
    id: '1',
    type: 'task_created',
    user: '陳大文',
    content: '創建了任務「法條第三章審查」',
    time: '2024-01-20 14:30:00',
    avatar: '/api/placeholder/32/32',
  },
  {
    id: '2',
    type: 'status_changed',
    user: '陳志華',
    content: '將項目狀態更改為「進行中」',
    time: '2024-01-19 16:45:00',
    avatar: '/api/placeholder/32/32',
  },
  {
    id: '3',
    type: 'member_joined',
    user: '林雅婷',
    content: '加入了項目團隊',
    time: '2024-01-18 09:15:00',
    avatar: '/api/placeholder/32/32',
  },
  {
    id: '4',
    type: 'project_created',
    user: '陳大文',
    content: '創建了項目',
    time: '2024-01-15 10:30:00',
    avatar: '/api/placeholder/32/32',
  },
]);



// 知悉信息
const acknowledgments = ref([
  {
    id: '1',
    taskName: '法條第一章審查',
    assignee: '陳志華',
    status: 'acknowledged',
    time: '2024-01-20 10:30:00',
    content: '已完成法條第一章的詳細審查工作，發現3處需要修改的條款，已整理成報告提交。',
    attachments: [
      { name: '第一章審查報告.pdf', size: '1.2MB' },
      { name: '修改建議.docx', size: '856KB' }
    ],
    comments: [
      {
        user: '陳大文',
        content: '審查工作很細致，建議盡快安排下一步工作',
        time: '2024-01-20 11:00:00'
      }
    ]
  },
  {
    id: '2',
    taskName: '法條第二章審查',
    assignee: '林雅婷',
    status: 'pending',
    time: '2024-01-19 15:20:00',
    content: '等待開始第二章的審查工作，需要先完成相關資料的收集。',
    attachments: [],
    comments: []
  },
  {
    id: '3',
    taskName: '專家意見整理',
    assignee: '陳大文',
    status: 'acknowledged',
    time: '2024-01-18 11:45:00',
    content: '已整理完成外部專家的所有意見，共收集到15條建議，已分類歸檔。',
    attachments: [
      { name: '專家意見匯總.xlsx', size: '2.1MB' }
    ],
    comments: [
      {
        user: '陳志華',
        content: '整理得很全面，可以開始下一階段工作',
        time: '2024-01-18 14:30:00'
      }
    ]
  },
  {
    id: '4',
    taskName: '法規對比分析',
    assignee: '黃建國',
    status: 'acknowledged',
    time: '2024-01-17 09:30:00',
    content: '完成了與現行法規的對比分析，發現5處衝突點，需要進一步討論解決方案。',
    attachments: [
      { name: '法規對比表.xlsx', size: '1.8MB' },
      { name: '衝突點分析.pdf', size: '3.2MB' }
    ],
    comments: []
  },
  {
    id: '5',
    taskName: '初稿撰寫準備',
    assignee: '趙六',
    status: 'pending',
    time: '2024-01-16 16:45:00',
    content: '正在準備初稿撰寫的相關材料和模板。',
    attachments: [],
    comments: []
  }
]);



// 處理邀請成員
const handleInviteMember = () => {
  console.log('邀請成員功能待實現');
};

// 處理查看更多統計
const handleViewMoreStats = () => {
  console.log('查看更多統計功能待實現');
};

// 處理查看所有里程碑
const handleViewAllMilestones = () => {
  console.log('查看所有里程碑功能待實現');
};

// 處理查看所有任務
const handleViewAllTasks = () => {
  console.log('查看所有任務功能待實現');
};

// 獲取任務優先級顏色
const getPriorityColor = (priority: string) => {
  const colorMap: Record<string, string> = {
    high: 'red',
    medium: 'orange',
    low: 'green',
  };
  return colorMap[priority] || 'default';
};

// 獲取任務優先級文本
const getPriorityText = (priority: string) => {
  const textMap: Record<string, string> = {
    high: '高',
    medium: '中',
    low: '低',
  };
  return textMap[priority] || '未知';
};

// 處理角色管理
const handleRoleManagement = () => {
  router.push({
    path: '/legal-platform/project-management/role-management',
    query: { projectId: projectInfo.id }
  });
};

// 處理查看項目流程節點記錄
const handleViewProcessNodes = () => {
  processModalVisible.value = true;
};

// 關閉流程節點彈窗
const handleCloseProcessModal = () => {
  processModalVisible.value = false;
};

// 獲取節點狀態圖標
const getNodeStatusIcon = (status: string) => {
  const iconMap: Record<string, string> = {
    completed: 'lucide--check-circle',
    inProgress: 'lucide--clock',
    pending: 'lucide--circle',
  };
  return iconMap[status] || 'lucide--circle';
};

// 獲取節點狀態顏色
const getNodeStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    completed: 'text-green-500',
    inProgress: 'text-blue-500',
    pending: 'text-gray-400',
  };
  return colorMap[status] || 'text-gray-400';
};

// 獲取節點連接線樣式
const getNodeLineClass = (status: string, isLast: boolean) => {
  if (isLast) return 'hidden';
  const colorMap: Record<string, string> = {
    completed: 'border-green-500',
    inProgress: 'border-blue-500',
    pending: 'border-gray-300',
  };
  return `border-l-2 ${colorMap[status] || 'border-gray-300'} ml-4 h-8`;
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
    type: 'project_update',
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



// 獲取通知類型文本
const getNotificationTypeText = (type: string) => {
  const typeMap: Record<string, string> = {
    project_update: '項目更新',
    milestone_change: '里程碑變更',
    task_assignment: '任務分配',
    document_upload: '文檔上傳',
    comment: '評論回復',
  };
  return typeMap[type] || type;
};

// 獲取通知方式文本
const getNotificationMethodText = (method: string) => {
  const methodMap: Record<string, string> = {
    email: '郵件',
    sms: '簡訊',
    push: '推送',
  };
  return methodMap[method] || method;
};

// 獲取通知狀態顏色
const getNotificationStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    sent: 'success',
    scheduled: 'processing',
    failed: 'error',
  };
  return colorMap[status] || 'default';
};

// 獲取通知狀態文本
const getNotificationStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    sent: '已發送',
    scheduled: '已安排',
    failed: '發送失敗',
  };
  return statusMap[status] || status;
};

// 附件相關處理函數
// 上傳附件
const handleUploadAttachment = () => {
  console.log('上傳附件功能待實現');
  message.info('上傳附件功能待實現');
};

// 查看附件歷史版本
const handleViewAttachmentHistory = (attachment: any) => {
  selectedAttachmentHistory.value = attachment;
  historyVersionDrawerVisible.value = true;
};

// 下載歷史版本附件
const handleDownloadHistoryVersion = (version: any) => {
  console.log('下載歷史版本:', version);
  message.success(`開始下載 ${selectedAttachmentHistory.value.name} (版本 ${version.version})`);
  // 這裡實現文件下載邏輯
};

// 預覽歷史版本附件
const handlePreviewHistoryVersion = (version: any) => {
  console.log('預覽歷史版本:', version);
  message.info(`預覽 ${selectedAttachmentHistory.value.name} (版本 ${version.version})`);
  // 這裡可以實現不同文件類型的預覽邏輯
};

// 預覽附件
const handlePreviewAttachment = (attachment: any) => {
  console.log('預覽附件:', attachment);
  message.info(`預覽 ${attachment.name}`);
  // 這裡可以實現不同文件類型的預覽邏輯
  // 例如：PDF、Word、Excel、圖片等
};

// 編輯附件信息
const handleEditAttachment = (attachment: any) => {
  console.log('編輯附件:', attachment);
  message.info(`編輯 ${attachment.name} 信息`);
  // 這裡可以打開編輯對話框
};

// 下載附件
const handleDownloadAttachment = (attachment: any) => {
  console.log('下載附件:', attachment);
  message.success(`開始下載 ${attachment.name}`);
  // 這裡實現文件下載邏輯
};

// 刪除附件
const handleDeleteAttachment = (attachment: any) => {
  const index = attachments.value.findIndex(item => item.id === attachment.id);
  if (index > -1) {
    attachments.value.splice(index, 1);
    message.success('附件刪除成功');
  }
};

// 添加評論
const handleAddComment = (attachment: any) => {
  const commentText = newComment.value[attachment.id];
  if (!commentText?.trim()) {
    message.warning('請輸入評論內容');
    return;
  }
  
  const newCommentObj = {
    id: Date.now().toString(),
    user: '當前用戶', // 這裡應該從用戶狀態獲取
    avatar: '/api/placeholder/20/20',
    content: commentText.trim(),
    time: new Date().toLocaleString('zh-CN'),
    replies: [],
  };
  
  const attachmentIndex = attachments.value.findIndex(item => item.id === attachment.id);
  if (attachmentIndex > -1) {
    if (!attachments.value[attachmentIndex].comments) {
      attachments.value[attachmentIndex].comments = [];
    }
    attachments.value[attachmentIndex].comments.push(newCommentObj);
    newComment.value[attachment.id] = '';
    message.success('評論添加成功');
  }
};

// 回復評論
const handleReplyComment = (attachment: any, comment: any) => {
  console.log('回復評論:', attachment, comment);
  message.info('回復評論功能待實現');
  // 這裡可以實現回復評論的邏輯
};

// 顯示評論輸入框
const handleShowCommentInput = (attachment: any) => {
  if (!newComment.value[attachment.id]) {
    newComment.value[attachment.id] = '';
  }
  // 可以添加聚焦到輸入框的邏輯
};

// 獲取文件圖標類名
const getFileIconClass = (fileType: string) => {
  const iconMap: Record<string, string> = {
    pdf: 'icon-[lucide--file-text] text-red-500',
    docx: 'icon-[lucide--file-text] text-blue-500',
    doc: 'icon-[lucide--file-text] text-blue-500',
    xlsx: 'icon-[lucide--file-spreadsheet] text-green-500',
    xls: 'icon-[lucide--file-spreadsheet] text-green-500',
    pptx: 'icon-[lucide--presentation] text-orange-500',
    ppt: 'icon-[lucide--presentation] text-orange-500',
    jpg: 'icon-[lucide--image] text-purple-500',
    jpeg: 'icon-[lucide--image] text-purple-500',
    png: 'icon-[lucide--image] text-purple-500',
    gif: 'icon-[lucide--image] text-purple-500',
    mp4: 'icon-[lucide--video] text-indigo-500',
    avi: 'icon-[lucide--video] text-indigo-500',
    mp3: 'icon-[lucide--music] text-pink-500',
    wav: 'icon-[lucide--music] text-pink-500',
    zip: 'icon-[lucide--archive] text-gray-500',
    rar: 'icon-[lucide--archive] text-gray-500',
    txt: 'icon-[lucide--file-text] text-gray-500',
  };
  return iconMap[fileType.toLowerCase()] || 'icon-[lucide--file] text-gray-500';
};

// 獲取狀態標籤顏色
const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    completed: 'success',
    inProgress: 'processing',
    pending: 'default',
    acknowledged: 'success',
  };
  return colorMap[status] || 'default';
};

// 獲取狀態文本
const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    completed: '已完成',
    inProgress: '處理中',
    pending: '待處理',
    acknowledged: '已知悉',
  };
  return textMap[status] || status;
};

// 新增知悉功能處理函數
// 打開新增知悉抽屜
const handleCreateNotificationForAttachment = (attachment: any) => {
  selectedAttachment.value = attachment;
  attachmentNotificationForm.title = `關於附件「${attachment.name}」的知悉`;
  attachmentNotificationForm.content = '';
  attachmentNotificationForm.recipientType = 'all';
  attachmentNotificationForm.selectedRoles = [];
  attachmentNotificationForm.selectedUsers = [];
  attachmentNotificationForm.priority = 'medium';
  attachmentNotificationForm.sendType = 'immediate';
  attachmentNotificationForm.scheduledTime = null;
  notificationDrawerVisible.value = true;
};

// 關閉新增知悉抽屜
const handleCloseNotificationDrawer = () => {
  notificationDrawerVisible.value = false;
  selectedAttachment.value = null;
  // 重置表單
  if (notificationFormRef.value) {
    notificationFormRef.value.resetFields();
  }
};

// 提交知悉
const handleSubmitNotification = async () => {
  try {
    // 驗證表單
    await notificationFormRef.value.validate();
    
    submittingNotification.value = true;
    
    // 模擬API調用
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 創建知悉記錄
    const newNotification = {
      id: Date.now().toString(),
      title: attachmentNotificationForm.title,
      content: attachmentNotificationForm.content,
      attachmentId: selectedAttachment.value?.id,
      attachmentName: selectedAttachment.value?.name,
      recipientType: attachmentNotificationForm.recipientType,
      selectedRoles: attachmentNotificationForm.selectedRoles,
      selectedUsers: attachmentNotificationForm.selectedUsers,
      priority: attachmentNotificationForm.priority,
      sendType: attachmentNotificationForm.sendType,
      scheduledTime: attachmentNotificationForm.scheduledTime,
      createTime: new Date().toLocaleString('zh-CN'),
      creator: '當前用戶', // 這裡應該從用戶狀態獲取
      status: attachmentNotificationForm.sendType === 'immediate' ? 'sent' : 'scheduled',
    };
    
    // 添加到通知歷史記錄
    notificationHistory.value.unshift(newNotification);
    
    message.success(attachmentNotificationForm.sendType === 'immediate' ? '知悉已發送' : '知悉已安排發送');
    handleCloseNotificationDrawer();
  } catch (error) {
    console.error('提交知悉失敗:', error);
    message.error('提交失敗，請重試');
  } finally {
    submittingNotification.value = false;
  }
};

// 格式化文件大小
const formatFileSize = (size: string) => {
  return size; // 這裡可以實現更複雜的文件大小格式化邏輯
};

// 獲取活動圖標
const getActivityIcon = (type: string) => {
  const iconMap: Record<string, string> = {
    task_created: 'lucide--plus-circle',
    status_changed: 'lucide--edit',
    member_joined: 'lucide--user-plus',
    project_created: 'lucide--folder-plus',
  };
  return iconMap[type] || 'lucide--circle';
};

// 獲取活動圖標類名
const getActivityIconClass = (type: string) => {
  const iconClassMap: Record<string, string> = {
    task_created: 'icon-[lucide--plus-circle] size-4 text-gray-400 mt-1',
    status_changed: 'icon-[lucide--edit] size-4 text-gray-400 mt-1',
    member_joined: 'icon-[lucide--user-plus] size-4 text-gray-400 mt-1',
    project_created: 'icon-[lucide--folder-plus] size-4 text-gray-400 mt-1',
  };
  return iconClassMap[type] || 'icon-[lucide--circle] size-4 text-gray-400 mt-1';
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

// 關注功能處理函數
const handleToggleFollow = () => {
  if (isFollowing.value) {
    // 取消關注
    isFollowing.value = false;
    followersCount.value--;
    message.success('已取消關注此項目');
  } else {
    // 添加關注
    isFollowing.value = true;
    followersCount.value++;
    message.success('已關注此項目，將接收項目動態通知');
  }
};

// 處理查看知悉詳情
const handleViewAcknowledgmentDetail = (ack) => {
  // 參考 notification-management/list 的做法，使用路由跳轉到詳情頁面
  router.push(`/legal-platform/notification-management/detail/${ack.id}`);
};



// 處理查看更多知悉
const handleViewMoreAcknowledments = () => {
  console.log('查看更多知悉功能');
  // 跳轉到知悉管理頁面
  router.push('/legal-platform/notification-management/list');
};

// 處理查看項目
const handleViewProject = () => {
  console.log('查看項目詳情');
  message.info('跳轉到項目詳情頁面');
};

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
  };
  
  // 添加到最新任務列表
  recentTasks.value.unshift(newTask);
  if (recentTasks.value.length > 5) {
    recentTasks.value = recentTasks.value.slice(0, 5);
  }
  
  message.success('任務創建成功');
  closeCreateTaskDrawer();
};

onMounted(() => {
  // 這裡可以根據路由參數加載具體的項目數據
  console.log('項目詳情頁面加載，項目ID:', route.params.id);
  // 初始化流程步驟狀態
  updateProcessSteps();
});
</script>

<template>
  <Page :title="$t('page.legalPlatform.projectDetail')">

    
    <div class="project-detail">
      <!-- 頁面標題 -->
      <div class="mb-5">
        <div class="flex items-center justify-between">
          <div>
            <Title :level="2" class="!mb-2">
              {{ projectInfo.name }}
            </Title>
            <Space>
              <Tag v-for="tag in projectTags" :key="tag.id" :color="tag.color">
                {{ tag.name }}
              </Tag>
              <Button size="small" type="dashed" @click="handleOpenTagManagement">
                <span class="icon-[lucide--tag] size-4 mr-1" />
                標籤管理
              </Button>
            </Space>
          </div>
          <Space>
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

            <Button @click="handleRoleManagement">
              <span class="icon-[lucide--users] size-4 mr-1" />
              角色管理
            </Button>
            <!-- 新增：新增任務按鈕 -->
            <Button type="primary" @click="handleAddTask">
              <span class="icon-[lucide--plus] size-4 mr-1" />
              {{ $t('page.legalPlatform.addTask') }}
            </Button>

          </Space>
        </div>
        
        <!-- 流程狀態指示器 - 在新增任務按鈕下方，向右對齊 -->
        <div class="flex justify-end mt-3">
          <div class="process-indicator-below-button">
            <div class="process-steps-inline">
              <template v-for="(step, index) in processSteps" :key="step.id">
                <div class="step-container-inline">
                  <div class="step-circle-inline" :style="getStepCircleStyleInline(step)">
                    {{ step.number }}
                  </div>
                  <div class="step-text-inline" :style="getStepTextStyleInline(step)">
                    {{ step.name }}
                  </div>
                </div>
                <div v-if="index < processSteps.length - 1" class="step-connector-inline" :style="getConnectorStyleInline(index)"></div>
              </template>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 主要內容區域 -->
      <Row :gutter="5">
        <!-- 左側主要內容 -->
        <Col :xs="24" :lg="16">
          <!-- 項目基本信息卡片 -->
          <Card class="mb-5" title="項目信息">
            <Row :gutter="5">
              <!-- 項目詳情 -->
              <Col :span="24">
                <div class="project-details space-y-1">
                  <div>
                    <Text type="secondary">項目名稱：</Text>
                    <Text strong>{{ projectInfo.name }}</Text>
                  </div>
                  <div>
                    <Text type="secondary">項目類型：</Text>
                    <Text>{{ projectInfo.type }}</Text>
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
              </Col>
            </Row>
            <Divider />
            <div>
              <Text type="secondary">項目描述：</Text>
              <Paragraph class="!mt-1">
                {{ projectInfo.description }}
              </Paragraph>
            </div>
          </Card>

          <!-- 成員卡片 -->
          <Card class="mb-5">
            <template #title>
              <div class="flex items-center justify-between">
                <span>成員</span>
                <Button type="primary" size="small" @click="handleInviteMember">
                  <span class="icon-[lucide--user-plus] size-4 mr-1" />
                  邀請
                </Button>
              </div>
             </template>
            <div class="members-list">
              <Row :gutter="[5, 5]">
                <Col v-for="member in projectMembers" :key="member.id" :xs="12" :sm="8" :md="6" :lg="4">
                  <Card class="member-card" size="small">
                    <div class="flex flex-col items-center text-center p-3">
                      <Avatar :src="member.avatar" :size="40" class="mb-2">
                        {{ member.name.charAt(0) }}
                      </Avatar>
                      <div class="font-medium text-sm mb-1 truncate w-full">{{ member.name }}</div>
                      <div class="text-xs text-gray-500 truncate w-full">{{ member.role }}</div>
                    </div>
                  </Card>
                </Col>
              </Row>
            </div>
          </Card>

          <!-- 任務信息卡片（替換原來的里程碑位置） -->
          <Card>
            <template #title>
              <div class="flex items-center justify-between">
                <span>最新任務</span>
                <Button type="link" size="small" @click="handleViewAllTasks">
                  全部
                </Button>
              </div>
            </template>
            <div v-if="recentTasks.length > 0">
              <div class="tasks-list space-y-1">
                <div v-for="task in recentTasks" :key="task.id" class="task-item">
                  <div class="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div class="flex-1">
                      <div class="flex items-center space-x-1 mb-1">
                        <Text strong class="text-base">{{ task.title }}</Text>
                        <Tag :color="getPriorityColor(task.priority)" size="small">
                          {{ getPriorityText(task.priority) }}
                        </Tag>
                        <Tag :color="getStatusColor(task.status)" size="small">
                          {{ getStatusText(task.status) }}
                        </Tag>
                      </div>
                      <Text type="secondary" class="text-sm block mb-1">{{ task.description }}</Text>
                      <div class="flex items-center space-x-1 text-xs text-gray-500">
                        <span>負責人：{{ task.assignee }}</span>
                        <span>到期時間：{{ task.dueDate }}</span>
                        <span>創建時間：{{ task.createTime }}</span>
                      </div>
                    </div>
                    <div class="flex items-center space-x-1">
                      <Button type="link" size="small">
                        <span class="icon-[lucide--eye] size-4" />
                      </Button>
                      <Button type="link" size="small">
                        <span class="icon-[lucide--edit] size-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Empty v-else description="暫無任務數據" />
          </Card>

          <!-- 最新任務卡片 -->
          <Card class="mb-5">
            <template #title>
              <div class="flex items-center justify-between">
                <span>項目附件</span>
                <Button type="primary" size="small" @click="handleUploadAttachment">
                  <span class="icon-[lucide--upload] size-4 mr-1" />
                  上傳附件
                </Button>
              </div>
            </template>
            <div v-if="attachments.length > 0" class="attachments-list space-y-1">
              <div v-for="attachment in attachments" :key="attachment.id" class="attachment-item">
                <div class="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                  <!-- 文件圖標 -->
                  <div class="flex-shrink-0">
                    <span :class="getFileIconClass(attachment.type)" class="size-8" />
                  </div>
                  
                  <!-- 文件信息 -->
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between mb-1">
                      <Text strong class="text-sm truncate">{{ attachment.name }}</Text>
                      <div class="flex items-center space-x-1">
                        <Button type="link" size="small" @click="handleCreateNotificationForAttachment(attachment)">
                          <span class="icon-[lucide--bell-plus] size-4" />
                        </Button>
                        <Button type="link" size="small" @click="handlePreviewAttachment(attachment)">
                          <span class="icon-[lucide--eye] size-4" />
                        </Button>
                        <Button type="link" size="small" @click="handleEditAttachment(attachment)">
                          <span class="icon-[lucide--edit] size-4" />
                        </Button>
                        <Button type="link" size="small" @click="handleDownloadAttachment(attachment)">
                          <span class="icon-[lucide--download] size-4" />
                        </Button>
                        <Button 
                          v-if="attachment.history && attachment.history.length > 0" 
                          type="link" 
                          size="small" 
                          @click="handleViewAttachmentHistory(attachment)"
                        >
                          <span class="icon-[lucide--history] size-4" />
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
                    <div class="flex items-center space-x-1 text-xs text-gray-500 mb-1">
                      <span>{{ attachment.size }}</span>
                      <span>{{ attachment.type }}</span>
                      <span>{{ attachment.uploadTime }}</span>
                      <span>上傳者：{{ attachment.uploader }}</span>
                    </div>
                    
                    <!-- 標籤 -->
                    <div v-if="attachment.tags && attachment.tags.length > 0" class="mb-1">
                      <Tag v-for="tag in attachment.tags" :key="tag" size="small" class="mr-1">
                        {{ tag }}
                      </Tag>
                    </div>
                    
                    <!-- 備註 -->
                    <div v-if="attachment.remark" class="text-xs text-gray-600 mb-1">
                      <Text type="secondary">備註：{{ attachment.remark }}</Text>
                    </div>
                    
                    <!-- 評論區域 -->
                    <div v-if="attachment.comments && attachment.comments.length > 0" class="comments-section">
                      <Divider class="!my-1" />
                      <div class="space-y-1">
                        <div v-for="comment in attachment.comments" :key="comment.id" class="comment-item">
                          <div class="flex items-start space-x-1">
                            <Avatar :src="comment.avatar" :size="20">
                              {{ comment.user.charAt(0) }}
                            </Avatar>
                            <div class="flex-1">
                              <div class="text-xs">
                                <Text strong>{{ comment.user }}</Text>
                                <Text type="secondary" class="ml-2">{{ comment.time }}</Text>
                              </div>
                              <div class="text-xs text-gray-600 mt-1">{{ comment.content }}</div>
                              
                              <!-- 回復 -->
                              <div v-if="comment.replies && comment.replies.length > 0" class="ml-2 mt-1 space-y-1">
                                <div v-for="reply in comment.replies" :key="reply.id" class="reply-item">
                                  <div class="flex items-start space-x-1">
                                    <Avatar :src="reply.avatar" :size="16">
                                      {{ reply.user.charAt(0) }}
                                    </Avatar>
                                    <div class="flex-1">
                                      <div class="text-xs">
                                        <Text strong>{{ reply.user }}</Text>
                                        <Text type="secondary" class="ml-2">{{ reply.time }}</Text>
                                      </div>
                                      <div class="text-xs text-gray-600 mt-0">{{ reply.content }}</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <Button type="link" size="small" class="text-xs p-0 h-auto mt-0" @click="handleReplyComment(attachment, comment)">
                                回復
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <!-- 添加評論 -->
                      <div class="mt-3">
                        <Input.TextArea
                          v-model:value="newComment[attachment.id]"
                          placeholder="添加評論..."
                          :rows="2"
                          class="text-xs"
                        />
                        <div class="flex justify-end mt-2">
                          <Button size="small" type="primary" @click="handleAddComment(attachment)">
                            發表評論
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <!-- 如果沒有評論，顯示添加評論按鈕 -->
                    <div v-else class="mt-2">
                      <Button type="link" size="small" class="text-xs p-0 h-auto" @click="handleShowCommentInput(attachment)">
                        <span class="icon-[lucide--message-circle] size-3 mr-1" />
                        添加評論
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Empty v-else description="暫無附件" />
          </Card>
        </Col>

        <!-- 右側輔助信息 -->
        <Col :xs="24" :lg="8">
          <!-- 統計卡片 -->
          <Card class="mb-6" title="統計">
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

          <!-- 里程碑卡片（移動到右側） -->
          <Card class="mb-6">
            <template #title>
              <div class="flex items-center justify-between">
                <span>里程碑</span>
                <Button type="link" size="small" @click="handleViewAllMilestones">
                  全部
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
                    <div class="flex items-center justify-between mb-1">
                      <Text strong class="text-sm">{{ milestone.title }}</Text>
                      <Text type="secondary" class="text-xs">{{ milestone.date }}</Text>
                    </div>
                    <Text type="secondary" class="text-xs">{{ milestone.description }}</Text>
                  </div>
                </TimelineItem>
              </Timeline>
            </div>
            <Empty v-else description="暫無里程碑數據" />
          </Card>

          <!-- 動態卡片 -->
          <Card class="mb-6" title="動態">
            <!-- 動態列表 -->
            <div class="activities-list space-y-3">
              <div v-for="activity in activities" :key="activity.id" class="activity-item flex space-x-3">
                <Avatar :src="activity.avatar" :size="32">
                  {{ activity.user.charAt(0) }}
                </Avatar>
                <div class="flex-1">
                  <div class="activity-content">
                    <Text strong>{{ activity.user }}</Text>
                    <Text class="ml-1">{{ activity.content }}</Text>
                  </div>
                  <Text type="secondary" class="text-xs">{{ activity.time }}</Text>
                </div>
                <span :class="getActivityIconClass(activity.type)" />
              </div>
            </div>
          </Card>

          <!-- 知悉卡片 -->
          <Card class="mb-6" title="知悉">
            <div class="acknowledgments-list space-y-3">
              <div v-for="ack in acknowledgments.slice(0, 3)" :key="ack.id" class="ack-item">
                <div class="flex items-center justify-between mb-1">
                  <Text strong class="text-sm cursor-pointer hover:text-blue-500" @click="handleViewAcknowledgmentDetail(ack)">
                    {{ ack.taskName }}
                  </Text>
                  <Tag :color="getStatusColor(ack.status)" size="small">
                    {{ getStatusText(ack.status) }}
                  </Tag>
                </div>
                <div class="flex items-center justify-between">
                  <Text type="secondary" class="text-xs">負責人：{{ ack.assignee }}</Text>
                  <Text type="secondary" class="text-xs">{{ ack.time }}</Text>
                </div>
                <div v-if="ack.content" class="mt-2">
                  <Text type="secondary" class="text-xs line-clamp-2">{{ ack.content }}</Text>
                </div>
              </div>
            </div>
            <div v-if="acknowledgments.length > 3" class="mt-4">
              <Button type="link" block @click="handleViewMoreAcknowledments">
                查看更多
              </Button>
            </div>
          </Card>

          <!-- 通知歷史記錄卡片 -->
          <Card title="通知記錄">
            <div v-if="notificationHistory.length > 0" class="notification-history-list space-y-3">
              <div v-for="notification in notificationHistory.slice(0, 5)" :key="notification.id" class="notification-item">
                <div class="flex items-start justify-between mb-2">
                  <div class="flex-1">
                    <div class="flex items-center space-x-2 mb-1">
                      <Text strong class="text-sm">{{ notification.title }}</Text>
                      <Tag :color="getNotificationStatusColor(notification.status)" size="small">
                        {{ getNotificationStatusText(notification.status) }}
                      </Tag>
                    </div>
                    <Text type="secondary" class="text-xs block mb-1">{{ notification.content }}</Text>
                    <div class="flex items-center space-x-2 text-xs text-gray-500">
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
                  <Text type="secondary" class="text-xs">{{ notification.sendTime }}</Text>
                </div>
              </div>
            </div>
            <Empty v-else description="暫無通知記錄" />
            <div v-if="notificationHistory.length > 5" class="mt-4">
              <Button type="link" block>
                查看更多
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>

    <!-- 項目流程節點記錄彈窗 -->
    <Modal
      v-model:open="processModalVisible"
      title="項目流程節點記錄"
      width="800px"
      :footer="null"
      @cancel="handleCloseProcessModal"
    >
      <div class="process-nodes-container">
        <div class="process-timeline">
          <div v-for="(node, index) in processNodes" :key="node.id" class="process-node-item">
            <!-- 節點內容 -->
            <div class="flex items-start space-x-4">
              <!-- 節點圖標 -->
              <div class="flex flex-col items-center">
                <div class="node-icon-wrapper">
                  <span v-if="node.status === 'completed'" :class="`icon-[lucide--check-circle] size-6 ${getNodeStatusColor(node.status)}`" />
                  <span v-else-if="node.status === 'inProgress'" :class="`icon-[lucide--clock] size-6 ${getNodeStatusColor(node.status)}`" />
                  <span v-else :class="`icon-[lucide--circle] size-6 ${getNodeStatusColor(node.status)}`" />
                </div>
                <!-- 連接線 -->
                <div v-if="index < processNodes.length - 1" :class="getNodeLineClass(node.status, index === processNodes.length - 1)" />
              </div>
              
              <!-- 節點信息 -->
              <div class="flex-1 pb-8">
                <div class="node-content bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                  <!-- 節點標題和狀態 -->
                  <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center space-x-2">
                      <Text strong class="text-lg">{{ node.nodeName }}</Text>
                      <Tag :color="getStatusColor(node.status)" size="small">
                        {{ getStatusText(node.status) }}
                      </Tag>
                    </div>
                    <Text type="secondary" class="text-sm">{{ node.duration }}</Text>
                  </div>
                  
                  <!-- 節點描述 -->
                  <div class="mb-3">
                    <Text type="secondary">{{ node.description }}</Text>
                  </div>
                  
                  <!-- 操作人和時間信息 -->
                  <div v-if="node.operator" class="flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                      <Avatar :src="node.operatorAvatar" :size="24">
                        {{ node.operator.charAt(0) }}
                      </Avatar>
                      <div>
                        <Text strong class="text-sm">{{ node.operator }}</Text>
                        <div class="text-xs text-gray-500">操作人</div>
                      </div>
                    </div>
                    <div class="text-right">
                      <div class="text-sm text-gray-600">{{ node.operateTime }}</div>
                      <div class="text-xs text-gray-500">操作時間</div>
                    </div>
                  </div>
                  
                  <!-- 待處理節點提示 -->
                  <div v-else class="text-center py-2">
                    <Text type="secondary" class="text-sm">等待處理中...</Text>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 流程統計信息 -->
        <div class="process-summary mt-6 p-4 bg-gray-50 rounded-lg">
          <Title :level="5" class="!mb-3">流程統計</Title>
          <Row :gutter="16">
            <Col :span="8">
              <div class="text-center">
                <div class="text-2xl font-bold text-green-500">{{ processNodes.filter(n => n.status === 'completed').length }}</div>
                <div class="text-sm text-gray-500">已完成</div>
              </div>
            </Col>
            <Col :span="8">
              <div class="text-center">
                <div class="text-2xl font-bold text-blue-500">{{ processNodes.filter(n => n.status === 'inProgress').length }}</div>
                <div class="text-sm text-gray-500">處理中</div>
              </div>
            </Col>
            <Col :span="8">
              <div class="text-center">
                <div class="text-2xl font-bold text-gray-400">{{ processNodes.filter(n => n.status === 'pending').length }}</div>
                <div class="text-sm text-gray-500">待處理</div>
              </div>
            </Col>
          </Row>
        </div>
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
                :rows="3" 
                placeholder="請輸入標籤描述（可選）"
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
                <Button @click="handleCloseTagManagement">
                  關閉
                </Button>
              </Space>
            </FormItem>
          </Form>
        </Card>
      </div>
    </Modal>

    <!-- 新增知悉抽屜 -->
    <Drawer
      v-model:open="notificationDrawerVisible"
      title="新增知悉"
      placement="right"
      width="600"
      :closable="true"
      @close="handleCloseNotificationDrawer"
    >
      <div class="notification-form-container">
        <Form
          ref="notificationFormRef"
          :model="attachmentNotificationForm"
          :rules="attachmentNotificationFormRules"
          layout="vertical"
        >
          <FormItem label="知悉標題" name="title">
            <Input v-model:value="attachmentNotificationForm.title" placeholder="請輸入知悉標題" />
          </FormItem>
          
          <FormItem label="知悉內容" name="content">
            <Textarea
              v-model:value="attachmentNotificationForm.content"
              placeholder="請輸入知悉內容"
              :rows="6"
            />
          </FormItem>
          
          <FormItem label="關聯附件">
            <div class="selected-attachment" v-if="selectedAttachment">
              <div class="flex items-center space-x-2 p-3 bg-gray-50 rounded">
                <span class="icon-[lucide--file] size-4" />
                <span class="font-medium">{{ selectedAttachment.name }}</span>
                <span class="text-gray-500 text-sm">({{ formatFileSize(selectedAttachment.size) }})</span>
              </div>
            </div>
          </FormItem>
          
          <FormItem label="收件人設置" name="recipients">
            <RadioGroup v-model:value="attachmentNotificationForm.recipientType">
              <Radio value="all">所有參與人</Radio>
              <Radio value="roles">指定角色</Radio>
              <Radio value="users">指定人員</Radio>
            </RadioGroup>
            
            <div v-if="attachmentNotificationForm.recipientType === 'roles'" class="mt-3">
              <Select
                v-model:value="attachmentNotificationForm.selectedRoles"
                mode="multiple"
                placeholder="請選擇角色"
                style="width: 100%"
              >
                <SelectOption value="project_manager">項目經理</SelectOption>
                <SelectOption value="legal_advisor">法務顧問</SelectOption>
                <SelectOption value="team_member">團隊成員</SelectOption>
              </Select>
            </div>
            
            <div v-if="attachmentNotificationForm.recipientType === 'users'" class="mt-3">
              <Select
                v-model:value="attachmentNotificationForm.selectedUsers"
                mode="multiple"
                placeholder="請選擇人員"
                style="width: 100%"
              >
                <SelectOption value="user1">陳志華</SelectOption>
                <SelectOption value="user2">林雅婷</SelectOption>
                <SelectOption value="user3">黃建國</SelectOption>
              </Select>
            </div>
          </FormItem>
          
          <FormItem label="優先級" name="priority">
            <Select v-model:value="attachmentNotificationForm.priority" placeholder="請選擇優先級">
              <SelectOption value="high">高</SelectOption>
              <SelectOption value="medium">中</SelectOption>
              <SelectOption value="low">低</SelectOption>
            </Select>
          </FormItem>
          
          <FormItem label="發送時間">
            <RadioGroup v-model:value="attachmentNotificationForm.sendType">
              <Radio value="immediate">立即發送</Radio>
              <Radio value="scheduled">定時發送</Radio>
            </RadioGroup>
            
            <div v-if="attachmentNotificationForm.sendType === 'scheduled'" class="mt-3">
              <DatePicker
                v-model:value="attachmentNotificationForm.scheduledTime"
                show-time
                placeholder="請選擇發送時間"
                style="width: 100%"
              />
            </div>
          </FormItem>
        </Form>
        
        <div class="flex justify-end space-x-2 mt-6">
          <Button @click="handleCloseNotificationDrawer">取消</Button>
          <Button type="primary" @click="handleSubmitNotification" :loading="submittingNotification">
            {{ attachmentNotificationForm.sendType === 'immediate' ? '立即發送' : '設定發送' }}
          </Button>
        </div>
      </div>
    </Drawer>

    <!-- 新增任務抽屜 -->
    <Drawer
      v-model:open="createTaskDrawerVisible"
      title="新增任務"
      placement="right"
      width="600"
      :closable="true"
      @close="closeCreateTaskDrawer"
    >
      <div class="create-task-form-container">
        <Form
          :model="createTaskFormData"
          layout="vertical"
        >
          <FormItem label="任務名稱" required>
            <Input v-model:value="createTaskFormData.taskName" placeholder="請輸入任務名稱" />
          </FormItem>
          
          <FormItem label="任務描述">
            <Textarea
              v-model:value="createTaskFormData.taskDescription"
              placeholder="請輸入任務描述"
              :rows="4"
            />
          </FormItem>
          
          <FormItem label="所屬項目">
            <Select v-model:value="createTaskFormData.projectName" placeholder="請選擇項目">
              <SelectOption v-for="project in projectNameOptions" :key="project.value" :value="project.label">
                {{ project.label }}
              </SelectOption>
            </Select>
          </FormItem>
          
          <FormItem label="任務負責人" required>
            <Select v-model:value="createTaskFormData.taskResponsible" placeholder="請選擇負責人">
              <SelectOption v-for="person in taskResponsibleOptions" :key="person.value" :value="person.value">
                {{ person.label }}
              </SelectOption>
            </Select>
          </FormItem>
          
          <FormItem label="任務參與人員">
            <Select
              v-model:value="createTaskFormData.taskParticipants"
              mode="multiple"
              placeholder="請選擇參與人員"
              style="width: 100%"
            >
              <SelectOption v-for="participant in taskParticipantOptions" :key="participant.value" :value="participant.value">
                <div class="flex items-center space-x-2">
                  <span class="icon-[lucide--user]" v-if="participant.type === 'person'" />
                  <span class="icon-[lucide--users]" v-else />
                  <span>{{ participant.label }}</span>
                </div>
              </SelectOption>
            </Select>
          </FormItem>
          
          <FormItem label="開始時間">
            <DatePicker
              v-model:value="createTaskFormData.taskStartTime"
              placeholder="請選擇開始時間"
              style="width: 100%"
            />
          </FormItem>
          
          <FormItem label="結束時間">
            <DatePicker
              v-model:value="createTaskFormData.taskEndTime"
              placeholder="請選擇結束時間"
              style="width: 100%"
            />
          </FormItem>
          
          <FormItem label="到期時間">
            <DatePicker
              v-model:value="createTaskFormData.taskDueTime"
              show-time
              placeholder="請選擇到期時間"
              style="width: 100%"
            />
          </FormItem>
          
          <FormItem label="預估工時（小時）">
            <Input
              v-model:value="createTaskFormData.estimatedHours"
              type="number"
              placeholder="請輸入預估工時"
              :min="0"
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
        
        <div class="flex justify-end space-x-2 mt-6">
          <Button @click="closeCreateTaskDrawer">取消</Button>
          <Button type="primary" @click="handleSaveTask">
            保存任務
          </Button>
        </div>
      </div>
    </Drawer>

    <!-- 附件歷史版本抽屜 -->
    <Drawer
      v-model:open="historyVersionDrawerVisible"
      title="附件歷史版本"
      width="500"
      :closable="true"
      @close="selectedAttachmentHistory = null"
    >
      <div v-if="selectedAttachmentHistory">
        <div class="mb-4">
          <div class="flex items-center mb-2">
            <span :class="getFileIconClass(selectedAttachmentHistory.type)" class="size-6 mr-2" />
            <Text strong>{{ selectedAttachmentHistory.name }}</Text>
          </div>
          <Text type="secondary" class="text-sm">當前版本: {{ selectedAttachmentHistory.version }}</Text>
        </div>
        
        <Divider orientation="left">版本歷史</Divider>
        
        <div class="history-list space-y-3">
          <div v-for="(version, index) in selectedAttachmentHistory.history" :key="index" class="history-item p-3 border rounded-lg hover:bg-gray-50">
            <div class="flex items-center justify-between mb-2">
              <Text strong>版本 {{ version.version }}</Text>
              <div class="flex items-center space-x-2">
                <Button type="link" size="small" @click="handlePreviewHistoryVersion(version)">
                  <span class="icon-[lucide--eye] size-4" />
                </Button>
                <Button type="link" size="small" @click="handleDownloadHistoryVersion(version)">
                  <span class="icon-[lucide--download] size-4" />
                </Button>
              </div>
            </div>
            
            <div class="text-xs text-gray-500 space-y-1">
              <div class="flex items-center justify-between">
                <span>上傳時間:</span>
                <span>{{ version.uploadTime }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span>上傳者:</span>
                <span>{{ version.uploader }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span>文件大小:</span>
                <span>{{ version.size }}</span>
              </div>
              <div v-if="version.remark" class="mt-2">
                <Text type="secondary">備註: {{ version.remark }}</Text>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Empty v-else description="未選擇附件" />
    </Drawer>

  </Page>
</template>

<style scoped>
/* 流程狀態指示器樣式 */
.process-indicator {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(229, 231, 235, 0.5);
}

.process-steps {
  display: flex;
  align-items: center;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
}

.step-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.step-circle {
  transition: all 0.3s ease;
}

.step-text {
  white-space: nowrap;
  font-weight: 500;
  transition: all 0.3s ease;
}

.step-connector {
  transition: all 0.3s ease;
}

/* 內聯版本流程狀態指示器樣式 */
.process-indicator-inline {
  margin-top: 16px;
  padding: 12px 16px;
  background: rgba(249, 250, 251, 0.8);
  border-radius: 8px;
  border: 1px solid rgba(229, 231, 235, 0.6);
}

.process-steps-inline {
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
}

.step-container-inline {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.step-circle-inline {
  transition: all 0.3s ease;
}

.step-text-inline {
  white-space: nowrap;
  font-weight: 500;
  transition: all 0.3s ease;
}

.step-connector-inline {
  transition: all 0.3s ease;
}

/* 右對齊版本流程狀態指示器樣式 */
.process-indicator-inline-right {
  padding: 8px 12px;
  background: rgba(249, 250, 251, 0.6);
  border-radius: 6px;
  border: 1px solid rgba(229, 231, 235, 0.4);
}

.process-indicator-inline-right .process-steps-inline {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
}

/* 按鈕下方版本流程狀態指示器樣式 */
.process-indicator-below-button {
  padding: 6px 10px;
  background: rgba(249, 250, 251, 0.5);
  border-radius: 4px;
  border: 1px solid rgba(229, 231, 235, 0.3);
}

.process-indicator-below-button .process-steps-inline {
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
}

.project-detail {
  background-color: #ffffff;
}

.project-cover img {
  transition: transform 0.3s ease;
}

.project-cover img:hover {
  transform: scale(1.05);
}

.member-card {
  transition: all 0.3s ease;
  cursor: pointer;
  aspect-ratio: 1;
  min-height: 120px;
}

.member-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.member-card .ant-card-body {
  padding: 8px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.milestone-item {
  padding-bottom: 8px;
}

.stat-item {
  padding: 8px 0;
}

.activity-item {
  padding-bottom: 12px;
  border-bottom: 1px solid #f5f5f5;
}

.activity-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.ack-item {
  padding: 12px;
  background-color: #fafafa;
  border-radius: 6px;
  border: 1px solid #f0f0f0;
  transition: all 0.2s ease;
}

.ack-item:hover {
  background-color: #f5f5f5;
  border-color: #d9d9d9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}



/* 附件相關樣式 */
.attachment-item {
  transition: all 0.2s ease;
}

.attachment-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.comments-section {
  background-color: #fafafa;
  border-radius: 6px;
  padding: 8px;
  margin-top: 8px;
}

.comment-item {
  padding: 6px 0;
}

.comment-item:not(:last-child) {
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 8px;
  margin-bottom: 8px;
}

.reply-item {
  background-color: #f5f5f5;
  border-radius: 4px;
  padding: 4px 8px;
}

/* 流程節點樣式 */
.process-nodes-container {
  max-height: 600px;
  overflow-y: auto;
}

.process-timeline {
  position: relative;
}

.process-node-item {
  position: relative;
}

.node-icon-wrapper {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #ffffff;
  border: 2px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
}

.node-content {
  position: relative;
  transition: all 0.3s ease;
}

.node-content:hover {
  transform: translateY(-2px);
}

.process-summary {
  border: 1px solid #e5e7eb;
}

/* 通知功能樣式 */
.notification-history-list {
  max-height: 400px;
  overflow-y: auto;
}

.notification-item {
  padding: 12px;
  background: #fafafa;
  border-radius: 6px;
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;
}

.notification-item:hover {
  background: #f5f5f5;
  border-color: #d9d9d9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.notification-modal-content {
  max-height: 70vh;
  overflow-y: auto;
}

.recipients-list {
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  padding: 8px;
}

.recipient-item {
  padding: 8px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.recipient-item:hover {
  background-color: #f5f5f5;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .project-detail {
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
  
  /* 流程節點響應式 */
  .process-nodes-container {
    max-height: 500px;
  }
  
  .node-content {
    margin-left: -8px;
  }
  
  .node-icon-wrapper {
    width: 24px;
    height: 24px;
  }
  
  /* 通知功能響應式 */
  .notification-item {
    padding: 8px;
  }
  
  .recipients-list {
    max-height: 150px;
  }
  
  .notification-modal-content {
    max-height: 60vh;
  }
}

/* 標籤管理樣式 */
.tag-management-content {
  max-height: 70vh;
  overflow-y: auto;
}

.tags-list {
  max-height: 300px;
  overflow-y: auto;
}

.tag-item {
  transition: all 0.3s ease;
}

.tag-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.tag-form-section {
  background-color: #fafafa;
  border-radius: 8px;
  padding: 16px;
}

/* 標籤管理響應式 */
@media (max-width: 768px) {
  .tag-management-content {
    max-height: 60vh;
  }
  
  .tags-list {
    max-height: 200px;
  }
  
  .tag-item .flex {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .tag-item .flex > div:last-child {
    margin-top: 8px;
    align-self: flex-end;
  }
}

/* 新增知悉抽屜樣式 */
.notification-form-container {
  padding: 0;
}

.selected-attachment {
  margin-bottom: 16px;
}

.selected-attachment .bg-gray-50 {
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
}

/* 新增知悉抽屜響應式 */
@media (max-width: 768px) {
  .notification-form-container {
    padding: 0 8px;
  }
}

/* 新增任務抽屜樣式 */
.create-task-form-container {
  padding: 0;
}

/* 新增任務抽屜響應式 */
@media (max-width: 768px) {
  .create-task-form-container {
    padding: 0 8px;
  }
}

/* 附件歷史版本抽屜樣式 */
.history-list {
  max-height: 500px;
  overflow-y: auto;
}

.history-item {
  transition: all 0.2s ease;
}

.history-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 附件歷史版本抽屜響應式 */
@media (max-width: 768px) {
  .history-list {
    max-height: 400px;
  }
}

/* 知悉詳情模態框樣式 */
.acknowledgment-detail-content {
  max-height: 70vh;
  overflow-y: auto;
}

.detail-item {
  margin-bottom: 12px;
}

.content-section {
  padding: 16px;
  background-color: #fafafa;
  border-radius: 6px;
  border: 1px solid #f0f0f0;
}

.attachment-item-simple {
  transition: all 0.2s ease;
}

.attachment-item-simple:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.comment-item-detail {
  padding: 12px;
  background-color: #fafafa;
  border-radius: 6px;
  border: 1px solid #f0f0f0;
}

.attachments-list .attachment-item {
  transition: all 0.2s ease;
}

.attachments-list .attachment-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.comments-list .comment-item {
  transition: all 0.2s ease;
}

/* 知悉詳情模態框響應式 */
@media (max-width: 768px) {
  .acknowledgment-detail-content {
    max-height: 60vh;
  }
  
  .detail-item {
    margin-bottom: 8px;
  }
  
  .attachments-list .flex {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .attachments-list .flex > div:last-child {
    margin-top: 8px;
    align-self: flex-end;
  }
}
</style>
