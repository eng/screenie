# Usage:
# npm install request
# npm install exec-sync
# coffee screenie.coffee

fs = require('fs')
exec = require('exec-sync')
request = require('request')

request "http://golearntocode.com/kiei924-winter15-ev/users.json", (error, response, body) ->
  users = JSON.parse(body)
  usernames = []
  for user in users
    unless user.nickname is null
      # callback with (error, stdout, stderr) if you care about the output
      repo = "#{user.nickname}.github.io"
      # repo = "myteam"
      repo_url = "git://github.com/#{user.nickname}/#{repo}"
      user_dir = "pages/#{user.nickname}"
      if fs.existsSync(user_dir)
        console.log "Fetching #{repo_url}"
        result = exec("git -C #{user_dir} pull", true)
        usernames.push user.nickname
      else
        console.log "Cloning #{repo_url}"
        result = exec("git clone --depth 1 #{repo_url} #{user_dir}", true)
        if result.stderr.match /fatal/
          console.log "Not found"
        else
          usernames.push user.nickname

  # only do it for repos that successfully cloned/pulled
  for username in usernames
    console.log "Capturing screenie for #{username}"
    user_dir = "pages/#{username}"
    exec "webkit2png -T -D screenies/ -o #{username} #{user_dir}/index.html"

  fs.writeFile('screenies.json', JSON.stringify(usernames))