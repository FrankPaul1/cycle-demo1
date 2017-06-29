import xs from 'xstream'
import {html} from 'snabbdom-jsx'

function view(state$) {
  return state$.map(({
    value = 0,
    max,
    min,
    unit,
    label,
  }) => (
    <div>
      {label} {value} {unit}
      <input
        className="label"
        type="range"
        min={min}
        max={max}
        value={value}
      />
    </div>
  ))
}

function model({
  valueChange$,
}, props$) {
  return props$
    .map(props => valueChange$
      .map(val => ({
        label: props.label,
        unit: props.unit,
        min: props.min,
        value: val,
        max: props.max,
      }))
      .startWith(props)
    )
    .flatten()
    .remember()
}

function intent(DOM) {
  return {
    valueChange$: DOM.select('input.label').events('input').map(ev => ev.target.value)
  }
}

export default function Label({ DOM, props }) {
  const state$ = model(intent(DOM), props)

  return {
    DOM: view(state$),
    value: state$.map(state => state.value),
  }
}
