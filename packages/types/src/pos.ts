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

/** 銷售狀態 */
export type SalesStatus = 'pending' | 'settled' | 'refunded';

/** 結算類型 */
export type SettlementType = 'cash' | 'electronic';

/** 銷售地點 */
export type SalesLocation = 'store1' | 'store2' | 'online';

/** 銷售記録 */
export interface SalesRecord {
  /** 記録ID */
  id: string;
  /** 銷售地點 */
  location: SalesLocation;
  /** 銷售單據編號 */
  documentNumber: string;
  /** 銷售印刷品名稱 */
  productName: string;
  /** 銷售日期 */
  saleDate: string;
  /** 銷售員編號 */
  salesPersonId: string;
  /** 銷售數量 */
  quantity: number;
  /** 銷售單價 */
  unitPrice: number;
  /** 銷售總金額 */
  totalAmount: number;
  /** 銷售狀態 */
  status: SalesStatus;
  /** 結算類型 */
  paymentType: SettlementType;
}

/** 銷售記録搜索條件 */
export interface SalesRecordSearchParams {
  /** 銷售地點 */
  location?: SalesLocation;
  /** 銷售日期範圍 - 開始日期 */
  startDate?: string;
  /** 銷售日期範圍 - 結束日期 */
  endDate?: string;
  /** 銷售狀態 */
  status?: SalesStatus;
  /** 銷售員編號 */
  salesPersonId?: string;
  /** 印刷品名稱 */
  productName?: string;
  /** 頁碼 */
  page?: number;
  /** 每頁數量 */
  pageSize?: number;
}

/** 庫存記録 */
export interface InventoryRecord {
  /** 記録ID */
  id: string;
  /** 銷售地點 */
  location: SalesLocation;
  /** 印刷品編碼 */
  productCode: string;
  /** 印刷品名稱 */
  productName: string;
  /** 印刷日期 */
  printDate: string;
  /** 入庫時間 */
  stockInTime: string;
  /** 庫存數量 */
  stockQuantity: number;
}

/** 庫存查詢搜索條件 */
export interface InventorySearchParams {
  /** 銷售地點 */
  location?: SalesLocation;
  /** 印刷品編碼 */
  productCode?: string;
  /** 印刷品名稱 */
  productName?: string;
  /** 頁碼 */
  page?: number;
  /** 每頁數量 */
  pageSize?: number;
}

/** 金額類型 */
export type AmountType = 'pricing' | 'deposit';

/** 接收稿件記録 */
export interface ManuscriptRecord {
  /** 記録ID */
  id: string;
  /** 編號 */
  number: string;
  /** 接收時間 */
  receiveTime: string;
  /** 接收人名稱 */
  receiverName: string;
  /** 上傳人 */
  uploader: string;
  /** 稿件名稱 */
  manuscriptName: string;
  /** 金額類型 */
  amountType: AmountType;
  /** 金額 */
  amount: number;
  /** 文件名 */
  fileName?: string;
}

/** 接收稿件搜索條件 */
export interface ManuscriptSearchParams {
  /** 稿件名稱 */
  manuscriptName?: string;
  /** 接收時間範圍 - 開始日期 */
  startDate?: string;
  /** 接收時間範圍 - 結束日期 */
  endDate?: string;
  /** 頁碼 */
  page?: number;
  /** 每頁數量 */
  pageSize?: number;
}

/** 接收稿件表單 */
export interface ManuscriptReceiveForm {
  /** 接收人名稱 */
  receiverName: string;
  /** 上傳人 */
  uploader: string;
  /** 稿件名稱 */
  manuscriptName: string;
  /** 金額類型 */
  amountType: AmountType;
  /** 金額 */
  amount: number;
  /** 上傳的文件 */
  file: File | null;
}

/** 銀錢箱報表項 */
export interface CashBoxReportItem {
  /** 記録ID */
  id: string;
  /** 訂單編號 */
  orderNumber: string;
  /** 金額收入 */
  income: number;
  /** 現金找零值 */
  change: number;
  /** 日期 */
  date: string;
  /** 銷售地點 */
  location: string;
}

/** 銀錢箱報表搜索條件 */
export interface CashBoxReportSearchParams {
  /** 日期 */
  date?: string;
  /** 銷售地點 */
  location?: string;
  /** 頁碼 */
  page?: number;
  /** 每頁數量 */
  pageSize?: number;
}

/** 員工銷售報表項 */
export interface EmployeeSalesReportItem {
  /** 記録ID */
  id: string;
  /** 員工編號 */
  employeeId: string;
  /** 員工姓名 */
  employeeName: string;
  /** 銷售金額 */
  salesAmount: number;
  /** 訂單數量 */
  orderCount: number;
  /** 平均訂單金額 */
  avgOrderAmount: number;
  /** 統計日期範圍 */
  dateRange: string;
}

/** 員工銷售報表搜索條件 */
export interface EmployeeSalesReportSearchParams {
  /** 開始日期 */
  startDate?: string;
  /** 結束日期 */
  endDate?: string;
  /** 員工編號 */
  employeeId?: string;
  /** 頁碼 */
  page?: number;
  /** 每頁數量 */
  pageSize?: number;
}

/** 報表統計數據 */
export interface ReportStats {
  /** 總收入 */
  totalIncome?: number;
  /** 總找零 */
  totalChange?: number;
  /** 淨收入 */
  netIncome?: number;
  /** 總銷售額 */
  totalSales?: number;
  /** 總訂單數 */
  totalOrders?: number;
  /** 平均訂單金額 */
  avgOrderAmount?: number;
}

export type { };