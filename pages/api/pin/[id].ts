import prisma from '../../../lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'PUT') {
    const noteId = req.query.id
    const { pin } = req.body
    const note = await prisma.note.findFirst({
      where: {
        id: Number(noteId),
      },
    })

    try {
      await prisma.note.update({
        where: { id: Number(noteId) },
        data: {
          pin: !note.pin,
        },
      })
      res.status(200).send({ message: 'Note pinned successfully!' })
    } catch (error) {
      res.status(500).send(error)
    }
  }
}

export default handler
