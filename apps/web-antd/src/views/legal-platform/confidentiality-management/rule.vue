<template>
  <div class="p-4">
    <a-card :title="t('page.legalPlatform.confidentialityRule')">
      <a-form :model="formState" layout="vertical">
        <a-form-item :label="t('page.legalPlatform.permissionLevel')">
          <a-select v-model:value="formState.permissionLevel">
            <a-select-option value="high">{{ t('page.legalPlatform.high') }}</a-select-option>
            <a-select-option value="medium">{{ t('page.legalPlatform.medium') }}</a-select-option>
            <a-select-option value="low">{{ t('page.legalPlatform.low') }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label="t('page.legalPlatform.declassificationRule')">
          <a-textarea v-model:value="formState.declassificationRule" :rows="4" />
        </a-form-item>
        <a-form-item :label="t('page.legalPlatform.automaticDeclassification')">
          <a-switch v-model:checked="formState.automaticDeclassification" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="onSubmit">{{ t('page.legalPlatform.save') }}</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { Form, Input, Select, Switch, Button, Card, message } from 'ant-design-vue';

const AForm = Form;
const AFormItem = Form.Item;
const ASelect = Select;
const ASelectOption = Select.Option;
const ATextarea = Input.TextArea;
const ASwitch = Switch;
const AButton = Button;
const ACard = Card;
const { t } = useI18n();

const formState = reactive({
  permissionLevel: 'medium',
  declassificationRule: '',
  automaticDeclassification: false,
});

const onSubmit = () => {
  console.log('submit!', formState);
  message.success('保存成功');
};
</script>