
const translations = {
  en:{home:"Home",sizes:"Sizes",about:"About Us",export:"Export",contact:"Contact",
    kicker:"Premium quality. Global trust.",hero:"We Export Luxury Tiles Worldwide",
    heroP:"LuxeCeram supplies high-quality Iranian ceramic and porcelain tiles for international projects, distributors and importers.",
    explore:"Explore Collections",whatsapp:"WhatsApp Inquiry",sizesTitle:"Explore Our Tile Sizes",
    sizesSub:"Choose a size to view its collection page and sample gallery.",
    aboutTitle:"Who We Are",aboutP:"LuxeCeram is an independent export supplier based in Iran, working directly with reputable tile manufacturers to provide competitive prices, consistent supply and reliable documentation for global buyers.",
    exportTitle:"Global Export Network",exportP:"We supply ceramic and porcelain tiles to customers across the Middle East, CIS, Europe, Africa and other international markets. We support FOB/CIF shipments, samples, packing details and export documents.",
    contactTitle:"Let’s Work Together"},
  fa:{home:"خانه",sizes:"سایزها",about:"درباره ما",export:"صادرات",contact:"تماس",
    kicker:"کیفیت ممتاز. اعتماد جهانی.",hero:"صادرات کاشی لوکس به سراسر جهان",
    heroP:"لوکس‌سرام تأمین‌کننده کاشی و سرامیک ایرانی برای پروژه‌ها، واردکنندگان و توزیع‌کنندگان بین‌المللی است.",
    explore:"مشاهده کالکشن",whatsapp:"استعلام واتساپ",sizesTitle:"سایزهای کاشی",
    sizesSub:"روی هر سایز کلیک کنید تا صفحه کالکشن و گالری نمونه‌ها باز شود.",
    aboutTitle:"درباره ما",aboutP:"LuxeCeram یک تأمین‌کننده صادراتی مستقل در ایران است که مستقیم با کارخانه‌های معتبر همکاری می‌کند.",
    exportTitle:"شبکه صادرات جهانی",exportP:"ما کاشی و سرامیک را به خاورمیانه، CIS، اروپا، آفریقا و بازارهای بین‌المللی تأمین می‌کنیم.",
    contactTitle:"با ما همکاری کنید"},
  ru:{home:"Главная",sizes:"Размеры",about:"О нас",export:"Экспорт",contact:"Контакты",
    kicker:"Премиальное качество. Глобальное доверие.",hero:"Экспортируем премиальную плитку по всему миру",
    heroP:"LuxeCeram поставляет иранскую керамическую и керамогранитную плитку для международных проектов.",
    explore:"Смотреть коллекции",whatsapp:"Запрос в WhatsApp",sizesTitle:"Размеры плитки",sizesSub:"Выберите размер для просмотра коллекции.",
    aboutTitle:"О нас",aboutP:"LuxeCeram — независимый экспортный поставщик из Ирана, работающий с надежными производителями плитки.",
    exportTitle:"Глобальная экспортная сеть",exportP:"Мы поставляем плитку на рынки Ближнего Востока, СНГ, Европы и Африки.",
    contactTitle:"Свяжитесь с нами"},
  ar:{home:"الرئيسية",sizes:"المقاسات",about:"من نحن",export:"التصدير",contact:"اتصل بنا",
    kicker:"جودة فاخرة. ثقة عالمية.",hero:"نصدر البلاط الفاخر إلى العالم",
    heroP:"توفر LuxeCeram بلاط السيراميك والبورسلان الإيراني للمشاريع والمستوردين حول العالم.",
    explore:"استكشف المجموعات",whatsapp:"استفسار واتساب",sizesTitle:"مقاسات البلاط",sizesSub:"اختر المقاس لعرض صفحة المجموعة.",
    aboutTitle:"من نحن",aboutP:"LuxeCeram مورد تصدير مستقل في إيران يعمل مباشرة مع مصانع موثوقة.",
    exportTitle:"شبكة تصدير عالمية",exportP:"نورد البلاط إلى الشرق الأوسط ورابطة الدول المستقلة وأوروبا وأفريقيا.",
    contactTitle:"لنعمل معاً"},
  es:{home:"Inicio",sizes:"Formatos",about:"Nosotros",export:"Exportación",contact:"Contacto",
    kicker:"Calidad premium. Confianza global.",hero:"Exportamos azulejos de lujo al mundo",
    heroP:"LuxeCeram suministra azulejos cerámicos y porcelánicos iraníes para proyectos internacionales.",
    explore:"Ver colecciones",whatsapp:"Consulta WhatsApp",sizesTitle:"Formatos de azulejos",sizesSub:"Elija un formato para ver su colección.",
    aboutTitle:"Quiénes somos",aboutP:"LuxeCeram es un proveedor exportador independiente de Irán que trabaja con fabricantes confiables.",
    exportTitle:"Red global de exportación",exportP:"Suministramos azulejos a Oriente Medio, CIS, Europa, África y otros mercados.",
    contactTitle:"Trabajemos juntos"},
  tr:{home:"Ana Sayfa",sizes:"Ebatlar",about:"Hakkımızda",export:"İhracat",contact:"İletişim",
    kicker:"Premium kalite. Global güven.",hero:"Lüks karoları dünyaya ihraç ediyoruz",
    heroP:"LuxeCeram, uluslararası projeler için İran seramik ve porselen karoları tedarik eder.",
    explore:"Koleksiyonları İncele",whatsapp:"WhatsApp Talep",sizesTitle:"Karo Ebatları",sizesSub:"Koleksiyon sayfasını görmek için bir ebat seçin.",
    aboutTitle:"Biz Kimiz",aboutP:"LuxeCeram, İran merkezli bağımsız bir ihracat tedarikçisidir.",
    exportTitle:"Global İhracat Ağı",exportP:"Orta Doğu, BDT, Avrupa, Afrika ve diğer pazarlara karo tedarik ediyoruz.",
    contactTitle:"Birlikte Çalışalım"}
};
function setLang(lang){
  const t = translations[lang] || translations.en;
  document.documentElement.lang = lang;
  document.documentElement.dir = (lang==="fa"||lang==="ar") ? "rtl" : "ltr";
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const key = el.getAttribute("data-i18n");
    if(t[key]) el.textContent = t[key];
  });
  localStorage.setItem("luxeceram_lang", lang);
}
document.addEventListener("DOMContentLoaded",()=>{
  const saved = localStorage.getItem("luxeceram_lang") || "en";
  const sel = document.getElementById("language");
  if(sel){ sel.value = saved; sel.addEventListener("change", e=>setLang(e.target.value));}
  setLang(saved);
});
