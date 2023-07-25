(function(){const c=document.createElement("link").relList;if(c&&c.supports&&c.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))t(e);new MutationObserver(e=>{for(const a of e)if(a.type==="childList")for(const v of a.addedNodes)v.tagName==="LINK"&&v.rel==="modulepreload"&&t(v)}).observe(document,{childList:!0,subtree:!0});function s(e){const a={};return e.integrity&&(a.integrity=e.integrity),e.referrerPolicy&&(a.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?a.credentials="include":e.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function t(e){if(e.ep)return;e.ep=!0;const a=s(e);fetch(e.href,a)}})();const C=`precision highp float;

uniform vec2 resolution;

// TODO: можешь просто кидать 3 компонента от 0 до 255 и в гл делать vec4(color/255.0, 1.0)
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
`,D=["VERTEX_SHADER","FRAGMENT_SHADER"];function I(r,c){const s=[];for(let t=0;t<c.length;++t){const e=O(r,c[t],r[D[t]]);if(!e){console.log(`Error loading shader ${c[t]}`);continue}s.push(e)}return s}function O(r,c,s){const t=r.createShader(s);if(r.shaderSource(t,c),r.compileShader(t),!r.getShaderParameter(t,r.COMPILE_STATUS)){const a=r.getShaderInfoLog(t);return console.log("*** Error compiling shader '"+t+"':"+a+`
`+c.split(`
`).map((v,T)=>`${T+1}: ${v}`).join(`
`)),r.deleteShader(t),null}return t}function L(r){r.startsWith("#")&&(r=r.slice(1));const c=parseInt(r.slice(0,2),16),s=parseInt(r.slice(2,4),16),t=parseInt(r.slice(4,6),16);let e=255;return r.length===8&&(e=parseInt(r.slice(6,8),16)),[c/255,s/255,t/255,e/255]}const B=`// an attribute will receive data from a buffer
attribute vec4 a_position;

// all shaders have a main function
void main() {

  // gl_Position is a special variable a vertex shader
  // is responsible for setting
  gl_Position = a_position;
}
`;const E=document.createElement("canvas");document.body.appendChild(E);const o=E.getContext("webgl");if(!o)throw new Error("WebGL not supported");const i=o.createProgram();if(!i)throw new Error("Unable to create WebGLProgram");const N=I(o,[B,C]);for(const r of N)o.attachShader(i,r);o.linkProgram(i);o.getProgramParameter(i,o.LINK_STATUS)||alert("Unable to initialize the shader program.");o.useProgram(i);const w=o.getAttribLocation(i,"a_position"),U=o.createBuffer();o.bindBuffer(o.ARRAY_BUFFER,U);o.bufferData(o.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),o.STATIC_DRAW);o.viewport(0,0,o.canvas.width,o.canvas.height);o.useProgram(i);o.enableVertexAttribArray(w);o.bindBuffer(o.ARRAY_BUFFER,U);o.vertexAttribPointer(w,2,o.FLOAT,!1,0,0);var q=o.getUniformLocation(i,"resolution"),G=o.getUniformLocation(i,"color1"),M=o.getUniformLocation(i,"color2"),W=o.getUniformLocation(i,"color3"),V=o.getUniformLocation(i,"color4"),Y=o.getUniformLocation(i,"color1Pos"),$=o.getUniformLocation(i,"color2Pos"),H=o.getUniformLocation(i,"color3Pos"),K=o.getUniformLocation(i,"color4Pos");const b=[[.265,.582],[.176,.918],[1-.585,1-.164],[.644,.755],[1-.265,1-.582],[1-.176,1-.918],[.585,.164],[1-.644,1-.755]];let d=0,m,g,f,P;R();function R(){m=b[d%8],g=b[(d+2)%8],f=b[(d+4)%8],P=b[(d+6)%8],d=(d+1)%8}let p=[m[0],m[1]],u=[g[0],g[1]],l=[f[0],f[1]],h=[P[0],P[1]];const A={color1:L("#dbddbb"),color2:L("#6ba587"),color3:L("#d5d88d"),color4:L("#88b884")};_();function _(){o.uniform2fv(q,[o.canvas.width,o.canvas.height]),o.uniform4fv(G,A.color1),o.uniform4fv(M,A.color2),o.uniform4fv(W,A.color3),o.uniform4fv(V,A.color4),o.uniform2fv(Y,p),o.uniform2fv($,u),o.uniform2fv(H,l),o.uniform2fv(K,h),o.drawArrays(o.TRIANGLES,0,6)}function y(r,c){return Math.sqrt((r[1]-c[1])*(r[1]-c[1]))}const n=.1;let S=!1;function F(){S=!0,y(p,m)>.01||y(u,g)>.01||y(l,f)>.01||y(l,f)>.01?(p[0]=p[0]*(1-n)+m[0]*n,p[1]=p[1]*(1-n)+m[1]*n,u[0]=u[0]*(1-n)+g[0]*n,u[1]=u[1]*(1-n)+g[1]*n,l[0]=l[0]*(1-n)+f[0]*n,l[1]=l[1]*(1-n)+f[1]*n,h[0]=h[0]*(1-n)+P[0]*n,h[1]=h[1]*(1-n)+P[1]*n,_(),requestAnimationFrame(F)):S=!1}E.addEventListener("click",()=>{R(),S||requestAnimationFrame(F)});
