// ==UserScript==
// @name         Mutual Friends
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  List mutual friends
// @author       AndrewJ.
// @match        https://www.roblox.com/users/*
// @grant        none
// ==/UserScript==

async function get(url) {
    return await (await fetch(url)).json();
 }
 
 async function getFriendsForUserId(userId) {
     let friendObjects = (await get(`https://friends.roblox.com/v1/users/${userId}/friends`)).data;
     const friends = [];
 
     for (const friend of friendObjects) {
         friends.push({name: friend.name, id: friend.id});
     }
 
     return friends;
 }
 
 async function getMutualFriends(userId, targetId) {
     const userFriends = await getFriendsForUserId(userId);
     const targetFriends = await getFriendsForUserId(targetId);
 
     return userFriends.filter(friend => targetFriends.find(targetFriend => targetFriend.id == friend.id));
 }
 
 async function start() {
     const targetId = document.URL.match(/\d+/)[0];
     const userId = (await get(`https://www.roblox.com/mobileapi/userinfo`)).UserID
 
     if (targetId == userId) return;
 
     let header = document.getElementsByClassName("header-caption")[0];
     let container = document.createElement("p");
 
     header.appendChild(container);
 
     container.innerText = "Loading Mutual friends...";
 
     const mutualFriends = await getMutualFriends(userId, targetId);
 
     if (mutualFriends.length > 0) {
         container.innerText = "Mutual Friends: ";
 
         for(const [index, friend] of mutualFriends.entries()) {
             let a = document.createElement("a");
             a.setAttribute("href", `https://www.roblox.com/users/${friend.id}/profile`);
             a.setAttribute("style", "font-weight:bold");
             a.innerHTML = friend.name;
             
             if(index && index != mutualFriends.length) {
                 container.append(", ");
             }
 
             container.appendChild(a);
         }
     } else {
         container.innerText = "No Mutual friends!";
     }
 }
 
 window.addEventListener("load", start);
