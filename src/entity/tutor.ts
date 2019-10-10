import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    CreateDateColumn,
    UpdateDateColumn
  } from "typeorm";
  import { Length, IsNotEmpty } from "class-validator";
  import * as bcrypt from "bcryptjs";

  @Entity()
  @Unique(["username"])
  export class Tutor {
      @PrimaryGeneratedColumn()
      id: number;

      @Column()
      @Length(2, 40)
      username: string;

      @Column()
      @Length(2, 40)
      name: string;
  }