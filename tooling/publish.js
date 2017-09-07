require('shelljs/global');
const semver = require('semver');
const path = require('path');
const replace = require('replace');
const fs = require('fs');
const format = require('date-fns/format');
const IncomingWebhook = require('@slack/client').IncomingWebhook;

const publishVersion = () => {
  const packageJson = require(path.join(process.cwd(), 'package.json'));

  const start = () => {
    const releaseType = getReleaseType();

    if(!releaseType) {
      console.log('No release type in last commit, normal ci build');
      return;            
    };

    const newVersion = semver.inc(packageJson.version, releaseType);

    const changelog = replaceChangelog(newVersion);
    
    if(!changelog) {
      console.log('No unreleased changelog! Exiting');
      return;
    }

    releaseVersion(newVersion, releaseType);

    postToSlackChannel(changelog.replace(/### ?/g, ''), newVersion, packageJson.name);
  };

  const postToSlackChannel = (changelog, version, name) => {
    const webhook = new IncomingWebhook(process.env['CSAS_SLACK_URL']);

    const message = `
We are releasing new version of JS: \`${name} ${version}\`

*Changelog:*
${changelog}

Available on Github now. :rocket:

Please let us know if you experience any issues during the integration. We are waiting for your feedback either here or in the issues on GitHub.
`

    webhook.send({
      iconUrl: 'http://applifting.cz/img/external/sdk-bot.png',
      username: 'SDK Bot',
      channel: "#sdk-dev",
      success: true,
      attachments: [
        {
          color: '#00af52',
          mrkdwn_in: ['text'],
          text: message,
        }
      ]
    }, (err, status) => {
      if(err) {
        console.log('error', err);
      } else {
        console.log('send', status);
      }
    })
  }

  const releaseVersion = (version, type) => {
    exec('npm config set sign-git-tag true')
    exec(`git commit -m 'Update changelog for version ${version}' `);
    exec(`npm version ${type} --force`);
  }

  const replaceChangelog = (newVersion) => {
    const regex = packageJson.version === '0.0.0' ? 
      new RegExp(`## \\[Unreleased\\](([\\W\\w]+?)+)`, 'g') : 
      new RegExp(`## \\[Unreleased\\]([\\W\\w]+?)## \\[${packageJson.version}\\]`, 'g');

    const changelogFile = fs.readFileSync(path.join(process.cwd(), 'CHANGELOG.md'), 'utf-8');
    const parsedChangelog = regex.exec(changelogFile);
    
    if(parsedChangelog.length > 1 && parsedChangelog[1] !== '\n') {
      console.log('Changelog found');

      replace({
        regex: /## \[Unreleased\]/g,
        replacement: `## [Unreleased]
        
## [${newVersion}] - ${format(new Date(), 'YYYY-MM-DD')}`,
        paths: [path.join(process.cwd(), 'CHANGELOG.md')]
      });

      return parsedChangelog[1];
    } else {
      return false;
    };
  }

  const getReleaseType = () => {
    const lastCommitMsg = exec('git log -1 --pretty=%B').output;
    const commands = /\[[^\[]*\]/g.exec(lastCommitMsg);

    if(!commands) {
      return;
    }

    let versionType;

    const version = commands[0].toLowerCase();

    switch(version) {
      case '[release-patch]':
        versionType = 'patch';
        break;
      case '[release-minor]':
        versionType = 'minor';
        break;
      case '[release-major]':
        versionType = 'major';
        break;
    };

    return versionType;
  };

  return {
    start: start,
  };
}

publishVersion().start();