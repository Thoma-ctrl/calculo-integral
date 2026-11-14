import { useState } from 'react';
import { NumberSlider, Formula, ResultGrid } from '@/components/module-ui';
import { Button } from '@/components/ui/button';
import { Tex, TexBlock } from '@/components/Tex';
import { AdvancedPlot } from './AdvancedPlot';
import { curveModel, MODES, applicationMetrics, revolutionVolume, type Parameters, type CurveModel } from '@/lib/advanced-calculus';

const defaults=(id:number):Parameters=>({a:id===8||id===19?2:1,b:id===21?0.4:id===13?0:1,c:id===13?2:1,C:0,left:0,right:id===21?1:2});
const areaPath=(f:(x:number)=>number,left:number,right:number,X:(x:number)=>number,Y:(y:number)=>number)=>`M${X(left)},${Y(0)} `+Array.from({length:101},(_,i)=>{const x=left+(right-left)*i/100;return `L${X(x)},${Y(f(x))}`;}).join(' ')+` L${X(right)},${Y(0)} Z`;

export function AdvancedVisualizer({id}:{id:number}) {
  const [mode,setMode]=useState(0);
  const [p,setP]=useState<Parameters>(()=>defaults(id));
  const [axis,setAxis]=useState<'X'|'Y'>('X');
  const update=(key:keyof Parameters,value:number)=>setP(old=>({...old,[key]:value}));
  const model=curveModel(id,mode,p);
  const metrics=id===20?applicationMetrics(p,mode):undefined;
  const sliders=(['a','b','c'] as const).filter(key=>key==='a'||(key==='b'&&[7,8,9,10,13,15,17,20,21].includes(id))||(key==='c'&&[13,15].includes(id)));
  const transformed:CurveModel|undefined=id===7?{f:mode===0?u=>u*u:u=>Math.exp(u),F:mode===0?u=>u**3/3+p.C:u=>Math.exp(u)+p.C,domain:[p.b,p.a*1.5**2+p.b],latex:String.raw`u=ax^2+b`,primitive:'',note:''}:id===19?{f:mode===0?t=>2/((p.a+1)+(p.a-1)*t*t):t=>2/(p.a*(1+t*t)+2*t),F:t=>model.F(2*Math.atan(t)),domain:[-4,4],latex:String.raw`t=\tan(x/2)`,primitive:'',note:''}:undefined;
  const integral=id===7?model.F(1.5)-model.F(0):undefined;
  const controls=<div className="min-w-0 space-y-5">
    <div className="overflow-x-auto text-sm"><TexBlock>{model.latex}</TexBlock><TexBlock>{model.primitive}</TexBlock></div>
    {sliders.map(key=>{
      const min=key==='a'?(id===8||id===19?1.2:0.5):key==='b'?(id===13?-4:id===21?0:0.5):id===13?-3:0.5;
      const max=key==='b'&&id===21?0.8:key==='c'?5:4;
      return <NumberSlider key={key} label={key==='a'&&id===8&&mode===0?'Base a':`Coeficiente ${key}`} value={p[key]} min={min} max={max} step={0.1} onChange={v=>update(key,v)} display={p[key].toFixed(1)}/>;
    })}
    {id<20&&<NumberSlider label="Constante C" value={p.C} min={-3} max={3} step={0.25} onChange={v=>update('C',v)}/>}
    {(id===20||id===21)&&<><NumberSlider label="Límite inferior" value={p.left} min={0} max={p.right-0.1} step={0.1} onChange={v=>update('left',Math.min(v,p.right-0.1))}/><NumberSlider label="Límite superior" value={p.right} min={p.left+0.1} max={id===21?2:4} step={0.1} onChange={v=>update('right',Math.max(v,p.left+0.1))}/></>}
    {id===21&&<div><p className="mb-2 text-xs font-semibold text-muted-foreground">Eje de rotación</p><div className="flex gap-2">{(['X','Y'] as const).map(value=><Button key={value} variant={axis===value?'default':'outline'} size="sm" aria-pressed={axis===value} onClick={()=>setAxis(value)}>Eje {value}</Button>)}</div></div>}
    <p className="text-xs text-muted-foreground">{model.note}</p>
  </div>;
  return <div className="space-y-5">
    <div className="flex flex-wrap gap-2">{(MODES[id]??[]).map((label,i)=><Button key={label} className="h-auto min-h-8 whitespace-normal text-left" size="sm" variant={mode===i?'default':'outline'} aria-pressed={mode===i} onClick={()=>setMode(i)}>{label}</Button>)}</div>
    <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_260px]">
      <AdvancedPlot model={model} caption={id===21?`Región en coordenadas ${axis==='X'?'(x, y)':'(y, x)'}; corte ${mode===2?'paralelo':'perpendicular'} al eje ${axis}.`:'f(x) continua · F(x) + C discontinua'} overlay={(X,Y)=>{
        if(id===20&&metrics) return <><path d={areaPath(model.f,p.left,p.right,X,Y)} className="fill-fill" opacity="0.12"/><path d={Array.from({length:101},(_,i)=>{const x=p.left+(p.right-p.left)*i/100;return `${i?'L':'M'}${X(x)},${Y(model.f(x))}`;}).join(' ')} className="stroke-highlight" fill="none" strokeWidth="5"/><path d={`M${X(p.left)},${Y(metrics.average)}H${X(p.right)}`} className="stroke-primary" strokeWidth="2"/></>;
        if(id===7) return <path d={areaPath(model.f,0,1.5,X,Y)} className="fill-fill" opacity="0.2"/>;
        if(id===10) return <path d={areaPath(model.f,0,Math.PI,X,Y)} className="fill-fill" opacity="0.16"/>;
        if(id===21) {const inner=mode===0?0:p.b;return <polygon points={`${X(p.left)},${Y(p.a*p.left)} ${X(p.right)},${Y(p.a*p.right)} ${X(p.right)},${Y(inner*p.a*p.right)} ${X(p.left)},${Y(inner*p.a*p.left)}`} className="fill-fill" opacity="0.25"/>;}
        return null;
      }}/>{controls}
    </div>
    {transformed&&<><Formula>{id===7?String.raw`\int_0^{1.5} f(g(x))g'(x)\,dx=\int_b^{2.25a+b} f(u)\,du`:mode===0?String.raw`\frac{dx}{a+\cos x}=\frac{2\,dt}{(a+1)+(a-1)t^2}`:String.raw`\frac{dx}{a+\sin x}=\frac{2\,dt}{a(1+t^2)+2t}`}</Formula><AdvancedPlot model={transformed} caption={id===7?'Variable u: f(u) y su antiderivada; el área orientada es la misma.':'Variable t: integrando racional, incluido el factor dx/dt, y su antiderivada.'} overlay={id===7?(X,Y)=><path d={areaPath(transformed.f,transformed.domain[0],transformed.domain[1],X,Y)} className="fill-fill" opacity="0.2"/>:undefined}/></>}
    {id===7&&<ResultGrid items={[{label:'Área en x',value:integral?.toFixed(6)??'—'},{label:'Área en u',value:transformed?(transformed.F(transformed.domain[1])-transformed.F(transformed.domain[0])).toFixed(6):'—'}]}/>}
    {id===14&&<PartsGeometry p={p} mode={mode}/>}
    {id===18&&<Triangle p={p} mode={mode}/>}
    {id===20&&metrics&&<ResultGrid items={[{label:'Longitud de arco',value:metrics.length.toFixed(6)},{label:'Valor promedio',value:metrics.average.toFixed(6)},{label:'Intervalo',value:`[${p.left.toFixed(1)}, ${p.right.toFixed(1)}]`}]}/>}
    {id===21&&<><SolidProfile p={p} mode={mode} axis={axis}/><ResultGrid items={[{label:'Volumen',value:revolutionVolume(p,mode).toFixed(6),hint:'Unidades cúbicas'},{label:'Cortes',value:mode===2?(axis==='X'?'dy':'dx'):(axis==='X'?'dx':'dy')},{label:'Eje',value:axis}]}/><Formula>{mode===2?String.raw`V=2\pi\int_{\alpha}^{\beta}t\,[at-bat]\,dt`:mode===0?String.raw`V=\pi\int_{\alpha}^{\beta}(at)^2\,dt`:String.raw`V=\pi\int_{\alpha}^{\beta}[(at)^2-(bat)^2]\,dt`}</Formula><p className="text-xs text-muted-foreground"><Tex>{axis==='X'?(mode===2?String.raw`t=y,\quad x_{\mathrm{ext}}=at,\quad x_{\mathrm{int}}=bat`:String.raw`t=x,\quad y_{\mathrm{ext}}=at,\quad y_{\mathrm{int}}=bat`):(mode===2?String.raw`t=x,\quad y_{\mathrm{ext}}=at,\quad y_{\mathrm{int}}=bat`:String.raw`t=y,\quad x_{\mathrm{ext}}=at,\quad x_{\mathrm{int}}=bat`)}</Tex>. Al cambiar de eje, esta familia intercambia las coordenadas de la región; no rota la misma región alrededor de otro eje.</p></>}
  </div>;
}

function Triangle({p,mode}:{p:Parameters;mode:number}) {
  const [theta,setTheta]=useState(0.6);
  const angle=theta*Math.PI/2;
  const x=mode===0?p.a*Math.sin(angle):mode===1?p.a*Math.tan(angle):p.a/Math.cos(angle);
  const horizontal=mode===0?Math.sqrt(p.a*p.a-x*x):p.a;
  const vertical=mode===0?x:mode===1?x:Math.sqrt(x*x-p.a*p.a);
  const hyp=Math.hypot(horizontal,vertical),scale=240/Math.max(horizontal,vertical,hyp);
  const right=100+horizontal*scale,top=270-vertical*scale;
  return <div className="grid items-center gap-5 sm:grid-cols-2"><figure><svg viewBox="0 0 440 320" className="w-full rounded-lg border border-border bg-paper" role="img" aria-label="Triángulo rectángulo de la sustitución"><path d={`M100,270H${right}V${top}Z`} className="fill-accent stroke-primary" strokeWidth="2"/><path d={`M${right-12},270V258H${right}`} className="stroke-primary" fill="none"/><text x={(100+right)/2} y="295" textAnchor="middle" className="fill-foreground" fontSize="14">{horizontal.toFixed(3)}</text><text x={right+10} y={(270+top)/2} className="fill-foreground" fontSize="14">{vertical.toFixed(3)}</text><text x={(100+right)/2-22} y={(270+top)/2-12} className="fill-foreground" fontSize="14">{hyp.toFixed(3)}</text><text x="127" y="259" className="fill-primary" fontSize="16">θ</text></svg><figcaption className="mt-2 text-xs text-muted-foreground">Lados del triángulo: adyacente, opuesto e hipotenusa.</figcaption></figure><div className="space-y-4"><NumberSlider label="Ángulo θ (fracción de π/2)" value={theta} min={0.15} max={0.8} step={0.05} onChange={setTheta}/><ResultGrid items={[{label:'x',value:x.toFixed(4)},{label:'a',value:p.a.toFixed(4)}]}/><TexBlock>{mode===0?String.raw`\sin\theta=x/a`:mode===1?String.raw`\tan\theta=x/a`:String.raw`\sec\theta=x/a`}</TexBlock></div></div>;
}
function PartsGeometry({p,mode}:{p:Parameters;mode:number}) {
  // u=t, v=(e^(at)-1)/a or sin(at)/a; use a monotone positive branch.
  const end=mode===0?1:Math.PI/(3*p.a);
  const v=(t:number)=>mode===0?Math.expm1(p.a*t)/p.a:Math.sin(p.a*t)/p.a;
  const vmax=v(end),X=(t:number)=>60+t/end*380,Y=(y:number)=>260-y/vmax*220;
  const curve=Array.from({length:101},(_,i)=>{const t=end*i/100;return `${i?'L':'M'}${X(t)},${Y(v(t))}`;}).join(' ');
  const under=`${curve} L440,260 L60,260 Z`;
  return <div className="grid items-center gap-4 sm:grid-cols-2"><figure><svg viewBox="0 0 500 310" className="w-full rounded-lg border border-border bg-paper" role="img" aria-label="Rectángulo u por v dividido por la curva"><rect x="60" y="40" width="380" height="220" className="fill-highlight" opacity="0.25"/><path d={under} className="fill-fill" opacity="0.45"/><path d={curve} fill="none" className="stroke-primary" strokeWidth="2"/><text x="280" y="205" className="fill-foreground" fontSize="16">∫ v du</text><text x="165" y="78" className="fill-foreground" fontSize="16">∫ u dv</text><text x="445" y="280" className="fill-foreground">u</text><text x="30" y="40" className="fill-foreground">v</text></svg><figcaption className="mt-2 text-xs text-muted-foreground">Áreas complementarias dentro de u · v.</figcaption></figure><div><Formula>{String.raw`\int_0^{U}v\,du+\int_0^{V}u\,dv=UV`}</Formula><p className="mt-3 text-sm">{mode===0?'u = t, v = (eᵃᵗ − 1)/a':'u = t, v = sin(at)/a'} en una rama creciente. El área inferior representa ∫v du; la restante representa ∫u dv.</p></div></div>;
}
function SolidProfile({p,mode,axis}:{p:Parameters;mode:number;axis:'X'|'Y'}) {
  const max=p.a*p.right;
  const X=(t:number)=>80+t/2*500,R=(t:number)=>p.a*t/Math.max(max,1)*105;
  const inner=mode===0?0:p.b;
  const polygon=`${X(p.left)},${180-R(p.left)} ${X(p.right)},${180-R(p.right)} ${X(p.right)},${180+R(p.right)} ${X(p.left)},${180+R(p.left)}`;
  return <figure><svg viewBox="0 0 720 360" className="w-full rounded-lg border border-border bg-paper" role="img" aria-label={`Perfil de revolución por ${['discos','arandelas','cascarones'][mode]} alrededor de ${axis}`}><polygon points={polygon} className="fill-fill" opacity="0.2"/><path d={`M40,180H640`} className="stroke-foreground" strokeDasharray="5 5"/>{Array.from({length:9},(_,i)=>{const t=p.left+(p.right-p.left)*i/8;return <g key={i}><ellipse cx={X(t)} cy="180" rx={R(t)*0.22} ry={R(t)} className="stroke-primary" fill="none" opacity="0.7"/>{inner>0&&<ellipse cx={X(t)} cy="180" rx={R(t)*0.22*inner} ry={R(t)*inner} className="stroke-curve-2" fill="none" strokeDasharray="3 3"/>}</g>;})}<text x="650" y="185" className="fill-foreground" fontSize="16">{axis}</text><text x="80" y="328" className="fill-muted-foreground" fontSize="14">{mode===2?'Cascarón: radio t, altura at(1 − b)':'Cortes: radio exterior at'} · [{p.left.toFixed(1)}, {p.right.toFixed(1)}]</text></svg><figcaption className="mt-2 text-xs text-muted-foreground">{mode===2?'Perfil de la envolvente del sólido; los cascarones se integran en la coordenada radial t.':'Perfil de revolución con cortes circulares y radios interiores discontinuos.'}</figcaption></figure>;
}
