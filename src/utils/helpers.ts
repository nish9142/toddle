import { Response } from 'express';

export const allRequiredKeysPresent = (
  keys: string[],
  payload: any,
  res: Response,
) => {
  for (let key of keys) {
    if (!payload[key]) {
      res.status(403).send({ error: 'Required key(s) missing' });
      throw new Error('Required key(s) missing');
    }
  }
};
