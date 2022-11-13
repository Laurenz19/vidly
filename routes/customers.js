const router = require('express').Router()
const mongoose = require('mongoose')

const customerSchema = mongoose.Schema({
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
        validate: function(v){
            return /\d{3} \d{2} \d{3} \d{2}/.test(v)
        },
        message: props=> `${props.value} is not a valid phone number`,
        required: [true, 'Customer phone number is required']
    }

})

const Customer = mongoose.model('customer', customerSchema)


router.get('/', async(req, res)=>{
    const customers = await Customer.find().sort('name')
    res.send(customers)
})

router.get('/:id', (req, res)=>{
    
})

router.post('/:id', (req, res)=>{
    
})

router.put('/:id', (req, res)=>{
    
})

router.delete('/:id', (req, res)=>{
    
})

module.exports = router
