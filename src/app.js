import {div, h1} from '@cycle/dom'
import xs from 'xstream'
import sampleCombine from 'xstream/extra/sampleCombine'
import {html} from 'snabbdom-jsx'
import isolate from '@cycle/isolate'
import Label from './label'

function computeBMI(w, h) {
  const heightMeters = h * 0.01
  return Math.round(w / (heightMeters * heightMeters))
}

export function App ({ DOM, BWDOM, LabelDOM }) {
  const weightProps$ = xs.of({
    label: 'Weight', unit: 'kg', min: 40, value: 70, max: 150,
  })
  const heightProps$ = xs.of({
    label: 'Height', unit: 'cm', min: 140, value: 170, max: 210,
  })
  const WeightLabel = isolate(Label)({ DOM: LabelDOM, props: weightProps$ })
  const HeightLabel = isolate(Label)({ DOM: LabelDOM, props: heightProps$ })

  const bmi$ = xs
    .combine(WeightLabel.value, HeightLabel.value)
    .map(([w, h]) => computeBMI(w, h))
    .remember()

  const label$ = xs
    .combine(bmi$, WeightLabel.DOM, HeightLabel.DOM)
    .map(([bmi, WeightDOM, HeightDOM]) => 
      div([
        WeightDOM,
        HeightDOM,
        h1('BMI is ' + bmi)
      ])
    )

  const sinks = {
    LabelDOM: label$,
  }
  return sinks
}
