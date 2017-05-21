
var poolId;
var poolType
var type;
var memcnt =0;

$(document).on('pageinit', "#tandaInfo", function (event) {
    // poolId = (($(this).data("url").indexOf("?") > 0) ? $(this).data("url") : window.location.href ).find( /.*poolId=/, "" );
      poolId = getQueryVariable("poolId");
      poolType = getQueryVariable("type");
     $('#warningPlaceHolder').hide();
});

$(document).on("pageshow","#tandaInfo",function() {
  var moneyPot;
  var poolusrId;
  var fstdate;
  var tname;
  var poolstat;
  var poolmembersnum;
  var poolmembersmin;
  var creatorPayDate;
  var createdByMe;
  var db;
  var pot_frequency;
  var charge;
  var servcost;
  var stat = true;
  var namemembers=[];
  var mPaydates=[];
  var mStatus=[];
  var Idusers=[];
  var idUser;

  var PropIdusers =[];
  var Propnamemembers =[];
  var mPropStatus =[];
  var mPropPaydates =[];


  var usrEmail = window.localStorage.getItem("usrEmail");
  var usrPass = window.localStorage.getItem("usrPass");
  var usrId = window.localStorage.getItem("usrId");

  if ((usrEmail != null && usrPass != null) && (usrEmail != "" && usrPass != "" ) && (poolId != null && poolId != "" )) {

  if (poolType == "a") {
  $.getJSON("http://tandaklub.com/get/pool?id="+poolId+"&e="+usrEmail+"&p="+usrPass+"",function(result){
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
               poolmembersnum = result.item.membersnum;
               poolstat = result.item.status;
               creatorPayDate = result.item.author_pot_date;
               createdByMe = result.item.me;
               servcost = result.item.servicecost;

               if(moneyPot != null && fstdate != null &&  pot_frequency != null && charge != null  && tname != null){
                 pot_frequency = freq2string(pot_frequency);
                 createPoolTable(moneyPot, fstdate, pot_frequency,charge,poolmembersnum,tname,servcost);
                }

                result.item.members.sort(function(a,b){
                var c = new Date(a.paydate);
                var d = new Date(b.paydate);
                return c-d;
                });

                for(var i = 0; i < result.item.members.length; i++) {
                     Idusers[i] = result.item.members[i].id_user;
                     namemembers[i]= result.item.members[i].name;
                     mPaydates[i] =  result.item.members[i].paydate;
                     mStatus[i] = poolMemStat2String(result.item.members[i].status);
                 }
                 createPoolMembersStat( usrId, Idusers, namemembers, mPaydates , mStatus, (result.item.members.length));
           }/* if (result.list.length != 0)*/
        }
    /*}, /*  success: function(result..*/
      /*
    error: function (xhr, ajaxOptions, thrownError) {
      alert(xhr.status);
      alert(thrownError);
        }*/
    });


} /* if accepted */
else if (poolType == "p") {

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
                      PropIdusers[i]= result.item.members[i].id_user;
                      Propnamemembers[i]= result.item.members[i].name;
                      mPropStatus[i] = result.item.members[i].status;
                      mPropPaydates[i] =  result.item.members[i].paydate;

                   }
                 createProposalMembersStat(usrId, mPaydates, PropIdusers, Propnamemembers, mPropPaydates, poolmembersmin, poolmembersnum);
           }/* if (result.list.length != 0)*/
        }
    /*}, /*  success: function(result..*/
      /*
    error: function (xhr, ajaxOptions, thrownError) {
      alert(xhr.status);
      alert(thrownError);
        }*/
    });


}
else if (poolType == "c"){

  $.getJSON("http://tandaklub.com/get/pool?id="+poolId+"&e="+usrEmail+"&p="+usrPass+"",function(result){
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
               poolmembersnum = result.item.membersnum;
               poolstat = result.item.status;
               creatorPayDate = result.item.author_pot_date;
               createdByMe = result.item.me;
               servcost = result.item.servicecost;
               if(moneyPot != null && fstdate != null &&  pot_frequency != null && charge != null  && tname != null){
                 pot_frequency = freq2string(pot_frequency);
                 createPoolTable(moneyPot, fstdate, pot_frequency,charge,poolmembersnum,tname,servcost);
                }

                result.item.members.sort(function(a,b) {
                var c = new Date(a.paydate);
                var d = new Date(b.paydate);
                return c-d;
                });

                for(var i = 0; i < result.item.members.length; i++) {
                     Idusers[i] = result.item.members[i].id_user;
                     namemembers[i]= result.item.members[i].name;
                     mPaydates[i] =  result.item.members[i].paydate;
                     mStatus[i] = propMemStat2String(result.item.members[i].status);
                 }
                 createPoolMembersStat(usrId,Idusers,namemembers,mPaydates,mStatus, (result.item.members.length));
           }/* if (result.list.length != 0)*/
        }
    /*}, /*  success: function(result..*/
      /*
    error: function (xhr, ajaxOptions, thrownError) {
      alert(xhr.status);
      alert(thrownError);
        }*/
    });


}

  } /* if ((usrEmail != null &&  ..*/
  else {
    /*Should not fall in this else*/
    alert("Error. Cerrando applicacion ");
    logout();
  }
});

function createPoolTable(_mP, _date, _payFreq, _chrg, _frnds, _pname, _sercost) {
  var tbhead= "<thead</thead><tbody>";
  var tbfoot ="</tbody>";
  var newRows;
  if(_pname != null){
    newRows+="<tr><th>Nombre de Tanda:</th><td> "+_pname+"</td></tr>";
  }
  if(_mP != null){
    newRows+="<tr><th>Tanda:</th><td> "+_mP+" MXN</td></tr>";
  }
  if(_payFreq != null &&  _chrg != null && _sercost != null) {
    totalCharge = parseFloat(_sercost);
    totalCharge+= parseInt(_chrg);
    newRows+="<tr><th>Cobro "+_payFreq+":</th><td> "+totalCharge+" MXN</td></tr>";
    newRows+="<tr><th></th><td>"+_chrg+" MXN (cargo)</td></tr>";
    newRows+="<tr><th></th><td>"+_sercost+" MXN (servicio)</td></tr>";
  }
  $( "#infoTandaTable" ).empty( )
  var htmltable=tbhead+newRows+tbfoot;
  $( "table#infoTandaTable" ).append( htmltable )
};

function createProposalTable(_mP, _date, _payFreq, _chrg, _frnds, _pname) {
  var tbhead= "<thead</thead><tbody>";
  var tbfoot ="</tbody>";
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

function createPoolMembersStat( _iduser, _idusers, _namemembers, _paydates, _status, length) {
  var tbhead= "<thead</thead><tbody>";
  var tbfoot ="</tbody>";
  var newRows ="<tr><th>Fechas de Tandas</th><th>Participantes</th><th>Status</th></tr>";

  for (var i=0; i < length; i++)
  {
     newRows=createMemRow(_iduser, _idusers, _namemembers, _paydates, _status, i, newRows);
  }
  $( "#membersTandaTable" ).empty( )
  var htmltable=tbhead+newRows+tbfoot;
  $( "table#membersTandaTable" ).append( htmltable )
};

function createProposalMembersStat( _iduser, _mpaydates, _gidusers, _gmemembers, _gpaydates, _mmin, _mnum)  {
  var tbhead= "<thead</thead><tbody>";
  var tbfoot ="</tbody>";
  var newRows ="<tr><th>Fechas de Tandas</th><th>Participantes</th></tr>";
  var dateadded=false;
  var tmpstat;
  for (var i=0; i < _mmin; i++)
  {
    for (var j=0; j < _mnum; j++)
    {
      if (_mpaydates[i] == _gpaydates[j]) {
          newRows= createPropsalMemRow(_iduser, _gidusers[j], _gmemembers[j], _mpaydates[i], newRows);
          dateadded =true;
       }
    }
    if (dateadded != true) {
      newRows= createPropsalMemRow(null, null, null, _mpaydates[i], newRows);
    }
    dateadded=false;
  }

  $( "#membersTandaTable" ).empty( )
  var htmltable=tbhead+newRows+tbfoot;
  $( "table#membersTandaTable" ).append( htmltable )
};

function createMemRow(_iduser, _idusers,_namemembers, _paydates, _status, memcnt, newRows) {
  var memName;
  var mempaydate;
  memName = _namemembers[memcnt];
  if (memName == null) {
    memName = "No definido"
  }
  mempaydate = _paydates[memcnt];
  if (mempaydate == null ) {
    mempaydate = "No selecto"
  }
  if (_iduser == _idusers[memcnt]) {
    newRows+="<tr class='highlight' ><td>"+mempaydate+"</td><td> "+memName+"</td><td> "+_status[memcnt]+"</td></tr>";
  }
  else {
    newRows+="<tr><td>"+mempaydate+"</td><td> "+memName+"</td><td> "+_status[memcnt]+"</td></tr>";
  }
  return newRows;
 }

 function createPropsalMemRow(_iduser, _idusers,_namemembers, _paydates, newRows) {
   var memName;

   if (_iduser != null)
   {
     memName = _namemembers;
     if (memName == null) {
       memName = "No definido"
     }

     if (_iduser == _idusers) {
       newRows+="<tr class='highlight' ><td>"+_paydates+"</td><td> "+memName+"</td></tr>";
     }
     else {
       newRows+="<tr><td>"+_paydates+"</td><td> "+memName+"</td></tr>";
     }
   }
   else {
     newRows+="<tr><td>"+_paydates+"</td><td>Disponible</td><td></td></tr>";
   }
   return newRows;
  }
