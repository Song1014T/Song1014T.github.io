var titleTime,OriginTitile=document.title;document.addEventListener("visibilitychange",(function(){document.hidden?(document.title="🍥别离开我~",clearTimeout(titleTime)):(document.title="🦄嘿嘿!抓到你啦～",titleTime=setTimeout((function(){document.title=OriginTitile}),2e3))}));