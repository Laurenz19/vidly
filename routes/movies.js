const {Movie, validate} = require('../models/movies')
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const movies = await Movie.find()
  res.send(movies);
});

router.post('/', async (req, res) => {
 
  const { error } = validate(req.body)
  
  if(error) return res.status(400).send(error.details[0].message)

  const movie = new Movie({
    title: req.body.title,
    genre: req.body.genre,
    tags: req.body.tags,
    isPublished: req.body.isPublished
  })

  try {
    
    const result = await movie.save()
    return res.send(result)

  } catch (error) {

        const errors = err.errors
        let message = ''
        for (const field in errors) {
           message = errors[field].message
        }
        
        res.status(400).send(message)
  }
});

router.put('/:id', async (req, res) => {

  const { error } = validate(req.body)
  if(error) return res.status(400).send(error.details[0].message)

  const movie = await Movie.findByIdAndUpdate(req.params.id, {
    title: req.body.title,
    genre: req.body.genre,
    tags: req.body.tags,
    isPublished: req.body.isPublished
  })
  
  if(!movie) return res.status(404).send('The movie with the given ID was not found.')

  res.send(await Movie.findById(req.params.id))
  
});

router.delete('/:id', async (req, res) => {

  const movie = await Movie.findByIdAndRemove(req.params.id)
  if(!movie) return res.status(404).send('The movie with the given ID was not found.')

  res.send(movie)

});

router.get('/:id', async (req, res) => {
  
  const movie = await Movie.findById(req.params.id) 
  if(!movie) return res.status(404).send('The movie with the given ID was not found.')

  res.send(movie)
 
});



module.exports = router;