<script setup lang="ts">
import { computed, ref, reactive, onMounted } from 'vue';
import { Page } from '@vben/common-ui';
import { $t } from '#/locales';
import { 
  Button, 
  Card, 
  Table, 
  Input, 
  Select, 
  Space, 
  Row, 
  Col, 
  InputNumber,
  Modal,
  Radio,
  message
} from 'ant-design-vue';
import type { 
  Product, 
  CartItem, 
  ProductCategory, 
  PaymentMethod,
  PaymentInfo,
  ProductSearchParams
} from '@vben/types';

// 模擬商品數據
const mockProducts: Product[] = [
  {
    id: '1',
    code: 'LAW001',
    chineseName: '澳門基本法',
    portugueseName: 'Lei Básica de Macau',
    publisher: '澳門特別行政區政府',
    coverUrl: '/api/placeholder/150/200',
    publishDate: '2023-01-15',
    language: 'zh-CN',
    price: 25.00,
    category: 'law',
    stock: 100
  },
  {
    id: '2',
    code: 'POL001',
    chineseName: '公共行政概論',
    portugueseName: 'Introdução à Administração Pública',
    publisher: '澳門大學出版社',
    coverUrl: '/api/placeholder/150/200',
    publishDate: '2023-02-20',
    language: 'zh-CN',
    price: 45.00,
    category: 'politics',
    stock: 50
  },
  {
    id: '3',
    code: 'ECO001',
    chineseName: '澳門經濟發展報告',
    portugueseName: 'Relatório de Desenvolvimento Económico de Macau',
    publisher: '澳門經濟學會',
    coverUrl: '/api/placeholder/150/200',
    publishDate: '2023-03-10',
    language: 'zh-CN',
    price: 35.00,
    category: 'economy',
    stock: 75
  },
  {
    id: '4',
    code: 'EDU001',
    chineseName: '澳門教育史',
    portugueseName: 'História da Educação em Macau',
    publisher: '澳門教育出版社',
    coverUrl: '/api/placeholder/150/200',
    publishDate: '2023-04-05',
    language: 'zh-CN',
    price: 55.00,
    category: 'education',
    stock: 30
  },
  {
    id: '5',
    code: 'HIS001',
    chineseName: '澳門歷史文化遺產',
    portugueseName: 'Património Histórico e Cultural de Macau',
    publisher: '澳門文化局',
    coverUrl: '/api/placeholder/150/200',
    publishDate: '2023-05-12',
    language: 'zh-CN',
    price: 65.00,
    category: 'history',
    stock: 40
  },
  {
    id: '6',
    code: 'LIT001',
    chineseName: '澳門文學選集',
    portugueseName: 'Antologia Literária de Macau',
    publisher: '澳門作家協會',
    coverUrl: '/api/placeholder/150/200',
    publishDate: '2023-06-18',
    language: 'zh-CN',
    price: 40.00,
    category: 'literature',
    stock: 60
  }
];

// 響應式數據
const cartItems = ref<CartItem[]>([]);
const searchParams = reactive<ProductSearchParams>({
  keyword: '',
  category: undefined,
  page: 1,
  pageSize: 12
});
const paymentModalVisible = ref(false);
const paymentInfo = reactive<PaymentInfo>({
  method: 'cash',
  amount: 0,
  received: 0,
  change: 0
});

// 掛單相關數據
const heldOrdersModalVisible = ref(false);
const heldOrdersLoading = ref(false);
const heldOrdersPagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 條記錄`
});

// 模擬掛單數據
const mockHeldOrders = ref([
  {
    id: '1',
    location: 'store1',
    documentNumber: 'POS20240101001',
    productName: '澳門基本法',
    saleDate: '2024-01-01',
    salesPersonId: 'SP001',
    quantity: 2,
    unitPrice: 25.00,
    totalAmount: 50.00,
    status: 'pending',
    paymentType: 'cash'
  },
  {
    id: '2',
    location: 'store2',
    documentNumber: 'POS20240101002',
    productName: '公共行政概論',
    saleDate: '2024-01-01',
    salesPersonId: 'SP002',
    quantity: 1,
    unitPrice: 45.00,
    totalAmount: 45.00,
    status: 'pending',
    paymentType: 'electronic'
  },
  {
    id: '3',
    location: 'online',
    documentNumber: 'POS20240102001',
    productName: '澳門經濟發展報告',
    saleDate: '2024-01-02',
    salesPersonId: 'SP001',
    quantity: 3,
    unitPrice: 35.00,
    totalAmount: 105.00,
    status: 'pending',
    paymentType: 'cash'
  }
]);

const heldOrders = ref([...mockHeldOrders.value]);

// 計算屬性
const filteredProducts = computed(() => {
  let result = mockProducts;
  
  if (searchParams.keyword) {
    const keyword = searchParams.keyword.toLowerCase();
    result = result.filter(product => 
      product.chineseName.toLowerCase().includes(keyword) ||
      product.portugueseName.toLowerCase().includes(keyword) ||
      product.code.toLowerCase().includes(keyword)
    );
  }
  
  if (searchParams.category) {
    result = result.filter(product => product.category === searchParams.category);
  }
  
  return result;
});

const totalAmount = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.subtotal, 0);
});

const cartColumns = [
  {
    title: $t('pos.cart.productName'),
    dataIndex: 'productName',
    key: 'productName',
    width: '40%',
    customRender: ({ record }: { record: CartItem }) => record.product.chineseName
  },
  {
    title: $t('pos.cart.price'),
    dataIndex: 'price',
    key: 'price',
    width: '20%',
    customRender: ({ record }: { record: CartItem }) => `$${record.product.price.toFixed(2)}`
  },
  {
    title: $t('pos.cart.quantity'),
    dataIndex: 'quantity',
    key: 'quantity',
    width: '20%'
  },
  {
    title: $t('pos.cart.total'),
    dataIndex: 'subtotal',
    key: 'subtotal',
    width: '20%',
    customRender: ({ record }: { record: CartItem }) => `$${record.subtotal.toFixed(2)}`
  }
];

const categoryOptions = [
  { label: $t('pos.products.allCategories'), value: undefined },
  { label: $t('pos.categories.law'), value: 'law' },
  { label: $t('pos.categories.politics'), value: 'politics' },
  { label: $t('pos.categories.economy'), value: 'economy' },
  { label: $t('pos.categories.education'), value: 'education' },
  { label: $t('pos.categories.history'), value: 'history' },
  { label: $t('pos.categories.literature'), value: 'literature' },
  { label: $t('pos.categories.art'), value: 'art' },
  { label: $t('pos.categories.science'), value: 'science' },
  { label: $t('pos.categories.comprehensive'), value: 'comprehensive' }
];

const paymentMethods = [
  { label: $t('pos.payment.cash'), value: 'cash' },
  { label: $t('pos.payment.govPay'), value: 'govPay' },
  { label: $t('pos.payment.bankPay'), value: 'bankPay' },
  { label: $t('pos.payment.creditCard'), value: 'creditCard' },
  { label: $t('pos.payment.other'), value: 'other' }
];

// 方法
function addToCart(product: Product) {
  const existingItem = cartItems.value.find(item => item.product.id === product.id);
  
  if (existingItem) {
    existingItem.quantity += 1;
    existingItem.subtotal = existingItem.quantity * existingItem.product.price;
  } else {
    cartItems.value.push({
      product,
      quantity: 1,
      subtotal: product.price
    });
  }
  
  message.success(`${product.chineseName} ${$t('pos.products.addToCart')}`);
}

function removeFromCart(index: number) {
  cartItems.value.splice(index, 1);
}

function clearCart() {
  cartItems.value = [];
}

function updateQuantity(index: number, quantity: number) {
  if (quantity <= 0) {
    removeFromCart(index);
    return;
  }
  
  const item = cartItems.value[index];
  item.quantity = quantity;
  item.subtotal = quantity * item.product.price;
}

function openPaymentModal() {
  if (cartItems.value.length === 0) {
    message.warning($t('pos.cart.empty'));
    return;
  }
  
  paymentInfo.amount = totalAmount.value;
  paymentInfo.received = totalAmount.value;
  paymentInfo.change = 0;
  paymentModalVisible.value = true;
}

function calculateChange() {
  if (paymentInfo.method === 'cash' && paymentInfo.received) {
    paymentInfo.change = Math.max(0, paymentInfo.received - paymentInfo.amount);
  } else {
    paymentInfo.change = 0;
  }
}

function confirmPayment() {
  if (paymentInfo.method === 'cash' && paymentInfo.received < paymentInfo.amount) {
    message.error('實收金額不足');
    return;
  }
  
  // 模擬支付處理
  message.success('支付成功！');
  clearCart();
  paymentModalVisible.value = false;
}

function holdOrder() {
  if (cartItems.value.length === 0) {
    message.warning($t('pos.cart.empty'));
    return;
  }
  
  // 模擬掛單處理
  message.success('訂單已掛起');
  clearCart();
}

function getCategoryLabel(category: ProductCategory) {
  return $t(`pos.categories.${category}`);
}

// 掛單相關方法
function showHeldOrdersModal() {
  heldOrdersModalVisible.value = true;
  loadHeldOrders();
}

function loadHeldOrders() {
  heldOrdersLoading.value = true;
  
  // 模擬API調用
  setTimeout(() => {
    heldOrders.value = [...mockHeldOrders.value];
    heldOrdersPagination.total = heldOrders.value.length;
    heldOrdersLoading.value = false;
  }, 500);
}

function handleHeldOrderSettle(record: any) {
  Modal.confirm({
    title: '確認結算',
    content: `確定要結算單據 ${record.documentNumber} 嗎？`,
    onOk() {
      // 打開支付界面
      paymentInfo.amount = record.totalAmount;
      paymentInfo.received = record.totalAmount;
      paymentInfo.change = 0;
      paymentModalVisible.value = true;
      
      // 關閉掛單模態框
      heldOrdersModalVisible.value = false;
      
      message.success(`正在為單據 ${record.documentNumber} 進行結算`);
    }
  });
}

function getLocationText(location: string) {
  const locationMap: Record<string, string> = {
    'store1': $t('pos.salesRecords.locationOptions.store1'),
    'store2': $t('pos.salesRecords.locationOptions.store2'),
    'online': $t('pos.salesRecords.locationOptions.online')
  };
  return locationMap[location] || location;
}

function getPaymentTypeText(paymentType: string) {
  const paymentTypeMap: Record<string, string> = {
    'cash': $t('pos.salesRecords.paymentTypeOptions.cash'),
    'electronic': $t('pos.salesRecords.paymentTypeOptions.electronic')
  };
  return paymentTypeMap[paymentType] || paymentType;
}

function handleHeldOrdersTableChange(pagination: any) {
  heldOrdersPagination.current = pagination.current;
  heldOrdersPagination.pageSize = pagination.pageSize;
  loadHeldOrders();
}

// 掛單列表表格列定義
const heldOrdersColumns = [
  {
    title: $t('pos.heldOrders.location'),
    dataIndex: 'location',
    key: 'location',
    width: 120,
    customRender: ({ text }: { text: string }) => getLocationText(text)
  },
  {
    title: $t('pos.heldOrders.documentNumber'),
    dataIndex: 'documentNumber',
    key: 'documentNumber',
    width: 150
  },
  {
    title: $t('pos.heldOrders.productName'),
    dataIndex: 'productName',
    key: 'productName',
    width: 200
  },
  {
    title: $t('pos.heldOrders.saleDate'),
    dataIndex: 'saleDate',
    key: 'saleDate',
    width: 120
  },
  {
    title: $t('pos.heldOrders.salesPersonId'),
    dataIndex: 'salesPersonId',
    key: 'salesPersonId',
    width: 120
  },
  {
    title: $t('pos.heldOrders.quantity'),
    dataIndex: 'quantity',
    key: 'quantity',
    width: 80,
    align: 'center'
  },
  {
    title: $t('pos.heldOrders.unitPrice'),
    dataIndex: 'unitPrice',
    key: 'unitPrice',
    width: 100,
    align: 'right',
    customRender: ({ text }: { text: number }) => `$${text.toFixed(2)}`
  },
  {
    title: $t('pos.heldOrders.totalAmount'),
    dataIndex: 'totalAmount',
    key: 'totalAmount',
    width: 120,
    align: 'right',
    customRender: ({ text }: { text: number }) => `$${text.toFixed(2)}`
  },
  {
    title: $t('pos.heldOrders.status'),
    dataIndex: 'status',
    key: 'status',
    width: 100,
    customRender: ({ text }: { text: string }) => $t(`pos.salesRecords.statusOptions.${text}`)
  },
  {
    title: $t('pos.heldOrders.paymentType'),
    dataIndex: 'paymentType',
    key: 'paymentType',
    width: 120,
    customRender: ({ text }: { text: string }) => getPaymentTypeText(text)
  },
  {
    title: $t('pos.heldOrders.operation'),
    key: 'operation',
    width: 100,
    align: 'center'
  }
];

onMounted(() => {
  // 組件掛載時的初始化邏輯
  heldOrdersPagination.total = mockHeldOrders.value.length;
});
</script>

<template>
  <Page :title="$t('pos.settlement')">
    <div class="settlement-container">
      <Row :gutter="16" class="h-full">
        <!-- 左側購物車 -->
        <Col :span="6" class="cart-section">
          <Card :title="$t('pos.cart.title')" class="h-full">
            <div class="cart-content">
              <div v-if="cartItems.length === 0" class="empty-cart">
                <div class="text-center text-gray-500 py-8">
                  <span class="icon-[lucide--shopping-cart] text-4xl mb-2 block"></span>
                  {{ $t('pos.cart.empty') }}
                </div>
              </div>
              
              <div v-else class="cart-items">
                <div 
                  v-for="(item, index) in cartItems" 
                  :key="item.product.id"
                  class="cart-item mb-3 p-3 border rounded"
                >
                  <div class="flex justify-between items-start mb-2">
                    <div class="flex-1 mr-2">
                      <div class="font-medium text-sm">{{ item.product.chineseName }}</div>
                      <div class="text-xs text-gray-500">{{ item.product.code }}</div>
                    </div>
                    <Button 
                      type="text" 
                      danger 
                      size="small"
                      @click="removeFromCart(index)"
                    >
                      <span class="icon-[lucide--x] text-sm"></span>
                    </Button>
                  </div>
                  
                  <div class="flex justify-between items-center">
                    <div class="text-sm">${{ item.product.price.toFixed(2) }}</div>
                    <InputNumber 
                      v-model:value="item.quantity"
                      :min="1"
                      :max="item.product.stock"
                      size="small"
                      class="w-16"
                      @change="(value) => updateQuantity(index, value || 1)"
                    />
                    <div class="font-medium">${{ item.subtotal.toFixed(2) }}</div>
                  </div>
                </div>
                
                <div class="cart-total mt-4 pt-4 border-t">
                  <div class="flex justify-between items-center text-lg font-bold">
                    <span>{{ $t('pos.cart.totalAmount') }}:</span>
                    <span class="text-red-600">${{ totalAmount.toFixed(2) }}</span>
                  </div>
                </div>
              </div>
              
              <div class="cart-actions mt-4 space-y-2">
                <Button 
                  type="primary" 
                  block 
                  size="large"
                  :disabled="cartItems.length === 0"
                  @click="openPaymentModal"
                >
                  <span class="icon-[lucide--credit-card] mr-2"></span>
                  {{ $t('pos.actions.checkout') }}
                </Button>
                
                <Row :gutter="8">
                  <Col :span="12">
                    <Button 
                      block
                      :disabled="cartItems.length === 0"
                      @click="holdOrder"
                    >
                      <span class="icon-[lucide--pause] mr-1"></span>
                      {{ $t('pos.actions.hold') }}
                    </Button>
                  </Col>
                  <Col :span="12">
                    <Button 
                      block
                      :disabled="cartItems.length === 0"
                      @click="clearCart"
                    >
                      <span class="icon-[lucide--trash-2] mr-1"></span>
                      {{ $t('pos.cart.clear') }}
                    </Button>
                  </Col>
                </Row>
                
                <!-- 查看掛單按鈕 -->
                <Button 
                  block 
                  size="large"
                  @click="showHeldOrdersModal"
                >
                  <span class="icon-[lucide--list] mr-2"></span>
                  {{ $t('pos.actions.viewHeldOrders') }}
                </Button>
              </div>
            </div>
          </Card>
        </Col>
        
        <!-- 右側商品展示 -->
        <Col :span="18" class="products-section">
          <Card :title="$t('pos.products.title')" class="h-full">
            <!-- 搜索和篩選 -->
            <div class="search-filters mb-4">
              <Row :gutter="16">
                <Col :span="12">
                  <Input.Search
                    v-model:value="searchParams.keyword"
                    :placeholder="$t('pos.products.searchPlaceholder')"
                    allow-clear
                  >
                    <template #prefix>
                      <span class="icon-[lucide--search] text-gray-400"></span>
                    </template>
                  </Input.Search>
                </Col>
                <Col :span="8">
                  <Select
                    v-model:value="searchParams.category"
                    :placeholder="$t('pos.products.category')"
                    :options="categoryOptions"
                    allow-clear
                    class="w-full"
                  />
                </Col>
              </Row>
            </div>
            
            <!-- 商品網格 -->
            <div class="products-grid">
              <Row :gutter="[16, 16]">
                <Col 
                  v-for="product in filteredProducts" 
                  :key="product.id"
                  :span="6"
                >
                  <Card 
                    hoverable
                    class="product-card h-full"
                    :body-style="{ padding: '12px' }"
                  >
                    <div class="product-content">
                      <!-- 封面圖片 -->
                      <div class="product-cover mb-2">
                        <img 
                          :src="product.coverUrl" 
                          :alt="product.chineseName"
                          class="w-full h-32 object-cover rounded"
                        />
                      </div>
                      
                      <!-- 商品信息 -->
                      <div class="product-info">
                        <div class="product-title mb-1">
                          <div class="text-sm font-medium line-clamp-2">{{ product.chineseName }}</div>
                          <div class="text-xs text-gray-500 line-clamp-1">{{ product.portugueseName }}</div>
                        </div>
                        
                        <div class="product-meta text-xs text-gray-500 mb-2">
                          <div>{{ product.publisher }}</div>
                          <div>{{ product.publishDate }}</div>
                          <div>{{ getCategoryLabel(product.category) }}</div>
                        </div>
                        
                        <div class="product-footer flex justify-between items-center">
                          <div class="product-price text-lg font-bold text-red-600">
                            ${{ product.price.toFixed(2) }}
                          </div>
                          <Button 
                            type="primary" 
                            size="small"
                            :disabled="product.stock <= 0"
                            @click="addToCart(product)"
                          >
                            <span class="icon-[lucide--plus] mr-1"></span>
                            {{ $t('pos.products.addToCart') }}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Col>
              </Row>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
    
    <!-- 支付模態框 -->
    <Modal
      v-model:open="paymentModalVisible"
      :title="$t('pos.payment.title')"
      width="500px"
      :footer="null"
    >
      <div class="payment-content">
        <div class="payment-amount mb-4">
          <div class="text-lg font-bold text-center">
            {{ $t('pos.payment.amount') }}: 
            <span class="text-red-600">${{ paymentInfo.amount.toFixed(2) }}</span>
          </div>
        </div>
        
        <div class="payment-method mb-4">
          <div class="mb-2 font-medium">{{ $t('pos.payment.title') }}:</div>
          <Radio.Group v-model:value="paymentInfo.method" class="w-full">
            <Space direction="vertical" class="w-full">
              <Radio 
                v-for="method in paymentMethods" 
                :key="method.value" 
                :value="method.value"
              >
                {{ method.label }}
              </Radio>
            </Space>
          </Radio.Group>
        </div>
        
        <div v-if="paymentInfo.method === 'cash'" class="cash-payment mb-4">
          <div class="mb-2">
            <label class="block mb-1 font-medium">{{ $t('pos.payment.received') }}:</label>
            <InputNumber
              v-model:value="paymentInfo.received"
              :min="paymentInfo.amount"
              :precision="2"
              class="w-full"
              @change="calculateChange"
            />
          </div>
          
          <div class="change-amount">
            <div class="flex justify-between items-center text-lg">
              <span>{{ $t('pos.payment.change') }}:</span>
              <span class="font-bold text-green-600">${{ paymentInfo.change.toFixed(2) }}</span>
            </div>
          </div>
        </div>
        
        <div class="payment-actions">
          <Row :gutter="16">
            <Col :span="12">
              <Button block @click="paymentModalVisible = false">
                {{ $t('pos.actions.cancel') }}
              </Button>
            </Col>
            <Col :span="12">
              <Button type="primary" block @click="confirmPayment">
                {{ $t('pos.actions.confirm') }}
              </Button>
            </Col>
          </Row>
        </div>
      </div>
    </Modal>

    <!-- 掛單列表模態框 -->
    <Modal
      v-model:open="heldOrdersModalVisible"
      :title="$t('pos.heldOrders.title')"
      width="1200px"
      :footer="null"
      :destroyOnClose="true"
    >
      <div class="held-orders-content">
        <Table
          :columns="heldOrdersColumns"
          :dataSource="heldOrders"
          :loading="heldOrdersLoading"
          :pagination="{
            current: heldOrdersPagination.current,
            pageSize: heldOrdersPagination.pageSize,
            total: heldOrdersPagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 條，共 ${total} 條記錄`
          }"
          :scroll="{ x: 1000 }"
          rowKey="id"
          @change="handleHeldOrdersTableChange"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'operation'">
              <Space>
                <Button 
                  type="primary" 
                  size="small" 
                  @click="handleHeldOrderSettle(record)"
                >
                  {{ $t('pos.heldOrders.settle') }}
                </Button>
              </Space>
            </template>
          </template>
        </Table>
      </div>
      
      <template #footer>
        <div class="flex justify-end">
          <Button @click="heldOrdersModalVisible = false">
            {{ $t('pos.heldOrders.close') }}
          </Button>
        </div>
      </template>
    </Modal>
  </Page>
</template>

<style scoped>
.settlement-container {
  height: calc(100vh - 200px);
}

.cart-section .ant-card,
.products-section .ant-card {
  height: 100%;
}

.cart-content {
  height: calc(100% - 60px);
  display: flex;
  flex-direction: column;
}

.cart-items {
  flex: 1;
  overflow-y: auto;
  max-height: calc(100vh - 400px);
}

.cart-item {
  transition: all 0.2s;
}

.cart-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.products-grid {
  height: calc(100vh - 350px);
  overflow-y: auto;
}

.product-card {
  transition: all 0.2s;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.product-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.product-footer {
  margin-top: auto;
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.empty-cart {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.payment-content {
  padding: 16px 0;
}

/* 響應式設計 */
@media (max-width: 1200px) {
  .products-grid .ant-col {
    flex: 0 0 33.333333%;
    max-width: 33.333333%;
  }
}

@media (max-width: 768px) {
  .settlement-container .ant-row {
    flex-direction: column;
  }
  
  .cart-section,
  .products-section {
    width: 100%;
    margin-bottom: 16px;
  }
  
  .products-grid .ant-col {
    flex: 0 0 50%;
    max-width: 50%;
  }
}
</style>