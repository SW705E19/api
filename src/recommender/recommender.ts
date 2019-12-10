import UserService from '../services/userService';
import ServiceService from '../services/serviceService';
import RatingService from '../services/ratingService';
import { Rating } from '../entity/rating';
import { User } from '../entity/user';
import { Service } from '../entity/service';

function dotMatrices(
	numberOfRows: number,
	numberOfCols: number,
	numberOfFactors: number,
	userFactorMatrix: number[][],
	serviceFactorMatrix: number[][],
): number[][] {
	const predictedRatings: number[][] = [];
	let sum = 0;
	for (let i = 0; i < numberOfRows; i++) {
		predictedRatings[i] = [];
		for (let j = 0; j < numberOfCols; j++) {
			for (let k = 0; k < numberOfFactors; k++) {
				sum = sum + userFactorMatrix[i][k] * serviceFactorMatrix[k][j];
			}
			predictedRatings[i][j] = sum;
			sum = 0;
		}
	}

	return predictedRatings;
}

function initUserFactorMatrix(numberOfRows: number, numberOfFactors: number, userFactorMatrix: number[][]): number[][] {
	for (let i = 0; i < numberOfRows; i++) {
		userFactorMatrix[i] = []; // Initialize inner array
		for (let j = 0; j < numberOfFactors; j++) {
			userFactorMatrix[i][j] = Math.random() * 1;
		}
	}

	return userFactorMatrix;
}

function initServiceFactorMatrix(
	numberOfCols: number,
	numberOfFactors: number,
	serviceFactorMatrix: number[][],
): number[][] {
	for (let i = 0; i < numberOfFactors; i++) {
		serviceFactorMatrix[i] = []; // Initialize inner array
		for (let j = 0; j < numberOfCols; j++) {
			serviceFactorMatrix[i][j] = Math.random() * 1;
		}
	}

	return serviceFactorMatrix;
}

function populateUserServiceMatrix(
	allRatings: Rating[],
	numberOfRows: number,
	numberOfCols: number,
	userServiceMatrix: number[][],
): number[][] {
	allRatings.forEach(rating => {
		let rowId: number;
		let colId: number;

		for (let i = 0; i < numberOfRows; i++) {
			if (userServiceMatrix[i + 1][0] === rating.user.id) {
				rowId = i + 1;
			}
		}

		for (let i = 0; i < numberOfCols; i++) {
			if (userServiceMatrix[0][i + 1] === rating.service.id) {
				colId = i + 1;
			}
		}

		userServiceMatrix[rowId][colId] = rating.rating;
	});

	return userServiceMatrix;
}

function initUserServiceMatrix(
	numberOfRows: number,
	numberOfCols: number,
	allUsers: User[],
	allServices: Service[],
	userServiceMatrix: number[][],
): number[][] {
	userServiceMatrix[0] = [];
	for (let i = 0; i < numberOfRows; i++) {
		userServiceMatrix[i + 1] = [];
		userServiceMatrix[i + 1][0] = allUsers[i].id;
	}

	for (let i = 0; i < numberOfCols; i++) {
		userServiceMatrix[0][i + 1] = allServices[i].id;
	}

	for (let i = 1; i < numberOfRows + 1; i++) {
		for (let j = 1; j < numberOfCols + 1; j++) {
			userServiceMatrix[i][j] = 0;
		}
	}

	return userServiceMatrix;
}

export default class Recommender {
	static async calculateRecommendations(): Promise<number[][]> {
		const allUsers = await UserService.getAll();
		const allServices = await ServiceService.getAll();
		const allRatings = await RatingService.getAll();

		const numberOfRows = allUsers.length;
		const numberOfCols = allServices.length;

		//Number of factors is user defined, so we choose it.
		const numberOfFactors = 10;
		//Max iterations is also user defined.
		const maxIterations = 10000;

		let userServiceMatrix: number[][] = [];
		let predictedRatings: number[][] = [];
		let userFactorMatrix: number[][] = [];
		let serviceFactorMatrix: number[][] = [];

		//Makes users x service matrix. Initializes all entries to 0.
		userServiceMatrix = initUserServiceMatrix(numberOfRows, numberOfCols, allUsers, allServices, userServiceMatrix);

		//Finds the ratings in the database and inserts into the matrix.
		userServiceMatrix = populateUserServiceMatrix(allRatings, numberOfRows, numberOfCols, userServiceMatrix);

		//Creates the userFactor facorization. All entries are filled with random value between 0 and 1.
		userFactorMatrix = initUserFactorMatrix(numberOfRows, numberOfFactors, userFactorMatrix);

		//Creates the serviceFactor facorization. All entries are filled with random value between 0 and 1.
		serviceFactorMatrix = initServiceFactorMatrix(numberOfCols, numberOfFactors, serviceFactorMatrix);

		for (let i = 0; i < maxIterations; i++) {
			//To predict we take the dot product of the factor matrices. They are users x factors and factors x services. This creates a users x services matrix with all values filled.
			predictedRatings = dotMatrices(
				numberOfRows,
				numberOfCols,
				numberOfFactors,
				userFactorMatrix,
				serviceFactorMatrix,
			);

			//We learn by moving towards a solution where the error is minimized by updating the values in the factor matrices.
			//This is done with stochastic gradient descent. To update the values we calculate the error between the predictions and the actual ratings.
			//These values are then updated through the formula, where alphavalue is a constnat that determins learning rate. This should be a small number.
			//Betavalue is a constant that is used for weight-decay. It ensures the factor matrices do not grow too big and helps prevent overfitting.
			const alphaValue = 0.001;
			const betaValue = 0.001;
			for (let i = 0; i < numberOfRows; i++) {
				for (let j = 0; j < numberOfCols; j++) {
					if (userServiceMatrix[i + 1][j + 1] > 0) {
						const error = userServiceMatrix[i + 1][j + 1] - predictedRatings[i][j];
						for (let k = 0; k < numberOfFactors; k++) {
							userFactorMatrix[i][k] =
								userFactorMatrix[i][k] +
								alphaValue * (error * serviceFactorMatrix[k][j] - betaValue * userFactorMatrix[i][k]);
							serviceFactorMatrix[k][j] =
								serviceFactorMatrix[k][j] +
								alphaValue * (error * userFactorMatrix[i][k] - betaValue * serviceFactorMatrix[k][j]);
						}
					}
				}
			}

			//Now that the predictions have been updated, we take dot product again for new predictions.
			predictedRatings = dotMatrices(
				numberOfRows,
				numberOfCols,
				numberOfFactors,
				userFactorMatrix,
				serviceFactorMatrix,
			);
			//Then we calculate the regularized squared error of our new prediction.
			//This value should move toward 0.
			let squareError = 0;
			for (let i = 0; i < numberOfRows; i++) {
				for (let j = 0; j < numberOfCols; j++) {
					if (userServiceMatrix[i + 1][j + 1] > 0) {
						squareError =
							squareError + Math.pow(userServiceMatrix[i + 1][j + 1] - predictedRatings[i][j], 2);
						for (let k = 0; k < numberOfFactors; k++) {
							squareError =
								squareError +
								betaValue *
									(Math.pow(userFactorMatrix[i][k], 2) + Math.pow(serviceFactorMatrix[k][j], 2));
						}
					}
				}
			}
		}

		// Now we put the predicted ratings into the user service matrix.
		for (let i = 0; i < numberOfRows; i++) {
			for (let j = 0; j < numberOfCols; j++) {
				if (userServiceMatrix[i + 1][j + 1] == 0) {
					userServiceMatrix[i + 1][j + 1] = predictedRatings[i][j];
				} else {
					// Set to 0 since the user has already rated the service and the recommendation is not interesting
					userServiceMatrix[i + 1][j + 1] = 0;
				}
			}
		}

		return userServiceMatrix;
	}
}
