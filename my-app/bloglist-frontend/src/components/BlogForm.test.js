import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('<BlogForm /> uses correct data when new blog is created', async () => {
  const createBlog = jest.fn()
  const user = userEvent.setup()

  const newBlog = {
    title: "new title",
    author: "new author",
    url: "someurl.com"
  }

  render(<BlogForm createNewBlog={createBlog} />)

  const titleInput = screen.getByPlaceholderText('new title')
  const authorInput = screen.getByPlaceholderText('author')
  const urlInput = screen.getByPlaceholderText('something.com')
  const createButton = screen.getByText('create', {selector: 'button'})

  await user.type(titleInput, newBlog.title)
  await user.type(authorInput, newBlog.author)
  await user.type(urlInput, newBlog.url)
  await user.click(createButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0]).toMatchObject(newBlog)
})