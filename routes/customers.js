const {Customer, validate} = require('../models/customers')
const router = require('express').Router()

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
    const  {error} = validate(req.body)
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
        const errors = err.errors
        let message = ''
        for (const field in errors) {
           message = errors[field].message
        }
        res.status(400).send(message)
    }
})

router.put('/:id', async(req, res)=>{
    const  {error} = validate(req.body)
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
module.exports = router
