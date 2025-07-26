import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'lucide:file-text',
      order: 1,
      title: $t('page.enact.title'),
    },
    name: 'EnAct',
    path: '/enact',
    children: [
      {
        name: 'BillDrafting',
        path: '/bill-drafting',
        component: () => import('#/views/enact/bill-drafting/index.vue'),
        meta: {
          icon: 'lucide:edit-3',
          title: $t('page.enact.billDrafting'),
        },
      },
    ],
  },
];

export default routes;
