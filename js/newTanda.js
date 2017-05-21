
var proposalId;
var mailcontact=[];
var tkcontact=[];
var moneyPot;
var strdate;
var nameTanda;
var currncy ="mxn";
var sercost;
var guestcreationdate;
var usrPayDate= null;//Date of when this user gets paid the Tanda
var paypprd = null;
var frdcnt;
var payFreq;
var guestAddedDB =0;

 $(document).on("pageinit","#MoneyPot",function() {
 $('#mpwarningPlaceHolder').hide();
 $( ".selector" ).navbar({disabled: true});
 });

 $(document).on("pageinit","#payments",function() {
 $('#paywarningPlaceHolder').hide();
 });

 $(document).on("pageinit","#friends",function() {
 $('#frndwarningPlaceHolder').hide();
 });

 $(document).on("pageinit","#finish",function() {
 $('#finshdwarningPlaceHolder').hide();
 });

$(document).on("pageshow","#MoneyPot",function() {

   /*Evaluate Inputs of Money Pot page prior moving foward*/   
   $("#mpnext").click(function() {
      var _uname;
      var mpin = false;
      var dtin = false;
      var dvalid = true;

      moneyPot = document.getElementById("inputMPot").value;
      strdate = document.getElementById("date-input").value;
      nameTanda = document.getElementById("inputDitaName").value;

      if (moneyPot % 100 == 0 && moneyPot != "" && moneyPot >= 500 && moneyPot <= 10000) {
         mpin = true;
       }
      if (strdate != "" ) {
         dtin = true;
      }

      var today = new Date();
      var yyyy = today.getFullYear();
      var mm = today.getMonth()+1;
      var dd = today.getDate();
      if (mm < 10){mm ='0'+ mm}
      if (dd < 10){dd ='0'+ dd}
      var date = yyyy+'-'+mm+'-'+dd;
      // increase three momths 1=January - 12= December
      //Jan = 30, Feb = 28, Mar = 31, Apr=30, May = 31, Jun=30
      //Jul = 31, Aug = 31, Sep = 30, Oct=31, Nov = 30, Dec=30

      if(mm < 10){ mm = today.getMonth() + 4;
        if (mm < 10){mm ='0'+mm}
      }
      else if(mm == '10'){ mm ='01'; yyyy= yyyy + 1;
        if(dd == '31'){dd ='30'}
      }
      else if (mm == '11'){ mm ='02'; yyyy= yyyy + 1;
        if(dd == '31' ||dd == '30' ||dd == '29'){dd ='28'}
      }
      else if (mm == '12'){ mm ='03'; yyyy= yyyy + 1;
      }
      var maxdate =  yyyy+'-'+mm+'-'+dd;
      if (strdate < date || strdate > maxdate)
      {
        dvalid = false
      }
      if (mpin == true && dtin == true && dvalid == true) {
         sercost = moneyPot *.05
         clearPayments();
         $.mobile.changePage( "#payments", { transition: "slideup", changeHash: false })
       }
       else {
         if(moneyPot == "" && strdate == ""){
            $( "#mpwarningPlaceHolder" ).empty();
            $( "#mpwarningPlaceHolder" ).append( "<a href='#' class='ui-btn ui-btn-icon-right ui-icon-alert ui-state-disabled' data-inline='true' data-mini='true'>Uno de los campos esta vacio</a>" );
            $('#mpwarningPlaceHolder').show();
         }
         else if ((moneyPot != "" && strdate == "")||(moneyPot == "" && strdate != "") ) {
            $( "#mpwarningPlaceHolder" ).empty();
            $( "#mpwarningPlaceHolder" ).append( "<a href='#' class='ui-btn ui-btn-icon-right ui-icon-alert ui-state-disabled' data-inline='true' data-mini='true'>Un campo esta vacio</a>" );
            $('#mpwarningPlaceHolder').show();
         }
         else if (dvalid == false ) {
            $( "#mpwarningPlaceHolder" ).empty();
            $( "#mpwarningPlaceHolder" ).append( "<a href='#' class='ui-btn ui-btn-icon-right ui-icon-alert ui-state-disabled' data-inline='true' data-mini='true'>Fecha es invalida</a>" );
            $('#mpwarningPlaceHolder').show();
         }
         else{
            $( "#mpwarningPlaceHolder" ).empty();
            $( "#mpwarningPlaceHolder" ).append( "<a href='#' class='ui-btn ui-btn-icon-right ui-icon-alert ui-state-disabled' data-inline='true' data-mini='true'>Cantidad debe ser divisible por 100</a>" );
            $('#mpwarningPlaceHolder').show();
         }
       }
   });
});


$(document).on("pageshow","#payments",function() {

  createTable(moneyPot, strdate, null, null, null, null);

   /*Evaluate Inputs of Payments page prior moving foward*/   
  $("#paymntnext").click(function() {
      var _uname;
      var mpin = false;
      var dtin = false;

      if (document.getElementById("radio-choice-v-2a").checked){
        payFreq=document.getElementById("radio-choice-v-2a").value;
      }
      else if (document.getElementById("radio-choice-v-2b").checked) {
        payFreq=document.getElementById("radio-choice-v-2b").value;
      }
      else if (document.getElementById("radio-choice-v-2c").checked){
        payFreq=document.getElementById("radio-choice-v-2c").value;
      }
       paypprd = document.getElementById("select-payAmount").value;
       usrPayDate = document.getElementById("select-payDatesMenu").value;

      if(payFreq !=null && paypprd != null && usrPayDate != null && payFreq !="" && paypprd != "" && usrPayDate != ""){
      frdcnt= Math.round( moneyPot/paypprd);
      $.mobile.changePage( "#friends", { transition: "slideup", changeHash: false })
      }
      else {
        $( "#paywarningPlaceHolder" ).empty();
        $( "#paywarningPlaceHolder" ).append( "<a href='#' class='ui-btn ui-btn-icon-right ui-icon-alert ui-state-disabled' data-inline='true' data-mini='true'>Una opcion no fue selccionada</a>" );
        $('#paywarningPlaceHolder').show();
      }
   });
});

 /*Detect change in Payment Frequency Option*/   
$(document).on('change','#radio-choice-v-2a',function() {
  if (document.getElementById("radio-choice-v-2a").checked) {
    payFreq= document.getElementById("radio-choice-v-2a").value;
  }
  else if (document.getElementById("radio-choice-v-2b").checked) {
    payFreq= document.getElementById("radio-choice-v-2b").value;
  }
  else if (document.getElementById("radio-choice-v-2c").checked) {
    payFreq= document.getElementById("radio-choice-v-2c").value;
  }
  changedPayFreq(payFreq);
});
/*Detect change in Payment Frequency Option*/  
$(document).on('change','#radio-choice-v-2b',function() {
  if (document.getElementById("radio-choice-v-2a").checked) {
    payFreq= document.getElementById("radio-choice-v-2a").value;
  }
  else if (document.getElementById("radio-choice-v-2b").checked) {
    payFreq= document.getElementById("radio-choice-v-2b").value;
  }
  else if (document.getElementById("radio-choice-v-2c").checked) {
    payFreq= document.getElementById("radio-choice-v-2c").value;
  }
    changedPayFreq();
});
/*Detect change in Payment Frequency Option*/  
$(document).on('change','#radio-choice-v-2c',function(){
  if (document.getElementById("radio-choice-v-2a").checked){
    payFreq=document.getElementById("radio-choice-v-2a").value;
  }
  else if (document.getElementById("radio-choice-v-2b").checked) {
    payFreq=document.getElementById("radio-choice-v-2b").value;
  }
  else if (document.getElementById("radio-choice-v-2c").checked){
    payFreq=document.getElementById("radio-choice-v-2c").value;
  }
  changedPayFreq();
});

function changedPayFreq () {

   if (payFreq != "") {
      if ($('#select-payAmount').length) {
         paypprd = document.getElementById("select-payAmount").value;
       }
      if ($('#select-payDatesMenu').length) {
          usrPayDate = document.getElementById("select-payDatesMenu").value;
       }
       var dates=[];
       //First Time this is chosen- not other options are available
       if (paypprd == null && usrPayDate == null) {
           createTtlPayAmountlbl( payFreq);
           createTtlPayAmount(moneyPot, payFreq);
           createTable(moneyPot, strdate, payFreq, null, null, null);
        }
        /*Payment Amount selected, Date not selected, changed Pay frequency
          Recreate Payment Amount Label
          Recalculate Payment Dates */
         else if (paypprd != null && usrPayDate == null) {
             //frdcnt= Math.round( moneyPot/paypprd);
              createTtlPayAmountlbl( payFreq);
              createTtlPayAmount(moneyPot, payFreq);
              //  dates = createPaymentdates(payFreq,frdcnt,date);
              //  createPaymentOptions(paypprd, payFreq);
               createTable(moneyPot, strdate, payFreq, null, null,null);
           }
           else if (paypprd != null && usrPayDate != null) {
               //frdcnt= Math.round( moneyPot/paypprd);
               createTtlPayAmountlbl( payFreq);
               createTtlPayAmount(moneyPot, payFreq);
               dates = createPaymentdates(payFreq,frdcnt,strdate);
               createPaymentDatesSelectMenu(dates);
             //  createPaymentOptions(paypprd, payFreq);
               createTable(moneyPot, strdate, payFreq, null, null,null);
          }
   }

}

$(document).on('change','#select-payAmount',function() {

  if (document.getElementById("radio-choice-v-2a").checked) {
    payFreq=document.getElementById("radio-choice-v-2a").value;
  }
  else if (document.getElementById("radio-choice-v-2b").checked) {
    payFreq=document.getElementById("radio-choice-v-2b").value;
  }
  else if (document.getElementById("radio-choice-v-2c").checked) {
    payFreq=document.getElementById("radio-choice-v-2c").value;
  }
    paypprd = document.getElementById("select-payAmount").value;
   if (paypprd != "") {
       var dates=[];

           if ($('#select-payDatesMenu').length) {
               usrPayDate = document.getElementById("select-payDatesMenu").value;
            }
             //First Time this is chosen-
            if (usrPayDate == null) {
                frdcnt= Math.round( moneyPot/paypprd);
                dates = createPaymentdates(payFreq,frdcnt,strdate);
                createTable(moneyPot, strdate, payFreq, paypprd, frdcnt, dates);
                createPaymentDatesSelectMenu(dates);
           }
           else {
               frdcnt=Math.round(moneyPot/paypprd);
               dates = createPaymentdates(payFreq,frdcnt,strdate);
               createTable(moneyPot, strdate, payFreq, paypprd, frdcnt, dates);
               createPaymentDatesSelectMenu(dates);
          }
   }
});

function createTable(_mP, _date, _payFreq, _chrg, _frnds, _dates) {
  var tbhead= "<thead</thead><tbody>";
  var tbfoot ="</tbody>";
  var newRows;
  if(_mP != null){
    newRows+="<tr><th>Tanda:</th><td> "+_mP+" MXN</td>";
  }
  if(_date != null ){
    newRows+="<tr><th>Fecha de primer pago:</th><td> "+_date+"</td>";
  }
  if(_payFreq != null &&  _chrg != null){
    newRows+="<tr><th>Cobro "+_payFreq+":</th><td> "+_chrg+" MXN</td>";
  }
  if(_frnds != null ){
    newRows+="<tr><th>Minimo de participantes:</th><td> "+_frnds+"</td>";
  }
  if(_frnds != null && _payFreq != null && _dates != null){
    newRows+="<tr><th>Fecha del ultimo pago:</th><td> "+_dates[_frnds-1]+"</td>";
  }

  $( "#mytable" ).empty( )
  var htmltable=tbhead+newRows+tbfoot;
  $( "table#mytable" ).append( htmltable )
};

// Creating the Payment Amount Options label
function createTtlPayAmountlbl( _payFreq) {
    if ($('.label').length) {
      $('.label').remove();
    }
       $('#div-payAmount').after("<p id=\"select-payAmountlbl\" class =\"label\">Cuanto puedes pagar "+ _payFreq+":</p>");
  }
// Creating the Payment Amount Options per Pay Period Selected
function createTtlPayAmount(_moneyPot, _payFreq) {
    if ($('#select-payAmount').length) {
       $('#select-payAmount').remove();
    }
    var x;
    var idx = 0;
    var payment =[];
    var minreached = false;
    var maxreached = false;
// The minimum Amount of money is 100. the Amount should not have decimals
// Pay frequency will be taken into account, cannot overpass a years time
    for(var j = 0; j < 50 && minreached ==false && maxreached ==false; j++) {
      frdcnt = j+2;
      if(  (_payFreq == "Mensual" && frdcnt > 12) || (_payFreq == "Quincenal" && frdcnt > 24) || (_payFreq == "Semanal" && frdcnt > 48) ){
         maxreached = true;
      }
      if ( _moneyPot % frdcnt == 0 &&  maxreached == false){
        payment[idx]= Math.round((_moneyPot/(frdcnt))*100)/100;
        if (payment[idx] < 100 ){
            minreached = true;
         }
         idx=idx+1;
      }
    }
   $('<select>').attr({'name':'select-payAmount','id':'select-payAmount'}).insertAfter(".label");
   $( "#select-payAmount" ).empty( )
   $('<option>').attr({'value':"" ,'data-placeholder':'true'}).html("Select one").appendTo('#select-payAmount');
   for(var k = 0; k < payment.length; k++) {
      x = payment[k];
      $('<option>').attr({'value':x}).html(x).appendTo('#select-payAmount');
   }
   $('</option>').appendTo('#select-payAmount');
   // Enhance new select element
   $('#select-payAmount').selectmenu();
};


function createPaymentDatesSelectMenu(_dates) {
/*Clearing Data if already exist*/
 if ($('#select-payDatesMenulbl').length) {
    $('#select-payDatesMenulbl').remove();
 }
 if ($('#select-payDatesMenu').length) {
    $('#select-payDatesMenu').remove();
 }
 var x;
 var payment =[];
 var minreached = false;
 var frdcnt;

 /* Adding a new select element */
$('#div-payDatesMenu').after("<label for=\"select-payDatesMenu\"  id=\"select-payDatesMenulbl\" class=\"select\">Recibo Tanda el:</label>");
$('<select>').attr({'name':'select-payDatesMenu','id':'select-payDatesMenu'}).appendTo("#select-payDatesMenulbl");
$( "#select-payDatesMenu" ).empty( )
$('<option>').attr({'value':"" ,'data-placeholder':'true'}).html(x).appendTo('#select-payDatesMenu');
for (var i=0; i < _dates.length; i++){
     $('<option>').attr({'value':_dates[i]}).html(_dates[i]).appendTo('#select-payDatesMenu');
}
// Enhance new select element
$('#select-payDatesMenu').selectmenu();
  //  var dropdownoption = "<label for=\"select-choice-0\" class=\"select\">Payment Amount:</label>";
};

function clearPayments( ) {
  if ($('#select-payAmount').length) {
     $('#select-payAmount').remove();
  }
  if ($('.label').length) {
    $('.label').remove();
  }
  if ($('#select-payDatesMenu').length) {
     $('#select-payDatesMenu').remove();
  }
}

var counter = 2;
var tkfrndcnt = 0;
var mailcnt = 0;
$(document).on("pageshow","#friends",function() {

  var usrPass = window.localStorage.getItem("usrPass");
  var usrEmail = window.localStorage.getItem("usrEmail");

  $( "#headertxt" ).append( "<p>Cantidad de minima de Invitados: "+(frdcnt-1)+"</p>" );

  $.ajax({
    type: "GET",
    url: "http://tandaklub.com/get/friends?e="+usrEmail+"&p="+usrPass+"",
    crossDomain: true,
    cache: false,
    dataType: 'json',
    success: function(result) {
      if (result.st == 0) {
        /*TODO:Currently only one error type, add more warnings when available*/
        if(result.err[0] == "NotFound") {
         /*TODO: Determine proper action*/
        }
      }
      else {
        tkfrndcnt = result.list.length;
        if (result.list.length != 0) {
          var content ="";
          for(var i = 0; i < result.list.length; i++) {
            tname = result.list[i].name;
              var newRows= "<input type='checkbox' name='checkbox"+i+"' id='checkbox"+i+"' class='custom'>"+
              "<label for='checkbox"+i+"'>"+tname+"</label>";
          }/*for(var i = 0...*/
            content+= "<div data-role='collapsible' data-collapsed='true'><h4>Amigos de TandaKlub</h4>"+newRows+"</div>";
            $( "#TKFriendList" ).append( content ).collapsibleset( "refresh" );
          }/* if (result.list.length != 0)*/
          else {
            $( "#TKFriendList" ).append( "<p>No se encontraron amigos</p>" ).collapsibleset( "refresh" );
          }
        }
      } /*  success: function(result..*/
      });


  $("#newMail").click(function() {
    var newTextBoxDiv = $(document.createElement('div'))
    .attr("id", 'TextBoxDiv' + counter);

    newTextBoxDiv.after().html('<label>Invitar Amigo:</label>' +
    '<input type="text" name="textbox'+counter+
    '" id="textbox'+counter+'" data-clear-btn="true" value="" >');

    newTextBoxDiv.appendTo("#TextBoxesGroup");
    $("#TextBoxDiv"+counter+" :text").textinput();
    counter++;
  });


  $("#frndsnext").click(function() {
    var mincnt;
    var stat = true;
    var usrEmail = window.localStorage.getItem("usrEmail");

    for (j=0; j < tkfrndcnt; j++) {
      if (document.getElementById("textbox"+j+"").checked) {
         tkcontact[j]=document.getElementById("textbox"+j+"").value;
       }
    }
    if (counter < frdcnt ) {
      stat = false
    }
    mailcontact[0] = usrEmail;
    for(var k = 1; k < (counter) && stat == true ; k++) {
      x=k;
      mailcontact[k] = document.getElementById("textbox"+x+"").value;
      if (mailcontact[k] == null) {
        stat=false;
      }
      else {
        /* Check that a user is not repeated*/
        for(var j = 1; j < counter && stat == true ; j++) {
          if (j != k){
            tmpContact = mailcontact[j];
            if (mailcontact[k] == tmpContact){
              stat=false;
            }
          }
        }/*for var j = 1 ...*/
      }
    } /*for var k = 1 ...*/

    if(stat == true) {
      var today = new Date();
      var yyyy = today.getFullYear();
      var mm = today.getMonth()+1;
      var dd = today.getDate();
      var hh = today.getHours();
      var min = today.getMinutes();
      var ss = today.getSeconds();
      if (mm < 10){mm='0'+mm}
      if (dd < 10){dd='0'+dd}

       guestcreationdate = yyyy+'-'+mm+'-'+dd+" "+hh+":"+min+":"+ss+"";

      if (  mailcontact.length > 0) {
          $.mobile.changePage( "#finish", { transition: "slideup", changeHash: false });
      }
      }
      else{
        alert('Campo vacio o no se ha invitado a suficientes amigos')
      }
    });
});

$(document).on("pageshow","#finish",function() {

   var stat = true;
   var membersmin;

   createSummary(moneyPot, strdate, payFreq, paypprd, frdcnt, mailcontact);

$( "#fnshcrt" ).click( function() {

 var userID = window.localStorage.getItem("usrId");
 var usrEmail = window.localStorage.getItem("usrEmail");
 var usrPass = window.localStorage.getItem("usrPass");

  if (document.getElementById("checkbox-agree").checked)
  {

     var dataString ="e="+usrEmail+"&p="+usrPass+"&idu="+userID+"&name="+
     nameTanda+"&created="+guestcreationdate+"&message=hola&currency=mxn&pot="+
     moneyPot+"&charge="+paypprd+"&start="+strdate+
     "&potfrequency="+1+"&authorpdate="+usrPayDate+"&mnum="+counter+"&mmin="+frdcnt+"";

    $.ajax({
     type: "POST",
     url:"http://tandaklub.com/set/addproposal?"+dataString+"",
     data: dataString,
     crossDomain: true,
     cache: false,
     success: function(data) {


       if (data.st == 1)
       {
       for(j=0 ; j< mailcontact.length; j++) {

         var dataString2 ="e="+usrEmail+"&p="+usrPass+"&id="+data.val+"&email="+ mailcontact[j]+"";
           $.ajax({
            type: "POST",
            url:"http://tandaklub.com/set/addguest?"+dataString2+"",
            data: dataString,
            crossDomain: true,
            cache: false,
            success: function(data) {
              guestAddedDB++;
              if (guestAddedDB ==  mailcontact.length) {
                $.mobile.loading( "hide" );
              window.location.href="main.html";
              window.location.href.reload(true);
             }

            }
            });
       }
     }
     else{
       alert("Not inserted" +data.err+"");
     }
     }
     });
  }
  else {
    alert("Necesita aceptar los terminos y condiciones")
  }
});
});

function createSummary(_mP, _date, _payFreq, _chrg, _frnds, _mailcontact ) {
  var tbhead= "<thead</thead><tbody>";
  var tbfoot ="</tbody>";
  var newRows="";
  var newfriendlist ="";
  if(_mP != null){
    newRows+="<tr><th>Tanda:</th><td> "+_mP+" MXN</td>";
  }
  if(_date != null ){
    newRows+="<tr><th>Fecha de primer cobro:</th><td> "+_date+"</td>";
  }
  if(_payFreq != null &&  _chrg != null){
    newRows+="<tr><th>"+_payFreq+" Pago:</th><td> "+_chrg+" MXN</td>";
  }
  if(_frnds != null ){
    newRows+="<tr><th>Participantes necesarios:</th><td> "+_frnds+"</td>";
  }
  for(var l = 0; l < _mailcontact.length ; l++) {
        newfriendlist+="<li>"+_mailcontact[l]+"</li>";
      }
  $( "#summaryTable" ).empty( )
  var htmltable=tbhead+newRows+tbfoot;
  $( "table#summaryTable" ).append( htmltable );
  $( "#friendList" ).empty( );
  $( "#friendList" ).append( newfriendlist );
  $('#friendList').listview('refresh');
}
