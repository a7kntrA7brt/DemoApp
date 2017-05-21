var JoinTandaID = null
var JoinTandaHash = null
var JoinTandaGuestID = null

$(document).on("pageinit","#login",function() {
  var usrEmail;
  var usrPass;
  /*Check if user is alredy logged in and has valid user ID*/
  usrEmail = window.localStorage.getItem("usrEmail");
  usrPass = window.localStorage.getItem("usrPass");

 /*TODO: ADD option to parse Join Tanda Info Here from URL or Data */

 $('#warningPlaceHolder').hide();

  if (usrEmail != null && usrPass != null) {
    $.ajax({
      type: "GET",
      url: "http://tandaklub.com/get/me?e="+usrEmail+"&p="+usrPass+"",
      crossDomain: true,
      cache: false,
      dataType: 'json',
      success: function(result) {
        if (result.st == 1) {
          /*TODO: ADD option to use Join Tanda Information to launch Join tanda Page*/
          if (JoinTandaID == null && JoinTandaHash == null && JoinTandaGuestID == null) {
             window.location.href="main.html";
             window.location.href.reload(true);
          }
          else {
            /*TODO: ADD option to use Join Tanda Information to launch Join tanda Page*/
          }
        }
      }
    });
  }
});
$(document).on("pageshow","#login",function() {
/*User is not logged In- waiting for submit*/
$("#submitlogin").click(function()
{
       var loginEmail = document.getElementById("loginEmail").value;
       var loginpass = document.getElementById("loginPasswrd").value;

       if ((loginEmail != null && loginpass != null) && (loginEmail != "" && loginpass != "") ) {
       $.ajax({
       type: "GET",
       url: "http://tandaklub.com/get/me?e="+loginEmail+"&p="+loginpass+"",
       crossDomain: true,
       cache: false,
       dataType: 'json',
       success: function(result){
           if (result.st == 0) {
             /*TODO:Currently only one error type, add more warnings when available*/
             if(result.err[0] == "NotFound") {
               $( "#warningPlaceHolder" ).empty();
               $( "#warningPlaceHolder" ).append( "<a href='#' class='ui-btn ui-btn-icon-right ui-icon-alert ui-state-disabled' data-inline='true' data-mini='true'>Password o E-mail incorrectos</a>" );
               $('#warningPlaceHolder').show();
             }
           }
           else {
             window.localStorage.setItem("usrId", result.item.id);
             window.localStorage.setItem("usrEmail", loginEmail);
             window.localStorage.setItem("usrPass", loginpass);
             /* Check if We need to lunch Join Tanda page */
             if (JoinTandaID == null && JoinTandaHash == null && JoinTandaGuestID == null) {
                window.location.href="main.html";
                window.location.href.reload(true);
             }
             else {
               /*TODO: ADD option to use Join Tanda Information to launch Join tanda Page*/
             }
           }
       }
       });
     }
     else {
        $( "#warningPlaceHolder" ).empty();
        $( "#warningPlaceHolder" ).append( "<a href='#' class='ui-btn ui-btn-icon-right ui-icon-alert ui-state-disabled' data-inline='true' data-mini='true'>Uno o mas campos son invalidos</a>" );
        $('#warningPlaceHolder').show();
     }
});


});
