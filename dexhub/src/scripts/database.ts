import dotenv from "dotenv";
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { ref, set, get , child } from "firebase/database";
import { type Database } from "firebase/database";


dotenv.config({path:__dirname.concat('/./../../.env')});

let DB: Database;
const apiKey = process.env.apiKey || "";
const authDomain = process.env.authDomain || "";
const projectId = process.env.projectId || "";
const storageBucket = process.env.storageBucket || "";
const messagingSenderId = process.env.messagingSenderId || "";
const appId = process.env.appId || "";
const measurementId = process.env.measurementId || "";


const initDataBase = () => {
    const firebaseConfig = {
        apiKey: apiKey,
        authDomain: authDomain,
        projectId: projectId,
        storageBucket: storageBucket,
        messagingSenderId: messagingSenderId,
        appId: appId,
        measurementId: measurementId
    };
    
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);
    DB = db;
    return db;
}

const getUsersByTrader = async (trader: string, chain: string) => {
    const dbRef = ref(getDatabase());
    const snapshot = await get(child(dbRef, `${chain}/traders/` + trader));
    if (snapshot.exists()) {
        const response = snapshot.val();
        const users = Object.keys(response).map((key) => {
            return response[key];
        })
        return users;
    } 
    else {
        console.log("No data available");
        return [[]];
    }
}

const getTrackedTraders = async (user: string, chain: string): Promise<string[]> => {
    const dbRef = ref(getDatabase());
    const snapshot = await get(child(dbRef, `${chain}/traders/`));
    const trackedTraders = [];
    if (snapshot.exists()) {
        const response = snapshot.val();
        const traders = Object.keys(response).map((key) => {
            return key;
        })
        for(let trader of traders) {
            const users = response[trader]._users;
            if (users.includes(user)) trackedTraders.push(trader);
        }
    }
    return trackedTraders;
}

const addTrackedTraders = async (user: string | undefined, traders: string[], chain: string) => {
    for(let trader of traders) {
        const users = await getUsersByTrader(trader, chain);
        if (users[0].length > 0) {
            if (users[0].includes(user)) {
                console.log(`Trader ${trader} already tracked by user ${user}`);
            }
            else {
                let _users = users[0];
                _users.push(user);
                set(ref(DB, `${chain}/traders/` + trader), {
                    _users
                });
                console.log(`New users: ${users[0]}`);
            }
        }
        else {     
            let _users = [user];
            set(ref(DB, `${chain}/traders/` + trader), {
                _users
            });
            console.log(`New trader: ${trader}`);
        }
    }
}

const deleteTrackedTraders = async (user: string | undefined, traders: string[], chain: string) => {
    for(let trader of traders) {
        const users = await getUsersByTrader(trader, chain);
        if (users[0].includes(user)) {
            const index = users[0].indexOf(user);
            if (index > -1) users[0].splice(index, 1);
            let _users = users[0];
            set(ref(DB, `${chain}/traders/` + trader), {
                _users
            });
            console.log(`Deleted trader: ${trader}`);
        }
        else console.log("Trader not tracked");
    }
}

export default { addTrackedTraders, deleteTrackedTraders, getUsersByTrader, initDataBase, getTrackedTraders }