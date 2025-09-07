import { DomainException } from './domain.exception';

export class ValidationException extends DomainException {
  constructor(message: string, public readonly errors: string[] = []) {
    super(message, 'VALIDATION_ERROR');
  }
}