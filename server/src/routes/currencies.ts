import { Router } from 'express';
import { store } from '../db/store.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const currenciesRouter = Router();

currenciesRouter.get('/', asyncHandler(async (_req, res) => {
  res.json(store.listCurrencies());
}));
