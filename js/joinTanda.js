
var poolId;
var poolType
var type;
var memcnt =0;
var radiOptCnt =0;

$(document).on('pageinit', "#proposalInfo", function (event) {
    // poolId = (($(this).data("url").indexOf("?") > 0) ? $(this).data("url") : window.location.href ).find( /.*poolId=/, "" );
      poolId = getQueryVariable("poolId");
      poolType = getQueryVariable("type");
     $('#warningPlaceHolder').hide();
});

$(document).on("pageshow","#proposalInfo",function() {
  var moneyPot;
  var poolusrId;
  var fstdate;
  var tname;
  var poolstat;
  var poolmembersnum;
  var poolmembersmin;
  var creatorPayDate;
  var createdByMe;

  var pot_frequency;
  var charge;
  var servcost;
  var stat = true;
  var namemembers=[];
  var mPaydates=[];
  var mStatus=[];
  var Idusers=[];
  var idUser;
  var token;
  var idm;
  var PropIdusers =[];
  var Propnamemembers =[];
  var mPropStatus =[];
  var mPropPaydates =[];


  var usrEmail = window.localStorage.getItem("usrEmail");
  var usrPass = window.localStorage.getItem("usrPass");
  var usrId = window.localStorage.getItem("usrId");

  if ((usrEmail != null && usrPass != null) && (usrEmail != "" && usrPass != "" ) && (poolId != null && poolId != "" )) {

  $.getJSON("http://tandaklub.com/get/proposal?id="+poolId+"&e="+usrEmail+"&p="+usrPass+"",function(result){
/*
 });

    $.ajax({
    type: "GET",
     url: "http://tandaklub.com/get/proposal?id=17&e=fulanito@muyenserie.tv&p=fulanito",
    //url: "http://tandaklub.com/get/myproposals?&e=fulanito@muyenserie.tv&p=fulanito",
    //url: "http://tandaklub.com/get/proposal?id="+poolId+"&e="+usrEmail+"&p="+usrPass+"",
    crossDomain: true,
    cache: false,
    //dataType: 'json',
    success: function(result) {
    */
        if (result.st == 0) {
          /*TODO:Currently only one error type, add more warnings when available*/
          if(result.err[0] == "NotFound") {
            $( "#warningPlaceHolder" ).empty();
            $( "#warningPlaceHolder" ).append( "<a href='#' class='ui-btn ui-btn-icon-right ui-icon-alert ui-state-disabled' data-inline='true' data-mini='true'>No hay informacion</a>" );
            $('#warningPlaceHolder').show();
          }
        }
        else {
           if (result.item != null) {
             var content ="";

               moneyPot = result.item.pot;
               idUser = result.item.id_user;
               fstdate = result.item.start;
               pot_frequency = result.item.pot_frequency;
               charge = result.item.charge;
               tname = result.item.name;
               poolmembersmin = result.item.membersmin;
               poolmembersnum = result.item.membersnum;
               poolstat = result.item.status;
               creatorPayDate = result.item.author_pot_date;
               createdByMe = result.item.me;

               if(moneyPot != null && fstdate != null &&  pot_frequency != null && charge != null  && tname != null){
                 pot_frequency = freq2string(pot_frequency);
                 createProposalTable(moneyPot, fstdate, pot_frequency,charge,poolmembersnum,tname,servcost);
                }
                mPaydates = createPaymentdates(pot_frequency,poolmembersnum,fstdate);
                var cnt=0;
                for(var i = 0; i < result.item.members.length; i++) {
                     /*Get Dates already selected*/
                      mPropPaydates[i] =  result.item.members[i].paydate;
                      if (usrId == result.item.members[i].id_user) {
                          token =result.item.members[i].token;
                          idm  =result.item.members[i].id;
                      }
                   }
                 createProposalMembersStat(idUser, mPaydates, mPropPaydates, poolmembersmin, poolmembersnum);
           }/* if (result.list.length != 0)*/
        }
    /*}, /*  success: function(result..*/
      /*
    error: function (xhr, ajaxOptions, thrownError) {
      alert(xhr.status);
      alert(thrownError);
        }*/
    });

  } /* if ((usrEmail != null &&  ..*/
  else {
    /*Should not fall in this else*/
    alert("Error. Cerrando applicacion ");
    logout();
  }



/* Function to Join Tanda */
  $("#jointandabtn").click(function() {
    var chsnpaydate;
    var dateSlctd = false;
    /* Checking radio buttons to detect chosed one*/
    for (var i = 0; i < radiOptCnt && dateSlctd == false; i++) {
      if (document.getElementById("choice-"+i+"").checked) {
         chsnpaydate=document.getElementById("choice-"+i+"").value;
         dateSlctd =true;
      }
    }
    if(dateSlctd == true) {
      if (token != null && token != "") {
        $.ajax({
        type: "POST",
        url: "http://tandaklub.com/set/join?e="+usrEmail+"&p="+usrPass+"&id="+poolId+"&idm="+idm+"&date="+chsnpaydate+"&token="+token+"",
        crossDomain: true,
        cache: false,
        dataType: 'json',
        success: function(result) {
            if (result.st == 0) {
              /*TODO:Currently only one error type, add more warnings when available*/
              if(result.err[0] == "NotFound") {
                $( "#warningPlaceHolder" ).empty();
                $( "#warningPlaceHolder" ).append( "<a href='#' class='ui-btn ui-btn-icon-right ui-icon-alert ui-state-disabled' data-inline='true' data-mini='true'>No se pudo agregar</a>" );
                $('#warningPlaceHolder').show();
              }
            }
            else {
                 window.location.href="main.html";
                 window.location.href.reload(true);
              }
            }
        });
      }
    }
    else {
      $( "#warningPlaceHolder" ).empty();
      $( "#warningPlaceHolder" ).append( "<a href='#' class='ui-btn ui-btn-icon-right ui-icon-alert ui-state-disabled' data-inline='true' data-mini='true'>Opcion no fue selccionada</a>" );
      $('#warningPlaceHolder').show();
    }
  });


  $("#rejectTandabtn").click(function() {


  });







});


function createProposalTable(_mP, _date, _payFreq, _chrg, _frnds, _pname) {
  var tbhead= "<thead</thead><tbody>";
  var tbfoot ="</tbody><br>";
  var newRows;
  if(_pname != null) {
    newRows+="<tr><th>Nombre de Tanda:</th><td> "+_pname+"</td></tr>";
  }
  if(_mP != null) {
    newRows+="<tr><th>Tanda:</th><td> "+_mP+" MXN</td></tr>";
  }
  if(_payFreq != null &&  _chrg != null) {
    newRows+="<tr><th>Cobro "+_payFreq+":</th><td> "+_chrg+" MXN</td></tr>";
  }
  $( "#infoTandaTable" ).empty( )
  var htmltable=tbhead+newRows+tbfoot;
  $( "table#infoTandaTable" ).append( htmltable )
};


function createProposalMembersStat( _iduser, _mpaydates, _gpaydates, _mmin, _mnum)  {
  var tbhead= "<thead</thead><tbody>";
  var tbfoot ="</tbody>";
  var newRows ="<tr><th>Fechas de Tandas</th><th>Estado</th></tr>";
  var dateadded=false;
  var tmpstat;
  for (var i=0; i < _mmin; i++)
  {
    for (var j=0; j < _mnum; j++)
    {
      if (_mpaydates[i] == _gpaydates[j]) {
          newRows= createPropsalMemRow(_iduser, radiOptCnt, _mpaydates[i], newRows);
          dateadded =true;
       }
    }
    if (dateadded != true) {
      newRows= createPropsalMemRow(null, radiOptCnt, _mpaydates[i], newRows);
    }
    dateadded=false;
  }

  $( "#membersTandaTable" ).empty( )
  var htmltable=tbhead+newRows+tbfoot;
  $( "table#membersTandaTable" ).append( htmltable )

  $("input[type='radio']").checkboxradio().checkboxradio("refresh");
};


 function createPropsalMemRow(_iduser, _cnt, _paydates, newRows) {
   if (_iduser != null)
   {
       newRows+="<tr><td> "+_paydates+"</td><td>Tomado</td></tr>";
   }
   else {
     newRows+="<tr><td><input type='radio' name='paydatechoice' id='choice-"+_cnt+"' value='"+_paydates+"'><label for='choice-"+_cnt+"'>"+_paydates+"</label></td><td>Disponible</td><td></td></tr>";
     radiOptCnt++;
   }
   return newRows;
  }
