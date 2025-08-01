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
        name: 'ProjectManagement',
        path: 'project-management',
        meta: {
          icon: 'lucide:folder',
          title: $t('page.legalPlatform.projectManagement'),
        },
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
            name: 'BillProjectCreate',
            path: 'bill-create',
            component: () => import('#/views/legal-platform/project-management/bill-create.vue'),
            meta: {
              icon: 'lucide:scale',
              title: '新增法案項目',
            },
          },
          {
            name: 'BillEditor',
            path: 'bill-editor',
            component: () => import('#/views/legal-platform/bill-editor/index.vue'),
            meta: {
              icon: 'lucide:edit',
              title: $t('bill-editor.title'),
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
            name: 'ProjectDetailTabsNew',
            path: 'detail-tabs-new/1',
            component: () => import('#/views/legal-platform/project-management/detail-tabs-new.vue'),
            meta: {
              icon: 'lucide:layout-grid',
              title: '項目詳情(新Tab佈局)',
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
      {
        name: 'NotificationManagement',
        path: 'notification-management',
        meta: {
          icon: 'lucide:bell',
          title: $t('page.legalPlatform.notificationManagement'),
        },
        children: [
          {
            name: 'NotificationList',
            path: 'list',
            component: () => import('#/views/legal-platform/notification-management/list.vue'),
            meta: {
              icon: 'lucide:list',
              title: $t('page.legalPlatform.notificationList'),
            },
          },
          {
            name: 'NotificationCreate',
            path: 'create',
            component: () => import('#/views/legal-platform/notification-management/create.vue'),
            meta: {
              icon: 'lucide:plus',
              title: $t('page.legalPlatform.createNotification'),
            },
          },
          {
            name: 'NotificationDetail',
            path: 'detail/:id',
            component: () => import('#/views/legal-platform/notification-management/detail.vue'),
            meta: {
              icon: 'lucide:eye',
              title: $t('page.legalPlatform.notificationDetail'),
              hideInMenu: true,
            },
          },

        ],
      },
      {
        name: 'ReportManagement',
        path: 'report-management',
        meta: {
          icon: 'lucide:chart-bar',
          title: $t('page.legalPlatform.reportManagement'),
        },
        children: [
          {
            name: 'ProjectProgressStatistics',
            path: 'project-progress-statistics',
            component: () => import('#/views/legal-platform/project-progress-statistics/index.vue'),
            meta: {
              icon: 'lucide:bar-chart-3',
              title: $t('page.legalPlatform.projectProgressStatistics'),
            },
          },
          {
            name: 'RoleWorkloadStatistics',
            path: 'role-workload-statistics',
            component: () => import('#/views/legal-platform/role-workload-statistics/index.vue'),
            meta: {
              icon: 'lucide:users-2',
              title: $t('page.legalPlatform.roleWorkloadStatistics'),
            },
          },
          {
            name: 'CurrentRoleProjectProgress',
            path: 'current-role-project-progress',
            component: () => import('#/views/legal-platform/current-role-project-progress/index.vue'),
            meta: {
              icon: 'lucide:user-check',
              title: $t('page.legalPlatform.currentRoleProjectProgress'),
            },
          },
          {
            name: 'MonthlyProgressReport',
            path: 'monthly-progress-report',
            component: () => import('#/views/legal-platform/monthly-progress-report/index.vue'),
            meta: {
              icon: 'lucide:calendar-days',
              title: $t('page.legalPlatform.monthlyProgressReport'),
            },
          },
          {
            name: 'ProjectDeadlineManagement',
            path: 'project-deadline-management',
            component: () => import('#/views/legal-platform/project-deadline-management/index.vue'),
            meta: {
              icon: 'lucide:alarm-clock',
              title: $t('page.legalPlatform.projectDeadlineManagement'),
            },
          },
          {
            name: 'PersonnelWorkloadStatistics',
            path: 'personnel-workload-statistics',
            component: () => import('#/views/legal-platform/personnel-workload-statistics/index.vue'),
            meta: {
              icon: 'lucide:users-cog',
              title: $t('page.legalPlatform.personnelWorkloadStatistics'),
            },
          },
        ],
      },
      {
        name: 'FileManagement',
        path: 'file-management',
        meta: {
          icon: 'lucide:folder-open',
          title: $t('page.legalPlatform.fileManagement'),
        },
        children: [
          {
            name: 'FileLibraryList',
            path: 'library-list',
            component: () => import('#/views/legal-platform/file-management/library-list.vue'),
            meta: {
              icon: 'lucide:database',
              title: $t('page.legalPlatform.fileLibraryList'),
            },
          },
          {
            name: 'FileLibraryCreate',
            path: 'library-create',
            component: () => import('#/views/legal-platform/file-management/library-create.vue'),
            meta: {
              icon: 'lucide:plus',
              title: $t('page.legalPlatform.fileLibraryCreate'),
            },
          },
          {
            name: 'FileLibraryDetail',
            path: 'library-detail/:id',
            component: () => import('#/views/legal-platform/file-management/library-detail.vue'),
            meta: {
              icon: 'lucide:eye',
              title: $t('page.legalPlatform.fileLibraryDetail'),
              hideInMenu: true,
            },
          },
          {
            name: 'FileLibraryConfig',
            path: 'library-config',
            component: () => import('#/views/legal-platform/file-management/library-config.vue'),
            meta: {
              icon: 'lucide:settings',
              title: $t('page.legalPlatform.fileLibraryConfig'),
            },
          },
        ],
      },
      {
        name: 'FolderManagement',
        path: 'folder-management',
        meta: {
          icon: 'lucide:folder',
          title: $t('page.legalPlatform.folderManagement'),
        },
        children: [
          {
            name: 'FolderList',
            path: 'list',
            component: () => import('#/views/legal-platform/folder-management/list.vue'),
            meta: {
              icon: 'lucide:folder-open',
              title: $t('page.legalPlatform.folderList'),
            },
          },
          {
            name: 'FolderCreate',
            path: 'create',
            component: () => import('#/views/legal-platform/folder-management/create.vue'),
            meta: {
              icon: 'lucide:plus',
              title: $t('page.legalPlatform.folderCreate'),
            },
          },
          {
            name: 'FolderDetail',
            path: 'detail/:id',
            component: () => import('#/views/legal-platform/folder-management/detail.vue'),
            meta: {
              icon: 'lucide:eye',
              title: $t('page.legalPlatform.folderDetail'),
              hideInMenu: true,
            },
          },
          {
            name: 'FolderPermission',
            path: 'permission',
            component: () => import('#/views/legal-platform/folder-management/permission.vue'),
            meta: {
              icon: 'lucide:shield',
              title: $t('page.legalPlatform.folderPermission'),
            },
          },
          {
            name: 'FolderTags',
            path: 'tags',
            component: () => import('#/views/legal-platform/folder-management/tags.vue'),
            meta: {
              icon: 'lucide:tags',
              title: $t('page.legalPlatform.folderTags'),
            },
          },
          {
            name: 'FolderHistory',
            path: 'history',
            component: () => import('#/views/legal-platform/folder-management/history.vue'),
            meta: {
              icon: 'lucide:history',
              title: $t('page.legalPlatform.folderHistory'),
            },
          },
          {
            name: 'FolderUsers',
            path: 'users',
            component: () => import('#/views/legal-platform/folder-management/users.vue'),
            meta: {
              icon: 'lucide:users',
              title: $t('page.legalPlatform.folderUsers'),
            },
          },
          {
            name: 'FolderMigration',
            path: 'migration',
            component: () => import('#/views/legal-platform/folder-management/migration.vue'),
            meta: {
              icon: 'lucide:move',
              title: $t('page.legalPlatform.folderMigration'),
            },
          },
        ],
      },
      {
        name: 'DocumentManagement',
        path: 'document-management',
        meta: {
          icon: 'lucide:file-text',
          title: $t('page.legalPlatform.documentManagement'),
        },
        children: [
          {
            name: 'DocumentList',
            path: 'list',
            component: () => import('#/views/legal-platform/document-management/list.vue'),
            meta: {
              icon: 'lucide:file-text',
              title: $t('page.legalPlatform.documentList'),
            },
          },
          {
            name: 'DocumentUpload',
            path: 'upload',
            component: () => import('#/views/legal-platform/document-management/upload.vue'),
            meta: {
              icon: 'lucide:upload',
              title: $t('page.legalPlatform.documentUpload'),
            },
          },
          {
            name: 'DocumentDetail',
            path: 'detail/:id',
            component: () => import('#/views/legal-platform/document-management/detail.vue'),
            meta: {
              icon: 'lucide:eye',
              title: $t('page.legalPlatform.documentDetail'),
              hideInMenu: true,
            },
          },
          {
            name: 'DocumentRecycleBin',
            path: 'recycle-bin',
            component: () => import('#/views/legal-platform/document-management/recycle.vue'),
            meta: {
              icon: 'lucide:trash-2',
              title: $t('page.legalPlatform.documentRecycleBin'),
            },
          },
          {
            name: 'DocumentAttributes',
            path: 'attributes',
            component: () => import('#/views/legal-platform/document-management/attributes.vue'),
            meta: {
              icon: 'lucide:tag',
              title: $t('page.legalPlatform.documentAttributes'),
            },
          },
          {
            name: 'DocumentHistory',
            path: 'history',
            component: () => import('#/views/legal-platform/document-management/history.vue'),
            meta: {
              icon: 'lucide:history',
              title: $t('page.legalPlatform.documentHistory'),
            },
          },
          {
            name: 'DocumentBatchOperation',
            path: 'batch-operation',
            component: () => import('#/views/legal-platform/document-management/batch.vue'),
            meta: {
              icon: 'lucide:layers',
              title: $t('page.legalPlatform.documentBatchOperation'),
            },
          },
          {
            name: 'DocumentPermission',
            path: 'permission',
            component: () => import('#/views/legal-platform/document-management/permissions.vue'),
            meta: {
              icon: 'lucide:shield',
              title: $t('page.legalPlatform.documentPermission'),
            },
          },
        ],
      },
    ],
  },
];

export default routes;
