export class FindAllResult<T> {
  constructor(
    readonly resources: T[],
    readonly total: number,
  ) {}
}
