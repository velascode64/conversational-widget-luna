export function isScrollToBottom(element: Element, watchAreaOffset: number) {
  return (
    element.scrollHeight - (element.clientHeight + element.scrollTop) <=
    watchAreaOffset
  );
}
