import { ADVANCED_LESSONS } from '@/data/advanced-lessons';
import { Section, Formula, StepExample } from '@/components/module-ui';
import { AdvancedVisualizer } from './AdvancedVisualizer';
export function AdvancedModule({id}:{id:number}) {
  const lesson=ADVANCED_LESSONS.find(item=>item.id===id);
  if(!lesson) return null;
  return <div className="space-y-6">
    <Section title="Explicación Teórica" eyebrow="Concepto y método"><p>{lesson.concept}</p><p><strong>Cuándo aplicarlo. </strong>{lesson.when}</p><ol className="list-decimal space-y-2 pl-5">{lesson.procedure.map(step=><li key={step}>{step}</li>)}</ol></Section>
    <Section title="Fórmulas Clave" eyebrow="Notación matemática">{lesson.formulas.map(formula=><Formula key={formula}>{formula}</Formula>)}</Section>
    <Section title="Visualizador Interactivo" eyebrow="Exploración"><AdvancedVisualizer id={id}/></Section>
    <Section title="2 Ejemplos Resueltos Paso a Paso" eyebrow="Desarrollo algebraico">{lesson.examples.map(example=><StepExample key={example.title} {...example}/>)}</Section>
  </div>;
}
