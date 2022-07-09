
const { Octokit } = require('octokit')

const octokit = new Octokit({ auth: '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' })


const getUserInfo = async (student_name) => {
  const user = await octokit.request('GET /users/{username}', {
    username: student_name
  })
  return pick(user, 'avatar_url')
}

const getInfo = async () => {

return new Promise((resolve) => {
setTimeout(() => {
return resolve(111)
}, 1000)
})
  
}
async function test() {

let b = {
  w: 1,
fdsa:  await getUserInfo(),
o: "haha"
}

console.log(b)
}

test();
