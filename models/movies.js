const mongoose = require('mongoose')
const Joi = require('joi');

mongoose.connect('mongodb://0.0.0.0:27017/movieDb')
        .then(()=>console.log('Connected to MongoDB ...'))
        .catch(err=> console.error('Error: ', err))
        
const Movie = mongoose.model('movie', new mongoose.Schema({
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
}))

function validateMovie(movie) {
 
    const schema = Joi.object({
      title: Joi.string().min(3).required(),
      genre: Joi.string().required(),
      tags: Joi.array().required(),
      isPublished: Joi.boolean()
  
    })
  
    return schema.validate(movie);
}

module.exports = {Movie, validate: validateMovie}
  
