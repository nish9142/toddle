import pool from '../pool';
export interface User {
  id: number;
  username: string;
  password: string;
  user_type: string;
}

export enum USER_TYPE {
  STUDENT = 'student',
  TUTOR = 'tutor',
}

export const USER_TYPE_VALUES = Object.values(USER_TYPE)

export class UserRepo {
  static async createUser(data: Partial<User>): Promise<User> {
    const values = [data.username!, data.password!, data.user_type!];
    const { rows } = await pool.query(
      `INSERT INTO users(username, password, user_type)
       VALUES ($1,$2,$3) RETURNING *;`,
      values,
    );
    return rows[0];
  }

  static async findUserByUserName(username: string): Promise<User> {
    const { rows } = await pool.query(
      `SELECT * from users WHERE username = $1; `,
      [username],
    );
    return rows[0];
  }

  static async getUsersByIds(ids: number[]): Promise<User[]> {
    const { rows } = await pool.query(
      `SELECT * from users WHERE id = ANY($1::int[]); `,
      [ids],
    );
    return rows;
  }
}
