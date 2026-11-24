(function(){
"use strict";
var url=location.href.split("#")[0],title=document.title,encoded=encodeURIComponent(url),et=encodeURIComponent(title);
var wa=document.getElementById("share-whatsapp"),fb=document.getElementById("share-facebook"),li=document.getElementById("share-linkedin"),x=document.getElementById("share-x"),copy=document.getElementById("copy-link"),nativeShare=document.getElementById("share-native");
if(!wa||!fb||!li||!x||!copy||!nativeShare)return;
wa.href="https://wa.me/?text="+et+"%20"+encoded;
fb.href="https://www.facebook.com/sharer/sharer.php?u="+encoded;
li.href="https://www.linkedin.com/sharing/share-offsite/?url="+encoded;
x.href="https://twitter.com/intent/tweet?url="+encoded+"&text="+et;
copy.addEventListener("click",async function(){try{await navigator.clipboard.writeText(url);copy.textContent="لینک کاپی شد";}catch(e){window.prompt("این لینک را کاپی کنید:",url);}});
nativeShare.addEventListener("click",function(){if(navigator.share){navigator.share({title:title,url:url}).catch(function(){});}else{copy.click();}});
})();