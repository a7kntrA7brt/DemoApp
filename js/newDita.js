

 var proposalId;
  var mailcontact=[];

$(document).on("pageshow","#MoneyPot",function() {
   var db;
   var msg;

   $( ".selector" ).navbar({disabled: true});
   document.getElementById("mpnext").addEventListener("click", savempData, false);
   db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
      
   function savempData() {
      var _uname;
      var mpin = false;
      var dtin = false;
      var dvalid = true;
      var moneyPot = document.getElementById("inputMPot").value;
      var strdate = document.getElementById("date-input").value;
      var nameDita = document.getElementById("inputDitaName").value;
    //  var currDita = document.getElementById("currslct").value;
      var currDita ="MXN"
      if (moneyPot % 100 == 0 && moneyPot != "" ){
         mpin = true;
       }
      if (strdate != "" ){
         dtin = true;
      }
      var today = new Date();
      var yyyy = today.getFullYear();
      var mm = today.getMonth()+1;
      var dd = today.getDate();
      if (mm < 10){mm='0'+mm}
      if (dd < 10){dd='0'+dd}

      var date = yyyy+'-'+mm+'-'+dd;

      // increase three momths 1=January - 12= December
      //Jan = 30, Feb = 28, Mar = 31, Apr=30, May = 31, Jun=30
      //Jul = 31, Aug = 31, Sep = 30, Oct=31, Nov = 30, Dec=30
      if(mm < 10){mm=today.getMonth()+4;
        if (mm < 10){mm='0'+mm}
      }
      else if(mm == '10'){ mm='01'; yyyy=yyyy+1;
        if(dd == '31'){dd='30'}
      }
      else if (mm == '11'){ mm='02'; yyyy=yyyy+1;
        if(dd == '31' ||dd == '30' ||dd == '29'){dd='28'}
      }
      else if (mm == '12'){ mm='03'; yyyy=yyyy+1;
      }
      var maxdate =  yyyy+'-'+mm+'-'+dd;
      if (strdate < date || strdate > maxdate)
      {
        dvalid = false
      }
       if (mpin == true && dtin == true && dvalid == true){
         db.transaction(function (tx) {
  //          tx.executeSql('DROP TABLE IF EXISTS NEWDITA');
  //          tx.executeSql('DROP TABLE IF EXISTS INVITED');
            tx.executeSql('CREATE TABLE IF NOT EXISTS NEWDITA (id auto_increment, id_user, created, message text, pot, frequency, charge, servicecost, start, end, status, pot_frequency, membersnum, currency, author_pot_date, membersmin, name)');
            tx.executeSql('CREATE TABLE IF NOT EXISTS INVITED (id auto_increment, id_proposal, type, id_user, id_guest, created, paydate, status, token, token_expries)');
         });

         var userID = window.localStorage.getItem("userID");
         var _uid = parseInt(userID);

         var sercost = moneyPot *.05

         db.transaction(function (tx) {
            tx.executeSql('SELECT COUNT(*) AS rowtotal FROM NEWDITA',[],function (tx, r) {
               proposalId = r.rows.item(0).rowtotal+1
            });
         });
         db.transaction(function (tx) {
            tx.executeSql('INSERT INTO NEWDITA (id, id_user, created, start, pot, currency, servicecost, name) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',[proposalId,_uid, date, strdate, moneyPot,currDita,sercost,nameDita]);
         });
        clearPayments();
         $.mobile.changePage( "#payments", { transition: "slideup", changeHash: false })
       }
       else{
         if(moneyPot == "" && strdate == ""){
            alert('Uno de los campos esta vacio')
         }
         else if ((moneyPot != "" && strdate == "")||(moneyPot == "" && strdate != "") ) {
            alert('Un campo esta vacio')
         }
         else if (dvalid == false ) {
            alert('Fecha es invalida')
         }
         else{
            alert('Cantidad debe ser divisible por 100')
         }
       }
   }
});

$(document).on("pageshow","#payments",function() {
   var moneyPot;
   var fstdate;
   var db;
   document.getElementById("paymntnext").addEventListener("click", savepayData, false);
   db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
   db.transaction(function (tx) {
      tx.executeSql('SELECT * FROM NEWDITA', [], function (tx, results) {
         for(var i = 0; i < results.rows.length; i++) {
            moneyPot= results.rows.item(i).pot;
            fstdate= results.rows.item(i).start;
          }
           createTable(moneyPot, fstdate, null, null, null, null);
       }, null);
   });

   function savepayData() {
      var _uname;
      var mpin = false;
      var dtin = false;
      var payFreq;
      if (document.getElementById("radio-choice-v-2a").checked){
        payFreq=document.getElementById("radio-choice-v-2a").value;
      }
      else if (document.getElementById("radio-choice-v-2b").checked) {
        payFreq=document.getElementById("radio-choice-v-2b").value;
      }
      else if (document.getElementById("radio-choice-v-2c").checked){
        payFreq=document.getElementById("radio-choice-v-2c").value;
      }
      var paypprd = document.getElementById("select-payAmount").value;
      var usrpayDate = document.getElementById("select-payDatesMenu").value;
  //    var chrgopt = document.getElementById("select-payOpt").value;

      if(payFreq !=null && paypprd != null && usrpayDate != null && payFreq !="" && paypprd != "" && usrpayDate != ""){
      frdcnt= Math.round( moneyPot/paypprd);
      db.transaction(function (tx) {
          tx.executeSql('UPDATE NEWDITA SET pot_frequency = ?, charge = ?, frequency = ?, membersmin = ? , author_pot_date =? WHERE id = ?',[payFreq, paypprd, payFreq,frdcnt,usrpayDate,proposalId]);
      });
      $.mobile.changePage( "#friends", { transition: "slideup", changeHash: false })
      }
      else {
        alert ("Una opcion no fue selccionada")
      }
   }
});

$(document).on('change','#radio-choice-v-2a',function(){
if (document.getElementById("radio-choice-v-2a").checked){
  payFreq=document.getElementById("radio-choice-v-2a").value;
}
else if (document.getElementById("radio-choice-v-2b").checked) {
  payFreq=document.getElementById("radio-choice-v-2b").value;
}
else if (document.getElementById("radio-choice-v-2c").checked){
  payFreq=document.getElementById("radio-choice-v-2c").value;
}
  changedPayFreq(payFreq);
});
$(document).on('change','#radio-choice-v-2b',function(){
  if (document.getElementById("radio-choice-v-2a").checked){
    payFreq=document.getElementById("radio-choice-v-2a").value;
  }
  else if (document.getElementById("radio-choice-v-2b").checked) {
    payFreq=document.getElementById("radio-choice-v-2b").value;
  }
  else if (document.getElementById("radio-choice-v-2c").checked){
    payFreq=document.getElementById("radio-choice-v-2c").value;
  }
    changedPayFreq(payFreq);
});
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
  changedPayFreq(payFreq);
});

function changedPayFreq (payFreq ){

   if (payFreq != ""){
       var _moneyPot;
       var db;
       db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
       db.transaction(function (tx) {
          tx.executeSql('SELECT * FROM NEWDITA', [], function (tx, results) {
             for(var i = 0; i < results.rows.length; i++) {
                    _moneyPot= results.rows.item(i).pot;
                    date= results.rows.item(i).start;
                  }
                  var paypprd = null;
                  var usrPayDate= null;
                  if ($('#select-payAmount').length) {
                     paypprd = document.getElementById("select-payAmount").value;
                  }
                  if ($('#select-payDatesMenu').length) {
                     usrPayDate = document.getElementById("select-payDatesMenu").value;
                  }

                  /* TODO: Future Implementation of Payment Options
                  if ($('#select-payOpt').length) {
                     chrgopt = document.getElementById("select-payOpt").value;
                  }
                  */
                  var frdcnt;
                  var dates=[];
                   //First Time this is chosen- not other options are available
                   if (paypprd == null && usrPayDate == null){
                       createTtlPayAmountlbl( payFreq);
                       createTtlPayAmount(_moneyPot, payFreq);
                       createTable(_moneyPot, date, payFreq, null, null, null);
                  }
                  /*Payment Amount selected, Date not selected, changed Pay frequency
                    Recreate Payment Amount Label
                    Recalculate Payment Dates */
                  else if (paypprd != null && usrPayDate == null){
                      //frdcnt= Math.round( _moneyPot/paypprd);
                      createTtlPayAmountlbl( payFreq);
                      createTtlPayAmount(_moneyPot, payFreq);
                    //  dates = createPaymentdates(payFreq,frdcnt,date);
                    //  createPaymentOptions(paypprd, payFreq);
                      createTable(_moneyPot, date, payFreq, null, null,null);

                 }
                 else if (paypprd != null && usrPayDate != null){
                     //frdcnt= Math.round( _moneyPot/paypprd);
                     createTtlPayAmountlbl( payFreq);
                     createTtlPayAmount(_moneyPot, payFreq);
                     dates = createPaymentdates(payFreq,frdcnt,date);
                     createPaymentDatesSelectMenu(dates);
                   //  createPaymentOptions(paypprd, payFreq);
                     createTable(_moneyPot, date, payFreq, null, null,null);
                }
                 /*Payment Amount selected, Payment Option selected, changed Pay frequency
                   Recreate Payment Amount Label
                   Recalculate Payment Dates */
              /*   else if (paypprd != null && paypprd != ""){
                     frdcnt=Math.round(_moneyPot/paypprd);
                     createTtlPayAmountlbl( payFreq);
                     createTtlPayAmount(_moneyPot, payFreq);
                     dates = createPaymentdates(payFreq,frdcnt,date);
                     //createPaymentOptions(paypprd, payFreq)
                     createTable(_moneyPot, date, payFreq, paypprd, frdcnt, dates);
                }
                */
          }, null);
      });
   }

}
$(document).on('change','#select-payAmount',function(){
  var payFreq;
  if (document.getElementById("radio-choice-v-2a").checked){
    payFreq=document.getElementById("radio-choice-v-2a").value;
  }
  else if (document.getElementById("radio-choice-v-2b").checked) {
    payFreq=document.getElementById("radio-choice-v-2b").value;
  }
  else if (document.getElementById("radio-choice-v-2c").checked){
    payFreq=document.getElementById("radio-choice-v-2c").value;
  }
   var paypprd = document.getElementById("select-payAmount").value;
   if (paypprd != ""){
       var _moneyPot;
       var db;
       var dates=[];
       db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
       db.transaction(function (tx) {
          tx.executeSql('SELECT * FROM NEWDITA', [], function (tx, results) {
             for(var i = 0; i < results.rows.length; i++) {
                    _moneyPot= results.rows.item(i).pot;
                    date= results.rows.item(i).start;
                  }
                  /*TODO: Future Implementation Payment Options
                  var chrgopt= null;
                  if ($('#select-payOpt').length) {
                     chrgopt = document.getElementById("select-payOpt").value;
                  }
                  */
                  var usrPayDate= null;//Date of when this user gets paid the Tanda
                  if ($('#select-payDatesMenu').length) {
                     usrPayDate = document.getElementById("select-payDatesMenu").value;
                  }
                   //First Time this is chosen-
                  if (usrPayDate == null){
                      frdcnt= Math.round( _moneyPot/paypprd);
                      dates = createPaymentdates(payFreq,frdcnt,date);
                      createTable(_moneyPot, date, payFreq, paypprd, frdcnt, dates);
                      createPaymentDatesSelectMenu(dates);
                 }
                 else{
                     frdcnt=Math.round(_moneyPot/paypprd);
                     dates = createPaymentdates(payFreq,frdcnt,date);
                     createTable(_moneyPot, date, payFreq, paypprd, frdcnt, dates);
                     createPaymentDatesSelectMenu(dates);
                }
          }, null);
      });
   }
});
/* TODO: Future Implementation Payment Options
$(document).on('change','#select-payOpt',function(){
  var payFreq;
  if (document.getElementById("radio-choice-v-2a").checked){
    payFreq=document.getElementById("radio-choice-v-2a").value;
  }
  else if (document.getElementById("radio-choice-v-2b").checked) {
    payFreq=document.getElementById("radio-choice-v-2b").value;
  }
  else if (document.getElementById("radio-choice-v-2c").checked){
    payFreq=document.getElementById("radio-choice-v-2c").value;
  }
   var paypprd = document.getElementById("select-payAmount").value;
   var chrgopt = document.getElementById("select-payOpt").value;
   if (chrgopt != ""){
       var _moneyPot;
       var db;
       db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
       db.transaction(function (tx) {
          tx.executeSql('SELECT * FROM NEWDITA', [], function (tx, results) {
             for(var i = 0; i < results.rows.length; i++) {
                    _moneyPot= results.rows.item(i).pot;
                    date= results.rows.item(i).start;
              }
              frdcnt= Math.round( _moneyPot/paypprd);
              createTable(_moneyPot, date, payFreq, paypprd, chrgopt, frdcnt);
          }, null);
      });
   }
});
*/
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
      frcnt = j+2;
      if(  (_payFreq == "Mensual" && frcnt > 12) || (_payFreq == "Quincenal" && frcnt > 24) || (_payFreq == "Semanal" && frcnt > 48) ){
         maxreached = true;
      }
      if ( _moneyPot % frcnt == 0 &&  maxreached == false){
        payment[idx]= Math.round((_moneyPot/(frcnt))*100)/100;
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

function createPaymentdates(_payFreq, _frdcnt, _date){
//_date = str(_date);
var yyyy;
var mm;
var dd;
var res = _date.split('-');
var newdate =[];
yyyy = res[0];
mm = res[1]-1;
dd = res[2];

newdate[0] = _date;

var d2 = new Date(yyyy,mm,dd);
var dayofWeek = d2.getDay();
var eqldatefnd;
for (var i =1; i < _frdcnt; i++ ){
eqldatefnd =0;
if (_payFreq == "Mensual" )
{
  while(eqldatefnd < 4 ) {
      d2.setDate(d2.getDate() + 1);
      if (d2.getDay() == dayofWeek) {
        eqldatefnd+=1;
      }
  }
}
else if (_payFreq == "Quincenal" )
{
  while(eqldatefnd < 2 ) {
      d2.setDate(d2.getDate() + 1);
      if (d2.getDay() == dayofWeek) {
        eqldatefnd+=1;
      }
  }
}
else if (_payFreq == "Semanal" )
{
  while(eqldatefnd < 1 ) {
      d2.setDate(d2.getDate() + 1);
      if (d2.getDay() == dayofWeek) {
        eqldatefnd+=1;
      }
  }
}
 yyyy = d2.getFullYear();
 mm = d2.getMonth()+1;
 dd = d2.getDate();
if (mm < 10){mm='0'+mm}
if (dd < 10){dd='0'+dd}

newdate[i] = yyyy+'-'+mm+'-'+dd;
}
return newdate

}
/* TODO: Future Implementation Payment Options
function createPaymentOptions(_paypprd, _payFreq) {
 if ($('#select-payOptlbl').length) {
    $('#select-payOptlbl').remove();
 }
 if ($('#select-payOpt').length) {
    $('#select-payOpt').remove();
 }
 var x;
 var payment =[];
 var minreached = false;
 var frdcnt;
 if(_payFreq == "Mensual"){
   payment[0]= Math.round((_paypprd/1)*100)/100;
   payment[1]= Math.round((_paypprd/2)*100)/100;
   payment[2]= Math.round((_paypprd/4)*100)/100;
 }
 else if (_payFreq == "Quincenal") {
   payment[0]= Math.round((_paypprd/1)*100)/100;
   payment[1]= Math.round((_paypprd/2)*100)/100;
 }
 else
 {
   payment[0]= Math.round((_paypprd/(1))*100)/100;


 // Add a new select element
$('#div-payOpt').after("<label for=\"select-payOpt\"  id=\"select-payOptlbl\" class=\"select\">Payment options:</label>");
$('<select>').attr({'name':'select-payOpt','id':'select-payOpt'}).appendTo("#select-payOptlbl");
$( "#select-payOpt" ).empty( )
$('<option>').attr({'value':"" ,'data-placeholder':'true'}).html(x).appendTo('#select-payOpt');
if (_payFreq == "Mensual") {
     $('<option>').attr({'value':payment[0]}).html(payment[0] + " MXN Mensual").appendTo('#select-payOpt');
     $('<option>').attr({'value':payment[1]}).html(payment[1] + " MXN quincenal").appendTo('#select-payOpt');
     $('<option>').attr({'value':payment[2]}).html(payment[2] + " MXN semanal").appendTo('#select-payOpt');
}
else if (_payFreq == "Quincenal") {
  $('<option>').attr({'value':payment[0]}).html(payment[0] + " MXN quincenal").appendTo('#select-payOpt');
  $('<option>').attr({'value':payment[1]}).html(payment[1] + " MXN semanal").appendTo('#select-payOpt');
}
else {
  $('<option>').attr({'value':payment[0]}).html(payment[0] + " MXN semanal").appendTo('#select-payOpt');
}
// Enhance new select element
$('#select-payOpt').selectmenu();
  //  var dropdownoption = "<label for=\"select-choice-0\" class=\"select\">Payment Amount:</label>";
};
*/

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
  /*TODO: Future Implementation Payment Options
  if ($('#select-payOptlbl').length) {
     $('#select-payOptlbl').remove();
  }

  if ($('#select-payOpt').length) {
     $('#select-payOpt').remove();
  }
  */
}
var counter = 2;
var mailcnt = 0;
$(document).on("pageshow","#friends",function() {
  var moneyPot;
  var fstdate;

  document.getElementById("newMail").addEventListener("click", addnewContact, false);
  document.getElementById("frndsnext").addEventListener("click", savefriendData, false);
  $( "#headertxt" ).append( "<p>Cantidad de minima de Invitados: "+(frdcnt-1)+"</p>" );
  function addnewContact( ) {
    var newTextBoxDiv = $(document.createElement('div'))
    .attr("id", 'TextBoxDiv' + counter);

    newTextBoxDiv.after().html('<label>Invitar Amigo:</label>' +
    '<input type="text" name="textbox' + counter +
    '" id="textbox'+counter+'" value="" >');

    newTextBoxDiv.appendTo("#TextBoxesGroup");
    $("#TextBoxDiv"+counter+" :text").textinput();
    counter++;
  }
  function savefriendData() {
    var mincnt;
    var stat = true;
    if (counter < frdcnt ) {
      stat = false
    }
    for(var k = 0; k < counter - 1 && stat == true ; k++) {
      x=k+1;
      mailcontact[k] = document.getElementById("textbox"+x+"").value;
      if (mailcontact[k] == null){
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
    //  db.transaction(function (tx) {
    //    tx.executeSql('UPDATE NEWDITA SET (pot_frequency, charge, frequency, membersmin) VALUES (?, ?, ?, ?) WHERE id=(SELECT MAX(id) from NEWDITA',[payFreq, chrgopt, payFreq,frdcnt]);
    //});
    if(stat == true) {

      //    db.transaction(function (tx) {
      //         tx.executeSql('DROP TABLE IF EXISTS GUEST');
      //        tx.executeSql('DROP TABLE IF EXISTS PROPOSAL_MEMBER');
      //        tx.executeSql('CREATE TABLE IF NOT EXISTS GUEST (id auto_increment, email, name, created, token, expires, status)');
      //        tx.executeSql('CREATE TABLE IF NOT EXISTS PROPOSAL_MEMBER (id auto_increment, id_proposal, type, id_user, id_guest, created, paydate, status, token, token_expries, charge, frequency)');
      //  });
      var today = new Date();
      var yyyy = today.getFullYear();
      var mm = today.getMonth()+1;
      var dd = today.getDate();
      if (mm < 10){mm='0'+mm}
      if (dd < 10){dd='0'+dd}

      var date = yyyy+'-'+mm+'-'+dd;

      if (  mailcontact.length > 0) {
        tmpContact = mailcontact[0];
        addFriendtodb (tmpContact, date);
      }/*for ( i=1; ....*/
      }
      else{
        alert('Campo vacio o no se ha invitado a suficientes amigos')
      }
    }
  });

  function addFriendtodb (Contact, date) {
    var db;
    var guestId = 0;
    var usrId = 0;
    var proposalMemberId = 0;
    db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);

    db.transaction(function (tx) {
      /* Get New Proposal Member ID */
      tx.executeSql('SELECT * FROM PROPOSAL_MEMBER',[],function (tx, results) {
        proposalMemberId = results.rows.length + 1;
      });
    },
    function(tx, error){
      console.log(error.message);
    },

    function(){
      console.log( 'Query Completed' )

      db.transaction(function (tx) {
        /* Search this Email in our Guest User Database*/
        tx.executeSql('SELECT * FROM GUEST WHERE email=?;', [Contact], function (tx, results) {
          if (results.rows.length != 0){
            guestId = results.rows.item(0).id;
          }
          else{
            /* Search this Email in our User Database*/
            tx.executeSql('SELECT * FROM PROFILE WHERE email=?;', [Contact], function (tx, results) {
              if (results.rows.length != 0) {
                usrId = results.rows.item(0).id;
              }
            });
          }
        });
      },
      function(tx, error){
        console.log(error.message);
      },
      function(tx){
        console.log( 'Query Completed' )
        if (guestId == 0 && usrId == 0) {
          /* If Guest in not either User or Guest*/
          db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM GUEST',[],function (tx, r) {
              guestId = r.rows.length + 1
              tx.executeSql('INSERT INTO GUEST (id, email, created, status) VALUES (?, ?, ?, ?)',[guestId, Contact, date, "Open"]);
            });
          },
          function(tx, error){
            console.log(error.message);
          },
          function(){
            console.log( 'Query Completed' )
            mailcnt++;
            db.transaction(function (tx) {
            tx.executeSql('INSERT INTO PROPOSAL_MEMBER (id, id_proposal, type, id_guest, created, status) VALUES (?, ?, ?, ?, ?, ?)',[proposalMemberId, proposalId, "Mail", guestId, date, "Open"]);
            });
            if (mailcnt == mailcontact.length)
            {
              $.mobile.changePage( "#finish", { transition: "slideup", changeHash: false })
            }
            else {
              addFriendtodb (mailcontact[mailcnt], date);
            }
          }
        );
      }
      else {
        db.transaction(function (tx) {
          if (usrId != 0) {
            tx.executeSql('INSERT INTO PROPOSAL_MEMBER (id, id_proposal, type, id_user, created, status) VALUES (?, ?, ?, ?, ?, ?)',[proposalMemberId, proposalId, "Mail", usrId, date, "Open"]);
          }
          else {
            tx.executeSql('INSERT INTO PROPOSAL_MEMBER (id, id_proposal, type, id_guest, created, status) VALUES (?, ?, ?, ?, ?, ?)',[proposalMemberId, proposalId, "Mail", guestId, date, "Open"]);
          }
        },
        function(tx, error){
          console.log(error.message);
        },
        function(tx){
          console.log( 'Query Completed' )
          mailcnt++;
          if (mailcnt == mailcontact.length)
          {
            $.mobile.changePage( "#finish", { transition: "slideup", changeHash: false })
          }
          else {
            addFriendtodb (mailcontact[mailcnt],date);
          }
        }
      );
    }/*else*/
  }

);
}
);

}

$(document).on("pageshow","#finish",function() {
   var moneyPot;
   var fstdate;
   var db;
   var pot_frequency;
   var charge;
   var frequency;
//   var mailcontact=[];
   var stat = true;
   var membersmin;
//   for(var k = 0; k < (counter-1) && stat == true ; k++) {

//       m=k+1
//       mailcontact[k] = document.getElementById("textbox"+m+"").value;
  //     if (mailcontact[k] == null){
  //       stat=false;
//       }


   db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
   db.transaction(function (tx) {
      tx.executeSql('SELECT * FROM NEWDITA', [], function (tx, results) {
         for(var i = 0; i < results.rows.length; i++) {
            moneyPot= results.rows.item(i).pot;
            fstdate= results.rows.item(i).start;
            pot_frequency = results.rows.item(i).pot_frequency;
            charge = results.rows.item(i).charge;
            frequency = results.rows.item(i).frequency;
            membersmin = results.rows.item(i).membersmin;
          }
           createSummary(moneyPot, fstdate, pot_frequency, charge, membersmin, mailcontact);
       }, null);
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
  /*TODO: Future Implementation Payment Options
  if(_payopt != null ){
    newRows+="<tr><th>Opcion de pagos:</th><td> "+_payopt+" MXN</td>";
  }
  */
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

$( "#fnshcrt" ).click( function() {

  if (document.getElementById("checkbox-agree").checked)
  {
    window.location.href="main.html";
    window.location.href.reload(true);
  }
  else
  {alert("Necesita aceptar los terminos y condiciones")}
});


});
