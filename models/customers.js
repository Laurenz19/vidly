const mongoose = require('mongoose')
const Joi = require('joi')

mongoose.connect('mongodb://0.0.0.0:27017/movieDb')
        .then(()=>console.log('Connected to MongoDB ...'))
        .catch(err=> console.error('Error: ', err))

const Customer = mongoose.model('customer', new mongoose.Schema({
    name:{
        type: String,
        validate:{
            validator: function(v){
                return v && v.length > 3
            },
            message: 'Name can not be null and must have at least 3 characters'
        },
        required: [true, 'Customer\'s name is required']
    },
    isGold: {
        type: Boolean,
        default: false
    },
    phone:{
        type: String,
        validate:{
            validator: function(v){
                return /\d{3} \d{2} \d{3} \d{2}/.test(v)
            },
            message: function(props){
                return `${props.value} is not a valid phone number`
            },
        },
        required: [true, 'Customer phone number is required']
    }

}))

function validateCustomer(customer){
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        isGold: Joi.boolean(),
        phone: Joi.string().required()
    })

    return schema.validate(customer)
}

module.exports = {Customer, validate: validateCustomer}
