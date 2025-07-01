import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'lucide:shopping-cart',
      order: 2,
      title: $t('page.pos.title'),
    },
    name: 'POS',
    path: '/pos',
    children: [
      {
        name: 'Settlement',
        path: '/settlement',
        component: () => import('#/views/pos/settlement/index.vue'),
        meta: {
          icon: 'lucide:credit-card',
          title: $t('page.pos.settlement'),
        },
      },
    ],
  },
];

export default routes;