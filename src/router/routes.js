import { getLayout } from "src/utils/layout";

const defaultLayout = "StudentLayout";

const routes = [
  {
    path: "/login",
    component: () => import("pages/Login.vue"),
    meta: {
      isPublic: true,
      title: "登录",
    },
  },
  {
    path: "",
    component: () => import(`layouts/${getLayout() || defaultLayout}.vue`),
    children: [
      {
        path: "index",
        component: () => import("pages/student/Index.vue"),
        meta: {
          type: "student",
          title: "我的课程",
        },
      },
      {
        path: "classwork",
        component: () => import("pages/student/Classwork.vue"),
        meta: {
          type: "student",
          title: "互动课堂",
        },
      },
      {
        path: "homework",
        component: () => import("pages/student/Homework.vue"),
        meta: {
          type: "student",
          title: "作业管理",
        },
      },
      {
        path: "studybygraph",
        component: () => import("pages/student/StudyByGraph.vue"),
        meta: {
          type: "student",
          title: "我的学习",
        },
      },
      {
        path: "resources",
        component: () => import("pages/student/Resources.vue"),
        meta: {
          type: "student",
          title: "我的资源",
        },
      },
      {
        path: "notice",
        component: () => import("pages/Notice.vue"),
        meta: {
          type: "student",
          title: "消息中心",
        },
      },
      {
        path: "profile",
        component: () => import("pages/Profile.vue"),
        meta: {
          type: "student",
          title: "个人设置",
        },
      },
    ],
  },
  {
    path: "/question/:questionId",
    component: () => import(`pages/student/QuestionEdit.vue`),
    props: true,
    meta: {
      type: "student",
      title: "题目编辑",
    },
  },
  {
    path: "/course_mind/:courseMindId?",
    component: () => import(`pages/student/CourseMindDetail.vue`),
    props: true,
    meta: {
      type: "student",
      title: "导图详情",
    },
  },
  {
    path: "/question_add/:courseId",
    component: () => import(`pages/student/QuestionAdd.vue`),
    props: true,
    meta: {
      type: "student",
      title: "添加题目",
    },
  },
  {
    path: "/question_import/:courseId",
    component: () => import(`pages/student/QuestionImport.vue`),
    props: true,
    meta: {
      type: "student",
      title: "题目导入",
    },
  },
  {
    path: "/homework/:homeworkId",
    component: () => import(`pages/student/HomeworkProfile.vue`),
    props: true,
    meta: {
      type: "student",
      title: "作业概览",
    },
  },
  {
    path: "/student_homework/:homeworkId",
    component: () => import(`pages/student/StudentHomework.vue`),
    props: true,
    meta: {
      type: "student",
      title: "学生作业",
    },
  },
  {
    path: "/student/homeworkdetails/:homeworkId",
    component: () => import("pages/student/HomeworkDetails.vue"),
    props: true,
    meta: {
      type: "student",
      title: "作业详情",
    },
  },
];

// Always leave this as last one
if (process.env.MODE !== "ssr") {
  routes.push({
    path: "*",
    component: () => import("pages/Error404.vue"),
  });
}

export default routes;
