(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))t(r);new MutationObserver(r=>{for(const c of r)if(c.type==="childList")for(const v of c.addedNodes)v.tagName==="LINK"&&v.rel==="modulepreload"&&t(v)}).observe(document,{childList:!0,subtree:!0});function f(r){const c={};return r.integrity&&(c.integrity=r.integrity),r.referrerPolicy&&(c.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?c.credentials="include":r.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function t(r){if(r.ep)return;r.ep=!0;const c=f(r);fetch(r.href,c)}})();const F=`precision highp float;

uniform vec2 resolution;
uniform vec4 color1;
uniform vec4 color2;
uniform vec4 color3;
uniform vec4 color4;
uniform vec2 color1Pos;
uniform vec2 color2Pos;
uniform vec2 color3Pos;
uniform vec2 color4Pos;

void main() {
  vec2 position = gl_FragCoord.xy / resolution.xy;
  position.y = 1.0 - position.y;

  float dp1 = distance(position, color1Pos);
  float dp2 = distance(position, color2Pos);
  float dp3 = distance(position, color3Pos);
  float dp4 = distance(position, color4Pos);
  float minD = min(dp1, min(dp2, min(dp3, dp4)));
  float p = 4.0;

  dp1 = pow(1.0 - (dp1 - minD), p);
  dp2 = pow(1.0 - (dp2 - minD), p);
  dp3 = pow(1.0 - (dp3 - minD), p);
  dp4 = pow(1.0 - (dp4 - minD), p);
  float dpt = abs(dp1 + dp2 + dp3 + dp4);

  gl_FragColor =
    (color1 * dp1 / dpt) +
    (color2 * dp2 / dpt) +
    (color3 * dp3 / dpt) +
    (color4 * dp4 / dpt);
}
`,T=["VERTEX_SHADER","FRAGMENT_SHADER"];function C(e,a){const f=[];for(let t=0;t<a.length;++t){const r=D(e,a[t],e[T[t]]);if(!r){console.log(`Error loading shader ${a[t]}`);continue}f.push(r)}return f}function D(e,a,f){const t=e.createShader(f);if(e.shaderSource(t,a),e.compileShader(t),!e.getShaderParameter(t,e.COMPILE_STATUS)){const c=e.getShaderInfoLog(t);return console.log("*** Error compiling shader '"+t+"':"+c+`
`+a.split(`
`).map((v,_)=>`${_+1}: ${v}`).join(`
`)),e.deleteShader(t),null}return t}const O=`// an attribute will receive data from a buffer
attribute vec4 a_position;

// all shaders have a main function
void main() {

  // gl_Position is a special variable a vertex shader
  // is responsible for setting
  gl_Position = a_position;
}
`;const y=document.createElement("canvas");document.body.appendChild(y);const o=y.getContext("webgl");if(!o)throw new Error("WebGL not supported");const i=o.createProgram();if(!i)throw new Error("Unable to create WebGLProgram");const x=C(o,[O,F]);for(const e of x)o.attachShader(i,e);o.linkProgram(i);o.getProgramParameter(i,o.LINK_STATUS)||alert("Unable to initialize the shader program.");o.useProgram(i);const S=o.getAttribLocation(i,"a_position"),E=o.createBuffer();o.bindBuffer(o.ARRAY_BUFFER,E);o.bufferData(o.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),o.STATIC_DRAW);o.viewport(0,0,o.canvas.width,o.canvas.height);o.useProgram(i);o.enableVertexAttribArray(S);o.bindBuffer(o.ARRAY_BUFFER,E);o.vertexAttribPointer(S,2,o.FLOAT,!1,0,0);var B=o.getUniformLocation(i,"resolution"),I=o.getUniformLocation(i,"color1"),N=o.getUniformLocation(i,"color2"),q=o.getUniformLocation(i,"color3"),G=o.getUniformLocation(i,"color4"),M=o.getUniformLocation(i,"color1Pos"),W=o.getUniformLocation(i,"color2Pos"),Y=o.getUniformLocation(i,"color3Pos"),$=o.getUniformLocation(i,"color4Pos");const L=[[.265,.582],[.176,.918],[1-.585,1-.164],[.644,.755],[1-.265,1-.582],[1-.176,1-.918],[.585,.164],[1-.644,1-.755]];let d=0,m,g,l,P;w();function w(){m=L[d%8],g=L[(d+2)%8],l=L[(d+4)%8],P=L[(d+6)%8],d=(d+1)%8}let p=[m[0],m[1]],u=[g[0],g[1]],s=[l[0],l[1]],h=[P[0],P[1]];U();function U(){o.uniform2fv(B,[o.canvas.width,o.canvas.height]),o.uniform4fv(I,[255/255,246/255,191/255,1]),o.uniform4fv(N,[49/255,107/255,77/255,1]),o.uniform4fv(q,[246/255,228/255,119/255,1]),o.uniform4fv(G,[118/255,160/255,118/255,1]),o.uniform2fv(M,p),o.uniform2fv(W,u),o.uniform2fv(Y,s),o.uniform2fv($,h),o.drawArrays(o.TRIANGLES,0,6)}function A(e,a){return Math.sqrt((e[1]-a[1])*(e[1]-a[1]))}const n=.1;let b=!1;function R(){b=!0,A(p,m)>.01||A(u,g)>.01||A(s,l)>.01||A(s,l)>.01?(p[0]=p[0]*(1-n)+m[0]*n,p[1]=p[1]*(1-n)+m[1]*n,u[0]=u[0]*(1-n)+g[0]*n,u[1]=u[1]*(1-n)+g[1]*n,s[0]=s[0]*(1-n)+l[0]*n,s[1]=s[1]*(1-n)+l[1]*n,h[0]=h[0]*(1-n)+P[0]*n,h[1]=h[1]*(1-n)+P[1]*n,U(),requestAnimationFrame(R)):b=!1}y.addEventListener("click",()=>{w(),b||requestAnimationFrame(R)});
