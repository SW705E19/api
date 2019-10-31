import { User } from '../entity/user';

test('basic', () => {
	const u: User = new User();
	u.username = 'Frederik';
	expect(u.username === 'Frederik');
});
