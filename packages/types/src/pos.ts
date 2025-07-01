/**
 * POS系統相關類型定義
 */

/** 印刷品分類 */
export type ProductCategory = 
  | 'law'
  | 'politics'
  | 'economy'
  | 'education'
  | 'history'
  | 'literature'
  | 'art'
  | 'science'
  | 'comprehensive';

/** 印刷品語言 */
export type ProductLanguage = 'zh-CN' | 'pt-PT' | 'en-US';

/** 支付方式 */
export type PaymentMethod = 
  | 'cash'
  | 'govPay'
  | 'bankPay'
  | 'creditCard'
  | 'other';

/** 印刷品信息 */
export interface Product {
  /** 商品ID */
  id: string;
  /** 商品編碼 */
  code: string;
  /** 中文名稱 */
  chineseName: string;
  /** 葡文名稱 */
  portugueseName: string;
  /** 出版機構 */
  publisher: string;
  /** 封面圖片URL */
  coverUrl: string;
  /** 出版日期 */
  publishDate: string;
  /** 語言 */
  language: ProductLanguage;
  /** 單價 */
  price: number;
  /** 分類 */
  category: ProductCategory;
  /** 庫存數量 */
  stock: number;
}

/** 購物車商品項 */
export interface CartItem {
  /** 商品信息 */
  product: Product;
  /** 購買數量 */
  quantity: number;
  /** 小計金額 */
  subtotal: number;
}

/** 支付信息 */
export interface PaymentInfo {
  /** 支付方式 */
  method: PaymentMethod;
  /** 支付金額 */
  amount: number;
  /** 實收金額（現金支付時使用） */
  received?: number;
  /** 找零金額（現金支付時使用） */
  change?: number;
}

/** 訂單信息 */
export interface Order {
  /** 訂單ID */
  id: string;
  /** 訂單編號 */
  orderNo: string;
  /** 購物車商品列表 */
  items: CartItem[];
  /** 總金額 */
  totalAmount: number;
  /** 支付信息 */
  payment: PaymentInfo;
  /** 創建時間 */
  createTime: string;
  /** 操作員ID */
  operatorId: string;
}

/** 商品搜索條件 */
export interface ProductSearchParams {
  /** 搜索關鍵字 */
  keyword?: string;
  /** 分類篩選 */
  category?: ProductCategory;
  /** 頁碼 */
  page?: number;
  /** 每頁數量 */
  pageSize?: number;
}

/** 分頁結果 */
export interface PageResult<T> {
  /** 數據列表 */
  list: T[];
  /** 總數 */
  total: number;
  /** 當前頁 */
  page: number;
  /** 每頁數量 */
  pageSize: number;
}

export type { };