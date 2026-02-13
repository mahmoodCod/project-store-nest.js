import { AppService } from './app.service';

describe('TEST Sum() method', () => {
  let appService: AppService;

  beforeEach(() => {
    appService = new AppService();
  });

  // unit test
  it('sum 1,2 = 3', () => {
    expect(appService.sum(1, 2)).toBe(3);
  });
});
