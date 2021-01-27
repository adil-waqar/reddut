import Error from 'src/resolvers/responses/error.response';
import { QueryFailedError } from 'typeorm';
import EntityValidationError from '../entities/errors/EntityValidationError';
import getFieldFromError from './getFieldFromError';

const handleException = (e: any): Error[] => {
  if (e instanceof QueryFailedError) {
    const exception = e as any;
    switch (exception.code) {
      case '23505':
        const field = getFieldFromError(e);
        return [
          {
            field,
            message: `${field} already exists`
          }
        ];

      default:
        return [
          {
            field: exception.code,
            message: 'unhandled query error'
          }
        ];
    }
  } else if (e instanceof EntityValidationError) {
    const fieldException = e as EntityValidationError;
    return fieldException.getFieldErrors();
  } else {
    return [
      {
        message: 'Internal server error'
      }
    ];
  }
};

export default handleException;
