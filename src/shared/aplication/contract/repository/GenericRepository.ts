export interface GenericRepository<T extends { id: number | string }> {
  findById(id: T['id']): Promise<T | null>;
  findAll(): Promise<T[]>;
  save(entity: T): Promise<T>;
  delete(id: T['id']): Promise<void>;
  findOne(options: T): Promise<T | null>;
  create(entity: T): T;
  remove(entity: T | T[]): Promise<void>;
}
