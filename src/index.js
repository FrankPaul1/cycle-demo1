import {run} from '@cycle/run'
import {makeDOMDriver} from '@cycle/dom'
import {App} from './app'

const main = App

const drivers = {
  BMIDOM: makeDOMDriver('#bw'),
}

run(main, drivers)
