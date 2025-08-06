<template>
  <Page>
    <!-- 頂部功能欄 -->
    <div class="document-editor-header">
      <div class="header-title">
        <span class="icon-[lucide--file-edit] size-5 mr-2" />
        {{ $t('page.legalPlatform.documentEditor') }}
      </div>
      <div class="header-actions">
        <Button type="primary" @click="handleDownload">
          <template #icon>
            <span class="icon-[lucide--download] size-4" />
          </template>
          {{ $t('page.legalPlatform.download') }}
        </Button>
        <Button @click="handleDownloadToPhone">
          <template #icon>
            <span class="icon-[lucide--smartphone] size-4" />
          </template>
          下載到手機
        </Button>
        <Button @click="handleFavorite">
          <template #icon>
            <span class="icon-[lucide--star] size-4" />
          </template>
          收藏
        </Button>
        <Button @click="handleShare">
          <template #icon>
            <span class="icon-[lucide--share-2] size-4" />
          </template>
          {{ $t('page.legalPlatform.share') }}
        </Button>
      </div>
    </div>

    <!-- 工具欄 -->
    <div class="document-toolbar">
      <div class="toolbar-group">
        <Select v-model:value="fontFamily" style="width: 120px" @change="changeFontFamily">
          <SelectOption value="Arial">Arial</SelectOption>
          <SelectOption value="SimSun">宋體</SelectOption>
          <SelectOption value="SimHei">黑體</SelectOption>
          <SelectOption value="KaiTi">楷體</SelectOption>
        </Select>
        <Select v-model:value="fontSize" style="width: 80px" @change="changeFontSize">
          <SelectOption value="12">12</SelectOption>
          <SelectOption value="14">14</SelectOption>
          <SelectOption value="16">16</SelectOption>
          <SelectOption value="18">18</SelectOption>
          <SelectOption value="20">20</SelectOption>
          <SelectOption value="24">24</SelectOption>
        </Select>
      </div>
      
      <Divider type="vertical" />
      
      <div class="toolbar-group">
        <Button :type="isBold ? 'primary' : 'default'" @click="toggleBold">
          <span class="icon-[lucide--bold] size-4" />
        </Button>
        <Button :type="isItalic ? 'primary' : 'default'" @click="toggleItalic">
          <span class="icon-[lucide--italic] size-4" />
        </Button>
        <Button :type="isUnderline ? 'primary' : 'default'" @click="toggleUnderline">
          <span class="icon-[lucide--underline] size-4" />
        </Button>
      </div>
      
      <Divider type="vertical" />
      
      <div class="toolbar-group">
        <Button @click="setAlignment('left')">
          <span class="icon-[lucide--align-left] size-4" />
        </Button>
        <Button @click="setAlignment('center')">
          <span class="icon-[lucide--align-center] size-4" />
        </Button>
        <Button @click="setAlignment('right')">
          <span class="icon-[lucide--align-right] size-4" />
        </Button>
        <Button @click="setAlignment('justify')">
          <span class="icon-[lucide--align-justify] size-4" />
        </Button>
      </div>
      
      <Divider type="vertical" />
      
      <div class="toolbar-group">
        <Button @click="insertImage">
          <span class="icon-[lucide--image] size-4" />
        </Button>
        <Button @click="insertTable">
          <span class="icon-[lucide--table] size-4" />
        </Button>
        <Button @click="insertLink">
          <span class="icon-[lucide--link] size-4" />
        </Button>
      </div>
    </div>

    <!-- 主要內容區域 -->
    <div class="document-main">
      <!-- 左側大綱欄 -->
      <div class="document-outline">
        <div class="outline-header">
          <span class="icon-[lucide--list] size-4 mr-2" />
          文檔大綱
        </div>
        <div class="outline-content">
          <div v-if="outlineItems.length === 0" class="outline-placeholder">
            設置的標題會在此處顯示
          </div>
          <div v-else>
            <div 
              v-for="item in outlineItems" 
              :key="item.id"
              class="outline-item"
              :class="`outline-level-${item.level}`"
              @click="scrollToHeading(item.id)"
            >
              {{ item.text }}
            </div>
          </div>
        </div>
      </div>

      <!-- 中間文檔編輯區 -->
      <div class="document-content">
        <div 
          ref="editorRef"
          class="editor-area"
          contenteditable="true"
          @input="handleContentChange"
          @keydown="handleKeyDown"
        >
          <h1>第100/2025號社會文化司司長批示</h1>
          <p>社會文化司司長行使《澳門特別行政區基本法》第六十四條賦予的職權，並根據經第66/2025號行政長官批示修改第56/2024號行政長官批示第二款（十七）項及第三款的規定，作出本批示。</p>
          
          <p>一、委任交通事務局代表蕭日鵬為大型演出活動協調小組候補成員，以替代原候補成員曾祥軒，直至被替代者的任期屆滿為止。</p>
          
          <p>二、委任消防局代表張智宏及尚樺為大型演出活動協調小組正選及其候補成員，以分別替代原正選梁毓森及候補成員林俊生，直至被替代者的任期屆滿為止。</p>
          
          <p>三、本批示自公佈翌日起產生效力。</p>
          
          <p>二零二五年七月二十九日</p>
          
          <p>社會文化司司長 柯嵐</p>
          
          <hr>
          <p>二零二五年七月三十日於社會文化司司長辦公室</p>
          
          <p>辦公室主任 林媛</p>
        </div>
      </div>

      <!-- 右側協作記錄欄 -->
      <div class="document-collaboration">
        <Tabs v-model:activeKey="activeTab">
          <TabPane key="history" tab="歷史版本">
            <div class="collaboration-content">
              <div v-for="version in historyVersions" :key="version.id" class="version-item">
                <div class="version-info">
                  <div class="version-title">版本 {{ version.version }}</div>
                  <div class="version-time">{{ version.time }}</div>
                  <div class="version-author">{{ version.author }}</div>
                </div>
                <div class="version-actions">
                  <Button size="small" @click="restoreVersion(version.id)">恢復</Button>
                  <Button size="small" @click="viewVersion(version.id)">查看</Button>
                </div>
              </div>
            </div>
          </TabPane>
          <TabPane key="collaboration" tab="協作記錄">
            <div class="collaboration-content">
              <div v-for="record in collaborationRecords" :key="record.id" class="collaboration-item">
                <div class="collaboration-avatar">
                  <Avatar :size="32">{{ record.author.charAt(0) }}</Avatar>
                </div>
                <div class="collaboration-info">
                  <div class="collaboration-action">{{ record.action }}</div>
                  <div class="collaboration-time">{{ record.time }}</div>
                  <div class="collaboration-content-text">{{ record.content }}</div>
                </div>
              </div>
            </div>
          </TabPane>
        </Tabs>
      </div>
    </div>
  </Page>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { 
  Button, 
  Select, 
  SelectOption, 
  Divider, 
  Tabs, 
  TabPane, 
  Avatar,
  message 
} from 'ant-design-vue';
import { Page } from '@vben/common-ui';
import { $t } from '#/locales';

// 響應式數據
const fontFamily = ref('Arial');
const fontSize = ref('14');
const isBold = ref(false);
const isItalic = ref(false);
const isUnderline = ref(false);
const activeTab = ref('history');
const editorRef = ref<HTMLElement>();

// 大綱數據
const outlineItems = ref<Array<{id: string, text: string, level: number}>>([]);

// 歷史版本數據
const historyVersions = ref([
  {
    id: '1',
    version: '1.3',
    time: '2024-01-15 14:30',
    author: 'João Silva'
  },
  {
    id: '2',
    version: '1.2',
    time: '2024-01-15 10:15',
    author: 'Pedro Santos'
  },
  {
    id: '3',
    version: '1.1',
    time: '2024-01-14 16:45',
    author: 'Carlos Oliveira'
  }
]);

// 協作記錄數據
const collaborationRecords = ref([
  {
    id: '1',
    author: 'João Silva',
    action: '插入內容',
    time: '2024-01-15 14:30',
    content: '在第二段添加了新的內容'
  },
  {
    id: '2',
    author: 'Pedro Santos',
    action: '加入協作',
    time: '2024-01-15 10:15',
    content: '開始協作編輯此文檔'
  },
  {
    id: '3',
    author: 'Carlos Oliveira',
    action: '修改格式',
    time: '2024-01-14 16:45',
    content: '調整了標題格式'
  }
]);

// 工具欄功能
const changeFontFamily = (value: string) => {
  document.execCommand('fontName', false, value);
};

const changeFontSize = (value: string) => {
  // 使用fontSize命令，需要將像素值轉換為標準大小
  const sizeMap: Record<string, string> = {
    '12': '1',
    '14': '2', 
    '16': '3',
    '18': '4',
    '20': '5',
    '24': '6'
  };
  document.execCommand('fontSize', false, sizeMap[value] || '2');
  
  // 同時設置CSS樣式以確保效果
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    if (!range.collapsed) {
      const span = document.createElement('span');
      span.style.fontSize = value + 'px';
      try {
        range.surroundContents(span);
      } catch (e) {
        span.appendChild(range.extractContents());
        range.insertNode(span);
      }
      selection.removeAllRanges();
    }
  }
};

const toggleBold = () => {
  isBold.value = !isBold.value;
  document.execCommand('bold');
};

const toggleItalic = () => {
  isItalic.value = !isItalic.value;
  document.execCommand('italic');
};

const toggleUnderline = () => {
  isUnderline.value = !isUnderline.value;
  document.execCommand('underline');
};

const setAlignment = (align: string) => {
  document.execCommand(`justify${align.charAt(0).toUpperCase() + align.slice(1)}`);
};

const insertImage = () => {
  const url = prompt('請輸入圖片URL:');
  if (url) {
    document.execCommand('insertImage', false, url);
  }
};

const insertTable = () => {
  const rows = prompt('請輸入行數:', '3');
  const cols = prompt('請輸入列數:', '3');
  if (rows && cols) {
    let tableHTML = '<table border="1" style="border-collapse: collapse; width: 100%;">';
    for (let i = 0; i < parseInt(rows); i++) {
      tableHTML += '<tr>';
      for (let j = 0; j < parseInt(cols); j++) {
        tableHTML += '<td style="padding: 8px; border: 1px solid #ccc;">　</td>';
      }
      tableHTML += '</tr>';
    }
    tableHTML += '</table>';
    document.execCommand('insertHTML', false, tableHTML);
  }
};

const insertLink = () => {
  const url = prompt('請輸入鏈接URL:');
  const text = prompt('請輸入鏈接文字:');
  if (url && text) {
    document.execCommand('insertHTML', false, `<a href="${url}" target="_blank">${text}</a>`);
  }
};

// 頂部功能
const handleDownload = () => {
  message.success('文檔下載功能');
};

const handleDownloadToPhone = () => {
  message.success('下載到手機功能');
};

const handleFavorite = () => {
  message.success('收藏功能');
};

const handleShare = () => {
  message.success('分享功能');
};

// 編輯器功能
const handleContentChange = () => {
  updateOutline();
};

const handleKeyDown = (event: KeyboardEvent) => {
  // 處理快捷鍵
  if (event.ctrlKey) {
    switch (event.key) {
      case 'b':
        event.preventDefault();
        toggleBold();
        break;
      case 'i':
        event.preventDefault();
        toggleItalic();
        break;
      case 'u':
        event.preventDefault();
        toggleUnderline();
        break;
    }
  }
};

// 更新大綱
const updateOutline = () => {
  if (!editorRef.value) return;
  
  const headings = editorRef.value.querySelectorAll('h1, h2, h3, h4, h5, h6');
  outlineItems.value = Array.from(headings).map((heading, index) => {
    const level = parseInt(heading.tagName.charAt(1));
    const id = `heading-${index}`;
    heading.id = id;
    return {
      id,
      text: heading.textContent || '',
      level
    };
  });
};

// 滾動到標題
const scrollToHeading = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

// 版本管理
const restoreVersion = (versionId: string) => {
  message.success(`恢復到版本 ${versionId}`);
};

const viewVersion = (versionId: string) => {
  message.success(`查看版本 ${versionId}`);
};

onMounted(() => {
  // 初始化編輯器
  nextTick(() => {
    if (editorRef.value) {
      editorRef.value.focus();
    }
  });
});
</script>

<style scoped>
.document-editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
}

.header-title {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
  color: #262626;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.document-toolbar {
  display: flex;
  align-items: center;
  padding: 12px 24px;
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;
  gap: 12px;
}

.toolbar-group {
  display: flex;
  align-items: center;
  gap: 4px;
}

.document-main {
  display: flex;
  min-height: calc(100vh - 200px);
  background: #fff;
}

.document-outline {
  width: 250px;
  border-right: 1px solid #f0f0f0;
  background: #fafafa;
}

.outline-header {
  display: flex;
  align-items: center;
  padding: 16px;
  font-weight: 600;
  border-bottom: 1px solid #f0f0f0;
}

.outline-content {
  padding: 16px;
}

.outline-placeholder {
  color: #8c8c8c;
  font-style: italic;
  text-align: center;
  padding: 20px 0;
}

.outline-item {
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 4px;
  margin-bottom: 4px;
  transition: background-color 0.2s;
}

.outline-item:hover {
  background: #e6f7ff;
}

.outline-level-1 {
  font-weight: 600;
  margin-left: 0;
}

.outline-level-2 {
  margin-left: 16px;
}

.outline-level-3 {
  margin-left: 32px;
}

.outline-level-4 {
  margin-left: 48px;
}

.outline-level-5 {
  margin-left: 64px;
}

.outline-level-6 {
  margin-left: 80px;
}

.document-content {
  flex: 1;
  padding: 24px;
  overflow: visible;
  display: flex;
  flex-direction: column;
}

.editor-area {
  min-height: 400px;
  height: 600px;
  outline: none;
  line-height: 1.6;
  font-size: 14px;
  color: #262626;
  resize: both;
  overflow: auto;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  padding: 16px;
  position: relative;
}

.editor-area::after {
  content: '';
  position: absolute;
  bottom: 0;
  right: 0;
  width: 16px;
  height: 16px;
  background: linear-gradient(-45deg, transparent 0%, transparent 30%, #ccc 30%, #ccc 35%, transparent 35%, transparent 65%, #ccc 65%, #ccc 70%, transparent 70%);
  cursor: nw-resize;
  pointer-events: none;
}

.editor-area:focus {
  outline: none;
}

.document-collaboration {
  width: 300px;
  border-left: 1px solid #f0f0f0;
  background: #fafafa;
}

.collaboration-content {
  padding: 16px;
  max-height: calc(100vh - 280px);
  overflow-y: auto;
}

.version-item {
  padding: 12px;
  background: #fff;
  border-radius: 6px;
  margin-bottom: 8px;
  border: 1px solid #f0f0f0;
}

.version-info {
  margin-bottom: 8px;
}

.version-title {
  font-weight: 600;
  color: #262626;
}

.version-time {
  font-size: 12px;
  color: #8c8c8c;
  margin-top: 4px;
}

.version-author {
  font-size: 12px;
  color: #595959;
  margin-top: 2px;
}

.version-actions {
  display: flex;
  gap: 8px;
}

.collaboration-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: #fff;
  border-radius: 6px;
  margin-bottom: 8px;
  border: 1px solid #f0f0f0;
}

.collaboration-avatar {
  flex-shrink: 0;
}

.collaboration-info {
  flex: 1;
}

.collaboration-action {
  font-weight: 600;
  color: #262626;
  margin-bottom: 4px;
}

.collaboration-time {
  font-size: 12px;
  color: #8c8c8c;
  margin-bottom: 4px;
}

.collaboration-content-text {
  font-size: 12px;
  color: #595959;
}
</style>
