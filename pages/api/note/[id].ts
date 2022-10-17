import prisma from '../../../lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'DELETE') {
    const noteId = req.query.id
    try {
      await prisma.note.delete({
        where: { id: Number(noteId) },
      })
      res.status(200).send({ message: 'Note deleted successfully!' })
    } catch (error) {
      res.status(500).send(error)
    }
  }

  if (req.method === 'PUT') {
    const noteId = req.query.id
    const { title, content, pin } = req.body
    try {
      await prisma.note.update({
        where: { id: Number(noteId) },
        data: {
          title: title,
          content: content,
        },
      })
      res.status(200).send({ message: 'Note deleted successfully!' })
    } catch (error) {
      res.status(500).send(error)
    }
  }
}

export default handler
