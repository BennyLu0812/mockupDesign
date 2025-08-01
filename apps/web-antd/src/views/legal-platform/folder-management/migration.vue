<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Page } from '@vben/common-ui';
import { $t } from '#/locales';
import {
  Button,
  Card,
  Col,
  Form,
  FormItem,
  Input,
  Row,
  Select,
  SelectOption,
  Space,
  Table,
  Tag,
  Steps,
  Step,
  Progress,
  Alert,
  Checkbox,
  Tree,
  message,
  Modal,
  Radio,
  RadioGroup,
  Divider,
  Tooltip,
  Spin,
} from 'ant-design-vue';

const router = useRouter();

// 當前步驟
const currentStep = ref(0);

// 遷移類型
const migrationType = ref('folder');

// 源選擇
const sourceForm = reactive({
  sourceType: 'internal', // internal, external, backup
  sourcePath: '',
  sourceServer: '',
  sourceCredentials: {
    username: '',
    password: '',
  },
});

// 目標選擇
const targetForm = reactive({
  targetPath: '',
  targetFolder: '',
  createNewFolder: false,
  newFolderName: '',
});

// 遷移選項
const migrationOptions = reactive({
  includeSubfolders: true,
  includeFiles: true,
  preservePermissions: true,
  preserveTimestamps: true,
  overwriteExisting: false,
  createBackup: true,
  verifyIntegrity: true,
  notifyUsers: false,
});

// 文件夾樹數據
const folderTreeData = ref([
  {
    title: '法律文件',
    key: '/legal-documents',
    children: [
      {
        title: '合同模板',
        key: '/legal-documents/contracts',
        children: [
          { title: '勞動合同', key: '/legal-documents/contracts/labor' },
          { title: '服務合同', key: '/legal-documents/contracts/service' },
        ],
      },
      {
        title: '案例分析',
        key: '/legal-documents/cases',
        children: [
          { title: '民事案例', key: '/legal-documents/cases/civil' },
          { title: '刑事案例', key: '/legal-documents/cases/criminal' },
        ],
      },
    ],
  },
  {
    title: '歷史文件',
    key: '/historical-documents',
    children: [
      { title: '2023年文件', key: '/historical-documents/2023' },
      { title: '2022年文件', key: '/historical-documents/2022' },
    ],
  },
]);

// 選中的源文件夾
const selectedSourceKeys = ref([]);
const selectedTargetKeys = ref([]);

// 遷移進度
const migrationProgress = reactive({
  isRunning: false,
  currentFile: '',
  processedFiles: 0,
  totalFiles: 0,
  percentage: 0,
  speed: '0 MB/s',
  timeRemaining: '計算中...',
  errors: [],
  warnings: [],
});

// 遷移歷史
const migrationHistory = ref([
  {
    id: '1',
    type: 'folder',
    source: '/legal-documents/old-contracts',
    target: '/legal-documents/contracts',
    status: 'completed',
    startTime: '2024-01-20 10:00:00',
    endTime: '2024-01-20 10:15:00',
    filesProcessed: 125,
    totalSize: '2.5GB',
    operator: '張三',
  },
  {
    id: '2',
    type: 'backup',
    source: '/legal-documents/cases',
    target: '/backup/cases-20240119',
    status: 'completed',
    startTime: '2024-01-19 14:30:00',
    endTime: '2024-01-19 14:45:00',
    filesProcessed: 89,
    totalSize: '1.8GB',
    operator: '李四',
  },
  {
    id: '3',
    type: 'external',
    source: 'ftp://external-server/documents',
    target: '/legal-documents/imported',
    status: 'failed',
    startTime: '2024-01-18 16:00:00',
    endTime: '2024-01-18 16:05:00',
    filesProcessed: 15,
    totalSize: '0.3GB',
    operator: '王五',
    error: '連接超時',
  },
]);

// 表格列配置
const historyColumns = [
  {
    title: '遷移類型',
    dataIndex: 'type',
    key: 'type',
    width: 100,
  },
  {
    title: '源路徑',
    dataIndex: 'source',
    key: 'source',
    width: 200,
  },
  {
    title: '目標路徑',
    dataIndex: 'target',
    key: 'target',
    width: 200,
  },
  {
    title: '狀態',
    dataIndex: 'status',
    key: 'status',
    width: 100,
  },
  {
    title: '處理文件',
    dataIndex: 'filesProcessed',
    key: 'filesProcessed',
    width: 100,
  },
  {
    title: '總大小',
    dataIndex: 'totalSize',
    key: 'totalSize',
    width: 100,
  },
  {
    title: '開始時間',
    dataIndex: 'startTime',
    key: 'startTime',
    width: 180,
  },
  {
    title: '操作人',
    dataIndex: 'operator',
    key: 'operator',
    width: 100,
  },
];

// 步驟配置
const steps = [
  { title: '選擇源', description: '選擇要遷移的文件夾或文件' },
  { title: '選擇目標', description: '選擇遷移的目標位置' },
  { title: '配置選項', description: '設置遷移參數和選項' },
  { title: '確認執行', description: '確認遷移信息並執行' },
  { title: '遷移進度', description: '監控遷移進度和結果' },
];

// 下一步
const handleNext = () => {
  if (currentStep.value === 0) {
    // 驗證源選擇
    if (sourceForm.sourceType === 'internal' && selectedSourceKeys.value.length === 0) {
      message.error('請選擇要遷移的文件夾');
      return;
    }
    if (sourceForm.sourceType === 'external' && !sourceForm.sourcePath) {
      message.error('請輸入源路徑');
      return;
    }
  } else if (currentStep.value === 1) {
    // 驗證目標選擇
    if (!targetForm.targetPath && selectedTargetKeys.value.length === 0) {
      message.error('請選擇目標位置');
      return;
    }
  } else if (currentStep.value === 3) {
    // 開始遷移
    startMigration();
    currentStep.value++;
    return;
  }
  
  if (currentStep.value < steps.length - 1) {
    currentStep.value++;
  }
};

// 上一步
const handlePrev = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
};

// 重新開始
const handleRestart = () => {
  currentStep.value = 0;
  migrationProgress.isRunning = false;
  migrationProgress.percentage = 0;
  migrationProgress.processedFiles = 0;
  migrationProgress.totalFiles = 0;
  migrationProgress.errors = [];
  migrationProgress.warnings = [];
};

// 開始遷移
const startMigration = () => {
  migrationProgress.isRunning = true;
  migrationProgress.totalFiles = 150; // 模擬總文件數
  migrationProgress.processedFiles = 0;
  migrationProgress.percentage = 0;
  migrationProgress.errors = [];
  migrationProgress.warnings = [];
  
  // 模擬遷移進度
  const interval = setInterval(() => {
    if (migrationProgress.processedFiles < migrationProgress.totalFiles) {
      migrationProgress.processedFiles += Math.floor(Math.random() * 5) + 1;
      migrationProgress.percentage = Math.floor(
        (migrationProgress.processedFiles / migrationProgress.totalFiles) * 100
      );
      migrationProgress.currentFile = `文件_${migrationProgress.processedFiles}.pdf`;
      migrationProgress.speed = `${(Math.random() * 10 + 5).toFixed(1)} MB/s`;
      
      const remaining = migrationProgress.totalFiles - migrationProgress.processedFiles;
      migrationProgress.timeRemaining = `約 ${Math.ceil(remaining / 10)} 分鐘`;
      
      // 模擬一些警告
      if (Math.random() < 0.1 && migrationProgress.warnings.length < 3) {
        migrationProgress.warnings.push(`警告: 文件 ${migrationProgress.currentFile} 權限可能不完整`);
      }
    } else {
      migrationProgress.isRunning = false;
      migrationProgress.percentage = 100;
      migrationProgress.currentFile = '';
      migrationProgress.timeRemaining = '已完成';
      clearInterval(interval);
      message.success('遷移完成！');
    }
  }, 500);
};

// 停止遷移
const stopMigration = () => {
  migrationProgress.isRunning = false;
  message.warning('遷移已停止');
};

// 返回
const handleBack = () => {
  router.back();
};

// 獲取狀態標籤顏色
const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    completed: 'green',
    failed: 'red',
    running: 'blue',
    pending: 'orange',
  };
  return colorMap[status] || 'default';
};

// 獲取類型標籤顏色
const getTypeColor = (type: string) => {
  const colorMap: Record<string, string> = {
    folder: 'blue',
    backup: 'green',
    external: 'purple',
    sync: 'orange',
  };
  return colorMap[type] || 'default';
};

// 獲取類型名稱
const getTypeName = (type: string) => {
  const nameMap: Record<string, string> = {
    folder: '文件夾遷移',
    backup: '備份遷移',
    external: '外部導入',
    sync: '同步遷移',
  };
  return nameMap[type] || type;
};

// 獲取狀態名稱
const getStatusName = (status: string) => {
  const nameMap: Record<string, string> = {
    completed: '已完成',
    failed: '失敗',
    running: '進行中',
    pending: '等待中',
  };
  return nameMap[status] || status;
};
</script>

<template>
  <Page>
    <!-- 頁面頭部 -->
    <Card class="mb-4">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-xl font-semibold mb-2">文件夾遷移工具</h2>
          <div class="text-gray-500">批量遷移文件夾和文件，支持內部遷移、外部導入和備份恢復</div>
        </div>
        <Space>
          <Button @click="handleBack">
            <template #icon>
              <span class="icon-[lucide--arrow-left] size-4" />
            </template>
            {{ $t('page.legalPlatform.back') }}
          </Button>
        </Space>
      </div>
    </Card>

    <!-- 遷移嚮導 -->
    <Card class="mb-4">
      <Steps :current="currentStep" class="mb-6">
        <Step 
          v-for="(step, index) in steps" 
          :key="index"
          :title="step.title" 
          :description="step.description"
        />
      </Steps>

      <!-- 步驟 1: 選擇源 -->
      <div v-if="currentStep === 0">
        <h3 class="text-lg font-medium mb-4">選擇遷移源</h3>
        
        <Form layout="vertical">
          <FormItem label="遷移類型">
            <RadioGroup v-model:value="migrationType">
              <Radio value="folder">文件夾遷移</Radio>
              <Radio value="backup">備份恢復</Radio>
              <Radio value="sync">同步遷移</Radio>
            </RadioGroup>
          </FormItem>
          
          <FormItem label="源類型">
            <RadioGroup v-model:value="sourceForm.sourceType">
              <Radio value="internal">內部文件夾</Radio>
              <Radio value="external">外部路徑</Radio>
              <Radio value="backup">備份文件</Radio>
            </RadioGroup>
          </FormItem>
          
          <div v-if="sourceForm.sourceType === 'internal'">
            <FormItem label="選擇源文件夾">
              <Tree
                v-model:selectedKeys="selectedSourceKeys"
                :tree-data="folderTreeData"
                checkable
                :height="300"
                class="border rounded p-2"
              />
            </FormItem>
          </div>
          
          <div v-else-if="sourceForm.sourceType === 'external'">
            <Row :gutter="16">
              <Col :span="12">
                <FormItem label="服務器地址">
                  <Input 
                    v-model:value="sourceForm.sourceServer" 
                    placeholder="例如: ftp://server.com 或 \\\\server\\share"
                  />
                </FormItem>
              </Col>
              <Col :span="12">
                <FormItem label="源路徑">
                  <Input 
                    v-model:value="sourceForm.sourcePath" 
                    placeholder="例如: /documents 或 \\folder"
                  />
                </FormItem>
              </Col>
            </Row>
            
            <Row :gutter="16">
              <Col :span="12">
                <FormItem label="用戶名">
                  <Input v-model:value="sourceForm.sourceCredentials.username" />
                </FormItem>
              </Col>
              <Col :span="12">
                <FormItem label="密碼">
                  <Input.Password v-model:value="sourceForm.sourceCredentials.password" />
                </FormItem>
              </Col>
            </Row>
          </div>
          
          <div v-else-if="sourceForm.sourceType === 'backup'">
            <FormItem label="備份文件路徑">
              <Input 
                v-model:value="sourceForm.sourcePath" 
                placeholder="選擇備份文件"
                readonly
              >
                <template #suffix>
                  <Button size="small">瀏覽</Button>
                </template>
              </Input>
            </FormItem>
          </div>
        </Form>
      </div>

      <!-- 步驟 2: 選擇目標 -->
      <div v-if="currentStep === 1">
        <h3 class="text-lg font-medium mb-4">選擇遷移目標</h3>
        
        <Form layout="vertical">
          <FormItem label="目標位置">
            <Tree
              v-model:selectedKeys="selectedTargetKeys"
              :tree-data="folderTreeData"
              :height="300"
              class="border rounded p-2"
            />
          </FormItem>
          
          <FormItem>
            <Checkbox v-model:checked="targetForm.createNewFolder">
              創建新文件夾
            </Checkbox>
          </FormItem>
          
          <FormItem v-if="targetForm.createNewFolder" label="新文件夾名稱">
            <Input 
              v-model:value="targetForm.newFolderName" 
              placeholder="輸入新文件夾名稱"
            />
          </FormItem>
        </Form>
      </div>

      <!-- 步驟 3: 配置選項 -->
      <div v-if="currentStep === 2">
        <h3 class="text-lg font-medium mb-4">遷移選項</h3>
        
        <Row :gutter="24">
          <Col :span="12">
            <Card title="包含內容" size="small">
              <div class="space-y-2">
                <Checkbox v-model:checked="migrationOptions.includeSubfolders">
                  包含子文件夾
                </Checkbox>
                <Checkbox v-model:checked="migrationOptions.includeFiles">
                  包含文件
                </Checkbox>
              </div>
            </Card>
          </Col>
          
          <Col :span="12">
            <Card title="保留屬性" size="small">
              <div class="space-y-2">
                <Checkbox v-model:checked="migrationOptions.preservePermissions">
                  保留權限設置
                </Checkbox>
                <Checkbox v-model:checked="migrationOptions.preserveTimestamps">
                  保留時間戳
                </Checkbox>
              </div>
            </Card>
          </Col>
        </Row>
        
        <Row :gutter="24" class="mt-4">
          <Col :span="12">
            <Card title="衝突處理" size="small">
              <div class="space-y-2">
                <Checkbox v-model:checked="migrationOptions.overwriteExisting">
                  覆蓋現有文件
                </Checkbox>
                <Checkbox v-model:checked="migrationOptions.createBackup">
                  創建備份
                </Checkbox>
              </div>
            </Card>
          </Col>
          
          <Col :span="12">
            <Card title="其他選項" size="small">
              <div class="space-y-2">
                <Checkbox v-model:checked="migrationOptions.verifyIntegrity">
                  驗證文件完整性
                </Checkbox>
                <Checkbox v-model:checked="migrationOptions.notifyUsers">
                  通知相關用戶
                </Checkbox>
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      <!-- 步驟 4: 確認執行 -->
      <div v-if="currentStep === 3">
        <h3 class="text-lg font-medium mb-4">確認遷移信息</h3>
        
        <Alert
          message="請仔細檢查以下遷移信息，確認無誤後點擊開始遷移"
          type="warning"
          class="mb-4"
        />
        
        <Card>
          <div class="space-y-4">
            <div>
              <strong>遷移類型:</strong> {{ getTypeName(migrationType) }}
            </div>
            <div>
              <strong>源位置:</strong> 
              <span v-if="sourceForm.sourceType === 'internal'">
                {{ selectedSourceKeys.join(', ') }}
              </span>
              <span v-else>
                {{ sourceForm.sourceServer }}{{ sourceForm.sourcePath }}
              </span>
            </div>
            <div>
              <strong>目標位置:</strong> {{ selectedTargetKeys.join(', ') }}
              <span v-if="targetForm.createNewFolder"> / {{ targetForm.newFolderName }}</span>
            </div>
            <Divider />
            <div>
              <strong>遷移選項:</strong>
              <div class="mt-2 grid grid-cols-2 gap-2">
                <Tag v-if="migrationOptions.includeSubfolders" color="blue">包含子文件夾</Tag>
                <Tag v-if="migrationOptions.includeFiles" color="blue">包含文件</Tag>
                <Tag v-if="migrationOptions.preservePermissions" color="green">保留權限</Tag>
                <Tag v-if="migrationOptions.preserveTimestamps" color="green">保留時間戳</Tag>
                <Tag v-if="migrationOptions.overwriteExisting" color="orange">覆蓋現有</Tag>
                <Tag v-if="migrationOptions.createBackup" color="purple">創建備份</Tag>
                <Tag v-if="migrationOptions.verifyIntegrity" color="cyan">驗證完整性</Tag>
                <Tag v-if="migrationOptions.notifyUsers" color="magenta">通知用戶</Tag>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <!-- 步驟 5: 遷移進度 -->
      <div v-if="currentStep === 4">
        <h3 class="text-lg font-medium mb-4">遷移進度</h3>
        
        <Card>
          <div class="space-y-4">
            <Progress 
              :percent="migrationProgress.percentage" 
              :status="migrationProgress.isRunning ? 'active' : 'success'"
            />
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <div class="text-sm text-gray-500">當前文件</div>
                <div>{{ migrationProgress.currentFile || '準備中...' }}</div>
              </div>
              <div>
                <div class="text-sm text-gray-500">處理進度</div>
                <div>{{ migrationProgress.processedFiles }} / {{ migrationProgress.totalFiles }}</div>
              </div>
              <div>
                <div class="text-sm text-gray-500">傳輸速度</div>
                <div>{{ migrationProgress.speed }}</div>
              </div>
              <div>
                <div class="text-sm text-gray-500">剩餘時間</div>
                <div>{{ migrationProgress.timeRemaining }}</div>
              </div>
            </div>
            
            <div v-if="migrationProgress.warnings.length > 0">
              <Alert
                v-for="(warning, index) in migrationProgress.warnings"
                :key="index"
                :message="warning"
                type="warning"
                class="mb-2"
              />
            </div>
            
            <div v-if="migrationProgress.errors.length > 0">
              <Alert
                v-for="(error, index) in migrationProgress.errors"
                :key="index"
                :message="error"
                type="error"
                class="mb-2"
              />
            </div>
            
            <div class="flex justify-center space-x-4">
              <Button 
                v-if="migrationProgress.isRunning" 
                type="primary" 
                danger 
                @click="stopMigration"
              >
                停止遷移
              </Button>
              <Button 
                v-if="!migrationProgress.isRunning && migrationProgress.percentage === 100" 
                type="primary" 
                @click="handleRestart"
              >
                重新開始
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <!-- 步驟導航 -->
      <div class="flex justify-between mt-6" v-if="currentStep < 4">
        <Button 
          v-if="currentStep > 0" 
          @click="handlePrev"
        >
          上一步
        </Button>
        <div v-else></div>
        
        <Button 
          type="primary" 
          @click="handleNext"
        >
          {{ currentStep === 3 ? '開始遷移' : '下一步' }}
        </Button>
      </div>
    </Card>

    <!-- 遷移歷史 -->
    <Card>
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-medium">遷移歷史</h3>
        <Button>
          <template #icon>
            <span class="icon-[lucide--refresh-cw] size-4" />
          </template>
          刷新
        </Button>
      </div>
      
      <Table
        :columns="historyColumns"
        :data-source="migrationHistory"
        :pagination="false"
        row-key="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'type'">
            <Tag :color="getTypeColor(record.type)">
              {{ getTypeName(record.type) }}
            </Tag>
          </template>
          <template v-else-if="column.key === 'source'">
            <Tooltip :title="record.source">
              <span class="truncate max-w-[150px] block">{{ record.source }}</span>
            </Tooltip>
          </template>
          <template v-else-if="column.key === 'target'">
            <Tooltip :title="record.target">
              <span class="truncate max-w-[150px] block">{{ record.target }}</span>
            </Tooltip>
          </template>
          <template v-else-if="column.key === 'status'">
            <Tag :color="getStatusColor(record.status)">
              {{ getStatusName(record.status) }}
            </Tag>
            <div v-if="record.error" class="text-xs text-red-500 mt-1">
              {{ record.error }}
            </div>
          </template>
        </template>
      </Table>
    </Card>
  </Page>
</template>

<style scoped>
.ant-card {
  border-radius: 8px;
}

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>