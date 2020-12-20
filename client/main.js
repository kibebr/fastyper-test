import { addWordNodeComponent } from './components/WordNode.js'
import { addForwardComponent } from './components/Forward.js'
import { addPositionComponent } from './components/Position.js'
import { pipeArr, spec, map, prop, getRandomNumFromRange } from './utils.js'

class MoveForwardSystem {
  static run = entity => ({
    ...entity,
    components: {
      ...entity.components,
      position: {
        ...entity.components.position,
        x: entity.components.position.x + 1
      }
    }
  })
}

const systems = [MoveForwardSystem]
const getRuns = map(prop('run'))

export const createNormalWordNode = word => ({}
  |> addWordNodeComponent(word)
  |> addPositionComponent({ x: 0, y: getRandomNumFromRange(10, 400) })
  |> addForwardComponent
)

export const nextState = spec({
  wordNodes: map(pipeArr(getRuns(systems)))
})
