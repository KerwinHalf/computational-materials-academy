export function initHero(canvas){
  const ctx=canvas.getContext('2d');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const staticMode=new URLSearchParams(location.search).has('static');
  if(reduced || staticMode) return ()=>{};
  let w=0,h=0,dpr=Math.min(devicePixelRatio||1,2),particles=[],pointer={x:-9999,y:-9999,active:false};
  const off=document.createElement('canvas');
  const octx=off.getContext('2d',{willReadFrequently:true});

  function resize(){
    w=innerWidth;h=innerHeight;
    canvas.width=w*dpr;canvas.height=h*dpr;
    canvas.style.width=w+'px';canvas.style.height=h+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
    build();
  }

  function build(){
    const ow=Math.min(1320,Math.max(700,w*.9));
    const oh=Math.min(500,Math.max(300,h*.52));
    off.width=ow;off.height=oh;octx.clearRect(0,0,ow,oh);
    const size=Math.min(210,ow/6.2);
    octx.textAlign='center';octx.textBaseline='middle';octx.fillStyle='#fff';
    octx.font=`900 ${size}px Arial Black, Inter, sans-serif`;
    octx.fillText('CP2K',ow/2,oh*.33);
    octx.font=`800 ${size*.44}px Arial Black, Inter, sans-serif`;
    octx.fillText('ACADEMY',ow/2,oh*.72);
    const img=octx.getImageData(0,0,ow,oh).data;
    particles=[];
    const step=w<800?7:5;
    const ox=(w-ow)/2,oy=(h-oh)/2-12;
    for(let y=0;y<oh;y+=step){
      for(let x=0;x<ow;x+=step){
        if(img[(y*ow+x)*4+3]>160){
          const px=ox+x,py=oy+y;
          particles.push({x:px,y:py,ox:px,oy:py,vx:0,vy:0,s:Math.random()*1.35+.65,a:Math.random()*.42+.45});
        }
      }
    }
  }

  function frame(t){
    ctx.clearRect(0,0,w,h);
    ctx.globalCompositeOperation='lighter';
    for(const p of particles){
      const dx=p.x-pointer.x,dy=p.y-pointer.y,dist=Math.hypot(dx,dy)||1;
      if(pointer.active && dist<155){
        const wave=1-dist/155;
        const ripple=.58+.42*Math.sin(dist*.115-t*.02);
        const f=wave*wave*2.05*ripple;
        p.vx+=(dx/dist)*f;p.vy+=(dy/dist)*f;
      }
      p.vx+=(p.ox-p.x)*.0175;p.vy+=(p.oy-p.y)*.0175;
      p.vx*=.905;p.vy*=.905;p.x+=p.vx;p.y+=p.vy;
      ctx.beginPath();
      ctx.fillStyle=`rgba(224,192,121,${p.a})`;
      ctx.shadowColor='rgba(213,179,106,.3)';ctx.shadowBlur=8;
      ctx.arc(p.x,p.y,p.s,0,Math.PI*2);ctx.fill();
    }
    ctx.shadowBlur=0;
    requestAnimationFrame(frame);
  }

  function move(e){pointer.x=e.clientX;pointer.y=e.clientY;pointer.active=true;}
  function leave(){pointer.active=false;}
  addEventListener('resize',resize);
  canvas.addEventListener('pointermove',move);
  canvas.addEventListener('pointerleave',leave);
  resize();requestAnimationFrame(frame);
  return ()=>{removeEventListener('resize',resize);canvas.removeEventListener('pointermove',move);canvas.removeEventListener('pointerleave',leave)};
}
