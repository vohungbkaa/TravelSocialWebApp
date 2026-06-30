<template>
  <div class="custom-select-container" ref="containerRef" :class="{ 'is-disabled': disabled }">
    <button
      type="button"
      class="custom-select-trigger"
      :class="{ 
        'has-error': hasError, 
        'placeholder-active': modelValue === undefined || modelValue === null || modelValue === '',
        'size-sm': size === 'sm'
      }"
      @click="toggleDropdown"
      :disabled="disabled"
    >
      <span class="selected-value-label">{{ selectedLabel || placeholder }}</span>
      <span class="chevron-arrow">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </span>
    </button>
    
    <Transition name="select-dropdown-fade">
      <div v-if="isOpen" class="custom-select-dropdown">
        <div class="custom-select-options-list">
          <div
            v-for="option in options"
            :key="option.value"
            class="custom-select-option"
            :class="{ 'is-selected': option.value === modelValue, 'size-sm': size === 'sm' }"
            @click="selectOption(option.value)"
          >
            <span>{{ option.label }}</span>
            <svg v-if="option.value === modelValue" class="check-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

interface Option {
  value: any;
  label: string;
}

const props = withDefaults(defineProps<{
  modelValue: any;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
  hasError?: boolean;
  size?: 'sm' | 'md';
}>(), {
  placeholder: 'Chọn...',
  disabled: false,
  hasError: false,
  size: 'md'
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void;
  (e: 'change', value: any): void;
}>();

const isOpen = ref(false);
const containerRef = ref<HTMLElement | null>(null);

const selectedLabel = computed(() => {
  const selectedOption = props.options.find(o => o.value === props.modelValue);
  return selectedOption ? selectedOption.label : '';
});

const toggleDropdown = () => {
  if (!props.disabled) {
    isOpen.value = !isOpen.value;
  }
};

const selectOption = (value: any) => {
  emit('update:modelValue', value);
  emit('change', value);
  isOpen.value = false;
};

const handleClickOutside = (event: MouseEvent) => {
  if (containerRef.value && !containerRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  window.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.custom-select-container {
  position: relative;
  width: 100%;
}

.custom-select-trigger {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  background-color: var(--bg-card);
  color: var(--text-primary);
  text-align: left;
  cursor: pointer;
  transition: all var(--transition-normal);
  outline: none;
  min-height: 42px;
}

.custom-select-trigger:hover:not(:disabled) {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-light);
}

.custom-select-trigger:focus:not(:disabled) {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-light);
}

.custom-select-trigger.placeholder-active {
  color: var(--text-muted);
}

.custom-select-trigger.has-error {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.15) !important;
}

.chevron-arrow {
  display: flex;
  align-items: center;
  color: var(--text-muted);
  transition: transform var(--transition-normal);
}

.custom-select-container:focus-within .chevron-arrow {
  transform: rotate(180deg);
}

.custom-select-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  width: 100%;
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg), 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  z-index: 9999;
  max-height: 250px;
  overflow-y: auto;
  padding: 6px;
}

.custom-select-options-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.custom-select-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.custom-select-option:hover {
  background-color: var(--bg-hover);
  color: var(--primary);
}

.custom-select-option.is-selected {
  background-color: var(--primary-light);
  color: var(--primary);
  font-weight: 600;
}

.check-icon {
  flex-shrink: 0;
}

.is-disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Scrollbar styling for dropdown */
.custom-select-dropdown::-webkit-scrollbar {
  width: 6px;
}

.custom-select-dropdown::-webkit-scrollbar-track {
  background: transparent;
}

.custom-select-dropdown::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 3px;
}

.custom-select-dropdown::-webkit-scrollbar-thumb:hover {
  background: var(--text-muted);
}

/* Animations */
.select-dropdown-fade-enter-active {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
.select-dropdown-fade-leave-active {
  transition: all 0.15s cubic-bezier(0.16, 1, 0.3, 1);
}
.select-dropdown-fade-enter-from,
.select-dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
/* Small size overrides */
.custom-select-trigger.size-sm {
  padding: 8px 12px;
  font-size: 0.825rem;
  min-height: 34px;
  border-radius: var(--radius-sm);
}

.custom-select-option.size-sm {
  padding: 6px 10px;
  font-size: 0.825rem;
}
</style>
