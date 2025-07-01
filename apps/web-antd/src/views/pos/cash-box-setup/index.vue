<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { Form, FormItem, Input, Button, Select, InputNumber, message } from 'ant-design-vue';
import { $t } from '@vben/locales';

defineOptions({ name: 'PosCashBoxSetup' });

const router = useRouter();

// 銀錢箱設置表單數據
const cashBoxForm = reactive({
  salesLocation: '',
  cashBox: '',
  cashAmount: 0
});

// 控制狀態
const loading = ref(false);

// 銷售地選項
const salesLocationOptions = [
  { value: 'store1', label: $t('pos.login.cashBoxSetup.salesLocationOptions.store1') },
  { value: 'store2', label: $t('pos.login.cashBoxSetup.salesLocationOptions.store2') },
  { value: 'store3', label: $t('pos.login.cashBoxSetup.salesLocationOptions.store3') }
];

// 銀錢箱選項（根據銷售地動態變化）
const cashBoxOptions = ref([
  { value: 'box1', label: $t('pos.login.cashBoxSetup.cashBoxOptions.box1') },
  { value: 'box2', label: $t('pos.login.cashBoxSetup.cashBoxOptions.box2') },
  { value: 'box3', label: $t('pos.login.cashBoxSetup.cashBoxOptions.box3') }
]);

// 銀錢箱設置確認
const handleConfirm = async () => {
  if (!cashBoxForm.salesLocation || !cashBoxForm.cashBox || !cashBoxForm.cashAmount) {
    message.error('請完整填寫銀錢箱信息');
    return;
  }

  try {
    loading.value = true;
    
    // 模擬保存銀錢箱設置
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 保存到本地存儲
    localStorage.setItem('pos_cash_box_setup', JSON.stringify(cashBoxForm));
    
    message.success('銀錢箱設置成功');
    
    // 跳轉到結賬頁面
    window.location.href = 'http://localhost:5666/settlement';
  } catch (error) {
    message.error('銀錢箱設置失敗');
  } finally {
    loading.value = false;
  }
};

// 返回登錄頁面
const handleBack = () => {
  router.push('/pos/login');
};

// 銷售地變化時重置銀錢箱選擇
const handleSalesLocationChange = () => {
  cashBoxForm.cashBox = '';
};
</script>

<template>
  <div class="cash-box-setup-container">
    <div class="setup-card">
      <div class="setup-header">
        <h1 class="setup-title">{{ $t('pos.login.cashBoxSetup.title') }}</h1>
        <p class="setup-subtitle">{{ $t('pos.title') }}</p>
      </div>
      
      <Form 
        :model="cashBoxForm" 
        layout="vertical" 
        class="setup-form"
        @finish="handleConfirm"
      >
        <FormItem 
          :label="$t('pos.login.cashBoxSetup.salesLocation')"
          name="salesLocation"
          :rules="[{ required: true, message: $t('pos.login.cashBoxSetup.salesLocationPlaceholder') }]"
        >
          <Select 
            v-model:value="cashBoxForm.salesLocation"
            :placeholder="$t('pos.login.cashBoxSetup.salesLocationPlaceholder')"
            :options="salesLocationOptions"
            size="large"
            @change="handleSalesLocationChange"
          >
            <template #suffixIcon>
              <span class="icon-[lucide--chevron-down] text-gray-400" />
            </template>
          </Select>
        </FormItem>
        
        <FormItem 
          :label="$t('pos.login.cashBoxSetup.cashBox')"
          name="cashBox"
          :rules="[{ required: true, message: $t('pos.login.cashBoxSetup.cashBoxPlaceholder') }]"
        >
          <Select 
            v-model:value="cashBoxForm.cashBox"
            :placeholder="$t('pos.login.cashBoxSetup.cashBoxPlaceholder')"
            :options="cashBoxOptions"
            size="large"
            :disabled="!cashBoxForm.salesLocation"
          >
            <template #suffixIcon>
              <span class="icon-[lucide--chevron-down] text-gray-400" />
            </template>
          </Select>
        </FormItem>
        
        <FormItem 
          :label="$t('pos.login.cashBoxSetup.cashAmount')"
          name="cashAmount"
          :rules="[{ required: true, message: $t('pos.login.cashBoxSetup.cashAmountPlaceholder') }]"
        >
          <InputNumber 
            v-model:value="cashBoxForm.cashAmount"
            :placeholder="$t('pos.login.cashBoxSetup.cashAmountPlaceholder')"
            :min="0"
            :precision="2"
            size="large"
            style="width: 100%"
          >
            <template #prefix>
              <span class="icon-[lucide--dollar-sign] text-gray-400" />
            </template>
          </InputNumber>
        </FormItem>
        
        <div class="button-group">
          <Button 
            size="large"
            class="back-button"
            @click="handleBack"
          >
            {{ $t('pos.login.cashBoxSetup.cancel') }}
          </Button>
          
          <Button 
            type="primary" 
            html-type="submit"
            :loading="loading"
            size="large"
            class="confirm-button"
          >
            {{ $t('pos.login.cashBoxSetup.confirm') }}
          </Button>
        </div>
      </Form>
    </div>
  </div>
</template>

<style scoped>
.cash-box-setup-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.setup-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 500px;
}

.setup-header {
  text-align: center;
  margin-bottom: 32px;
}

.setup-title {
  font-size: 28px;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 8px;
}

.setup-subtitle {
  color: #718096;
  font-size: 16px;
  margin: 0;
}

.setup-form {
  margin-top: 24px;
}

.button-group {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.back-button {
  height: 48px;
  font-size: 16px;
  font-weight: 500;
  flex: 1;
}

.confirm-button {
  height: 48px;
  font-size: 16px;
  font-weight: 500;
  flex: 2;
}

:deep(.ant-input-affix-wrapper) {
  border-radius: 8px;
}

:deep(.ant-input) {
  border-radius: 8px;
}

:deep(.ant-select .ant-select-selector) {
  border-radius: 8px;
}

:deep(.ant-input-number) {
  border-radius: 8px;
  width: 100%;
}

:deep(.ant-input-number .ant-input-number-input) {
  border-radius: 8px;
}
</style>