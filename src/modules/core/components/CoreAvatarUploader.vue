<template>
  <div
    ref="uploadRef"
    class="avt-placeholder text-center"
    :class="{ '--upload': !image, 'dragover': dragging }"
    @dragenter.prevent.stop="dragging = true"
    @dragover.prevent.stop="dragging = true"
    @dragleave.prevent.stop="dragging = false"
    @drop.prevent.stop="onDrop"
  >
    <span class="edit-wrap" @click="fileInputRef?.$el.click()">
      <core-svg :src="require('@/assets/icons/edit.svg')" title="edit" class="--no-stroke" />
    </span>
    <div class="wrapper" @click="fileInputRef?.$el.click()">
      <div v-show="!image">
        <img class="avatar-placeholder" src="@/assets/images/avatar-placeholder.png" alt="" />
      </div>
      <div v-show="!image">
        <v-field
          ref="fileInputRef"
          class="d-hidden"
          type="file"
          :name="name"
          rules="image"
          :multiple="false"
          accept="image/*"
          @change="onFileInputChange"
        />
      </div>
      <div v-show="image" class="preview">
        <button
          class="btn btn-danger --close"
          type="button"
          @click.stop="onClear"
        >
          <core-svg :width="16" class="icon" :src="require('@/assets/icons/delete.svg')" />
        </button>
        <img class="avatar" :src="image" alt="" />
      </div>
      <div class="overlay position-cover"></div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { Field, useField } from 'vee-validate';

export default {
  name: 'CoreAvatarUploader',
  props: {
    photoUrl: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      default: 'files',
    },
  },
  components: {
    VField: Field,
  },
  setup(props) {
    const { handleChange } = useField(props.name, null);

    const uploadRef = ref(null);
    const fileInputRef = ref(null);
    const file = ref(null);
    const dragging = ref(false);
    const image = ref(props.photoUrl);

    const handleFile = (fileObj) => {
      file.value = fileObj;
      image.value = URL.createObjectURL(fileObj);
      handleChange(fileObj);
    };

    const onDrop = (e) => {
      const { files: [fileObj] } = e.dataTransfer;

      dragging.value = false;

      if (fileObj) {
        handleFile(fileObj);
      }
    };

    const onFileInputChange = (e) => {
      const fileObj = e.target.files[0];

      if (fileObj) {
        handleFile(fileObj);
      }
    };

    const onClear = () => {
      image.value = null;
      file.value = null;
      handleChange('');
    };

    return {
      uploadRef,
      fileInputRef,
      image,
      dragging,
      onDrop,
      onFileInputChange,
      onClear,
    };
  },
};
</script>

<style lang="scss" scoped>
.avt-placeholder {
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0;
  height: 100%;
  box-sizing: border-box;
  cursor: pointer;
  position: relative;

  .d-hidden {
    display: none;
  }

  &.--upload {
    .wrapper {
      padding: 8px;
    }
  }

  .hint {
    font-size: 0.75rem;
  }

  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    box-sizing: border-box;
    width: 96px;
    height: 96px;
    border-radius: 50%;
    overflow: hidden;
    border: 1px solid rgba($color: $base-color, $alpha: 0.2);

    img.avatar-placeholder {
      width: 100% !important;
      height: 100% !important;
    }
  }

  .overlay {
    border: 1px dashed transparent;
    pointer-events: none;
    transition: background-color 0.15s ease-in-out;
  }

  &:hover,
  &.dragover {
    box-shadow: none;

    .overlay {
      border-color: rgba($alt-color, 0.2);
      background-color: rgba($base-color, 0.1);
    }
  }
}
.preview {
  position: relative;
  height: 150px;
  width: 100%;

  .--close {
    opacity: 0;
    position: absolute;
    top: 4px;
    right: 4px;
    height: 24px;
    width: 24px;
    border-radius: 50%;
    padding: 0;
    line-height: unset;
    min-width: unset;
    z-index: 3;
    transition: opacity 0.15s ease-in-out;

    .icon {
      margin: 0;
    }
  }

  &:hover {
    .--close {
      opacity: 1;
    }
  }
}
.avatar {
  width: 100%;
  height: 100%;
  object-fit: contain;

  &-placeholder {
    width: 100%;
  }
}

.edit-wrap {
  position: absolute;
  bottom: -6px;
  z-index: 11;
  right: 0;
  background-color: white;
  width: 36px;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
}

.form-custom input[type=file] {
  font-size: inherit;
}
</style>
