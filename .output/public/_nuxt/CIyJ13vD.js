import{_ as A}from"./we9peZHj.js";import{m as B,v as u,o as f,c as L,b as C,w as R,a as O,N as V,e as X,_ as I,Q as z,q as T,r as F,M as J,j as t,J as N,I as k,g as K}from"./1WCwrkPV.js";const M=B({__name:"Project",props:{project:{},excerpt:{type:Boolean},isLeft:{type:Boolean},width:{},height:{}},setup(P){return u(null),u(null),(a,g)=>{var p;const l=A,w=X;return f(),L("article",{ref:`${a.isLeft?"prev":"next"}`,class:V(`${a.isLeft?"project-excerpt__left":"project-excerpt__right"} project-excerpt`)},[C(w,{to:`/${(p=a.project)==null?void 0:p.id}`},{default:R(()=>[O("figure",null,[C(l,{"data-width":a.width,"data-height":a.height,format:"webp",preload:!0,sizes:"400px sm:600px md:600px lg:500px xl:800px",quality:"80",src:a.project.cover.url??a.project.images[0].url,alt:""},null,8,["data-width","data-height","src"])])]),_:1},8,["to"])],2)}}}),Q=I(M,[["__scopeId","data-v-34b40edd"]]),U=B({__name:"NavProject",async setup(P){var x,E;let a,g;const{$gsap:l,$ScrollTrigger:w}=K(),p=z().value,{data:S}=([a,g]=T(()=>F({query:'page("photography")',select:{id:!0,title:!0,tags:!0,intendedTemplate:!0,subheadline:!0,children:{query:"page.children.listed",select:{id:!0,title:!0,url:!0,cover:{query:"page.content.cover.toFile",select:{url:!0,alt:!0,height:!0,width:!0}}}}}})),a=await a,g(),a),r=(E=(x=S.value)==null?void 0:x.result)==null?void 0:E.children,n=r==null?void 0:r.findIndex(({id:h})=>h===(p==null?void 0:p.id)),_=u(null),y=u(null),o=u(null),m=u(null),i=u(null);return J((h,W,d)=>{if(n>0&&h.fullPath=="/"+r[n-1].id&&window.innerWidth>1023){_.value.$el.getBoundingClientRect().width;const s=_.value.$el,c=(window.innerWidth-100)*.5;m.value=s.cloneNode(!0),m.value.classList.add("transition-nav-clone"),document.body.appendChild(m.value),o.value.parentElement.classList.add("is-transitionning"),document.body.style.scrollbarWidth="none",l.to("header",{opacity:0}),l.to(".infos",{opacity:0});var e=l.timeline({duration:.3});e.to(o.value.parentElement,{scale:.5}),e.to(o.value.parentElement,{x:c}),e.to(s,{scale:2}),e.to(o.value.parentElement.querySelector("figure"),{transformOrigin:"left"},"-=100%"),e.to(o.value.parentElement.querySelector("figure"),{scale:2},"-=100%"),e.to(o.value.parentElement.querySelector("figure"),{opacity:0}),e.to(m.value,{opacity:1,onComplete:d})}else if(n>=0&&h.fullPath=="/"+r[n+1].id&&window.innerWidth>1023){const s=y.value.$el.getBoundingClientRect().width,c=y.value.$el,v=(window.innerWidth+100)*.5;i.value=c.cloneNode(!0),i.value.style.width=`${s}px`,i.value.setAttribute("style","transform: translateX(0) !important; margin-left: 0 !important;"),i.value.style.opacity="0",i.value.classList.add("transition-nav-clone"),document.body.appendChild(i.value),o.value.parentElement.classList.add("is-transitionning"),document.body.style.scrollbarWidth="none",l.to(".infos",{opacity:0}),l.to("header",{opacity:0}),l.set(o.value.parentElement,{transformOrigin:"center center"});var e=l.timeline({duration:.3});e.to(o.value.parentElement,{scale:.5}),e.to(o.value.parentElement,{x:-v}),e.to(c,{scale:2}),e.to(o.value.parentElement.querySelector("figure"),{transformOrigin:"right"},"-=100%"),e.to(o.value.parentElement.querySelector("figure"),{scale:2},"-=100%"),e.to(o.value.parentElement.querySelector("figure"),{opacity:0}),e.to(i.value,{opacity:1,onComplete:d})}else d()}),(h,W)=>{var e,s,c,v,j,b,q,$;const d=Q;return f(),L("nav",{class:"next-prev",ref_key:"navEl",ref:o},[t(n)!==void 0&&t(n)>0?(f(),N(d,{key:0,ref_key:"prevEl",ref:_,project:t(r)[t(n)-1],excerpt:!1,"is-left":!0,width:(s=(e=t(r)[t(n)-1])==null?void 0:e.cover)==null?void 0:s.width,height:(v=(c=t(r)[t(n)-1])==null?void 0:c.cover)==null?void 0:v.height},null,8,["project","width","height"])):k("",!0),t(n)!==void 0&&t(n)<t(r).length-1?(f(),N(d,{key:1,ref_key:"nextEl",ref:y,project:t(r)[t(n)+1],excerpt:!1,width:(b=(j=t(r)[t(n)-1])==null?void 0:j.cover)==null?void 0:b.width,height:($=(q=t(r)[t(n)-1])==null?void 0:q.cover)==null?void 0:$.height},null,8,["project","width","height"])):k("",!0)],512)}}}),H=I(U,[["__scopeId","data-v-54ecee73"]]);export{H as default};
