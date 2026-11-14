export type Parameters = { a: number; b: number; c: number; C: number; left: number; right: number };
export type CurveModel = { f: (x: number) => number; F: (x: number) => number; domain: [number, number]; latex: string; primitive: string; note: string; poles?: number[] };
export const MODES: Record<number, string[]> = {
7: ['Potencia compuesta', 'Exponencial compuesta'], 8: ['Base a', 'Base e'], 9: ['Razón u′/u', 'Logaritmo'], 10: ['Seno', 'Coseno', 'Seno al cuadrado', 'Coseno al cubo'], 11: ['arctan', 'arcsin', 'arcsec'], 12: ['arsinh', 'arcosh', 'artanh', 'sinh', 'cosh'], 13: ['Sin radical', 'Con radical'], 14: ['x · eᵏˣ', 'x · cos(kx)'], 15: ['Lineales distintos', 'Factor repetido', 'Cuadrático irreducible'], 16: ['1/(1 + √x)', '1/[√x(1 + √x)]'], 17: ['Producto de ondas', 'tan² · sec⁴', 'cot² · csc⁴', 'sec³'], 18: ['√(a² − x²)', '√(a² + x²)', '√(x² − a²)'], 19: ['1/(a + cos x)', '1/(a + sin x)'], 20: ['Parábola', 'Recta'], 21: ['Discos', 'Arandelas', 'Cascarones']
};
// Composite Simpson is used only for the smooth bounded application integrands.
export function integrate(f: (x: number) => number, left: number, right: number, n = 400) {
  const h = (right - left) / n;
  let sum = f(left) + f(right);
  for (let i = 1; i < n; i++) sum += (i % 2 ? 4 : 2) * f(left + i * h);
  return sum * h / 3;
}
export function quadraticPrimitive(x: number, a: number, b: number, c: number, radical: boolean) {
  if (Math.abs(a) < 1e-10) {
    if (Math.abs(b) < 1e-10) return radical ? x / Math.sqrt(c) : x / c;
    return radical ? 2 * Math.sqrt(b * x + c) / b : Math.log(Math.abs(b * x + c)) / b;
  }
  const z = x + b / (2 * a), d = c - b * b / (4 * a), q = a * z * z + d;
  if (radical) {
    if (q <= 0) return NaN;
    if (a > 0) return Math.log(Math.abs(Math.sqrt(a) * z + Math.sqrt(q))) / Math.sqrt(a);
    return Math.asin(Math.sqrt(-a / d) * z) / Math.sqrt(-a);
  }
  const ratio = d / a;
  if (Math.abs(d) < 1e-10) return -1 / (a * z);
  if (ratio > 0) return Math.atan(z / Math.sqrt(ratio)) / (a * Math.sqrt(ratio));
  const r = Math.sqrt(-ratio);
  return Math.log(Math.abs((z - r) / (z + r))) / (2 * a * r);
}
export function curveModel(id: number, mode: number, p: Parameters): CurveModel {
  const { a, b, c, C } = p;
  let f: (x: number) => number = x => x;
  let F: (x: number) => number = x => x * x / 2;
  let domain: [number, number] = [-2, 2];
  let latex = '', primitive = '', note = 'Línea continua: f(x). Línea discontinua: F(x) + C.', poles: number[] | undefined;
  switch (id) {
    case 7:
      f = mode === 0 ? x => 2 * a * x * (a * x * x + b) ** 2 : x => 2 * a * x * Math.exp(a * x * x + b);
      F = mode === 0 ? x => (a * x * x + b) ** 3 / 3 : x => Math.exp(a * x * x + b);
      domain = [0, 1.5]; latex = mode === 0 ? String.raw`f(x)=2ax(ax^2+b)^2` : String.raw`f(x)=2ax e^{ax^2+b}`;
      primitive = mode === 0 ? String.raw`F(x)=\frac{(ax^2+b)^3}{3}+C` : String.raw`F(x)=e^{ax^2+b}+C`; break;
    case 8: {
      const base = mode === 0 ? a : Math.E, k = b * Math.log(base);
      f = x => Math.exp(k * x); F = x => Math.exp(k * x) / k;
      domain = [-1, 1]; latex = mode === 0 ? String.raw`f(x)=a^{bx}` : String.raw`f(x)=e^{bx}`; primitive = mode === 0 ? String.raw`F(x)=\frac{a^{bx}}{b\ln a}+C` : String.raw`F(x)=\frac{e^{bx}}b+C`; note += ' a > 1 y b > 0 en esta familia.'; break;
    }
    case 9:
      f = mode === 0 ? x => a / (a * x + b) : x => Math.log(a * x + b);
      F = mode === 0 ? x => Math.log(Math.abs(a * x + b)) : x => ((a * x + b) * Math.log(a * x + b) - (a * x + b)) / a;
      domain = [-b / a + 0.08, -b / a + 4]; poles = [-b / a]; latex = mode === 0 ? String.raw`f(x)=\frac a{ax+b}` : String.raw`f(x)=\ln(ax+b)`; primitive = mode === 0 ? String.raw`F(x)=\ln|ax+b|+C` : String.raw`F(x)=\frac{(ax+b)\ln(ax+b)-(ax+b)}a+C`; note += ` Rama ax+b > 0; asíntota x = ${(-b/a).toFixed(3)}.`; break;
    case 10:
      domain = [-Math.PI, Math.PI];
      f = [ (x:number) => a * Math.sin(b*x), (x:number) => a*Math.cos(b*x), (x:number) => a*Math.sin(b*x)**2, (x:number) => a*Math.cos(b*x)**3 ][mode] ?? f;
      F = [ (x:number) => -a*Math.cos(b*x)/b, (x:number) => a*Math.sin(b*x)/b, (x:number) => a*(x/2-Math.sin(2*b*x)/(4*b)), (x:number) => a*(Math.sin(b*x)-Math.sin(b*x)**3/3)/b ][mode] ?? F;
      latex = ['a\\sin(bx)','a\\cos(bx)','a\\sin^2(bx)','a\\cos^3(bx)'][mode] ?? ''; primitive = [String.raw`-\frac ab\cos(bx)`,String.raw`\frac ab\sin(bx)`,String.raw`a\left(\frac x2-\frac{\sin(2bx)}{4b}\right)`,String.raw`\frac ab\left(\sin(bx)-\frac{\sin^3(bx)}3\right)`][mode] ?? ''; latex = `f(x)=${latex}`; primitive = `F(x)=${primitive}+C`; break;
    case 11:
      if(mode===0) { f=x=>1/(a*a+x*x); F=x=>Math.atan(x/a)/a; latex=String.raw`f(x)=\frac1{a^2+x^2}`; primitive=String.raw`F(x)=\frac1a\arctan(x/a)+C`; }
      else if(mode===1) { domain=[-a*0.95,a*0.95]; f=x=>1/Math.sqrt(a*a-x*x); F=x=>Math.asin(x/a); latex=String.raw`f(x)=\frac1{\sqrt{a^2-x^2}}`; primitive=String.raw`F(x)=\arcsin(x/a)+C`; }
      else { domain=[a*1.05,a*3]; f=x=>1/(Math.abs(x)*Math.sqrt(x*x-a*a)); F=x=>Math.acos(a/x)/a; latex=String.raw`f(x)=\frac1{|x|\sqrt{x^2-a^2}}`; primitive=String.raw`F(x)=\frac1a\operatorname{arcsec}(x/a)+C`; }
      note += ' a > 0; los extremos singulares se excluyen.'; break;
    case 12:
      if(mode===0) { f=x=>1/Math.sqrt(x*x+a*a); F=x=>Math.asinh(x/a); latex=String.raw`f(x)=1/\sqrt{x^2+a^2}`; primitive=String.raw`F(x)=\operatorname{arsinh}(x/a)+C`; }
      else if(mode===1) { domain=[a*1.05,a*3]; f=x=>1/Math.sqrt(x*x-a*a); F=x=>Math.acosh(x/a); latex=String.raw`f(x)=1/\sqrt{x^2-a^2}`; primitive=String.raw`F(x)=\operatorname{arcosh}(x/a)+C`; }
      else if(mode===2) { domain=[-a*0.9,a*0.9]; f=x=>1/(a*a-x*x); F=x=>Math.atanh(x/a)/a; latex=String.raw`f(x)=1/(a^2-x^2)`; primitive=String.raw`F(x)=\operatorname{artanh}(x/a)/a+C`; }
      else { f=mode===3 ? x=>Math.sinh(a*x) : x=>Math.cosh(a*x); F=mode===3 ? x=>Math.cosh(a*x)/a : x=>Math.sinh(a*x)/a; latex=mode===3 ? String.raw`f(x)=\sinh(ax)` : String.raw`f(x)=\cosh(ax)`; primitive=mode===3 ? String.raw`F(x)=\cosh(ax)/a+C` : String.raw`F(x)=\sinh(ax)/a+C`; } break;
    case 13: {
      const disc=b*b-4*a*c;
      poles=disc>=0 ? [(-b-Math.sqrt(disc))/(2*a),(-b+Math.sqrt(disc))/(2*a)] : [];
      f=x=>{const q=a*x*x+b*x+c; return mode===0 ? (Math.abs(q)<0.08 ? NaN : 1/q) : (q<0.08 ? NaN : 1/Math.sqrt(q));};
      F=x=>{ const q=a*x*x+b*x+c; return (mode===1 && q<0.08) || (mode===0 && Math.abs(q)<0.08) ? NaN : quadraticPrimitive(x,a,b,c,mode===1); };
      latex=mode===0 ? String.raw`f(x)=1/(ax^2+bx+c)` : String.raw`f(x)=1/\sqrt{ax^2+bx+c}`;
      const d=c-b*b/(4*a);
      primitive=mode===0 ? (d>0 ? String.raw`F(x)=\frac{\arctan((x+b/(2a))\sqrt{a/d})}{\sqrt{ad}}+C,\ d=c-\frac{b^2}{4a}` : d===0 ? String.raw`F(x)=-\frac1{a(x+b/(2a))}+C` : String.raw`F(x)=\frac1{2ar}\ln\left|\frac{x+b/(2a)-r}{x+b/(2a)+r}\right|+C,\ r=\sqrt{-d/a}`) : String.raw`F(x)=\frac1{\sqrt a}\ln\left|\sqrt a\left(x+\frac b{2a}\right)+\sqrt{ax^2+bx+c}\right|+C`;
      note += ` a > 0; discriminante Δ = ${disc.toFixed(2)}. ${mode===1 ? 'Solo ax²+bx+c > 0.' : 'Se excluyen los ceros del denominador.'} Se dejan huecos junto a los polos.`; break;
    }
    case 14:
      domain=[0,2]; f=mode===0 ? x=>x*Math.exp(a*x) : x=>x*Math.cos(a*x); F=mode===0 ? x=>Math.exp(a*x)*(x/a-1/(a*a)) : x=>x*Math.sin(a*x)/a+Math.cos(a*x)/(a*a);
      latex=mode===0 ? String.raw`f(x)=xe^{ax}` : String.raw`f(x)=x\cos(ax)`; primitive=mode===0 ? String.raw`F(x)=e^{ax}(x/a-1/a^2)+C` : String.raw`F(x)=x\sin(ax)/a+\cos(ax)/a^2+C`; break;
    case 15:
      if(mode===0) { poles=[-a,-a-1]; f=x=>Math.abs(x+a)<0.08||Math.abs(x+a+1)<0.08?NaN:2/(x+a)+1/(x+a+1); F=x=>Math.abs(x+a)<0.08||Math.abs(x+a+1)<0.08?NaN:2*Math.log(Math.abs(x+a))+Math.log(Math.abs(x+a+1)); latex=String.raw`f(x)=\frac2{x+a}+\frac1{x+a+1}`; primitive=String.raw`F(x)=2\ln|x+a|+\ln|x+a+1|+C`; domain=[-a-2,-a+3]; }
      else if(mode===1) { poles=[a]; f=x=>Math.abs(x-a)<0.12?NaN:1/(x-a)+2/(x-a)**2; F=x=>Math.abs(x-a)<0.12?NaN:Math.log(Math.abs(x-a))-2/(x-a); domain=[a-2,a+2]; latex=String.raw`f(x)=1/(x-a)+2/(x-a)^2`; primitive=String.raw`F(x)=\ln|x-a|-2/(x-a)+C`; }
      else { f=x=>(b*x+c)/(x*x+a*a); F=x=>b/2*Math.log(x*x+a*a)+c/a*Math.atan(x/a); latex=String.raw`f(x)=\frac{bx+c}{x^2+a^2}`; primitive=String.raw`F(x)=\frac b2\ln(x^2+a^2)+\frac ca\arctan(x/a)+C`; }
      note+=' Asíntotas marcadas; cada rama tiene su propia constante.'; break;
    case 16:
      domain=[0.06,5]; f=mode===0 ? x=>a/(1+Math.sqrt(x)) : x=>a/(Math.sqrt(x)*(1+Math.sqrt(x))); F=mode===0 ? x=>2*a*(Math.sqrt(x)-Math.log(1+Math.sqrt(x))) : x=>2*a*Math.log(1+Math.sqrt(x)); latex=mode===0 ? String.raw`f(x)=a/(1+\sqrt{x})` : String.raw`f(x)=a/[\sqrt{x}(1+\sqrt{x})]`; primitive=mode===0 ? String.raw`F(x)=2a[\sqrt{x}-\ln(1+\sqrt{x})]+C` : String.raw`F(x)=2a\ln(1+\sqrt{x})+C`; note+=' Dominio x > 0; la primera función admite también x = 0.'; break;
    case 17:
      if(mode===0) { domain=[-Math.PI,Math.PI]; f=x=>Math.sin(a*x)*Math.cos(b*x); const term=(k:number,x:number)=>Math.abs(k)<1e-10?0:-Math.cos(k*x)/k; F=x=>(term(a+b,x)+term(a-b,x))/2; latex=String.raw`f(x)=\sin(ax)\cos(bx)`; primitive=a===b?String.raw`F(x)=-\cos(2ax)/(4a)+C`:String.raw`F(x)=-\frac{\cos((a+b)x)}{2(a+b)}-\frac{\cos((a-b)x)}{2(a-b)}+C`; }
      else if(mode===1) { domain=[-1.05,1.05]; f=x=>a*Math.tan(x)**2/Math.cos(x)**4; F=x=>a*(Math.tan(x)**3/3+Math.tan(x)**5/5); latex=String.raw`f(x)=a\tan^2x\sec^4x`; primitive=String.raw`F(x)=a(\tan^3x/3+\tan^5x/5)+C`; }
      else if(mode===2) { domain=[0.5,Math.PI-0.5]; f=x=>a/(Math.tan(x)**2*Math.sin(x)**4); F=x=>-a*(1/Math.tan(x)**3/3+1/Math.tan(x)**5/5); latex=String.raw`f(x)=a\cot^2x\csc^4x`; primitive=String.raw`F(x)=-a(\cot^3x/3+\cot^5x/5)+C`; }
      else { domain=[-1.1,1.1]; f=x=>a/Math.cos(x)**3; F=x=>a/2*(Math.tan(x)/Math.cos(x)+Math.log(Math.abs(1/Math.cos(x)+Math.tan(x)))); latex=String.raw`f(x)=a\sec^3x`; primitive=String.raw`F(x)=\frac a2[\sec x\tan x+\ln|\sec x+\tan x|]+C`; } break;
    case 18:
      if(mode===0) { domain=[-a*0.99,a*0.99]; f=x=>Math.sqrt(a*a-x*x); F=x=>(x*Math.sqrt(a*a-x*x)+a*a*Math.asin(x/a))/2; latex=String.raw`f(x)=\sqrt{a^2-x^2}`; primitive=String.raw`F(x)=\frac12[x\sqrt{a^2-x^2}+a^2\arcsin(x/a)]+C`; }
      else if(mode===1) { domain=[-a*2,a*2]; f=x=>Math.sqrt(a*a+x*x); F=x=>(x*Math.sqrt(a*a+x*x)+a*a*Math.asinh(x/a))/2; latex=String.raw`f(x)=\sqrt{a^2+x^2}`; primitive=String.raw`F(x)=\frac12[x\sqrt{a^2+x^2}+a^2\operatorname{arsinh}(x/a)]+C`; }
      else { domain=[a*1.02,a*3]; f=x=>Math.sqrt(x*x-a*a); F=x=>(x*Math.sqrt(x*x-a*a)-a*a*Math.acosh(x/a))/2; latex=String.raw`f(x)=\sqrt{x^2-a^2}`; primitive=String.raw`F(x)=\frac12[x\sqrt{x^2-a^2}-a^2\operatorname{arcosh}(x/a)]+C`; } break;
    case 19: {
      domain=[-Math.PI+0.1,Math.PI-0.1]; f=mode===0 ? x=>1/(a+Math.cos(x)) : x=>1/(a+Math.sin(x)); const d=Math.sqrt(a*a-1);
      F=mode===0 ? x=>2/d*Math.atan(Math.sqrt((a-1)/(a+1))*Math.tan(x/2)) : x=>2/d*Math.atan((a*Math.tan(x/2)+1)/d);
      latex=mode===0 ? String.raw`f(x)=1/(a+\cos x)` : String.raw`f(x)=1/(a+\sin x)`; primitive=mode===0 ? String.raw`F(x)=\frac2{\sqrt{a^2-1}}\arctan\left(\sqrt{\frac{a-1}{a+1}}\tan\frac x2\right)+C` : String.raw`F(x)=\frac2{\sqrt{a^2-1}}\arctan\frac{a\tan(x/2)+1}{\sqrt{a^2-1}}+C`; note+=' a > 1; rama −π < x < π.'; break;
    }
    case 20: f=mode===0 ? x=>a*x*x+b : x=>a*x+b; F=mode===0 ? x=>a*x**3/3+b*x : x=>a*x*x/2+b*x; domain=[0,4]; latex=mode===0 ? String.raw`f(x)=ax^2+b` : String.raw`f(x)=ax+b`; primitive=mode===0 ? String.raw`F(x)=ax^3/3+bx+C` : String.raw`F(x)=ax^2/2+bx+C`; break;
    case 21: f=x=>a*x; F=x=>a*x*x/2; domain=[0,2]; latex=String.raw`R(t)=at,\quad r(t)=bat\ (0\le b<1)`; primitive=String.raw`\text{Discos: }r=0;\quad\text{Arandelas: }r=bR;\quad\text{Cascarones: }h=R-r`; break;
  }
  return { f, F:x=>F(x)+C, domain, latex, primitive, note, ...(poles ? { poles } : {}) };
}
export function applicationMetrics(p: Parameters, mode: number) {
  const f=mode===0 ? (x:number)=>p.a*x*x+p.b : (x:number)=>p.a*x+p.b;
  const derivative=mode===0 ? (x:number)=>2*p.a*x : ()=>p.a;
  return { average: integrate(f,p.left,p.right)/(p.right-p.left), length: integrate(x=>Math.sqrt(1+derivative(x)**2),p.left,p.right) };
}
export function revolutionVolume(p: Parameters, mode: number) {
  return integrate(t=>mode===2 ? 2*Math.PI*t*p.a*t*(1-p.b) : Math.PI*(p.a*t)**2*(mode===0?1:1-p.b*p.b),p.left,p.right);
}
