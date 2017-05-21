$(document).on("pageshow","#settings",function() {
   var usrname;
   var email;
   var db;
   var bankinfo;

   var stat = true;

   db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
   db.transaction(function (tx) {
      tx.executeSql('SELECT * FROM PROFILE', [], function (tx, results) {
         for(var i = 0; i < results.rows.length; i++) {
            usrname= results.rows.item(i).uname;
            _email= results.rows.item(i).email;
            _bankinfo = results.rows.item(i).bankinfo;
          }
           createSummary(usrname, _email, _bankinfo);
       }, null);
   });
function createSummary(_uname, _email, _bankinfo ) {
  var tbhead= "<thead</thead><tbody>";
  var tbfoot ="</tbody>";
  var newRows="";
  if(_uname != null){
    newRows+="<tr><th>User:</th><td> "+_uname+"</td>";
  }
  if(_email != null ){
    newRows+="<tr><th>Email:</th><td> "+_email+"</td>";
  }
  if(_bankinfo != null ){
    newRows+="<tr><th>Bank Info:</th><td> "+_bankinfo+"</td>";
  }
  $( "#settingsTable" ).empty( )
  var htmltable=tbhead+newRows+tbfoot;
  $( "table#settingsTable" ).append( htmltable );
}
 });
