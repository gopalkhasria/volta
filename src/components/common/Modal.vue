<template>
  <Transition name="modal">
    <div v-if="isVisible" class="modal-overlay" @click="handleOverlayClick">
      <div class="modal-container">
        <div class="modal-content" :class="{ 'error': isError }" @click.stop>
          <FontAwesomeIcon
              :icon="isError ? 'exclamation-triangle' : 'check-circle'"
              class="icon"
              :class="{ 'error': isError }"
          />
          <p class="message">{{ message }}</p>
          <div class="timer-bar">
            <div
                class="timer-progress"
                :style="{ width: `${progressPercentage}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue'

export default defineComponent({
  name: 'ModalNotification',
  props: {
    message: {
      type: String,
      required: true
    },
    isError: {
      type: Boolean,
      default: false
    },
    timeout: {
      type: Number,
      default: 3000
    }
  },
  emits: ['close'],
  setup(props, { emit }) {
    const isVisible = ref(true)
    const progressPercentage = ref(100)
    let timer: number | undefined
    let animationTimer: number | undefined

    const closeModal = () => {
      isVisible.value = false
      emit('close')
    }

    const handleOverlayClick = (event: MouseEvent) => {
      if (event.target === event.currentTarget) {
        closeModal()
      }
    }

    onMounted(() => {
      const duration = props.timeout || 3000
      const updateInterval = 10

      timer = window.setTimeout(() => {
        closeModal()
      }, duration)

      const startTime = Date.now()
      const updateProgress = () => {
        const elapsed = Date.now() - startTime
        progressPercentage.value = Math.max(0, 100 - (elapsed / duration) * 100)

        if (elapsed < duration) {
          animationTimer = window.setTimeout(updateProgress, updateInterval)
        }
      }

      updateProgress()
    })

    onBeforeUnmount(() => {
      if (timer) window.clearTimeout(timer)
      if (animationTimer) window.clearTimeout(animationTimer)
    })

    return {
      isVisible,
      progressPercentage,
      handleOverlayClick
    }
  }
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  max-width: 90%;
  margin: 0 auto;
}

.modal-content {
  background-color: #ffffff;
  padding: 15px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 300px;
  position: relative;
}

.icon {
  font-size: 20px;
  color: #4caf50;
}

.icon.error {
  color: #f44336;
}

.message {
  margin: 0;
  color: #333333;
}

.timer-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background-color: #e0e0e0;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  overflow: hidden;
}

.timer-progress {
  height: 100%;
  background-color: #4caf50;
  transition: width 10ms linear;
}

.modal-content.error .timer-progress {
  background-color: #f44336;
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.modal-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>