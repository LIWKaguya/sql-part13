const Blog = require('./blog')
const User = require('./user')
const ReadingList = require('./readingList');
const Session = require('./session');

User.hasMany(Blog);
Blog.belongsTo(User);

User.hasMany(Session);
Session.belongsTo(User);

Blog.belongsToMany(User, { through: ReadingList, as: 'readers'})
User.belongsToMany(Blog, { through: ReadingList, as: 'readings'})

module.exports = {
    Blog, User, ReadingList, Session
}