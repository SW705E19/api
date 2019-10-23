
import { Request, Response, NextFunction } from "express";
import { getRepository } from "typeorm";

import { User } from "../entity/user";

export const checkRole = (roles: Array<string>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    //Get the user ID from previous midleware
    const id = res.locals.jwtPayload.userId;

    //Get user role from the database
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (id) {
      res.status(401).send();
    }

    //Check if array of authorized roles includes the user's role
    let rolefound = false;
    for (let i = 0; i < roles.length; i++) {
      const r = roles[i];
      for (let j = 0; j < user.roles.length; j++) {
        const ur = user.roles[j];
        if(ur == r){
          rolefound = true;
          break;
        }
      }
    }
    if (rolefound) next();
    else res.status(401).send();
  };
};