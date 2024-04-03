export const getClassName = (defaultName, additionalName) => {
  if (!!additionalName && typeof additionalName === "string") {
    return `${defaultName} ${additionalName}`;
  }
  return defaultName;
};

export const getStyle = (style) => {
  if (typeof style === "object") {
    return style;
  }
  return {};
};

export const getProps = (props, del_list=["children","className","style"]) => {
  const _props = { ...props };
  del_list.forEach(element => {
    delete _props[element]
  });
  return _props
};
