import { Meteor } from 'meteor/meteor'
import { Services } from '../imports/startup/server/index.js'

Meteor.startup(() => {
    Services.startup()
})
