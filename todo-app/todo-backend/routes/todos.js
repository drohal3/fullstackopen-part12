const express = require('express');
const { Todo } = require('../mongo')
const router = express.Router();
const { getAsync, setAsync } = require('../redis/index');

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })

  if (todo) {
    await setAsync('added_todos', Number((await getAsync('added_todos') ?? 0)) + 1);
    console.log(await getAsync('added_todos'));
  }

  res.send(todo);
});

router.get('/statistics', async(req, res) => {
  res.send({
    "added_todos": Number((await getAsync('added_todos') ?? 0))
  })
})

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()  
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => { // to get a single todo
  res.send(req.todo);
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => { // to update todo
  const todo = await Todo.updateOne({_id:req.todo.id}, req.body)
  res.send(todo);
});

router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;
