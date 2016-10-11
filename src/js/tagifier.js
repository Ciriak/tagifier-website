var apiUri = "https://api.github.com/repos/Cyriaqu3/tagifier/releases/latest";

var t = $("#dl-url");

//retreive links for the last release
$.get( apiUri, function( data ) {
  var platform = checkNav();
  if(!data.assets[platform.assetIndex]){
    data.assets[platform.assetIndex] = {
      browser_download_url: "#"
    };
  }
  var setupUrl = data.assets[1].browser_download_url;
  t.find("i").addClass("mdi-"+platform.icon);
  t.attr("href", data.assets[platform.assetIndex].browser_download_url);
  t.attr("target", "_blank");
  t.attr("title", platform.label);
  t.fadeTo(1.0, 500);
  //enable tooltip
  $(function () {
    $('[data-toggle="tooltip"]').tooltip()
  });
});

function checkNav() {
  var r;
  if(navigator.platform.indexOf('Mac') > -1){
    r = {
      icon: "apple",
      label: "For OSX",
      assetIndex: 4
    };
  }
  if(navigator.platform.indexOf('Win') > -1){
    r = {
      icon: "windows",
      label: "For Windows 64 bits",
      assetIndex: 1
    };
  }
  return r;
}

$(document).ready(function() {
  setTimeout(function(){
      $("#screen").addClass("animated fadeInLeft");
  },1000);
});
