/**
 * Created by chandler on 2016/4/5.
 */

define(["vue", "jquery"], function (Vue) {

  return Vue.component("step4", function(resolve){
    console.log("开始加载step4模板");
    var params = {};

    resolve( {
      template: '<div class="ui-loading-block show"><div class="ui-loading-cnt"><i class="ui-loading-bright"></i><p>加载中...</p></div></div>',
      route:{
        activate: function (transition) {
          $.extend(params, this.$route.params);
          fetchData(params, afterAjax);
          //该事件在created之后，ready之前被触发
          transition.next();
          //next之后的代码 会在ready响应结束后执行
        }
      }
    });

    function fetchData(params, cb){  //ajax抓取数据
      var url = "http://zbjecom.oicp.net:8093/hic/getClaimApplys?risk="+
        params.risk +"&duration="+ params.duration +"&isRandom=0&amt="
        + params.invAmt;
      url = "data.json?avoidcache="+(+new Date);
      $.ajax({
        type: 'GET',
        url: url,
        dataType: 'json',
        success: cb,
        error: function (xhr, error) {
          var dlg = $.dialog({content: "(!) 系统繁忙, 请稍候重试", button:["返回"]})
            .delegate("[data-role=button]", "click", function(e){
              dlg.remove();
            });
        }
      });
    }


    function afterAjax(resp){

      require([
        "jqCircleProg",
        "text!./components/step4.html",
        "fz"
      ], function(js, html){

        resolve( {
          template: html,
          data:function(){
            return {
              submitData:  params,
              ajaxData: resp,
              calcData: {
                totalIntr: 0, totalProfit: 0,
                sbAmount:0, sbProfit: 0, sbPerc:0,
                zqAmount:0, zqProfit: 0, zqPerc:0
              }
            }
          } ,
          computed:{
          },
          route: {
            activate: function (transition) {
              console.log("activate");
              //该事件在created之后，ready之前被触发
              transition.next();
              //next之后的代码 会在ready响应结束后执行
            },
            canReuse: function (transition) {
              console.log("canReuse");
              return false;
            },
            deactivate: function(){
              console.log("deactivate");
              $(window)
                .off("orientationchange, resize")
            }
          },
          created: function(){
            console.log("created");
            this.thisPage = {};
            this.calcData = this.doCalcData();

          },
          ready: function(){
            console.log("DOM准备就绪");
            this.thisPage.$intrCircle = $('#interest');
            $(".ui-loading-block").removeClass("show");
            $(".hide-on-loading").removeClass("hide-on-loading");
            this.onResize();
            var _self = this;
            $(window)
              .off("orientationchange, resize")
              .on("orientationchange, resize", function(){ _self.onResize()});
          },
          methods:{
            onAmtChange: Vue.util.debounce(function(event){
              console.log(arguments);
              if(!isNaN(event.target.value) && event.target.value != this.submitData.invAmt){
                this.submitData.invAmt = parseFloat(event.target.value);
              }else{
                return;
              }

              var _self = this;
              fetchData(_self.submitData, function (ajaxData) {

                $.extend(_self.ajaxData, ajaxData);

                dzz.router.replace({name: "step4", params: _self.submitData});
              });
            },1000),
            doCalcData: function(){
              var data = {
                totalIntr: 0, totalProfit: 0,
                sbAmount:0, sbProfit: 0, sbPerc:0,
                zqAmount:0, zqProfit: 0, zqPerc:0};
              if(this.ajaxData.length){
                this.ajaxData.forEach(function(val, id, arr){
                  data.totalIntr += (val.preInvestAmt/this.submitData.invAmt)*val.interest;
                  data.totalProfit += val.preAmt;
                  if(val.type == 'CLAIM'){  //债权
                    data.zqProfit += val.preAmt;
                    data.zqAmount += val.preInvestAmt;
                    data.zqPerc++;
                  }else{  //散标
                    data.sbProfit += val.preAmt;
                    data.sbAmount += val.preInvestAmt;
                    data.sbPerc++;
                  }
                }, this);
                data.zqPerc = Math.round(data.zqPerc*100 / this.ajaxData.length);
                data.sbPerc = 100 - data.zqPerc;
              }else{
                //data.zqPerc
              }
              return data;
            },
            getExpRate : function(intr, due){return this.submitData.invAmt*intr*due/12},
            redrawCircle: function (){

              $('#interest').circleProgress({
                value: this.calcData.totalIntr,
                size: this.thisPage.width*this.thisPage.$intrCircle.data("size")/100,
                thickness: this.thisPage.width*this.thisPage.$intrCircle.data("thickness")/100,
                fill: {gradient: ["#fcc753"]},
                reverse: true,
                emptyFill: '#9ac2ff',
                startAngle: -Math.PI/2
              });
            },
            onResize : function () {
              console.log("onResize");
              var that =  this;
              this.thisPage.width = document.body.clientWidth;
              that.redrawCircle();
              $("[data-height]").css("height", function(){return that.thisPage.width*$(this).data("height")/100});
              $("[data-font-size]").css({
                "font-size": function(){return that.thisPage.width*$(this).data("font-size")*1.15/100}
              });
              $(".bbd-body").css("border-top", function(){
                return ($("header")[0].clientHeight-1)+"px solid transparent"
              });
            }
          }
        });
      });
    }
  })
});