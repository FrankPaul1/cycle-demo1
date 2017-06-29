import {div, h1} from '@cycle/dom'
import xs from 'xstream'
import {html} from 'snabbdom-jsx'

const INCREASE = 'increase'
const DECREASE = 'decrease'
const INCREASEIFODD = 'increaseIfOdd'

export function App ({ DOM }) {
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

  const sinks = {
    DOM: vdom$,
  }
  return sinks
}
