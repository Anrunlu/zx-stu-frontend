export default function () {
  return {
    // 布局相关
    layoutLeftDrawerLinks1: [
      { icon: "o_dashboard", text: "Dashboard", to: "dashboard" },
      {
        icon: "o_folder_shared",
        text: "课程管理",
        to: "course",
      },
      {
        icon: "o_schema",
        text: "课程导图",
        to: "course_mindmap",
      },
      {
        icon: "o_cast_for_education",
        text: "课堂互动",
        to: "classwork",
      },
      {
        icon: "flutter_dash",
        text: "知识画像",
        to: "",
      },
      {
        icon: "o_cloud_circle",
        text: "教学资源",
        to: "teaResource",
      },
    ],
    layoutLeftDrawerLinks2: [
      { icon: "o_forum", text: "题库管理", to: "questionBank" },
      { icon: "o_topic", text: "题集管理", to: "questionSet" },
      { icon: "o_fact_check", text: "作业管理", to: "homework" },
      { icon: "o_assignment", text: "考试系统", to: "" },
      { icon: "o_leaderboard", text: "成绩管理", to: "grade" },
    ],
    layoutLeftDrawerLinks3: [
      { icon: "o_notifications", text: "消息中心", to: "announcement" },
      { icon: "o_settings", text: "个人设置", to: "profile" },
      { icon: "o_help_center", text: "问题反馈", to: "feedback" },
      // { icon: 'get_app', text: '客户端下载', to: '/' }
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
