import express from 'express';
import AssignmentRepo, { Assignment } from '../repo/assignmentRepo';
import SubmissionRepo from '../repo/submissionRepo';
import { User, UserRepo, USER_TYPE } from '../repo/userRepo';
import {
  PUBLISH_STATUS,
  PUBLISH_STATUS_VALUES,
  SUBMISSION_STATUS,
  SUBMISSION_STATUS_VALUES,
} from '../types/filters';
import { allRequiredKeysPresent } from '../utils/helpers';

const router = express.Router();

router.post('/create', async (req, res) => {
  try {
    const payload = req.body || {};
    //@ts-ignore
    const user = req.user;
    const requiredKeys = ['description', 'published_at', 'deadline_at'];
    allRequiredKeysPresent(requiredKeys, payload, res);
    const publishDate = new Date(payload.published_at);
    const deadLineDate = new Date(payload.deadline_at);
    //@ts-ignore
    if (deadLineDate - publishDate < 0) {
      throw new Error('Deadline date is before publish date');
    }
    if (user.user_type !== USER_TYPE.TUTOR) {
      throw new Error('Unauthorized user');
    }
    if (Array.isArray(payload?.students) && payload?.students?.length > 0) {
      await areAllUsersStudents(payload.students);
    } else {
      payload.students = null;
    }
    payload.user_id = user.id;
    const assignment = await AssignmentRepo.createAssignment(payload);
    //submissions create
    let submissions = [];
    if (payload?.students) {
      //verify all users are students
      submissions = await SubmissionRepo.createSubmissions(
        assignment.id,
        payload.students,
      );
    }
    return res.json({ assignment, submissions });
  } catch (error: any) {
    console.error(error);
    res.status(500).send({ error: error?.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const payload = req.body || {};
    //@ts-ignore
    const user = req.user;
    const assignmentId = parseInt(req.params.id);
    const assignment = await AssignmentRepo.getAssignmentById(assignmentId);
    await isValidUserForAssignment(user, assignment, USER_TYPE.TUTOR);
    const updateAssignment = { ...assignment, ...payload };
    if (Array.isArray(payload?.students) && payload?.students?.length > 0) {
      await areAllUsersStudents(payload.students);
    } else {
      payload.students = null;
    }
    const updatedAssignment = await AssignmentRepo.updateAssignment(
      updateAssignment,
    );
    let submissions = {};
    if (payload.students) {
      submissions = await SubmissionRepo.updateUserSubmissionsForAssignment(
        assignmentId,
        payload?.students,
      );
    }
    return res.json({ assignment: updatedAssignment, submissions });
  } catch (error: any) {
    console.error(error);
    res.status(500).send({ error: error?.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    //@ts-ignore
    const user = req.user;
    const assignmentId = parseInt(req.params.id);
    const assignment = await AssignmentRepo.getAssignmentById(assignmentId);
    await isValidUserForAssignment(user, assignment, USER_TYPE.TUTOR);
    const deletedAssignment = await AssignmentRepo.deleteAssignment(
      assignmentId,
    );
    return res.json({ deletedAssignment });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error?.message });
  }
});

router.post('/submit/:id', async (req, res) => {
  try {
    //@ts-ignore
    const user = req.user;
    const assignmentId = parseInt(req.params.id);
    const assignment = await AssignmentRepo.getAssignmentById(assignmentId);
    await isValidUserForAssignment(user, assignment, USER_TYPE.STUDENT);
    let submission = await SubmissionRepo.getSubmission(user.id, assignmentId);
    if (!submission) {
      throw new Error('Student cant submit to this assignment');
    }
    submission = await SubmissionRepo.updateSubmission(user.id, assignmentId);
    return res.json({ submission });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error?.message });
  }
});

router.post('/', async (req, res) => {
  try {
    //@ts-ignore
    const user = req.user;
    let payload = req.body || {};
    payload.publishAt = payload?.publishAt
      ? payload?.publishAt.toUpperCase()
      : PUBLISH_STATUS.ALL;
    payload.status = payload?.status
      ? payload?.status.toUpperCase()
      : SUBMISSION_STATUS.ALL;
    payload.limit = payload?.limit ?? 20;
    payload.skip = payload?.skip ?? 0;
    if (isNaN(payload.limit) || isNaN(payload.skip)) {
      throw new Error(`Limit or Skip value is invalid`);
    }
    if (user.user_type === USER_TYPE.TUTOR) {
      if (!PUBLISH_STATUS_VALUES.includes(payload.publishAt)) {
        throw new Error(`publishAt value is invalid`);
      }
      const assignments = await AssignmentRepo.getAssignmentsByUserId(
        user.id,
        payload.publishAt,
        payload.limit,
        payload.skip,
      );
      return res.json({ assignments });
    } else if (user.user_type === USER_TYPE.STUDENT) {
      if (
        !PUBLISH_STATUS_VALUES.includes(payload.publishAt) ||
        !SUBMISSION_STATUS_VALUES.includes(payload.status)
      ) {
        throw new Error(`publishAt or status value is invalid`);
      }
      const submissions = await SubmissionRepo.getSubmissionsByUserId(
        user.id,
        payload.publishAt,
        payload.status,
        payload.limit,
        payload.skip,
      );
      return res.json({ submissions });
    } else {
      res.status(500).send({ error: 'Something went wrong' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error?.message });
  }
});

const areAllUsersStudents = async (studentIds: number[]) => {
  const users = await UserRepo.getUsersByIds(studentIds);
  if (studentIds.length !== users.length) {
    throw new Error('Found Invalid user Id in students');
  }
  for (let user of users) {
    if (user.user_type !== USER_TYPE.STUDENT) {
      throw new Error(`user ${user.id} is not a student`);
    }
  }
};

const isValidUserForAssignment = async (
  user: User,
  assignment: Assignment,
  type: USER_TYPE,
) => {
  if (user.user_type !== type) {
    throw new Error('Unauthorized user');
  }
  if (!assignment) {
    throw new Error('Assignment not found');
  }
  if (type === USER_TYPE.TUTOR && user.id !== assignment.user_id) {
    throw new Error('Unauthorized operation');
  }
};

export default router;
