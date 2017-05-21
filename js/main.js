$(document).on("pageinit","#active",function() {
$('#actwarningPlaceHolder').hide();
});
$(document).on("pageinit","#pending",function() {
$('#penwarningPlaceHolder').hide();
});
$(document).on("pageinit","#closed",function() {
$('#closdwarningPlaceHolder').hide();
});


/*Get all Tandas that are Active
that User has created or is invited to
participate - Not is in progress*/
$(document).on("pageshow","#active",function() {
  var moneyPot= null;
  var fstdate= null;
  var tname= null;
  var pot_frequency= null;
  var charge= null;
  var frequency= null;
  var poolId= null;
  var stat = true;

  /* Refrehing each time we are Loading the page*/
  $( "#activeTandas" ).empty( );

  var usrEmail = window.localStorage.getItem("usrEmail");
  var usrPass = window.localStorage.getItem("usrPass");

  if ((usrEmail != null && usrPass != null) && (usrEmail != "" && usrPass != "" )) {
    $.ajax({
      type: "GET",
      url: "http://tandaklub.com/get/mypools?e="+usrEmail+"&p="+usrPass+"",
      crossDomain: true,
      cache: false,
      dataType: 'json',
      success: function(result) {
        if (result.st == 0) {
          /*TODO:Currently only one error type, add more warnings when available*/
          if(result.err[0] == "NotFound") {
            $( "#actwarningPlaceHolder" ).empty();
            $( "#actwarningPlaceHolder" ).append( "<a href='#' class='ui-btn ui-btn-icon-right ui-icon-alert ui-state-disabled' data-inline='true' data-mini='true'>No hay informacion</a>" );
            $('#actwarningPlaceHolder').show();
          }
        }
        else {
          if (result.list.length != 0) {
            var content ="";
            for(var i = 0; i < result.list.length; i++) {
              moneyPot = result.list[i].pot;
              fstdate = result.list[i].start;
              pot_frequency = result.list[i].pot_frequency;
              charge = result.list[i].charge;
              frequency = result.list[i].frequency;
              tname = result.list[i].name;
              poolId = result.list[i].id;
              if( moneyPot != null && fstdate != null &&  pot_frequency != null && charge != null && frequency != null && tname != null){
                pot_frequency = freq2string(pot_frequency);
                var newRows="<p>Tanda:       "+moneyPot+"MXN</p><p>Frequencia:    "+pot_frequency+"</p><p>Comienza:     "+fstdate+"</p><p>Cobro:      "+charge+"</p>";
                var link =  "<a href='tandaInfo.html?poolId="+poolId+"&type=a' rel='external'>Mayor Informacion</a>"
                content+= "<div data-role='collapsible' data-collapsed='true'><h4>"+tname +"</h4>"+newRows+link+"</div>";
              }
            }/*for(var i = 0...*/

              $( "#activeTandas" ).append( content ).collapsibleset( "refresh" );
            }/* if (result.list.length != 0)*/
            else {
              $( "#activeTandas" ).append( "<p>No hay Tandas</p>" ).collapsibleset( "refresh" );
            }
          }
        } /*  success: function(result..*/
        });
      }/*if (usrEmail != null && us...)*/
      else {
        /*Should not fall in this else*/
        alert("Error. Cerrando applicacion ");
        logOut();
      }
    });

/*Get all Tandas that are Proposals
that User has created or is invited to
participate - Not yet ActivePools */
/* Cosider - Have I accepted the invitation.
             Is it a new invitation*/

$(document).on("pageshow","#pending",function() {
  var moneyPot= null;
  var fstdate= null;
  var tname= null;
  var pot_frequency= null;
  var charge= null;
  var poolId= null;
  var stat = true;

  $( "#penCrtedTandas" ).empty( );
  $( "#penInvtedTandas" ).empty( );

  var usrEmail = window.localStorage.getItem("usrEmail");
  var usrPass = window.localStorage.getItem("usrPass");

  if ((usrEmail != null && usrPass != null) && (usrEmail != "" && usrPass != "" )) {
    $.ajax({
      type: "GET",
      url: "http://tandaklub.com/get/myproposals?e="+usrEmail+"&p="+usrPass+"",
      crossDomain: true,
      cache: false,
      dataType: 'json',
      success: function(result) {
        if (result.st == 0) {
          /*TODO:Currently only one error type, add more warnings when available*/
          if(result.err[0] == "NotFound") {
            $( "#penwarningPlaceHolder" ).empty();
            $( "#penwarningPlaceHolder" ).append( "<a href='#' class='ui-btn ui-btn-icon-right ui-icon-alert ui-state-disabled' data-inline='true' data-mini='true'>No hay informacion</a>" );
            $('#penwarningPlaceHolder').show();
          }
        }
        else {
          if (result.list.length != 0) {
            var content ="";
            for(var i = 0; i < result.list.length; i++) {
              moneyPot = result.list[i].pot;
              fstdate = result.list[i].start;
              pot_frequency = result.list[i].pot_frequency;
              charge = result.list[i].charge;
              tname = result.list[i].name;
              poolId = result.list[i].id;
              status = result.list[i].status;
              if( moneyPot != null && fstdate != null &&  pot_frequency != null && charge != null  && tname != null && status != null){
                if(status == "2") {
                  pot_frequency = freq2string(pot_frequency);
                  var newRows="<p>Tanda: "+"  "+moneyPot+" MXN</p><p>Frequencia:    "+pot_frequency+"</p><p>Comienza:     "+fstdate+"</p><p>Cobro:      "+charge+"</p>";
                  var link =  "<a href='tandaInfo.html?poolId="+poolId+"&type=p' rel='external'>Mayor Informacion</a>"
                  content+= "<div data-role='collapsible' data-collapsed='true'><h4>"+tname +"</h4>"+newRows+link+"</div>";
                }
              }
            }/*for(var i = 0...*/
              $( "#penCrtedTandas" ).append( content ).collapsibleset( "refresh" );
            }/* if (result.list.length != 0)*/
            else {
              $( "#penCrtedTandas" ).append( "<p>No hay Tandas</p>" ).collapsibleset( "refresh" );
            }
          }
        } /*  success: function(result..*/
        });

        $.ajax({
          type: "GET",
          url: "http://tandaklub.com/get/invitations?e="+usrEmail+"&p="+usrPass+"",
          crossDomain: true,
          cache: false,
          dataType: 'json',
          success: function(result) {
            if (result.st == 0) {
              /*TODO:Currently only one error type, add more warnings when available*/
              if(result.err[0] == "NotFound") {
                $( "#penwarningPlaceHolder" ).empty();
                $( "#penwarningPlaceHolder" ).append( "<a href='#' class='ui-btn ui-btn-icon-right ui-icon-alert ui-state-disabled' data-inline='true' data-mini='true'>No hay informacion</a>" );
                $('#penwarningPlaceHolder').show();
              }
            }
            else {
              if (result.list.length != 0) {
                var content ="";
                for(var i = 0; i < result.list.length; i++) {
                  moneyPot = result.list[i].pot;
                  fstdate = result.list[i].start;
                  pot_frequency = result.list[i].pot_frequency;
                  charge = result.list[i].charge;
                  tname = result.list[i].name;
                  poolId = result.list[i].id;
                  if( moneyPot != null && fstdate != null &&  pot_frequency != null && charge != null  && tname != null){
                    pot_frequency = freq2string(pot_frequency);
                    var newRows="<p>Tanda: "+"  "+moneyPot+" MXN</p><p>Frequencia:    "+pot_frequency+"</p><p>Comienza:     "+fstdate+"</p><p>Cobro:      "+charge+"</p>";
                    var link =  "<a href='joinTanda.html?poolId="+poolId+"' rel='external'>Mayor Informacion</a>"
                    content+= "<div data-role='collapsible' data-collapsed='true'><h4>"+tname +"</h4>"+newRows+link+"</div>";
                  }
                }/*for(var i = 0...*/
                  $( "#penInvtedTandas" ).append( content ).collapsibleset( "refresh" );
                }/* if (result.list.length != 0)*/
                else {
                  $( "#penInvtedTandas" ).append( "<p>No hay nuevas Invitaciones</p>" ).collapsibleset( "refresh" );
                }
              }
            } /*  success: function(result..*/
            });






      }/*if (usrEmail != null && us...)*/
      else {
        /*Should not fall in this else*/
        alert("Error. Cerrando applicacion ");
        logOut();
      }
    });

    /*Get all Tandas that are Closed
    that User has created or is invited to
    participate - Tanda Finished */
    $(document).on("pageshow","#closed",function() {
      var moneyPot= null;
      var fstdate= null;
      var tname= null;
      var pot_frequency= null;
      var charge= null;
      var frequency= null;
      var poolId= null;
      var stat = true;

      $( "#closdTandas" ).empty( );

      var usrEmail = window.localStorage.getItem("usrEmail");
      var usrPass = window.localStorage.getItem("usrPass");

      if ((usrEmail != null && usrPass != null) && (usrEmail != "" && usrPass != "" )) {
        $.ajax({
          type: "GET",
          url: "http://tandaklub.com/get/myclosed?e="+usrEmail+"&p="+usrPass+"",
          crossDomain: true,
          cache: false,
          dataType: 'json',
          success: function(result) {
            if (result.st == 0) {
              /*TODO:Currently only one error type, add more warnings when available*/
              if(result.err[0] == "NotFound") {
                $( "#closdwarningPlaceHolder" ).empty();
                $( "#closdwarningPlaceHolder" ).append( "<a href='#' class='ui-btn ui-btn-icon-right ui-icon-alert ui-state-disabled' data-inline='true' data-mini='true'>No hay informacion</a>" );
                $('#closdwarningPlaceHolder').show();
              }
            }
            else {
              if (result.list.length != 0) {
                var content ="";
                for(var i = 0; i < result.list.length; i++) {
                  moneyPot = result.list[i].pot;
                  fstdate = result.list[i].start;
                  pot_frequency = result.list[i].pot_frequency;
                  charge = result.list[i].charge;
                  frequency = result.list[i].frequency;
                  tname = result.list[i].name;
                  poolId = result.list[i].id;
                  if( moneyPot != null && fstdate != null &&  pot_frequency != null && charge != null && frequency != null && tname != null){
                    pot_frequency = freq2string(pot_frequency);
                    var newRows="<p>Tanda:       "+moneyPot+"MXN</p><p>Frequencia:    "+pot_frequency+"</p><p>Comienza:     "+fstdate+"</p><p>Cobro:      "+charge+"</p>";
                    var link =  "<a href='tandaInfo.html?poolId="+poolId+"&type=c' rel='external'>Mayor Informacion</a>"
                    content+= "<div data-role='collapsible' data-collapsed='true'><h4>"+tname +"</h4>"+newRows+link+"</div>";
                  }
                }/*for(var i = 0...*/
                  $( "#closdTandas" ).append( content ).collapsibleset( "refresh" );
                }/* if (result.list.length != 0)*/
                else {
                  $( "#closdTandas" ).append( "<p>No hay Tandas</p>" ).collapsibleset( "refresh" );
                }
              }
            } /*  success: function(result..*/
            });
          }/*if (usrEmail != null && us...)*/
          else {
            /*Should not fall in this else*/
            alert("Error. Cerrando applicacion ");
            logOut();
          }
        });
