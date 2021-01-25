export const isServerSideRendered = (): boolean =>
  typeof window === 'undefined';
