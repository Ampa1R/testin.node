$(function(){
  $("body").on("click", function(){
    $("#popuper").addClass('hidden');
  });
  $("#open-pop").on("click", function(){
    $("#popuper").toggleClass('hidden');
  });
});
