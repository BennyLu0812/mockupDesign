<script lang="ts" setup>
import { ref, reactive, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { Page } from '@vben/common-ui';
import { $t } from '#/locales';
import {
  Button,
  Card,
  Col,
  Divider,
  Drawer,
  Form,
  FormItem,
  Input,
  Layout,
  LayoutContent,
  LayoutHeader,
  LayoutSider,
  Menu,
  MenuItem,
  Modal,
  SubMenu,
  Row,
  Select,
  SelectOption,
  Space,
  Spin,
  Tag,
  Textarea,
  Tree,
  TreeNode,
  message,
} from 'ant-design-vue';
import RichTextEditor from './components/RichTextEditor.vue';
import type {
  BillDocument,
  BillNavigationItem,
  BillEditorState,
  BillValidationResult,
  BillVersionHistory,
  BillVersionDifference,
  ReviewStatus,
} from '@vben/types/bill-editor';

const router = useRouter();

// 編輯器狀態
const editorState = reactive<BillEditorState>({
  document: {
    id: '',
    basicInfo: {
      billTitle: '',
      billNumber: '',
      billType: 'law',
      proposer: '',
      proposalDate: '',
      effectiveDate: '',
      summary: '',
      keywords: [],
      relatedLaws: [],
      legalBasis: '',
      purpose: '',
    },
    chapters: [],
    repealedParts: [],
    effectiveInfo: {
      effectiveDate: '',
      signatureDate: '',
      signatory: '',
      signatoryTitle: '',
      promulgationDate: '',
      implementationDate: '',
      passageDate: '',
      legislativePresident: '高開賢',
      chiefExecutiveName: '岑浩輝',
    },
    createTime: '',
    updateTime: '',
    version: '1.0',
    status: 'draft',
  },
  currentSection: 'basicInfo',
  isDirty: false,
  isLoading: false,
  versions: [],
});

// 左側導航數據
const navigationItems = ref<BillNavigationItem[]>([
  {
    id: 'basicInfo',
    type: 'basicInfo',
    title: $t('bill-editor.leftNavigation.basicInfo'),
    level: 0,
  },
  {
    id: 'chapters',
    type: 'chapter',
    title: $t('bill-editor.leftNavigation.chaptersAndArticles'),
    level: 0,
    children: [],
    expanded: true,
  },
  {
    id: 'repealedParts',
    type: 'repealedParts',
    title: $t('bill-editor.leftNavigation.repealedParts'),
    level: 0,
  },
  {
    id: 'effectiveInfo',
    type: 'effectiveInfo',
    title: $t('bill-editor.leftNavigation.effectiveAndSignature'),
    level: 0,
  },
]);

// 當前選中的導航項
const selectedKeys = ref(['basicInfo']);
const openKeys = ref(['chapters']);

// 抽屜狀態
const versionDrawerVisible = ref(false);
const validationDrawerVisible = ref(false);
const exportDrawerVisible = ref(false);
const differencesDrawerVisible = ref(false);

// 版本管理相關數據
const versionHistory = ref<BillVersionHistory[]>([]);
const selectedVersionForDiff = ref<BillVersionHistory | null>(null);
const versionDifferences = ref<BillVersionDifference[]>([]);

// Mock版本歷史數據
const mockVersionHistory: BillVersionHistory[] = [
  {
    id: 'v1',
    version: '1.0',
    modifiedBy: 'João Silva',
    modifiedTime: '2024-01-15 10:30:00',
    description: '初始版本創建',
    reviewStatus: 'approved',
    content: {} as BillDocument,
  },
  {
    id: 'v2',
    version: '1.1',
    modifiedBy: 'Maria Santos',
    modifiedTime: '2024-01-16 14:20:00',
    description: '修改第三章內容，增加新條款',
    reviewStatus: 'pending',
    content: {} as BillDocument,
  },
  {
    id: 'v3',
    version: '1.2',
    modifiedBy: 'Pedro Costa',
    modifiedTime: '2024-01-17 09:15:00',
    description: '修正法案標題和生效日期',
    reviewStatus: 'rejected',
    content: {} as BillDocument,
  },
];

// 預覽相關狀態
const previewZoom = ref(100); // 縮放比例
const previewPages = ref(1); // 總頁數
const currentPreviewPage = ref(1); // 當前頁數
const autoSyncEnabled = ref(true); // 自動同步開關
const validationErrors = ref<Array<{id: string, message: string, type: 'error' | 'warning'}>>([]);

// 預覽內容
const previewContent = computed(() => {
  return generatePreviewContent();
});

// 預覽樣式
const previewStyle = computed(() => {
  return {
    transform: `scale(${previewZoom.value / 100})`,
    transformOrigin: 'top left',
    width: `${10000 / previewZoom.value}%`,
  };
});

// 生成預覽內容
const generatePreviewContent = () => {
  const { document } = editorState;
  
  // 執行格式校驗
  validateDocumentFormat();
  
  let content = `
    <div class="bill-preview">
       <div class="bill-header" data-section="basicInfo">
         <h1 class="${getValidationClass('billTitle')}">${document.basicInfo.billTitle || $t('bill-editor.basicInfo.billTitle')}</h1>
         <p class="bill-number ${getValidationClass('billNumber')}">${document.basicInfo.billNumber || ''}</p>
       </div>
       
       <div class="bill-basic-info" data-section="basicInfo">
         <p><strong>${$t('bill-editor.basicInfo.proposer')}:</strong> ${document.basicInfo.proposer || ''}</p>
         <p><strong>${$t('bill-editor.basicInfo.proposalDate')}:</strong> ${document.basicInfo.proposalDate || ''}</p>
         <p><strong>${$t('bill-editor.basicInfo.effectiveDate')}:</strong> ${document.basicInfo.effectiveDate || ''}</p>
       </div>
       
       <div class="bill-summary" data-section="basicInfo">
         <h3>${$t('bill-editor.basicInfo.summary')}</h3>
         <p>${document.basicInfo.summary || ''}</p>
       </div>
       
       <div class="bill-legal-basis" data-section="basicInfo">
         <h3>${$t('bill-editor.basicInfo.legalBasis')}</h3>
         <div class="${getValidationClass('legalBasis')}">${document.basicInfo.legalBasis || ''}</div>
       </div>
       
       <div class="bill-purpose" data-section="basicInfo">
         <h3>${$t('bill-editor.basicInfo.purpose')}</h3>
         <div>${document.basicInfo.purpose || ''}</div>
       </div>
      
      <div class="bill-chapters">
  `;
  
  document.chapters.forEach((chapter, index) => {
    content += `
      <div class="chapter" data-section="chapters" data-chapter="${index}">
         <h2 class="${getValidationClass(`chapter-${index}-title`)}">第${index + 1}章 ${chapter.title || '未命名章節'}</h2>
         <div class="chapter-content">${chapter.content || ''}</div>
     `;
     
     chapter.articles.forEach((article, articleIndex) => {
       content += `
         <div class="article" data-section="chapters" data-chapter="${index}" data-article="${articleIndex}">
           <h3 class="${getValidationClass(`article-${index}-${articleIndex}-title`)}">第${articleIndex + 1}條 ${article.title || '未命名條款'}</h3>
           <div class="article-content">${article.content}</div>
         </div>
       `;
     });
    
    content += `</div>`;
  });
  
  // 廢止部分
  if (document.repealedParts && document.repealedParts.length > 0) {
    content += `
      <div class="bill-repealed-parts" data-section="repealedParts">
         <h3>${$t('bill-editor.repealedParts.title')}</h3>
         <div class="repealed-list">
     `;
     
     document.repealedParts.forEach((item, index) => {
       content += `
         <p>（${['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'][index] || (index + 1)}）${item.repealedLaw} ${item.repealedArticle}</p>
       `;
     });
     
     content += `
         </div>
       </div>
     `;
  }
  
  content += `
      </div>
      
      <div class="bill-effective-info" data-section="effectiveInfo">
         <h3>${$t('bill-editor.effectiveInfo.title')}</h3>
         <p><strong>${$t('bill-editor.effectiveInfo.effectiveDate')}:</strong> <span class="${getValidationClass('effectiveDate')}">${document.effectiveInfo.effectiveDate || ''}</span></p>
         
         <div class="legislative-signature">
           <p><strong>${$t('bill-editor.effectiveInfo.legislativeCouncil')}:</strong></p>
           <p>${$t('bill-editor.effectiveInfo.passageDate')}: ${document.effectiveInfo.passageDate || ''}</p>
           <p>${$t('bill-editor.effectiveInfo.legislativePresidentTitle')} ${document.effectiveInfo.legislativePresident || '高開賢'}</p>
         </div>
         
         <div class="executive-signature">
           <p><strong>${$t('bill-editor.effectiveInfo.chiefExecutive')}:</strong></p>
           <p>${$t('bill-editor.effectiveInfo.signatureDate')}: ${document.effectiveInfo.signatureDate || ''}</p>
           <p>${$t('bill-editor.effectiveInfo.chiefExecutiveTitle')} ${document.effectiveInfo.chiefExecutiveName || '岑浩輝'}</p>
         </div>
         
         <div class="other-dates">
           <p>${$t('bill-editor.effectiveInfo.promulgationDate')}: ${document.effectiveInfo.promulgationDate || ''}</p>
           <p>${$t('bill-editor.effectiveInfo.implementationDate')}: ${document.effectiveInfo.implementationDate || ''}</p>
         </div>
       </div>
    </div>
  `;
  
  // 計算頁數（簡單估算，每1000字符為一頁）
  previewPages.value = Math.ceil(content.length / 1000);
  
  return content;
};

// 格式校驗
const validateDocumentFormat = () => {
  const errors: Array<{id: string, message: string, type: 'error' | 'warning'}> = [];
  const { document } = editorState;
  
  // 校驗法案標題
  if (!document.basicInfo.billTitle) {
    errors.push({ id: 'billTitle', message: '法案標題不能為空', type: 'error' });
  }
  
  // 校驗法案編號格式
  if (document.basicInfo.billNumber && !/^第\s*\d+\/\d{4}\s*號$/.test(document.basicInfo.billNumber)) {
    errors.push({ id: 'billNumber', message: '法案編號格式應為「第 XX/XXXX 號」', type: 'warning' });
  }
  
  // 校驗立法依據格式
  if (document.basicInfo.legalBasis && !document.basicInfo.legalBasis.includes('《') && !document.basicInfo.legalBasis.includes('》')) {
    errors.push({ id: 'legalBasis', message: '立法依據應包含書名號《》', type: 'warning' });
  }
  
  // 校驗章節標題
  document.chapters.forEach((chapter, chapterIndex) => {
    if (!chapter.title) {
      errors.push({ id: `chapter-${chapterIndex}-title`, message: `第${chapterIndex + 1}章標題不能為空`, type: 'warning' });
    }
    
    chapter.articles.forEach((article, articleIndex) => {
      if (!article.title) {
        errors.push({ id: `article-${chapterIndex}-${articleIndex}-title`, message: `第${chapterIndex + 1}章第${articleIndex + 1}條標題不能為空`, type: 'warning' });
      }
    });
  });
  
  // 校驗生效日期
  if (!document.effectiveInfo.effectiveDate) {
    errors.push({ id: 'effectiveDate', message: '生效日期不能為空', type: 'error' });
  }
  
  validationErrors.value = errors;
};

// 獲取校驗樣式類
const getValidationClass = (fieldId: string) => {
  const error = validationErrors.value.find(e => e.id === fieldId);
  if (!error) return '';
  return '';
};

// 處理預覽內容點擊
 const handlePreviewContentClick = (event: MouseEvent) => {
   if (!autoSyncEnabled.value) return;
   
   const target = event.target as HTMLElement;
   const sectionElement = target.closest('[data-section]') as HTMLElement;
   
   if (!sectionElement) return;
   
   const section = sectionElement.getAttribute('data-section');
   const chapterIndex = sectionElement.getAttribute('data-chapter');
   const articleIndex = sectionElement.getAttribute('data-article');
   
   if (section) {
     handlePreviewClick(section, chapterIndex ? parseInt(chapterIndex) : undefined, articleIndex ? parseInt(articleIndex) : undefined);
   }
 };
 
 // 處理預覽區點擊
 const handlePreviewClick = (section: string, chapterIndex?: number, articleIndex?: number) => {
   if (!autoSyncEnabled.value) return;
   
   // 跳轉到對應編輯區
   editorState.currentSection = section;
   selectedKeys.value = [section];
   
   // 如果是章節，展開對應的章節
   if (section === 'chapters' && chapterIndex !== undefined) {
     // 滾動到對應章節
     setTimeout(() => {
       const chapterElement = document.querySelector(`[data-chapter-index="${chapterIndex}"]`);
       if (chapterElement) {
         chapterElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
       }
     }, 100);
   }
   
   message.info($t('bill-editor.rightPreview.clickToEdit'));
 };

// 縮放控制
const handleZoomIn = () => {
  if (previewZoom.value < 200) {
    previewZoom.value += 10;
  }
};

const handleZoomOut = () => {
  if (previewZoom.value > 50) {
    previewZoom.value -= 10;
  }
};

const handleResetZoom = () => {
  previewZoom.value = 100;
};

// 切換自動同步
const toggleAutoSync = () => {
  autoSyncEnabled.value = !autoSyncEnabled.value;
  message.success(autoSyncEnabled.value ? $t('bill-editor.rightPreview.syncEnabled') : $t('bill-editor.rightPreview.syncDisabled'));
};

// 刷新預覽
const handleRefreshPreview = () => {
  // 強制重新生成預覽內容
  validateDocumentFormat();
  message.success($t('bill-editor.rightPreview.refreshPreview'));
};

// 日期自動格式化功能
const formatChineseDate = (dateStr: string): string => {
  if (!dateStr) return '';
  
  // 處理不同格式的日期輸入
  let date: Date;
  
  // 如果是純數字格式 (如 20241001)
  if (/^\d{8}$/.test(dateStr)) {
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    date = new Date(`${year}-${month}-${day}`);
  } else {
    date = new Date(dateStr);
  }
  
  if (isNaN(date.getTime())) return dateStr;
  
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  // 轉換為中文數字
  const chineseNumbers = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  const convertToChineseNumber = (num: number): string => {
    return num.toString().split('').map(digit => chineseNumbers[parseInt(digit)]).join('');
  };
  
  return `二零${convertToChineseNumber(year).substring(2)}年${convertToChineseNumber(month)}月${convertToChineseNumber(day)}日`;
};

// 處理日期輸入變化
const handleDateChange = (field: string, value: string) => {
  const formattedDate = formatChineseDate(value);
  if (formattedDate !== value) {
    // 自動格式化日期
    setTimeout(() => {
      if (field.includes('effectiveInfo')) {
        const fieldName = field.split('.')[1];
        (editorState.document.effectiveInfo as any)[fieldName] = formattedDate;
      } else if (field.includes('basicInfo')) {
        const fieldName = field.split('.')[1];
        (editorState.document.basicInfo as any)[fieldName] = formattedDate;
      }
      showOperationFeedback('dateFormatted', { original: value, formatted: formattedDate });
    }, 100);
  }
};

// 操作反饋功能
const showOperationFeedback = (type: string, data?: any) => {
  switch (type) {
    case 'chapterAdded':
      message.success($t('bill-editor.feedback.chapterAdded', { index: data.index }));
      break;
    case 'chapterDeleted':
      message.success($t('bill-editor.feedback.chapterDeleted', { index: data.index }));
      break;
    case 'articleAdded':
      message.success($t('bill-editor.feedback.articleAdded', { chapterIndex: data.chapterIndex, articleIndex: data.articleIndex }));
      break;
    case 'articleDeleted':
      message.success($t('bill-editor.feedback.articleDeleted', { chapterIndex: data.chapterIndex, articleIndex: data.articleIndex }));
      break;
    case 'numbersReordered':
      message.info($t('bill-editor.feedback.numbersReordered'));
      break;
    case 'dateFormatted':
      message.info($t('bill-editor.feedback.dateFormatted', { original: data.original, formatted: data.formatted }));
      break;
    case 'saveSuccess':
      message.success($t('bill-editor.feedback.saveSuccess', { version: editorState.document.version }));
      break;
    case 'saveError':
      message.error($t('bill-editor.feedback.saveError', { error: data.error }));
      break;
    default:
      break;
  }
};

// 監聽編輯器狀態變化，實現實時同步
watch(
  () => editorState.document,
  () => {
    if (autoSyncEnabled.value) {
      // 自動刷新預覽內容
      validateDocumentFormat();
    }
  },
  { deep: true }
);

// 監聽當前編輯區域變化
watch(
  () => editorState.currentSection,
  (newSection) => {
    // 同步左側導航選中狀態
    selectedKeys.value = [newSection];
  }
);

// 處理導航點擊
const handleNavigationClick = (item: BillNavigationItem) => {
  editorState.currentSection = item.id;
  selectedKeys.value = [item.id];
};

// 保存文檔
const handleSave = async () => {
  try {
    editorState.isLoading = true;
    
    // 執行格式校驗
    validateDocumentFormat();
    
    // 檢查是否有錯誤
    const hasErrors = validationErrors.value.some(error => error.type === 'error');
    if (hasErrors) {
      const errorMessages = validationErrors.value
        .filter(error => error.type === 'error')
        .map(error => error.message)
        .join(', ');
      showOperationFeedback('saveError', { error: errorMessages });
      return;
    }
    
    // 模擬保存操作
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 更新版本號
    const currentVersion = editorState.document.version;
    const versionParts = currentVersion.split('.');
    const newMinorVersion = parseInt(versionParts[1]) + 1;
    editorState.document.version = `${versionParts[0]}.${newMinorVersion}`;
    
    editorState.isDirty = false;
    showOperationFeedback('saveSuccess', { version: editorState.document.version });
  } catch (error) {
    showOperationFeedback('saveError', { error: error.message || '未知錯誤' });
  } finally {
    editorState.isLoading = false;
  }
};

// 導出文檔
const handleExport = (format: 'word' | 'pdf') => {
  try {
    // 模擬導出操作
    message.success($t('bill-editor.messages.exportSuccess'));
    exportDrawerVisible.value = false;
  } catch (error) {
    message.error($t('bill-editor.messages.exportFailed'));
  }
};

// 格式校驗
const handleValidation = () => {
  try {
    // 模擬校驗操作
    const validationResult: BillValidationResult = {
      passed: true,
      errors: [],
      warnings: [],
    };
    
    editorState.validationResult = validationResult;
    validationDrawerVisible.value = true;
    message.success($t('bill-editor.messages.validationComplete'));
  } catch (error) {
    message.error($t('bill-editor.validation.failed'));
  }
};

// 添加章節
const handleAddChapter = () => {
  const newChapter = {
    id: `chapter_${Date.now()}`,
    number: `${editorState.document.chapters.length + 1}`,
    title: `新章節 ${editorState.document.chapters.length + 1}`,
    content: '',
    articles: [],
    order: editorState.document.chapters.length,
  };
  
  editorState.document.chapters.push(newChapter);
  editorState.isDirty = true;
  updateNavigationItems();
  
  // 操作反饋
  const chapterIndex = editorState.document.chapters.length;
  showOperationFeedback('chapterAdded', { index: chapterIndex });
  
  // 重新編號
  reorderChaptersAndArticles();
};

// 刪除章節
const handleDeleteChapter = (index: number) => {
  const chapterTitle = editorState.document.chapters[index]?.title || `第${index + 1}章`;
  editorState.document.chapters.splice(index, 1);
  editorState.isDirty = true;
  updateNavigationItems();
  
  // 操作反饋
  showOperationFeedback('chapterDeleted', { index: index + 1, title: chapterTitle });
  
  // 重新編號
  reorderChaptersAndArticles();
};

// 添加條款
const handleAddArticle = (chapterIndex: number) => {
  const chapter = editorState.document.chapters[chapterIndex];
  const newArticle = {
    id: `article_${Date.now()}`,
    number: `${chapter.articles.length + 1}`,
    title: `新條款 ${chapter.articles.length + 1}`,
    content: '',
    order: chapter.articles.length,
  };
  
  chapter.articles.push(newArticle);
  editorState.isDirty = true;
  updateNavigationItems();
  
  // 操作反饋
  const articleIndex = chapter.articles.length;
  showOperationFeedback('articleAdded', { chapterIndex: chapterIndex + 1, articleIndex });
  
  // 重新編號
  reorderChaptersAndArticles();
};

// 刪除條款
const handleDeleteArticle = (chapterIndex: number, articleIndex: number) => {
  const articleTitle = editorState.document.chapters[chapterIndex].articles[articleIndex]?.title || `第${articleIndex + 1}條`;
  editorState.document.chapters[chapterIndex].articles.splice(articleIndex, 1);
  editorState.isDirty = true;
  updateNavigationItems();
  
  // 操作反饋
  showOperationFeedback('articleDeleted', { chapterIndex: chapterIndex + 1, articleIndex: articleIndex + 1, title: articleTitle });
  
  // 重新編號
  reorderChaptersAndArticles();
};

// 重新編號章節和條款
const reorderChaptersAndArticles = () => {
  let hasChanges = false;
  
  editorState.document.chapters.forEach((chapter, chapterIndex) => {
    // 更新章節編號
    const expectedChapterTitle = `第${chapterIndex + 1}章`;
    if (!chapter.title.startsWith(expectedChapterTitle)) {
      hasChanges = true;
    }
    
    // 更新條款編號
    chapter.articles.forEach((article, articleIndex) => {
      const expectedArticleTitle = `第${articleIndex + 1}條`;
      if (!article.title.startsWith(expectedArticleTitle)) {
        hasChanges = true;
      }
    });
  });
  
  if (hasChanges) {
    showOperationFeedback('numbersReordered');
  }
};

// 更新導航項目
const updateNavigationItems = () => {
  const chaptersItem = navigationItems.value.find(item => item.id === 'chapters');
  if (chaptersItem) {
    chaptersItem.children = editorState.document.chapters.map((chapter, index) => ({
      id: `chapter_${chapter.id}`,
      type: 'chapter',
      title: `第${index + 1}章 ${chapter.title || '未命名章節'}`,
      level: 1,
      children: chapter.articles.map((article, articleIndex) => ({
        id: `article_${article.id}`,
        type: 'article',
        title: `第${articleIndex + 1}條 ${article.title || '未命名條款'}`,
        level: 2,
      })),
    }));
  }
  
  // 確保章節菜單展開
  if (!openKeys.value.includes('chapters')) {
    openKeys.value.push('chapters');
  }
};

// 版本管理相關方法
// 提交審核
const handleSubmitForReview = () => {
  Modal.confirm({
    title: $t('bill-editor.versionControl.submitForReview'),
    content: '確定要提交當前版本進行審核嗎？',
    onOk: () => {
      try {
        // 模擬提交審核操作
        editorState.document.status = 'review';
        message.success($t('bill-editor.versionControl.submitSuccess'));
      } catch (error) {
        message.error($t('bill-editor.versionControl.submitFailed'));
      }
    },
  });
};

// 查看版本差異
const handleViewDifferences = (version: BillVersionHistory) => {
  selectedVersionForDiff.value = version;
  
  // 生成詳細的版本差異數據
  versionDifferences.value = generateVersionDifferences(version);
  
  differencesDrawerVisible.value = true;
};

// 生成版本差異
const generateVersionDifferences = (version: BillVersionHistory) => {
  const differences = [];
  const currentDoc = editorState.document;
  const historicalDoc = version.content; // 假設歷史版本內容
  
  // 比較基本信息
  if (currentDoc.basicInfo.billTitle !== (historicalDoc.basicInfo?.billTitle || '')) {
    differences.push({
      field: '法案標題',
      oldValue: historicalDoc.basicInfo?.billTitle || '',
      newValue: currentDoc.basicInfo.billTitle,
      changeType: 'modified',
    });
  }
  
  if (currentDoc.basicInfo.billNumber !== (historicalDoc.basicInfo?.billNumber || '')) {
    differences.push({
      field: '法案編號',
      oldValue: historicalDoc.basicInfo?.billNumber || '',
      newValue: currentDoc.basicInfo.billNumber,
      changeType: 'modified',
    });
  }
  
  // 比較章節
  const currentChapters = currentDoc.chapters || [];
  const historicalChapters = historicalDoc.chapters || [];
  
  // 檢查新增的章節
  currentChapters.forEach((chapter, index) => {
    if (!historicalChapters[index]) {
      differences.push({
        field: `第${index + 1}章`,
        oldValue: '',
        newValue: chapter.title,
        changeType: 'added',
      });
    } else if (chapter.title !== historicalChapters[index].title) {
      differences.push({
        field: `第${index + 1}章標題`,
        oldValue: historicalChapters[index].title,
        newValue: chapter.title,
        changeType: 'modified',
      });
    }
    
    // 比較條款
    const currentArticles = chapter.articles || [];
    const historicalArticles = historicalChapters[index]?.articles || [];
    
    currentArticles.forEach((article, articleIndex) => {
      if (!historicalArticles[articleIndex]) {
        differences.push({
          field: `第${index + 1}章第${articleIndex + 1}條`,
          oldValue: '',
          newValue: article.title,
          changeType: 'added',
        });
      } else if (article.title !== historicalArticles[articleIndex].title) {
        differences.push({
          field: `第${index + 1}章第${articleIndex + 1}條標題`,
          oldValue: historicalArticles[articleIndex].title,
          newValue: article.title,
          changeType: 'modified',
        });
      }
    });
  });
  
  // 檢查刪除的章節
  historicalChapters.forEach((chapter, index) => {
    if (!currentChapters[index]) {
      differences.push({
        field: `第${index + 1}章`,
        oldValue: chapter.title,
        newValue: '',
        changeType: 'removed',
      });
    }
  });
  
  // 比較生效信息
  if (currentDoc.effectiveInfo.effectiveDate !== (historicalDoc.effectiveInfo?.effectiveDate || '')) {
    differences.push({
      field: '生效日期',
      oldValue: historicalDoc.effectiveInfo?.effectiveDate || '',
      newValue: currentDoc.effectiveInfo.effectiveDate,
      changeType: 'modified',
    });
  }
  
  return differences;
};

// 回滾版本
const handleRollbackVersion = (version: BillVersionHistory) => {
  Modal.confirm({
    title: $t('bill-editor.versionControl.rollbackToVersion'),
    content: $t('bill-editor.versionControl.confirmRollback', { version: version.version }),
    onOk: () => {
      try {
        // 模擬回滾操作
        editorState.document.version = version.version;
        editorState.isDirty = true;
        message.success($t('bill-editor.versionControl.rollbackSuccess'));
        versionDrawerVisible.value = false;
      } catch (error) {
        message.error($t('bill-editor.versionControl.rollbackFailed'));
      }
    },
  });
};

// 獲取狀態顏色
const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    draft: 'default',
    review: 'processing',
    approved: 'success',
    published: 'success',
    archived: 'default',
  };
  return colorMap[status] || 'default';
};

// 獲取狀態文本
const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    draft: '草稿',
    review: '審核中',
    approved: '已通過',
    published: '已發布',
    archived: '已歸檔',
  };
  return textMap[status] || status;
};

// 獲取審核狀態顏色
const getReviewStatusColor = (status: ReviewStatus) => {
  const colorMap: Record<ReviewStatus, string> = {
    pending: 'processing',
    approved: 'success',
    rejected: 'error',
  };
  return colorMap[status];
};

// 獲取審核狀態文本
const getReviewStatusText = (status: ReviewStatus) => {
  return $t(`bill-editor.versionControl.${status}`);
};

// 獲取差異類型顏色
const getDiffTypeColor = (type: string) => {
  const colorMap: Record<string, string> = {
    added: 'success',
    removed: 'error',
    modified: 'warning',
  };
  return colorMap[type] || 'default';
};

// 獲取差異類型文本
const getDiffTypeText = (type: string) => {
  const textMap: Record<string, string> = {
    added: '新增',
    removed: '刪除',
    modified: '修改',
  };
  return textMap[type] || type;
};

// 獲取導航圖標
const getNavigationIcon = (type: string) => {
  const iconMap: Record<string, string> = {
    basicInfo: 'icon-[lucide--info] size-4',
    chapter: 'icon-[lucide--book-open] size-4',
    article: 'icon-[lucide--file-text] size-4',
    repealedParts: 'icon-[lucide--trash-2] size-4',
    effectiveInfo: 'icon-[lucide--calendar-check] size-4',
  };
  return iconMap[type] || 'icon-[lucide--circle] size-4';
};

// 廢止部分相關方法
// 添加廢止項目
const handleAddRepealedItem = () => {
  const newItem = {
    id: `repealed_${Date.now()}`,
    repealedLaw: '',
    repealedArticle: '',
    repealReason: '',
  };
  
  editorState.document.repealedParts.push(newItem);
  editorState.isDirty = true;
};

// 移除廢止項目
const handleRemoveRepealedItem = (index: number) => {
  Modal.confirm({
    title: $t('bill-editor.messages.confirmDelete'),
    content: '確定要刪除這個廢止項目嗎？',
    onOk: () => {
      editorState.document.repealedParts.splice(index, 1);
      editorState.isDirty = true;
      message.success('刪除成功');
    },
  });
};

// 層級管理相關方法
// 添加編
const handleAddPart = () => {
  const newPart = {
    id: `part_${Date.now()}`,
    number: `${editorState.document.parts?.length + 1 || 1}`,
    title: `新編 ${editorState.document.parts?.length + 1 || 1}`,
    chapters: [],
    order: editorState.document.parts?.length || 0,
  };
  
  if (!editorState.document.parts) {
    editorState.document.parts = [];
  }
  editorState.document.parts.push(newPart);
  editorState.isDirty = true;
  updateNavigationItems();
};

// 添加節
const handleAddSection = () => {
  const newSection = {
    id: `section_${Date.now()}`,
    number: `${editorState.document.sections?.length + 1 || 1}`,
    title: `新節 ${editorState.document.sections?.length + 1 || 1}`,
    articles: [],
    order: editorState.document.sections?.length || 0,
  };
  
  if (!editorState.document.sections) {
    editorState.document.sections = [];
  }
  editorState.document.sections.push(newSection);
  editorState.isDirty = true;
  updateNavigationItems();
};

// 簽署人變更處理
// 立法會主席變更
const handleLegislativePresidentChange = () => {
  if (!editorState.document.effectiveInfo.legislativePresident) {
    editorState.document.effectiveInfo.legislativePresident = '高開賢';
  }
  editorState.isDirty = true;
};

// 行政長官變更
const handleChiefExecutiveChange = () => {
  if (!editorState.document.effectiveInfo.chiefExecutiveName) {
    editorState.document.effectiveInfo.chiefExecutiveName = '岑浩輝';
  }
  editorState.isDirty = true;
};

// 監聽文檔變化
watch(
  () => editorState.document,
  () => {
    editorState.isDirty = true;
  },
  { deep: true }
);

// 組件掛載
onMounted(() => {
  // 初始化數據
  updateNavigationItems();
  // 初始化版本歷史
  versionHistory.value = mockVersionHistory;
});
</script>

<template>
  <Page class="bill-editor-container">
    <Layout class="bill-editor-layout">
      <!-- 頂部工具欄 -->
      <LayoutHeader class="bill-editor-header" style="margin-bottom: 5px;">
        <div class="header-content">
          <div class="header-left">
            <h2 class="editor-title">{{ $t('bill-editor.title') }}</h2>
            <span class="editor-subtitle">{{ $t('bill-editor.subtitle') }}</span>
          </div>
          
          <div class="header-right">
            <Space>
              <Button type="primary" :loading="editorState.isLoading" @click="handleSave">
                <template #icon>
                  <span class="icon-[lucide--save] size-4" />
                </template>
                {{ $t('bill-editor.topToolbar.save') }}
              </Button>
              
              <Button @click="exportDrawerVisible = true">
                <template #icon>
                  <span class="icon-[lucide--download] size-4" />
                </template>
                {{ $t('bill-editor.topToolbar.export') }}
              </Button>
              
              <Button @click="handleValidation">
                <template #icon>
                  <span class="icon-[lucide--check-circle] size-4" />
                </template>
                {{ $t('bill-editor.topToolbar.formatValidation') }}
              </Button>
              
              <Button @click="versionDrawerVisible = true">
                <template #icon>
                  <span class="icon-[lucide--git-branch] size-4" />
                </template>
                {{ $t('bill-editor.topToolbar.versionControl') }}
              </Button>
              
              <Button @click="handleSubmitForReview">
                <template #icon>
                  <span class="icon-[lucide--send] size-4" />
                </template>
                {{ $t('bill-editor.versionControl.submitForReview') }}
              </Button>
            </Space>
          </div>
        </div>
      </LayoutHeader>
      
      <Layout class="bill-editor-body">
        <!-- 左側導航 -->
        <LayoutSider width="200" class="bill-editor-sider" style="margin-right: 5px;">
          <div class="sider-header">
            <h3>{{ $t('bill-editor.leftNavigation.title') }}</h3>
            <Space>
              <Button size="small" @click="handleAddChapter">
                <template #icon>
                  <span class="icon-[lucide--plus] size-3" />
                </template>
                {{ $t('bill-editor.leftNavigation.addChapter') }}
              </Button>
            </Space>
          </div>
          
          <div class="navigation-tree">
            <Menu
              v-model:selectedKeys="selectedKeys"
              v-model:openKeys="openKeys"
              mode="inline"
              class="navigation-menu"
            >
              <template v-for="item in navigationItems" :key="item.id">
                <!-- 有子項目的導航項 -->
                <SubMenu v-if="item.children && item.children.length > 0" :key="item.id">
                  <template #title>
                    <span class="icon-[lucide--folder] size-4" />
                    <span class="menu-item-title">{{ item.title }}</span>
                  </template>
                  
                  <template v-for="child in item.children" :key="child.id">
                    <!-- 章節項目 -->
                    <SubMenu v-if="child.children && child.children.length > 0" :key="child.id">
                      <template #title>
                        <span class="icon-[lucide--book-open] size-4" />
                        <span class="menu-item-title">{{ child.title }}</span>
                      </template>
                      
                      <!-- 條款項目 -->
                      <MenuItem
                        v-for="article in child.children"
                        :key="article.id"
                        @click="handleNavigationClick(article)"
                      >
                        <span class="icon-[lucide--file-text] size-4" />
                        <span class="menu-item-title">{{ article.title }}</span>
                      </MenuItem>
                    </SubMenu>
                    
                    <!-- 沒有子項目的章節 -->
                    <MenuItem v-else :key="child.id" @click="handleNavigationClick(child)">
                      <span class="icon-[lucide--book-open] size-4" />
                      <span class="menu-item-title">{{ child.title }}</span>
                    </MenuItem>
                  </template>
                </SubMenu>
                
                <!-- 沒有子項目的導航項 -->
                <MenuItem v-else :key="item.id" @click="handleNavigationClick(item)">
                  <span :class="getNavigationIcon(item.type)" />
                  <span class="menu-item-title">{{ item.title }}</span>
                </MenuItem>
              </template>
            </Menu>
          </div>
        </LayoutSider>
        
        <!-- 主編輯區 -->
        <LayoutContent class="bill-editor-content" style="margin-right: 5px;">
          <div class="editor-main">
            <Card >
              <template #title>
                <div class="editor-card-title">
                  <span>{{ $t('bill-editor.mainEditor.title') }}</span>
                  <span v-if="editorState.isDirty" class="dirty-indicator">*</span>
                </div>
              </template>
              
              <!-- 基礎信息編輯 -->
              <div v-if="editorState.currentSection === 'basicInfo'" class="basic-info-editor">
                <Form layout="vertical">
                  <Row :gutter="16">
                    <Col :span="12">
                      <FormItem :label="$t('bill-editor.basicInfo.billTitle')">
                        <Input
                          v-model:value="editorState.document.basicInfo.billTitle"
                          :placeholder="$t('bill-editor.basicInfo.billTitle')"
                        />
                      </FormItem>
                    </Col>
                    <Col :span="12">
                      <FormItem :label="$t('bill-editor.basicInfo.billNumber')">
                        <Input
                          v-model:value="editorState.document.basicInfo.billNumber"
                          :placeholder="$t('bill-editor.basicInfo.billNumber')"
                        />
                      </FormItem>
                    </Col>
                  </Row>
                  
                  <Row :gutter="16">
                    <Col :span="8">
                      <FormItem :label="$t('bill-editor.basicInfo.billType')">
                        <Select v-model:value="editorState.document.basicInfo.billType">
                          <SelectOption value="law">法律</SelectOption>
                          <SelectOption value="regulation">法規</SelectOption>
                          <SelectOption value="ordinance">條例</SelectOption>
                          <SelectOption value="rule">規則</SelectOption>
                          <SelectOption value="other">其他</SelectOption>
                        </Select>
                      </FormItem>
                    </Col>
                    <Col :span="8">
                      <FormItem :label="$t('bill-editor.basicInfo.proposer')">
                        <Input
                          v-model:value="editorState.document.basicInfo.proposer"
                          :placeholder="$t('bill-editor.basicInfo.proposer')"
                        />
                      </FormItem>
                    </Col>
                    <Col :span="8">
                      <FormItem :label="$t('bill-editor.basicInfo.proposalDate')">
                        <Input
                          v-model:value="editorState.document.basicInfo.proposalDate"
                          type="date"
                          @change="(e) => handleDateChange('basicInfo.proposalDate', e.target.value)"
                        />
                      </FormItem>
                    </Col>
                  </Row>
                  
                  <FormItem :label="$t('bill-editor.basicInfo.summary')">
                    <Textarea
                      v-model:value="editorState.document.basicInfo.summary"
                      :placeholder="$t('bill-editor.basicInfo.summary')"
                      :rows="4"
                    />
                  </FormItem>
                  
                  <FormItem :label="$t('bill-editor.basicInfo.legalBasis')">
                    <RichTextEditor
                      v-model="editorState.document.basicInfo.legalBasis"
                      :placeholder="$t('bill-editor.basicInfo.legalBasis')"
                      height="120px"
                    />
                  </FormItem>
                  
                  <FormItem :label="$t('bill-editor.basicInfo.purpose')">
                    <RichTextEditor
                      v-model="editorState.document.basicInfo.purpose"
                      :placeholder="$t('bill-editor.basicInfo.purpose')"
                      height="150px"
                    />
                  </FormItem>
                </Form>
              </div>
              
              <!-- 章節條款編輯 -->
              <div v-else-if="editorState.currentSection === 'chapters'" class="chapters-editor">
                <!-- 層級管理組件 -->
                <div class="hierarchy-toolbar">
                  <div class="hierarchy-buttons">
                    <Space>
                      <Button type="primary" @click="handleAddPart">
                        <template #icon>
                          <span class="icon-[lucide--plus] size-4" />
                        </template>
                        {{ $t('bill-editor.chapters.addPart') }}
                      </Button>
                      <Button @click="handleAddChapter">
                        <template #icon>
                          <span class="icon-[lucide--plus] size-4" />
                        </template>
                        {{ $t('bill-editor.chapters.addChapter') }}
                      </Button>
                      <Button @click="handleAddSection">
                        <template #icon>
                          <span class="icon-[lucide--plus] size-4" />
                        </template>
                        {{ $t('bill-editor.chapters.addSection') }}
                      </Button>
                    </Space>
                  </div>
                  <div class="hierarchy-info">
                    <span class="hierarchy-tip">{{ $t('bill-editor.chapters.hierarchyTip') }}</span>
                  </div>
                </div>
                
                <div v-if="editorState.document.chapters.length === 0" class="empty-chapters">
                  <p>{{ $t('bill-editor.messages.loading') }}</p>
                </div>
                
                <div v-else class="chapters-list">
                  <Card
                    v-for="(chapter, chapterIndex) in editorState.document.chapters"
                    :key="chapter.id"
                    class="chapter-card"
                  >
                    <template #title>
                      <div class="chapter-header">
                        <Input
                          v-model:value="chapter.title"
                          class="chapter-title-input"
                          :placeholder="$t('bill-editor.chapters.chapterTitle')"
                        />
                        <Space>
                          <Button
                            size="small"
                            @click="handleAddArticle(chapterIndex)"
                          >
                            <template #icon>
                              <span class="icon-[lucide--plus] size-3" />
                            </template>
                            {{ $t('bill-editor.leftNavigation.addArticle') }}
                          </Button>
                          <Button
                            size="small"
                            danger
                            @click="handleDeleteChapter(chapterIndex)"
                          >
                            <template #icon>
                              <span class="icon-[lucide--trash-2] size-3" />
                            </template>
                            {{ $t('bill-editor.chapters.deleteChapter') }}
                          </Button>
                        </Space>
                      </div>
                    </template>
                    
                    <div class="chapter-content">
                      <RichTextEditor
                        v-model="chapter.content"
                        :placeholder="$t('bill-editor.chapters.chapterContent')"
                        height="120px"
                      />
                    </div>
                    
                    <div v-if="chapter.articles.length > 0" class="articles-list">
                      <div
                        v-for="(article, articleIndex) in chapter.articles"
                        :key="article.id"
                        class="article-item"
                      >
                        <div class="article-header">
                          <Input
                            v-model:value="article.title"
                            :placeholder="$t('bill-editor.chapters.articleTitle')"
                            class="article-title-input"
                          />
                          <Button
                            size="small"
                            danger
                            @click="handleDeleteArticle(chapterIndex, articleIndex)"
                          >
                            <template #icon>
                              <span class="icon-[lucide--trash-2] size-3" />
                            </template>
                            {{ $t('bill-editor.chapters.deleteArticle') }}
                          </Button>
                        </div>
                        <RichTextEditor
                          v-model="article.content"
                          :placeholder="$t('bill-editor.chapters.articleContent')"
                          height="150px"
                        />
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
              
              <!-- 廢止部分編輯 -->
              <div v-else-if="editorState.currentSection === 'repealedParts'" class="repealed-parts-editor">
                <div class="repealed-toolbar">
                  <Space>
                    <Button type="primary" @click="handleAddRepealedItem">
                      <template #icon>
                        <span class="icon-[lucide--plus] size-4" />
                      </template>
                      {{ $t('bill-editor.repealedParts.addRepealedItem') }}
                    </Button>
                  </Space>
                </div>
                
                <div v-if="editorState.document.repealedParts.length === 0" class="empty-repealed">
                  <p>{{ $t('bill-editor.repealedParts.title') }}</p>
                </div>
                
                <div v-else class="repealed-list">
                  <Card
                    v-for="(item, index) in editorState.document.repealedParts"
                    :key="item.id"
                    class="repealed-card"
                  >
                    <template #title>
                      <div class="repealed-header">
                        <span>廢止項目 {{ index + 1 }}</span>
                        <Button
                          size="small"
                          danger
                          @click="handleRemoveRepealedItem(index)"
                        >
                          <template #icon>
                            <span class="icon-[lucide--trash-2] size-3" />
                          </template>
                          {{ $t('bill-editor.repealedParts.removeRepealedItem') }}
                        </Button>
                      </div>
                    </template>
                    
                    <Form layout="vertical">
                      <Row :gutter="16">
                        <Col :span="12">
                          <FormItem :label="$t('bill-editor.repealedParts.repealedLaw')">
                            <Input
                              v-model:value="item.repealedLaw"
                              :placeholder="$t('bill-editor.repealedParts.repealedLaw')"
                            />
                          </FormItem>
                        </Col>
                        <Col :span="12">
                          <FormItem :label="$t('bill-editor.repealedParts.repealedArticle')">
                            <Input
                              v-model:value="item.repealedArticle"
                              :placeholder="$t('bill-editor.repealedParts.repealedArticle')"
                            />
                          </FormItem>
                        </Col>
                      </Row>
                      
                      <FormItem :label="$t('bill-editor.repealedParts.repealReason')">
                        <Textarea
                          v-model:value="item.repealReason"
                          :placeholder="$t('bill-editor.repealedParts.repealReason')"
                          :rows="3"
                        />
                      </FormItem>
                    </Form>
                  </Card>
                </div>
              </div>
              
              <!-- 生效信息編輯 -->
              <div v-else-if="editorState.currentSection === 'effectiveInfo'" class="effective-info-editor">
                <Form layout="vertical">
                  <!-- 生效日期 -->
                  <FormItem :label="$t('bill-editor.effectiveInfo.effectiveDate')">
                    <Input
                      v-model:value="editorState.document.effectiveInfo.effectiveDate"
                      type="date"
                      :placeholder="$t('bill-editor.effectiveInfo.effectiveDatePlaceholder')"
                      @change="(e) => handleDateChange('effectiveInfo.effectiveDate', e.target.value)"
                    />
                    <div class="date-format-tip">
                      {{ $t('bill-editor.effectiveInfo.effectiveDateTip') }}
                    </div>
                  </FormItem>
                  
                  <!-- 立法會簽署 -->
                  <Divider>{{ $t('bill-editor.effectiveInfo.legislativeCouncil') }}</Divider>
                  <Row :gutter="16">
                    <Col :span="12">
                      <FormItem :label="$t('bill-editor.effectiveInfo.passageDate')">
                        <Input
                          v-model:value="editorState.document.effectiveInfo.passageDate"
                          type="date"
                          :placeholder="$t('bill-editor.effectiveInfo.passageDatePlaceholder')"
                          @change="(e) => handleDateChange('effectiveInfo.passageDate', e.target.value)"
                        />
                      </FormItem>
                    </Col>
                    <Col :span="12">
                      <FormItem :label="$t('bill-editor.effectiveInfo.legislativePresident')">
                        <Input
                          v-model:value="editorState.document.effectiveInfo.legislativePresident"
                          :placeholder="$t('bill-editor.effectiveInfo.legislativePresidentPlaceholder')"
                          @blur="handleLegislativePresidentChange"
                        />
                        <div class="signatory-preview">
                          {{ $t('bill-editor.effectiveInfo.legislativePresidentTitle') }} {{ editorState.document.effectiveInfo.legislativePresident || '高開賢' }}
                        </div>
                      </FormItem>
                    </Col>
                  </Row>
                  
                  <!-- 行政長官簽署 -->
                  <Divider>{{ $t('bill-editor.effectiveInfo.chiefExecutive') }}</Divider>
                  <Row :gutter="16">
                    <Col :span="12">
                      <FormItem :label="$t('bill-editor.effectiveInfo.signatureDate')">
                        <Input
                          v-model:value="editorState.document.effectiveInfo.signatureDate"
                          type="date"
                          :placeholder="$t('bill-editor.effectiveInfo.signatureDatePlaceholder')"
                          @change="(e) => handleDateChange('effectiveInfo.signatureDate', e.target.value)"
                        />
                      </FormItem>
                    </Col>
                    <Col :span="12">
                      <FormItem :label="$t('bill-editor.effectiveInfo.chiefExecutiveName')">
                        <Input
                          v-model:value="editorState.document.effectiveInfo.chiefExecutiveName"
                          :placeholder="$t('bill-editor.effectiveInfo.chiefExecutiveNamePlaceholder')"
                          @blur="handleChiefExecutiveChange"
                        />
                        <div class="signatory-preview">
                          {{ $t('bill-editor.effectiveInfo.chiefExecutiveTitle') }} {{ editorState.document.effectiveInfo.chiefExecutiveName || '岑浩輝' }}
                        </div>
                      </FormItem>
                    </Col>
                  </Row>
                  
                  <!-- 其他信息 -->
                  <Row :gutter="16">
                    <Col :span="12">
                      <FormItem :label="$t('bill-editor.effectiveInfo.promulgationDate')">
                        <Input
                          v-model:value="editorState.document.effectiveInfo.promulgationDate"
                          type="date"
                          @change="(e) => handleDateChange('effectiveInfo.promulgationDate', e.target.value)"
                        />
                      </FormItem>
                    </Col>
                    <Col :span="12">
                      <FormItem :label="$t('bill-editor.effectiveInfo.implementationDate')">
                        <Input
                          v-model:value="editorState.document.effectiveInfo.implementationDate"
                          type="date"
                          @change="(e) => handleDateChange('effectiveInfo.implementationDate', e.target.value)"
                        />
                      </FormItem>
                    </Col>
                  </Row>
                </Form>
              </div>
            </Card>
          </div>
        </LayoutContent>
        
        <!-- 右側預覽 -->
        <LayoutSider width="35%" class="bill-editor-preview">
          <Card class="preview-card">
            <template #title>
              <div class="preview-header">
                <span>{{ $t('bill-editor.rightPreview.title') }}</span>
                <div class="preview-controls">
                  <Space size="small">
                    <!-- 自動同步開關 -->
                    <Button 
                      size="small" 
                      :type="autoSyncEnabled ? 'primary' : 'default'"
                      @click="toggleAutoSync"
                    >
                      <template #icon>
                        <span :class="autoSyncEnabled ? 'icon-[lucide--link] size-3' : 'icon-[lucide--link-off] size-3'" />
                      </template>
                      {{ $t('bill-editor.rightPreview.autoSync') }}
                    </Button>
                    
                    <!-- 刷新預覽 -->
                    <Button size="small" @click="handleRefreshPreview">
                      <template #icon>
                        <span class="icon-[lucide--refresh-cw] size-3" />
                      </template>
                      {{ $t('bill-editor.rightPreview.refreshPreview') }}
                    </Button>
                  </Space>
                </div>
              </div>
            </template>
            
            <!-- 縮放控制工具欄 -->
            <div class="preview-toolbar">
              <div class="zoom-controls">
                <Space size="small">
                  <Button size="small" @click="handleZoomOut" :disabled="previewZoom <= 50">
                    <template #icon>
                      <span class="icon-[lucide--zoom-out] size-3" />
                    </template>
                    {{ $t('bill-editor.rightPreview.zoomOut') }}
                  </Button>
                  
                  <span class="zoom-display">{{ previewZoom }}%</span>
                  
                  <Button size="small" @click="handleZoomIn" :disabled="previewZoom >= 200">
                    <template #icon>
                      <span class="icon-[lucide--zoom-in] size-3" />
                    </template>
                    {{ $t('bill-editor.rightPreview.zoomIn') }}
                  </Button>
                  
                  <Button size="small" @click="handleResetZoom">
                    <template #icon>
                      <span class="icon-[lucide--maximize] size-3" />
                    </template>
                    {{ $t('bill-editor.rightPreview.resetZoom') }}
                  </Button>
                </Space>
              </div>
              
              <!-- 頁面信息 -->
              <div class="page-info">
                <span>{{ $t('bill-editor.rightPreview.pageInfo', { current: currentPreviewPage, total: previewPages }) }}</span>
              </div>
            </div>
            

            
            <!-- 預覽內容 -->
             <div class="preview-content-wrapper">
               <div 
                 class="preview-content" 
                 v-html="previewContent"
                 @click="handlePreviewContentClick"
                 :style="previewStyle"
               ></div>
             </div>
          </Card>
        </LayoutSider>
      </Layout>
    </Layout>
    
    <!-- 版本管理抽屜 -->
    <Drawer
      v-model:open="versionDrawerVisible"
      :title="$t('bill-editor.versionControl.title')"
      placement="right"
      :width="600"
    >
      <div class="version-content">
        <div class="current-version-info">
          <h4>{{ $t('bill-editor.versionControl.currentVersion') }}: {{ editorState.document.version }}</h4>
          <p>{{ $t('bill-editor.versionControl.reviewStatus') }}: 
            <Tag :color="getStatusColor(editorState.document.status)">
              {{ getStatusText(editorState.document.status) }}
            </Tag>
          </p>
        </div>
        
        <Divider />
        
        <div class="version-history-section">
          <h4>{{ $t('bill-editor.versionControl.versionHistory') }}</h4>
          
          <div v-if="versionHistory.length === 0" class="no-history">
            <span class="icon-[lucide--clock] size-6 text-gray-400" />
            <p>{{ $t('bill-editor.versionControl.noVersionHistory') }}</p>
          </div>
          
          <div v-else class="version-list">
            <div 
              v-for="version in versionHistory" 
              :key="version.id" 
              class="version-item"
            >
              <div class="version-header">
                <div class="version-info">
                  <h5>{{ $t('bill-editor.versionControl.versionNumber') }}: {{ version.version }}</h5>
                  <p class="version-meta">
                    <span>{{ $t('bill-editor.versionControl.modifiedBy') }}: {{ version.modifiedBy }}</span>
                    <span>{{ $t('bill-editor.versionControl.modifiedTime') }}: {{ version.modifiedTime }}</span>
                  </p>
                  <p v-if="version.description" class="version-description">
                    {{ $t('bill-editor.versionControl.description') }}: {{ version.description }}
                  </p>
                  <div v-if="version.reviewStatus" class="review-status">
                    {{ $t('bill-editor.versionControl.reviewStatus') }}: 
                    <Tag :color="getReviewStatusColor(version.reviewStatus)">
                      {{ getReviewStatusText(version.reviewStatus) }}
                    </Tag>
                  </div>
                </div>
              </div>
              
              <div class="version-actions">
                <Space>
                  <Button size="small" @click="handleViewDifferences(version)">
                    <template #icon>
                      <span class="icon-[lucide--diff] size-3" />
                    </template>
                    {{ $t('bill-editor.versionControl.viewDifferences') }}
                  </Button>
                  
                  <Button 
                    size="small" 
                    type="primary" 
                    @click="handleRollbackVersion(version)"
                  >
                    <template #icon>
                      <span class="icon-[lucide--undo] size-3" />
                    </template>
                    {{ $t('bill-editor.versionControl.rollbackToVersion') }}
                  </Button>
                </Space>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Drawer>
    
    <!-- 校驗結果抽屜 -->
    <Drawer
      v-model:open="validationDrawerVisible"
      :title="$t('bill-editor.validation.title')"
      placement="right"
      :width="500"
    >
      <div class="validation-content">
        <div v-if="editorState.validationResult?.passed" class="validation-success">
          <span class="icon-[lucide--check-circle] size-5 text-green-500" />
          <span>{{ $t('bill-editor.validation.passed') }}</span>
        </div>
        <!-- 校驗錯誤和警告列表 -->
      </div>
    </Drawer>
    
    <!-- 導出抽屜 -->
    <Drawer
      v-model:open="exportDrawerVisible"
      :title="$t('bill-editor.topToolbar.export')"
      placement="right"
      :width="400"
    >
      <div class="export-content">
        <Space direction="vertical" style="width: 100%">
          <Button block @click="handleExport('word')">
            <template #icon>
              <span class="icon-[lucide--file-text] size-4" />
            </template>
            {{ $t('bill-editor.topToolbar.exportWord') }}
          </Button>
          
          <Button block @click="handleExport('pdf')">
            <template #icon>
              <span class="icon-[lucide--file] size-4" />
            </template>
            {{ $t('bill-editor.topToolbar.exportPdf') }}
          </Button>
        </Space>
      </div>
    </Drawer>
    
    <!-- 版本差異抽屜 -->
    <Drawer
      v-model:open="differencesDrawerVisible"
      :title="$t('bill-editor.versionControl.viewDifferences')"
      placement="right"
      :width="700"
    >
      <div class="differences-content">
        <div v-if="selectedVersionForDiff" class="diff-header">
          <h4>{{ $t('bill-editor.versionControl.compareVersions') }}: 
            {{ editorState.document.version }} vs {{ selectedVersionForDiff.version }}
          </h4>
        </div>
        
        <div v-if="versionDifferences.length === 0" class="no-differences">
          <span class="icon-[lucide--check-circle] size-6 text-green-500" />
          <p>沒有發現差異</p>
        </div>
        
        <div v-else class="differences-list">
          <div 
            v-for="diff in versionDifferences" 
            :key="diff.field" 
            class="difference-item"
          >
            <div class="diff-field">
              <h5>{{ diff.field }}</h5>
              <Tag :color="getDiffTypeColor(diff.changeType)">{{ getDiffTypeText(diff.changeType) }}</Tag>
            </div>
            
            <div class="diff-content">
              <div class="old-value">
                <h6>舊值:</h6>
                <div class="value-content">{{ diff.oldValue || '(空)' }}</div>
              </div>
              
              <div class="new-value">
                <h6>新值:</h6>
                <div class="value-content">{{ diff.newValue || '(空)' }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  </Page>
</template>

<style scoped>
.bill-editor-container {
  height: 100vh;
  overflow: hidden;
}

.bill-editor-layout {
  height: 100%;
}

.bill-editor-header {
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  padding: 0 24px;
  height: 64px;
  line-height: 64px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.editor-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.editor-subtitle {
  color: #666;
  font-size: 14px;
}

.bill-editor-body {
  height: calc(100% - 69px);
}

.bill-editor-sider {
  background: #fafafa;
}

.sider-header {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sider-header h3 {
  margin: 0;
  font-size: 16px;
}

.navigation-tree {
  height: calc(100% - 65px);
  overflow-y: auto;
}

.navigation-menu {
  border: none;
  background: transparent;
}

.menu-item-title {
  font-size: 14px;
}

.bill-editor-content {
  background: #fff;
  padding: 16px;
  overflow-y: auto;
}

.editor-main {
  height: 100%;
}

.editor-card {
  height: 100%;
}

.editor-card-title {
  display: flex;
  align-items: center;
  gap: 4px;
}

.dirty-indicator {
  color: #ff4d4f;
  font-weight: bold;
}

.basic-info-editor,
.chapters-editor,
.repealed-parts-editor,
.effective-info-editor {
  height: calc(100% - 60px);
  overflow-y: auto;
}

.chapters-toolbar {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.empty-chapters {
  text-align: center;
  padding: 40px;
  color: #999;
}

.chapter-card {
  margin-bottom: 16px;
}

.chapter-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.chapter-title-input {
  flex: 1;
}

.chapter-content {
  margin-bottom: 16px;
}

.articles-list {
  border-top: 1px solid #f0f0f0;
  padding-top: 16px;
}

.article-item {
  margin-bottom: 16px;
  padding: 12px;
  background: #fafafa;
  border-radius: 6px;
}

.article-header {
  margin-bottom: 8px;
}

.article-title-input {
  font-weight: 500;
}

/* 廢止部分樣式 */
.repealed-toolbar {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.empty-repealed {
  text-align: center;
  padding: 40px;
  color: #999;
}

.repealed-card {
  margin-bottom: 16px;
}

.repealed-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.repealed-list {
  max-height: 400px;
  overflow-y: auto;
}

/* 層級管理樣式 */
.hierarchy-toolbar {
  margin-bottom: 20px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.hierarchy-buttons {
  margin-bottom: 12px;
}

.hierarchy-info {
  font-size: 12px;
  color: #6c757d;
}

.hierarchy-tip {
  font-style: italic;
}

/* 生效信息樣式 */
.date-format-tip {
  font-size: 12px;
  color: #6c757d;
  margin-top: 4px;
}

.signatory-preview {
  font-size: 12px;
  color: #28a745;
  margin-top: 4px;
  font-weight: 500;
}

.bill-editor-preview {
  background: #fff;
}

.preview-card {
  height: 100%;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.preview-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.preview-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  border-bottom: 1px solid #f0f0f0;
  background: #fafafa;
}

.zoom-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.zoom-display {
  font-size: 12px;
  font-weight: 500;
  color: #666;
  min-width: 40px;
  text-align: center;
}

.page-info {
  font-size: 12px;
  color: #999;
}

.validation-alerts {
  margin: 8px 16px;
  padding: 12px;
  background: #fff7e6;
  border: 1px solid #ffd591;
  border-radius: 6px;
}

.validation-header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  color: #d46b08;
  margin-bottom: 8px;
}

.validation-list {
  max-height: 120px;
  overflow-y: auto;
}

.validation-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  margin-bottom: 4px;
  padding: 4px 8px;
  border-radius: 4px;
}

.validation-error-item {
  background: #fff2f0;
  color: #cf1322;
}

.validation-warning-item {
  background: #fff7e6;
  color: #d46b08;
}

.validation-more {
  font-size: 11px;
  color: #999;
  text-align: center;
  padding: 4px;
}

.preview-content-wrapper {
  height: calc(100% - 140px);
  overflow: hidden;
}

.preview-content {
  height: 100%;
  overflow-y: auto;
  padding: 16px;
  background: #fafafa;
  border-radius: 6px;
  cursor: pointer;
}

:deep(.bill-preview) {
  font-family: 'Microsoft YaHei', sans-serif;
  line-height: 1.6;
}

:deep(.bill-preview .bill-header) {
  text-align: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #333;
}

:deep(.bill-preview .bill-header h1) {
  font-size: 24px;
  font-weight: bold;
  margin: 0 0 8px 0;
}

:deep(.bill-preview .bill-number) {
  font-size: 14px;
  color: #666;
  margin: 4px 0;
}

:deep(.bill-preview .bill-type) {
  font-size: 14px;
  color: #666;
  margin: 4px 0;
}

:deep(.bill-preview .bill-basic-info) {
  margin-bottom: 24px;
  padding: 16px;
  background: #f9f9f9;
  border-radius: 6px;
}

:deep(.bill-preview .bill-summary) {
  margin-bottom: 24px;
}

:deep(.bill-preview .bill-summary h3) {
  font-size: 18px;
  margin: 0 0 12px 0;
  color: #333;
}

:deep(.bill-preview .chapter) {
  margin-bottom: 32px;
}

:deep(.bill-preview .chapter h2) {
  font-size: 20px;
  font-weight: bold;
  margin: 0 0 16px 0;
  color: #333;
}

:deep(.bill-preview .article) {
  margin-bottom: 20px;
  padding-left: 20px;
}

:deep(.bill-preview .article h3) {
  font-size: 16px;
  font-weight: bold;
  margin: 0 0 8px 0;
  color: #555;
}

:deep(.bill-preview .article-content) {
  margin-left: 20px;
  text-indent: 2em;
}

/* 格式校驗樣式 */
:deep(.validation-error) {
  background: #fff2f0 !important;
  border: 1px solid #ffccc7 !important;
  color: #cf1322 !important;
  position: relative;
}

:deep(.validation-warning) {
  background: #fff7e6 !important;
  border: 1px solid #ffd591 !important;
  color: #d46b08 !important;
  position: relative;
}

:deep(.validation-error::after) {
  content: '❌';
  position: absolute;
  right: 4px;
  top: 2px;
  font-size: 12px;
}

:deep(.validation-warning::after) {
  content: '⚠️';
  position: absolute;
  right: 4px;
  top: 2px;
  font-size: 12px;
}

/* 點擊交互樣式 */
:deep(.bill-preview [data-section]) {
  transition: all 0.2s ease;
  border-radius: 4px;
  padding: 4px;
  margin: 2px 0;
}

:deep(.bill-preview [data-section]:hover) {
  background: rgba(24, 144, 255, 0.1) !important;
  border: 1px dashed #1890ff !important;
  cursor: pointer;
}

:deep(.bill-preview [data-section]:hover::before) {
  content: '點擊編輯';
  position: absolute;
  right: 8px;
  top: 4px;
  font-size: 11px;
  color: #1890ff;
  background: #fff;
  padding: 2px 6px;
  border-radius: 3px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  z-index: 10;
}

/* 縮放樣式 */
:deep(.bill-preview) {
  transition: transform 0.3s ease;
  transform-origin: top left;
}

/* 廢止部分樣式 */
:deep(.bill-preview .bill-repealed-parts) {
  margin: 24px 0;
  padding: 16px;
  background: #f9f9f9;
  border-radius: 6px;
}

:deep(.bill-preview .repealed-list p) {
  margin: 8px 0;
  text-indent: 2em;
}

/* 簽署信息樣式 */
:deep(.bill-preview .legislative-signature),
:deep(.bill-preview .executive-signature) {
  margin: 16px 0;
  padding: 12px;
  background: #f6f8fa;
  border-left: 4px solid #555;
}

:deep(.bill-preview .other-dates) {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e8e8e8;
}

.version-content,
.validation-content,
.export-content {
  padding: 16px 0;
}

.validation-success {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
  background: #f6ffed;
  border: 1px solid #b7eb8f;
  border-radius: 6px;
  color: #52c41a;
}

/* 版本管理樣式 */
.current-version-info {
  margin-bottom: 16px;
}

.current-version-info h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
}

.current-version-info p {
  margin: 0;
  color: #666;
}

.version-history-section h4 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
}

.no-history {
  text-align: center;
  padding: 40px 20px;
  color: #999;
}

.no-history p {
  margin: 8px 0 0 0;
}

.version-list {
  max-height: 500px;
  overflow-y: auto;
}

.version-item {
  padding: 16px;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  margin-bottom: 12px;
  background: #fafafa;
}

.version-item:last-child {
  margin-bottom: 0;
}

.version-header {
  margin-bottom: 12px;
}

.version-info h5 {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.version-meta {
  margin: 4px 0;
  font-size: 12px;
  color: #666;
}

.version-meta span {
  margin-right: 16px;
}

.version-description {
  margin: 8px 0 0 0;
  font-size: 13px;
  color: #555;
}

.review-status {
  margin-top: 8px;
  font-size: 12px;
}

.version-actions {
  display: flex;
  justify-content: flex-end;
}

/* 版本差異樣式 */
.diff-header h4 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
}

.no-differences {
  text-align: center;
  padding: 40px 20px;
  color: #52c41a;
}

.no-differences p {
  margin: 8px 0 0 0;
}

.differences-list {
  max-height: 600px;
  overflow-y: auto;
}

.difference-item {
  padding: 16px;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  margin-bottom: 16px;
  background: #fafafa;
}

.difference-item:last-child {
  margin-bottom: 0;
}

.diff-field {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.diff-field h5 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.diff-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.old-value,
.new-value {
  padding: 12px;
  border-radius: 4px;
}

.old-value {
  background: #fff2f0;
  border: 1px solid #ffccc7;
}

.new-value {
  background: #f6ffed;
  border: 1px solid #b7eb8f;
}

.old-value h6,
.new-value h6 {
  margin: 0 0 8px 0;
  font-size: 12px;
  font-weight: 600;
  color: #666;
}

.value-content {
  font-size: 13px;
  line-height: 1.5;
  word-break: break-word;
}
</style>
