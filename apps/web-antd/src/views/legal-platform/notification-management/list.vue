<template>
  <div class="p-4">

    <!-- 搜索區域 -->
    <Card class="mb-6">
      <Form layout="inline" :model="searchForm" class="mb-4">
        <FormItem :label="$t('page.legalPlatform.notificationTitle')">
          <Input 
            v-model:value="searchForm.title" 
            :placeholder="$t('page.legalPlatform.notificationTitle')"
            class="w-48"
          />
        </FormItem>
        <FormItem :label="$t('page.legalPlatform.notificationStatus')">
          <Select 
            v-model:value="searchForm.status" 
            :placeholder="$t('page.legalPlatform.notificationStatus')"
            class="w-32"
            allowClear
          >
            <SelectOption value="sent">{{ $t('page.legalPlatform.sent') }}</SelectOption>
            <SelectOption value="pending">{{ $t('page.legalPlatform.pending') }}</SelectOption>
            <SelectOption value="confirmed">{{ $t('page.legalPlatform.confirmed') }}</SelectOption>
            <SelectOption value="unconfirmed">{{ $t('page.legalPlatform.unconfirmed') }}</SelectOption>
            <SelectOption value="draft">{{ $t('page.legalPlatform.draft') }}</SelectOption>
          </Select>
        </FormItem>
        <FormItem :label="$t('page.legalPlatform.notificationRecipient')">
          <Select 
            v-model:value="searchForm.recipient" 
            :placeholder="$t('page.legalPlatform.notificationRecipient')"
            class="w-32"
            allowClear
          >
            <SelectOption value="director">{{ $t('page.legalPlatform.director') }}</SelectOption>
            <SelectOption value="supervisor">{{ $t('page.legalPlatform.allSupervisors') }}</SelectOption>
            <SelectOption value="secretary">{{ $t('page.legalPlatform.supervisorSecretary') }}</SelectOption>
            <SelectOption value="other">{{ $t('page.legalPlatform.otherPersonnel') }}</SelectOption>
          </Select>
        </FormItem>
        <FormItem :label="$t('page.legalPlatform.startDate')">
          <DatePicker 
            v-model:value="searchForm.startDate" 
            :placeholder="$t('page.legalPlatform.startDate')"
            class="w-40"
          />
        </FormItem>
        <FormItem :label="$t('page.legalPlatform.endDate')">
          <DatePicker 
            v-model:value="searchForm.endDate" 
            :placeholder="$t('page.legalPlatform.endDate')"
            class="w-40"
          />
        </FormItem>
        <FormItem>
          <Space>
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
      </Form>
    </Card>

    <!-- 操作按鈕 -->
    <div class="mb-4 flex justify-between items-center">
      <Space>
        <Button type="primary" @click="handleCreate">
          <template #icon>
            <span class="icon-[lucide--plus] size-4" />
          </template>
          {{ $t('page.legalPlatform.createNotification') }}
        </Button>
        <Button @click="handleBatchMarkRead" :disabled="selectedRowKeys.length === 0">
          <template #icon>
            <span class="icon-[lucide--check] size-4" />
          </template>
          {{ $t('page.legalPlatform.markAsRead') }}
        </Button>
      </Space>
    </div>

    <!-- 知悉列表 -->
    <Card>
      <Table 
        :columns="columns" 
        :data-source="notificationData" 
        :pagination="pagination"
        :row-selection="{ selectedRowKeys, onChange: onSelectChange }"
        :loading="loading"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <Tag :color="getStatusColor(record.status)">
              {{ getStatusText(record.status) }}
            </Tag>
          </template>
          <template v-else-if="column.key === 'operation'">
            <Space>
              <Button type="link" size="small" @click="handleView(record)">
                <template #icon>
                  <span class="icon-[lucide--eye] size-4" />
                </template>
                {{ $t('page.legalPlatform.detail') }}
              </Button>
              <Button type="link" size="small" @click="handleReply(record)" v-if="record.status === 'sent'">
                <template #icon>
                  <span class="icon-[lucide--reply] size-4" />
                </template>
                {{ $t('page.legalPlatform.notificationReply') }}
              </Button>
              <Button type="link" size="small" @click="handleForward(record)" v-if="record.status === 'sent'">
                <template #icon>
                  <span class="icon-[lucide--forward] size-4" />
                </template>
                {{ $t('page.legalPlatform.notificationForward') }}
              </Button>
              <Button type="link" size="small" @click="handleConfirm(record)" v-if="record.status === 'sent'">
                <template #icon>
                  <span class="icon-[lucide--check-circle] size-4" />
                </template>
                {{ $t('page.legalPlatform.confirmNotification') }}
              </Button>
              <Button type="link" size="small" danger @click="handleDelete(record)" v-if="record.status === 'draft'">
                <template #icon>
                  <span class="icon-[lucide--trash-2] size-4" />
                </template>
                {{ $t('page.legalPlatform.delete') }}
              </Button>
            </Space>
          </template>
        </template>
      </Table>
    </Card>

    <!-- 新增知悉抽屜 -->
    <Drawer
      v-model:open="createDrawerVisible"
      :title="$t('page.legalPlatform.createNotification')"
      placement="right"
      :width="600"
      @close="handleCreateCancel"
    >
      <Form :model="createForm" layout="vertical">
        <FormItem :label="$t('page.legalPlatform.notificationTitle')" required>
          <Input
            v-model:value="createForm.title"
            :placeholder="$t('page.legalPlatform.notificationTitle')"
          />
        </FormItem>
        <FormItem :label="$t('page.legalPlatform.notificationContent')" required>
          <TextArea
            v-model:value="createForm.content"
            :placeholder="$t('page.legalPlatform.notificationContent')"
            :rows="6"
          />
        </FormItem>
        <FormItem :label="$t('page.legalPlatform.notificationRecipient')" required>
          <Select
            v-model:value="createForm.recipients"
            mode="multiple"
            :placeholder="$t('page.legalPlatform.selectRecipient')"
            style="width: 100%"
          >
            <SelectOption value="director">{{ $t('page.legalPlatform.director') }}</SelectOption>
            <SelectOption value="supervisor">{{ $t('page.legalPlatform.allSupervisors') }}</SelectOption>
            <SelectOption value="secretary">{{ $t('page.legalPlatform.supervisorSecretary') }}</SelectOption>
            <SelectOption value="other">{{ $t('page.legalPlatform.otherPersonnel') }}</SelectOption>
          </Select>
        </FormItem>
        <FormItem :label="$t('page.legalPlatform.notificationRemarks')">
          <TextArea
            v-model:value="createForm.remarks"
            :placeholder="$t('page.legalPlatform.notificationRemarks')"
            :rows="3"
          />
        </FormItem>
      </Form>
      <template #footer>
        <Space>
          <Button @click="handleCreateCancel">{{ $t('page.legalPlatform.cancel') }}</Button>
          <Button type="primary" @click="handleCreateSubmit">{{ $t('page.legalPlatform.submit') }}</Button>
        </Space>
      </template>
    </Drawer>

    <!-- 回復抽屜 -->
    <Drawer
      v-model:open="replyDrawerVisible"
      :title="$t('page.legalPlatform.replyNotification')"
      placement="right"
      :width="600"
      @close="handleReplyCancel"
    >
      <Form :model="replyForm" layout="vertical">
        <FormItem :label="$t('page.legalPlatform.replyContent')" required>
          <TextArea
            v-model:value="replyForm.content"
            :placeholder="$t('page.legalPlatform.replyContent')"
            :rows="6"
          />
        </FormItem>
      </Form>
      <template #footer>
        <Space>
          <Button @click="handleReplyCancel">{{ $t('page.legalPlatform.cancel') }}</Button>
          <Button type="primary" @click="handleReplySubmit">{{ $t('page.legalPlatform.submit') }}</Button>
        </Space>
      </template>
    </Drawer>

    <!-- 轉發抽屜 -->
    <Drawer
      v-model:open="forwardDrawerVisible"
      :title="$t('page.legalPlatform.forwardNotification')"
      placement="right"
      :width="600"
      @close="handleForwardCancel"
    >
      <Form :model="forwardForm" layout="vertical">
        <FormItem :label="$t('page.legalPlatform.forwardTo')" required>
          <Select
            v-model:value="forwardForm.recipients"
            mode="multiple"
            :placeholder="$t('page.legalPlatform.selectRecipient')"
            style="width: 100%"
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
            :placeholder="$t('page.legalPlatform.notificationRemarks')"
            :rows="3"
          />
        </FormItem>
      </Form>
      <template #footer>
        <Space>
          <Button @click="handleForwardCancel">{{ $t('page.legalPlatform.cancel') }}</Button>
          <Button type="primary" @click="handleForwardSubmit">{{ $t('page.legalPlatform.submit') }}</Button>
        </Space>
      </template>
    </Drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { 
  Card, 
  Form, 
  FormItem, 
  Input, 
  Select, 
  SelectOption, 
  DatePicker, 
  Button, 
  Space, 
  Table, 
  Tag, 
  Modal, 
  Drawer,
  message 
} from 'ant-design-vue';

const { TextArea } = Input;
import { useI18n } from '#/locales';

const { t: $t } = useI18n();
const router = useRouter();

// 響應式數據
const loading = ref(false);
const selectedRowKeys = ref<string[]>([]);
const createDrawerVisible = ref(false);
const replyDrawerVisible = ref(false);
const forwardDrawerVisible = ref(false);
const currentRecord = ref<any>(null);



// 搜索表單
const searchForm = reactive({
  title: '',
  status: undefined,
  recipient: undefined,
  startDate: undefined,
  endDate: undefined
});

// 新增知悉表單
const createForm = reactive({
  title: '',
  content: '',
  recipients: [],
  remarks: ''
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

// 分頁配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 156,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number, range: [number, number]) => 
    `第 ${range[0]}-${range[1]} 條，共 ${total} 條`
});

// 模擬知悉數據
const notificationData = ref([
  {
    id: '1',
    title: '關於法案審議進度的知悉通知',
    content: '請各相關人員知悉當前法案審議進度情況...',
    status: 'sent',
    sender: '張主管',
    recipient: '局長',
    createTime: '2024-01-15 10:30:00',
    hasAttachment: true,
    priority: 'high'
  },
  {
    id: '2',
    title: '項目進度更新通知',
    content: '項目A已完成第一階段工作，請知悉...',
    status: 'confirmed',
    sender: '李秘書',
    recipient: '全部主管',
    createTime: '2024-01-14 15:20:00',
    hasAttachment: false,
    priority: 'medium'
  },
  {
    id: '3',
    title: '會議紀要知悉',
    content: '本週例會紀要已整理完成，請各位知悉...',
    status: 'pending',
    sender: '王助理',
    recipient: '主管秘書',
    createTime: '2024-01-13 09:15:00',
    hasAttachment: true,
    priority: 'low'
  },
  {
    id: '4',
    title: '緊急事項通知草稿',
    content: '關於緊急事項的處理方案...',
    status: 'draft',
    sender: '陳專員',
    recipient: '',
    createTime: '2024-01-12 16:45:00',
    hasAttachment: false,
    priority: 'high'
  }
]);

// 表格列配置
const columns = computed(() => [
  {
    title: $t('page.legalPlatform.notificationTitle'),
    dataIndex: 'title',
    key: 'title',
    width: 200,
    ellipsis: true
  },
  {
    title: $t('page.legalPlatform.notificationStatus'),
    dataIndex: 'status',
    key: 'status',
    width: 100
  },
  {
    title: $t('page.legalPlatform.notificationSender'),
    dataIndex: 'sender',
    key: 'sender',
    width: 100
  },
  {
    title: $t('page.legalPlatform.notificationRecipient'),
    dataIndex: 'recipient',
    key: 'recipient',
    width: 120
  },
  {    title: $t('page.legalPlatform.createTime'),    dataIndex: 'createTime',    key: 'createTime',    width: 150  },  {    title: $t('page.legalPlatform.operation'),    key: 'operation',    width: 300,    fixed: 'right'  }
]);

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

// 事件處理函數
const handleSearch = () => {
  console.log('搜索:', searchForm);
  // 實際項目中這裡會調用API
};

const handleReset = () => {
  Object.assign(searchForm, {
    title: '',
    status: undefined,
    recipient: undefined,
    startDate: undefined,
    endDate: undefined
  });
  handleSearch();
};

const handleCreate = () => {
  createForm.title = '';
  createForm.content = '';
  createForm.recipients = [];
  createForm.remarks = '';
  createDrawerVisible.value = true;
};

const handleCreateSubmit = () => {
  if (!createForm.title.trim()) {
    message.error('請輸入知悉標題');
    return;
  }
  if (!createForm.content.trim()) {
    message.error('請輸入知悉內容');
    return;
  }
  if (createForm.recipients.length === 0) {
    message.error('請選擇收件人');
    return;
  }
  // 實際項目中這裡會調用API
  message.success($t('page.legalPlatform.notificationSent'));
  createDrawerVisible.value = false;
};

const handleCreateCancel = () => {
  createDrawerVisible.value = false;
};



const handleView = (record: any) => {
  router.push(`/legal-platform/notification-management/detail/${record.id}`);
};

const handleReply = (record: any) => {
  currentRecord.value = record;
  replyForm.content = '';
  replyDrawerVisible.value = true;
};

const handleForward = (record: any) => {
  currentRecord.value = record;
  forwardForm.recipients = [];
  forwardForm.remarks = '';
  forwardDrawerVisible.value = true;
};

const handleConfirm = (record: any) => {
  Modal.confirm({
    title: $t('page.legalPlatform.confirmNotification'),
    content: `確定要確認知悉「${record.title}」嗎？`,
    onOk() {
      // 實際項目中這裡會調用API
      record.status = 'confirmed';
      message.success($t('page.legalPlatform.notificationConfirmed'));
    }
  });
};

const handleDelete = (record: any) => {
  Modal.confirm({
    title: $t('page.legalPlatform.delete'),
    content: `確定要刪除「${record.title}」嗎？`,
    onOk() {
      // 實際項目中這裡會調用API
      const index = notificationData.value.findIndex(item => item.id === record.id);
      if (index > -1) {
        notificationData.value.splice(index, 1);
      }
      message.success($t('page.legalPlatform.deleteSuccess'));
    }
  });
};

const handleBatchMarkRead = () => {
  // 實際項目中這裡會調用API
  selectedRowKeys.value.forEach(id => {
    const record = notificationData.value.find(item => item.id === id);
    if (record && record.status === 'sent') {
      record.status = 'confirmed';
    }
  });
  selectedRowKeys.value = [];
  message.success($t('page.legalPlatform.markAsRead'));
};

const handleReplySubmit = () => {
  if (!replyForm.content.trim()) {
    message.error('請輸入回復內容');
    return;
  }
  // 實際項目中這裡會調用API
  message.success($t('page.legalPlatform.notificationReplied'));
  replyDrawerVisible.value = false;
};

const handleReplyCancel = () => {
  replyDrawerVisible.value = false;
};

const handleForwardSubmit = () => {
  if (forwardForm.recipients.length === 0) {
    message.error('請選擇轉發對象');
    return;
  }
  // 實際項目中這裡會調用API
  message.success($t('page.legalPlatform.notificationForwarded'));
  forwardDrawerVisible.value = false;
};

const handleForwardCancel = () => {
  forwardDrawerVisible.value = false;
};

const onSelectChange = (newSelectedRowKeys: string[]) => {
  selectedRowKeys.value = newSelectedRowKeys;
};

const handleTableChange = (pag: any) => {
  pagination.current = pag.current;
  pagination.pageSize = pag.pageSize;
  // 實際項目中這裡會重新獲取數據
};

// 組件掛載時獲取數據
onMounted(() => {
  // 實際項目中這裡會調用API獲取數據
});
</script>

<style scoped>
.ant-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.ant-table {
  border-radius: 8px;
}

.ant-btn {
  border-radius: 6px;
}

.ant-input, .ant-select-selector {
  border-radius: 6px;
}
</style>
