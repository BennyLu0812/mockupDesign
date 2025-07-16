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
        name: 'ProjectTemplateSelection',
        path: 'project-template-selection',
        component: () => import('#/views/legal-platform/project-template-selection/index.vue'),
        meta: {
          icon: 'lucide:layout-template',
          title: $t('page.legalPlatform.projectTemplateSelection'),
        },
      },
      {
        name: 'TaskManagement',
        path: 'task-management',
        meta: {
          icon: 'lucide:clipboard-list',
          title: $t('page.legalPlatform.taskManagement'),
        },
        children: [
          {
            name: 'TaskList',
            path: 'list',
            component: () => import('#/views/legal-platform/task-management/list.vue'),
            meta: {
              icon: 'lucide:list',
              title: $t('page.legalPlatform.taskList'),
            },
          },
          {
            name: 'TaskCreate',
            path: 'create',
            component: () => import('#/views/legal-platform/task-management/create.vue'),
            meta: {
              icon: 'lucide:plus',
              title: $t('page.legalPlatform.taskCreate'),
            },
          },
        ],
      },
      {
        name: 'WorkflowConfig',
        path: 'workflow-config',
        component: () => import('#/views/legal-platform/workflow-config/index.vue'),
        meta: {
          icon: 'lucide:settings',
          title: $t('page.legalPlatform.workflowConfig'),
        },
      },
    ],
  },
];

export default routes;
