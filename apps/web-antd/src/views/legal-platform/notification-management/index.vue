<template>
  <div>
    <!-- 直接重定向到列表頁面 -->
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 組件掛載時自動重定向到列表頁面
onMounted(() => {
  router.replace('/legal-platform/notification-management/list');
});
</script>