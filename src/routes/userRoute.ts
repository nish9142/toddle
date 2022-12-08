import express from 'express';
import { UserRepo, USER_TYPE_VALUES } from '../repo/userRepo';
import { allRequiredKeysPresent } from '../utils/helpers';
import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '../utils/constants';

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const payload = req.body || {};
    const requiredKeys = ['username', 'password', 'user_type'];
    allRequiredKeysPresent(requiredKeys, payload, res);
    if (!USER_TYPE_VALUES.includes(payload.user_type)) {
      throw new Error(`Invalid user_type`)
    } 
    payload.username = payload.username.toLowerCase();
    const user = await UserRepo.createUser(payload);
    return res.json(user);
  } catch (error: any) {
    console.error(error);
    res.status(500).send({ error: error?.message });
  }
});

router.post('/signin', async (req, res) => {
  try {
    const payload = req.body || {};
    const requiredKeys = ['username', 'password'];
    allRequiredKeysPresent(requiredKeys, payload, res);
    payload.username = payload.username.toLowerCase();
    const user = await UserRepo.findUserByUserName(payload.username);
    if (!user || user?.password !== payload.password) {
      throw new Error('Invalid username or password');
    }
    const token = jwt.sign({ user }, JWT_SECRET_KEY);
    res.json({ token });
  } catch (error: any) {
    console.error(error);
    res.status(500).send({ error: error?.message });
  }
});

export default router;
