import { getRepository } from 'typeorm';
import { User } from '../entity/user';

class AuthService {
	static getUserByUsername = async (username: string) => {
		//Get user from database
		const userRepository = getRepository(User);
		const resuser = await userRepository.findOneOrFail({ where: { username } });

		return resuser;
	};
}
export default AuthService;
