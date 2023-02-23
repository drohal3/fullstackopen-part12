import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Todo from './Todo'

test('renders content', () => {
  const todo = {
    text: 'testing todo component',
    done: false
  }

  render(<Todo todo={todo} deleteTodo={() => console.log('testing')} completeTodo={() => console.log('testing')} />)

  const element = screen.getByText('testing todo component')
  expect(element).toBeDefined()
})