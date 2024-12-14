import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    const student = await prisma.student.findUnique({ where: { id: parseInt(id) } });
    if (student) {
      res.status(200).json(student);
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } else if (req.method === 'PUT') {
    const { fullName, phoneNumber } = req.body;
    const updatedStudent = await prisma.student.update({
      where: { id: parseInt(id) },
      data: { fullName, phoneNumber },
    });
    res.status(200).json(updatedStudent);
  } else if (req.method === 'DELETE') {
    await prisma.student.delete({ where: { id: parseInt(id) } });
    res.status(204).end();
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
