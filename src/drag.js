import xs from 'xstream'
import {html} from 'snabbdom-jsx'

function intent(DOM) {
  const down$ = DOM.select('#rect').events('mousedown')
  const move$ = DOM.select('#rect').events('mousemove')
  const up$ = DOM.select('#rect').events('mouseup')

  const pos$ = down$
    .map(() => move$
      .map(e => {
        const left = parseInt(e.target.style.left)
        const top = parseInt(e.target.style.top)
        return { x: e.clientX, y: e.clientY, left, top }
      })
      .endWhen(up$)
    )
    .flatten()
  
  return { pos$ }
}

function model({
  pos$,
}) {
  return pos$
    .fold((final, each) => {
      if (final.x) {
        const { x, y } = each
        
        return {
          left: final.left + x - final.x,
          top: final.top + y - final.y,
          x,
          y,
        }
      }
      return each
    }, {
      left: 100,
      top: 100,
    })
}

function view(state$) {
  return state$.map(({
    left,
    top,
  }) => (
    <div>
      <div
        id="rect"
        style={{
          position: 'absolute',
          top: `${top}px`,
          left: `${left}px`,
          width: '100px',
          height: '100px',
          backgroundColor: 'red',
        }}
      />
    </div>
  ))
}

export function App({ DOM }) {
  const actions = intent(DOM)
  const state$ = model(actions)
  const dom$ = view(state$)

  return {
    DOM: dom$,
  }
}
