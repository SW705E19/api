import { User } from '../entity/User';

test('basic', () => {
	const u: User = new User();
	u.username = 'Frederik';
	expect(u.username === 'Frederik');
});
