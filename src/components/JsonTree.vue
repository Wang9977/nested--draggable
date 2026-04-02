<template>
  <div class="json-viewer">
    <JsonNode :value="localValue" :path="'root'" :collapsed="collapsedPaths" @toggle="onToggle" />
  </div>
</template>

<script>
import { h, defineComponent, ref, watch } from 'vue'

const JsonNode = defineComponent({
  name: 'JsonNode',
  props: {
    value: { type: null, required: true },
    path: { type: String, default: '' },
    collapsed: { type: Set, required: true }
  },
  emits: ['toggle'],
  setup(props, { emit }) {
    const isObject = (val) => val !== null && typeof val === 'object'
    
    const renderPrimitive = (val) => {
      if (val === null) return h('span', { class: 'json-null' }, 'null')
      if (typeof val === 'string') return h('span', { class: 'json-string' }, `"${val}"`)
      if (typeof val === 'number') return h('span', { class: 'json-number' }, String(val))
      if (typeof val === 'boolean') return h('span', { class: 'json-boolean' }, String(val))
      return null
    }

    const renderNode = (val, path, depth) => {
      if (!isObject(val)) return renderPrimitive(val)

      const isArray = Array.isArray(val)
      const keys = Object.keys(val)
      const count = keys.length
      const isCollapsed = props.collapsed.has(path)
      const open = isArray ? '[' : '{'
      const close = isArray ? ']' : '}'
      const indent = h('span', { class: 'json-indent', style: { width: `${depth * 20}px` } })

      const children = isCollapsed ? [] : keys.map((key, idx) => {
        const childVal = val[key]
        const childPath = `${path}.${key}`
        const isChildObj = isObject(childVal)
        const childIndent = h('span', { class: 'json-indent', style: { width: `${(depth + 1) * 20}px` } })
        const label = isArray ? null : [h('span', { class: 'json-key' }, `"${key}"`), h('span', { class: 'json-colon' }, ': ')]

        if (isChildObj) {
          const childIsArr = Array.isArray(childVal)
          const childCollapsed = props.collapsed.has(childPath)
          const childCount = Object.keys(childVal).length
          const childOpen = childIsArr ? '[' : '{'
          const childClose = childIsArr ? ']' : '}'

          return h('div', { class: 'json-line' }, [
            childIndent,
            ...label,
            h('span', { class: 'json-bracket-toggle', onClick: () => emit('toggle', childPath) }, childOpen),
            childCollapsed ? h('span', { class: 'json-ellipsis' }, ` ${childCount} items `) : null,
            childCollapsed ? h('span', { class: 'json-bracket' }, childClose) : null,
            !childCollapsed && idx < count - 1 ? h('span', { class: 'json-comma' }, ',') : null
          ])
        }

        return h('div', { class: 'json-line' }, [
          childIndent,
          ...label,
          renderPrimitive(childVal),
          idx < count - 1 ? h('span', { class: 'json-comma' }, ',') : null
        ])
      })

      return h('div', { class: 'json-branch' }, [
        h('div', { class: 'json-line' }, [
          indent,
          h('span', { class: 'json-bracket-toggle', onClick: () => emit('toggle', path) }, open),
          isCollapsed ? h('span', { class: 'json-ellipsis' }, ` ${count} items `) : null,
          isCollapsed ? h('span', { class: 'json-bracket' }, close) : null
        ]),
        ...children,
        !isCollapsed ? h('div', { class: 'json-line' }, [
          indent,
          h('span', { class: 'json-bracket' }, close)
        ]) : null
      ])
    }

    return () => renderNode(props.value, props.path, 0)
  }
})

export default {
  components: { JsonNode },
  props: {
    value: { type: Object, required: true }
  },
  setup(props) {
    const localValue = ref(props.value ? JSON.parse(JSON.stringify(props.value)) : {})

    watch(
      () => JSON.stringify(props.value),
      (newStr) => {
        if (newStr) localValue.value = JSON.parse(newStr)
      }
    )

    const collapsedPaths = ref(new Set())

    const onToggle = (path) => {
      const next = new Set(collapsedPaths.value)
      if (next.has(path)) next.delete(path)
      else next.add(path)
      collapsedPaths.value = next
    }

    return { localValue, collapsedPaths, onToggle }
  }
}
</script>

<style scoped>
.json-viewer {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
  line-height: 1.6;
  color: #24292e;
}
.json-line { white-space: nowrap; }
.json-indent { display: inline-block; }
.json-bracket-toggle {
  cursor: pointer; color: #666; font-weight: 600; user-select: none; padding: 0 2px;
}
.json-bracket-toggle:hover { color: #1890ff; }
.json-bracket { color: #666; font-weight: 600; }
.json-ellipsis { color: #999; font-style: italic; padding: 0 4px; }
.json-key { color: #d63384; }
.json-colon { color: #666; }
.json-string { color: #22863a; }
.json-number { color: #005cc5; }
.json-boolean { color: #e36209; }
.json-null { color: #6a737d; }
.json-comma { color: #666; }
.json-branch { display: inline-block; width: 100%; }
</style>