<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { Form, FormItem, Input, Button, message } from 'ant-design-vue';
import { $t } from '@vben/locales';

defineOptions({ name: 'PosLogin' });

const router = useRouter();

// 登陸表單數據
const loginForm = reactive({
  username: '',
  password: ''
});

// 控制狀態
const loginLoading = ref(false);

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
    
    message.success('登陸成功');
    
    // 登陸成功，跳轉到銀錢箱設置頁面
    window.location.href = 'http://localhost:5666/cash-box-setup';
  } catch (error) {
    message.error('登陸失敗，請檢查用戶名和密碼');
  } finally {
    loginLoading.value = false;
  }
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
  </div>
</template>

<style scoped>
.pos-login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
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
