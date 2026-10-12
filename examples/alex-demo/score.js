// score.js — Alex Kim · Context Window theme
function score(ac, T0) {
  const t = b => T0 + b * (60/100);
  const mf = m => 440 * Math.pow(2, (m-69)/12);
  let sd = 42; const rnd = () => { sd=(sd*1664525+1013904223)>>>0; return sd/4294967296; };

  function tone(st, freq, dur, vol, type='triangle') {
    if(st<0||dur<=0||vol<=0) return;
    const g=ac.createGain(), o=ac.createOscillator();
    o.type=type; o.frequency.value=freq;
    g.gain.setValueAtTime(0,st);
    g.gain.linearRampToValueAtTime(vol,st+0.015);
    g.gain.exponentialRampToValueAtTime(0.0001,st+dur);
    o.connect(g); g.connect(ac.destination);
    o.start(st); o.stop(st+dur+0.1);
  }

  function ping(st, f1, f2, vol=0.06) {
    tone(st, f1, 0.18, vol, 'sine');
    tone(st+0.04, f2, 0.10, vol*0.5, 'sine');
  }

  function tick(st, freq=1200, vol=0.022) { tone(st, freq, 0.04, vol, 'square'); }

  function pad(st, notes, dur, vol=0.02) {
    notes.forEach(m => tone(st, mf(m), dur, vol, 'triangle'));
  }

  // kick
  for(let b=0; b<120; b++) {
    const bt=t(b);
    const g=ac.createGain(), o=ac.createOscillator();
    o.type='sine'; o.frequency.setValueAtTime(80,bt);
    o.frequency.exponentialRampToValueAtTime(40,bt+0.08);
    g.gain.setValueAtTime(0.2,bt); g.gain.exponentialRampToValueAtTime(0.0001,bt+0.18);
    o.connect(g); g.connect(ac.destination); o.start(bt); o.stop(bt+0.3);
  }

  // hi-hats (quiet 16ths from beat 10)
  for(let b=10; b<120; b+=0.25) {
    const bt=t(b);
    const g=ac.createGain(), o=ac.createOscillator();
    o.type='square'; o.frequency.value=6000+rnd()*3000;
    g.gain.setValueAtTime(0.012,bt); g.gain.exponentialRampToValueAtTime(0.0001,bt+0.04);
    o.connect(g); g.connect(ac.destination); o.start(bt); o.stop(bt+0.06);
  }

  // pad chords — Am F C G
  const chords=[[57,60,64],[53,57,60],[60,64,67],[55,59,62]];
  for(let b=10; b<116; b+=4) pad(t(b), chords[Math.floor(b/4)%4], t(4)-t(0)*0.2);

  // boot ticks
  for(let b=1; b<7.5; b+=0.4) if(rnd()>0.4) tick(t(b), 900+rnd()*500, 0.04);

  // tool call pings
  ping(t(18), mf(64), mf(69), 0.08);
  ping(t(38), mf(65), mf(72), 0.08);
  ping(t(58), mf(67), mf(74), 0.07);
  ping(t(80), mf(60), mf(64), 0.09);

  // streaming ticks — query
  for(let b=9.5; b<18; b+=0.1) if(rnd()>0.55) tick(t(b), 1300+rnd()*200, 0.016);
  // thinking
  for(let b=60; b<78; b+=0.08) if(rnd()>0.65) tick(t(b), 1100+rnd()*200, 0.012);
  // final response
  for(let b=82; b<104; b+=0.1) if(rnd()>0.55) tick(t(b), 1000+rnd()*200, 0.016);

  // bespoke moment — meter hits 100% + response ends on same beat (104)
  [60,64,67,72].forEach((m,i) => tone(t(104)+i*0.055, mf(m), 0.5, 0.06, 'sine'));

  // outro chord
  [60,64,67,72].forEach(m => { tone(t(110), mf(m-12), t(4)-t(0), 0.035, 'triangle'); tone(t(110), mf(m), t(4)-t(0), 0.022, 'sine'); });
}

window.__audio = async function() {
  const sr=48000;
  const oc=new OfflineAudioContext(2, Math.ceil(sr*(72+0.5)), sr);
  score(oc, 0);
  const b=await oc.startRendering();
  const L=b.getChannelData(0), len=L.length;
  let peak=0; for(let i=0;i<len;i++) peak=Math.max(peak, Math.abs(L[i]));
  if(peak>0){const g=0.891/peak; for(let i=0;i<len;i++) L[i]*=g;}
  const buf=new ArrayBuffer(44+len*4), v=new DataView(buf);
  const ws=(o,s)=>{for(let i=0;i<s.length;i++) v.setUint8(o+i, s.charCodeAt(i))};
  ws(0,'RIFF'); v.setUint32(4,36+len*4,true); ws(8,'WAVEfmt ');
  v.setUint32(16,16,true); v.setUint16(20,3,true); v.setUint16(22,2,true);
  v.setUint32(24,sr,true); v.setUint32(28,sr*8,true);
  v.setUint16(32,8,true); v.setUint16(34,32,true); ws(36,'data');
  v.setUint32(40,len*4,true);
  for(let i=0;i<len;i++) v.setFloat32(44+i*4, L[i], true);
  const arr=new Uint8Array(buf);
  let s=''; for(let i=0;i<arr.length;i+=65536) s+=String.fromCharCode(...arr.subarray(i,i+65536));
  return 'data:audio/wav;base64,'+btoa(s);
};
