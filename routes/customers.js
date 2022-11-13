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

router.get('/:id', async(req, res)=>{
    const customer = await Customer.findById(req.params.id)
    if(!customer) return res.status(404).send('Customer with given ID was not found')

    res.send(customer)
})

router.post('/', async(req, res)=>{
    const  {error} = validateCustomer(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    const customer = new Customer({
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone
    })

    try {
        const result = await customer.save()
        res.send(result) 
    } catch (err) {
        res.status(400).send(err.errors.message)
    }
})

router.put('/:id', async(req, res)=>{
    const  {error} = validateCustomer(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    const customer = await Customer.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone
    })

    if(!customer) return res.status(404).send('Customer with given ID was not found')

    res.send(await Customer.findById(req.params.id))
})

router.delete('/:id', async(req, res)=>{
    const customer = await Customer.findByIdAndRemove(req.params.id)

    if(!customer) return res.status(404).send('Customer with given ID was not found')

    res.send(customer)
})

function validateCustomer(customer){
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        isGold: Joi.boolean(),
        phone: Joi.string().required()
    })

    return schema.validate(customer)
}
module.exports = router
