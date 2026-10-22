import express from 'express';
import type { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { findStudentByAdventureCode, STUDENT_CODES } from './src/data/studentCodes.ts';

const TEACHER_CODES = ['GURU4B', 'GURU', 'GURUPETA', 'GROWGURU4B'];
function isTeacherCode(code: string): boolean {
  if (!code) return false;
  const clean = code.trim().toUpperCase().replace(/\s+/g, '');
  return TEACHER_CODES.includes(clean);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);

  app.use(express.json());

  // Backend API route for checking student adventure code or special teacher code
  app.post('/api/verify-code', (req: Request, res: Response) => {
    try {
      const { code } = req.body;
      if (!code || typeof code !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Kode petualangan tidak boleh kosong.',
        });
      }

      // Check Special Teacher Code (GURU4B)
      if (isTeacherCode(code)) {
        return res.json({
          success: true,
          role: 'teacher',
          teacher: {
            name: 'Guru Kelas IV B',
            role: 'teacher',
          },
          message: 'Selamat datang, Ibu/Bapak Guru! Membuka Dashboard Pengelolaan...',
        });
      }

      const matchedStudent = findStudentByAdventureCode(code);

      if (matchedStudent) {
        return res.json({
          success: true,
          role: 'student',
          student: matchedStudent,
          message: `Selamat datang, ${matchedStudent.name}!`,
        });
      }

      return res.status(401).json({
        success: false,
        message: 'Kode belum terdaftar, yuk cek lagi kartumu! 🗺️',
      });
    } catch (error) {
      console.error('Error verifying code:', error);
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan pada server saat memverifikasi kode.',
      });
    }
  });

  // API route for teacher to retrieve code list
  app.get('/api/student-codes', (_req: Request, res: Response) => {
    return res.json({
      success: true,
      grade: 'IV B',
      total: STUDENT_CODES.length,
      students: STUDENT_CODES.map((s) => ({
        id: s.id,
        name: s.name,
        grade: s.grade,
        code: s.code,
      })),
    });
  });

  // Dev mode: Mount Vite dev server middlewares
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production mode: Serve dist folder
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GROW PUZZLE DIGITAL server listening on port ${PORT}`);
  });
}

startServer();
