import{_ as ee}from"./F94cZVX_.js";import{_ as te,v as n,q as se,s as le,k as oe,A as ae,L as ne,c as d,a as f,j as v,I as _,F as $,G as Y,r as ie,o as r,N as D,b as re,w as ue,t as z,e as ce,H as G,J,g as de}from"./1WCwrkPV.js";import"./we9peZHj.js";const fe={class:"page"},he=["data-slug","data-tags"],ye={key:0},ge={key:1},me={key:2},ve=["onClick"],_e={__name:"index",async setup(we){var W;let w,T;const{$gsap:u}=de(),p=n(null),{data:K}=([w,T]=se(()=>ie({query:'page("photography")',select:{id:!0,title:!0,tags:!0,intendedTemplate:!0,subheadline:!0,children:{query:"page.children.listed",select:{id:!0,title:!0,tags:!0,client:!0,credit:!0,color:!0,cover:{query:"page.content.cover.toFile",select:{url:!0,alt:!0,height:!0,width:!0}},image:{query:'page.images.sortBy("sort", "asc").first',select:{url:!0,alt:!0,height:!0,width:!0}}}}}})),w=await w,T(),w),h=(W=K.value)==null?void 0:W.result;le(h);const B=n([]);h.children&&h.children.forEach(s=>{typeof s.tags=="string"&&s.tags.split(",").map(t=>t.trim()).forEach(t=>{t&&!B.value.includes(t)&&B.value.push(t)})}),n([]),n([]);const P=n(!1),y=n([]),g=n(null);n(null);const i=n(null),C=n(!1),O=n(null),X=n(null),A=n(null),E=n(!1);(()=>{if(h.children){const s=h.children,a=s.filter((l,c)=>c%2===0).reverse(),t=s.filter((l,c)=>c%2!==0).reverse();let o=0,e=0;for(let l=0;l<s.length;l++)l==0&&(y.value.unshift({...t[0],isClone:!0}),t.shift(),s.length%2!==0&&t.push(s[0])),y.value.push(s[l]),(l+1)%2===0&&(o<a.length&&(y.value.push({...a[o],isClone:!0}),o++),e<t.length&&(y.value.push({...t[e],isClone:!0}),e++))}})();const U=s=>{const a=g.value.querySelectorAll(".project"),t=u.timeline();p.value===s?(p.value=null,a.forEach(o=>{t.to(".projects",{scale:1,duration:.01},0),t.to(o,{scale:1,opacity:1,duration:.2},0)}),u.set(".page",{height:"auto",onComplete:()=>{E.value=!0}})):(p.value=s,a.forEach(o=>{var l;const e=((l=o.getAttribute("data-tags"))==null?void 0:l.split(",").map(c=>c.trim()))||[];u.set(o,{transformOrigin:"top"}),u.to(".projects",{scale:.65,duration:.001},0),E.value==!1&&u.set(".page",{height:document.querySelector(".projects").getBoundingClientRect().height*.65,onComplete:()=>{E.value=!0}}),t.to(".project",{scale:.65,duration:.2},0),e.includes(s)?(t.to(o,{opacity:1,duration:.2},0),t.to(".project.clone",{opacity:.2,duration:.2},0)):(t.to(o,{opacity:.2,duration:.2},0),t.to(".project.clone",{opacity:.2,duration:.2},0))}))},L=()=>{C.value=!C.value};oe(C,s=>{var a,t;s?(a=document.querySelector("body"))==null||a.classList.add("infos-is-active"):(t=document.querySelector("body"))==null||t.classList.remove("infos-is-active")});const N=["#8c03fc","#FE6000","#9F91C7","#5EC76A","#8ae6f2","#ff0a64"],Z=()=>{const s=Math.floor(Math.random()*N.length);return N[s]},j=()=>{const s=document.querySelector("header"),a=Z();s&&(s.style.color=a,s.style.transition="color 0.5s ease");const t=document.querySelector(".filters"),o=document.querySelector(".about-content");o&&(o.style.color=a,o.style.transition="color 0.5s ease"),t&&(t.style.color=a,t.style.transition="color 0.5s ease");const e=document.querySelector(".button-images-infos");e&&(e.style.color=a,e.style.transition="color 0.5s ease")};return ae(()=>{P.value=!0,j()}),ne((s,a,t)=>{if(window.innerWidth>=720){if(g.value.classList.add("pointer-event-none"),s.name.startsWith("photography")){const e=g.value.querySelector(`[data-slug="${s.params.id[0]}"]:not(.clone)`),l=e.querySelector("img").getBoundingClientRect(),c=g.value.querySelectorAll(".project");i.value=e.querySelector(".high-quality").cloneNode(!0),i.value.style.position="absolute",i.value.style.top=`${l.top+window.scrollY}px`,i.value.style.left=`${l.left}px`,i.value.style.width=`${l.width}px`,i.value.style.height=`${l.height}px`,i.value.style.zIndex="10",i.value.style.opacity="1",i.value.classList.add("transition-clone"),document.body.appendChild(i.value),c.forEach(m=>{m!==e.closest(".project")&&u.to(m,{opacity:0,duration:.15})}),e.querySelector(".low-quality")&&(u.set(".low-quality",{opacity:0}),u.set(e.querySelector(".high-quality"),{opacity:1}));const q=window.innerWidth>=720?200:20,k=(window.innerWidth-q)/l.width,x=window.innerHeight/l.height,S=Math.min(k,x),I=window.innerWidth/2-(l.left+l.width/2),b=window.innerHeight/2-(l.top+l.height/2);var o=u.timeline();o.to(e.querySelector("img:not(.transition-clone)"),{opacity:0}),o.to(i.value,{duration:.5,x:I,y:b,scale:S,ease:"slow(0.7,0.7,false)",onComplete:()=>{window.scrollTo(0,0),u.set(i.value,{top:l.top}),t()}},"-=80%")}}else t()}),(s,a)=>{const t=ee,o=ce;return r(),d($,null,[f("button",{class:"button-images-infos",onClick:L},"Image infos"),v(C)?(r(),d("div",{key:0,class:"overlay-bg",onClick:L,onMouseenter:L},null,32)):_("",!0),f("div",fe,[v(P)?(r(),d("ul",{key:0,class:"projects",ref_key:"projects",ref:g},[(r(!0),d($,null,Y(v(y),(e,l)=>(r(),d("li",{key:l,"data-slug":`${e.id.split("/")[1]}`,"data-tags":e.tags,class:D(["project",{clone:e.isClone,"pointer-events-none":e.isClone}])},[re(o,{to:`/${e.id}`},{default:ue(()=>{var c,q,k,x,S,I,b,m,R,F,H,M,Q,V;return[f("figure",{ref_for:!0,ref_key:"imageWrapper",ref:O,style:G(`width: 100%; position: relative;padding-top: ${((c=e==null?void 0:e.image)==null?void 0:c.height)/((q=e==null?void 0:e.image)==null?void 0:q.width)*100}%`)},[e.isClone?(r(),J(t,{key:0,"is-preload":!1,"is-loading":!0,ref_for:!0,ref_key:"lazyImage",ref:A,src:((k=e==null?void 0:e.cover)==null?void 0:k.url)??((x=e==null?void 0:e.images)==null?void 0:x[0].url),lowQualitySrc:(S=e==null?void 0:e.cover)==null?void 0:S.url,alt:((I=e==null?void 0:e.cover)==null?void 0:I.alt)??((m=(b=e==null?void 0:e.images)==null?void 0:b[0])==null?void 0:m.alt),sizes:"20vw sm:20vw md:25vw lg:25vw xl:25vw"},null,8,["src","lowQualitySrc","alt"])):(r(),J(t,{key:1,"is-preload":!0,"is-loading":!1,ref_for:!0,ref_key:"lazyImage",ref:A,src:((R=e==null?void 0:e.cover)==null?void 0:R.url)??((F=e==null?void 0:e.images)==null?void 0:F[0].url),lowQualitySrc:(H=e==null?void 0:e.cover)==null?void 0:H.url,alt:((M=e==null?void 0:e.cover)==null?void 0:M.alt)??((V=(Q=e==null?void 0:e.images)==null?void 0:Q[0])==null?void 0:V.alt),sizes:"25vw sm:25vw md:30vw lg:30vw xl:30vw"},null,8,["src","lowQualitySrc","alt"])),f("figcaption",{class:"caption",style:G({color:e.color})},[e.title?(r(),d("div",ye," Projet: "+z(e.title),1)):_("",!0),e.client?(r(),d("div",ge," Client: "+z(e.client),1)):_("",!0),e.credit?(r(),d("div",me," Crédit photo: "+z(e.credit),1)):_("",!0)],4)],4)]}),_:2},1032,["to"])],10,he))),128))],512)):_("",!0),f("div",{class:"filters",ref_key:"filters",ref:X},[f("ul",null,[(r(!0),d($,null,Y(v(B),e=>(r(),d("li",{key:e,onClick:l=>U(e),class:D({active:v(p)===e})},z(e),11,ve))),128))])],512)])],64)}}},xe=te(_e,[["__scopeId","data-v-be09ec56"]]);export{xe as default};
