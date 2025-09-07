import { DomainException } from './domain.exception';

export class ParamRequiredException extends DomainException {
  constructor(paramName: string) {
    super(`${paramName} is required`, 'PARAM_REQUIRED_ERROR');
  }
}