<template>
  <section class="single-card">
    <div class="single-card__content">
      <div class="single-card__header">
        <span class="single-card__title">{{ labelName }}</span>
        <div class="single-card__actions">
          <button class="action-btn" @click="handleExpand" title="扩展为条件组">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <line x1="12" y1="8" x2="12" y2="16"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
          </button>
          <button class="action-btn action-btn--del" @click="handleDel" title="删除">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>
      <p class="single-card__desc">{{ labelDesc }}</p>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  tag: Object,
  tree: Object,
  level: Number
})

const emit = defineEmits(['onExpand', 'onDel'])

let groupId = ref(0)

const labelName = computed(() => props.tag.name)
const labelDesc = computed(() => props.tag.valueDesc)

const handleExpand = () => {
  emit('onExpand', { ...props.tag, level: props.level, groupId: groupId.value })
  groupId.value++
}

const handleDel = () => {
  emit('onDel', props.tag)
}
</script>

<style lang="scss" scoped>
$gray-100: #f4f4f5;
$gray-200: #e8e8ec;
$gray-300: #d8d8de;
$gray-400: #c0c0c8;
$gray-500: #98989e;
$gray-600: #6e6e76;
$gray-700: #505058;
$gray-800: #32323a;

.single-card {
  width: 100%;
  background: #fff;
  border: 1px solid $gray-200;
  border-radius: 6px;
  padding: 12px 14px;
  margin-bottom: 6px;
  transition: all 0.15s ease;
  cursor: grab;

  &:hover {
    border-color: $gray-400;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  }

  &:active {
    cursor: grabbing;
  }

  &__content {
    width: 100%;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
  }

  &__title {
    font-size: 13px;
    font-weight: 500;
    color: $gray-800;
  }

  &__desc {
    font-size: 11px;
    color: $gray-500;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__actions {
    display: flex;
    gap: 4px;
  }
}

.action-btn {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $gray-100;
  border: none;
  border-radius: 4px;
  color: $gray-500;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: $gray-200;
    color: $gray-700;
  }

  &--del:hover {
    background: $gray-200;
    color: $gray-800;
  }
}
</style>
