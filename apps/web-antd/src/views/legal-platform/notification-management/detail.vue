<template>
  <div class="p-4">
    <!-- 頁面標題 -->
    <div class="mb-6">
      <Button @click="handleBack" class="mb-4">
        <template #icon>
          <span class="icon-[lucide--arrow-left] size-4" />
        </template>
        {{ $t('page.legalPlatform.back') }}
      </Button>
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold">{{ $t('page.legalPlatform.notificationDetail') }}</h1>
        <Space>
          <Button type="primary" @click="handleConfirm" v-if="notification.status === 'sent'">
            <template #icon>
              <span class="icon-[lucide--check-circle] size-4" />
            </template>
            {{ $t('page.legalPlatform.confirmNotification') }}
          </Button>
          <Button @click="handleReply" v-if="notification.status === 'sent'">
            <template #icon>
              <span class="icon-[lucide--reply] size-4" />
            </template>
            {{ $t('page.legalPlatform.notificationReply') }}
          </Button>
          <Button @click="handleForward" v-if="notification.status === 'sent'">
            <template #icon>
              <span class="icon-[lucide--forward] size-4" />
            </template>
            {{ $t('page.legalPlatform.notificationForward') }}
          </Button>
        </Space>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 主要內容區域 -->
      <div class="lg:col-span-2 space-y-6">
        <!-- 知悉基本信息 -->
        <Card>
          <div class="space-y-4">
            <!-- 標題和狀態 -->
            <div class="flex justify-between items-start">
              <h2 class="text-xl font-semibold text-gray-900">{{ notification.title }}</h2>
              <Tag :color="getStatusColor(notification.status)" class="ml-4">
                {{ getStatusText(notification.status) }}
              </Tag>
            </div>
            
            <!-- 基本信息 -->
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-gray-500">{{ $t('page.legalPlatform.notificationSender') }}：</span>
                <span class="font-medium">{{ notification.sender }}</span>
              </div>
              <div>
                <span class="text-gray-500">{{ $t('page.legalPlatform.notificationRecipient') }}：</span>
                <span class="font-medium">{{ notification.recipient }}</span>
              </div>
              <div>
                <span class="text-gray-500">{{ $t('page.legalPlatform.createTime') }}：</span>
                <span class="font-medium">{{ notification.createTime }}</span>
              </div>
              <div>
                <span class="text-gray-500">{{ $t('page.legalPlatform.priority') }}：</span>
                <Tag :color="getPriorityColor(notification.priority)">
                  {{ getPriorityText(notification.priority) }}
                </Tag>
              </div>
            </div>
          </div>
        </Card>

        <!-- 知悉內容 -->
        <Card>
          <div class="font-semibold mb-4">{{ $t('page.legalPlatform.notificationContent') }}</div>
          <div class="prose max-w-none">
            <div class="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {{ notification.content }}
            </div>
          </div>
        </Card>

        <!-- 附件 -->
        <Card v-if="notification.attachments && notification.attachments.length > 0">
          <div class="font-semibold mb-4">{{ $t('page.legalPlatform.notificationAttachment') }}</div>
          <div class="space-y-2">
            <div 
              v-for="attachment in notification.attachments" 
              :key="attachment.id"
              class="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div class="flex items-center space-x-3">
                <span class="icon-[lucide--file] size-5 text-gray-500" />
                <div>
                  <div class="font-medium">{{ attachment.name }}</div>
                  <div class="text-sm text-gray-500">{{ attachment.size }}</div>
                </div>
              </div>
              <Button type="link" @click="handleDownload(attachment)">
                <template #icon>
                  <span class="icon-[lucide--download] size-4" />
                </template>
                下載
              </Button>
            </div>
          </div>
        </Card>

        <!-- 回復記錄 -->
        <Card v-if="notification.replies && notification.replies.length > 0">
          <div class="font-semibold mb-4">回復記錄</div>
          <div class="space-y-4">
            <div 
              v-for="reply in notification.replies" 
              :key="reply.id"
              class="border-l-4 border-blue-500 pl-4 py-2"
            >
              <div class="flex justify-between items-center mb-2">
                <span class="font-medium text-gray-900">{{ reply.sender }}</span>
                <span class="text-sm text-gray-500">{{ reply.createTime }}</span>
              </div>
              <div class="text-gray-700">{{ reply.content }}</div>
            </div>
          </div>
        </Card>
      </div>

      <!-- 側邊欄 -->
      <div class="space-y-6">
        <!-- 操作歷史 -->
        <Card>
          <div class="font-semibold mb-4">操作歷史</div>
          <div class="space-y-3">
            <div 
              v-for="history in notification.history" 
              :key="history.id"
              class="flex items-start space-x-3"
            >
              <div class="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div class="flex-1">
                <div class="text-sm font-medium">{{ history.action }}</div>
                <div class="text-xs text-gray-500">{{ history.operator }}</div>
                <div class="text-xs text-gray-400">{{ history.time }}</div>
              </div>
            </div>
          </div>
        </Card>

        <!-- 關聯項目 -->
        <Card v-if="notification.relatedProject">
          <div class="font-semibold mb-4">關聯項目</div>
          <div class="p-3 border border-gray-200 rounded-lg">
            <div class="font-medium text-blue-600 cursor-pointer hover:underline" @click="handleViewProject">
              {{ notification.relatedProject.name }}
            </div>
            <div class="text-sm text-gray-500 mt-1">{{ notification.relatedProject.description }}</div>
          </div>
        </Card>


      </div>
    </div>

    <!-- 回復彈窗 -->
    <Modal 
      v-model:open="replyModalVisible" 
      :title="$t('page.legalPlatform.replyNotification')"
      @ok="handleReplySubmit"
      @cancel="handleReplyCancel"
      width="600px"
    >
      <Form :model="replyForm" layout="vertical">
        <FormItem :label="$t('page.legalPlatform.replyContent')" required>
          <TextArea 
            v-model:value="replyForm.content" 
            :rows="6" 
            :placeholder="$t('page.legalPlatform.replyContent')"
          />
        </FormItem>
      </Form>
    </Modal>

    <!-- 轉發彈窗 -->
    <Modal 
      v-model:open="forwardModalVisible" 
      :title="$t('page.legalPlatform.forwardNotification')"
      @ok="handleForwardSubmit"
      @cancel="handleForwardCancel"
      width="600px"
    >
      <Form :model="forwardForm" layout="vertical">
        <FormItem :label="$t('page.legalPlatform.forwardTo')" required>
          <Select 
            v-model:value="forwardForm.recipients" 
            mode="multiple"
            :placeholder="$t('page.legalPlatform.selectRecipient')"
          >
            <SelectOption value="director">{{ $t('page.legalPlatform.director') }}</SelectOption>
            <SelectOption value="supervisor">{{ $t('page.legalPlatform.allSupervisors') }}</SelectOption>
            <SelectOption value="secretary">{{ $t('page.legalPlatform.supervisorSecretary') }}</SelectOption>
            <SelectOption value="other">{{ $t('page.legalPlatform.otherPersonnel') }}</SelectOption>
          </Select>
        </FormItem>
        <FormItem :label="$t('page.legalPlatform.notificationRemarks')">
          <TextArea 
            v-model:value="forwardForm.remarks" 
            :rows="4" 
            :placeholder="$t('page.legalPlatform.notificationRemarks')"
          />
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { 
  Card, 
  Button, 
  Space, 
  Tag, 
  Modal, 
  Form, 
  FormItem, 
  Input, 
  Select, 
  SelectOption,
  message 
} from 'ant-design-vue';

const { TextArea } = Input;
import { useI18n } from '#/locales';

const { t: $t } = useI18n();
const router = useRouter();
const route = useRoute();

// 響應式數據
const replyModalVisible = ref(false);
const forwardModalVisible = ref(false);

// 知悉詳情數據
const notification = ref({
  id: '1',
  title: '關於法案審議進度的知悉通知',
  content: `各位同仁：\n\n茲就本次法案審議進度情況向各位知悉如下：\n\n一、審議進度\n目前法案已完成初審階段，正進入二審程序。預計於本月底前完成所有審議程序。\n\n二、主要修正內容\n1. 第三條條文用詞修正\n2. 第七條增列但書規定\n3. 第十二條刪除部分內容\n\n三、後續安排\n請各相關單位配合辦理相關準備工作，如有疑問請隨時聯繫。\n\n此致\n敬禮`,
  status: 'sent',
  sender: '張主管',
  recipient: '局長',
  createTime: '2024-01-15 10:30:00',
  priority: 'high',
  attachments: [
    {
      id: '1',
      name: '法案審議進度報告.pdf',
      size: '2.5 MB',
      url: '/files/report.pdf'
    },
    {
      id: '2',
      name: '修正條文對照表.docx',
      size: '1.2 MB',
      url: '/files/comparison.docx'
    }
  ],
  replies: [
    {
      id: '1',
      sender: '局長',
      content: '已知悉，請持續關注後續進展。',
      createTime: '2024-01-15 14:20:00'
    }
  ],
  history: [
    {
      id: '1',
      action: '知悉已發送',
      operator: '張主管',
      time: '2024-01-15 10:30:00'
    },
    {
      id: '2',
      action: '知悉已確認',
      operator: '局長',
      time: '2024-01-15 14:20:00'
    },
    {
      id: '3',
      action: '知悉已回復',
      operator: '局長',
      time: '2024-01-15 14:22:00'
    }
  ],
  relatedProject: {
    id: 'project1',
    name: '法案審議項目A',
    description: '關於某某法案的審議工作'
  }
});

// 回復表單
const replyForm = reactive({
  content: ''
});

// 轉發表單
const forwardForm = reactive({
  recipients: [],
  remarks: ''
});

// 狀態顏色映射
const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    sent: 'blue',
    pending: 'orange',
    confirmed: 'green',
    unconfirmed: 'red',
    draft: 'gray'
  };
  return colorMap[status] || 'default';
};

// 狀態文本映射
const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    sent: $t('page.legalPlatform.sent'),
    pending: $t('page.legalPlatform.pending'),
    confirmed: $t('page.legalPlatform.confirmed'),
    unconfirmed: $t('page.legalPlatform.unconfirmed'),
    draft: $t('page.legalPlatform.draft')
  };
  return textMap[status] || status;
};

// 優先級顏色映射
const getPriorityColor = (priority: string) => {
  const colorMap: Record<string, string> = {
    high: 'red',
    medium: 'orange',
    low: 'green'
  };
  return colorMap[priority] || 'default';
};

// 優先級文本映射
const getPriorityText = (priority: string) => {
  const textMap: Record<string, string> = {
    high: $t('page.legalPlatform.high'),
    medium: $t('page.legalPlatform.medium'),
    low: $t('page.legalPlatform.low')
  };
  return textMap[priority] || priority;
};

// 事件處理函數
const handleBack = () => {
  router.back();
};

const handleConfirm = () => {
  Modal.confirm({
    title: $t('page.legalPlatform.confirmNotification'),
    content: `確定要確認知悉「${notification.value.title}」嗎？`,
    onOk() {
      notification.value.status = 'confirmed';
      notification.value.history.push({
        id: Date.now().toString(),
        action: '知悉已確認',
        operator: '當前用戶',
        time: new Date().toLocaleString()
      });
      message.success($t('page.legalPlatform.notificationConfirmed'));
    }
  });
};

const handleReply = () => {
  replyForm.content = '';
  replyModalVisible.value = true;
};

const handleForward = () => {
  forwardForm.recipients = [];
  forwardForm.remarks = '';
  forwardModalVisible.value = true;
};

const handleDownload = (attachment: any) => {
  // 實際項目中這裡會處理文件下載
  message.info(`下載文件：${attachment.name}`);
};

const handleViewProject = () => {
  router.push(`/legal-platform/project-management/detail/${notification.value.relatedProject.id}`);
};

const handleReplySubmit = () => {
  if (!replyForm.content.trim()) {
    message.error('請輸入回復內容');
    return;
  }
  
  // 添加回復記錄
  notification.value.replies.push({
    id: Date.now().toString(),
    sender: '當前用戶',
    content: replyForm.content,
    createTime: new Date().toLocaleString()
  });
  
  // 添加歷史記錄
  notification.value.history.push({
    id: Date.now().toString(),
    action: '知悉已回復',
    operator: '當前用戶',
    time: new Date().toLocaleString()
  });
  
  message.success($t('page.legalPlatform.notificationReplied'));
  replyModalVisible.value = false;
};

const handleReplyCancel = () => {
  replyModalVisible.value = false;
};

const handleForwardSubmit = () => {
  if (forwardForm.recipients.length === 0) {
    message.error('請選擇轉發對象');
    return;
  }
  
  // 添加歷史記錄
  notification.value.history.push({
    id: Date.now().toString(),
    action: '知悉已轉發',
    operator: '當前用戶',
    time: new Date().toLocaleString()
  });
  
  message.success($t('page.legalPlatform.notificationForwarded'));
  forwardModalVisible.value = false;
};

const handleForwardCancel = () => {
  forwardModalVisible.value = false;
};

// 組件掛載時獲取數據
onMounted(() => {
  const id = route.params.id;
  // 實際項目中這裡會根據ID調用API獲取知悉詳情
  console.log('獲取知悉詳情:', id);
});
</script>

<style scoped>
.ant-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.ant-btn {
  border-radius: 6px;
}

.prose {
  max-width: none;
}

.prose p {
  margin-bottom: 1em;
}

.prose ul, .prose ol {
  margin: 1em 0;
  padding-left: 1.5em;
}

.prose li {
  margin-bottom: 0.5em;
}
</style>
