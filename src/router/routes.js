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
          title: "我的作业",
        },
      },
      {
        path: "exam",
        component: () => import("pages/student/Exam.vue"),
        meta: {
          type: "student",
          title: "我的考试",
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
          title: "学习资源",
        },
      },
      {
        path: "knowledgeportrait",
        component: () => import("pages/student/KnowledgePortrait.vue"),
        meta: {
          type: "student",
          title: "知识画像",
        },
      },
      {
        path: "orientation",
        component: () => import("pages/student/Orientation.vue"),
        meta: {
          type: "student",
          title: "迎新板块",
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
    path: "/homeworkdetails/:homeworkId",
    component: () => import("pages/student/HomeworkDetails.vue"),
    props: true,
    meta: {
      type: "student",
      title: "作业详情",
    },
  },
  {
    path: "/examdetails/:examId",
    component: () => import("pages/student/ExamDetails.vue"),
    props: true,
    meta: {
      type: "student",
      title: "考试详情",
    },
  },
  {
    path: "/announcement/:announcementId",
    component: () => import("pages/NoticeDetails.vue"),
    props: true,
    meta: {
      type: "student",
      title: "公告详情",
    },
  },
  {
    path: "/course_mind/:courseId",
    component: () => import(`pages/student/CourseMindDetail.vue`),
    props: true,
    meta: {
      type: "student",
      title: "导图详情",
    },
  },
  {
    path: "/course_graph/:courseId",
    component: () => import(`pages/student/CourseGraphDetail.vue`),
    props: true,
    meta: {
      type: "student",
      title: "课程图谱",
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
