
  var db;
  var msg;
  window.onload = function()
      {
         document.addEventListener("deviceready", init, false);
      }
      function init()
      {
          document.getElementById("btnSet").addEventListener("click",saveData, false);
        db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
        db.transaction(function (tx) {
           tx.executeSql('DROP TABLE IF EXISTS LOGS');
           tx.executeSql('DROP TABLE IF EXISTS PROFILE');
           tx.executeSql('CREATE TABLE IF NOT EXISTS PROFILE (id auto_increment, uname text, email text, pass text, bankinfo text)');
        });
      }
    function saveData() {

       var _username = document.getElementById("username").value;
       var _pass = document.getElementById("password").value;
       var _email = document.getElementById("email").value;
       var _bankInfo = document.getElementById("BankInfo").value;

      db.transaction(function (tx) {
      tx.executeSql('INSERT INTO PROFILE (uname, email, pass, bankinfo ) VALUES (?, ?, ?, ?)',[_username, _email, _pass, _bankInfo]);
      });
      alert("Thanks for Registering");
      $.mobile.changePage( "main.html", { transition: "slideup", changeHash: false })
      }
