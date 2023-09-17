
# 知新 2 (zx-student_frontend)

知新 2 学生端

## APP 发布流程

1. 修改路由模式为 hash
2. 修改 Cookies 为 localStorage，涉及到 /src/utils/auth.js
3. 修改 quasar.conf.js里的APP_Version
4. 修改 /ckeditor5/src/MyFileUploadBtn.js 中的 Cookies 为 localStorage，进入 ckedito5 目录，npm install 后执行 npm run build，之后退回到项目文件夹 zx_student_frontend，执行 yarn add ./ckeditor5
