<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoute } from 'vue-router';
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
  Row,
  Space,
  Tag,
  Timeline,
  TimelineItem,
  Typography,
} from 'ant-design-vue';

const { Title, Text, Paragraph } = Typography;
const route = useRoute();

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

// 動態篩選
const activityFilter = reactive({
  member: 'all',
  type: 'all',
});

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
    task_created: 'lucide:plus-circle',
    status_changed: 'lucide:edit',
    member_joined: 'lucide:user-plus',
    project_created: 'lucide:folder-plus',
  };
  return iconMap[type] || 'lucide:circle';
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
          <Button type="primary">
            <span class="icon-[lucide--eye] size-4 mr-1" />
            概覽
          </Button>
        </div>
      </div>

      <!-- 主要內容區域 -->
      <Row :gutter="24">
        <!-- 左側主要內容 -->
        <Col :xs="24" :lg="16">
          <!-- 項目基本信息卡片 -->
          <Card class="mb-6" title="項目信息">
            <Row :gutter="16">
              <!-- 項目封面 -->
              <Col :span="8">
                <div class="project-cover">
                  <img
                    :src="projectInfo.cover"
                    :alt="projectInfo.name"
                    class="w-full h-32 object-cover rounded-lg border border-gray-200"
                  />
                </div>
              </Col>
              <!-- 項目詳情 -->
              <Col :span="16">
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
              <div v-for="member in projectMembers" :key="member.id" class="member-item flex items-center justify-between py-3">
                <div class="flex items-center space-x-3">
                  <Avatar :src="member.avatar" :size="40">
                    {{ member.name.charAt(0) }}
                  </Avatar>
                  <div>
                    <div class="font-medium">{{ member.name }}</div>
                    <div class="text-sm text-gray-500">{{ member.role }}</div>
                  </div>
                </div>
                <Tag :color="member.status === 'online' ? 'success' : 'default'">
                  {{ member.status === 'online' ? '在線' : '離線' }}
                </Tag>
              </div>
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
            <!-- 篩選器 -->
            <div class="activity-filters mb-4 space-y-2">
              <div>
                <Text type="secondary" class="text-sm">按成員篩選：</Text>
                <Button.Group class="ml-2">
                  <Button 
                    :type="activityFilter.member === 'all' ? 'primary' : 'default'"
                    size="small"
                    @click="activityFilter.member = 'all'"
                  >
                    全部
                  </Button>
                  <Button 
                    v-for="member in projectMembers"
                    :key="member.id"
                    :type="activityFilter.member === member.id ? 'primary' : 'default'"
                    size="small"
                    @click="activityFilter.member = member.id"
                  >
                    {{ member.name }}
                  </Button>
                </Button.Group>
              </div>
            </div>
            
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
                <span :class="`icon-[${getActivityIcon(activity.type)}] size-4 text-gray-400 mt-1`" />
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

.member-item {
  border-bottom: 1px solid #f0f0f0;
}

.member-item:last-child {
  border-bottom: none;
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

/* 響應式設計 */
@media (max-width: 768px) {
  .project-detail {
    padding: 0;
  }
  
  .project-details {
    margin-top: 16px;
  }
}
</style>