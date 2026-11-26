(function(){
  document.addEventListener("DOMContentLoaded",()=>{

    // Floating return-to-top control; independent of existing navigation.
    const topButton=document.createElement("button");
    topButton.type="button";
    topButton.className="luxe-back-to-top";
    topButton.setAttribute("aria-label","Back to top");
    topButton.title="Back to top";
    topButton.hidden=true;
    topButton.innerHTML=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>`;
    document.body.appendChild(topButton);
    const updateTopButton=()=>{topButton.hidden=window.scrollY<260;};
    window.addEventListener("scroll",updateTopButton,{passive:true});
    topButton.addEventListener("click",()=>window.scrollTo({top:0,behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"}));
    updateTopButton();

    const routes={ru:"/ru/blog/",ar:"/ar/blog/",tr:"/tr/blog/"};
    const syncBlogNav=()=>{
      const lang=localStorage.getItem("luxeceram_lang")||"en";
      document.querySelectorAll("[data-blog-nav]").forEach(a=>a.href=routes[lang]||"/blog/");
    };
    syncBlogNav();
    document.getElementById("language")?.addEventListener("change",()=>setTimeout(syncBlogNav));
    document.addEventListener("click",e=>{
      const a=e.target.closest("a"); if(!a)return;
      let n=a.dataset.kaiEvent||"";
      if(!n&&a.href.includes("wa.me"))n="whatsapp_click";
      if(!n&&a.href.startsWith("mailto:"))n="email_click";
      // whatsapp_click and article_contact are owned by kai-retargeting-events.js
      // so GA4 receives one canonical B2B conversion event per physical click.
      if(n&&n!=="whatsapp_click"&&n!=="article_contact"&&window.gtag)gtag("event",n,{link_url:a.href,page_location:location.href});
    });
    const image=document.querySelector('meta[property="og:image"]')?.content||"https://luxeceram.com/assets/about.jpg";
    const logo={"@type":"ImageObject","url":"https://luxeceram.com/assets/logo.png"};
    const patch=x=>{
      if(Array.isArray(x)){x.forEach(patch);return;}
      if(!x||typeof x!=="object")return;
      const types=new Set(Array.isArray(x["@type"])?x["@type"]:[x["@type"]].filter(Boolean));
      if((types.has("Article")||types.has("BlogPosting"))&&!x.image)x.image=image;
      if(types.has("Organization")&&/luxeceram/i.test(String(x.name||""))&&!x.logo)x.logo=logo;
      Object.values(x).forEach(v=>{if(v&&typeof v==="object")patch(v);});
    };
    document.querySelectorAll('script[type="application/ld+json"]').forEach(s=>{
      try{const data=JSON.parse(s.textContent);patch(data);s.textContent=JSON.stringify(data);}catch(_){}
    });
  });
})();