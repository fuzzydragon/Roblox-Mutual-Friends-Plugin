// ==UserScript==
// @name         Mutual Friends
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  List mutual friends
// @author       AndrewJ.
// @match        *://*.roblox.com/users/*/profile
// @run-at       document-end
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

	if (!user || target == user) return

	const header = document.getElementsByClassName(`header-caption`)[0]
	const container = document.createElement(`p`)
	header.appendChild(container)

	container.innerText = `Loading mutual friends...`

	const mutuals = await getMutualFriendsForUserids(user, target)

	if (mutuals.length == 0) {
		container.innerText = `No mutual friends.`
		return
	}

	header.style.height = `auto`
	container.innerText = `Mutuals (${mutuals.length}): `

	for (const [index, friend] of mutuals.entries()) {
		const reference = document.createElement(`a`)

		reference.setAttribute(`href`, `https://roblox.com/users/${friend.id}/profile`)
		reference.setAttribute(`title`, friend.displayName)
		reference.setAttribute(`class`, `text-link`)
		reference.innerText = friend.name

		container.append(reference)

		if (index < mutuals.length - 1) {
			container.append(`, `)
		}
	}
}

window.addEventListener(`load`, start)