
var db;
var msg;
var usrid;
var _username;
var _pass ;
var _email;
var _bankInfo;
$(document).on("pageshow","#registeruser",function() {

  $("#btnSet").click(function()
  {
    db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
    db.transaction(function (tx) {
      //tx.executeSql('DROP TABLE IF EXISTS PROFILE');
      tx.executeSql('CREATE TABLE IF NOT EXISTS PROFILE (id , uname text, email text, pass text, bankinfo text)');
      /* Find if user name is already taken */
      _username = document.getElementById("username").value;
      tx.executeSql('SELECT * FROM PROFILE WHERE uname = ?;', [_username], function (tx, results) {
        /* Did not find user name in database*/
        if( results.rows.length == 0) {
          usrid = results.rows.length+1
          _pass = document.getElementById("password").value;
          _email = document.getElementById("email").value;
          _bankInfo = document.getElementById("BankInfo").value;
          /* Storing Information in Database- Adding UserID in local storage*/
          tx.executeSql('INSERT INTO PROFILE (id, uname, email, pass, bankinfo ) VALUES (?, ?, ?, ?, ?)',[usrid, _username, _email, _pass, _bankInfo]);
          window.localStorage.setItem("userID", usrid);
          window.location.href="main.html";
          window.location.href.reload(true);
        }
        else {
          alert('This user name is already taken, please change user name')
        }
    });//tx.executeSql('SELECT * FROM PROFILE..
    });//db.transaction(function (tx)
  });//$("#btnSet").click(function()
});
