var sb=supabase.createClient("https://ojfmpnqyrdfybbmchbvq.supabase.co","sb_publishable_oS6qBLKqbAPCBCzGVe5efw_AFqvCPoG");
var $=function(i){return document.getElementById(i)};
function E(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function F(n){n=Number(n);return n.toLocaleString("tr-TR",{minimumFractionDigits:n%1?2:0,maximumFractionDigits:2})+"₺"}
var ME=null,CU=null,NAV=[["Kavurmahane","kavurmahane.html"],["OP Cafe","op-cafe.html"],["Toptan","toptan.html"],["Mağaza","magaza.html"],["Blog","blog.html"]];
function trErr(e){var m=(e&&e.message)||String(e);
if(/Invalid login/i.test(m))return"E-posta ya da şifre yanlış";if(/not confirmed/i.test(m))return"E-postanızı doğrulamanız gerekiyor. Gelen kutunuza ve spam klasörüne bakın.";
if(/already registered/i.test(m))return"Bu e-posta ile zaten bir üyelik var. Giriş yapmayı deneyin.";if(/at least/i.test(m))return"Şifre en az 8 karakter olmalı";
if(/rate limit|too many/i.test(m))return"Çok fazla deneme yapıldı, biraz bekleyip tekrar deneyin";if(/captcha/i.test(m))return"Doğrulama başarısız, tekrar deneyin";return m}
var TK="0x4AAAAAAFli3uwc6xrSxT7j",TT="",TWm=null;
function tsm(){if(TWm!==null||!$("ts_m"))return;if(!window.turnstile){setTimeout(tsm,300);return}TWm=turnstile.render("#ts_m",{sitekey:TK,theme:"dark",callback:function(t){TT=t},"expired-callback":function(){TT=""},"error-callback":function(){TT=""}})}
function tsx(){TT="";if(window.turnstile&&TWm!==null)try{turnstile.reset(TWm)}catch(e){}}
function shell(active){if(!document.getElementById("tsjs")){var sc=document.createElement("script");sc.id="tsjs";sc.src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";sc.async=true;document.head.appendChild(sc)}
var nav=NAV.map(function(n){return'<a href="'+n[1]+'"'+(n[0]==active?' class="on"':'')+'>'+n[0]+'</a>'}).join("");
document.body.insertAdjacentHTML("afterbegin",'<header><div class="w"><a href="index.html"><img class="lg" alt="One Percenter" src="logo.png"></a><nav class="links">'+nav+'</nav><div class="hr"><button class="gi" id="acc" type="button">Giriş</button><button class="mb m" id="op" type="button">Menü</button></div></div></header>'
+'<div class="ov" id="ov"><button class="mb" id="cl" type="button">Kapat</button>'+nav+'</div>'
+'<div class="md" id="am"><div class="bx"><div id="au"><div class="tb2"><button data-t="1" class="on" type="button">Üye ol</button><button data-t="2" type="button">Giriş yap</button></div>'
+'<div class="f" id="f1"><label>Ad soyad</label><input id="s_n" autocomplete="name"><label>E-posta</label><input id="s_e" type="email" autocomplete="email"><label>Telefon</label><input id="s_p" inputmode="tel" autocomplete="tel"><label>Şifre (en az 8 karakter)</label><input id="s_w" type="password" autocomplete="new-password"><p class="msg" id="m1"></p><p><button class="bt p" id="b1" type="button" style="margin:10px 0 0">Üye ol</button></p></div>'
+'<div class="f" id="f2" hidden><label>E-posta</label><input id="l_e" type="email" autocomplete="email"><label>Şifre</label><input id="l_w" type="password" autocomplete="current-password"><p class="msg" id="m2"></p><p style="margin:10px 0 0"><button class="bt p" id="b2" type="button" style="margin:0 8px 0 0">Giriş yap</button><button id="b3" type="button" style="font:inherit;font-size:13px;color:var(--mu);background:none;border:0;cursor:pointer;text-decoration:underline">Şifremi unuttum</button></p></div><div id="ts_m" style="margin:12px 0 0"></div></div>'
+'<div id="ac" hidden><h3 style="margin:0 0 6px">Hesabım</h3><p id="ai" class="sub" style="margin:0 0 14px"></p><p><button class="bt" id="bo" type="button" style="margin:0">Çıkış yap</button></p></div>'
+'<p style="margin:14px 0 0"><button class="bt" id="mx" type="button" style="margin:0;font-size:13px;padding:8px 16px">Kapat</button></p></div></div>');
document.body.insertAdjacentHTML("beforeend",'<footer><div class="w"><img alt="One Percenter" src="logo.png"><div>[Adres] · [Çalışma saatleri]<br><a href="https://instagram.com/onepercentercoffeeco" rel="noopener">@onepercentercoffeeco</a></div></div></footer>');
var ov=$("ov"),am=$("am");
$("op").onclick=function(){ov.classList.add("on")};$("cl").onclick=function(){ov.classList.remove("on")};
$("mx").onclick=function(){am.classList.remove("on")};am.onclick=function(e){if(e.target==am)am.classList.remove("on")};
$("acc").onclick=function(){openAuth()};
[].forEach.call(document.querySelectorAll(".tb2 button"),function(b){b.onclick=function(){tabAuth(b.dataset.t)}});
$("b1").onclick=async function(){var b=this,m=$("m1");m.className="msg";m.textContent="";var n=$("s_n").value.trim(),e=$("s_e").value.trim(),p=$("s_p").value.trim(),w=$("s_w").value;
if(!n||!e||!w){m.textContent="Ad, e-posta ve şifre gerekli";return}if(!TT){m.textContent="Lütfen doğrulamayı tamamlayın";return}if(w.length<8){m.textContent="Şifre en az 8 karakter olmalı";return}
b.disabled=true;var r=await sb.auth.signUp({email:e,password:w,options:{data:{full_name:n,phone:p},emailRedirectTo:location.origin+location.pathname,captchaToken:TT}});b.disabled=false;tsx();
if(r.error){m.textContent=trErr(r.error);return}
if(r.data.session){am.classList.remove("on")}else{m.className="msg ok";m.textContent="Doğrulama bağlantısını e-postanıza gönderdik. Bağlantıya tıkladıktan sonra giriş yapabilirsiniz."}};
$("b2").onclick=async function(){var b=this,m=$("m2");m.className="msg";m.textContent="";if(!TT){m.textContent="Lütfen doğrulamayı tamamlayın";return}b.disabled=true;var r=await sb.auth.signInWithPassword({email:$("l_e").value.trim(),password:$("l_w").value,options:{captchaToken:TT}});b.disabled=false;tsx();
if(r.error)m.textContent=trErr(r.error);else am.classList.remove("on")};
$("b3").onclick=async function(){var m=$("m2"),e=$("l_e").value.trim();m.className="msg";if(!e){m.textContent="Önce e-posta adresinizi yazın";return}if(!TT){m.textContent="Lütfen doğrulamayı tamamlayın";return}
var r=await sb.auth.resetPasswordForEmail(e,{redirectTo:location.origin+location.pathname,captchaToken:TT});tsx();if(r.error)m.textContent=trErr(r.error);else{m.className="msg ok";m.textContent="Şifre yenileme bağlantısı e-postanıza gönderildi."}};
$("bo").onclick=async function(){await sb.auth.signOut();am.classList.remove("on")};
document.addEventListener("click",function(e){if(e.target.tagName=="A"&&ov.classList.contains("on"))ov.classList.remove("on")});
sb.auth.onAuthStateChange(function(ev){if(ev=="SIGNED_IN"||ev=="SIGNED_OUT"||ev=="USER_UPDATED")ses()});
ses()}
function tabAuth(t){$("f1").hidden=t!="1";$("f2").hidden=t!="2";[].forEach.call(document.querySelectorAll(".tb2 button"),function(b){b.classList.toggle("on",b.dataset.t==t)})}
function openAuth(t){$("am").classList.add("on");$("au").hidden=!!ME;$("ac").hidden=!ME;if(ME){var s=CU?({yok:"Toptan listesi için onay istenmedi",beklemede:"Toptan başvurunuz inceleniyor",onayli:"Toptan listesine erişiminiz açık",reddedildi:"Toptan başvurunuz onaylanmadı"})[CU.wholesale_status]:"";$("ai").innerHTML=E(ME.email)+(s?"<br>"+s:"")}else{tabAuth(t||"2");tsm()}}
async function ses(){var s=(await sb.auth.getSession()).data.session;ME=s?s.user:null;CU=null;
if(ME){var r=await sb.from("customers").select("*").eq("id",ME.id).maybeSingle();CU=r.data}
if($("acc"))$("acc").textContent=ME?"Hesabım":"Giriş";if(window.onSession)await window.onSession()}
