import fs from 'fs';
import path from 'path';
import util from 'util';

import licenseChecker from 'license-checker';

const acceptableLicenses = [
  'MIT',
  'ISC',
  'Apache-2.0',
  '0BSD',
  'BSD-3-Clause',
  'CC-BY-4.0',
  'Unlicense',
  'MPL-2.0',
];

const asyncLicenseChecker = (options) => {
  return new Promise((resolve, reject) => {
    licenseChecker.init(options, (err, data) => {
      if (err != null) reject(err);
      else resolve(data);
    });
  });
};

export default async function () {
  const packageInfo = await util
    .promisify(fs.readFile)('package.json', { encoding: 'utf8' })
    .then((data) => JSON.parse(data));
  const packages = await asyncLicenseChecker({ start: path.resolve(), production: true });

  let ok = true;

  const ignorePackageNames = [packageInfo.name];

  for (const [name, info] of Object.entries(packages)) {
    const acceptable = acceptableLicenses.includes(info.licenses);
    if (acceptable) continue;
    if (ignorePackageNames.some((ignorePackageName) => name.startsWith(`${ignorePackageName}@`)))
      continue;

    console.error(name, info.licenses);
    ok = false;
  }

  if (!ok) {
    process.exit(1);
  }
}
