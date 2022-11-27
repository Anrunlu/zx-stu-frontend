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
    path: "/teacher",
    component: () => import(`layouts/${getLayout() || defaultLayout}.vue`),
    children: [
      {
        path: "dashboard",
        component: () => import("pages/teacher/Dashboard.vue"),
        meta: {
          type: "teacher",
          title: "Dashboard",
        },
      },
      {
        path: "course",
        component: () => import("pages/teacher/Course.vue"),
        meta: {
          type: "teacher",
          title: "课程管理",
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
    ],
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
