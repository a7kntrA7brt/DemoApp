
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
      var moneyPot = document.getElementById("inputMPot").value;
      var strdate = document.getElementById("date-input").value;
      var nameDita = document.getElementById("inputDitaName").value;
      var currDita = document.getElementById("currslct").value;
      if (moneyPot % 100 == 0 && moneyPot != "" ){
         mpin = true;
       }
      if (strdate != "" ){
         dtin = true;
      }
       if (mpin == true && dtin == true){
         db.transaction(function (tx) {
            tx.executeSql('DROP TABLE IF EXISTS NEWDITA');
            tx.executeSql('DROP TABLE IF EXISTS INVITED');
            tx.executeSql('CREATE TABLE IF NOT EXISTS NEWDITA (id auto_increment, id_user, created, message text, pot, frequency, charge, servicecost, start, end, status, pot_frequency, membersnum, currency, author_pot_date, membersmin, name)');
            tx.executeSql('CREATE TABLE IF NOT EXISTS INVITED (id auto_increment, id_proposal, type, id_user, id_guest, created, paydate, status, token, token_expries)');
         });

         db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM PROFILE', [], function (tx, results) {
               for(var i = 0; i < results.rows.length; i++) {
                    _uid = results.rows.item(i).id;
                }
             }, null);
         });
         var today = new Date();
         var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
         var sercost = moneyPot *.5
         var id=1;
         db.transaction(function (tx) {
            tx.executeSql('INSERT INTO NEWDITA (id, id_user, created, start, pot, currency, servicecost) VALUES (?, ?, ?, ?, ?, ?, ?)',[id,_uid, date, strdate, moneyPot,currDita,sercost]);
         });
        clearPayments();
         $.mobile.changePage( "#payments", { transition: "slideup", changeHash: false })
       }
       else{
         if(moneyPot == "" && strdate == ""){
            alert('More than one fields are not filled')
         }
         else if ((moneyPot != "" && strdate == "")||(moneyPot == "" && strdate != "") ) {
            alert('One field is not filled')
         }
         else{
            alert('Money pot needs to be divisible by 10')
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
      var payFreq = document.getElementById("payFreqslct").value;
      var paypprd = document.getElementById("select-payAmount").value;
      var chrgopt = document.getElementById("select-payOpt").value;

      frdcnt= Math.round( moneyPot/paypprd);

      db.transaction(function (tx) {
          tx.executeSql('UPDATE NEWDITA SET pot_frequency = ?, charge = ?, frequency = ?, membersmin = ? WHERE id = ?',[payFreq, chrgopt, payFreq,frdcnt,1]);
      });
      $.mobile.changePage( "#friends", { transition: "slideup", changeHash: false })
   }
});





$(document).on('change','#payFreqslct',function(){
   var payFreq = document.getElementById("payFreqslct").value;
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
                  var chrgopt= null;
                  if ($('#select-payAmount').length) {
                     paypprd = document.getElementById("select-payAmount").value;
                  }
                  if ($('#select-payOpt').length) {
                     chrgopt = document.getElementById("select-payOpt").value;
                  }
                  var frdcnt;
                   //First Time this is chosen- not other options are available
                   if (paypprd == null && chrgopt == null){
                       createTtlPayAmountlbl( payFreq);
                       createTtlPayAmount(_moneyPot);
                       createTable(_moneyPot, date, payFreq, null, null, null);
                  }
                  //Payment Amount selected, Payment Option not selected, changed Pay frequency
                  // Recreate Payment Amount Label
                  // Recalculate Payment Options
                  else if (paypprd != null && chrgopt == null){
                      frdcnt= Math.round( _moneyPot/paypprd);
                      createTtlPayAmountlbl( payFreq);
                      createPaymentOptions(paypprd, payFreq);
                      createTable(_moneyPot, date, payFreq, paypprd, null, frdcnt);
                 }
                 //Payment Amount selected, Payment Option selected, changed Pay frequency
                 // Recreate Payment Amount Label
                 // Recreate Payment Options
                 else if (paypprd != null && chrgopt != null){
                     frdcnt=Math.round(_moneyPot/paypprd);
                     createTtlPayAmountlbl( payFreq);
                     //createTtlPayAmount(_moneyPot);
                     createPaymentOptions(paypprd, payFreq)
                     createTable(_moneyPot, date, payFreq, paypprd, null, frdcnt);
                }
          }, null);
      });
   }

});
$(document).on('change','#select-payAmount',function(){
   var payFreq = document.getElementById("payFreqslct").value;
   var paypprd = document.getElementById("select-payAmount").value;
   if (paypprd != ""){
       var _moneyPot;
       var db;
       db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
       db.transaction(function (tx) {
          tx.executeSql('SELECT * FROM NEWDITA', [], function (tx, results) {
             for(var i = 0; i < results.rows.length; i++) {
                    _moneyPot= results.rows.item(i).pot;
                    date= results.rows.item(i).start;
                  }
                  var chrgopt= null;
                  if ($('#select-payOpt').length) {
                     chrgopt = document.getElementById("select-payOpt").value;
                  }
                   //First Time this is chosen-
                  if (chrgopt == null){
                      frdcnt= Math.round( _moneyPot/paypprd);
                      createTable(_moneyPot, date, payFreq, paypprd, null, frdcnt);
                      createPaymentOptions(paypprd, payFreq);
                 }
                 else if (chrgopt != null){
                     frdcnt=Math.round(_moneyPot/paypprd);
                     createPaymentOptions(paypprd, payFreq);
                     createTable(_moneyPot, date, payFreq, paypprd, null, frdcnt);
                }
          }, null);
      });
   }
});

$(document).on('change','#select-payOpt',function(){
   var payFreq = document.getElementById("payFreqslct").value;
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

function createTable(_mP, _date, _payFreq, _chrg, _payopt, _frnds) {
  var tbhead= "<thead</thead><tbody>";
  var tbfoot ="</tbody>";
  var newRows;
  if(_mP != null){
    newRows+="<tr><th>Money Pot:</th><td> "+_mP+" MXN</td>";
  }
  if(_date != null ){
    newRows+="<tr><th>First Pay Date:</th><td> "+_date+"</td>";
  }
  if(_payFreq != null &&  _chrg != null){
    newRows+="<tr><th>"+_payFreq+" Pay:</th><td> "+_chrg+" MXN</td>";
  }
  if(_payopt != null ){
    newRows+="<tr><th>Payment Option:</th><td> "+_payopt+" MXN</td>";
  }
  if(_frnds != null ){
    newRows+="<tr><th>Friends Needed:</th><td> "+_frnds+"</td>";
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
       $('#div-payAmount').after("<p id=\"select-payAmountlbl\" class =\"label\">How much can you pay "+ _payFreq+":</p>");
  }
// Creating the Payment Amount Options per Pay Period Selected
function createTtlPayAmount(_moneyPot) {
    if ($('#select-payAmount').length) {
       $('#select-payAmount').remove();
    }
    var x;
    var idx = 0;
    var payment =[];
    var minreached = false;
// The minimum Amount of money is 100. the Amount should not have decimals
    for(var j = 0; j < 20 && minreached ==false; j++) {
      frcnt = j+2;
      if ( _moneyPot % frcnt == 0){
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
 if(_payFreq == "Monthly"){
   payment[0]= Math.round((_paypprd/1)*100)/100;
   payment[1]= Math.round((_paypprd/2)*100)/100;
   payment[2]= Math.round((_paypprd/4)*100)/100;
 }
 else if (_payFreq == "BiWeekly") {
   payment[0]= Math.round((_paypprd/1)*100)/100;
   payment[1]= Math.round((_paypprd/2)*100)/100;
 }
 else
 {
   payment[0]= Math.round((_paypprd/(1))*100)/100;
 }
 // Add a new select element
$('#div-payOpt').after("<label for=\"select-payOpt\"  id=\"select-payOptlbl\" class=\"select\">Payment options:</label>");
$('<select>').attr({'name':'select-payOpt','id':'select-payOpt'}).appendTo("#select-payOptlbl");
$( "#select-payOpt" ).empty( )
$('<option>').attr({'value':"" ,'data-placeholder':'true'}).html(x).appendTo('#select-payOpt');
if (_payFreq == "Monthly") {
     $('<option>').attr({'value':payment[0]}).html(payment[0] + " MXN Monthly").appendTo('#select-payOpt');
     $('<option>').attr({'value':payment[1]}).html(payment[1] + " MXN BiWeekly").appendTo('#select-payOpt');
     $('<option>').attr({'value':payment[2]}).html(payment[2] + " MXN Weekly").appendTo('#select-payOpt');
}
else if (_payFreq == "BiWeekly") {
  $('<option>').attr({'value':payment[0]}).html(payment[0] + " MXN BiWeekly").appendTo('#select-payOpt');
  $('<option>').attr({'value':payment[1]}).html(payment[1] + " MXN Weekly").appendTo('#select-payOpt');
}
else {
  $('<option>').attr({'value':payment[0]}).html(payment[0] + " MXN Weekly").appendTo('#select-payOpt');
}
// Enhance new select element
$('#select-payOpt').selectmenu();
  //  var dropdownoption = "<label for=\"select-choice-0\" class=\"select\">Payment Amount:</label>";
};

function clearPayments( ) {
  if ($('#select-payAmount').length) {
     $('#select-payAmount').remove();
  }
  if ($('.label').length) {
    $('.label').remove();
  }
  if ($('#select-payOptlbl').length) {
     $('#select-payOptlbl').remove();
  }
  if ($('#select-payOpt').length) {
     $('#select-payOpt').remove();
  }
}
var counter = 2;
$(document).on("pageshow","#friends",function() {
  var moneyPot;
  var fstdate;

  document.getElementById("newMail").addEventListener("click", addnewContact, false);
  document.getElementById("frndsnext").addEventListener("click", savefriendData, false);

  function addnewContact( ) {
    var newTextBoxDiv = $(document.createElement('div'))
  	     .attr("id", 'TextBoxDiv' + counter);

  	newTextBoxDiv.after().html('<label>Invite friend:</label>' +
  	      '<input type="text" name="textbox' + counter +
  	      '" id="textbox'+counter+'" value="" >');

  	newTextBoxDiv.appendTo("#TextBoxesGroup");
    $("#TextBoxDiv"+counter+" :text").textinput();
     counter++;
}
   function savefriendData(){

  var mailcontact=[];
  var mincnt;
  var stat = true;
  if (counter < frdcnt ){
    stat = false
    }
     for(var k = 2; k < counter && stat == true ; k++) {
         mailcontact[k] = document.getElementById("textbox"+k+"").value;
         if (mailcontact[k] == null){
           stat=false;
         }
     }
//  db.transaction(function (tx) {
  //    tx.executeSql('UPDATE NEWDITA SET (pot_frequency, charge, frequency, membersmin) VALUES (?, ?, ?, ?) WHERE id=(SELECT MAX(id) from NEWDITA',[payFreq, chrgopt, payFreq,frdcnt]);
  //});
  if(stat == true){
  $.mobile.changePage( "#finish", { transition: "slideup", changeHash: false })
   }
   else{
     alert('empty or min not reached')
   }
}
});

$(document).on("pageshow","#finish",function() {
   var moneyPot;
   var fstdate;
   var db;
   var pot_frequency;
   var charge;
   var frequency;
   var mailcontact=[];
   var stat = true;
   var membersmin;
   for(var k = 0; k < counter && stat == true ; k++) {
       m=k+2
       mailcontact[k] = document.getElementById("textbox"+k+"").value;
       if (mailcontact[k] == null){
         stat=false;
       }
   }

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
           createSummary(moneyPot, fstdate, pot_frequency, charge, frequency, membersmin, mailcontact);
       }, null);
   });
function createSummary(_mP, _date, _payFreq, _chrg, _payopt, _frnds, _mailcontact ) {
  var tbhead= "<thead</thead><tbody>";
  var tbfoot ="</tbody>";
  var newRows;
  if(_mP != null){
    newRows+="<tr><th>Money Pot:</th><td> "+_mP+" MXN</td>";
  }
  if(_date != null ){
    newRows+="<tr><th>First Pay Date:</th><td> "+_date+"</td>";
  }
  if(_payFreq != null &&  _chrg != null){
    newRows+="<tr><th>"+_payFreq+" Pay:</th><td> "+_chrg+" MXN</td>";
  }
  if(_payopt != null ){
    newRows+="<tr><th>Payment Option:</th><td> "+_payopt+" MXN</td>";
  }
  if(_frnds != null ){
    newRows+="<tr><th>Friends Needed:</th><td> "+_frnds+"</td>";
  }
  for(var l = 0; l < _mailcontact.length ; l++) {
        newRows+="<tr><th>Friends Invited:</th><td> "+_mailcontact[l]+"</td>";
      }

  $( "#summaryTable" ).empty( )
  var htmltable=tbhead+newRows+tbfoot;
  $( "table#summaryTable" ).append( htmltable )
};

});
