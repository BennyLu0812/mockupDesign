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
  Col,
  Divider,
  Empty,
  Input,
  Modal,
  Popconfirm,
  Row,
  Space,
  Tag,
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
  status: '進行中',
  creator: '陳大文',
  createTime: '2024-01-15 10:30:00',
  startTime: '2024-01-15',
  endTime: '2024-03-15',
  dueTime: '2024-03-10',
  description: '本項目旨在對新修訂的法律條文進行全面審查，確保條文的合法性、合理性和可操作性。項目將涉及多個法律領域的專業知識，需要團隊成員密切配合。',
  cover: '/api/placeholder/300/200',
  visibility: '公開',
});

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
    name: '張三',
    role: '法律顧問',
    avatar: '/api/placeholder/40/40',
    status: 'offline',
  },
  {
    id: '3',
    name: '李四',
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
    comments: [
      {
        id: '1',
        user: '張三',
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
    uploader: '李四',
    tags: ['參考資料'],
    remark: '收集的相關法律參考資料',
    url: '/api/files/references.docx',
    comments: [],
  },
  {
    id: '3',
    name: '項目進度圖表.xlsx',
    type: 'xlsx',
    size: '856KB',
    uploadTime: '2024-01-19 09:15:00',
    uploader: '張三',
    tags: ['進度管理', '圖表'],
    remark: '項目各階段進度統計',
    url: '/api/files/progress.xlsx',
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
    user: '張三',
    content: '將項目狀態更改為「進行中」',
    time: '2024-01-19 16:45:00',
    avatar: '/api/placeholder/32/32',
  },
  {
    id: '3',
    type: 'member_joined',
    user: '李四',
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
    assignee: '張三',
    status: 'acknowledged',
    time: '2024-01-20 10:30:00',
  },
  {
    id: '2',
    taskName: '法條第二章審查',
    assignee: '李四',
    status: 'pending',
    time: '2024-01-19 15:20:00',
  },
  {
    id: '3',
    taskName: '專家意見整理',
    assignee: '陳大文',
    status: 'acknowledged',
    time: '2024-01-18 11:45:00',
  },
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

// 處理角色管理
const handleRoleManagement = () => {
  router.push({
    path: '/legal-platform/project-management/role-management',
    query: { projectId: projectInfo.id }
  });
};

// 附件相關處理函數
// 上傳附件
const handleUploadAttachment = () => {
  console.log('上傳附件功能待實現');
  message.info('上傳附件功能待實現');
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
    inProgress: '進行中',
    pending: '待處理',
    acknowledged: '已知悉',
  };
  return textMap[status] || status;
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
  const iconName = getActivityIcon(type);
  return 'icon-[' + iconName + '] size-4 text-gray-400 mt-1';
};

onMounted(() => {
  // 這裡可以根據路由參數加載具體的項目數據
  console.log('項目詳情頁面加載，項目ID:', route.params.id);
});
</script>

<template>
  <Page :title="$t('page.legalPlatform.projectDetail')">
    <div class="project-detail">
      <!-- 頁面標題 -->
      <div class="mb-6">
        <div class="flex items-center justify-between">
          <div>
            <Title :level="2" class="!mb-2">
              {{ projectInfo.name }}
            </Title>
            <Space>
              <Tag :color="getStatusColor(projectInfo.status)">
                {{ getStatusText(projectInfo.status) }}
              </Tag>
              <Tag color="default">
                {{ projectInfo.visibility }}
              </Tag>
            </Space>
          </div>
          <Space>
            <Button @click="handleRoleManagement">
              <span class="icon-[lucide--users] size-4 mr-1" />
              角色管理
            </Button>
            <Button type="primary">
              <span class="icon-[lucide--eye] size-4 mr-1" />
              概覽
            </Button>
          </Space>
        </div>
      </div>

      <!-- 主要內容區域 -->
      <Row :gutter="24">
        <!-- 左側主要內容 -->
        <Col :xs="24" :lg="16">
          <!-- 項目基本信息卡片 -->
          <Card class="mb-6" title="項目信息">
            <Row :gutter="16">
              <!-- 項目詳情 -->
              <Col :span="24">
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
              <Paragraph class="!mt-2">
                {{ projectInfo.description }}
              </Paragraph>
            </div>
          </Card>

          <!-- 成員卡片 -->
          <Card class="mb-6">
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
              <Row :gutter="[12, 12]">
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

          <!-- 里程碑卡片 -->
          <Card>
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
                      <Text strong>{{ milestone.title }}</Text>
                      <Text type="secondary" class="text-sm">{{ milestone.date }}</Text>
                    </div>
                    <Text type="secondary" class="text-sm">{{ milestone.description }}</Text>
                  </div>
                </TimelineItem>
              </Timeline>
            </div>
            <Empty v-else description="暫無里程碑數據" />
          </Card>

          <!-- 項目附件卡片 -->
          <Card class="mb-6">
            <template #title>
              <div class="flex items-center justify-between">
                <span>項目附件</span>
                <Button type="primary" size="small" @click="handleUploadAttachment">
                  <span class="icon-[lucide--upload] size-4 mr-1" />
                  上傳附件
                </Button>
              </div>
            </template>
            <div v-if="attachments.length > 0" class="attachments-list space-y-3">
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
                    <div class="flex items-center space-x-4 text-xs text-gray-500 mb-2">
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
                    <div v-if="attachment.remark" class="text-xs text-gray-600 mb-2">
                      <Text type="secondary">備註：{{ attachment.remark }}</Text>
                    </div>
                    
                    <!-- 評論區域 -->
                    <div v-if="attachment.comments && attachment.comments.length > 0" class="comments-section">
                      <Divider class="!my-2" />
                      <div class="space-y-2">
                        <div v-for="comment in attachment.comments" :key="comment.id" class="comment-item">
                          <div class="flex items-start space-x-2">
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
                              <div v-if="comment.replies && comment.replies.length > 0" class="ml-4 mt-2 space-y-1">
                                <div v-for="reply in comment.replies" :key="reply.id" class="reply-item">
                                  <div class="flex items-start space-x-2">
                                    <Avatar :src="reply.avatar" :size="16">
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
                              
                              <Button type="link" size="small" class="text-xs p-0 h-auto mt-1" @click="handleReplyComment(attachment, comment)">
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
          <Card title="知悉">
            <div class="acknowledgments-list space-y-3">
              <div v-for="ack in acknowledgments" :key="ack.id" class="ack-item">
                <div class="flex items-center justify-between mb-1">
                  <Text strong class="text-sm">{{ ack.taskName }}</Text>
                  <Tag :color="getStatusColor(ack.status)" size="small">
                    {{ getStatusText(ack.status) }}
                  </Tag>
                </div>
                <div class="flex items-center justify-between">
                  <Text type="secondary" class="text-xs">負責人：{{ ack.assignee }}</Text>
                  <Text type="secondary" class="text-xs">{{ ack.time }}</Text>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  </Page>
</template>

<style scoped>
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
}
</style>