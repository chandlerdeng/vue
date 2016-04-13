/**
 * Created by chandler on 2016/4/5.
 */

define(["vue"], function (Vue) {
  var html = '<header class="ui-header ui-header-stable ui-border-b"> ' +
              '<i class="ui-icon-close-page" v-on:click="backFn"></i>' +
              '<h1 style="margin: 0 10%">投资评测</h1>' +
              '</header>';
  return  Vue.component("my-header", {
    template: html,
    props: ["backFn"],
    methods:{
      back: function(){
        dzz.router.app.transition = "slide-right";
        window.history.back();
      }
    }
  });
});