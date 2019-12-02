import UserService from '../services/userService';
import ServiceService from '../services/serviceService';
import RatingService from '../services/ratingService';

export async function recommender() {
	const allUsers = await UserService.getAll();
	const allServices = await ServiceService.getAll();
	const allRatings = await RatingService.getAll();

	const numberOfRows = allServices.length;
	const numberOfCols = allUsers.length;

	const userServiceMatrix: number[][] = [];

	for (let i = 0; i < numberOfRows + 1; i++) {
		userServiceMatrix[i] = [];
		for (let j = 0; j < numberOfCols + 1; j++) {
			userServiceMatrix[i][j] = 1;
		}
	}
}
