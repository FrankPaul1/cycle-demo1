import {div, h1} from '@cycle/dom'
import xs from 'xstream'
import sampleCombine from 'xstream/extra/sampleCombine'
import {html} from 'snabbdom-jsx'
import isolate from '@cycle/isolate'
import Label from './label'

const INCREASE = 'increase'
const DECREASE = 'decrease'
const INCREASEIFODD = 'increaseIfOdd'

function renderWeight(w) {
  return (
    <div>
      Weight ${w}kg <input className="weight" type="range" min="40" max="140" value={w} />
    </div>
  )
}

function renderHeight(h) {
  return (
    <div>
      Height ${h}cm <input className="height" type="range" min="140" max="210" value={h} />
    </div>
  )
}

function computeBMI(w, h) {
  const heightMeters = h * 0.01
  return Math.round(w / (heightMeters * heightMeters))
}

function view(state$) {
  return state$.map(({ w, h, bmi }) => (
    <div>
      {renderWeight(w)}
      {renderHeight(h)}
      <div> BW is {bmi} </div>
    </div>
  ))
}

function model({
  changeWeight$,
  changeHeight$,
}) {
  const weight$ = changeWeight$.startWith(70)
  const height$ = changeHeight$.startWith(170)

  return xs
    .combine(
      weight$,
      height$
    )
    .map(([w, h]) => ({ w, h, bmi: computeBMI(w, h) }))
}

function intent(domSource) {
  return {
    changeWeight$: domSource.select('.weight').events('input').map(e => e.target.value),
    changeHeight$: domSource.select('.height').events('input').map(e => e.target.value),
  }
}

export function App ({ DOM, BWDOM, LabelDOM }) {
  // counter
  const increase$ = DOM.select('#increase').events('click').mapTo(INCREASE)
  const decrease$ = DOM.select('#decrease').events('click').mapTo(DECREASE)
  const increaseIfOdd$ = DOM.select('#increaseIfOdd').events('click').mapTo(INCREASEIFODD)

  const count$ = xs
    .merge(
      increase$,
      decrease$,
      increaseIfOdd$
    )
    .fold((x, y) => {
      switch (y) {
        case INCREASE:
          return x + 1
        case DECREASE:
          return x - 1
        case INCREASEIFODD:
          return x % 2 === 0 ? (x + 1) : x
      }
    }, 2)

  const vdom$ = count$.map((c) => (
    <div>
      <button id="increaseIfOdd"> ++ </button>
      <button id="increase"> + </button>
      <button id="decrease"> - </button>
      <br />
      Counter: {c}
    </div>
  ))

  // bw
  // const actions = intent(BWDOM)
  // const state$ = model(actions)
  // const bwdom$ = view(state$)

  // label
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
    DOM: vdom$,
    BWDOM: view(model(intent(BWDOM))),
    LabelDOM: label$,
  }
  return sinks
}
