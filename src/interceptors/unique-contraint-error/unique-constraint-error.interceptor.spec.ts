import { UniqueConstraintErrorInterceptor } from './unique-constraint-error.interceptor';

describe('UniqueConstraintErrorInterceptor', () => {
  it('should be defined', () => {
    expect(new UniqueConstraintErrorInterceptor()).toBeDefined();
  });
});
