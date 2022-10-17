import { useState } from 'react'
import axios from 'axios'
import { GetServerSideProps } from 'next'
import prisma from '../lib/prisma'
import { useRouter } from 'next/router'
import { TrashIcon, BookmarkIcon } from '@heroicons/react/24/outline'
interface Note {
  title: string
  content: string
}

const Notes = ({ notes, bookmarks }) => {
  console.log(bookmarks)
  const router = useRouter()
  const [formError, setFormError] = useState('')
  const [note, setNote] = useState<Note>({
    title: '',
    content: '',
  })

  const refreshData = () => {
    router.replace(router.asPath)
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    if (!note.title || !note.content) {
      setFormError('Fields must not be empty')
      return
    }
    try {
      await axios.post('/api/create', note, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      refreshData()
      setNote({
        title: '',
        content: '',
      })
    } catch (error) {
      alert(error.message)
      console.log(error)
    }
  }

  const deleteHandler = async (id: number) => {
    await axios.delete(`/api/note/${id}`)
    refreshData()
  }

  const bookmarkHandler = async (id: number) => {
    try {
      await axios.put(`/api/pin/${id}`, note, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      refreshData()
    } catch (error) {
      alert(error.message)
      console.log(error)
    }
  }

  return (
    <div className=' min-h-screen w-full max-w-screen overflow-none px-6 md:px-16'>
      <h1 className='mt-4 text-center font-semibold text-3xl'>Notes</h1>
      <form
        onSubmit={submitHandler}
        className='flex mx-auto mt-12 space-y-2 flex-col items-center justify-center  h-fit p-6 md:px-16 md:py-12 border rounded-md shadow-md'
      >
        <h2 className='text-center font-normal text-xl pb-6'>Add a new note</h2>
        <input
          type='text'
          placeholder='Title'
          onChange={(e) =>
            setNote((prev) => ({ ...prev, title: e.target.value }))
          }
          value={note.title}
          className='border rounded-md w-full px-4 py-2'
        />
        <textarea
          onChange={(e) =>
            setNote((prev) => ({ ...prev, content: e.target.value }))
          }
          type='text'
          value={note.content}
          placeholder='Type your notes here'
          className='border rounded-md w-full px-4 py-2'
        ></textarea>
        <p className='text-sm text-red-400 text-start w-full italic'>
          {formError}
        </p>
        <button className='bg-black px-4 py-2 rounded-md hover:bg-slate-800 transition cursor-pointer mt-3 text-white'>
          Add note
        </button>
      </form>

      {/* Bookmarks */}
      <div className='w-full mt-12  border-b pb-12 '>
        {bookmarks.length > 0 && (
          <>
            <h2 className='italic font-semibold text-xl pb-4'>Bookmarks</h2>
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
              {bookmarks?.map((note) => (
                <div className='border-2 rounded-md p-4 flex flex-col items-center justify-between'>
                  <div>
                    <h3 className='font-medium text-lg pb-4'>{note.title}</h3>
                    <p>{note.content}</p>
                  </div>
                  <div className='flex items-center justify-between w-full pt-6'>
                    <button
                      className='group'
                      onClick={() => deleteHandler(note.id)}
                    >
                      <TrashIcon className='h-6 w-6 text-red-600 group-hover:text-red-900 transition' />
                    </button>
                    <button
                      onClick={() => bookmarkHandler(note.id)}
                      className='group'
                    >
                      <BookmarkIcon
                        className={`h-6 group-hover:text-blue-900 transition w-6 ${
                          note.pin ? 'text-green-500' : 'text-blue-500'
                        } `}
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className='w-full pb-12 mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {notes?.map((note) => (
          <div className='border-2 rounded-md p-4 flex flex-col justify-between '>
            <div>
              <h3 className='font-medium text-lg pb-4'>{note.title}</h3>
              <p>{note.content}</p>
            </div>
            <div className='flex items-center justify-between w-full pt-6'>
              <button className='group' onClick={() => deleteHandler(note.id)}>
                <TrashIcon className='h-6 w-6 text-red-600 group-hover:text-red-900 transition' />
              </button>
              <button
                onClick={() => bookmarkHandler(note.id)}
                className='group'
              >
                <BookmarkIcon
                  className={`h-6 group-hover:text-blue-900 transition w-6 ${
                    note.pin ? 'text-green-500' : 'text-blue-500'
                  } `}
                />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Notes

export const getServerSideProps: GetServerSideProps = async () => {
  const notes = await prisma.note.findMany({
    select: {
      title: true,
      content: true,
      id: true,
      pin: true,
    },
  })
  const bookmarks = await prisma.note.findMany({
    where: {
      pin: true,
    },
    select: {
      title: true,
      content: true,
      id: true,
      pin: true,
    },
  })

  return {
    props: { notes, bookmarks },
  }
}
