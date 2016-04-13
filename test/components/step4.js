/**
 * Created by chandler on 2016/4/5.
 */

define(["vue", "jquery"], function (Vue) {

  return Vue.component("step4", function(resolve){
    console.log("开始加载step4模板");
    var rdata ={
      current: "loading",
      params: {},
      ajaxData: {},
      resltTmp: "",
      $showRsltNow: false
    };
    resolve( {
      template: '<div><component v-bind:is="current" v-bind:ajax-data="ajaxData"' +
        'v-bind:submit-data="params" v-bind:back-fn="backFn"></component></div>',

      props: ["backFn", "forwardFn"],
      data:function(){
        return rdata;
      },
      components: {
        loading: Vue.extend({
          template: '<div class="ui-loading-block show"><div class="ui-loading-cnt">' +
                    '<i class="ui-loading-bright"></i><p>加载中...</p></div></div>',
          destroyed: function(){
            console.log("loading destroyed");
          },
          created: function(){
            console.log("loading created");
            var _self = this.$parent;
          }
        }),
        result: function(resolve){
          var data = {
            calcData: {
              totalIntr: 0, totalProfit: 0,
              sbAmount:0, sbProfit: 0, sbPerc:0,
              zqAmount:0, zqProfit: 0, zqPerc:0
            }
          };
          resolve( {
            template: this.resltTmp+"",
            data:function(){
              return data;
            } ,
            props: ["backFn", "ajaxData", "submitData"],
            computed:{
            },
            destroyed: function(){
              console.log("destroyed");
              $(window)
                .off("orientationchange, resize")
            },
            created: function(){
              console.log("created");
//              $.extend(this.submitData, this.$route.params);
//              $.extend(this.ajaxData, );
              this.calcData = this.doCalcData();
            },
            ready: function(){
              this.thisPage = {};
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

                this.$parent.current = "loading";
                this.$route.router.replace({
                  name: "step4", params: this.submitData
                });
                //this.$remove();
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

                this.thisPage.$intrCircle.circleProgress({
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
                $("[data-height]").css("height", function(){return that.thisPage.width*$(this).data("height")/100});
                $("[data-font-size]").css({
                  "font-size": function(){return that.thisPage.width*$(this).data("font-size")*1.15/100}
                });
                this.thisPage.$intrCircle.on('circle-animation-progress',
                  function(){
                    console.log("circle-animation-start");
                  });

                that.redrawCircle();
                $(".bbd-body").css("border-top", function(){
                  return ($("header.step4")[0].clientHeight-1)+"px solid transparent"
                });
              }
            }
          });
        }
      },
      methods: {
      },
      created: function(){
        console.log("step4 created");
        this.params = this.$route.params;
        var _self = this;
        //该事件在created之后，ready之前被触发
        fetchData(this.params, function(resp){
          _self.ajaxData=resp;

          require([
            "jqCircleProg",
            "text!./components/step4.html",
            "fz"
          ], function(js, html){
            _self.resltTmp = (html);
            _self.current = "result";
          });

        });
      },
      route:{
        canReuse: function (transition) {
          return false;
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

  })
});