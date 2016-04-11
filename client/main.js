import { Template } from 'meteor/templating'
import { ReactiveVar } from 'meteor/reactive-var'
import { ReactiveDict } from 'meteor/reactive-dict'

import '../imports/startup/client/index.js'
import { Invoices } from '../imports/api/invoices.js'

import './main.html'

Template.body.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  Meteor.subscribe('invoices');
});

Template.body.helpers({
  invoices() {
    return Invoices.find({});
  }
})