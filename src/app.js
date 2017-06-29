import {div, h1} from '@cycle/dom'
import xs from 'xstream'
import {html} from 'snabbdom-jsx'

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
      <div> BMI is {bmi} </div>
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

export function App ({ BMIDOM }) {
  // bw
  const actions = intent(BMIDOM)
  const state$ = model(actions)
  const bmidom$ = view(state$)

  const sinks = {
    BMIDOM: bmidom$,
    // or you can just write:
    // BMIDOM: view(model(intent(BMIDOM))),
  }
  return sinks
}
