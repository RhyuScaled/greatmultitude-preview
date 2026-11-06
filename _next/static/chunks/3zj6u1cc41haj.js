(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,49931,e=>{"use strict";var t=e.i(43476),a=e.i(71645);let r=`#version 300 es
precision highp float;

layout(location = 0) in vec2 aCorner;
layout(location = 1) in vec4 aMotion;
layout(location = 2) in vec2 aState;

uniform vec2 uResolution;
uniform float uSize;
uniform float uSwell;
uniform float uStretch;
uniform float uGlow;

out vec2 vLocal;
out vec2 vPoint;
out float vLength;
out float vRadius;
out float vEnergy;

void main() {
  float energy = aState.x;
  float radius = 0.5 * uSize * aState.y * (1.0 + uSwell * energy);
  float speed = length(aMotion.zw);
  float angle = speed > 0.001 ? atan(aMotion.w, aMotion.z) : 0.0;
  float axis = floor(angle / 1.5707963 + 0.5) * 1.5707963;
  angle = axis + (angle - axis) * smoothstep(8.0, 70.0, speed);
  vec2 dir = vec2(cos(angle), sin(angle));
  float halfLength = min(uSize * 2.0, speed * uStretch * 0.02);
  float pad = radius * (1.0 + uGlow * energy * 2.5) + 2.0;
  vec2 local = aCorner * vec2(halfLength + pad, pad);
  vec2 point = aMotion.xy + dir * local.x + vec2(-dir.y, dir.x) * local.y;
  vLocal = local;
  vPoint = point;
  vLength = halfLength;
  vRadius = radius;
  vEnergy = energy;
  vec2 clip = point / uResolution * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
}
`,n=`#version 300 es
precision highp float;

in vec2 vLocal;
in vec2 vPoint;
in float vLength;
in float vRadius;
in float vEnergy;

uniform vec2 uResolution;
uniform vec3 uBase;
uniform vec3 uActive;
uniform float uGlow;
uniform float uOpacity;
uniform float uFade;
uniform int uShape;

out vec4 outColor;

float smootherstep01(float t) {
  t = clamp(t, 0.0, 1.0);
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

void main() {
  float d;
  if (uShape == 1) {
    float corner = vRadius * 0.3;
    vec2 q = abs(vLocal) - vec2(vLength + vRadius, vRadius) + corner;
    d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - corner;
  } else {
    d = length(vec2(max(abs(vLocal.x) - vLength, 0.0), vLocal.y)) - vRadius;
  }
  float aa = max(fwidth(d), 0.0001);
  float body = clamp(0.5 - d / aa, 0.0, 1.0);
  float halo = uGlow * vEnergy * 0.5 * exp(-max(d, 0.0) / max(vRadius * 1.3, 0.6));
  float alpha = body + (1.0 - body) * halo;
  vec3 color = mix(uBase, uActive, clamp(vEnergy * 1.2, 0.0, 1.0));
  float fade = 1.0;
  if (uFade > 0.0) {
    vec2 edge = min(vPoint, uResolution - vPoint) / (uFade * 0.4 * min(uResolution.x, uResolution.y));
    fade = smootherstep01(edge.x) * smootherstep01(edge.y);
  }
  alpha *= uOpacity * fade;
  outColor = vec4(color * alpha, alpha);
}
`,o=e=>{let t=/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(String(e).trim());if(!t)return[1,1,1];let a=3===t[1].length?t[1].replace(/./g,e=>e+e):t[1];return[0,2,4].map(e=>parseInt(a.slice(e,e+2),16)/255)},i=e=>{let t=Math.min(1,Math.max(0,e));return t*t*t*(t*(6*t-15)+10)},l=e=>{let t=e-1;return 1+t*t*(2.9*t+1.9)},u=(e,t,a)=>{let r=e.createShader(t);return e.shaderSource(r,a),e.compileShader(r),r};e.s(["default",0,({dotSize:e=5,gap:c=18,baseColor:h="#3a3446",activeColor:f="#ffffff",proximity:s=140,strength:d=1,bounce:m=.6,tension:v=.4,returnDuration:p=.8,shockRadius:y=320,shockStrength:x=5,swell:w=.8,stretch:g=.5,glow:A=.5,shape:M="circle",fade:R=0,opacity:b=1,intro:F=!0,mouseInteraction:S=!0,clickShock:E=!0,paused:L=!1,dpr:B,className:P="",style:_})=>{let O=(0,a.useRef)(null),T=(0,a.useRef)(null),C={dotSize:e,gap:c,baseColor:h,activeColor:f,proximity:s,strength:d,bounce:m,tension:v,returnDuration:p,shockRadius:y,shockStrength:x,swell:w,stretch:g,glow:A,shape:M,fade:R,opacity:b,intro:F,mouseInteraction:S,clickShock:E,paused:L,dpr:B},I=(0,a.useRef)(C);return(0,a.useLayoutEffect)(()=>{I.current=C}),(0,a.useEffect)(()=>{let e=O.current;if(!e)return;let t=e.getContext("webgl2",{alpha:!0,premultipliedAlpha:!0,antialias:!1});if(!t)return;let a=t.createProgram();if(t.attachShader(a,u(t,t.VERTEX_SHADER,r)),t.attachShader(a,u(t,t.FRAGMENT_SHADER,n)),t.linkProgram(a),!t.getProgramParameter(a,t.LINK_STATUS))return;let c={};for(let e of["uResolution","uSize","uSwell","uStretch","uGlow","uBase","uActive","uOpacity","uFade","uShape"])c[e]=t.getUniformLocation(a,e);let h=t.createVertexArray();t.bindVertexArray(h);let f=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,f),t.bufferData(t.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),t.STATIC_DRAW),t.enableVertexAttribArray(0),t.vertexAttribPointer(0,2,t.FLOAT,!1,0,0);let s=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,s),t.enableVertexAttribArray(1),t.vertexAttribPointer(1,4,t.FLOAT,!1,24,0),t.vertexAttribDivisor(1,1),t.enableVertexAttribArray(2),t.vertexAttribPointer(2,2,t.FLOAT,!1,24,16),t.vertexAttribDivisor(2,1),t.bindVertexArray(null);let d=window.matchMedia("(prefers-reduced-motion: reduce)").matches,m={width:0,height:0,left:0,top:0,ratio:1},v={count:0,cols:1,rows:1,cell:1,centerX:0,centerY:0,reach:1},p=new Float32Array(0),y=new Float32Array(0),x=new Float32Array(0),w=new Float32Array(0),g=new Float32Array(0),A=new Float32Array(0),M=new Float32Array(0),R=new Float32Array(0),b={x:0,y:0,vx:0,vy:0,time:0,inside:!1,presence:0},F=[],S=I.current.intro&&!d?-1:null,E=!0,L=0,B=0,P=()=>{let{dotSize:e,gap:a}=I.current,r=Math.max(2,e+a),n=Math.max(1,Math.floor((m.width+a)/r)),o=Math.max(1,Math.floor((m.height+a)/r)),i=(m.width-(n*r-a))/2+e/2,l=(m.height-(o*r-a))/2+e/2,u=n*o;p=new Float32Array(2*u),y=new Float32Array(2*u),x=new Float32Array(2*u),w=new Float32Array(2*u),g=new Float32Array(2*u),A=new Float32Array(4*u),M=new Float32Array(u),R=new Float32Array(6*u);for(let e=0;e<o;e++)for(let t=0;t<n;t++){let a=(e*n+t)*2;p[a]=i+t*r,p[a+1]=l+e*r}Object.assign(v,{count:u,cols:n,rows:o,cell:r,centerX:m.width/2,centerY:m.height/2,reach:Math.hypot(m.width,m.height)/2}),t.bindBuffer(t.ARRAY_BUFFER,s),t.bufferData(t.ARRAY_BUFFER,R.byteLength,t.DYNAMIC_DRAW)},_=()=>{let t=e.getBoundingClientRect(),a=Math.min(I.current.dpr??window.devicePixelRatio??1,2),r=Math.max(1,Math.round(t.width)),n=Math.max(1,Math.round(t.height));Object.assign(m,{width:r,height:n,left:t.left,top:t.top,ratio:a}),e.width=Math.round(r*a),e.height=Math.round(n*a),P(),C(performance.now())},C=r=>{let n=I.current,u=Math.max(1,n.proximity),f=(null===S?1/0:S<0?0:(r-S)/1e3)*v.reach*1.25,w=4*v.cell;for(let e=0;e<v.count;e++){let t=2*e,a=4*e,r=p[t]+y[t]+A[a],n=p[t+1]+y[t+1]+A[a+1],o=M[e];if(b.presence>.001){let e=Math.hypot(r-b.x,n-b.y);e<u&&(o=Math.max(o,.4*i(1-e/u)*b.presence))}let c=1;if(null!==S){let e=Math.min(1,Math.max(0,(f-Math.hypot(p[t]-v.centerX,p[t+1]-v.centerY))/w));c=e>=1?1:Math.max(0,l(e)),o=Math.max(o,.6*Math.sin(e*Math.PI))}let h=6*e;R[h]=r,R[h+1]=n,R[h+2]=x[t]+A[a+2],R[h+3]=x[t+1]+A[a+3],R[h+4]=o,R[h+5]=c}let g=o(n.baseColor),F=o(n.activeColor);t.viewport(0,0,e.width,e.height),t.clearColor(0,0,0,0),t.clear(t.COLOR_BUFFER_BIT),t.enable(t.BLEND),t.blendFunc(t.ONE,t.ONE_MINUS_SRC_ALPHA),t.useProgram(a),t.uniform2f(c.uResolution,m.width,m.height),t.uniform1f(c.uSize,Math.max(.5,n.dotSize)),t.uniform1f(c.uSwell,d?0:Math.max(0,n.swell)),t.uniform1f(c.uStretch,d?0:Math.max(0,n.stretch)),t.uniform1f(c.uGlow,Math.max(0,n.glow)),t.uniform3f(c.uBase,g[0],g[1],g[2]),t.uniform3f(c.uActive,F[0],F[1],F[2]),t.uniform1f(c.uOpacity,Math.min(1,Math.max(0,n.opacity))),t.uniform1f(c.uFade,Math.min(1,Math.max(0,n.fade))),t.uniform1i(c.uShape,+("square"===n.shape)),t.bindVertexArray(h),t.bindBuffer(t.ARRAY_BUFFER,s),t.bufferSubData(t.ARRAY_BUFFER,0,R),t.drawArraysInstanced(t.TRIANGLE_STRIP,0,4,v.count),t.bindVertexArray(null)},U=e=>{if(L=0,I.current.paused||!E)return;null!==S&&S<0&&(S=e);let t=Math.min(.05,(e-B)/1e3||0);B=e,((e,t)=>{let a=I.current,r=+!d,n=1-.85*Math.min(1,Math.max(0,a.bounce)),o=4/(n*Math.max(.2,a.returnDuration)),l=o*o,u=2*n*o,c=Math.max(1,a.proximity),h=Math.hypot(b.vx,b.vy),f=a.mouseInteraction&&b.inside?6500*Math.tanh(h/900)*a.strength*r:0,s=h>.001?b.vx/h:0,m=h>.001?b.vy/h:0,R=1.4*v.cell,S=F.map(e=>{let n=(t-e.start)/1e3*650,o=i(1-n/Math.max(1,a.shockRadius));return{...e,front:n,amplitude:o*a.shockStrength*v.cell*.24*r}}),E=(900*Math.max(0,a.tension))**2/(v.cell*v.cell),L=.06*Math.sqrt(E),B=Math.min(24,Math.max(1,Math.ceil(e/Math.min(1/120,1.2/(Math.sqrt(l+8*E)+u+8*L))))),P=e/B;for(let e=0;e<v.count;e++){let t=2*e,a=p[t],r=p[t+1],n=0,o=0;if(f>0){let e=a+y[t]-b.x,l=r+y[t+1]-b.y,u=Math.hypot(e,l);if(u<c){let t=i(1-u/c)*f,a=u>.001?e/u:0,r=u>.001?l/u:0;n+=t*(s+.6*a),o+=t*(m+.6*r)}}let u=0,h=0,d=0,v=0;for(let e of S){if(e.amplitude<=0)continue;let t=a-e.x,i=r-e.y,c=Math.hypot(t,i),f=(c-e.front)/R;if(3>Math.abs(f)&&c>.001){let a=t/c,r=i/c,s=Math.exp(-f*f),m=e.amplitude*s,p=2*e.amplitude*f*s/R*650;u+=a*m,h+=r*m,d+=a*p,v+=r*p,n+=a*m*l*.35,o+=r*m*l*.35}}w[t]=n,w[t+1]=o;let x=4*e;A[x]=u,A[x+1]=h,A[x+2]=d,A[x+3]=v}let{cols:_,rows:O}=v,T=2*_;for(let e=0;e<B;e++){for(let e=0;e<O;e++)for(let t=0;t<_;t++){let a=(e*_+t)*2,r=w[a]-l*y[a]-u*x[a],n=w[a+1]-l*y[a+1]-u*x[a+1];if(E>0){let o=-4*y[a],i=-4*y[a+1],l=-4*x[a],u=-4*x[a+1];t>0&&(o+=y[a-2],i+=y[a-1],l+=x[a-2],u+=x[a-1]),t<_-1&&(o+=y[a+2],i+=y[a+3],l+=x[a+2],u+=x[a+3]),e>0&&(o+=y[a-T],i+=y[a-T+1],l+=x[a-T],u+=x[a-T+1]),e<O-1&&(o+=y[a+T],i+=y[a+T+1],l+=x[a+T],u+=x[a+T+1]),r+=E*o+L*l,n+=E*i+L*u}g[a]=x[a]+r*P,g[a+1]=x[a+1]+n*P}for(let e=0;e<y.length;e++)x[e]=g[e],y[e]+=x[e]*P}for(let e=0;e<v.count;e++){let t=2*e,a=4*e;M[e]=Math.min(1,Math.hypot(x[t]+A[a+2],x[t+1]+A[a+3])/380*.85+Math.hypot(y[t]+A[a],y[t+1]+A[a+1])/(2.2*v.cell)*.35)}for(let e=F.length-1;e>=0;e--)S[e].front>a.shockRadius+3*R&&F.splice(e,1);let C=1-Math.exp(-e/.08);b.vx-=b.vx*C,b.vy-=b.vy*C;let U=a.mouseInteraction&&b.inside?1:0;b.presence+=(U-b.presence)*(1-Math.exp(-e/.2))})(t,e),C(e),(e=>{if(F.length)return!1;if(null!==S){if(S<0||(e-S)/1e3<1.6)return!1;S=null}if(Math.abs(b.vx)+Math.abs(b.vy)>1||Math.abs((I.current.mouseInteraction&&b.inside?1:0)-b.presence)>.002)return!1;for(let e=0;e<y.length;e++)if(Math.abs(y[e])>.02||Math.abs(x[e])>.5)return!1;return!0})(e)||(L=requestAnimationFrame(U))},D=()=>{L||I.current.paused||!E||(B=performance.now(),L=requestAnimationFrame(U))},Y=t=>{let a=e.getBoundingClientRect();return m.left=a.left,m.top=a.top,[t.clientX-a.left,t.clientY-a.top]},z=e=>{if(!I.current.mouseInteraction)return;let[t,a]=Y(e),r=t>=0&&a>=0&&t<=m.width&&a<=m.height,n=e.timeStamp||performance.now();if(r&&b.inside&&b.time){let e=Math.max(4,n-b.time)/1e3,r=(t-b.x)/e,o=(a-b.y)/e;b.vx+=(r-b.vx)*.6,b.vy+=(o-b.vy)*.6}else b.vx=0,b.vy=0;b.x=t,b.y=a,b.time=n,(r!==b.inside||r)&&(b.inside=r,D())},N=()=>{b.inside=!1,b.time=0,D()},V=e=>{e.relatedTarget||N()},q=e=>{if(!I.current.clickShock||d)return;let[t,a]=Y(e);t<0||a<0||t>m.width||a>m.height||(F.push({x:t,y:a,start:performance.now()}),F.length>6&&F.shift(),D())};window.addEventListener("pointermove",z,{passive:!0}),window.addEventListener("pointerdown",q,{passive:!0}),window.addEventListener("pointerout",V),window.addEventListener("blur",N);let G=new ResizeObserver(()=>{_(),D()});G.observe(e);let k=new IntersectionObserver(([e])=>{(E=e.isIntersecting)&&D()});k.observe(e);let j=()=>{document.hidden?(cancelAnimationFrame(L),L=0):D()};return document.addEventListener("visibilitychange",j),_(),D(),T.current={rebuild:()=>{P(),C(performance.now()),D()},refresh:()=>{C(performance.now()),D()}},()=>{cancelAnimationFrame(L),G.disconnect(),k.disconnect(),window.removeEventListener("pointermove",z),window.removeEventListener("pointerdown",q),window.removeEventListener("pointerout",V),window.removeEventListener("blur",N),document.removeEventListener("visibilitychange",j),t.deleteBuffer(f),t.deleteBuffer(s),t.deleteVertexArray(h),t.deleteProgram(a),T.current=null}},[]),(0,a.useEffect)(()=>{T.current?.rebuild()},[e,c]),(0,a.useEffect)(()=>{T.current?.refresh()},[h,f,w,g,A,M,R,b,L,s,S]),(0,t.jsx)("div",{className:`relative h-full w-full ${P}`.trim(),style:_,children:(0,t.jsx)("canvas",{ref:O,className:"pointer-events-none absolute inset-0 block h-full w-full"})})}])},13844,function(e){e.n(e.i(49931))}]);