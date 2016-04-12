import { Template } from 'meteor/templating'
import { ReactiveVar } from 'meteor/reactive-var'
import { ReactiveDict } from 'meteor/reactive-dict'

import { Invoices } from '../../api/invoices.js'

import '../../ui/pages/invoices.html'
import '../../ui/layouts/main.css'

const filters = { createdAt :  ['today', 'week', 'month','all'] }
const columns =  [{key: 'invoiceNumber', name : 'Invoice Nr.', sortable : 0 },
    {key: 'total', name : 'Total', sortable : 2 },
    {key: 'createdAt', name : 'CreatedAt', sortable : 1 }]

function getSortByColumnKey(state, columnKey){
    state.get(columnKey)
}

Template.body.onCreated(function bodyOnCreated() {

    this.state = new ReactiveDict()

    const defaultFilter = filters.createdAt[ filters.createdAt.length - 1]
    this.state.set('filterCreatedAt', defaultFilter)

    //Sorted by Total & createAt ascending
    this.state.set(columns[1].key, 1)
    this.state.set(columns[2].key, 1)

    Meteor.subscribe('invoices')
})

Template.registerHelper('formatDate', function(date) {
    return moment(date).format('YYYY-MM-DD')
})

Template.body.helpers({
    invoices() {
        const instance = Template.instance()
        const filterCreatedAt = instance.state.get('filterCreatedAt')
        const d = new Date()
        let dateFilter
        if(filterCreatedAt === filters.createdAt[0]){
            dateFilter = new Date()
            dateFilter.setDate(d.getDate() - 1)
        } else {
            if(filterCreatedAt === filters.createdAt[1]){
                dateFilter = new Date()
                dateFilter.setTime(d.getTime() - (d.getDay() ? d.getDay() : 7) * 24 * 60 * 60 * 1000)
            }
            if(filterCreatedAt === filters.createdAt[2]){
                dateFilter = new Date(d.getFullYear(), d.getMonth(), 1)
            }
        }
        const opt = { sort : {} }
        columns.filter( (it) => { return it.sortable > 0 } )
            .sort( (a,b) => { return a.sortable - b.sortable })
            .forEach( (it) => {
                const sorted = instance.state.get(it.key)
                if (sorted)
                    opt.sort[it.key] = sorted
            }
        )
        if(dateFilter)
            return Invoices.find( { createdAt : { $gt : dateFilter} }, opt)
        else
            return Invoices.find( { }, opt )
    },
    columns() {
        //TODO: This should be globalized
        return columns
    },
    filters() {
        return { createdAt : { options : filters.createdAt }}
    },
    isFilterSelected(item){
        const instance = Template.instance()
        return item === instance.state.get('filterCreatedAt')
    },
    getSortDirection(column){
        const instance = Template.instance()
        const sortedValue = instance.state.get(column.key)
        return (sortedValue) ? ((sortedValue > 0)? '-desc' : '-asc') : ''
    },
    isSortable(column){
        return column.sortable > 0
    }
})

Template.body.events({
    'click .filters button'(event, instance) {
        instance.state.set('filterCreatedAt', event.target.value )
    },
    'click .table-sortable th a'(event, instance) {
        const targetId = event.target.id
        const currVal = instance.state.get(targetId)
        instance.state.set(targetId, currVal * (-1))
    }
})