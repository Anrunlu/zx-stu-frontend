<template>
  <q-page>
    <!-- 课程卡片 -->
    <div class="row justify-center items-start">
      <q-card
        class="q-ma-sm col-md-4 col-12"
        v-for="(item, index) in [1, 2, 3, 4, 5, 6, 7, 8, 9]"
        :key="index"
        flat
      >
        <!-- 教学班表格 -->
        <q-table
          :data="courseData.classrooms"
          :columns="teaCourseColumns"
          row-key="id"
          hide-pagination
          @row-click="handleTeaClassroomClick"
        >
          <template v-slot:top-left>
            <q-chip square>
              <q-avatar icon="class" color="primary" text-color="white" />
              {{ courseData.course.name }}
            </q-chip>
            <div class="q-gutter-sm row q-mt-sm">
              <q-btn
                dense
                flat
                color="positive"
                icon="add"
                label="创建班级"
              ></q-btn>
              <q-btn
                dense
                flat
                color="red"
                icon="delete"
                size="xs"
                label="删除课程"
              ></q-btn>
            </div>
          </template>
          <template v-slot:body-cell-action="props">
            <q-td :props="props">
              <div class="q-gutter-sm">
                <q-btn
                  flat
                  dense
                  size="sm"
                  color="primary"
                  icon="fas fa-cog"
                  @click.stop=""
                  ><q-tooltip> 重命名教学班 </q-tooltip></q-btn
                >
                <q-btn
                  flat
                  dense
                  size="md"
                  color="primary"
                  icon="person_add"
                  @click.stop=""
                  ><q-tooltip> 添加学生 </q-tooltip></q-btn
                >
                <q-btn
                  flat
                  dense
                  size="md"
                  color="red"
                  icon="delete"
                  @click.stop=""
                  ><q-tooltip> 删除教学班</q-tooltip></q-btn
                >
              </div>
            </q-td>
          </template>

          <template v-slot:no-data>
            <div class="full-width row flex-center text-grey q-gutter-sm">
              <span class="text-h6"> 暂无数据 </span>
            </div>
          </template>
        </q-table>
      </q-card>
    </div>

    <!-- 添加课程按钮 -->
    <q-page-sticky position="top-right" :offset="[25, 20]">
      <q-btn
        class="q-ma-xs bg-purple"
        round
        icon="add"
        size="32px"
        color="primary"
        ><q-tooltip
          content-class="bg-indigo"
          content-style="font-size: 16px"
          :offset="[10, 10]"
          >添加课程</q-tooltip
        ></q-btn
      >
    </q-page-sticky>
  </q-page>
</template>

<script>
import { getTeaCourseInfo } from "@/api/teacher/course";
export default {
  data() {
    return {
      // 课程班级列表表头列表
      teaCourseColumns: [
        {
          name: "className",
          label: "班级名",
          align: "center",
          field: "name",
          sortable: true,
        },
        {
          name: "action",
          align: "center",
          label: "操作",
        },
      ],
    };
  },

  methods: {
    // 获取教师课程信息
    async getTeaCourseInfo() {
      const { data } = await getTeaCourseInfo();
      console.log(data);
    },
    // 处理点击教学班
    handleTeaClassroomClick(row) {},
  },
};
</script>

<style></style>
