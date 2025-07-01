<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { Form, FormItem, Input, Button, Select, Modal, InputNumber, message } from 'ant-design-vue';
import { $t } from '@vben/locales';

defineOptions({ name: 'PosLogin' });

const router = useRouter();

// 登陸表單數據
const loginForm = reactive({
  username: '',
  password: ''
});

// 銀錢箱設置表單數據
const cashBoxForm = reactive({
  salesLocation: '',
  cashBox: '',
  cashAmount: 0
});

// 控制狀態
const loginLoading = ref(false);
const showCashBoxModal = ref(false);
const cashBoxLoading = ref(false);

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

// 登陸處理
const handleLogin = async () => {
  if (!loginForm.username || !loginForm.password) {
    message.error('請填寫用戶名和密碼');
    return;
  }

  try {
    loginLoading.value = true;
    
    // 模擬登陸API調用
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 登陸成功，顯示銀錢箱設置彈框
    showCashBoxModal.value = true;
  } catch (error) {
    message.error('登陸失敗，請檢查用戶名和密碼');
  } finally {
    loginLoading.value = false;
  }
};

// 銀錢箱設置確認
const handleCashBoxConfirm = async () => {
  if (!cashBoxForm.salesLocation || !cashBoxForm.cashBox || !cashBoxForm.cashAmount) {
    message.error('請完整填寫銀錢箱信息');
    return;
  }

  try {
    cashBoxLoading.value = true;
    
    // 模擬保存銀錢箱設置
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 保存到本地存儲
    localStorage.setItem('pos_cash_box_setup', JSON.stringify(cashBoxForm));
    
    message.success('銀錢箱設置成功');
    showCashBoxModal.value = false;
    
    // 跳轉到結賬頁面
    router.push('/pos/settlement');
  } catch (error) {
    message.error('銀錢箱設置失敗');
  } finally {
    cashBoxLoading.value = false;
  }
};

// 取消銀錢箱設置
const handleCashBoxCancel = () => {
  showCashBoxModal.value = false;
  // 重置表單
  Object.assign(cashBoxForm, {
    salesLocation: '',
    cashBox: '',
    cashAmount: 0
  });
};

// 銷售地變化時重置銀錢箱選擇
const handleSalesLocationChange = () => {
  cashBoxForm.cashBox = '';
};
</script>

<template>
  <div class="pos-login-container">
    <div class="login-card">
      <div class="login-header">
        <h1 class="login-title">{{ $t('pos.login.title') }}</h1>
        <p class="login-subtitle">{{ $t('pos.title') }}</p>
      </div>
      
      <Form 
        :model="loginForm" 
        layout="vertical" 
        class="login-form"
        @finish="handleLogin"
      >
        <FormItem 
          :label="$t('pos.login.username')"
          name="username"
          :rules="[{ required: true, message: $t('pos.login.usernamePlaceholder') }]"
        >
          <Input 
            v-model:value="loginForm.username"
            :placeholder="$t('pos.login.usernamePlaceholder')"
            size="large"
          >
            <template #prefix>
              <span class="icon-[lucide--user] text-gray-400" />
            </template>
          </Input>
        </FormItem>
        
        <FormItem 
          :label="$t('pos.login.password')"
          name="password"
          :rules="[{ required: true, message: $t('pos.login.passwordPlaceholder') }]"
        >
          <Input.Password 
            v-model:value="loginForm.password"
            :placeholder="$t('pos.login.passwordPlaceholder')"
            size="large"
          >
            <template #prefix>
              <span class="icon-[lucide--lock] text-gray-400" />
            </template>
          </Input.Password>
        </FormItem>
        
        <FormItem>
          <Button 
            type="primary" 
            html-type="submit"
            :loading="loginLoading"
            size="large"
            block
            class="login-button"
          >
            {{ $t('pos.login.loginButton') }}
          </Button>
        </FormItem>
      </Form>
    </div>
    
    <!-- 銀錢箱設置彈框 -->
    <Modal
      v-model:open="showCashBoxModal"
      :title="$t('pos.login.cashBoxSetup.title')"
      :closable="false"
      :mask-closable="false"
      width="500px"
    >
      <Form 
        :model="cashBoxForm" 
        layout="vertical" 
        class="cash-box-form"
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
          />
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
          />
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
            addon-after="MOP"
          />
        </FormItem>
      </Form>
      
      <template #footer>
        <div class="flex justify-end space-x-2">
          <Button @click="handleCashBoxCancel">
            {{ $t('pos.login.cashBoxSetup.cancel') }}
          </Button>
          <Button 
            type="primary" 
            :loading="cashBoxLoading"
            @click="handleCashBoxConfirm"
          >
            {{ $t('pos.login.cashBoxSetup.confirm') }}
          </Button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<style scoped>
.pos-login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 400px;
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-title {
  font-size: 28px;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 8px;
}

.login-subtitle {
  color: #718096;
  font-size: 16px;
  margin: 0;
}

.login-form {
  margin-top: 24px;
}

.login-button {
  height: 48px;
  font-size: 16px;
  font-weight: 500;
  margin-top: 8px;
}

.cash-box-form {
  margin-top: 16px;
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
</style>