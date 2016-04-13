/**
  * Created by chandler on 2016/4/5.
  */

define(["vue"], function (Vue) {

  return Vue.component("step2", function(resolve){
    console.log("开始加载step2模板");

    require([
      "myHeaderCmp",
      "text!./components/step2.html"
    ], function(myHeaderComp, html){

      resolve({
        template: html,
        props: ["backFn", "forwardFn", "jumpFn"],
        data: function(){
          return {params: {}}
        },
        components: {
          "my-header": myHeaderComp
        },
        methods:{
          risk: function(id){
            this.params.risk=id;
            if(id==4){
              this.params.duration=0;
              this.jumpFn({
                name: "step4",
                params: this.params
              })
            }else{
              this.forwardFn({
                name: "step3",
                params: this.params
              })
            }
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
  });

});