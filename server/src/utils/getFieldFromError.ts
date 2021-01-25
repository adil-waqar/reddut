const getFieldFromError = (e: any) => {
  const field = e.detail;
  return field.substring(field.indexOf('(') + 1, field.indexOf(')'));
};

export default getFieldFromError;
