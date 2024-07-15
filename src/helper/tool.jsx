export const jsonToQueryParams = (json) => {
    return Object.entries(json)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
}