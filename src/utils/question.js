/*

表达式 type(3+4j) in (int, float, complex) 的值为_。？
A、True
B、False
C、1
D、0
答案：A

语音编码有哪些？
A、波形编码
B、参量编码
C、音源编码
D、混合编码
答案：ABCD

我国第一部编年史是《资治通鉴》。
答案：对

我国的四大发明是_,_,_,_。
答案：造纸术|火药|指南针|印刷术

*/

// 将批量题目分成一个个题目字符串
export function getEachSub(whole) {
  // 替换所有的 <p> 和 </p> 标签
  whole = whole.replace(/<p>/g, "");
  whole = whole.replace(/<\/p>/g, "\n");
  // 替换回车字符
  whole = whole.replace(/&nbsp;/g, "\n");
  // 替换所有的 <br> 标签
  whole = whole.replace(/<br>/g, "\n");

  let previewQuestions = [];

  // 主要就是这句话
  let eachSourceQues = whole.trim().split(/\n\s*\n\s*/g);

  if (eachSourceQues.length) {
    eachSourceQues.forEach((item) => {
      // assembleSub就是把每个题目的字符串转换成题目对象，保存到previewSubjects数组里
      previewQuestions.push(assembleSub(item.trim()));
    });
  }

  return previewQuestions;
}

// 将一个个题目字符串拆解/组合成题目对象
export function assembleSub(eachSub) {
  let subObj = {
    type: "", // 类型
    content: "", // 题干
    rightAns: "", // 正确答案
    answer: [], // 题目选项
    explain: "", // 解析
    err: "", // 错误提示
  };
  let ansArr = eachSub.match(/\n\s*答案[:：]/g);

  if (ansArr) {
    if (ansArr.length > 1) {
      // 匹配到多个答案
      subObj.err = "每道题只能有一个答案";
    } else {
      // 添加题目 解析 和 知识点 等题目公共字段

      // 解析
      let anaReg = /\n\s*解析[:：]\s*.*/i;
      let analysis = eachSub.match(anaReg);
      if (analysis) {
        subObj.explain = analysis[0].trim().replace(/^解析[:：]\s*/g, "");
        // 添加完成后就从文本内容中去掉解析，便于进行后续的流程
        eachSub = eachSub.replace(anaReg, "");
      }

      if (eachSub.search(/\n\s*[A-Z][、]/gi) > -1) {
        // 单选和多选
        let selReg = /\n\s*答案[:：]\s*[A-Z]+/i;

        let selectAns = eachSub.match(selReg);

        if (selectAns) {
          // 答案
          let ans = selectAns[0]
            .trim()
            .replace(/^答案[:：]\s*/g, "")
            .toUpperCase();
          subObj.rightAns = ans;

          // 单选题与多选题
          subObj.type = ans.length === 1 ? "单选" : "多选";

          let sourceTimu = eachSub.replace(selReg, "");
          console.log(sourceTimu);
          // 拆分题干与选项
          let sourceTimuArr = sourceTimu.split(/[A-Z][、]/gi);
          if (sourceTimuArr.length == 1) {
            subObj.err = "选项不能为空";
          } else if (sourceTimuArr.length > 11) {
            subObj.err = "选项数量不能大于10个";
          }

          let valArr = [];
          sourceTimuArr.map((item, i) => {
            sourceTimuArr[i] = item.trim().replace(/\s+/g, " ");

            if (i === 0) {
              // 题干
              subObj.content = sourceTimuArr[i];
            } else {
              // 选项
              let obj = {
                content: sourceTimuArr[i],
                mark: String.fromCharCode(65 + i - 1), // ascii转字母
                isRight:
                  subObj.rightAns.indexOf(String.fromCharCode(65 + i - 1)) > -1
                    ? true
                    : false,
              };
              subObj.answer.push(obj);
              valArr.push(obj.mark);
            }
          });

          // 单选题
          if (subObj.rightAns.length === 1) {
            if (!valArr.includes(subObj.rightAns)) {
              subObj.err = "答案选项不正确";
            }
          } else {
            // 多选题
            for (let a of subObj.rightAns) {
              if (!valArr.includes(a)) {
                subObj.err = "答案选项不正确";
                break;
              }
            }
          }
        } else {
          subObj.err = "选择题答案不正确";
        }
      } else {
        // 非单选多选题
        let reg = /\n\s*答案[:：]\s*/g;
        let regArr = eachSub.split(reg);

        subObj.content = regArr[0];

        if (regArr[0].includes("___")) {
          // 填空题
          subObj.type = "填空";
          let len = regArr[0].match(/_{3,}/g).length;
          let fillinAns = regArr[1].split(/\s*\|\s*/g);

          if (len > 0 && len <= fillinAns.length) {
            for (let i = 0; i < len; i++) {
              if (fillinAns[i].includes("&&")) {
                subObj.answer.push({
                  mark: `${i + 1}`,
                  content: fillinAns[i],
                });
              } else {
                subObj.answer.push({
                  mark: `${i + 1}`,
                  content: fillinAns[i],
                });
              }
            }
          } else {
            subObj.err = "填空题答案个数错误";
          }
        } else if (
          // 判断题
          regArr[1].trim() === "对" ||
          regArr[1].trim() === "错" ||
          regArr[1].trim() === "F" ||
          regArr[1].trim() === "T" ||
          regArr[1].trim() === "正确" ||
          regArr[1].trim() === "错误"
        ) {
          subObj.type = "判断";

          subObj.rightAns =
            regArr[1].trim() === "对" ||
            regArr[1].trim() === "正确" ||
            regArr[1].trim() === "T"
              ? "1"
              : "0";
          const obj1 = {
            content: "正确",
            mark: "T",
            isRight: subObj.rightAns === "1" ? true : false,
          };
          const obj2 = {
            content: "错误",
            mark: "F",
            isRight: subObj.rightAns === "1" ? false : true,
          };
          subObj.answer.push(obj1, obj2);
        } else {
          /**
           * 解答题
           */
          subObj.type = "解答";
          subObj.rightAns = regArr[1].trim();
        }
      }
    }
  } else {
    // 未匹配到则为null
    subObj.err = "题目缺少答案";
  }

  return subObj;
}

// ==== 以上是题目解析函数 ====

// ==== 以下是题目工具 ====

import { Notify } from "quasar";
import { marked } from "marked";
import { formatTimeWithWeekDay } from "./time";
import { getObjectShortId } from "./common";
// 检查客观题选项是否正确
export function checkQuestionOption(questionDetails) {
  // 检查是否存在正确选项
  if (questionDetails.type != "解答" && questionDetails.type != "填空") {
    const rightOptions = questionDetails.answer.filter(
      (option) => option.isRight
    );

    if (questionDetails.type == "多选") {
      if (rightOptions.length < 2) {
        Notify.create({
          message: "正确选项数量不能少于2个",
          type: "warning",
        });
        return false;
      }
    } else {
      if (rightOptions.length !== 1) {
        Notify.create({
          message: "请设置一个正确选项",
          type: "warning",
        });
        return false;
      }
    }
  }
  return true;
}

// 检查题目内容和选项是否为空
export function checkQuestionEmptyContentAndOption(questionDetails) {
  if (questionDetails.content.trim() === "") {
    Notify.create({
      message: "题目内容不能为空",
      type: "warning",
    });
    return false;
  }

  if (questionDetails.type != "解答") {
    const options = questionDetails.answer.filter(
      (option) => option.content.trim() !== ""
    );

    if (questionDetails.type != "填空" && options.length < 2) {
      Notify.create({
        message: "有效选项数量不能少于2个，有效选项内容不可为空",
        type: "warning",
      });
      return false;
    } else if (questionDetails.type == "填空" && options.length < 1) {
      Notify.create({
        message: "有效选项数量不能少于1个，有效选项内容不可为空",
        type: "warning",
      });
      return false;
    }
  }
  return true;
}

// 检查题目
export function checkQuestion(questionDetails) {
  if (!checkQuestionEmptyContentAndOption(questionDetails)) {
    return false;
  }

  if (!checkQuestionOption(questionDetails)) {
    return false;
  }
  return true;
}

// 预处理题目列表
export function preProcessQuestionList(questionList) {
  const res = questionList.map((question, index) => {
    return {
      _id: question._id,
      shortId: question._id.slice(-5).toUpperCase(),
      creator: question.creator.nickname,
      presetScore: 0,
      type: question.type,
      // 用于排序
      sortOrder:
        question.type === "单选"
          ? 0
          : question.type === "多选"
          ? 1
          : question.type === "判断"
          ? 2
          : question.type === "填空"
          ? 3
          : 4,
      // 截取一部分文本内容，去掉html标签，如果长度大于20则截取前20个字符，后面加上...
      content: question.content.slice(0, 20).replace(/<[^>]+>/g, "") + "...",
      difficulty: question.difficulty,
      updatedAt: formatTimeWithWeekDay(question.updatedAt),
    };
  });
  return res;
}

// 预处理题目详情
export function preProcessQuestionDetails(questionDetails) {
  questionDetails._id = questionDetails._id;
  // 添加题目shortId
  questionDetails.shortId = getObjectShortId(questionDetails);
  // 格式化题目内容
  questionDetails.content = marked(questionDetails.content);
  // 用于排序
  questionDetails.sortOrder =
    questionDetails.type === "单选"
      ? 0
      : questionDetails.type === "多选"
      ? 1
      : questionDetails.type === "判断"
      ? 2
      : questionDetails.type === "填空"
      ? 3
      : 4;
  // 格式化时间
  questionDetails.createdAt = formatTimeWithWeekDay(questionDetails.createdAt);
  questionDetails.updatedAt = formatTimeWithWeekDay(questionDetails.updatedAt);
  // 处理上次更新人等信息
  if (!questionDetails.lastModifyBy) {
    questionDetails.lastModifyBy = {
      nickname: questionDetails.creator
        ? questionDetails.creator.nickname
        : "未知",
    };
  }
  // 格式化客观题选项内容
  if (questionDetails.subjective == false && questionDetails.type != "填空") {
    questionDetails.answer.forEach((option) => {
      option.content = marked(option.content);
    });
  }
}
