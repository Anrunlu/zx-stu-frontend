import { getLayout } from "src/utils/layout";

const defaultLayout = "TeacherLayout";

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
      // {
      //   path: "dashboard",
      //   component: () => import("pages/teacher/Dashboard.vue"),
      //   meta: {
      //     type: "teacher",
      //     title: "Dashboard",
      //   },
      // },
      {
        path: "course",
        component: () => import("pages/teacher/Course.vue"),
        meta: {
          type: "teacher",
          title: "课程管理",
        },
      },
      {
        path: "questionBank",
        component: () => import("pages/teacher/QuestionBank.vue"),
        meta: {
          type: "teacher",
          title: "题库管理",
        },
      },
      {
        path: "questionSet",
        component: () => import("pages/teacher/QuestionSet.vue"),
        meta: {
          type: "teacher",
          title: "题集管理",
        },
      },
      {
        path: "homework",
        component: () => import("pages/teacher/Homework.vue"),
        meta: {
          type: "teacher",
          title: "作业管理",
        },
      },
      {
        path: "classwork",
        component: () => import("pages/teacher/Classwork.vue"),
        meta: {
          type: "teacher",
          title: "互动课堂",
        },
      },
      {
        path: "grade",
        component: () => import("pages/teacher/Grade.vue"),
        meta: {
          type: "teacher",
          title: "成绩管理",
        },
      },
      {
        path: "course_mind",
        component: () => import(`pages/teacher/CourseMind.vue`),
        meta: {
          type: "teacher",
          title: "课程导图",
        },
      },
      {
        path: "teaResource",
        component: () => import("pages/teacher/TeaResource.vue"),
        meta: {
          type: "teacher",
          title: "教学资源",
        },
      },
      {
        path: "exam",
        component: () => import("pages/teacher/Exam.vue"),
        meta: {
          type: "teacher",
          title: "考试系统",
        },
      },
      {
        path: "portrait",
        component: () => import("pages/teacher/Portrait.vue"),
        meta: {
          type: "teacher",
          title: "知识画像",
        },
      },
      {
        path: "notice",
        component: () => import("pages/Notice.vue"),
        meta: {
          type: "teacher",
          title: "消息中心",
        },
      },
      {
        path: "profile",
        component: () => import("pages/Profile.vue"),
        meta: {
          type: "teacher",
          title: "个人设置",
        },
      },
    ],
  },
  {
    path: "/question/:questionId",
    component: () => import(`pages/teacher/QuestionEdit.vue`),
    props: true,
    meta: {
      type: "teacher",
      title: "题目编辑",
    },
  },
  {
    path: "/course_mind/:courseMindId?",
    component: () => import(`pages/teacher/CourseMindDetail.vue`),
    props: true,
    meta: {
      type: "teacher",
      title: "导图详情",
    },
  },
  {
    path: "/question_add/:courseId",
    component: () => import(`pages/teacher/QuestionAdd.vue`),
    props: true,
    meta: {
      type: "teacher",
      title: "添加题目",
    },
  },
  {
    path: "/homework/:homeworkId",
    component: () => import(`pages/teacher/HomeworkProfile.vue`),
    props: true,
    meta: {
      type: "teacher",
      title: "作业概览",
    },
  },
  {
    path: "/student_homework/:homeworkId",
    component: () => import(`pages/teacher/StudentHomework.vue`),
    props: true,
    meta: {
      type: "teacher",
      title: "学生作业",
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
