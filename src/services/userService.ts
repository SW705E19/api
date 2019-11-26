import { getRepository, DeleteResult, Repository } from 'typeorm';
import { User } from '../entity/user';
import { TutorInfo } from '../entity/tutorInfo';

class UserService {
	static getAll = async (): Promise<User[]> => {
		const userRepository: Repository<User> = getRepository(User);
		return await userRepository.find({
			select: ['id', 'email', 'roles'], //We dont want to send the passwords on response
		});
	};
	static getByEmail = async (email: string): Promise<User> => {
		//Get user from database
		const userRepository: Repository<User> = getRepository(User);
		return await userRepository.findOneOrFail({ where: { email } });
	};

	static getById = async (id: number): Promise<User> => {
		//Get user from database
		const userId = (id as unknown) as number;
		const userRepository: Repository<User> = getRepository(User);
		const resuser = await userRepository
			.createQueryBuilder('user')
			.select(['user.id', 'user.email', 'user.firstName', 'user.lastName', 'user.roles'])
			.where('user.id = :id', { id: userId })
			.getOne();

		return resuser;
	};

	static getTutorByUserId = async (userId: number): Promise<TutorInfo> => {
		const tutorInfoRepository: Repository<TutorInfo> = getRepository(TutorInfo);
		const restutorInfo = await tutorInfoRepository
			.createQueryBuilder('tutorInfo')
			.select(['tutorInfo.id', 'tutorInfo.description', 'tutorInfo.acceptedPayments', 'tutorInfo.user'])
			.innerJoin('tutorInfo.user', 'user')
			.addSelect('user.id')
			.where('user.id = :userId', { userId: userId })
			.getOne();

		return restutorInfo;
	};

	static save = async (user: User): Promise<User> => {
		const userRepository: Repository<User> = getRepository(User);
		return await userRepository.save(user);
	};

	static deleteById = async (id: number): Promise<DeleteResult> => {
		const userId = (id as unknown) as number;

		const userRepository: Repository<User> = getRepository(User);
		return await userRepository.delete(userId);
	};

	static saveTutor = async (tutorInfo: TutorInfo): Promise<TutorInfo> => {
		const tutorInfoRepository: Repository<TutorInfo> = getRepository(TutorInfo);
		return await tutorInfoRepository.save(tutorInfo);
	};
}

export default UserService;
