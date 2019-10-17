import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    ManyToMany,
    JoinTable
  } from "typeorm";
  import { Length, IsNotEmpty } from "class-validator";
  import { Tutor } from "./tutor";

  @Entity()
  @Unique(["name"])
  export class Category {
      @PrimaryGeneratedColumn()
      id: number;

      @Column()
      @Length(2, 40)
      name: string;

      @Column()
      @Length(2, 200)
      description: string;

      @ManyToMany(type => Tutor)
      @JoinTable()
      tutor: Tutor[];
  }