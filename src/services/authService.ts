import { getRepository } from 'typeorm';
import { User } from '../entity/user';

class AuthService {
	static getUserByUsername = async (username: string): Promise<User> => {
		//Get user from database
		const userRepository = getRepository(User);
		const resuser = await userRepository.findOneOrFail({ where: { username } });

		return resuser;
	};

	static getUserById = async (id: number): Promise<User> => {
		//Get user from database
		const userRepository = getRepository(User);
		const resuser = await userRepository.findOneOrFail(id);

		return resuser;
	};

	static saveUser = async (user: User): Promise<User> => {
		const userRepository = getRepository(User);
		return await userRepository.save(user);
	};
}
export default AuthService;
