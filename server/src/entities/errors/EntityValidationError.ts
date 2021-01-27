import FieldError from '../../resolvers/responses/error.response';
class EntityValidationError extends Error {
  private errors: FieldError[];
  constructor(errors: FieldError[]) {
    super();
    this.errors = errors;
  }

  getFieldErrors(): FieldError[] {
    return this.errors;
  }
}

export default EntityValidationError;
