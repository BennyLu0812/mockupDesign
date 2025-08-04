<template>
  <div>
    <Form :model="formState" @finish="onFinish">
      <FormItem name="file" :label="t('versionManagement.selection.file')">
        <Upload>
          <Button>
            <span class="icon-[lucide--upload]" />
            {{ t('versionManagement.selection.upload') }}
          </Button>
        </Upload>
      </FormItem>
      <FormItem name="version" :label="t('versionManagement.selection.version')">
        <Select v-model:value="formState.version">
          <!-- Mock data, should be replaced with actual data from API -->
          <SelectOption value="v1.0a">v1.0a</SelectOption>
          <SelectOption value="v1.0b">v1.0b</SelectOption>
          <SelectOption value="v2.0">v2.0</SelectOption>
        </Select>
      </FormItem>
      <FormItem>
        <Button type="primary" html-type="submit">{{ t('versionManagement.selection.submit') }}</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { Button, Form, FormItem, Select, SelectOption, Upload, message } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const formState = reactive({
  version: '',
});

const onFinish = (values: any) => {
  console.log('Success:', values);
  message.success(t('versionManagement.selection.successMessage'));
};
</script>