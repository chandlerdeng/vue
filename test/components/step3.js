/**
 * Created by chandler on 2016/4/5.
 */

define(["vue"], function (Vue) {

  return Vue.component("step3", function(resolve){
    console.log("开始加载step3模板");

    require([
      "myHeaderCmp",
      "text!./components/step3.html"
    ], function(myHeaderComp, html){

      resolve({
        template: html,
        data: function(){
          return {params: {}}
        },
        props: ["backFn", "jumpFn"],
        components: {
          "my-header": myHeaderComp
        },
        methods:{
          duration: function(id){
            this.params.duration=id;
            this.jumpFn({
              name: "step4",
              params: this.params
            })
          }
        },
        route: {
          activate: function (transition) {
            $.extend(this.params,this.$route.params);
            transition.next();
          }
        }
      });
    });
  })
});