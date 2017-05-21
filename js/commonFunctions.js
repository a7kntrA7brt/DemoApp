function freq2string(pot_frequency)
{
  if(pot_frequency == 1) {
    pot_frequency ="Mensual"
  }
  else if (pot_frequency == 2) {
    pot_frequency ="Quincenal"
  }
  else {
    pot_frequency ="Semanal"
  }
  return pot_frequency;
}

function propMemStat2String(status)
{
  if(status == 0) {
    status ="Agregado"
  }
  else if (status == 1) {
    status ="Invitado"
  }
  else if (status == 2) {
    status ="Unido"
  }
  else if (status == 3) {
    status ="No se unirá"
  }
  else {
    status ="NA"
  }
  return status;
}

function poolMemStat2String(status)
{
  if(status == 0) {
    status ="Cancelado"
  }
  else if(status == 1) {
    status ="Tanda Pendiente"
  }
  else if (status == 2) {
    status ="Tanda recibida"
  }
  else if (status == 3) {
    status ="Pago Fallido"
  }
  else {
    status ="NA"
  }
  return status;
}


 function logOut() {
   window.localStorage.removeItem("usrEmail");
   window.localStorage.removeItem("usrPass");
   window.localStorage.removeItem("usrId");
    window.location.href="landingPage.html";
    window.location.href.reload(true);
  }

   function getQueryVariable(variable)
   {
          var query = window.location.search.substring(1);
          var vars = query.split("&");
          for (var i=0;i<vars.length;i++) {
                  var pair = vars[i].split("=");
                  if(pair[0] == variable){return pair[1];}
          }
          return(false);
   }


   function createPaymentdates(_payFreq, _frdcnt, _date) {
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
   for (var i =1; i < _frdcnt; i++ ) {
   eqldatefnd =0;
   if (_payFreq == "Mensual" )
   {
     d2.setMonth(d2.getMonth() + 1);
   }
   else if (_payFreq == "Quincenal" )
   {
     d2.setDate(d2.getDate() + 14);
   }
   else if (_payFreq == "Semanal" )
   {
     d2.setDate(d2.getDate() + 6);
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
