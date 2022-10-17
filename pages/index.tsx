import React, { useState } from 'react'

interface Note {
  title: string
  content: string
}

const Notes = () => {
  const [note, setNote] = useState<Note>({
    title: '',
    content: '',
  })
  const submitHandler = (e) => {
    e.preventDefault()
    console.log(note)
  }
  return (
    <div className=' h-screen w-screen max-w-screen overflow-none px-6 md:px-16'>
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
        <button className='bg-black px-4 py-2 rounded-md hover:bg-slate-800 transition cursor-pointer mt-3 text-white'>
          Add note
        </button>
      </form>
    </div>
  )
}

export default Notes
