export { default as CombineArea } from './CombineArea.vue'
export { default as TreeCondition } from './TreeCondition.vue'
export { default as SingleCard } from './SingleCard.vue'

export default {
  install(app) {
    const components = {
      CombineArea: () => import('./CombineArea.vue'),
      TreeCondition: () => import('./TreeCondition.vue'),
      SingleCard: () => import('./SingleCard.vue')
    }
    Object.entries(components).forEach(([name, component]) => {
      app.component(name, component)
    })
  }
}
