<template>
  <transition name="modal">
    <div class="modal__mask">
      <div class="modal__wrapper">
        <div class="modal__container">
          <slot />
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'CoreModal',
};
</script>

<style lang="scss" scoped>
.modal {
  &__mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba($color: $base-color, $alpha: 0.5);
    display: table;
    transition: opacity 0.3s ease;
  }

  &__wrapper {
    display: flex;
    height: 100%;
  }

  &__container {
    display: flex;
    justify-content: center;
    margin: auto;
    padding: 1em 1.2em;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba($color: $base-color, $alpha: 0.5);
    transition: all 0.3s ease;
    font-family: Roboto, sans-serif;
  }
}

// animations
.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
