/* Portfolio data — owner-editable. Real items only. Empty lists show honest empty states.
   posts: manual registration of social posts (no scraping). Each: {id,platform,url,thumb,caption:{fa,en},date:"YYYY-MM-DD",type,project,skills:[],urls:[]}
   articles: {id,title:{fa,en},summary:{fa,en},cover,cat,date,tags:[],url}
   cases: project case studies {id,title:{fa,en},cats:[...],cover,overview,role,year,tools:[],process,output,related:[]}
   extraCats: {galleryId:[extra discipline ids]} to put one work into several disciplines. */
window.PORTFOLIO = {
  disciplines: [
    { id: "film", fa: "فیلم و سینما", en: "Film & Cinema", gal: [] },
    { id: "video", fa: "ویدیو و پس‌تولید", en: "Video & Post-Production", gal: [] },
    { id: "graphic", fa: "طراحی گرافیک", en: "Graphic Design", gal: ["poster", "academy", "banner", "brand", "print"] },
    { id: "photo", fa: "عکاسی و هنر", en: "Photography & Art", gal: [] },
    { id: "web", fa: "وب و فناوری", en: "Web & Technology", gal: [] },
    { id: "content", fa: "تولید محتوای خلاقانه", en: "Creative Content", gal: [] },
    { id: "writing", fa: "نویسندگی و پژوهش", en: "Writing & Research", gal: [] }
  ],
  toolDisc: { Pr: "video", Ae: "video", Dr: "video", Ps: "graphic", Ai: "graphic" },
  extraCats: {},
  selected: [],
  cases: [],
  posts: [],
  articles: []
};
