import {run} from '@cycle/run'
import {makeDOMDriver} from '@cycle/dom'
// import {App} from './app'
import {App} from './drag'

const main = App

const drivers = {
  DOM: makeDOMDriver('#app'),
  BWDOM: makeDOMDriver('#bw'),
  LabelDOM: makeDOMDriver('#label'),
}

run(main, drivers)
