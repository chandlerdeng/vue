/**
 * Created by chandler on 2016/4/5.
 */

define(["vue"], function (Vue) {

  return Vue.component("step1", function(resolve){
    console.log("开始加载step1模板");

    require([
      "myHeaderCmp",
      "text!./components/step1.html",
      "validator"
    ], function(myHeader, html){
      resolve({
        template: html,
        props: ["backFn", "forwardFn"],
        data: function(){
          return {
            showAmtDlg: false,
            amount: null
          }
        },
        methods: {
          onSubmit:function(){
            this.$form.validate();
            if(this.$form.valid()){
              this.showAmtDlg = false;
              this.$nextTick(function(){
                this.forwardFn("/step2/"+this.amount);
              });
            }
          }
        },
        components: {
          "myHeader":myHeader
        },
        route: {
          activate: function (transition) {
            transition.next();
            console.log("模板渲染后, 使用表单验证插件");
            this.$form = $("form");
          }
        }
      });
    });
  });

});