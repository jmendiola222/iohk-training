import { Invoices } from '../../api/invoices.js'

function startup() {

    Invoices.remove({})

    const daysBack = 31 + Random.fraction() * 30
    const today = new Date()

    for(let i = 0; i < daysBack; i++ ) {
        const amountPerDay = 1 + Random.fraction() * 3
        const createdAt = new Date()
        createdAt.setDate(today.getDate() - i)

        for(let j = 0; j < amountPerDay; j++ ) {

            Invoices.insert({
                invoiceNumber: parseInt(Random.fraction() * 10000),
                total: parseInt(Random.fraction() * 10) * 10,
                createdAt: createdAt
            });

        }
    }



    Meteor.publish('invoices', function invoicesPublication() {
        return Invoices.find()
    })
}

export const Services = {
    startup : startup
}