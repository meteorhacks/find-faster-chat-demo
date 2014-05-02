# Find Faster Chat Demo

This is a sample app which used to benchmark [FindFaster](https://github.com/arunoda/meteor-find-faster) package.

Chat app is very straight forward, see `server/methods.js` for more info

## Load Testing

Load Testing Tool is an ad-hoc tool built with node `ddp` module. Meteor APM is being used while the load test is happening, so it will show us what's happening inside the app

Load Testing tool is available in the `.loadtest` directory.

CPU utilization is watched with this [simple script](https://gist.github.com/arunoda/8897526) based on Linux `/proc` filesystem.

## Deployment

You can find the necessary [Meteor UP](https://github.com/arunoda/meteor-up) config files in the `.deploy` directory. In order to activate the `find-faster` you must use oplog with your Meteor App.

