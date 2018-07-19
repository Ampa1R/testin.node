$(function(){
  $("close-pop").on("click", function(){
    $("#popuper").addClass('hidden');
  });
  $("#open-pop").on("click", function(){
    $("#popuper").removeClass('hidden');
  });
});
