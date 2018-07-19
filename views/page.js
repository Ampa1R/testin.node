$(function(){
  $("#close-pop").on("click", function(e){
    $("#popuper").fadeIn( "slow", function() {
      // Animation complete
    });
    e.preventDefault();
  });
  $("#open-pop").on("click", function(){
    $("#popuper").fadeOut( "slow", function() {
      // Animation complete
    });
  });
});
