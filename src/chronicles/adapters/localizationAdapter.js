export function createLocalizationPort(strings = {}) {
  return {
    text(key, params = {}) {
      const template = strings[key] || key;
      return Object.entries(params).reduce((text, [name, value]) => {
        return text.replaceAll(`{${name}}`, String(value));
      }, template);
    },
  };
}

