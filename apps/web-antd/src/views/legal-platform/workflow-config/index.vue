<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { Page } from '@vben/common-ui';
import { $t } from '#/locales';
import {
  Button,
  Card,
  Checkbox,
  Col,
  Drawer,
  Form,
  FormItem,
  Input,
  Row,
  Select,
  SelectOption,
  Space,
  Switch,
  Table,
  Tooltip,
  message,
} from 'ant-design-vue';
import Sortable from 'sortablejs';

// 工作流狀態列表
const workflowStates = ref([
  { id: 1, name: 'pending', label: $t('page.legalPlatform.pending'), color: 'blue', isDefault: true },
  { id: 2, name: 'processing', label: $t('page.legalPlatform.processing'), color: 'green', isDefault: false },
  { id: 3, name: 'completed', label: $t('page.legalPlatform.completedNormal'), color: 'gray', isDefault: false },
  { id: 4, name: 'cancelled', label: $t('page.legalPlatform.cancelledAbnormal'), color: 'gray', isDefault: false },
]);

// 狀態轉換矩陣
const transitionMatrix = ref<Record<string, Record<string, boolean>>>({
  pending: { processing: true, completed: false, cancelled: true },
  processing: { pending: false, completed: true, cancelled: true },
  completed: { pending: false, processing: false, cancelled: false },
  cancelled: { pending: false, processing: false, completed: false },
});

// 關係對象流轉規則
const relationRules = ref([
  {
    id: 1,
    description: $t('page.legalPlatform.subAllCompleteParentComplete'),
  },
]);

// 抽屜狀態
const addStatusDrawerVisible = ref(false);
const createRuleDrawerVisible = ref(false);
const createRestrictionDrawerVisible = ref(false);

// 添加狀態表單
const addStatusForm = reactive({
  statusName: '',
  anyStatusCanTransfer: false,
});

// 創建規則表單
const createRuleForm = reactive({
  fromStatus: 'processing',
  toStatus: 'pending',
  fieldRequired: true,
  operatedByPeople: true,
  fieldContains: true,
});

// 創建限制表單
const createRestrictionForm = reactive({
  allSubRelation: true,
  targetStatus: 'pending',
});

// 可用狀態選項
const availableStatuses = [
  { value: 'pending', label: $t('page.legalPlatform.pending'), category: '基本狀態' },
  { value: 'processing', label: $t('page.legalPlatform.processing'), category: '基本狀態' },
  { value: 'completed', label: $t('page.legalPlatform.completedNormal'), category: '結束狀態' },
  { value: 'cancelled', label: $t('page.legalPlatform.cancelledAbnormal'), category: '結束狀態' },
];

// 打開添加狀態抽屜
const openAddStatusDrawer = () => {
  addStatusDrawerVisible.value = true;
};

// 關閉添加狀態抽屜
const closeAddStatusDrawer = () => {
  addStatusDrawerVisible.value = false;
  addStatusForm.statusName = '';
  addStatusForm.anyStatusCanTransfer = false;
};

// 確認添加狀態
const confirmAddStatus = () => {
  if (!addStatusForm.statusName) {
    message.error('請選擇狀態名稱');
    return;
  }
  message.success('狀態添加成功');
  closeAddStatusDrawer();
};

// 刪除狀態
const deleteStatus = (statusId: number) => {
  const index = workflowStates.value.findIndex(state => state.id === statusId);
  if (index > -1) {
    workflowStates.value.splice(index, 1);
    message.success('狀態刪除成功');
  }
};

// 打開創建規則抽屜
const openCreateRuleDrawer = (fromStatus: string, toStatus: string) => {
  createRuleForm.fromStatus = fromStatus;
  createRuleForm.toStatus = toStatus;
  createRuleDrawerVisible.value = true;
};

// 關閉創建規則抽屜
const closeCreateRuleDrawer = () => {
  createRuleDrawerVisible.value = false;
};

// 確認創建規則
const confirmCreateRule = () => {
  message.success('規則創建成功');
  closeCreateRuleDrawer();
};

// 打開創建限制抽屜
const openCreateRestrictionDrawer = () => {
  createRestrictionDrawerVisible.value = true;
};

// 關閉創建限制抽屜
const closeCreateRestrictionDrawer = () => {
  createRestrictionDrawerVisible.value = false;
};

// 確認創建限制
const confirmCreateRestriction = () => {
  message.success('限制創建成功');
  closeCreateRestrictionDrawer();
};

// 清空限制表單
const clearRestrictionForm = () => {
  createRestrictionForm.allSubRelation = true;
  createRestrictionForm.targetStatus = 'pending';
};

// 獲取狀態顏色類
const getStatusColorClass = (color: string) => {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-500 text-white',
    green: 'bg-green-500 text-white',
    gray: 'bg-gray-500 text-white',
  };
  return colorMap[color] || 'bg-gray-500 text-white';
};

// 切換轉換狀態
const toggleTransition = (from: string, to: string) => {
  if (transitionMatrix.value[from]) {
    transitionMatrix.value[from][to] = !transitionMatrix.value[from][to];
  }
};

// 根據狀態名稱獲取狀態對象
const getStatusByName = (statusName: string) => {
  return workflowStates.value.find(state => state.name === statusName);
};

// 拖拽排序功能
const initSortable = () => {
  const statusListElement = document.querySelector('.status-list');
  if (statusListElement) {
    Sortable.create(statusListElement, {
      animation: 150,
      ghostClass: 'sortable-ghost',
      chosenClass: 'sortable-chosen',
      dragClass: 'sortable-drag',
      onEnd: (evt) => {
        const { oldIndex, newIndex } = evt;
        if (oldIndex !== undefined && newIndex !== undefined && oldIndex !== newIndex) {
          // 重新排序狀態數組
          const movedItem = workflowStates.value.splice(oldIndex, 1)[0];
          workflowStates.value.splice(newIndex, 0, movedItem);
          
          // 重新構建轉換矩陣以保持順序一致
          const newMatrix: Record<string, Record<string, boolean>> = {};
          workflowStates.value.forEach(fromState => {
            newMatrix[fromState.name] = {};
            workflowStates.value.forEach(toState => {
              newMatrix[fromState.name][toState.name] = 
                transitionMatrix.value[fromState.name]?.[toState.name] || false;
            });
          });
          transitionMatrix.value = newMatrix;
        }
      }
    });
  }
};

// 組件掛載後初始化拖拽
onMounted(() => {
  initSortable();
});
</script>

<template>
  <Page :title="$t('page.legalPlatform.workflowConfig')">
    <div class="workflow-config-container">
      <!-- 頂部添加按鈕 -->
      <div class="mb-6 flex justify-end">
        <Button type="primary" @click="openAddStatusDrawer">
          {{ $t('page.legalPlatform.addWorkItemStatus') }}
        </Button>
      </div>

      <div class="grid grid-cols-12 gap-2">
        <!-- 左側狀態列表 -->
        <div class="col-span-3">
          <Card title="工作流狀態" class="h-full">
            <div class="space-y-1 status-list">
              <div
                v-for="state in workflowStates"
                :key="state.id"
                class="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 group cursor-move mb-1"
                data-v-0641961b
              >
                <div class="flex items-center space-x-3">
                  <span class="icon-[lucide--grip-vertical] size-4 text-gray-400 cursor-move" />
                  <span
                    :class="getStatusColorClass(state.color)"
                    class="px-3 py-1 rounded text-sm font-medium"
                  >
                    {{ state.label }}
                    <span v-if="state.isDefault" class="ml-1 text-xs">
                      ({{ $t('page.legalPlatform.defaultStatus') }})
                    </span>
                  </span>
                </div>
                <Tooltip v-if="!state.isDefault" :title="$t('page.legalPlatform.deleteStep')">
                  <Button
                    type="text"
                    size="small"
                    class="opacity-0 group-hover:opacity-100 transition-opacity"
                    @click="deleteStatus(state.id)"
                  >
                    <span class="icon-[lucide--trash-2] size-4 text-red-500" />
                  </Button>
                </Tooltip>
              </div>
            </div>
          </Card>
        </div>

        <!-- 右側狀態轉換矩陣 -->
        <div class="col-span-9 pl-1">
          <Card title="狀態轉換矩陣" class="mb-6">
            <div class="overflow-x-auto">
              <table class="w-full border-collapse">
                <thead>
                  <tr>
                    <th class="border border-gray-300 p-3 bg-gray-50 text-left">當前狀態 \ 目標狀態</th>
                    <th
                      v-for="state in workflowStates"
                      :key="`header-${state.id}`"
                      class="border border-gray-300 p-3 bg-gray-50 text-center min-w-[120px]"
                    >
                      <span
                        :class="getStatusColorClass(state.color)"
                        class="px-2 py-1 rounded text-sm font-medium"
                      >
                        {{ state.label }}
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="fromState in workflowStates" :key="`row-${fromState.id}`">
                    <td class="border border-gray-300 p-3 bg-gray-50">
                      <span
                        :class="getStatusColorClass(fromState.color)"
                        class="px-2 py-1 rounded text-sm font-medium"
                      >
                        {{ fromState.label }}
                      </span>
                    </td>
                    <td
                      v-for="toState in workflowStates"
                      :key="`cell-${fromState.id}-${toState.id}`"
                      class="border border-gray-300 p-3 text-center"
                    >
                      <div v-if="fromState.name === toState.name" class="text-gray-400">-</div>
                      <div v-else class="flex items-center justify-center space-x-2">
                        <Checkbox
                          :checked="transitionMatrix[fromState.name]?.[toState.name]"
                          @change="toggleTransition(fromState.name, toState.name)"
                        />
                        <Tooltip :title="$t('page.legalPlatform.addRule')">
                          <Button
                            type="text"
                            size="small"
                            @click="openCreateRuleDrawer(fromState.name, toState.name)"
                          >
                            <span class="icon-[lucide--plus] size-4" />
                          </Button>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>

          <!-- 關係對象流轉規則 -->
          <Card :title="$t('page.legalPlatform.relationObjectFlowRules')">
            <div class="space-y-4">
              <div
                v-for="rule in relationRules"
                :key="rule.id"
                class="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div class="flex items-center space-x-3">
                  <span class="text-sm">{{ rule.description }}</span>
                  <Tooltip :title="rule.description">
                    <span class="icon-[lucide--help-circle] size-4 text-gray-400" />
                  </Tooltip>
                </div>
              </div>
              <div class="flex justify-center">
                <Button type="dashed" @click="openCreateRestrictionDrawer">
                  <span class="icon-[lucide--plus] size-4 mr-1" />
                  添加規則
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>

    <!-- 添加工作項狀態抽屜 -->
    <Drawer
      v-model:open="addStatusDrawerVisible"
      :title="$t('page.legalPlatform.addWorkItemStatus')"
      placement="right"
      :width="400"
      @close="closeAddStatusDrawer"
    >
      <Form layout="vertical">
        <FormItem :label="$t('page.legalPlatform.statusName')">
          <Select
            v-model:value="addStatusForm.statusName"
            :placeholder="$t('page.legalPlatform.searchStatus')"
            show-search
            :filter-option="false"
          >
            <template v-for="status in availableStatuses" :key="status.value">
              <SelectOption :value="status.value">
                {{ status.label }}
              </SelectOption>
            </template>
            <template #notFoundContent>
              <div class="p-2 text-center">
                <Button type="link" size="small">
                  {{ $t('page.legalPlatform.goCreate') }}
                </Button>
              </div>
            </template>
          </Select>
        </FormItem>
        
        <FormItem>
          <div class="flex items-center space-x-2">
            <Switch v-model:checked="addStatusForm.anyStatusCanTransfer" />
            <span class="text-sm">{{ $t('page.legalPlatform.anyStatusCanTransfer') }}</span>
          </div>
        </FormItem>
      </Form>
      
      <template #footer>
        <div class="flex justify-end space-x-2">
          <Button @click="closeAddStatusDrawer">
            {{ $t('page.legalPlatform.cancel') }}
          </Button>
          <Button type="primary" @click="confirmAddStatus">
            {{ $t('page.legalPlatform.confirm') }}
          </Button>
        </div>
      </template>
    </Drawer>

    <!-- 新建步驟流轉規則抽屜 -->
    <Drawer
      v-model:open="createRuleDrawerVisible"
      :title="$t('page.legalPlatform.createStepFlowRule')"
      placement="right"
      :width="400"
      @close="closeCreateRuleDrawer"
    >
      <div class="space-y-4">
        <div class="flex items-center space-x-2">
          <span
            :class="getStatusColorClass(getStatusByName(createRuleForm.fromStatus)?.color || 'gray')"
            class="px-2 py-1 rounded text-sm font-medium"
          >
            {{ getStatusByName(createRuleForm.fromStatus)?.label || createRuleForm.fromStatus }}
          </span>
          <span class="icon-[lucide--arrow-right] size-4" />
          <span
            :class="getStatusColorClass(getStatusByName(createRuleForm.toStatus)?.color || 'gray')"
            class="px-2 py-1 rounded text-sm font-medium"
          >
            {{ getStatusByName(createRuleForm.toStatus)?.label || createRuleForm.toStatus }}
          </span>
        </div>
        
        <div class="space-y-3">
          <div class="text-sm text-gray-600">規則觸發條件：</div>
          <div class="space-y-2 text-sm">
            <div>{{ $t('page.legalPlatform.fieldRequired') }}</div>
            <div>{{ $t('page.legalPlatform.operatedBy') }}</div>
            <div>{{ $t('page.legalPlatform.fieldContains') }}</div>
          </div>
          <Button type="link" size="small">
            {{ $t('page.legalPlatform.fieldCondition') }}
          </Button>
        </div>
      </div>
      
      <template #footer>
        <div class="flex justify-end space-x-2">
          <Button @click="closeCreateRuleDrawer">
            {{ $t('page.legalPlatform.cancel') }}
          </Button>
          <Button type="primary" @click="confirmCreateRule">
            {{ $t('page.legalPlatform.create') }}
          </Button>
        </div>
      </template>
    </Drawer>

    <!-- 新建流轉限制抽屜 -->
    <Drawer
      v-model:open="createRestrictionDrawerVisible"
      :title="$t('page.legalPlatform.createFlowRestriction')"
      placement="right"
      :width="400"
      @close="closeCreateRestrictionDrawer"
    >
      <div class="space-y-4">
        <div class="space-y-3">
          <div class="text-sm text-gray-600">規則觸發條件：</div>
          <div class="flex items-center space-x-2 text-sm">
            <span>{{ $t('page.legalPlatform.allSubRelation') }}</span>
            <span
              :class="getStatusColorClass('blue')"
              class="px-2 py-1 rounded text-sm font-medium"
            >
              {{ $t('page.legalPlatform.pending') }}
            </span>
          </div>
          <Button type="link" size="small">
            {{ $t('page.legalPlatform.condition') }}
          </Button>
        </div>
      </div>
      
      <template #footer>
        <div class="flex justify-end space-x-2">
          <Button @click="clearRestrictionForm">
            {{ $t('page.legalPlatform.clear') }}
          </Button>
          <Button @click="closeCreateRestrictionDrawer">
            {{ $t('page.legalPlatform.cancel') }}
          </Button>
          <Button type="primary" @click="confirmCreateRestriction">
            {{ $t('page.legalPlatform.create') }}
          </Button>
        </div>
      </template>
    </Drawer>
  </Page>
</template>

<style scoped>
.workflow-config-container {
  padding: 0;
}

:deep(.ant-card) {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
}

:deep(.ant-card-head) {
  border-bottom: 1px solid #f0f0f0;
}

:deep(.ant-drawer-header) {
  border-bottom: 1px solid #f0f0f0;
}

:deep(.ant-drawer-footer) {
  border-top: 1px solid #f0f0f0;
}

.group:hover .opacity-0 {
  opacity: 1;
}

table {
  border-collapse: collapse;
}

table th,
table td {
  border: 1px solid #d1d5db;
}

/* 拖拽樣式 */
.sortable-ghost {
  opacity: 0.4;
}

.sortable-chosen {
  background-color: #f0f9ff;
}

.sortable-drag {
  background-color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* data-v-0641961b 間隔調整 */
[data-v-0641961b] {
  margin-bottom: 5px;
}

[data-v-0641961b]:last-child {
  margin-bottom: 0;
}

.status-list {
  min-height: 200px;
}
</style>
