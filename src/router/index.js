import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  //  首页
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '主界面', icon: 'dashboard', affix: true }
    }]
  },
  // settig
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: 'Profile', icon: 'user', noCache: true }
      }
    ]
  },


  {
    path: '/example',
    component: Layout,
    redirect: '/example/table',
    name: 'Example',
    meta: { title: 'Example', icon: 'el-icon-s-help' },
    hidden: true,
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/table/index'),
        meta: { title: 'Table', icon: 'table' }
      },
      {
        path: 'tree',
        name: 'Tree',
        component: () => import('@/views/tree/index'),
        meta: { title: 'Tree', icon: 'tree' }
      }
    ]
  },

  {
    path: '/form',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/form/index'),
        meta: { title: 'Form', icon: 'form' }
      }
    ]
  },

  {
    path: '/nested',
    component: Layout,
    redirect: '/nested/menu1',
    name: 'Nested',
    meta: {
      title: 'Nested',
      icon: 'nested'
    },
    hidden: true,
    children: [
      {
        path: 'menu1',
        component: () => import('@/views/nested/menu1/index'), // Parent router-view
        name: 'Menu1',
        meta: { title: 'Menu1' },
        children: [
          {
            path: 'menu1-1',
            component: () => import('@/views/nested/menu1/menu1-1'),
            name: 'Menu1-1',
            meta: { title: 'Menu1-1' }
          },
          {
            path: 'menu1-2',
            component: () => import('@/views/nested/menu1/menu1-2'),
            name: 'Menu1-2',
            meta: { title: 'Menu1-2' },
            children: [
              {
                path: 'menu1-2-1',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
                name: 'Menu1-2-1',
                meta: { title: 'Menu1-2-1' }
              },
              {
                path: 'menu1-2-2',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
                name: 'Menu1-2-2',
                meta: { title: 'Menu1-2-2' }
              }
            ]
          },
          {
            path: 'menu1-3',
            component: () => import('@/views/nested/menu1/menu1-3'),
            name: 'Menu1-3',
            meta: { title: 'Menu1-3' }
          }
        ]
      },
      {
        path: 'menu2',
        component: () => import('@/views/nested/menu2/index'),
        name: 'Menu2',
        meta: { title: 'menu2' }
      }
    ]
  },
]

export const asyncRoutes = [

  // system
  {
    path: '/system',
    component: Layout,
    redirect: '/system/user',
    name: '系统管理',
    meta: { title: '系统管理', icon: 'el-icon-setting', roles: ['admin'] },
    children: [
      {
        path: 'user',
        name: '用户管理',
        component: () => import('@/views/system/user/index'),
        meta: { title: '用户管理', icon: 'user', roles: ['admin'] }
      },
      {
        path: 'role',
        name: '角色管理',
        component: () => import('@/views/system/role/index'),
        meta: { title: '角色管理', icon: 'el-icon-lock', roles: ['admin'] }
      },
      {
        path: 'menu',
        name: '权限管理',
        component: () => import('@/views/system/menu/index'),
        meta: { title: '权限管理', icon: 'el-icon-s-operation', roles: ['admin'] }
      }
    ]
  },
  // class
  {
    path: '/class',
    component: Layout,
    redirect: '/class/list',
    name: '班级管理',
    meta: { title: '班级管理', icon: 'education', roles: ['admin', 'teacher'] },
    children: [
      {
        path: 'list',
        name: '班级列表',
        component: () => import('@/views/class/list/index'),
        meta: { title: '班级列表', icon: 'list', roles: ['admin', 'teacher'] }
      },
      {
        path: 'sava',
        name: '添加班级',
        component: () => import('@/views/class/save/index'),
        meta: { title: '添加班级', icon: 'tree', roles: ['admin', 'teacher'] }
      },
      {
        path: 'update/:id',
        name: '编辑班级',
        component: () => import('@/views/class/save/index'),
        meta: { title: '编辑班级基本信息', roles: ['admin', 'teacher'], noCache: true },
        hidden: true
      },
    ]
  },
  // 上传学生（批量创建）
  {
    path: '/upload',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/upload/index'),
        name: '上传学生',
        meta: { title: '上传学生', icon: 'el-icon-upload', roles: ['admin', 'teacher'] }
      }
    ]
  },
  // course
  {
    path: '/course',
    component: Layout,
    redirect: '/course/list',
    name: '课程管理',
    meta: { title: '课程管理', icon: 'skill', roles: ['admin', 'teacher'] },
    children: [
      {
        path: 'list',
        name: '课程列表',
        component: () => import('@/views/course/list/index'),
        meta: { title: '课程列表', icon: 'list', roles: ['admin', 'teacher'] }
      },
      {
        path: 'save',
        name: '添加课程',
        component: () => import('@/views/course/add/info'),
        meta: { title: '添加课程', icon: 'tree', roles: ['admin', 'teacher'] }
      },
      {
        path: 'info/:id',
        name: 'EduCourseInfoEdit',
        component: () => import('@/views/course/add/info'),
        meta: { title: '编辑课程基本信息', roles: ['admin', 'teacher'], noCache: true },
        hidden: true
      },
      {
        path: 'chapter/:id',
        name: 'EduCourseChapterEdit',
        component: () => import('@/views/course/add/chapter'),
        meta: { title: '编辑课程大纲', roles: ['admin', 'teacher'], noCache: true },
        hidden: true
      },
      {
        path: 'publish/:id',
        name: 'EduCoursePublishEdit',
        component: () => import('@/views/course/add/publish'),
        meta: { title: '发布课程', roles: ['admin', 'teacher'], noCache: true },
        hidden: true
      }
    ]
  },
  // knowledge-point
  {
    path: '/knowledgePoint',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'KnowledgePoint',
        component: () => import('@/views/knowledgePoint/index'),
        meta: { title: '知识点', icon: 'el-icon-ice-cream-round', roles: ['admin', 'teacher'] }
      }
    ]
  },
  // question-bank
  {
    path: '/questionBank',
    component: Layout,
    redirect: '/questionBank/singial  ',
    name: '题库管理',
    meta: { title: '题库管理', icon: 'el-icon-refrigerator', roles: ['admin', 'teacher'] },
    children: [
      {
        path: 'singial',
        name: 'singialChoise',
        component: () => import('@/views/questionBank/singial/index'),
        meta: { title: '单选题', icon: 'el-icon-watermelon', roles: ['admin', 'teacher'] }
      },
      {
        path: 'multi',
        name: 'multiChoise',
        component: () => import('@/views/questionBank/multi/index'),
        meta: { title: '多选题', icon: 'el-icon-cherry', roles: ['admin', 'teacher'] }
      },
      {
        path: 'subjective',
        name: 'subjective',
        component: () => import('@/views/questionBank/subjective/index'),
        meta: { title: '主观题', icon: 'el-icon-apple', roles: ['admin', 'teacher'] }
      }
    ]
  },
  // exam
  {
    path: '/exam',
    component: Layout,
    name: '考试管理',
    redirect: '/exam/bank',
    meta: { title: '考试管理', icon: 'el-icon-document', roles: ['admin', 'teacher'] },
    children: [
      {
        path: 'bank',
        name: 'paperBank',
        component: () => import('@/views/exam/index'),
        meta: { title: '试卷库', icon: 'el-icon-document-checked' }
      },
      {
        path: 'publish',
        name: 'PaperList',
        component: () => import('@/views/exam/publish'),
        meta: { title: '考试列表', icon: 'el-icon-document-add' }
      },
      {
        path: 'read/:paperId/:classId',
        name: 'ReadPaper',
        hidden: true,
        component: () => import('@/views/exam/read'),
        meta: { title: '批阅详情', noCache: true }
      },
      {
        path: 'check/:info',
        name: 'PaperCheck',
        hidden: true,
        component: () => import('@/views/exam/check'),
        meta: { title: '批阅试卷', noCache: true }
      },
      {
        path: 'handlePublish/:row',
        name: 'handlePublish',
        hidden: true,
        component: () => import('@/views/exam/handlePublish'),
        meta: { title: '发布考试', noCache: true }
      },
      {
        path: 'show/:id',
        name: '查看试卷',
        hidden: true,
        component: () => import('@/views/exam/show'),
        meta: { title: '查看试卷', noCache: true }
      },
      {
        path: 'createHand',
        name: 'createHand',
        hidden: true,
        component: () => import('@/views/exam/createHand'),
        meta: { title: '新建试卷', noCache: false }
      },
      {
        path: 'createRandom',
        name: 'createRandom',
        hidden: true,
        component: () => import('@/views/exam/createRandom'),
        meta: { title: '新建试卷', noCache: true }
      },
      {
        path: 'questionBank/:model',
        name: '题库',
        hidden: true,
        component: () => import('@/views/exam/questionBank'),
        meta: { title: '题库', noCache: true }
      }
    ]
  },
  // 学生 在线考试
  {
    path: '/student',
    component: Layout,
    redirect: '/student/index  ',
    name: 'Student',
    meta: { title: '我的考试', icon: 'el-icon-refrigerator', roles: ['normal'] },
    children: [
      {
        path: 'exam',
        name: 'StudentExam',
        component: () => import('@/views/student/index'),
        meta: { title: '试卷列表', icon: 'el-icon-watermelon', noCache: true, roles: ['normal'] }
      },
      {
        path: 'paper/:paperId/:classId',
        name: 'StudentPaper',
        hidden: 'true',
        component: () => import('@/views/student/paper'),
        meta: { title: '在线考试', noCache: true, roles: ['normal'] }
      },
      {
        path: 'chapter/:id',
        name: 'StudentChapter',
        hidden: 'true',
        component: () => import('@/views/student/chapter'),
        meta: { title: '章节', noCache: true, roles: ['normal'] }
      },
      {
        path: 'video',
        name: 'StudentVideo',
        hidden: 'true',
        component: () => import('@/views/student/video'),
        meta: { title: '小节视屏', noCache: true, roles: ['normal'] }
      },
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
