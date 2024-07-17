export const jsonToQueryParams = (json) => {
    return Object.entries(json)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
}

export const formatFormalDate = (deliveryAt) => {
  return new Date(deliveryAt).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
  });
};
