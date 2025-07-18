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
        name: 'TemplateManagement',
        path: 'template-management',
        component: () => import('#/views/legal-platform/template-management/index.vue'),
        meta: {
          icon: 'lucide:settings',
          title: $t('page.legalPlatform.templateManagementPage'),
        },
      },
      {
        name: 'ProjectManagement',
        path: 'project-management',
        meta: {
          icon: 'lucide:folder',
          title: $t('page.legalPlatform.projectManagement'),
        },
        children: [
          {
            name: 'ProjectList',
            path: 'list',
            component: () => import('#/views/legal-platform/project-management/list.vue'),
            meta: {
              icon: 'lucide:list',
              title: $t('page.legalPlatform.projectList'),
            },
          },
          {
            name: 'ProjectCreate',
            path: 'create',
            component: () => import('#/views/legal-platform/project-management/create.vue'),
            meta: {
              icon: 'lucide:plus',
              title: $t('page.legalPlatform.projectCreate'),
            },
          },
          {
            name: 'ProjectDetail',
            path: 'detail/:id',
            component: () => import('#/views/legal-platform/project-management/detail.vue'),
            meta: {
              icon: 'lucide:eye',
              title: $t('page.legalPlatform.projectDetail'),
              hideInMenu: true,
            },
          },
          {
            name: 'ProjectRoleManagement',
            path: 'role-management',
            component: () => import('#/views/legal-platform/project-management/role-management.vue'),
            meta: {
              icon: 'lucide:users',
              title: $t('page.legalPlatform.projectRoleManagement'),
            },
          },
        ],
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
      {
        name: 'MyProjects',
        path: 'my-projects',
        component: () => import('#/views/legal-platform/my-projects/index.vue'),
        meta: {
          icon: 'lucide:user-check',
          title: $t('page.legalPlatform.myProjects'),
        },
      },
    ],
  },
];

export default routes;
