/**
 * 吐个槽接入脚本
 * 支持 AMD，CJS，全局调用
 */
(function(root, factory) {
    if (typeof define === "function" && define.amd) {
        define(function() {
            return (root.Tucao = factory());
        });
    } else if (typeof module === "object" && module.exports) {
        module.exports = (root.Tucao = factory());
    } else {
        root.Tucao = factory();
    }
}(this, function() {
    
    var Tucao = (function() {
        /**
         * 发起接入请求
         * @param  {Number} productId  需要接入产品 id
         * @param  {[Object]} data     需要传递的用户信息            
         */
        var request = function(productId, data) {
            var form = document.createElement("form");
            form.id = "form";
            form.name = "form";
            document.body.appendChild(form);

            // 设置相应参数 
            for (key in data) {
                var input = document.createElement("input");
                input.type = "text";
                input.name = key;
                input.value = data[key];
                // 将该输入框插入到 form 中 
                form.appendChild(input);
            }
            // form 的提交方式 
            form.method = "POST";
            // form 提交路径 
            form.action = "https://support.qq.com/product/" + productId;
            // 对该 form 执行提交 
            form.submit();
            // 删除该 form 
            document.body.removeChild(form);
        }
        return {
            request: request,
        }
    })();

    return Tucao;

}));