
$(document).on("pageshow","#MoneyPot",function() {
   var db;
   var msg;
   document.getElementById("mpnext").addEventListener("click",saveData, false);
   db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
      
   function saveData() {
      var _uname;
      var mpin = false;
      var dtin = false;
      var moneyPot = document.getElementById("inputMPot").value;
      var strdate = document.getElementById("date-input").value;
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
            tx.executeSql('CREATE TABLE IF NOT EXISTS NEWDITA (id auto_increment, user text, create_date, ditaAmount, startDate, frequency, Invited)');
            tx.executeSql('CREATE TABLE IF NOT EXISTS INVITED (id auto_increment, idGuest, idUser)');
         });

         db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM PROFILE', [], function (tx, results) {
               for(var i = 0; i < results.rows.length; i++) {
                    _uname = results.rows.item(i).uname;
                }
             }, null);
         });
         var today = new Date();
         var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
         db.transaction(function (tx) {
            tx.executeSql('INSERT INTO NEWDITA (user, create_date, startDate, ditaAmount) VALUES (?, ?, ?, ?)',[_uname, date, strdate, moneyPot]);
         });
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
   db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
   db.transaction(function (tx) {
      tx.executeSql('SELECT * FROM NEWDITA', [], function (tx, results) {
         for(var i = 0; i < results.rows.length; i++) {
            moneyPot= results.rows.item(i).ditaAmount;
             fstdate= results.rows.item(i).startDate;
          }
           createTable(moneyPot, fstdate, null, null, null, null);
           //createDropdown(payment, payment.length);
           //createPaymentOptions(payment[0], payFreq);
       }, null);
   });
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
                    _moneyPot= results.rows.item(i).ditaAmount;
                    date= results.rows.item(i).startDate;
                  }
                  var paypprd = null;
                  var chrgopt= null;
                  if ($('#select-payAmount').length) {
                     paypprd = document.getElementById("select-payAmount").value;
                  }
                  if ($('#payOpt').length) {
                     chrgopt = document.getElementById("payOpt").value;
                  }
                  var payment =[];
                  var minreached = false;
                  var frdcnt;
                  for(var j = 0; j < 20 && minreached ==false; j++) {
                     payment[j]= Math.round((_moneyPot/(j+2))*100)/100;
                     if (payment[j] < 100 ){
                         minreached = true;
                      }
                   }
                   //First Time this is chosen- not other options are available
                   if (paypprd == null && chrgopt == null){
                //       dropdownoption="<option value=payment.options[0].value>"+payment[0]+"</option>\
                //      <option value=payment.options[1].value>"+payment[1]+"</option>";
                       createTable(_moneyPot, date, payFreq, null, null, null);
                       createTtlPayAmount(payment, payment.length, payFreq)
                    //  $( "#select-choice-0" ).empty( )
                    //  $( "#select-choice-0" ).append( dropdownoption )
                  }
                  else if (paypprd != null && chrgopt == null){
                      frdcnt= Math.round( _moneyPot/paypprd);
               //       dropdownoption="<option value=payment.options[0].value>"+payment[0]+"</option>\
               //      <option value=payment.options[1].value>"+payment[1]+"</option>";
                      createTable(_moneyPot, date, payFreq, paypprd, null, frdcnt);
                   //  createTtlPayAmount(payment, payment.length, payFreq)
                   //  $( "#select-choice-0" ).empty( )
                   //  $( "#select-choice-0" ).append( dropdownoption )
                 }
                 else if (paypprd != null && chrgopt != null){
                     frdcnt=Math.round(_moneyPot/paypprd);
              //       dropdownoption="<option value=payment.options[0].value>"+payment[0]+"</option>\
              //      <option value=payment.options[1].value>"+payment[1]+"</option>";
                     createTable(_moneyPot, date, payFreq, paypprd, chrgopt, frdcnt);
                     //createTtlPayAmount(payment, payment.length, payFreq)
                  //  $( "#select-choice-0" ).empty( )
                  //  $( "#select-choice-0" ).append( dropdownoption )
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
                    _moneyPot= results.rows.item(i).ditaAmount;
                    date= results.rows.item(i).startDate;
                  }
                  var chrgopt= null;
                  if ($('#payOpt').length) {
                     chrgopt = document.getElementById("payOpt").value;
                  }
                  var payment =[];
                  var minreached = false;
                  var frdcnt;
                  if(payFreq == "Monthly"){
                    payment[0]= Math.round((paypprd/1)*100)/100;
                    payment[1]= Math.round((paypprd/2)*100)/100;
                    payment[2]= Math.round((paypprd/4)*100)/100;
                    payment[3]= Math.round((paypprd/10)*100)/100;
                  }
                  else if (payFreq == "BiWeekly") {
                    payment[0]= Math.round((paypprd/1)*100)/100;
                    payment[1]= Math.round((paypprd/2)*100)/100;
                    payment[2]= Math.round((paypprd/8)*100)/100;
                  }
                  else
                  {
                    payment[0]= Math.round((paypprd/(1))*100)/100;
                    payment[1]= Math.round((paypprd/(6))*100)/100;
                  }
                   //First Time this is chosen-
                  if (chrgopt == null){
                      frdcnt= Math.round( _moneyPot/paypprd);
               //       dropdownoption="<option value=payment.options[0].value>"+payment[0]+"</option>\
               //      <option value=payment.options[1].value>"+payment[1]+"</option>";
                      createTable(_moneyPot, date, payFreq, paypprd, null, frdcnt);
                      createPaymentOptions(payment, payment.length, payFreq);
                   //  $( "#select-choice-0" ).empty( )
                   //  $( "#select-choice-0" ).append( dropdownoption )
                 }
                 else if (chrgopt != null){
                     frdcnt=Math.round(_moneyPot/paypprd);
              //       dropdownoption="<option value=payment.options[0].value>"+payment[0]+"</option>\
              //      <option value=payment.options[1].value>"+payment[1]+"</option>";
                     createTable(_moneyPot, date, payFreq, paypprd, chrgopt, frdcnt);

                  //  $( "#select-choice-0" ).empty( )
                  //  $( "#select-choice-0" ).append( dropdownoption )
                }
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
    newRows+="<tr><th>Payment Option:</th><td> "+_payopt+"</td>";
  }
  if(_frnds != null ){
    newRows+="<tr><th>Friends Needed:</th><td> "+_frnds+"</td>";
  }
  $( "#mytable" ).empty( )
  var htmltable=tbhead+newRows+tbfoot;
  $( "table#mytable" ).append( htmltable )
};

function createTtlPayAmount(_payment, _length, _payFreq) {

    if ($('#select-payAmountlbl').length) {
       $('#select-payAmountlbl').remove();
    }
    if ($('#select-payAmount').length) {
       $('#select-payAmount').remove();
    }
    var x;
    // Add a new select element
   $('#div-payAmount').after("<label for=\"select-payAmount\"  id=\"select-payAmountlbl\" class=\"select\">How much can you pay "+ _payFreq+":</label>");
   $('<select>').attr({'name':'select-payAmount','id':'select-payAmount'}).appendTo("#select-payAmountlbl");
   $( "#select-payAmount" ).empty( )
   $('<option>').attr({'value':"" ,'data-placeholder':'true'}).html(x).appendTo('#select-payAmount');
   for(var k = 0; k< _length; k++) {
      x=_payment[k];
      $('<option>').attr({'value':x}).html(x).appendTo('#select-payAmount');
   }
   $('</option>').after('#select-payAmount');
   // Enhance new select element
   $('#select-payAmount').selectmenu();
  //  var dropdownoption = "<label for=\"select-choice-0\" class=\"select\">Payment Amount:</label>";
};
function createPaymentOptions(_payment, _length,_payFreq) {
 if ($('#select-payOptlbl').length) {
    $('#select-payOptlbl').remove();
 }
 if ($('#select-payOpt').length) {
    $('#select-payOpt').remove();
 }
 var x;
 // Add a new select element
$('#div-payOpt').after("<label for=\"select-payOpt\"  id=\"select-payOptlbl\" class=\"select\">Payment options:</label>");
$('<select>').attr({'name':'select-payOpt','id':'select-payOpt'}).appendTo("#select-payOptlbl");
$( "#select-payOpt" ).empty( )
$('<option>').attr({'value':"" ,'data-placeholder':'true'}).html(x).appendTo('#select-payOpt');
if (_payFreq == "Monthly") {
     $('<option>').attr({'value':_payment[0]}).html(_payment[0] + " MXN Monthly").appendTo('#select-payOpt');
     $('<option>').attr({'value':_payment[1]}).html(_payment[1] + " MXN BiWeekly").appendTo('#select-payOpt');
     $('<option>').attr({'value':_payment[2]}).html(_payment[2] + " MXN Weekly").appendTo('#select-payOpt');
     $('<option>').attr({'value':_payment[3]}).html(_payment[3] + " MXN every 3 days").appendTo('#select-payOpt');
}
else if (_payFreq == "BiWeekly") {
  $('<option>').attr({'value':_payment[0]}).html(_payment[0] + " MXN BiWeekly").appendTo('#select-payOpt');
  $('<option>').attr({'value':_payment[1]}).html(_payment[1] + " MXN Weekly").appendTo('#select-payOpt');
  $('<option>').attr({'value':_payment[2]}).html(_payment[2] + " MXN every 2 days").appendTo('#select-payOpt');
}
else {
  $('<option>').attr({'value':_payment[0]}).html(_payment[0] + " MXN Weekly").appendTo('#select-payOpt');
  $('<option>').attr({'value':_payment[1]}).html(_payment[1] + " MXN Daily").appendTo('#select-payOpt');
}
// Enhance new select element
$('#select-payOpt').selectmenu();
  //  var dropdownoption = "<label for=\"select-choice-0\" class=\"select\">Payment Amount:</label>";
};
