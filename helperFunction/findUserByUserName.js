
const users = []

const findUserByUsername = (username) => users.find(user => user.username === username)

module.exports = {
  findUserByUsername,
}