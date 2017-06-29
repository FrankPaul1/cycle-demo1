import {run} from '@cycle/run'
import {makeDOMDriver} from '@cycle/dom'
import {App} from './app'

const main = App

const drivers = {
  LabelDOM: makeDOMDriver('#label'),
}

run(main, drivers)
