function checkLogin(user, password, listOfUsers) {
	for (var i = 0; i < listOfUsers.length; i++) {
		if (listOfUsers[i].name === user && listOfUsers[i].password === password) {
			return { name: listOfUsers[i].name, age: listOfUsers[i].age };
		}
	}
	return undefined;
}

function checkAdmin(user, listOfUsers) {
	for (var i = 0; i < listOfUsers.length; i++) {
		if (listOfUsers[i].name === user && listOfUsers[i].type === 'admin') {
			return true;
		}
	}
	return false;
}

module.exports = {checkAdmin,checkLogin};