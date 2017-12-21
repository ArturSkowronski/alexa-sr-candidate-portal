const rp = require('request-promise');
const CP_SESSION = "f9f60701a4a4a1d957fa39e7499a88cd3dcb5d7ed5bfac00bce030cf17256118";
// const CP_SESSION = "06a74d8c80a7473056cc6468a43c14a89e3c0891448ef57aeef354799096b452";

exports.get = function(url) {
	const options = {
		uri: `https://my.smartrecruiters.com/api/${url}`,
		qs: {},
		headers: {
			Accept: '*/*',
			
			'Content-Type': 'application/json; charset=ISO-8859-1',
			Cookie: `cp_session=${CP_SESSION}`
		},
		json: true
	};
	return rp(options);
	exports.call = function() {
		return rp({});
	};
}
exports.post = function(url, body) {
	const options = {
		method: 'POST',
		uri: `https://my.smartrecruiters.com/api/${url}`,
		qs: {},
		headers: {
			Accept: '*/*',
			'Content-Type': 'application/json; charset=ISO-8859-1',
			Cookie: `cp_session=${CP_SESSION}`
		},
		body,
		json: true
	};
	return rp(options);
};