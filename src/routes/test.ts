import express, {Application, Request, Response, NextFunction} from 'express';
const router = express.Router();

router.get('/',  (req: Request, res: Response, next: NextFunction) => {
    res.send('hello');
});

module.exports = router;
