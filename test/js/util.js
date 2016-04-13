/**
 * Created by dzz on 2016/3/11.
 */


function getQueryParm(str) {
	var rs = new RegExp("(^|)"+str+"=([^\&]*)(\&|$)","gi").exec(window.document.location.href), tmp;
	if(tmp=rs){
		tmp[2] = tmp[2].split('?')[0];
		tmp[2] = tmp[2].split('#')[0];
		return tmp[2];
	}
	// parameter cannot be found
	return "";
}
function getQueryStr() {
	var arr = window.document.location.href.split("?");

	if(arr.length==2){
		var rslt = arr[1];
		return rslt.replace(/#.*/g, "").replace(/&$/g, "");
	}
	return "";
}
function backward() {
	window.history.back();
}


if( typeof Vue != "undefined") {
	Vue.filter('toFix', function (value, digits) {
		return parseFloat(value).toFixed(digits);
	});
}