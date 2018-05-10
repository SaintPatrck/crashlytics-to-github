'use strict';

const functions = require('firebase-functions');
const rp = require('request-promise');

exports.createNewGitHubIssue = functions.crashlytics.issue().onNew(issue => {
	
	const title = `Crashlytics Issue ${issue.issueId} - ${issue.issueTitle}`;
	const version = issue.appInfo.latestAppVersion;
	const body = `New crash report created Firebase Crashlytics.\n\n AppVersion: ${version}.\n\n`
	return createGitHubIssue(title, body).then(() => {
		return console.log(`Created new issue: ${title} in GitHub successfully.`);
	});
});

const createGitHubIssue = (title, body) => {

	const user = functions.config().github.user;
	const pass = functions.config().github.password;
	const repo = functions.config().github.repo;
	const url = `https://api.github.com/repos/${user}/${repo}/issues`;
	console.log(`url = ${url}`);

	const newIssue = {
		title,
		body,
		labels: ["crashlytics", "bug"]
	};
	console.log(`issue = ${newIssue}`);

	return rp({
		auth: {
			'user': user,
			'pass': pass
		},
		headers: {
			'User-Agent': 'EDAC Firebase functions'
		},
		method: 'POST',
		uri: url,
		body: newIssue,
		json: true
	});
};