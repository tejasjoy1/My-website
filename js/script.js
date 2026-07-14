gsap.registerPlugin(ScrollTrigger);

console.log("GSAP Loaded Successfully");



window.addEventListener('load',()=>{
  const boot=document.getElementById('bootText');
  const lines=['&gt; initializing','&gt; loading modules... done','&gt; tejas.n / ready'];
  let i=0;
  const iv=setInterval(()=>{
    i++;
    if(i<lines.length){ boot.innerHTML=lines[i]+'<span class="cursor-blink"></span>'; }
    else{
      clearInterval(iv);
      setTimeout(()=>{
        document.getElementById('loader').classList.add('hide');
        document.getElementById('site').style.opacity='1';
        initAll();

      },300);
    }
  },380);
});

function initAll(){
  buildMarquee();
  buildGlyphBar();
  initReveal();
  initWork();
  initClock();
  initCursor();
  initMagnetic();
  initTilt();
  initScrollProgress();
  initActiveNav();
  initMobileMenu();
  initToTop();
  initRepelText();
  initPageWipe();
  initFooterPing();
  initSpotlight();
  initThemeToggle();
}

function buildMarquee(){
  const items=['Figma','Adobe XD','Illustrator','Photoshop','UI / UX Design','Data Analytics','SQL','Power BI','Excel','Branding'];
  const wrap=document.getElementById('marq');
  const seq=[...items,...items].map(t=>`<span>${t}</span><span class="dot">◆</span>`).join('');
  wrap.innerHTML=seq;
}

function buildGlyphBar(){
  const bar=document.getElementById('glyphBar');
  const count=48;
  let html='';
  for(let i=0;i<count;i++){
    const delay=(i*0.09).toFixed(2);
    html+=`<span style="animation-delay:${delay}s"></span>`;
  }
  bar.innerHTML=html;

  const isFinePointer=window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  if(!isFinePointer) return;
  const dots=[...bar.querySelectorAll('span')];
  bar.addEventListener('mousemove',(e)=>{
    const r=bar.getBoundingClientRect();
    const mx=e.clientX-r.left;
    dots.forEach((d,idx)=>{
      const dx=Math.abs((idx/count)*r.width - mx);
      const scale=Math.max(1, 2.4-dx/60);
      d.style.transform=`scale(${scale})`;
    });
  });
  bar.addEventListener('mouseleave',()=>{
    dots.forEach(d=>d.style.transform='scale(1)');
  });
}

function initReveal(){
  const els=document.querySelectorAll('.reveal');
  const io=new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('in'); });
  },{threshold:.15});
  els.forEach(el=>io.observe(el));
}

function initWork(){
 document.querySelectorAll('.work-item').forEach(item => {
    item.addEventListener('click', () => {

        // Open TimeToPrint website
        if (item.dataset.idx === "0") {
            window.open(
                "https://tejasjoy1.github.io/TimeToPrint/",
                "_blank"
            );
            return;
        }

        const wasOpen = item.classList.contains('open');

        document.querySelectorAll('.work-item')
            .forEach(w => w.classList.remove('open'));

        if (!wasOpen)
            item.classList.add('open');
    });

    item.addEventListener('keydown', (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            item.click();
        }
    });
});
}
document.querySelectorAll('.project-btn').forEach(btn=>{
    btn.addEventListener('click',(e)=>{
        e.stopPropagation();
    });
});
function initClock(){
  const clockEl=document.getElementById('clockText');
  function tick(){
    const now=new Date();
    const utc=now.getTime()+now.getTimezoneOffset()*60000;
    const ist=new Date(utc+5.5*3600000);
    const h=String(ist.getHours()).padStart(2,'0');
    const m=String(ist.getMinutes()).padStart(2,'0');
    const s=String(ist.getSeconds()).padStart(2,'0');
    clockEl.textContent=`IST ${h}:${m}:${s}`;
  }
  tick();
  setInterval(tick,1000);
}

/* ---------- CURSOR INTERACTIONS ---------- */
function initCursor(){
  const isFinePointer = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  if(!isFinePointer) return;

  document.body.classList.add('cursor-ready');
  const dot=document.getElementById('cursorDot');
  const ring=document.getElementById('cursorRing');
  const label=document.getElementById('cursorLabel');

  let mx=window.innerWidth/2, my=window.innerHeight/2;
  let rx=mx, ry=my;

  window.addEventListener('mousemove',(e)=>{
    mx=e.clientX; my=e.clientY;
    dot.style.transform=`translate(${mx}px, ${my}px) translate(-50%,-50%)`;
  });

  function loop(){
    rx += (mx-rx)*0.18;
    ry += (my-ry)*0.18;
    ring.style.transform=`translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  }
  loop();

  window.addEventListener('mousedown',()=>ring.classList.add('pressed'));
  window.addEventListener('mouseup',()=>ring.classList.remove('pressed'));

  const hoverables=document.querySelectorAll('a, button, .work-item, .skill-col li, [data-cursor]');
  hoverables.forEach(el=>{
    el.addEventListener('mouseenter',()=>{
      ring.classList.add('hovering');
      label.textContent=el.getAttribute('data-cursor')||'';
    });
    el.addEventListener('mouseleave',()=>{
      ring.classList.remove('hovering');
      label.textContent='';
    });
  });

  document.addEventListener('mouseleave',()=>{ dot.style.opacity='0'; ring.style.opacity='0'; });
  document.addEventListener('mouseenter',()=>{ dot.style.opacity='1'; ring.style.opacity='1'; });
}

/* Magnetic pull on primary CTAs */
function initMagnetic(){
  const isFinePointer = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  if(!isFinePointer) return;
  document.querySelectorAll('.magnetic').forEach(el=>{
    el.addEventListener('mousemove',(e)=>{
      const r=el.getBoundingClientRect();
      const x=e.clientX-r.left-r.width/2;
      const y=e.clientY-r.top-r.height/2;
      el.style.transform=`translate(${x*0.28}px, ${y*0.35}px)`;
    });
    el.addEventListener('mouseleave',()=>{ el.style.transform='translate(0,0)'; });
  });
}

/* Spotlight position tracking for service + work cards */
function initTilt(){
  document.querySelectorAll('.svc, .work-item').forEach(card=>{
    card.addEventListener('mousemove',(e)=>{
      const r=card.getBoundingClientRect();
      const x=((e.clientX-r.left)/r.width)*100;
      const y=((e.clientY-r.top)/r.height)*100;
      card.style.setProperty('--mx', x+'%');
      card.style.setProperty('--my', y+'%');
    });
  });
}

/* Scroll progress bar */
function initScrollProgress(){
  const bar=document.getElementById('scrollProgress');
  function update(){
    const h=document.documentElement;
    const scrolled=(h.scrollTop)/(h.scrollHeight-h.clientHeight)*100;
    bar.style.width=scrolled+'%';
  }
  window.addEventListener('scroll',update,{passive:true});
  update();
}

/* Active nav link highlighting */
function initActiveNav(){
  const sections=['services','work','experience','about','contact'].map(id=>document.getElementById(id)).filter(Boolean);
  const navLinks=document.querySelectorAll('[data-nav]');
  const io=new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const id=entry.target.id;
        navLinks.forEach(l=>l.classList.toggle('active', l.getAttribute('href')==='#'+id));
      }
    });
  },{rootMargin:'-40% 0px -55% 0px'});
  sections.forEach(s=>io.observe(s));
}

/* Mobile menu */
function initMobileMenu(){
  const burger=document.getElementById('burger');
  const menu=document.getElementById('mobileMenu');
  const backdrop=document.getElementById('menuBackdrop');
  function close(){
    burger.classList.remove('open');
    menu.classList.remove('open');
    backdrop.classList.remove('open');
  }
  burger.addEventListener('click',()=>{
    const open=menu.classList.toggle('open');
    burger.classList.toggle('open',open);
    backdrop.classList.toggle('open',open);
  });
  backdrop.addEventListener('click',close);
  document.querySelectorAll('[data-nav-mobile]').forEach(a=>a.addEventListener('click',close));
}

/* Back to top */
function initToTop(){
  const btn=document.getElementById('toTop');
  window.addEventListener('scroll',()=>{
    btn.classList.toggle('show', window.scrollY>600);
  },{passive:true});
  btn.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
}

/* ---------- LETTER REPEL ---------- */
function splitToChars(el){
  const walker=(node)=>{
    node.childNodes.forEach(child=>{
      if(child.nodeType===3){
        const frag=document.createDocumentFragment();
        child.textContent.split('').forEach(ch=>{
          const s=document.createElement('span');
          s.className='ch'+(ch===' '?' sp':'');
          s.textContent=ch===' '?'\u00A0':ch;
          frag.appendChild(s);
        });
        child.replaceWith(frag);
      }else if(child.nodeType===1){
        walker(child);
      }
    });
  };
  walker(el);
}

function initRepelText(){
  const isFinePointer=window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  const targets=[document.getElementById('repelTitle'), document.getElementById('repelRole')].filter(Boolean);
  targets.forEach(t=>splitToChars(t));
  if(!isFinePointer) return;

  const chars=[];
  targets.forEach(t=>{
    t.querySelectorAll('.ch').forEach(c=>chars.push(c));
  });

  let mouseX=-9999, mouseY=-9999;
  window.addEventListener('mousemove',(e)=>{ mouseX=e.clientX; mouseY=e.clientY; });
  window.addEventListener('mouseleave',()=>{ mouseX=-9999; mouseY=-9999; });

  const RADIUS=90;
  const STRENGTH=22;

  function frame(){
    chars.forEach(c=>{
      const r=c.getBoundingClientRect();
      const cx=r.left+r.width/2;
      const cy=r.top+r.height/2;
      const dx=cx-mouseX;
      const dy=cy-mouseY;
      const dist=Math.hypot(dx,dy);
      if(dist<RADIUS){
        const force=(1-dist/RADIUS)*STRENGTH;
        const angle=Math.atan2(dy,dx);
        const tx=Math.cos(angle)*force;
        const ty=Math.sin(angle)*force;
        c.style.transform=`translate(${tx}px, ${ty}px)`;
      }else{
        c.style.transform='translate(0,0)';
      }
    });
    requestAnimationFrame(frame);
  }
  frame();
}

/* ---------- PAGE WIPE ON SECTION NAV ---------- */
function initPageWipe(){
  const wipe=document.getElementById('pageWipe');
  const links=document.querySelectorAll('a[href^="#"]');
  links.forEach(link=>{
    link.addEventListener('click',(e)=>{
      const targetId=link.getAttribute('href');
      const target=document.querySelector(targetId);
      if(!target) return;
      e.preventDefault();
      wipe.classList.add('active');
      setTimeout(()=>{
        target.scrollIntoView({behavior:'auto',block:'start'});
        wipe.classList.remove('active');
        wipe.classList.add('out');
        setTimeout(()=>{ wipe.classList.remove('out'); },520);
      },420);
    });
  });
}

/* ---------- FOOTER LIVE PING ---------- */
function initFooterPing(){
  const el=document.getElementById('lastPing');
  const messages=['viewing now','session active','connection stable'];
  let i=0;
  setInterval(()=>{
    i=(i+1)%messages.length;
    el.style.opacity='0';
    setTimeout(()=>{ el.textContent=messages[i]; el.style.transition='opacity .3s'; el.style.opacity='1'; },300);
  },4000);
}
function initSpotlight(){

    const light=document.querySelector(".spotlight");

    document.addEventListener("mousemove",(e)=>{

        light.style.left=e.clientX+"px";
        light.style.top=e.clientY+"px";

    });

}
window.addEventListener("scroll", () => {

    const nav = document.querySelector("nav");
    nav.classList.toggle("scrolled", window.scrollY > 60);

});

/* ---------- LIGHT / DARK THEME TOGGLE ---------- */
function initThemeToggle(){
  const btn=document.getElementById('themeToggle');
  if(!btn) return;

  btn.addEventListener('click',()=>{
    const isLight=document.documentElement.getAttribute('data-theme')==='light';
    if(isLight){
      document.documentElement.removeAttribute('data-theme');
      try{ localStorage.setItem('theme','dark'); }catch(e){}
    }else{
      document.documentElement.setAttribute('data-theme','light');
      try{ localStorage.setItem('theme','light'); }catch(e){}
    }
  });
}
