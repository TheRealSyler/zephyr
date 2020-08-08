/**
 * Scripts used in the server container build,
 * merges the dependencies of two package.json files,
 * so that the shared code work as expected.
 */

const fs = require('fs');

const colors = {
  red: '255;40;120',
  gray: '180;180;180',
  green: '0;255;120',
};

const color = (text, color = 'gray') =>
  `\x1b[38;2;${colors[color]}m${text}\x1b[m`;

(async () => {
  const [, , first, second] = process.argv;
  console.log(
    color('Merge dependencies from'),
    color(first, 'red'),
    color('into'),
    color(second, 'red')
  );
  if ((await Exits(first)) && (await Exits(second))) {
    const file1 = JSON.parse((await fs.promises.readFile(first)).toString());
    const file2 = JSON.parse((await fs.promises.readFile(second)).toString());
    // console.log(file1, file2);

    if ('dependencies' in file1 && 'dependencies' in file2) {
      file2.dependencies = { ...file1.dependencies, ...file2.dependencies };
    }
    fs.promises.writeFile(second, JSON.stringify(file2, null, 2));
    console.log(
      color('Successfully merged dependencies of', 'green'),
      color(first, 'red'),
      color('and'),
      color(second, 'red')
    );
  } else {
    console.log(
      color('package.json'),
      color(first, 'red'),
      color('or'),
      color(second, 'red'),
      color("doesn't exist")
    );
  }
})();

async function Exits (path) {
  return new Promise(res => {
    fs.exists(path, exists => {
      res(exists);
    });
  });
}
