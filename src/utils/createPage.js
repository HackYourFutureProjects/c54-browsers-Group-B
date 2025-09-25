export const createPage = (className, content) => {
  const el = document.createElement('div');
  if (className) el.className = className;
  el.innerHTML = content;
  return el;
};
