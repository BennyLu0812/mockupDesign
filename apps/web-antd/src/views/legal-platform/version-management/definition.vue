<template>
  <div>
    <Form :model="formState" @finish="onFinish">
      <FormItem name="version" :label="t('versionManagement.definition.version')">
        <Input v-model:value="formState.version" />
      </FormItem>
      <FormItem>
        <Button type="primary" html-type="submit">{{ t('versionManagement.definition.submit') }}</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { Button, Form, FormItem, Input, message } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const formState = reactive({
  version: '',
});

const onFinish = (values: any) => {
  console.log('Success:', values);
  message.success(t('versionManagement.definition.successMessage'));
};
</script>