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
      <h1 class="text-2xl font-bold">{{ $t('page.legalPlatform.createNotification') }}</h1>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 主要內容區域 -->
      <div class="lg:col-span-2">
        <Card>
          <Form :model="notificationForm" layout="vertical" :rules="rules" ref="formRef">
            <!-- 知悉標題 -->
            <FormItem :label="$t('page.legalPlatform.notificationTitle')" name="title" required>
              <Input 
                v-model:value="notificationForm.title" 
                :placeholder="$t('page.legalPlatform.notificationTitle')"
                size="large"
              />
            </FormItem>

            <!-- 知悉內容 -->
            <FormItem :label="$t('page.legalPlatform.notificationContent')" name="content" required>
              <div class="border border-gray-300 rounded-lg">
                <!-- 工具欄 -->
                <div class="border-b border-gray-200 p-2 flex flex-wrap gap-2">
                  <Button size="small" @click="insertFormat('bold')">
                    <span class="icon-[lucide--bold] size-4" />
                  </Button>
                  <Button size="small" @click="insertFormat('italic')">
                    <span class="icon-[lucide--italic] size-4" />
                  </Button>
                  <Button size="small" @click="insertFormat('underline')">
                    <span class="icon-[lucide--underline] size-4" />
                  </Button>
                  <Divider type="vertical" />
                  <Button size="small" @click="insertFormat('list')">
                    <span class="icon-[lucide--list] size-4" />
                  </Button>
                  <Button size="small" @click="insertFormat('ordered-list')">
                    <span class="icon-[lucide--list-ordered] size-4" />
                  </Button>
                  <Divider type="vertical" />
                  <Button size="small" @click="insertFormat('link')">
                    <span class="icon-[lucide--link] size-4" />
                  </Button>
                </div>
                <!-- 編輯區域 -->
                <TextArea 
                  v-model:value="notificationForm.content" 
                  :placeholder="$t('page.legalPlatform.notificationContent')"
                  :rows="12"
                  class="border-0 resize-none"
                  style="box-shadow: none;"
                />
              </div>
            </FormItem>

            <!-- 附件上傳 -->
            <FormItem :label="$t('page.legalPlatform.notificationAttachment')">
              <div class="space-y-4">
                <!-- 項目附件選擇 -->
                <div>
                  <div class="mb-2 text-sm text-gray-600">{{ $t('page.legalPlatform.selectProjectAttachment') }}</div>
                  <Select 
                    v-model:value="notificationForm.projectAttachments" 
                    mode="multiple"
                    :placeholder="$t('page.legalPlatform.selectProjectAttachment')"
                    class="w-full"
                  >
                    <SelectOption value="doc1">項目計劃書.docx</SelectOption>
                    <SelectOption value="doc2">會議紀要.pdf</SelectOption>
                    <SelectOption value="doc3">法案草案.docx</SelectOption>
                    <SelectOption value="doc4">預算報告.xlsx</SelectOption>
                  </Select>
                </div>
                
                <!-- 文件上傳 -->
                <div>
                  <div class="mb-2 text-sm text-gray-600">{{ $t('page.legalPlatform.uploadFile') }}</div>
                  <Upload 
                    v-model:file-list="notificationForm.attachments"
                    :before-upload="beforeUpload"
                    multiple
                    class="w-full"
                  >
                    <Button>
                      <template #icon>
                        <span class="icon-[lucide--upload] size-4" />
                      </template>
                      {{ $t('page.legalPlatform.uploadFile') }}
                    </Button>
                  </Upload>
                </div>
              </div>
            </FormItem>
          </Form>
        </Card>
      </div>

      <!-- 側邊欄 -->
      <div class="space-y-6">
        <!-- 基礎設置 -->
        <Card>
          <div class="font-semibold mb-4">基礎設置</div>
          
          <!-- 收件人類型 -->
          <FormItem :label="$t('page.legalPlatform.notificationRecipient')" class="mb-4">
            <Select 
              v-model:value="notificationForm.recipientType" 
              :placeholder="$t('page.legalPlatform.selectRecipient')"
              @change="handleRecipientTypeChange"
            >
              <SelectOption value="role">{{ $t('page.legalPlatform.roleNotification') }}</SelectOption>
              <SelectOption value="workgroup">{{ $t('page.legalPlatform.workGroupNotification') }}</SelectOption>
              <SelectOption value="all">{{ $t('page.legalPlatform.allParticipantsNotification') }}</SelectOption>
              <SelectOption value="specific">指定人員</SelectOption>
            </Select>
          </FormItem>

          <!-- 具體收件人 -->
          <FormItem :label="$t('page.legalPlatform.selectRecipient')" v-if="notificationForm.recipientType">
            <Select 
              v-model:value="notificationForm.recipients" 
              mode="multiple"
              :placeholder="$t('page.legalPlatform.selectRecipient')"
            >
              <template v-if="notificationForm.recipientType === 'role'">
                <SelectOption value="director">{{ $t('page.legalPlatform.director') }}</SelectOption>
                <SelectOption value="supervisor">{{ $t('page.legalPlatform.allSupervisors') }}</SelectOption>
                <SelectOption value="secretary">{{ $t('page.legalPlatform.supervisorSecretary') }}</SelectOption>
              </template>
              <template v-else-if="notificationForm.recipientType === 'workgroup'">
                <SelectOption value="legal-team">法務組</SelectOption>
                <SelectOption value="admin-team">行政組</SelectOption>
                <SelectOption value="research-team">研究組</SelectOption>
              </template>
              <template v-else-if="notificationForm.recipientType === 'all'">
                <SelectOption value="all-participants">所有項目參與人</SelectOption>
              </template>
              <template v-else>
                <SelectOption value="user1">張主管</SelectOption>
                <SelectOption value="user2">李秘書</SelectOption>
                <SelectOption value="user3">王助理</SelectOption>
                <SelectOption value="user4">陳專員</SelectOption>
              </template>
            </Select>
          </FormItem>

          <!-- 優先級 -->
          <FormItem :label="$t('page.legalPlatform.priority')">
            <Select v-model:value="notificationForm.priority" :placeholder="$t('page.legalPlatform.priority')">
              <SelectOption value="high">{{ $t('page.legalPlatform.high') }}</SelectOption>
              <SelectOption value="medium">{{ $t('page.legalPlatform.medium') }}</SelectOption>
              <SelectOption value="low">{{ $t('page.legalPlatform.low') }}</SelectOption>
            </Select>
          </FormItem>

          <!-- 發送時間 -->
          <FormItem label="發送時間">
            <RadioGroup v-model:value="notificationForm.sendType">
              <Radio value="now">立即發送</Radio>
              <Radio value="scheduled">定時發送</Radio>
            </RadioGroup>
            <DatePicker 
              v-if="notificationForm.sendType === 'scheduled'"
              v-model:value="notificationForm.scheduledTime" 
              show-time
              :placeholder="選擇發送時間"
              class="w-full mt-2"
            />
          </FormItem>
        </Card>

        <!-- 關聯項目 -->
        <Card>
          <div class="font-semibold mb-4">關聯項目</div>
          <FormItem>
            <Select 
              v-model:value="notificationForm.relatedProject" 
              :placeholder="選擇關聯項目"
              allowClear
            >
              <SelectOption value="project1">法案審議項目A</SelectOption>
              <SelectOption value="project2">行政管理項目B</SelectOption>
              <SelectOption value="project3">研究分析項目C</SelectOption>
            </Select>
          </FormItem>
        </Card>

        <!-- 操作按鈕 -->
        <Card>
          <Space direction="vertical" class="w-full">
            <Button type="primary" size="large" block @click="handleSend" :loading="sending">
              <template #icon>
                <span class="icon-[lucide--send] size-4" />
              </template>
              {{ $t('page.legalPlatform.sendNotification') }}
            </Button>
            <Button size="large" block @click="handleSaveDraft" :loading="saving">
              <template #icon>
                <span class="icon-[lucide--save] size-4" />
              </template>
              {{ $t('page.legalPlatform.saveDraft') }}
            </Button>
            <Button size="large" block @click="handleCancel">
              <template #icon>
                <span class="icon-[lucide--x] size-4" />
              </template>
              {{ $t('page.legalPlatform.cancel') }}
            </Button>
          </Space>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { 
  Card, 
  Form, 
  FormItem, 
  Input, 
  Select, 
  SelectOption, 
  Button, 
  Space, 
  Upload, 
  DatePicker,
  Radio,
  RadioGroup,
  Divider,
  message 
} from 'ant-design-vue';

const { TextArea } = Input;
import { useI18n } from '#/locales';

const { t: $t } = useI18n();
const router = useRouter();
const formRef = ref();

// 響應式數據
const sending = ref(false);
const saving = ref(false);

// 知悉表單
const notificationForm = reactive({
  title: '',
  content: '',
  recipientType: '',
  recipients: [],
  priority: 'medium',
  sendType: 'now',
  scheduledTime: undefined,
  relatedProject: '',
  projectAttachments: [],
  attachments: [],
  remarks: ''
});

// 表單驗證規則
const rules = {
  title: [
    { required: true, message: '請輸入知悉標題', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '請輸入知悉內容', trigger: 'blur' }
  ]
};

// 事件處理函數
const handleBack = () => {
  router.back();
};

const handleRecipientTypeChange = () => {
  notificationForm.recipients = [];
};

const insertFormat = (format: string) => {
  // 簡單的格式插入邏輯
  const textarea = document.querySelector('textarea');
  if (!textarea) return;
  
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selectedText = notificationForm.content.substring(start, end);
  
  let insertText = '';
  switch (format) {
    case 'bold':
      insertText = `**${selectedText || '粗體文字'}**`;
      break;
    case 'italic':
      insertText = `*${selectedText || '斜體文字'}*`;
      break;
    case 'underline':
      insertText = `<u>${selectedText || '下劃線文字'}</u>`;
      break;
    case 'list':
      insertText = `\n- ${selectedText || '列表項目'}`;
      break;
    case 'ordered-list':
      insertText = `\n1. ${selectedText || '有序列表項目'}`;
      break;
    case 'link':
      insertText = `[${selectedText || '鏈接文字'}](網址)`;
      break;
  }
  
  notificationForm.content = 
    notificationForm.content.substring(0, start) + 
    insertText + 
    notificationForm.content.substring(end);
};

const beforeUpload = (file: any) => {
  const isValidType = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg',
    'image/png',
    'video/mp4',
    'audio/mpeg'
  ].includes(file.type);
  
  if (!isValidType) {
    message.error('只能上傳 PDF、Word、Excel、圖片、音視頻文件！');
    return false;
  }
  
  const isLt10M = file.size / 1024 / 1024 < 10;
  if (!isLt10M) {
    message.error('文件大小不能超過 10MB！');
    return false;
  }
  
  return false; // 阻止自動上傳，由手動處理
};

const handleSend = async () => {
  try {
    await formRef.value.validate();
    
    if (!notificationForm.recipients.length) {
      message.error('請選擇收件人');
      return;
    }
    
    sending.value = true;
    
    // 模擬API調用
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    message.success($t('page.legalPlatform.notificationSent'));
    router.push('/legal-platform/notification-management/list');
  } catch (error) {
    console.error('發送失敗:', error);
  } finally {
    sending.value = false;
  }
};

const handleSaveDraft = async () => {
  try {
    saving.value = true;
    
    // 模擬API調用
    await new Promise(resolve => setTimeout(resolve, 800));
    
    message.success($t('page.legalPlatform.draftSaved'));
  } catch (error) {
    console.error('保存失敗:', error);
  } finally {
    saving.value = false;
  }
};

const handleCancel = () => {
  router.push('/legal-platform/notification-management/list');
};
</script>

<style scoped>
.ant-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.ant-btn {
  border-radius: 6px;
}

.ant-input, .ant-select-selector, .ant-picker {
  border-radius: 6px;
}

.ant-upload {
  width: 100%;
}

.ant-upload .ant-btn {
  width: 100%;
}
</style>