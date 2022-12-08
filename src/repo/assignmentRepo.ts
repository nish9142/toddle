import pool from '../pool';
import { PUBLISH_STATUS } from '../types/filters';
export interface Assignment {
  id: number;
  user_id: number;
  description: string;
  published_at: string;
  deadline_at: string;
}

export class AssignmentRepo {
  static async createAssignment(
    data: Partial<Assignment>,
  ): Promise<Assignment> {
    const values = [
      data.user_id,
      data.description,
      data.published_at,
      data.deadline_at,
    ];
    const { rows } = await pool.query(
      `INSERT INTO assignments (user_id,description, published_at, deadline_at)
       VALUES ($1,$2,$3,$4) RETURNING *;`,
      values,
    );
    return rows[0];
  }

  static async getAssignmentById(id: number): Promise<Assignment> {
    const { rows } = await pool.query(
      `SELECT * from assignments WHERE id = $1`,
      [id],
    );
    return rows[0];
  }

  static async getAssignmentsByUserId(
    user_id: number,
    publishStatus: PUBLISH_STATUS,
    limit: number = 20,
    skip: number = 0,
  ): Promise<Assignment[]> {
    let subQ = '';
    if (publishStatus === PUBLISH_STATUS.ONGOING) {
      subQ = 'AND published_at <=current_timestamp';
    }
    if (publishStatus === PUBLISH_STATUS.SCHEDULED) {
      subQ = 'AND published_at >current_timestamp';
    }
    const { rows } = await pool.query(
      `SELECT * from assignments WHERE user_id = $1 ${subQ} LIMIT ${limit} OFFSET ${skip};`,
      [user_id],
    );
    return rows;
  }

  static async updateAssignment(assignment: Assignment): Promise<Assignment> {
    const values = [
      assignment.description,
      assignment.published_at,
      assignment.deadline_at,
      new Date().toISOString(),
      assignment.id,
    ];
    const { rows } = await pool.query(
      `UPDATE assignments 
       SET description=$1, published_at=$2, deadline_at=$3,updated_at=$4
      WHERE id=$5 RETURNING *`,
      values,
    );
    return rows[0];
  }

  static async deleteAssignment(assignmentId: number): Promise<Assignment> {
    const { rows } = await pool.query(
      `DELETE from assignments WHERE id=$1 RETURNING *`,
      [assignmentId],
    );
    return rows[0];
  }
}

export default AssignmentRepo;
