async function Get(URL) {
    const Response = await fetch(URL)
    const Body = await Response.json()

    return Body
}

async function GetFriendsForUserId(UserId) {
    const FriendObjects = (await Get(`https://friends.roblox.com/v1/users/${UserId}/friends/`)).data
    const Friends = []

    for (const Friend of FriendObjects) {
        Friends.push(Friend.name)
    }

    return Friends
}

async function GetMutualFriends(UserId, TargetId) {
    const UserFriends = await GetFriendsForUserId(UserId)
    const TargetFriends = await GetFriendsForUserId(TargetId)

    const Mutuals = []

    for (const UserFriend of UserFriends) {
        if (TargetFriends.includes(UserFriend)) {
            Mutuals.push(UserFriend)
        }
    }

    return Mutuals
}

async function Start() {
    const TargetId = document.URL.match(/\d+/)[0]
    const UserId = (await Get(`https://www.roblox.com/mobileapi/userinfo`)).UserID

    const Header = document.getElementsByClassName(`header-caption`)[0]
    const Container = document.createElement(`p`)

    Container.innerText = `Loading Mutual Friends...`

    if (TargetId != UserId) {
        const MutualFriends = await GetMutualFriends(UserId, TargetId)

        if (MutualFriends.length > 0) {
            Container.innerText = `Mutual Friends: `

            for (const Friend of MutualFriends) {
                const NameElement = document.createElement(`a`)

                NameElement.setAttribute(`href`, `http://www.roblox.com/User.aspx?UserName=${Friend}`)
                NameElement.innerText = `${Friend} `
                
                Container.appendChild(NameElement)
            }
        } else {
            Container.innerText = `No Mutual Friends!`
        }
    } else {
        Container.innerText = `Welcome to your profile!`
    }

    Header.appendChild(Container)
}

try { Start() } catch {} // :3
