import { Template } from 'meteor/templating'
import { ReactiveVar } from 'meteor/reactive-var'
import { ReactiveDict } from 'meteor/reactive-dict'

import { Invoices } from '../../api/invoices.js'

import '../../ui/pages/invoices.html'
import '../../ui/layouts/main.css'

Template.body.onCreated(function bodyOnCreated() {
    this.state = new ReactiveDict();
    Meteor.subscribe('invoices');
});

Template.registerHelper('formatDate', function(date) {
    return moment(date).format('YYYY-MM-DD');
});

Template.body.helpers({
    invoices() {
        return Invoices.find({});
    }
})