type Constructor<T = object> = new (...args: any[]) => T;

export function FindParam<TEntity extends Constructor>(Entity: TEntity) {
  return class extends Entity {
    orderBy: keyof TEntity;
    orderDirection: 'asc' | 'desc';
  };
}
