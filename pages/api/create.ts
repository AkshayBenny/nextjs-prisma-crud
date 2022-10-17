import prisma from '../../lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') return res.status(404).send('Api url not found')
  const { title, content } = req.body
  try {
    const note = await prisma.note.create({
      data: {
        title: title,
        content: content,
      },
    })
    res.status(201).send({ message: 'Note created successfully!', note })
  } catch (error) {
    res.status(500).send(error)
  }
}

export default handler
