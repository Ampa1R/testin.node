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
  $("#query_result").delegate(".remove-item", "click", function(e){
    var b = $(this),
        sendData = "remove_id=" + b.data("id");
    $.ajax({
      type: "POST",
      url: "/remove",
      datatype: "application/json",
      data: sendData,
      success: function(data) {
        console.log(data);
        getList();
      },
      error: function(jqXHR, textStatus, err) {
        console.log('text status '+textStatus+', err '+err);
      }
    });
    e.preventDefault();
  });
  $("#add_user").submit(function(e, data){
    $.ajax({
      type: "POST",
      url: "/add",
      datatype: "json",
      data: $(this).serialize(),
      success: function(data) {
        console.log('Success!');
        getList();
      },
      error: function(jqXHR, textStatus, err) {
        console.log('text status '+textStatus+', err '+err);
      }
    });
    e.preventDefault();
  });

  function getList(){
    $.post("/show", "", function(data){
      $("#query_result").html(data);
    })
  }
  getList();
  $("#refresh_list").on("click", getList);
});
