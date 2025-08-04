<template>
  <div>
    <Form :model="formState" @finish="onFinish">
      <FormItem name="mainVersion" :label="t('versionManagement.subDefinition.mainVersion')">
        <Select v-model:value="formState.mainVersion">
          <!-- Mock data, should be replaced with actual data from API -->
          <SelectOption value="v1.0">v1.0</SelectOption>
          <SelectOption value="v2.0">v2.0</SelectOption>
        </Select>
      </FormItem>
      <FormItem name="subVersion" :label="t('versionManagement.subDefinition.subVersion')">
        <Input v-model:value="formState.subVersion" />
      </FormItem>
      <FormItem>
        <Button type="primary" html-type="submit">{{ t('versionManagement.subDefinition.submit') }}</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { Button, Form, FormItem, Input, Select, SelectOption, message } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const formState = reactive({
  mainVersion: '',
  subVersion: '',
});

const onFinish = (values: any) => {
  console.log('Success:', values);
  message.success(t('versionManagement.subDefinition.successMessage'));
};
</script>