import { Error as FieldError } from '../../resolvers/user.resolver';

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
