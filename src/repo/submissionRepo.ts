import sql from 'sql';
import pool from '../pool';
import { PUBLISH_STATUS, SUBMISSION_STATUS } from '../types/filters';
import { Assignment } from './assignmentRepo';
interface Submission {
  id: number;
  user_id: number;
  assignment_id: number;
  submitted_at: string | null;
}

sql.setDialect('postgres');

const submission = sql.define<'submissions', Submission>({
  name: 'submissions',
  schema: 'public',
  columns: {
    id: { dataType: 'INTEGER' },
    user_id: { dataType: 'INTEGER' },
    assignment_id: { dataType: 'INTEGER' },
    submitted_at: { dataType: 'TIMESTAMP' },
  },
});

const assignment = sql.define<'assignments', Assignment>({
  name: 'assignments',
  schema: 'public',
  columns: {
    id: { dataType: 'INTEGER' },
    user_id: { dataType: 'INTEGER' },
    description: { dataType: 'TEXT' },
    published_at: { dataType: 'TIMESTAMP' },
    deadline_at: { dataType: 'TIMESTAMP' },
  },
});

export class SubmissionRepo {
  static async createSubmissions(
    assignmentId: number,
    userIds: number[],
  ): Promise<Submission[]> {
    const submissions = userIds.map((id) => {
      return { user_id: id, assignment_id: assignmentId };
    });
    const query = submission
      .insert(submissions as any)
      .returning(submission.star())
      .toQuery();
    const { rows } = await pool.query(query as any);
    return rows;
  }

  static async updateUserSubmissionsForAssignment(
    assignmentId: number,
    userIds: number[],
  ): Promise<{ addedSubmissions: Submission[]; deletedSubmissions: any }> {
    const query = submission
      .select(submission.star())
      .where(submission.assignment_id.equals(assignmentId))
      .toQuery();
    const { rows } = await pool.query(query as any);
    const oldUsersIds = rows.map(
      (submission: Submission) => submission.user_id,
    );
    const usersToAdd = userIds.filter(
      (newUserId) => !oldUsersIds.includes(newUserId),
    );
    const usersToDelete = oldUsersIds.filter(
      (oldUserId) => !userIds.includes(oldUserId),
    );
    const addedSubmissions = usersToAdd?.length
      ? await SubmissionRepo.createSubmissions(assignmentId, usersToAdd)
      : [];
    const deletedSubmissions = usersToDelete?.length
      ? await SubmissionRepo.deleteUserSubmissionByIds(
          assignmentId,
          usersToDelete,
        )
      : [];
    return { addedSubmissions, deletedSubmissions };
  }

  static async deleteUserSubmissionByIds(
    assignmentId: number,
    userIds: number[],
  ) {
    const query = submission
      .delete()
      .where(
        submission.assignment_id
          .equals(assignmentId)
          .and(submission.user_id.in(userIds)),
      )
      .returning(submission.star())
      .toQuery();
    const { rows } = await pool.query(query as any);
    return rows;
  }

  static async getSubmission(userId: number, assignmentId: number) {
    const query = submission
      .select(submission.star())
      .where(
        submission.assignment_id
          .equals(assignmentId)
          .and(submission.user_id.equals(userId)),
      )
      .toQuery();
    const { rows } = await pool.query(query as any);
    return rows[0];
  }

  static async updateSubmission(userId: number, assignmentId: number) {
    const updateSubmission = { submitted_at: new Date().toISOString() };
    const query = submission
      .update(updateSubmission)
      .where(
        submission.user_id
          .equals(userId)
          .and(submission.assignment_id.equals(assignmentId)),
      )
      .returning(submission.star())
      .toQuery();
    const { rows } = await pool.query(query as any);
    return rows[0];
  }

  static async getSubmissionsByUserId(
    userId: number,
    publishStatus: PUBLISH_STATUS,
    submissionStatus: SUBMISSION_STATUS,
    limit: number = 20,
    skip: number = 0,
  ) {
    let subQ = [];
    const submissionToAssignment = submission
      .leftJoin(assignment)
      .on(submission.assignment_id.equals(assignment.id));
    if (publishStatus === PUBLISH_STATUS.ONGOING) {
      subQ.push(assignment.published_at.lte(new Date().toISOString()));
    }
    if (publishStatus === PUBLISH_STATUS.SCHEDULED) {
      subQ.push(assignment.published_at.gt(new Date().toISOString()));
    }
    if (submissionStatus === SUBMISSION_STATUS.SUBMITTED) {
      subQ.push(
        submission.submitted_at
          .isNotNull()
          .and(submission.submitted_at.lte(assignment.deadline_at)),
      );
    }
    if (submissionStatus === SUBMISSION_STATUS.OVERDUE) {
      subQ.push(
        submission.submitted_at
          .isNotNull()
          .and(submission.submitted_at.gt(assignment.deadline_at)),
      );
    }
    if (submissionStatus === SUBMISSION_STATUS.PENDING) {
      subQ.push(submission.submitted_at.isNull());
    }
    let query = submission
      .from(submissionToAssignment)
      .where(submission.user_id.equals(userId));
    if (subQ?.length > 0) {
      subQ.forEach((subQuery) => {
        query.where(subQuery);
      });
    }
    query = query.limit(limit).offset(skip).toQuery() as any;
    const { rows } = await pool.query(query as any);
    return rows;
  }
}

export default SubmissionRepo;
