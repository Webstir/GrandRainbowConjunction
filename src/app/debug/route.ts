import { NextResponse } from "next/server";

/** Raw HTML diagnostic page — bypasses the React/Next layout entirely. */
export async function GET() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Debug probe</title>
<style>
body{font-family:system-ui,sans-serif;background:#0c0618;color:#fff;padding:1rem;margin:0}
h1{font-size:1.25rem}
h2{font-size:1rem;margin-top:1rem}
#results{list-style:none;padding:0}
#results li{padding:.35rem 0;border-bottom:1px solid #ffffff15;font-size:.85rem}
.pass{color:#6ee7b7}.fail{color:#fca5a5}.warn{color:#fde68a}
#noscript-msg{color:#fca5a5;font-weight:bold}
#draw-test{border:1px solid #ffffff30;border-radius:8px;margin-top:1rem;touch-action:none}
pre{font-size:.75rem;color:#a5b4fc;white-space:pre-wrap;word-break:break-all;max-height:30vh;overflow:auto}
</style>
</head>
<body>
<h1>Debug probe</h1>
<noscript>
<p id="noscript-msg">
JavaScript is DISABLED in this browser. The rainbow gate requires JavaScript.
In DuckDuckGo: tap the shield icon &rarr; disable site protections.
In Safari: Settings &rarr; Safari &rarr; Advanced &rarr; JavaScript &rarr; On.
</p>
</noscript>
<p id="loading" style="color:#999">Loading diagnostics&hellip;</p>
<ul id="results"></ul>
<canvas id="draw-test" width="300" height="150" style="touch-action:none;display:none"></canvas>
<h2>Event log</h2>
<pre id="events">Waiting for touch/pointer&hellip;</pre>
<script>
(function(){
  var r=document.getElementById("results");
  var loading=document.getElementById("loading");
  var evLog=document.getElementById("events");
  var events=[];
  if(loading)loading.style.display="none";

  function add(label,status,detail){
    var li=document.createElement("li");
    li.className=status;
    li.textContent=label+": "+detail;
    r.appendChild(li);
  }

  add("JavaScript","pass","running");
  add("User-Agent","pass",navigator.userAgent);

  try{
    var c=document.createElement("canvas");
    c.width=10;c.height=10;
    var ctx=c.getContext("2d");
    if(ctx){
      ctx.fillStyle="red";ctx.fillRect(0,0,10,10);
      var px=ctx.getImageData(0,0,1,1).data;
      add("Canvas 2D","pass","context ok, pixel ["+px[0]+","+px[1]+","+px[2]+"]");
    }else{
      add("Canvas 2D","fail","getContext returned null");
    }
  }catch(e){add("Canvas 2D","fail",e.message)}

  try{
    var c2=document.createElement("canvas");
    c2.width=100;c2.height=10;
    var ctx2=c2.getContext("2d");
    var g=ctx2.createLinearGradient(0,0,100,0);
    g.addColorStop(0,"#1a0a2e");g.addColorStop(1,"#0f172a");
    ctx2.fillStyle=g;ctx2.fillRect(0,0,100,10);
    ctx2.strokeStyle="hsl(0 90% 60%)";
    ctx2.lineWidth=3;ctx2.beginPath();ctx2.moveTo(10,5);ctx2.lineTo(90,5);ctx2.stroke();
    var px2=ctx2.getImageData(50,5,1,1).data;
    add("HSL stroke",px2[0]>100?"pass":"warn","pixel ["+px2[0]+","+px2[1]+","+px2[2]+"] (expect red-ish)");
  }catch(e){add("HSL stroke","fail",e.message)}

  add("PointerEvent API",typeof PointerEvent!=="undefined"?"pass":"warn",
    typeof PointerEvent!=="undefined"?"available":"NOT available");
  add("TouchEvent API",typeof TouchEvent!=="undefined"?"pass":"warn",
    typeof TouchEvent!=="undefined"?"available":"not available");
  add("ResizeObserver",typeof ResizeObserver!=="undefined"?"pass":"warn",
    typeof ResizeObserver!=="undefined"?"available":"NOT available");
  add("structuredClone",typeof structuredClone!=="undefined"?"pass":"warn",
    typeof structuredClone!=="undefined"?"NOT available (iOS <15.4)":"available");
  add("devicePixelRatio","pass",String(window.devicePixelRatio));
  add("Screen","pass",screen.width+"x"+screen.height+" viewport "+window.innerWidth+"x"+window.innerHeight);

  var dc=document.getElementById("draw-test");
  dc.style.display="block";
  var dctx=dc.getContext("2d");
  dctx.fillStyle="#1a0a2e";dctx.fillRect(0,0,300,150);
  dctx.font="14px system-ui";dctx.fillStyle="#fff";
  dctx.fillText("Draw here to test input",20,80);

  function logEv(label,e){
    var line=label;
    if(e.clientX!==undefined)line+=" x="+Math.round(e.clientX)+" y="+Math.round(e.clientY);
    if(e.touches)line+=" touches="+e.touches.length;
    if(e.pressure!==undefined)line+=" pressure="+e.pressure.toFixed(2);
    events.unshift(line);
    if(events.length>30)events.pop();
    evLog.textContent=events.join("\\n");
  }
  function drawAt(x,y){
    var rect=dc.getBoundingClientRect();
    var lx=x-rect.left,ly=y-rect.top;
    dctx.strokeStyle="hsl("+((lx/300)*360)+" 90% 60%)";
    dctx.lineWidth=4;dctx.lineCap="round";
    dctx.beginPath();dctx.arc(lx,ly,2,0,Math.PI*2);dctx.stroke();
  }

  dc.addEventListener("pointerdown",function(e){logEv("pointerdown",e);drawAt(e.clientX,e.clientY)},{capture:true});
  dc.addEventListener("pointermove",function(e){logEv("pointermove",e);drawAt(e.clientX,e.clientY)},{capture:true});
  dc.addEventListener("pointerup",function(e){logEv("pointerup",e)},{capture:true});
  dc.addEventListener("touchstart",function(e){
    logEv("touchstart",e.touches[0]||e);
    if(e.touches[0])drawAt(e.touches[0].clientX,e.touches[0].clientY);
    e.preventDefault();
  },{capture:true,passive:false});
  dc.addEventListener("touchmove",function(e){
    logEv("touchmove",e.touches[0]||e);
    if(e.touches[0])drawAt(e.touches[0].clientX,e.touches[0].clientY);
    e.preventDefault();
  },{capture:true,passive:false});
  dc.addEventListener("touchend",function(e){logEv("touchend",e)},{capture:true});

  fetch("/api/debug").then(function(res){return res.json()}).then(function(d){
    add("Server ping","pass","OK — server sees UA: "+(d.userAgent||"").substring(0,60)+"…");
  }).catch(function(e){
    add("Server ping","fail",e.message);
  });

  add("Done","pass","all checks complete");
})();
</script>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
