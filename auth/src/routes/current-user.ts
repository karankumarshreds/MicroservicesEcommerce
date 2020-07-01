import express from 'express';
const router = express.Router();

router.get('/api/users/currentuser', (req, res) => {
    res.send('Hi there <3 <3');
});

export { router as currentUserRouter };