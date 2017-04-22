
var db;
var msg;
var usrid;
var _username;
var _pass ;
var _email;
var _bankInfo;
var proposalTandaId;

/*Determine if arrived trough specific proposal*/
$(document).on('pageinit', "#registeruser", function (event) {
     proposalTandaId = (($(this).data("url").indexOf("?") > 0) ? $(this).data("url") : window.location.href ).replace( /.*poolId=/, "" );
});

  /*Register New User on Tanda Database*/
  $("#btnSet").click(function()
  {
    var userExists = false;
    var emailExists = false;

    db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
    db.transaction(function (tx) {
      //tx.executeSql('DROP TABLE IF EXISTS PROFILE');
      tx.executeSql('CREATE TABLE IF NOT EXISTS PROFILE (id , uname text, email text, pass text, bankinfo text)');
      /* Find if user name is already taken */
      _username = document.getElementById("username").value;
      tx.executeSql('SELECT * FROM PROFILE WHERE uname = ?;', [_username], function (tx, results) {
        /* Did not find user name in database*/
        if( results.rows.length == 0) {
          userExists = true;
        }
        else {
          alert('Este nombre de usuario ya existe')
        }
    });//tx.executeSql('SELECT * FROM PROFILE..
    },//db.transaction(function (tx){
   function(tx, error){
     console.log(error.message);
   },
   function() {
    if (userExists == false ) {
      db.transaction(function (tx) {
        /* Find if user name is already taken */
        _email = document.getElementById("email").value;
        tx.executeSql('SELECT * FROM PROFILE WHERE email = ?;', [_email], function (tx, results) {
          /* Did not find e_mail in database*/
          if( results.rows.length == 0) {
            emailExists = true;
          }
          else {
            alert('Este e-mail ya esta registrado')
          }
      });//tx.executeSql('SELECT * FROM PROFILE..
      },//db.transaction(function (tx){
     function(tx, error){
       console.log(error.message);
     },
     function() {
      if (emailExists == false ) {
        db.transaction(function (tx) {
          /* Get user ID and Store Information*/
          tx.executeSql('SELECT COUNT(*) AS c FROM PROFILE', [], function (tx, results) {
              usrid = results.rows.item.(0).c
              _pass = document.getElementById("password").value;
              _bankInfo = document.getElementById("BankInfo").value;
              /* Storing Information in Database- Adding UserID in local storage*/
              tx.executeSql('INSERT INTO PROFILE (id, uname, email, pass, bankinfo ) VALUES (?, ?, ?, ?, ?)',[usrid, _username, _email, _pass, _bankInfo]);
              window.localStorage.setItem("userID", usrid);
              window.location.href="main.html";
              window.location.href.reload(true);
        });//tx.executeSql('SELECT COUNT(*)...
        },//db.transaction(function (tx){
       function(tx, error){
         console.log(error.message);
       },
       function() {
        GuestToUser();
       }
      );//db.transaction(function (tx)
      }
     }
    );//db.transaction(function (tx)
  } //if (userExists == false )
   }
  );//db.transaction(function (tx)
  });//$("#btnSet").click(function()

/* Find if New User was previously on the Guest Database
 TODO: based on Facebook ID
 Based on e-mail address
 Close Guest Information and move it to the Ueer */
function GuestToUser(){


}
