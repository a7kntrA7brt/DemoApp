
$(document).on("pageshow","#MoneyPot",function() {
  var db;
  var msg;
   document.getElementById("mpnext").addEventListener("click",saveData, false);
   db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
      
  function saveData() {
    var _uname;
    var moneyPot = document.getElementById("inputMPot").value;
    if (moneyPot % 100 === 0  ){
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
       tx.executeSql('INSERT INTO NEWDITA (user, create_date, ditaAmount) VALUES (?, ?, ?)',[_uname, date,moneyPot]);
    });
    $.mobile.changePage( "#payments", { transition: "slideup", changeHash: false })
  }
  else
{
  alert('Its not divisible by 100 dummy')
}
}
});

$(document).on("pageshow","#payments",function() {
          var _moneyPot;
          var db;
          db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
          db.transaction(function (tx) {
              tx.executeSql('SELECT * FROM NEWDITA', [], function (tx, results) {
                 for(var i = 0; i < results.rows.length; i++) {
                        _moneyPot= results.rows.item(i).ditaAmount;
                      }
                      var choice2 = document.getElementById("select-choice-2").value;
                      var payment;
                      if (choice2 == "weekly"){
                         payment=_moneyPot/2;
                      }
                      if (choice2 == "BiWeekly"){
                         payment=_moneyPot/2;
                      }
                      if (choice2 == "Monthly"){
                        payment=_moneyPot/2;
                      }
                      var newRows= "<tr><th>Money Pot:</th><td>     "+_moneyPot+" MXN</td></tr><tr><th>Pay:</th><td>     "+payment+choice2+"</td></tr>";
                      $( "table#mytable tbody" )
                       // Append the new rows to the body
                       .append( newRows )
              }, null);
           });
});
