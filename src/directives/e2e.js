export default {
  beforeMount(el, binding) {
    if (process.env.NODE_ENV !== 'production') {
      const value = binding.value || binding.arg;

      let { name, tagName } = el;

      switch (tagName) {
        case 'A':
          tagName = 'link';
          break;

        case 'BUTTON':
          if (!name && el.type === 'submit') {
            name = 'submit';
          }
          break;

        default:
          break;
      }

      el.setAttribute('data-cy', [
        tagName.toLowerCase(), name, value,
      ].filter(Boolean).join('-'));
    }
  },
};
