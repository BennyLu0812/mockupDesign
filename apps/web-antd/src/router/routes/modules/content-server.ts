import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'lucide:server',
      order: 2,
      title: $t('page.contentServer.title'),
    },
    name: 'ContentServer',
    path: '/content-server',
    children: [
      {
        name: 'DocumentManagement',
        path: '/document-management',
        component: () => import('#/views/content-server/document-management/index.vue'),
        meta: {
          icon: 'lucide:folder-open',
          title: $t('page.contentServer.documentManagement'),
        },
      },
      {
        name: 'DocumentDetails',
        path: '/document-details',
        component: () => import('#/views/content-server/document-details/index.vue'),
        meta: {
          icon: 'lucide:file-text',
          title: $t('page.contentServer.documentDetails'),
        },
      },
    ],
  },
];

export default routes;