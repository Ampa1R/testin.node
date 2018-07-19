$(function(){
  $("#open-pop").on("click", function(){
    $("#popuper").toggleClass('hidden');
  });
  $("body").on("click", function(){
    $("#popuper").addClass('hidden');
  });
});
