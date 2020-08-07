/**
 * Used by the client so that there is a .env file
 *  available when build the app with webpack, on netlify.
 */

const fs = require('fs')

const colors = {
  red: '255;40;120',
  gray: '180;180;180',
  green: '0;255;120',
};

const color = (text, color = 'green') =>
  `\x1b[38;2;${colors[color]}m${text}\x1b[m`;


if (!fs.existsSync('./.env') && process && process.env) {
  const { env } = process
  fs.writeFileSync('./.env', Object.keys(env).reduce((acc, key) => {
    const val = env[key]
    acc += `${key}=${val}\n`
    return acc
  }, ''))
  console.log(color('created .env file'))
} else {
  console.log(color('.env file already exists'))
}