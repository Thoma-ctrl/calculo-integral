import { useId, type ReactNode } from 'react';
import type { CurveModel } from '@/lib/advanced-calculus';
export function AdvancedPlot({ model, caption, overlay }: { model: CurveModel; caption: string; overlay?: ((X:(x:number)=>number,Y:(y:number)=>number)=>ReactNode) | undefined }) {
  const clip=useId();
  const [lo,hi]=model.domain;
  const xs=Array.from({length:501},(_,i)=>lo+(hi-lo)*i/500);
  const vals=xs.flatMap(x=>[model.f(x),model.F(x)]).filter(Number.isFinite).sort((a,b)=>a-b);
  const lower=vals[Math.floor(vals.length*0.03)]??-1,upper=vals[Math.floor(vals.length*0.97)]??1;
  const span=Math.max(upper-lower,1), ymin=Math.min(0,lower)-span*0.15,ymax=Math.max(0,upper)+span*0.15;
  const X=(x:number)=>48+(x-lo)/(hi-lo)*646,Y=(y:number)=>306-(y-ymin)/(ymax-ymin)*282;
  const path=(f:(x:number)=>number)=>{let connected=false;let prev=0;let prevX=lo;return xs.map(x=>{const y=f(x);if(!Number.isFinite(y)||y<ymin||y>ymax){connected=false;return '';} const crossedPole=model.poles?.some(pole=>pole>=prevX&&pole<=x);const move=!connected||crossedPole||Math.abs(y-prev)>span*0.45;connected=true;prev=y;prevX=x;return `${move?'M':'L'}${X(x)},${Y(y)}`;}).join(' ');};
  return <figure className="min-w-0"><svg role="img" aria-label={caption} viewBox="0 0 720 340" className="w-full rounded-lg border border-border bg-paper"><defs><clipPath id={clip}><rect x="48" y="24" width="646" height="282"/></clipPath></defs>
    {Array.from({length:6},(_,i)=>{const x=lo+(hi-lo)*i/5,y=ymin+(ymax-ymin)*i/5;return <g key={i}><path d={`M${X(x)},24V306 M48,${Y(y)}H694`} className="stroke-grid" fill="none"/><text x={X(x)} y="326" textAnchor="middle" className="fill-muted-foreground font-mono" fontSize="10">{x.toFixed(1)}</text><text x="42" y={Y(y)+4} textAnchor="end" className="fill-muted-foreground font-mono" fontSize="10">{y.toFixed(1)}</text></g>;})}
    <g clipPath={`url(#${clip})`}><path d={`M48,${Y(0)}H694`} className="stroke-foreground"/>{overlay?.(X,Y)}{model.poles?.map((x,i)=><path key={i} d={`M${X(x)},24V306`} className="stroke-highlight" strokeDasharray="4 4"/>)}<path d={path(model.F)} className="stroke-curve-2" fill="none" strokeWidth="2" strokeDasharray="6 4"/><path d={path(model.f)} className="stroke-curve" fill="none" strokeWidth="2.4"/></g>
    </svg><figcaption className="mt-2 text-xs text-muted-foreground">{caption}</figcaption></figure>;
}
