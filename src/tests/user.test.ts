import { User } from '../entity/user';

test('basic', () => {
    var u: User = new User();
    u.username = 'Frederik';
  expect(u.username === 'Frederik');
});
