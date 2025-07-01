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
        name: 'PosLogin',
        path: '/login',
        component: () => import('#/views/pos/login/index.vue'),
        meta: {
          icon: 'lucide:log-in',
          title: $t('page.pos.login'),
        },
      },
      {
        name: 'Settlement',
        path: '/settlement',
        component: () => import('#/views/pos/settlement/index.vue'),
        meta: {
          icon: 'lucide:credit-card',
          title: $t('page.pos.settlement'),
        },
      },
      {
        name: 'SalesRecords',
        path: '/sales-records',
        component: () => import('#/views/pos/sales-records/index.vue'),
        meta: {
          icon: 'lucide:file-text',
          title: $t('page.pos.salesRecords'),
        },
      },
      {
        name: 'Inventory',
        path: '/inventory',
        component: () => import('#/views/pos/inventory/index.vue'),
        meta: {
          icon: 'lucide:package',
          title: $t('page.pos.inventory'),
        },
      },
      {
        name: 'ManuscriptReceiving',
        path: '/manuscript-receiving',
        component: () => import('#/views/pos/manuscript-receiving/index.vue'),
        meta: {
          icon: 'lucide:file-plus',
          title: $t('page.pos.manuscriptReceiving'),
        },
      },
      {
        name: 'Reports',
        path: '/reports',
        meta: {
          icon: 'lucide:bar-chart-3',
          title: $t('page.pos.reports'),
        },
        children: [
          {
            name: 'CashBoxReport',
            path: '/cash-box-report',
            component: () => import('#/views/pos/reports/cash-box-report/index.vue'),
            meta: {
              icon: 'lucide:banknote',
              title: $t('page.pos.cashBoxReport'),
            },
          },
          {
            name: 'EmployeeSalesReport',
            path: '/employee-sales-report',
            component: () => import('#/views/pos/reports/employee-sales-report/index.vue'),
            meta: {
              icon: 'lucide:users',
              title: $t('page.pos.employeeSalesReport'),
            },
          },
        ],
      },
    ],
  },
];

export default routes;