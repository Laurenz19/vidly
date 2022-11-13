const mongoose = require('mongoose')
const Joi = require('joi');
const express = require('express');
const router = express.Router();

mongoose.connect('mongodb://0.0.0.0:27017/movieDb')
        .then(()=>console.log('Connected to MongoDB ...'))
        .catch(err=> console.error('Error: ', err))

const movieSchema= mongoose.Schema({
  title: {
    type: String,
    required: [true, 'a movie must have a title'],
    minlength: [3, 'Title must at least 3 characters, we got {VALUE}'],
    unique: true
  },
  genre:{
    type: String,
    enum:['Action', 'Horror', 'Romance', 'Comedie', 'Tutoriel'],
    message: '{VALUE} is not supported'
  },
  tags:{
    type: Array,
    validate:{
      validator: function(v){
        return v && v.length > 0;
      },
      message: 'Must have at least one tags'
    }
  },
  isPublished: {
    type: Boolean, 
    default: false
  }
}) 

const Movie = mongoose.model('movie', movieSchema)


router.get('/', async (req, res) => {
  const movies = await Movie.find()
  res.send(movies);
});

router.post('/', async (req, res) => {
 
  const { error } = validateMovie(req.body)
  
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

    return res.status(400).send(error.errors.message)
  }
});

router.put('/:id', async (req, res) => {

  const { error } = validateMovie(req.body)
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

function validateMovie(movie) {
 
  const schema = Joi.object({
    title: Joi.string().min(3).required(),
    genre: Joi.string().required(),
    tags: Joi.array().required(),
    isPublished: Joi.boolean()

  })

  return schema.validate(movie);
}

module.exports = router;