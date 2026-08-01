import { Router } from 'express';
import { createStudent, deleteStudent, getStudent, listStudents, loginStudent, resetSystemData, updateStudent } from '../controllers/studentController.js';

const router = Router();
router.post('/login', loginStudent);
router.post('/reset', resetSystemData);
router.route('/').get(listStudents).post(createStudent);
router.route('/:id').get(getStudent).patch(updateStudent).delete(deleteStudent);

export default router;
