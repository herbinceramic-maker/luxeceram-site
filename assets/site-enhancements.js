(function(){
  document.addEventListener("DOMContentLoaded",()=>{
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
      if(n&&window.gtag)gtag("event",n,{link_url:a.href,page_location:location.href});
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