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
  @Unique(["name"])
  export class Category {
      @PrimaryGeneratedColumn()
      id: number;

      @Column()
      @Length(2, 40)
      name: string;
  }