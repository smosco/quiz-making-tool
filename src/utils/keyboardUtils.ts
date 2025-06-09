export const isMac = () => {
  return (
    typeof navigator !== 'undefined' &&
    navigator.userAgent.toUpperCase().indexOf('MAC') >= 0
  );
};

export const getModifierKey = () => {
  return isMac() ? 'metaKey' : 'ctrlKey';
};

export const getModifierSymbol = () => {
  return isMac() ? '⌘' : 'Ctrl';
};
