const testUser = {
  username: 'test',
  name: 'test test',
  password: 'Test123Test123'
}

const newBlog = {
  title: 'new blog',
  author: 'new author',
  url: 'somenewurl.com'
}

describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.visit('http://localhost:3000')
    // create new user
    cy.request('POST', 'http://localhost:3003/api/users', testUser)
  })

  it('login open by default', function () {
    cy.visit('http://localhost:3000') // duplicate (already visited in beforeEach), I know...
    cy.contains('log in to application')
    cy.contains('username')
    cy.contains('password')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username')
        .type(testUser.username)
      cy.get('#password')
        .type(testUser.password)
      cy.get('#loginBtn')
        .click()

      cy.contains(`${testUser.name} logged in`)
    })

    it('fails with wrong credentials', function () {
      cy.get('#username')
        .type(testUser.username)
      cy.get('#password')
        .type('incorrect password')
      cy.get('#loginBtn')
        .click()

      cy.get('html').should('not.contain', `${testUser.name} logged in`)

      cy.contains('log in to application')
      cy.contains('username')
      cy.contains('password')

      cy.get('#notification').should('have.class', 'error')
    })

    describe('When logged in', function() {
      beforeEach(function() {
        cy.get('#username')
          .type(testUser.username)
        cy.get('#password')
          .type(testUser.password)
        cy.get('#loginBtn')
          .click()
      })

      it('A blog can be created', function() {
        cy.contains('create new blog').click()
        cy.contains('title')
        cy.contains('author')
        cy.contains('url')

        cy.get('#newTitle').type(newBlog.title)
        cy.get('#newAuthor').type(newBlog.author)
        cy.get('#newUrl').type(newBlog.url)
        cy.get('#createBlogBtn').click()
        cy.contains(`${newBlog.title} ${newBlog.author}`)
        cy.contains(`A new blog ${newBlog.title} by ${ newBlog.author } added`)
        cy.get('#notification').should('have.class', 'success')

      })

      describe('When blog created', function() {
        beforeEach(function() {
          cy.contains('create new blog').click()
          cy.get('#newTitle').type(newBlog.title)
          cy.get('#newAuthor').type(newBlog.author)
          cy.get('#newUrl').type(newBlog.url)
          cy.get('#createBlogBtn').click()
        })

        it('A blog can be liked', function() {
          cy.contains('show').click()
          cy.contains('likes: 0')
          cy.get('.likeBtn').click()
          cy.contains('likes: 1')
        })

        it('A blog can be deleted by user who created it', function () {
          cy.contains('show').click()
          cy.contains('remove').click()

          cy.get('html').should('not.contain', `${newBlog.title} ${newBlog.author}`)
          cy.get('#notification').should('have.class', 'success')
          cy.contains(`Blog ${newBlog.title} successfully removed`)
        })

        it('Blogs are ordered by likes', function() {
          cy.contains('show').click()
          cy.get('.likeBtn').click()
          cy.contains('create new blog').click()
          cy.get('#newTitle').type(`${newBlog.title}1`)
          cy.get('#newAuthor').type(`${newBlog.author}1`)
          cy.get('#newUrl').type(`${newBlog.url}1`)
          cy.get('#createBlogBtn').click()
          cy.wait(500)
          cy.get('html').get('.blogTitle').eq(0).should('contain', `${newBlog.title} ${newBlog.author}`)
          cy.get('html').get('.blogTitle').eq(1).should('contain', `${newBlog.title}1 ${newBlog.author}1`)
          cy.get('.showHide').eq(1).click()
          const likeSecond = cy.get('.likeBtn').eq(1)
          likeSecond.click()
          cy.wait(500)
          likeSecond.click()
          cy.wait(500)
          cy.get('html').get('.blogTitle').eq(1).should('contain', `${newBlog.title} ${newBlog.author}`)
          cy.get('html').get('.blogTitle').eq(0).should('contain', `${newBlog.title}1 ${newBlog.author}1`)
        })
      })
    })
  })
})