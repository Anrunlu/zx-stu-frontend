export default function () {
  return {
    // 布局相关
    layoutLeftDrawerLinks1: [
      { icon: "o_dashboard", label: "Dashboard", to: "dashboard" },
      {
        icon: "o_folder_shared",
        label: "课程管理",
        to: "course",
      },
      { icon: "o_forum", label: "题库管理", to: "questionBank" },
      { icon: "o_topic", label: "题集管理", to: "questionSet" },
      { icon: "o_fact_check", label: "作业管理", to: "homework" },
      {
        icon: "o_cast_for_education",
        label: "课堂互动",
        to: "classwork",
      },
      { icon: "o_assignment", label: "考试系统", to: "" },
      { icon: "o_leaderboard", label: "成绩管理", to: "grade" },
    ],
    layoutLeftDrawerLinks2: [
      {
        icon: "o_schema",
        label: "课程导图",
        to: "course_mindmap",
      },
      {
        icon: "o_cloud",
        label: "教学资源",
        to: "teaResource",
      },
      {
        icon: "flutter_dash",
        label: "知识画像",
        to: "",
      },
    ],
    layoutLeftDrawerLinks3: [
      { icon: "o_notifications", label: "消息中心", to: "announcement" },
      { icon: "o_settings", label: "个人设置", to: "profile" },
      {
        icon: "o_quiz",
        label: "问题反馈",
        href: "https://support.qq.com/products/450375",
      },
      // { icon: 'get_app', label: '客户端下载', to: '/' }
    ],

    // table 紧凑模式
    tableDense: true,
    // table 分页
    tablePagination: {
      rowsPerPage: 30,
    },

    // 作业类型选项
    homeworkCategoryOptions: [
      { value: "课前预习", label: "课前预习", icon: "auto_stories" },
      { value: "课堂作业", label: "互动课堂", icon: "cast_for_education" },
      { value: "课后作业", label: "课后作业", icon: "home_work" },
      { value: "课程实验", label: "课程实验", icon: "science" },
      { value: "期中考试", label: "期中考试", icon: "assignment" },
      { value: "期末考试", label: "期末考试", icon: "assignment" },
    ],

    // 题目类型选项
    questionTypeOptions: [
      {
        value: "单选",
        label: "单选",
        color: "blue",
        icon: "radio_button_checked",
      },
      { value: "多选", label: "多选", color: "green", icon: "check_box" },
      { value: "判断", label: "判断", color: "red", icon: "done" },
      { value: "填空", label: "填空", color: "orange", icon: "border_color" },
      { value: "解答", label: "解答", color: "purple", icon: "description" },
    ],
  };
}
