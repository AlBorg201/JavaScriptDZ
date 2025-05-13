import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'contacts', timestamps: false })
export class Contact extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  fullName!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  phone!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  address!: string;
}