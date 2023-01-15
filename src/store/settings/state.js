export default function () {
  return {
    // 布局相关
    layoutLeftDrawerLinks1: [
      // { icon: "o_dashboard", label: "Dashboard", to: "dashboard" },
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
        label: "互动课堂",
        to: "classwork",
      },
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
      { icon: "o_assignment", label: "考试系统", to: "exam" },
      {
        icon: "flutter_dash",
        label: "知识画像",
        to: "portrait",
      },
    ],
    layoutLeftDrawerLinks3: [
      { icon: "o_notifications", label: "消息中心", to: "notice" },
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
      { value: "课前预习", label: "课前预习", icon: "o_auto_stories" },
      { value: "课堂作业", label: "互动课堂", icon: "o_cast_for_education" },
      { value: "课后作业", label: "课后作业", icon: "o_home_work" },
      { value: "课程实验", label: "课程实验", icon: "o_science" },
      { value: "期中考试", label: "期中考试", icon: "o_assignment" },
      { value: "期末考试", label: "期末考试", icon: "o_assignment" },
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

    // 教学资源类型选项
    teaResourceCategoryOptions: [
      { icon: "o_summarize", value: "教案", label: "教案" },
      { icon: "o_calendar_month", value: "教学日历", label: "教学日历" },
      { icon: "o_list_alt", value: "教学大纲", label: "教学大纲" },
      { icon: "o_checklist", value: "考试大纲", label: "考试大纲" },
      { icon: "o_science", value: "实验大纲", label: "实验大纲" },
      { icon: "o_video_library", value: "教学课件", label: "教学课件" },
      { icon: "o_build", value: "常用工具", label: "常用工具" },
      { icon: "o_design_services", value: "毕业设计", label: "毕业设计" },
      { icon: "o_forum", value: "期末试题库", label: "期末试题库" },
      { icon: "o_folder_shared", value: "学生期末试卷", label: "学生期末试卷" },
    ],
  };
}
