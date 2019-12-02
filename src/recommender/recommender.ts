import UserService from '../services/userService';
import ServiceService from '../services/serviceService';
import RatingService from '../services/ratingService';

export async function recommender() {
	const allUsers = await UserService.getAll();
	const allServices = await ServiceService.getAll();
	const allRatings = await RatingService.getAll();

	const numberOfRows = allUsers.length;
	const numberOfCols = allServices.length;

	const userServiceMatrix: number[][] = [];

	userServiceMatrix[0] = [];
	for (let i = 0; i < numberOfRows; i++) {
		userServiceMatrix[i + 1] = [];
		userServiceMatrix[i + 1][0] = allUsers[i].id;
	}

	for (let i = 0; i < numberOfCols; i++) {
		userServiceMatrix[0][i + 1] = allServices[i].id;
	}

	allRatings.forEach(rating => {
		let rowId;
		let colId;

		for (let i = 0; i < numberOfRows; i++) {
			if (userServiceMatrix[i + 1][0] === rating.user.id) {
				rowId = i;
			}
		}

		for (let i = 0; i < numberOfCols; i++) {
			if (userServiceMatrix[0][i + 1] === rating.service.id) {
				colId = i;
			}
		}

		userServiceMatrix[rowId][colId] = rating.rating;
	});

	const numberOfFactors = 15;
	const userFactorMatrix: number[][] = [];
	const serviceFactorMatrix: number[][] = [];

	for (let i = 0; i < numberOfRows; i++) {
		userFactorMatrix[i] = []; // Initialize inner array
		for (let j = 0; j < numberOfFactors; j++) {
			// i++ needs to be j++
			userFactorMatrix[i][j] = Math.random() * 5;
		}
	}

	for (let i = 0; i < numberOfFactors; i++) {
		serviceFactorMatrix[i] = []; // Initialize inner array
		for (let j = 0; j < numberOfCols; j++) {
			// i++ needs to be j++
			serviceFactorMatrix[i][j] = Math.random() * 5;
		}
	}

	const predictedRatings: number[][] = [];
	let sum = 0;
	for (let i = 0; i < numberOfRows; i++) {
		predictedRatings[i] = [];
		for (let j = 0; j < numberOfCols; j++) {
			for (let k = 0; k < numberOfFactors; k++) {
				sum = sum + userFactorMatrix[i][k] * serviceFactorMatrix[k][j];
			}
			predictedRatings[i][j] = sum;
		}
		sum = 0;
	}
	console.log(predictedRatings);
}
