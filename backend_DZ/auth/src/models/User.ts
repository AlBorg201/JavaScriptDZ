import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'users', timestamps: false })
export class User extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  githubId!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  displayName!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  email?: string;
}