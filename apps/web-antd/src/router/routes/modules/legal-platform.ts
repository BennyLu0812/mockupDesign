import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'lucide:scale',
      order: 1,
      title: $t('page.legalPlatform.title'),
    },
    name: 'LegalPlatform',
    path: '/legal-platform',
    children: [
      {
        name: 'TaskManagement',
        path: '/task-management',
        meta: {
          icon: 'lucide:clipboard-list',
          title: $t('page.legalPlatform.taskManagement'),
        },
        children: [
          {
            name: 'TaskCreate',
            path: '/create',
            component: () => import('#/views/legal-platform/task-management/create.vue'),
            meta: {
              icon: 'lucide:plus',
              title: $t('page.legalPlatform.taskCreate'),
            },
          },
        ],
      },
    ],
  },
];

export default routes;