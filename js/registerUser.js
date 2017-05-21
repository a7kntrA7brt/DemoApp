
var _username;
var _pass;
var _pass2;
var _email;

var JoinTandaID = null
var JoinTandaHash = null
var JoinTandaGuestID = null

/*Determine if arrived trough specific proposal*/
$(document).on('pageinit', "#registeruser", function (event) {
  $('#warningPlaceHolder').hide();
  /*TODO: ADD option to parse Join Tanda Info Here from URL or Data */
});

$(document).on('pageshow', "#registeruser", function (event) {
  /*Register New User on Tanda Database*/
  $("#btnSet").click(function()
  {
    var userExists = false;
    var emailExists = false;
    var inptvalid = true;
    _email = document.getElementById("email").value;
    _username = document.getElementById("username").value;
    _pass = document.getElementById("password").value;
    _pass2 = document.getElementById("password2").value;
     /*Validate Inputs*/
     if(_email != null && _username != null && _pass != null && _pass2 != null && _email != "" && _username != "" && _pass != "" && _pass2 != "") {
       if ( _email.search("@") == -1) {
          $( "#warningPlaceHolder" ).empty();
          $( "#warningPlaceHolder" ).append( "<a href='#' class='ui-btn ui-btn-icon-right ui-icon-alert ui-state-disabled' data-inline='true' data-mini='true'>Email not tiene '@' </a>" );
          $('#warningPlaceHolder').show();
          inptvalid = false;
       }
       if ( _pass != _pass2) {
          $( "#warningPlaceHolder" ).empty();
          $( "#warningPlaceHolder" ).append( "<a href='#' class='ui-btn ui-btn-icon-right ui-icon-alert ui-state-disabled' data-inline='true' data-mini='true'>Passwords no son iguales </a>" );
          $('#warningPlaceHolder').show();
          inptvalid = false;
       }
     }
     else {
       $( "#warningPlaceHolder" ).empty();
       $( "#warningPlaceHolder" ).append( "<a href='#' class='ui-btn ui-btn-icon-right ui-icon-alert ui-state-disabled' data-inline='true' data-mini='true'>Uno o mas campos son invalidos</a>" );
       $('#warningPlaceHolder').show();
       inptvalid = false;
     }

     if (inptvalid == true) {
       $.ajax({
       type: "POST",
       url: "http://tandaklub.com/set/signup?email="+_email+"&name="+_username+"&password="+_pass+"&lang=es-mx&currency=mxn",
       crossDomain: true,
       cache: false,
       dataType: 'json',
       success: function(result) {
           if (result.st == 0) {
             /*TODO:Currently only one error type, add more warnings when available*/
             if(result.err[0] == "NotFound") {
               $( "#warningPlaceHolder" ).empty();
               $( "#warningPlaceHolder" ).append( "<a href='#' class='ui-btn ui-btn-icon-right ui-icon-alert ui-state-disabled' data-inline='true' data-mini='true'>Password o E-mail incorrectos</a>" );
               $('#warningPlaceHolder').show();
             }
           }
           else {
             window.localStorage.setItem("usrId", result.data);
             window.localStorage.setItem("usrEmail", _email);
             window.localStorage.setItem("usrPass", _pass);
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
  });//$("#btnSet").click(function()
});
