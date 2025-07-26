# 技術棧

- Vue3
- Vite
- TypeScript
- Ant Design Vue
- Pinia

# 圖標
- 項目集成了iconify图标库，而不是Element Plus icon，不要使用其他圖標庫
- 项目的图标主要由@vben/icons包提供，统一在该包内部管理，以便于统一管理和维护
- 项目中有以下多种图标使用方式，可以根据实际情况选择使用，只能選擇其中之一，不能使用其他的
## 1. Iconify 图标
### 新增
可在 `packages/icons/src/iconify` 目录下新增图标：

```ts
// packages/icons/src/iconify/index.ts
import { createIconifyIcon } from '@vben-core/icons';

export const MdiKeyboardEsc = createIconifyIcon('mdi:keyboard-esc');
```

### 使用

```vue
<script setup lang="ts">
import { MdiKeyboardEsc } from '@vben/icons';
</script>

<template>
  <!-- 一个宽高为20px的图标 -->
  <MdiKeyboardEsc class="size-5" />
</template>
```

## 2. Svg 图标 <Badge text="推荐" type="tip"/>

没有采用 Svg Sprite 的方式，而是直接引入 Svg 图标，

### 新增

可以在 `packages/icons/src/svg/icons` 目录下新增图标文件`test.svg`, 然后在 `packages/icons/src/svg/index.ts` 中引入：

```ts
// packages/icons/src/svg/index.ts
import { createIconifyIcon } from '@vben-core/icons';

const SvgTestIcon = createIconifyIcon('svg:test');

export { SvgTestIcon };
```

### 使用

```vue
<script setup lang="ts">
import { SvgTestIcon } from '@vben/icons';
</script>

<template>
  <!-- 一个宽高为20px的图标 -->
  <SvgTestIcon class="size-5" />
</template>
```

## 3. Tailwind CSS 图标

### 使用

直接添加 Tailwind CSS 的图标类名即可使用：

```vue
<span class="icon-[mdi--ab-testing]"></span>
```

# 國際化
- 項目已經集成了Vue i18n，并且已經配置好了中文和英文的語言包。新增和修改的任何功能都需要支持多語言，頁面展現的所有文本都需要在國際化文件中有對應的國際化key
- 請不要將業務翻譯文本放在 @vben/locales 內，這樣可以更好地管理業務和通用的翻譯文本。
- 新增翻译文本，只需要在对应的应用内，找到 src/locales/langs/，新增对应的文本即可
例如新增一個supplier-order.json國際化配置文件
```json
{
  "title": "供應商及訂貨管理"
}
```
使用的話就需要用：文件名.code
```ts
 $t('supplier-order.title')
```

# 類型定義
- 項目的類型定義由`@vben/types`包提供，統一在該包内部管理，以便于統一管理和維護
- 需要使用到類型、接口、或枚舉需要提前在`package/types/src`目錄下提前定義
- 需要導出的類型和接口需要遵循isolatedModules=true

# 應用説明
- apps/web-antd
具體應用
- apps/backend-mock 
mock數據

# 數據狀態管理
- 項目使用Pinia管理數據狀態@vben/stores

# Ant Design Vue組件使用
``` ts
import { 
  Button, 
  Form, 
  FormItem, 
  Input, 
  Select, 
  Space, 
  Table, 
  Tag,
  message, 
  Modal 
} from 'ant-design-vue';
```
``` html
<Button @click="handleBack">
  <template #icon>
    <span class="icon-[lucide--arrow-left] size-4" />
  </template>
  {{ $t('page.smartLocker.back') }}
</Button>
```

# 要求
- 只需要在前端做mock數據，不需要使用backend-mock做mock數據
- 全局導入ant design vue組件，參考web-antd/src/views/demos/antd/index.vue使用組件的方式
- 需要特別關注國際化的配置是否正確，頁面很多時候會只顯示代碼而不是國際化文件對應的内容

# 開發完成后檢查
- 開發完成后需要是否有語法錯誤導致報錯
- 開發完成后需要檢查路由路徑是否全部正確
- 開發完成后需要檢查是否所有國際化key都已經在國際化文件中配置
