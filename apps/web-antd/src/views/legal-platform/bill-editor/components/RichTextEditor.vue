<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { Button, Space, Divider } from 'ant-design-vue';

interface Props {
  modelValue: string;
  placeholder?: string;
  height?: string;
  readonly?: boolean;
}

interface Emits {
  (e: 'update:modelValue', value: string): void;
  (e: 'change', value: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '請輸入內容...',
  height: '300px',
  readonly: false,
});

const emit = defineEmits<Emits>();

const editorRef = ref<HTMLDivElement>();
const isEditing = ref(false);
const currentSelection = ref<Range | null>(null);

// 工具欄按鈕狀態
const toolbarState = ref({
  bold: false,
  italic: false,
  underline: false,
  fontSize: '14px',
  textAlign: 'left',
});

// 法律文書專用格式選項（嚴格限制）
const fontSizeOptions = [
  { label: '正文 (16px)', value: '16px' },
  { label: '標題 (18px)', value: '18px' },
  { label: '章節 (20px)', value: '20px' },
];

// 法律文書專用列表符號
const legalListSymbols = {
  level1: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'],
  level2: ['（一）', '（二）', '（三）', '（四）', '（五）', '（六）', '（七）', '（八）', '（九）', '（十）'],
  level3: ['（1）', '（2）', '（3）', '（4）', '（5）', '（6）', '（7）', '（8）', '（9）', '（10）'],
};

// 禁用的格式命令（確保與法律模板一致）
const disabledCommands = ['foreColor', 'backColor', 'fontName', 'createLink', 'insertImage'];

// 執行格式化命令（帶格式約束）
const execCommand = (command: string, value?: string) => {
  if (props.readonly) return;
  
  // 檢查是否為禁用命令
  if (disabledCommands.includes(command)) {
    console.warn(`格式命令 ${command} 已被禁用，以確保符合法律文書格式規範`);
    return;
  }
  
  document.execCommand(command, false, value);
  updateToolbarState();
  handleContentChange();
};

// 插入法律文書專用列表
const insertLegalList = (level: 1 | 2 | 3) => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;
  
  const range = selection.getRangeAt(0);
  const listContainer = document.createElement('div');
  listContainer.className = `legal-list-level-${level}`;
  
  // 創建第一個列表項
  const listItem = document.createElement('div');
  listItem.className = 'legal-list-item';
  
  const symbolSpan = document.createElement('span');
  symbolSpan.className = 'legal-list-symbol';
  symbolSpan.textContent = level === 1 ? '一、' : level === 2 ? '（一）' : '（1）';
  
  const contentSpan = document.createElement('span');
  contentSpan.className = 'legal-list-content';
  contentSpan.textContent = '請輸入內容';
  
  listItem.appendChild(symbolSpan);
  listItem.appendChild(contentSpan);
  listContainer.appendChild(listItem);
  
  range.deleteContents();
  range.insertNode(listContainer);
  
  // 設置光標位置
  const newRange = document.createRange();
  newRange.selectNodeContents(contentSpan);
  selection.removeAllRanges();
  selection.addRange(newRange);
  
  handleContentChange();
};

// 切換格式
const toggleFormat = (format: string) => {
  execCommand(format);
};

// 設置字體大小
const setFontSize = (size: string) => {
  execCommand('fontSize', '3');
  // 手動設置選中文本的字體大小
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const span = document.createElement('span');
    span.style.fontSize = size;
    try {
      range.surroundContents(span);
    } catch (e) {
      span.appendChild(range.extractContents());
      range.insertNode(span);
    }
  }
  toolbarState.value.fontSize = size;
  handleContentChange();
};

// 設置文本對齊
const setTextAlign = (align: string) => {
  let command = '';
  switch (align) {
    case 'left':
      command = 'justifyLeft';
      break;
    case 'center':
      command = 'justifyCenter';
      break;
    case 'right':
      command = 'justifyRight';
      break;
    case 'justify':
      command = 'justifyFull';
      break;
  }
  if (command) {
    execCommand(command);
    toolbarState.value.textAlign = align;
  }
};

// 插入列表
const insertList = (type: 'ul' | 'ol') => {
  const command = type === 'ul' ? 'insertUnorderedList' : 'insertOrderedList';
  execCommand(command);
};

// 縮進
const indent = () => {
  execCommand('indent');
};

// 取消縮進
const outdent = () => {
  execCommand('outdent');
};

// 更新工具欄狀態
const updateToolbarState = () => {
  toolbarState.value.bold = document.queryCommandState('bold');
  toolbarState.value.italic = document.queryCommandState('italic');
  toolbarState.value.underline = document.queryCommandState('underline');
};

// 處理內容變化
const handleContentChange = () => {
  if (!editorRef.value) return;
  
  const content = editorRef.value.innerHTML;
  emit('update:modelValue', content);
  emit('change', content);
};

// 處理選擇變化
const handleSelectionChange = () => {
  updateToolbarState();
};

// 處理焦點
const handleFocus = () => {
  isEditing.value = true;
};

const handleBlur = () => {
  isEditing.value = false;
};

// 監聽modelValue變化
watch(
  () => props.modelValue,
  (newValue) => {
    if (editorRef.value && editorRef.value.innerHTML !== newValue) {
      editorRef.value.innerHTML = newValue;
    }
  }
);

// 組件掛載
onMounted(() => {
  if (editorRef.value) {
    editorRef.value.innerHTML = props.modelValue;
    
    // 監聽選擇變化
    document.addEventListener('selectionchange', handleSelectionChange);
  }
});

// 組件卸載時清理事件監聽
onBeforeUnmount(() => {
  document.removeEventListener('selectionchange', handleSelectionChange);
});
</script>

<template>
  <div class="rich-text-editor">
    <!-- 工具欄 -->
    <div v-if="!readonly" class="editor-toolbar">
      <Space>
        <!-- 格式化按鈕 -->
        <Button
          size="small"
          :type="toolbarState.bold ? 'primary' : 'default'"
          @click="toggleFormat('bold')"
        >
          <template #icon>
            <span class="icon-[lucide--bold] size-4" />
          </template>
        </Button>
        
        <Button
          size="small"
          :type="toolbarState.italic ? 'primary' : 'default'"
          @click="toggleFormat('italic')"
        >
          <template #icon>
            <span class="icon-[lucide--italic] size-4" />
          </template>
        </Button>
        
        <Button
          size="small"
          :type="toolbarState.underline ? 'primary' : 'default'"
          @click="toggleFormat('underline')"
        >
          <template #icon>
            <span class="icon-[lucide--underline] size-4" />
          </template>
        </Button>
        
        <Divider type="vertical" />
        
        <!-- 字體大小 -->
        <select
          v-model="toolbarState.fontSize"
          class="font-size-select"
          @change="setFontSize($event.target.value)"
        >
          <option
            v-for="option in fontSizeOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
        
        <Divider type="vertical" />
        
        <!-- 對齊方式（僅保留法律文書常用的左對齊和兩端對齊） -->
        <Button
          size="small"
          :type="toolbarState.textAlign === 'left' ? 'primary' : 'default'"
          @click="setTextAlign('left')"
          title="左對齊"
        >
          <template #icon>
            <span class="icon-[lucide--align-left] size-4" />
          </template>
        </Button>
        
        <Button
          size="small"
          :type="toolbarState.textAlign === 'justify' ? 'primary' : 'default'"
          @click="setTextAlign('justify')"
          title="兩端對齊（法律文書標準）"
        >
          <template #icon>
            <span class="icon-[lucide--align-justify] size-4" />
          </template>
        </Button>
        
        <Divider type="vertical" />
        
        <!-- 法律文書專用列表 -->
        <Button size="small" @click="insertLegalList(1)" title="插入一級列表（一、二、三）">
          <template #icon>
            <span class="icon-[lucide--list] size-4" />
          </template>
          一、
        </Button>
        
        <Button size="small" @click="insertLegalList(2)" title="插入二級列表（（一）（二）（三））">
          <template #icon>
            <span class="icon-[lucide--list-ordered] size-4" />
          </template>
          （一）
        </Button>
        
        <Button size="small" @click="insertLegalList(3)" title="插入三級列表（（1）（2）（3））">
          <template #icon>
            <span class="icon-[lucide--list-tree] size-4" />
          </template>
          （1）
        </Button>
        
        <Divider type="vertical" />
        
        <!-- 縮進 -->
        <Button size="small" @click="indent">
          <template #icon>
            <span class="icon-[lucide--indent-increase] size-4" />
          </template>
        </Button>
        
        <Button size="small" @click="outdent">
          <template #icon>
            <span class="icon-[lucide--indent-decrease] size-4" />
          </template>
        </Button>
      </Space>
    </div>
    
    <!-- 編輯器內容區 -->
    <div
      ref="editorRef"
      class="editor-content"
      :class="{
        'editor-readonly': readonly,
        'editor-editing': isEditing,
      }"
      :style="{ height }"
      :contenteditable="!readonly"
      :data-placeholder="placeholder"
      @input="handleContentChange"
      @focus="handleFocus"
      @blur="handleBlur"
    ></div>
  </div>
</template>

<style scoped>
.rich-text-editor {
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  overflow: hidden;
}

.editor-toolbar {
  padding: 8px 12px;
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;
}

.font-size-select {
  padding: 4px 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: #fff;
  font-size: 12px;
  min-width: 60px;
}

.editor-content {
  padding: 12px;
  outline: none;
  overflow-y: auto;
  line-height: 1.6;
  font-family: 'Microsoft YaHei', sans-serif;
  background: #fff;
}

.editor-content:empty::before {
  content: attr(data-placeholder);
  color: #bfbfbf;
  font-style: italic;
}

.editor-readonly {
  background: #f5f5f5;
  cursor: not-allowed;
}

.editor-editing {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

/* 法律文書專用列表樣式 */
:deep(.legal-list-level-1) {
  margin: 12px 0;
}

:deep(.legal-list-level-2) {
  margin: 8px 0;
  margin-left: 20px;
}

:deep(.legal-list-level-3) {
  margin: 6px 0;
  margin-left: 40px;
}

:deep(.legal-list-item) {
  display: flex;
  align-items: flex-start;
  margin-bottom: 6px;
  line-height: 1.8;
}

:deep(.legal-list-symbol) {
  font-weight: 500;
  color: #333;
  margin-right: 8px;
  min-width: 40px;
  flex-shrink: 0;
}

:deep(.legal-list-content) {
  flex: 1;
  text-indent: 0;
}

/* 強制法律文書格式約束 */
:deep(.editor-content) {
  font-family: 'Microsoft YaHei', 'SimSun', serif !important;
  color: #000 !important;
  background: #fff !important;
}

:deep(.editor-content *) {
  font-family: inherit !important;
  color: inherit !important;
}

/* 禁用用戶自定義樣式 */
:deep(.editor-content [style*="color"]:not(.legal-list-symbol)) {
  color: #000 !important;
}

:deep(.editor-content [style*="font-family"]) {
  font-family: 'Microsoft YaHei', 'SimSun', serif !important;
}

/* 編輯器內容樣式 */
:deep(.editor-content h1) {
  font-size: 24px;
  font-weight: bold;
  margin: 16px 0 12px 0;
  line-height: 1.4;
}

:deep(.editor-content h2) {
  font-size: 20px;
  font-weight: bold;
  margin: 14px 0 10px 0;
  line-height: 1.4;
}

:deep(.editor-content h3) {
  font-size: 18px;
  font-weight: bold;
  margin: 12px 0 8px 0;
  line-height: 1.4;
}

:deep(.editor-content p) {
  margin: 8px 0;
  text-indent: 2em;
}

:deep(.editor-content ul),
:deep(.editor-content ol) {
  margin: 8px 0;
  padding-left: 24px;
}

:deep(.editor-content li) {
  margin: 4px 0;
}

:deep(.editor-content blockquote) {
  margin: 12px 0;
  padding: 8px 16px;
  border-left: 4px solid #1890ff;
  background: #f6f8fa;
  font-style: italic;
}

:deep(.editor-content code) {
  padding: 2px 4px;
  background: #f5f5f5;
  border: 1px solid #e8e8e8;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
}

:deep(.editor-content pre) {
  margin: 12px 0;
  padding: 12px;
  background: #f5f5f5;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  overflow-x: auto;
  font-family: 'Courier New', monospace;
}

:deep(.editor-content table) {
  border-collapse: collapse;
  width: 100%;
  margin: 12px 0;
}

:deep(.editor-content th),
:deep(.editor-content td) {
  border: 1px solid #d9d9d9;
  padding: 8px 12px;
  text-align: left;
}

:deep(.editor-content th) {
  background: #fafafa;
  font-weight: bold;
}
</style>