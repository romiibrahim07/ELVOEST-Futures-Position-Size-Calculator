(() => {
 const $=id=>document.getElementById(id);
 const fmt=n=>Number(n).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
 let currency='USD', rateIdr=Number(localStorage.getItem('elvoest_usd_idr_rate'))||null, rateUpdated=localStorage.getItem('elvoest_usd_idr_updated')||'';
 let lastResult=null;
 const money=n=>currency==='IDR'?(rateIdr?'Rp '+Number(n*rateIdr).toLocaleString('id-ID',{maximumFractionDigits:0}):'Rate unavailable'):'$'+fmt(n);
 function status(){
  const el=$('fx-status');
  if(rateIdr){el.textContent=`1 USD = Rp ${rateIdr.toLocaleString('id-ID',{maximumFractionDigits:2})} · ${rateUpdated?`updated ${new Date(rateUpdated).toLocaleString('id-ID')}`:'saved rate'}${navigator.onLine?'':' · offline'}`;}
  else el.textContent='Exchange rate unavailable. USD display remains available.';
 }
 async function refreshRate(){
  const el=$('fx-status'); if(el) el.textContent='Updating exchange rate…';
  try{
   const res=await fetch('https://open.er-api.com/v6/latest/USD',{cache:'no-store'});
   if(!res.ok) throw new Error('Rate request failed');
   const data=await res.json(); const value=Number(data?.rates?.IDR);
   if(!Number.isFinite(value)||value<=0) throw new Error('Invalid exchange rate');
   rateIdr=value; rateUpdated=data.time_last_update_utc||new Date().toISOString();
   localStorage.setItem('elvoest_usd_idr_rate',String(rateIdr)); localStorage.setItem('elvoest_usd_idr_updated',rateUpdated);
  }catch(e){ /* use last saved rate when offline or API is unavailable */ }
  status(); if(lastResult) render(lastResult);
 }
 function render(result){
  $('final').textContent=money(result.balance);$('profit').textContent=money(result.net);
  $('growth').textContent=(result.growth>=0?'+':'')+fmt(result.growth)+'%';
  $('periods').textContent=result.count.toLocaleString('en-US');
  $('chart-period').textContent=result.period+' projection';
  $('start-label').textContent='START '+money(result.initial);$('end-label').textContent='FINAL '+money(result.balance);
  draw(result.points);
 }
 function calculate(){
  const initial=Number($('initial').value), rate=Number($('rate').value), count=Number($('count').value), deposit=Number($('deposit').value||0), period=$('period').value;
  const valid=Number.isFinite(initial)&&initial>0&&Number.isFinite(rate)&&rate>-100&&Number.isInteger(count)&&count>=1&&count<=1000&&Number.isFinite(deposit)&&deposit>=0;
  if(!valid){lastResult=null;$('final').textContent='—';$('profit').textContent='—';$('growth').textContent='—';$('periods').textContent='—';$('chart').innerHTML='<text x="360" y="150" text-anchor="middle" class="chart-label">Check your inputs to view the projection</text>';return;}
  let balance=initial;const points=[balance];
  for(let i=1;i<=count;i++){balance=balance*(1+rate/100)+deposit;points.push(balance);}
  lastResult={initial,balance,net:balance-initial-(deposit*count),growth:(balance/initial-1)*100,count,period,points};
  render(lastResult);
 }
 function draw(values){
  const W=720,H=300,L=75,R=18,T=18,B=38,iw=W-L-R,ih=H-T-B;
  const converted=values.map(v=>currency==='IDR'&&rateIdr?v*rateIdr:v);
  const min=Math.min(...converted),max=Math.max(...converted),range=max-min||Math.max(1,max*.05),lo=min-range*.08,hi=max+range*.08;
  const x=i=>L+(i/(values.length-1||1))*iw,y=v=>T+(1-(v-lo)/(hi-lo))*ih;
  let grid='',labels='';
  for(let k=0;k<5;k++){const yy=T+k*ih/4,val=hi-k*(hi-lo)/4;grid+=`<line class="chart-grid" x1="${L}" y1="${yy}" x2="${W-R}" y2="${yy}"/>`;const label=currency==='IDR'?'Rp '+(val>=1e9?(val/1e9).toFixed(1)+'B':val>=1e6?(val/1e6).toFixed(1)+'M':Math.round(val).toLocaleString('id-ID')):(val>=10000?(val/1000).toFixed(0)+'k':val.toFixed(0));labels+=`<text class="chart-label" x="${L-9}" y="${yy+4}" text-anchor="end">${label}</text>`;}
  const line=converted.map((v,i)=>(i?'L':'M')+x(i).toFixed(2)+' '+y(v).toFixed(2)).join(' ');
  const area=line+` L ${x(values.length-1)} ${T+ih} L ${L} ${T+ih} Z`;
  $('chart').innerHTML=`<defs><linearGradient id="area" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#21d18b" stop-opacity=".28"/><stop offset="100%" stop-color="#21d18b" stop-opacity="0"/></linearGradient></defs>${grid}${labels}<path class="chart-area" d="${area}"/><path class="chart-line" d="${line}"/><circle cx="${x(converted.length-1)}" cy="${y(converted[converted.length-1])}" r="5" fill="#21d18b" stroke="#08110c" stroke-width="3"/>`;
 }
 document.querySelectorAll('.currency-btn').forEach(btn=>btn.addEventListener('click',()=>{
  currency=btn.dataset.currency;
  document.querySelectorAll('.currency-btn').forEach(b=>{const active=b===btn;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
  if(currency==='IDR'&&!rateIdr) refreshRate(); else if(lastResult) render(lastResult);
 }));
 ['initial','rate','period','count','deposit'].forEach(id=>$(id).addEventListener('input',calculate));
 calculate(); status(); refreshRate();
})();