(function(){const c=document.createElement("link").relList;if(c&&c.supports&&c.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))i(e);new MutationObserver(e=>{for(const a of e)if(a.type==="childList")for(const g of a.addedNodes)g.tagName==="LINK"&&g.rel==="modulepreload"&&i(g)}).observe(document,{childList:!0,subtree:!0});function f(e){const a={};return e.integrity&&(a.integrity=e.integrity),e.referrerPolicy&&(a.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?a.credentials="include":e.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function i(e){if(e.ep)return;e.ep=!0;const a=f(e);fetch(e.href,a)}})();const F=`precision highp float;

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
`,T=["VERTEX_SHADER","FRAGMENT_SHADER"];function C(r,c){const f=[];for(let i=0;i<c.length;++i)f.push(D(r,c[i],r[T[i]]));return f}function D(r,c,f){const i=r.createShader(f);if(r.shaderSource(i,c),r.compileShader(i),!r.getShaderParameter(i,r.COMPILE_STATUS)){const a=r.getShaderInfoLog(i);return console.log("*** Error compiling shader '"+i+"':"+a+`
`+c.split(`
`).map((g,_)=>`${_+1}: ${g}`).join(`
`)),r.deleteShader(i),null}return i}const O=`// an attribute will receive data from a buffer
attribute vec4 a_position;

// all shaders have a main function
void main() {

  // gl_Position is a special variable a vertex shader
  // is responsible for setting
  gl_Position = a_position;
}
`;const y=document.createElement("canvas");document.body.appendChild(y);const o=y.getContext("webgl");if(!o)throw new Error("WebGL not supported");const n=o.createProgram();if(!n)throw new Error("Unable to create WebGLProgram");const x=C(o,[O,F]);for(const r of x)o.attachShader(n,r);o.linkProgram(n);o.getProgramParameter(n,o.LINK_STATUS)||alert("Unable to initialize the shader program.");o.useProgram(n);const S=o.getAttribLocation(n,"a_position"),E=o.createBuffer();o.bindBuffer(o.ARRAY_BUFFER,E);o.bufferData(o.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),o.STATIC_DRAW);o.viewport(0,0,o.canvas.width,o.canvas.height);o.useProgram(n);o.enableVertexAttribArray(S);o.bindBuffer(o.ARRAY_BUFFER,E);o.vertexAttribPointer(S,2,o.FLOAT,!1,0,0);var B=o.getUniformLocation(n,"resolution"),I=o.getUniformLocation(n,"color1"),N=o.getUniformLocation(n,"color2"),q=o.getUniformLocation(n,"color3"),G=o.getUniformLocation(n,"color4"),M=o.getUniformLocation(n,"color1Pos"),W=o.getUniformLocation(n,"color2Pos"),Y=o.getUniformLocation(n,"color3Pos"),H=o.getUniformLocation(n,"color4Pos");const L=[[.265,.582],[.176,.918],[1-.585,1-.164],[.644,.755],[1-.265,1-.582],[1-.176,1-.918],[.585,.164],[1-.644,1-.755]];let d=0,m,v,l,P;w();function w(){m=L[d%8],v=L[(d+2)%8],l=L[(d+4)%8],P=L[(d+6)%8],d=(d+1)%8}let p=[m[0],m[1]],u=[v[0],v[1]],s=[l[0],l[1]],h=[P[0],P[1]];U();function U(){o.uniform2fv(B,[o.canvas.width,o.canvas.height]),o.uniform4fv(I,[255/255,246/255,191/255,1]),o.uniform4fv(N,[49/255,107/255,77/255,1]),o.uniform4fv(q,[246/255,228/255,119/255,1]),o.uniform4fv(G,[118/255,160/255,118/255,1]),o.uniform2fv(M,p),o.uniform2fv(W,u),o.uniform2fv(Y,s),o.uniform2fv(H,h),o.drawArrays(o.TRIANGLES,0,6)}function A(r,c){return Math.sqrt((r[1]-c[1])*(r[1]-c[1]))}const t=.1;let b=!1;function R(){b=!0,A(p,m)>.01||A(u,v)>.01||A(s,l)>.01||A(s,l)>.01?(p[0]=p[0]*(1-t)+m[0]*t,p[1]=p[1]*(1-t)+m[1]*t,u[0]=u[0]*(1-t)+v[0]*t,u[1]=u[1]*(1-t)+v[1]*t,s[0]=s[0]*(1-t)+l[0]*t,s[1]=s[1]*(1-t)+l[1]*t,h[0]=h[0]*(1-t)+P[0]*t,h[1]=h[1]*(1-t)+P[1]*t,U(),requestAnimationFrame(R)):b=!1}y.addEventListener("click",()=>{w(),b||requestAnimationFrame(R)});
