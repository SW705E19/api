import { User } from '../entity/User';

test('basic', () => {
    var u: User = new User();
    u.username = 'Frederik';
  expect(u.username === 'Frederik');
});
