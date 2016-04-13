require.config({
	baseUrl: ".",
	paths: {
		css: "http://cdn.bootcss.com/require-css/0.1.8/css.min",
		text: "http://cdn.bootcss.com/require-text/2.0.12/text.min",
		vue: "http://cdn.bootcss.com/vue/1.0.17/vue.min",
    vueRouter: "http://cdn.bootcss.com/vue-router/0.7.11/vue-router.min",
		jquery: "http://cdn.bootcss.com/jquery/3.0.0-alpha1/jquery.min",
		domReady: "http://cdn.bootcss.com/require-domReady/2.0.1/domReady.min",
    vueValidator: "http://cdn.bootcss.com/vue-validator/2.0.0-alpha.22/vue-validator.min",
    validator: "js/bbd.validate.js?v=1",
    fz: "js/jq-frozen.1.3.0",
    jqCircleProg: "js/jq-circle-progress",
    myHeaderCmp: "./components/header.js?"
	},
	priority: ["text", "css"],
	shim: {	 //为非AMD标准的插件指定变量名
		jquery: {
			exports: "$"
		},
    vue: {
			exports: "Vue"  //看起来对Vue的全局定义没起作用
		},
    vueRouter: {
      exports: "VueRouter"  //看起来对VueRouter的全局定义没起作用
    }
	}
});

/*new Promise(function(resolve){
  resolve("test")
}).then(function(val){
    console.log(val);
  });*/

require(["vue", "vueRouter", "myHeaderCmp",
  "jquery", "domReady!"], function(v, vr, myHeaderComp){
  window.Vue = v; window.VueRouter = vr; window.dzz = {};

  var slideTrans = {
    beforeEnter: function (el) {
    },
    afterEnter: function (el) {
    },
    beforeLeave: function (el) {
    },
    afterLeave: function (el) {

      this.$broadcast("slide-transition-over");
    }
  };
  Vue.transition('slide-left', slideTrans);
  Vue.transition('slide-right', slideTrans);
  Vue.filter('toFix', function (value, digits) {
    return parseFloat(value).toFixed(digits);
  });
  Vue.use(VueRouter);

  dzz.router = new VueRouter();

  var myApp = Vue.extend({
    el: "#myApp",
    data: function(){
      return {
        transition: "slide-left"
      }
    },
    methods:{
      forward: function(goOpt){
        this.transition = "slide-left";
        dzz.router.go(goOpt);
      },
      back: function(){
        this.transition = "slide-right";
        window.history.back();
      },
      jump: function(goOpt){
        this.transition = "";
        dzz.router.go(goOpt);
      }
    }
  });

  /*load components from root*/
  require([
    "./components/step1.js?v=3",
    "./components/step2.js?v=1",
    "./components/step3.js?v=1",
    "./components/step4.js?v=9"
  ], function (step1Cmp, step2Cmp, step3Cmp,step4Cmp) {
    console.log(" templates are loaded.");

    dzz.router.map({ '/': {
        name: 'home',
        component: Vue.extend({
          template: "#index",
          props: ["backFn", "forwardFn"],
          components: {
            "my-header": myHeaderComp
          },
          methods:{
            forward: function(){
              debugger;
              this.forwardFn.apply(this, arguments)}
          }
        })
      }
    });

    dzz.router.map({'/step1': {
        name: 'step1',
        component: step1Cmp
      }
    });

    dzz.router.map({ '/step2/:invAmt': {
        name: 'step2',
        component: step2Cmp
      }
    });

    dzz.router.map({
      '/step3/:invAmt/:risk': {
        name: 'step3',
        component:step3Cmp
      }
    });

    dzz.router.map({
      '/step4/:invAmt/:risk/:duration': {
        name: 'step4',
        component:step4Cmp
      }
    });
    dzz.router.afterEach(function(trans){
      //
      console.log("每次router切换到deactive这一步时的事件回调");
      //dzz.router.app.transition = "slide-left";
    });
    dzz.router.start(myApp, '#myApp');
  })
});