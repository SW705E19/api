import { getRepository, DeleteResult, Repository } from 'typeorm';
import { User } from '../entity/user';
import { TutorInfo } from '../entity/tutorInfo';

class UserService {
	static getAll = async (): Promise<User[]> => {
		const userRepository: Repository<User> = getRepository(User);
		return await userRepository.find({
			select: ['id', 'username', 'roles'], //We dont want to send the passwords on response
		});
	};
	static getByUsername = async (username: string): Promise<User> => {
		//Get user from database
		const userRepository: Repository<User> = getRepository(User);
		return await userRepository.findOneOrFail({ where: { username } });
	};

	static getById = async (id: number): Promise<User> => {
		//Get user from database
		const userId = (id as unknown) as string;
		const userRepository: Repository<User> = getRepository(User);
		const resuser = await userRepository.findOneOrFail(userId);

		return resuser;
	};

	static save = async (user: User): Promise<User> => {
		const userRepository: Repository<User> = getRepository(User);
		return await userRepository.save(user);
	};

	static deleteById = async (id: number): Promise<DeleteResult> => {
		const userId = (id as unknown) as string;
		const userRepository: Repository<User> = getRepository(User);
		return await userRepository.delete(userId);
	};

	static saveTutor = async (tutorInfo: TutorInfo): Promise<TutorInfo> => {
		const tutorInfoRepository: Repository<TutorInfo> = getRepository(TutorInfo);
		return await tutorInfoRepository.save(tutorInfo);
	};
}

export default UserService;
