<template>
  <div class="p-4">
    <a-card :title="$t('page.legalPlatform.confidentialityFile')">
      <a-table :columns="columns" :data-source="data" row-key="id">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <a-space>
              <a-button type="primary" size="small" @click="encrypt(record)">{{ $t('page.legalPlatform.encrypt') }}</a-button>
              <a-button size="small" @click="decrypt(record)">{{ $t('page.legalPlatform.decrypt') }}</a-button>
              <a-button type="link" size="small" @click="changePassword(record)">{{ $t('page.legalPlatform.changePassword') }}</a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>
    <a-modal v-model:visible="visible" :title="modalTitle" @ok="handleOk">
      <a-input v-model:value="password" :placeholder="$t('page.legalPlatform.enterPassword')" />
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { Table, Button, Card, Modal, Input, Space, message } from 'ant-design-vue';

const ATable = Table;
const AButton = Button;
const ACard = Card;
const AModal = Modal;
const AInput = Input;
const ASpace = Space;
const { t } = useI18n();

const columns = computed(() => [
  { title: t('page.legalPlatform.fileName'), dataIndex: 'name', key: 'name' },
  { title: t('page.legalPlatform.fileType'), dataIndex: 'type', key: 'type' },
  { title: t('page.legalPlatform.status'), dataIndex: 'status', key: 'status' },
  { title: t('page.legalPlatform.operation'), key: 'action' },
]);

const data = reactive([
  { id: '1', name: 'Contract.docx', type: 'File', status: 'Unencrypted' },
  { id: '2', name: 'Financials', type: 'Folder', status: 'Encrypted' },
  { id: '3', name: 'Presentation.pptx', type: 'File', status: 'Unencrypted' },
]);

const visible = ref(false);
const modalTitle = ref('');
const password = ref('');
const currentRecord = ref(null);

const encrypt = (record) => {
  currentRecord.value = record;
  modalTitle.value = t('page.legalPlatform.encrypt');
  visible.value = true;
};

const decrypt = (record) => {
  currentRecord.value = record;
  modalTitle.value = t('page.legalPlatform.decrypt');
  visible.value = true;
};

const changePassword = (record) => {
  currentRecord.value = record;
  modalTitle.value = t('page.legalPlatform.changePassword');
  visible.value = true;
};

const handleOk = () => {
  if (currentRecord.value) {
    if (modalTitle.value === t('page.legalPlatform.encrypt')) {
      currentRecord.value.status = 'Encrypted';
      message.success('加密成功');
    } else if (modalTitle.value === t('page.legalPlatform.decrypt')) {
      currentRecord.value.status = 'Unencrypted';
      message.success('解密成功');
    } else {
      message.success('密碼修改成功');
    }
  }
  visible.value = false;
  password.value = '';
};

</script>