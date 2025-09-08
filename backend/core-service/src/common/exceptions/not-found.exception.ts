import { DomainException } from './domain.exception';

export class NotFoundException extends DomainException {
  constructor(entityName: string, id: string) {
    super(`${entityName} with id ${id} not found`, 'NOT_FOUND');
  }
}