!function(){const t=document.getElementById("nav-pattern"),e=t.getContext("2d"),n=document.querySelector("#nav-dots > ol"),o=n.children,i={classes:{dot_focus:"focus",dot_wrong:"wrong",nav_small:"small"},colors:{default:"white",wrong:"rgb(255, 140, 140)"},pattern:{three_dot_lines:[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]],valid_patterns:[{valid_pattern:541263789,link:"/projects"},{valid_pattern:183526794,link:"/projects/pattern"}],wrong_timeout_ms:1e3}};let l=null;const r=[0,0,0,0,0,0,0,0,0],s=[0,0,0,0,0,0,0,0,0];let u=0,f=null,a=0,c=i.colors.default,d=!1,h=0,g=0;const m=[],w=[!1,!1,!1,!1,!1,!1,!1,!1,!1];function v(){let t=n.getBoundingClientRect(),e=Math.floor((t.left+t.right)/2),o=Math.floor((t.top+t.bottom)/2);for(let n=0;n<3;n++)r[3*n]=t.left,r[3*n+1]=e,r[3*n+2]=t.right,s[n]=t.top,s[3+n]=o,s[6+n]=t.bottom;u=Math.floor(.18*(t.right-t.left)),a=Math.floor(.025*(t.right-t.left))}function p(t=0,e=!0){e?o[t].classList.add(i.classes.dot_focus):o[t].classList.remove(i.classes.dot_focus)}function _(t=0,e=!0){e?o[t].classList.add(i.classes.dot_wrong):o[t].classList.remove(i.classes.dot_wrong)}function L(){e.clearRect(0,0,t.offsetWidth,t.offsetHeight),e.lineWidth=a,e.strokeStyle=c,e.lineCap="round",e.lineJoin="round",function(){if(!(m.length<=1)){e.beginPath(),e.moveTo(r[m[0]],s[m[0]]);for(let t=1;t<m.length;t++)e.lineTo(r[m[t]],s[m[t]]);e.stroke()}}(),d&&function(){if(0===m.length)return;e.beginPath();let t=m[m.length-1];e.moveTo(r[t],s[t]),e.lineTo(h,g),e.stroke()}()}function A(){w.fill(!1),m.splice(0,m.length);for(let t=0;t<9;t++)t!==f&&p(t,!1),_(t,!1);c=i.colors.default,null!==l&&(clearTimeout(l),l=null)}function b(t=0){if(!w[t]){if(m.length>0){let e=m[m.length-1];for(let n of i.pattern.three_dot_lines)if(!w[n[1]]&&(t===n[0]&&e===n[2]||t===n[2]&&e===n[0])){w[n[1]]=!0,m.push(n[1]),p(n[1],!0);break}}w[t]=!0,m.push(t),p(t,!0)}}function E(){let t=m.reduce(((t,e)=>10*t+(e+1)),0);for(let{valid_pattern:e,link:n}of i.pattern.valid_patterns)if(t===e)return n;return null}function q(t=0,e=0){d||(h=t,g=e,A(),null!==f&&(d=!0,b(f)),window.requestAnimationFrame(L))}function k(t=0,e=0){h=t,g=e;let n=function(t=0,e=0){for(let n=0;n<9;n++){let o=t-r[n],i=e-s[n];if(o*o+i*i<u*u)return n}return null}(h,g);null!==f&&f!==n&&(w[f]||p(f,!1),f=null),null!==n&&null===f&&(p(n,!0),d&&!w[n]&&b(n),f=n),d&&window.requestAnimationFrame(L)}function F(){if(!d)return;if(d=!1,m.length<=1)return A(),void window.requestAnimationFrame(L);let t=E();null===t?(!function(){for(let t=0;t<9;t++)w[t]&&_(t,!0);c=i.colors.wrong}(),l=setTimeout((()=>{A(),window.requestAnimationFrame(L)}),i.pattern.wrong_timeout_ms)):window.location.href=t,window.requestAnimationFrame(L)}t.addEventListener("mousedown",(function(t){q(t.offsetX,t.offsetY)})),t.addEventListener("touchstart",(function(t){q(t.touches[0].clientX,t.touches[0].clientY)})),t.addEventListener("mousemove",(function(t){k(t.offsetX,t.offsetY)})),t.addEventListener("touchmove",(function(t){q(t.touches[0].clientX,t.touches[0].clientY)})),t.addEventListener("mouseup",(function(t){F()})),t.addEventListener("touchend",(function(t){F()})),window.addEventListener("load",(function(e){t.setAttribute("width",t.offsetWidth.toString()),t.setAttribute("height",t.offsetHeight.toString()),v(),window.requestAnimationFrame(L)})),window.addEventListener("resize",(function(e){t.setAttribute("width",t.offsetWidth.toString()),t.setAttribute("height",t.offsetHeight.toString()),v(),window.requestAnimationFrame(L)}))}();
//# sourceMappingURL=index.2d566790.js.map
