$(function(){
  $("#close-pop").on("click", function(e){
    $("#popuper").fadeOut( "slow", function() {
      // Animation complete
    });
    e.preventDefault();
  });
  $("#open-pop").on("click", function(){
    $("#popuper").fadeIn( "slow", function() {
      // Animation complete
    });
  });
});
