export default function () {
  return {
    // 布局相关
    layoutLeftDrawerLinks1: [
      {
        icon: "o_folder_shared",
        label: "我的课程",
        to: "index",
      },
      // {
      //   icon: "o_cast_for_education",
      //   label: "互动课堂",
      //   to: "classwork",
      // },
    ],
    layoutLeftDrawerLinks2: [
      {
        icon: "o_fact_check",
        label: "我的作业",
        to: "homework",
      },
      {
        icon: "flutter_dash",
        label: "我的学习",
        to: "studybygraph",
      },
      {
        icon: "devices_other",
        label: "我的考试",
        to: "exam",
      },
      {
        icon: "o_cloud",
        label: "学习资源",
        to: "resources",
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
    ],
    // 考试类型选项
    examCategoryOptions: [
      { value: "期中考试", label: "期中考试", icon: "o_auto_stories" },
      { value: "期末考试", label: "期末考试", icon: "o_cast_for_education" },
    ],

    // 题目类型选项
    questionTypeOptions: [
      {
        value: "单选",
        valueEn: "singleChoice",
        label: "单选",
        color: "blue",
        icon: "radio_button_checked",
      },
      {
        value: "多选",
        valueEn: "multipleChoice",
        label: "多选",
        color: "green",
        icon: "check_box",
      },
      {
        value: "判断",
        valueEn: "trueOrFalse",
        label: "判断",
        color: "red",
        icon: "done",
      },
      {
        value: "填空",
        valueEn: "fillInBlank",
        label: "填空",
        color: "orange",
        icon: "border_color",
      },
      {
        value: "解答",
        valueEn: "jieda",
        label: "解答",
        color: "purple",
        icon: "description",
      },
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

    // 课程导图类型选项
    courseMindCategoryOptions: [
      { icon: "o_schema", value: "课程大纲", label: "课程大纲" },
    ],

    // 公告类型选项
    announcementCategoryOptions: [
      { icon: "o_forum", value: "系统公告", label: "系统公告" },
      { icon: "o_notifications", value: "系统通知", label: "系统通知" },
      { icon: "o_schema", value: "教师通知", label: "教师通知" },
      { icon: "o_schema", value: "管理员通知", label: "管理员通知" },
      { icon: "o_link", value: "链接", label: "链接" },
    ],
  };
}
