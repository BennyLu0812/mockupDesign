<script setup lang="ts">
import { computed, ref, reactive, onMounted, watch } from 'vue';
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
  Divider,
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
    chineseName: '行政程序法典',
    portugueseName: 'Código do Procedimento Administrativo',
    publisher: '印務局',
    coverUrl: '/image/法律1.jpg',
    publishDate: '2025/07',
    language: 'zh-CN',
    price: 40.00,
    category: 'law',
    stock: 100
  },
  {
    id: '2',
    code: 'POL001',
    chineseName: '一國兩制”研究 2025年 第1期(總第53期)',
    portugueseName: 'Revista de Estudos de Um País Dois Sistemas, 2025 No. 1',
    publisher: '澳門理工大學 - 一國兩制研究中心',
    coverUrl: '/image/政治行政1.jpg',
    publishDate: '2025/04',
    language: 'zh-CN',
    price: 50.00,
    category: 'politics',
    stock: 50
  },
  {
    id: '3',
    code: 'ECO001',
    chineseName: '澳門藍皮書 -- 澳門經濟社會發展報告(2021-2022)',
    portugueseName: 'Blue Book of Macau - Annual Report on Economy and Society of Macau (2021-2022)',
    publisher: '澳門基金會',
    coverUrl: '/image/經濟1.jpg',
    publishDate: '2025/04',
    language: 'zh-CN',
    price: 200.00,
    category: 'economy',
    stock: 75
  },
  {
    id: '4',
    code: 'EDU001',
    chineseName: '中葡會展口譯',
    portugueseName: 'Interpretação de Convenções e Exposições Chinês-Português',
    publisher: '澳門理工大學',
    coverUrl: '/image/教育1.jpg',
    publishDate: '2023/08',
    language: 'zh-CN',
    price: 120.00,
    category: 'education',
    stock: 30
  },
  {
    id: '5',
    code: 'HIS001',
    chineseName: 'Review of Culture - International Edition 77',
    portugueseName: 'Review of Culture - International Edition 77',
    publisher: '澳門特別行政區政府文化局',
    coverUrl: '/image/歷史.jpg',
    publishDate: '2025',
    language: 'zh-CN',
    price: 150.00,
    category: 'history',
    stock: 40
  },
  {
    id: '6',
    code: 'LIT001',
    chineseName: 'Cross and Dragon',
    portugueseName: 'Cross and Dragon',
    publisher: '澳門基金會',
    coverUrl: '/image/文學.jpg',
    publishDate: '2025',
    language: 'zh-CN',
    price: 200.00,
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

// 優惠折扣相關數據
const discountInfo = reactive({
  type: 'none', // none, percentage, fixed
  value: 0,
  originalAmount: 0,
  discountAmount: 0
});

// 掛單相關數據
const heldOrdersModalVisible = ref(false);
const heldOrdersLoading = ref(false);

// 圖片預覽相關數據
const imagePreviewVisible = ref(false);
const previewImageUrl = ref('');
const previewImageName = ref('');
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
    customRender: ({ record }: { record: CartItem }) => `MOP ${record.product.price.toFixed(2)}`
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
    customRender: ({ record }: { record: CartItem }) => `MOP ${record.subtotal.toFixed(2)}`
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

// 優惠折扣選項
const discountOptions = [
  { label: '無折扣', value: 'none', discount: 0 },
  { label: '會員折扣 (9折)', value: 'member', discount: 0.1 },
  { label: '學生折扣 (8.5折)', value: 'student', discount: 0.15 },
  { label: '員工折扣 (8折)', value: 'employee', discount: 0.2 },
  { label: '批發折扣 (7.5折)', value: 'wholesale', discount: 0.25 },
  { label: '促銷折扣 (7折)', value: 'promotion', discount: 0.3 },
  { label: '清倉折扣 (5折)', value: 'clearance', discount: 0.5 }
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
  
  // 初始化折扣信息
  discountInfo.type = 'none';
  discountInfo.value = 0;
  discountInfo.originalAmount = totalAmount.value;
  discountInfo.discountAmount = 0;
  
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

// 計算折扣
function calculateDiscount() {
  const selectedDiscount = discountOptions.find(option => option.value === discountInfo.type);
  if (selectedDiscount && selectedDiscount.discount > 0) {
    discountInfo.originalAmount = totalAmount.value;
    discountInfo.discountAmount = totalAmount.value * selectedDiscount.discount;
    paymentInfo.amount = totalAmount.value - discountInfo.discountAmount;
  } else {
    discountInfo.originalAmount = totalAmount.value;
    discountInfo.discountAmount = 0;
    paymentInfo.amount = totalAmount.value;
  }
  
  // 重新計算找零
  if (paymentInfo.method === 'cash') {
    paymentInfo.received = paymentInfo.amount;
    calculateChange();
  }
}

// 處理折扣變更
function handleDiscountChange() {
  calculateDiscount();
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

function handleHeldOrderRetrieve(record: any) {
  console.log('取回掛單:', record);
  // 這裡可以添加取回邏輯，例如將掛單商品重新加載到購物車
  heldOrdersModalVisible.value = false;
}

function handleHeldOrderDelete(record: any) {
  Modal.confirm({
    title: '確認刪除',
    content: `確定要刪除單據 ${record.documentNumber} 嗎？`,
    onOk() {
      // 從掛單列表中移除該記錄
      const index = heldOrders.value.findIndex(item => item.id === record.id);
      if (index > -1) {
        heldOrders.value.splice(index, 1);
        heldOrdersPagination.total--;
        message.success(`單據 ${record.documentNumber} 已刪除`);
      }
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

// 圖片預覽方法
function showImagePreview(imageUrl: string, imageName: string = '') {
  previewImageUrl.value = imageUrl;
  previewImageName.value = imageName;
  imagePreviewVisible.value = true;
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
    width: 150,
    customRender: ({ text }: { text: string }) => getLocationText(text)
  },
  {
    title: $t('pos.heldOrders.documentNumber'),
    dataIndex: 'documentNumber',
    key: 'documentNumber',
    width: 200
  },
  {
    title: $t('pos.heldOrders.saleDate'),
    dataIndex: 'saleDate',
    key: 'saleDate',
    width: 150
  },
  {
    title: $t('pos.heldOrders.operation'),
    key: 'operation',
    width: 200,
    align: 'center'
  }
];

// 監聽支付模態框狀態，防止頁面滾動
watch(paymentModalVisible, (newValue) => {
  if (newValue) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});

// 監聽掛單模態框狀態，防止頁面滾動
watch(heldOrdersModalVisible, (newValue) => {
  if (newValue) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});

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
                    <div class="text-sm">MOP {{ item.product.price.toFixed(2) }}</div>
                    <InputNumber 
                      v-model:value="item.quantity"
                      :min="1"
                      :max="item.product.stock"
                      size="small"
                      class="w-16"
                      @change="(value) => updateQuantity(index, value || 1)"
                    />
                    <div class="font-medium">MOP {{ item.subtotal.toFixed(2) }}</div>
                  </div>
                </div>
                
                <div class="cart-total mt-4 pt-4 border-t">
                  <div class="flex justify-between items-center text-lg font-bold">
                    <span>{{ $t('pos.cart.totalAmount') }}:</span>
              <span class="text-red-600">MOP {{ totalAmount.toFixed(2) }}</span>
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
                      <div class="product-cover mb-2 cursor-pointer" @click="showImagePreview(product.coverUrl, product.chineseName)">
                        <img 
                          :src="product.coverUrl" 
                          :alt="product.chineseName"
                          class="w-full h-32 object-contain rounded hover:opacity-80 transition-opacity"
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
                            MOP {{ product.price.toFixed(2) }}
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
    
    <!-- 支付滑動面板 -->
    <div class="payment-panel-container">
      <!-- 遮罩層 -->
      <div 
        v-if="paymentModalVisible" 
        class="payment-overlay"
        @click="paymentModalVisible = false"
      ></div>
      
      <!-- 滑動面板 -->
      <div 
        class="payment-panel" 
        :class="{ 'panel-open': paymentModalVisible }"
      >
        <!-- 頭部 -->
        <div class="payment-header">
          <div class="header-content">
            <Button 
              type="text" 
              size="large" 
              @click="paymentModalVisible = false"
              class="close-btn"
            >
              <template #icon>
                <span class="icon-[lucide--x] size-5" />
              </template>
            </Button>
            <h2 class="header-title">{{ $t('pos.payment.title') }}</h2>
          </div>
        </div>

        <!-- 內容區域 -->
        <div class="payment-content">
          <div class="payment-amount mb-6">
            <div class="text-center">
              <div v-if="discountInfo.discountAmount > 0" class="mb-2">
                <div class="text-lg text-gray-500 line-through">
                  原價: MOP {{ discountInfo.originalAmount.toFixed(2) }}
                </div>
                <div class="text-sm text-green-600 font-medium">
                  已優惠: MOP {{ discountInfo.discountAmount.toFixed(2) }}
                </div>
              </div>
              <div class="text-2xl font-bold">
                {{ $t('pos.payment.amount') }}: 
                <span class="text-red-600">MOP {{ paymentInfo.amount.toFixed(2) }}</span>
              </div>
            </div>
          </div>
          
          <!-- 優惠折扣選項 -->
          <div class="discount-section mb-6">
            <div class="mb-3 text-lg font-medium">優惠折扣:</div>
            <Select
              v-model:value="discountInfo.type"
              :options="discountOptions"
              class="w-full"
              size="large"
              @change="handleDiscountChange"
            />
            
            <!-- 折扣詳情 -->
            <div v-if="discountInfo.discountAmount > 0" class="discount-details mt-3 p-3 bg-green-50 rounded">
              <div class="flex justify-between text-sm">
                <span>原價:</span>
                <span>MOP {{ discountInfo.originalAmount.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-sm text-green-600">
                <span>折扣:</span>
                <span>-MOP {{ discountInfo.discountAmount.toFixed(2) }}</span>
              </div>
              <Divider class="my-2" />
              <div class="flex justify-between font-medium">
                <span>實付金額:</span>
                <span class="text-red-600">MOP {{ paymentInfo.amount.toFixed(2) }}</span>
              </div>
            </div>
          </div>
          
          <div class="payment-method mb-6">
            <div class="mb-3 text-lg font-medium">{{ $t('pos.payment.title') }}:</div>
            <Radio.Group v-model:value="paymentInfo.method" class="w-full">
              <Space direction="vertical" class="w-full" size="large">
                <Radio 
                  v-for="method in paymentMethods" 
                  :key="method.value" 
                  :value="method.value"
                  class="payment-radio"
                >
                  {{ method.label }}
                </Radio>
              </Space>
            </Radio.Group>
          </div>
          
          <div v-if="paymentInfo.method === 'cash'" class="cash-payment mb-6">
            <div class="mb-4">
              <label class="block mb-2 text-lg font-medium">{{ $t('pos.payment.received') }}:</label>
              <InputNumber
                v-model:value="paymentInfo.received"
                :min="paymentInfo.amount"
                :precision="2"
                class="w-full"
                size="large"
                @change="calculateChange"
              />
            </div>
            
            <div class="change-amount">
              <div class="flex justify-between items-center text-xl">
                <span>{{ $t('pos.payment.change') }}:</span>
                <span class="font-bold text-green-600">MOP {{ paymentInfo.change.toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 底部操作區 -->
        <div class="payment-footer">
          <Row :gutter="16">
            <Col :span="12">
              <Button block size="large" @click="paymentModalVisible = false">
                {{ $t('pos.actions.cancel') }}
              </Button>
            </Col>
            <Col :span="12">
              <Button type="primary" block size="large" @click="confirmPayment">
                {{ $t('pos.actions.confirm') }}
              </Button>
            </Col>
          </Row>
        </div>
      </div>
    </div>

    <!-- 掛單列表滑動面板 -->
    <div class="held-orders-panel-container">
      <!-- 遮罩層 -->
      <div 
        v-if="heldOrdersModalVisible" 
        class="held-orders-overlay"
        @click="heldOrdersModalVisible = false"
      ></div>
      
      <!-- 滑動面板 -->
      <div 
        class="held-orders-panel" 
        :class="{ 'panel-open': heldOrdersModalVisible }"
      >
        <!-- 頭部 -->
        <div class="held-orders-header">
          <div class="header-content">
            <Button 
              type="text" 
              size="large" 
              @click="heldOrdersModalVisible = false"
              class="close-btn"
            >
              <template #icon>
                <span class="icon-[lucide--x] size-5" />
              </template>
            </Button>
            <h2 class="header-title">{{ $t('pos.heldOrders.title') }}</h2>
          </div>
        </div>

        <!-- 內容區域 -->
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
            :scroll="{ x: 700 }"
            rowKey="id"
            @change="handleHeldOrdersTableChange"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'operation'">
                <Space>
                  <Button 
                    type="primary" 
                    size="small" 
                    @click="handleHeldOrderRetrieve(record)"
                  >
                    取回
                  </Button>
                  <Button 
                    danger 
                    size="small" 
                    @click="handleHeldOrderDelete(record)"
                  >
                    刪除
                  </Button>
                </Space>
              </template>
            </template>
          </Table>
        </div>
        
        <!-- 底部操作區 -->
        <div class="held-orders-footer">
          <div class="flex justify-end">
            <Button size="large" @click="heldOrdersModalVisible = false">
              {{ $t('pos.heldOrders.close') }}
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- 圖片預覽滑動面板 -->
     <div class="image-preview-panel-container">
       <!-- 遮罩層 -->
       <div 
         v-if="imagePreviewVisible" 
         class="image-preview-overlay"
         @click="imagePreviewVisible = false"
       ></div>
       
       <!-- 滑動面板 -->
       <div 
         class="image-preview-panel" 
         :class="{ 'panel-open': imagePreviewVisible }"
       >
         <!-- 頭部 -->
         <div class="image-preview-header">
           <div class="header-content">
             <Button 
               type="text" 
               size="large" 
               @click="imagePreviewVisible = false"
               class="close-btn"
             >
               <template #icon>
                 <span class="icon-[lucide--x] size-5" />
               </template>
             </Button>
             <h2 class="header-title">{{ previewImageName || '圖片預覽' }}</h2>
           </div>
         </div>

         <!-- 內容區域 -->
         <div class="image-preview-content">
           <div class="image-container">
             <img 
               :src="previewImageUrl" 
               :alt="previewImageName"
               class="preview-image"
             />
           </div>
         </div>
       </div>
     </div>
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

/* 支付滑動面板樣式 */
.payment-panel-container {
  position: relative;
  z-index: 1000;
}

.payment-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.45);
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
}

.payment-panel {
  position: fixed;
  top: 0;
  right: -100%;
  width: 500px;
  max-width: 90vw;
  height: 100vh;
  background: #fff;
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.15);
  transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1001;
  display: flex;
  flex-direction: column;
}

.payment-panel.panel-open {
  right: 0;
}

.payment-header {
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

.payment-content {
  flex: 1;
  padding: 32px 24px;
  overflow-y: auto;
}

.payment-radio {
  padding: 12px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  transition: all 0.2s;
  width: 100%;
  margin: 0;
}

.payment-radio:hover {
  border-color: #1890ff;
  background-color: #f6ffed;
}

.payment-radio.ant-radio-wrapper-checked {
  border-color: #1890ff;
  background-color: #e6f7ff;
}

.payment-footer {
  flex-shrink: 0;
  padding: 20px 24px;
  border-top: 1px solid #f0f0f0;
  background: #fafafa;
}

/* 掛單滑動面板樣式 */
.held-orders-panel-container {
  position: relative;
  z-index: 1000;
}

.held-orders-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.45);
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
}

.held-orders-panel {
  position: fixed;
  top: 0;
  right: -100%;
  width: 800px;
  max-width: 90vw;
  height: 100vh;
  background: #fff;
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.15);
  transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1001;
  display: flex;
  flex-direction: column;
}

.held-orders-panel.panel-open {
  right: 0;
}

.held-orders-header {
  flex-shrink: 0;
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
  background: #fafafa;
}

.held-orders-content {
  flex: 1;
  padding: 32px 24px;
  overflow-y: auto;
}

.held-orders-footer {
  flex-shrink: 0;
  padding: 20px 24px;
  border-top: 1px solid #f0f0f0;
  background: #fafafa;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 圖片預覽滑動面板樣式 */
.image-preview-panel-container {
  position: relative;
  z-index: 1000;
}

.image-preview-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.45);
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
}

.image-preview-panel {
  position: fixed;
  top: 0;
  right: -100%;
  width: 800px;
  max-width: 90vw;
  height: 100vh;
  background: #fff;
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.15);
  transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1001;
  display: flex;
  flex-direction: column;
}

.image-preview-panel.panel-open {
  right: 0;
}

.image-preview-header {
  flex-shrink: 0;
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
  background: #fafafa;
}

.image-preview-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 折扣相關樣式 */
.discount-section {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 16px;
  background: #fafafa;
}

.discount-details {
  border: 1px solid #d9f7be;
  border-radius: 6px;
  background: linear-gradient(135deg, #f6ffed 0%, #f0f9ff 100%);
}

.payment-radio {
  padding: 12px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  margin-bottom: 8px;
  transition: all 0.3s;
  background: white;
}

.payment-radio:hover {
  border-color: #1890ff;
  box-shadow: 0 2px 4px rgba(24, 144, 255, 0.1);
}

.payment-radio.ant-radio-wrapper-checked {
  border-color: #1890ff;
  background: #f0f9ff;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.15);
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
  
  .payment-panel {
    width: 100%;
  }
  
  .payment-content {
    padding: 24px 16px;
  }
  
  .payment-footer {
    padding: 16px;
  }
  
  .held-orders-panel {
    width: 100%;
  }
  
  .held-orders-content {
    padding: 24px 16px;
  }
  
  .held-orders-footer {
    padding: 16px;
  }
  
  .discount-section {
    padding: 12px;
  }
  
  .image-preview-panel {
    width: 100%;
  }
  
  .image-preview-content {
    padding: 16px;
  }
}
</style>
