export function base64ToImageSrc(type?: string, data_base64?: string) {
  return type && data_base64 ? `data:${type};base64,${data_base64}` : undefined;
}
