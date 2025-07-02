<template>
  <div class="sales-record-detail">
    <!-- 滑動面板 -->
    <div 
      class="detail-panel" 
      :class="{ 'panel-open': visible }"
    >
      <!-- 頭部 -->
      <div class="detail-header">
        <div class="header-content">
          <Button 
            type="text" 
            size="large" 
            @click="handleClose"
            class="close-btn"
          >
            <template #icon>
              <span class="icon-[lucide--x] size-5" />
            </template>
          </Button>
          <h2 class="header-title">{{ $t('pos.salesRecords.detailModal.title') }}</h2>
        </div>
      </div>

      <!-- 內容區域 -->
      <div class="detail-content" v-if="record">
        <!-- 上模塊：訂單詳情 -->
        <Card class="detail-section order-section">
          <template #title>
            <div class="section-title">
              <span class="icon-[lucide--file-text] size-5 mr-2" />
              訂單詳情
            </div>
          </template>
          
          <div class="detail-grid">
            <Row :gutter="[24, 16]">
              <Col :span="8">
                <div class="detail-item">
                  <span class="detail-label">訂單日期</span>
                  <span class="detail-value">{{ record.saleDate }}</span>
                </div>
              </Col>
              <Col :span="8">
                <div class="detail-item">
                  <span class="detail-label">單據編號</span>
                  <span class="detail-value">{{ record.documentNumber }}</span>
                </div>
              </Col>
              <Col :span="8">
                <div class="detail-item">
                  <span class="detail-label">所屬門店</span>
                  <span class="detail-value">{{ getLocationText(record.location) }}</span>
                </div>
              </Col>
            </Row>
            
            <Row :gutter="[24, 16]">
              <Col :span="8">
                <div class="detail-item">
                  <span class="detail-label">會員卡號</span>
                  <span class="detail-value">{{ record.memberCardNo || '-' }}</span>
                </div>
              </Col>
              <Col :span="8">
                <div class="detail-item">
                  <span class="detail-label">會員姓名（客戶）</span>
                  <span class="detail-value">{{ record.memberName || '散客' }}</span>
                </div>
              </Col>
              <Col :span="8">
                <div class="detail-item">
                  <span class="detail-label">會員等級</span>
                  <span class="detail-value">{{ record.memberLevel || '散客' }}</span>
                </div>
              </Col>
            </Row>
            
            <Row :gutter="[24, 16]">
              <Col :span="8">
                <div class="detail-item">
                  <span class="detail-label">獲得積分</span>
                  <span class="detail-value">{{ record.earnedPoints || 0 }}</span>
                </div>
              </Col>
              <Col :span="8">
                <div class="detail-item">
                  <span class="detail-label">消費模式</span>
                  <span class="detail-value">{{ record.consumptionMode || '商品收銀' }}</span>
                </div>
              </Col>
              <Col :span="8">
                <div class="detail-item">
                  <span class="detail-label">訂單備註</span>
                  <span class="detail-value">{{ record.orderNote || '-' }}</span>
                </div>
              </Col>
            </Row>
            
            <Row :gutter="[24, 16]" v-if="record.status === 'refunded'">
              <Col :span="8">
                <div class="detail-item">
                  <span class="detail-label">撤單人</span>
                  <span class="detail-value">{{ record.cancelledBy || '-' }}</span>
                </div>
              </Col>
              <Col :span="8">
                <div class="detail-item">
                  <span class="detail-label">撤單時間</span>
                  <span class="detail-value">{{ record.cancelledAt || '-' }}</span>
                </div>
              </Col>
              <Col :span="8">
                <div class="detail-item">
                  <span class="detail-label">撤單備註</span>
                  <span class="detail-value">{{ record.cancelNote || '-' }}</span>
                </div>
              </Col>
            </Row>
          </div>
        </Card>

        <!-- 中模塊：支付詳情 -->
        <Card class="detail-section payment-section">
          <template #title>
            <div class="section-title">
              <span class="icon-[lucide--credit-card] size-5 mr-2" />
              支付詳情
            </div>
          </template>
          
          <div class="payment-info">
            <Row :gutter="[32, 16]">
              <Col :span="12">
                <div class="payment-item">
                  <div class="payment-label">消費金額</div>
                  <div class="payment-amount">{{ formatCurrency(record.totalAmount) }}</div>
                </div>
              </Col>
              <Col :span="12">
                <div class="payment-item">
                  <div class="payment-label">支付方式</div>
                  <div class="payment-method">
                    <Tag 
                      :color="record.paymentType === 'cash' ? 'green' : 'blue'"
                      class="payment-tag"
                    >
                      {{ getPaymentTypeText(record.paymentType) }}
                    </Tag>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Card>

        <!-- 下模塊：印刷品詳情 -->
        <Card class="detail-section product-section">
          <template #title>
            <div class="section-title">
              <span class="icon-[lucide--package] size-5 mr-2" />
              印刷品詳情
            </div>
          </template>
          
          <Table 
            :columns="productColumns" 
            :data-source="productList" 
            :pagination="false"
            size="small"
            class="product-table"
          >
            <template #bodyCell="{ column, record: productRecord }">
              <template v-if="column.key === 'discountedPrice'">
                <span class="text-green-600 font-medium">
                  {{ formatCurrency(productRecord.discountedPrice) }}
                </span>
              </template>
              <template v-else-if="column.key === 'totalAmount'">
                <span class="text-blue-600 font-medium">
                  {{ formatCurrency(productRecord.totalAmount) }}
                </span>
              </template>
              <template v-else-if="column.key === 'actions'">
                <Button 
                  type="link" 
                  size="small" 
                  danger
                  @click="handleRefundProduct(productRecord)"
                  :disabled="record.status === 'refunded'"
                >
                  <template #icon>
                    <span class="icon-[lucide--undo-2] size-4" />
                  </template>
                  退貨
                </Button>
              </template>
            </template>
          </Table>
        </Card>
      </div>

      <!-- 底部操作區 -->
      <div class="detail-footer" v-if="record">
        <Space size="large">
          <Button 
            v-if="record.status === 'settled'" 
            type="default" 
            size="large"
            @click="handleRefund(record)"
          >
            <template #icon>
              <span class="icon-[lucide--undo-2] size-4" />
            </template>
            整單退款
          </Button>
          
          <Button type="primary" size="large" @click="handleInvoice(record)">
            <template #icon>
              <span class="icon-[lucide--file-text] size-4" />
            </template>
            開發票
          </Button>
          
          <Button size="large" @click="handleReceipt(record)">
            <template #icon>
              <span class="icon-[lucide--receipt] size-4" />
            </template>
            開收據
          </Button>
          
          <Button size="large" @click="handlePrint(record)">
            <template #icon>
              <span class="icon-[lucide--printer] size-4" />
            </template>
            打印
          </Button>
        </Space>
      </div>
    </div>

    <!-- 遮罩層 -->
    <div 
      v-if="visible" 
      class="detail-overlay" 
      @click="handleClose"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { $t } from '#/locales';
import {
  Button,
  Card,
  Col,
  Row,
  Space,
  Table,
  Tag,
  message,
} from 'ant-design-vue';
import type { SalesRecord, SalesLocation, SettlementType } from '@vben/types';
import type { TableColumnsType } from 'ant-design-vue';

interface ProductItem {
  id: string;
  type: string;
  code: string;
  name: string;
  specification: string;
  discountedPrice: number;
  quantity: number;
  totalAmount: number;
}

interface Props {
  visible: boolean;
  record: SalesRecord | null;
}

interface Emits {
  (e: 'close'): void;
  (e: 'refund', record: SalesRecord): void;
  (e: 'invoice', record: SalesRecord): void;
  (e: 'receipt', record: SalesRecord): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// 印刷品列表（模擬數據）
const productList = computed<ProductItem[]>(() => {
  if (!props.record) return [];
  
  return [
    {
      id: '1',
      type: '圖書',
      code: 'BOOK001',
      name: props.record.productName,
      specification: 'A4, 200頁',
      discountedPrice: props.record.unitPrice,
      quantity: props.record.quantity,
      totalAmount: props.record.totalAmount,
    }
  ];
});

// 印刷品表格列配置
const productColumns: TableColumnsType<ProductItem> = [
  {
    title: '印刷品類型',
    dataIndex: 'type',
    key: 'type',
    width: 100,
  },
  {
    title: '印刷品編號',
    dataIndex: 'code',
    key: 'code',
    width: 120,
  },
  {
    title: '印刷品名稱',
    dataIndex: 'name',
    key: 'name',
    width: 200,
    ellipsis: true,
  },
  {
    title: '印刷品規格',
    dataIndex: 'specification',
    key: 'specification',
    width: 120,
  },
  {
    title: '折後單價',
    dataIndex: 'discountedPrice',
    key: 'discountedPrice',
    width: 100,
    align: 'right',
  },
  {
    title: '印刷品數量',
    dataIndex: 'quantity',
    key: 'quantity',
    width: 100,
    align: 'center',
  },
  {
    title: '總金額',
    dataIndex: 'totalAmount',
    key: 'totalAmount',
    width: 100,
    align: 'right',
  },
  {
    title: '操作',
    key: 'actions',
    width: 80,
    align: 'center',
  },
];

// 工具函數
const getLocationText = (location: SalesLocation): string => {
  return $t(`pos.salesRecords.locationOptions.${location}`);
};

const getPaymentTypeText = (paymentType: SettlementType): string => {
  return $t(`pos.salesRecords.paymentTypeOptions.${paymentType}`);
};

const formatCurrency = (amount: number): string => {
  return `MOP ${amount.toFixed(2)}`;
};

// 事件處理
const handleClose = () => {
  emit('close');
};

const handleRefund = (record: SalesRecord) => {
  emit('refund', record);
};

const handleInvoice = (record: SalesRecord) => {
  emit('invoice', record);
};

const handleReceipt = (record: SalesRecord) => {
  emit('receipt', record);
};

const handlePrint = (record: SalesRecord) => {
  message.success(`正在打印單據 ${record.documentNumber}`);
};

const handleRefundProduct = (product: ProductItem) => {
  message.success(`正在退貨商品 ${product.name}`);
};

// 監聽visible變化，處理body滾動
watch(() => props.visible, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});
</script>

<style scoped>
.sales-record-detail {
  position: relative;
  z-index: 1000;
}

.detail-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.45);
  z-index: 1000;
}

.detail-panel {
  position: fixed;
  top: 0;
  right: -100%;
  width: 80%;
  max-width: 1200px;
  height: 100vh;
  background: #fff;
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.15);
  transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1001;
  display: flex;
  flex-direction: column;
}

.detail-panel.panel-open {
  right: 0;
}

.detail-header {
  flex-shrink: 0;
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
  background: #fafafa;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  transition: all 0.2s;
}

.close-btn:hover {
  background-color: #f5f5f5;
}

.header-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #262626;
}

.detail-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.detail-section {
  margin-bottom: 24px;
}

.detail-section:last-child {
  margin-bottom: 0;
}

.section-title {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.detail-grid {
  padding: 8px 0;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-label {
  font-size: 12px;
  color: #8c8c8c;
  font-weight: 500;
}

.detail-value {
  font-size: 14px;
  color: #262626;
  font-weight: 500;
}

.payment-info {
  padding: 16px 0;
}

.payment-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.payment-label {
  font-size: 14px;
  color: #8c8c8c;
  font-weight: 500;
}

.payment-amount {
  font-size: 28px;
  font-weight: 700;
  color: #52c41a;
}

.payment-method {
  display: flex;
  justify-content: center;
}

.payment-tag {
  font-size: 14px;
  padding: 4px 12px;
  border-radius: 6px;
}

.product-table {
  margin-top: 8px;
}

.product-table :deep(.ant-table-thead > tr > th) {
  background: #fafafa;
  font-weight: 600;
  font-size: 13px;
}

.product-table :deep(.ant-table-tbody > tr > td) {
  font-size: 13px;
}

.detail-footer {
  flex-shrink: 0;
  padding: 20px 24px;
  border-top: 1px solid #f0f0f0;
  background: #fafafa;
  display: flex;
  justify-content: center;
}

/* 響應式設計 */
@media (max-width: 1200px) {
  .detail-panel {
    width: 90%;
  }
}

@media (max-width: 768px) {
  .detail-panel {
    width: 100%;
  }
  
  .detail-content {
    padding: 16px;
  }
  
  .detail-footer {
    padding: 16px;
  }
}
</style>