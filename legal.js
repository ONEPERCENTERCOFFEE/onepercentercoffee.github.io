var LD={company:"",tax_office:"",tax_no:"",mersis:"",kep:"",kvkk_email:"",delivery_days:"3",return_address:"",draft:true};
var LB={company:"Ticari unvan",tax_office:"Vergi dairesi",tax_no:"Vergi no",mersis:"MERSİS no",kep:"KEP adresi",email:"E-posta",phone:"Telefon",address:"Adres",delivery_days:"3",return_address:"İade adresi"};
(async function(){var d=await pc("legal",LD);
window.onSite=function(s){var m={company:d.company,tax_office:d.tax_office,tax_no:d.tax_no,mersis:d.mersis,kep:d.kep,email:d.kvkk_email||s.email,phone:s.phone,address:s.address,delivery_days:d.delivery_days,return_address:d.return_address||s.address};
[].forEach.call(document.querySelectorAll("[data-l]"),function(e){var v=m[e.dataset.l];e.textContent=v||("[ "+(LB[e.dataset.l]||e.dataset.l)+" ]");if(!v)e.style.background="#3a2a00"});
var b=document.getElementById("dr");if(b)b.hidden=!d.draft};
shell("")})();
