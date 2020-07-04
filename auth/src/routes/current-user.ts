import express from 'express';
import { currentUser } from '../middlewares/current-user';

const router = express.Router();

/*****************************************************
 * React will inspect JWT validity and who the current 
 * user is by sending request to this endpoint
 */
router.get('/api/users/currentuser', currentUser, (req, res) => {
    res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };