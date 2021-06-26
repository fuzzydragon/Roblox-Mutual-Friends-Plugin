// ==UserScript==
// @name         Mutual Friends
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  List mutual friends
// @author       AndrewJ.
// @match        https://www.roblox.com/users/*
// @grant        none
// ==/UserScript==

async function get(url) {
	return fetch(url)
		.then(response => response.json())
} 

async function getFriendsForUserId(userId) {
	return get(`https://friends.roblox.com/v1/users/${userId}/friends/`)
		.then(body => body.data)
}

async function getMutualFriendsForUserids(userId, targetId) {
	const user = await getFriendsForUserId(userId)
	const target = await getFriendsForUserId(targetId)

	return user.filter(u => target.some(t => JSON.stringify(u) == JSON.stringify(t)))
}

async function start() {
	const target = document.URL.match(/\d+/)[0]
	const user = Roblox.CurrentUser.userId

	if (target == user) return

	const header = document.getElementsByClassName(`header-caption`)[0]
	const container = document.createElement(`p`)

	header.style.height = `auto`
	container.innerText = `Loading mutual friends...`

	const mutuals = await getMutualFriendsForUserids(user, target)

	if (mutuals.length < 0) return

	container.innerText = `Mutuals: `

	for (const [index, friend] of mutuals.entries()) {
		const reference = document.createElement(`a`)

		reference.setAttribute(`href`, `http://www.roblox.com/User.aspx?UserName=${friend.name}`)
		reference.setAttribute(`title`, friend.displayName)
		reference.innerText = friend.name

		if (index < mutuals.length - 1) {
			reference.append(`, `)
		}

		container.append(reference)
	}

	header.appendChild(container)
}

window.addEventListener(`load`, start)
