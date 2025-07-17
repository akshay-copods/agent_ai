import dotenv from 'dotenv';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';

dotenv.config();
const serviceAccountKey = JSON.parse(fs.readFileSync(process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH, 'utf8'));

initializeApp({
    credential: cert(serviceAccountKey)
});

const db = getFirestore();

const addPassion = async ({ name, userId = "temp1" }) => {
    console.log('Adding passion:', name, userId);
    const passionRef = db.collection('passions').doc();
    const result = await passionRef.set({
        name: name,
        createdAt: new Date(),
        createdBy: userId || "temp1",
        id: passionRef.id,
    });
    return { success: true, message: 'Passion added successfully', result };
};


const addActivity = async ({ name, userId = "temp1", passionId = "passTemp1" }) => {
    console.log('Adding activity:', name, userId, passionId);
    // create new document on each call 
    const activityRef = db.collection('activities').doc();
    const result = await activityRef.set({
        name: name,
        createdBy: userId,
        createdAt: new Date(),
        id: activityRef.id,
    });

    return { success: true, message: 'Activity added successfully', result };
};


const googleSearch = async ({ query }) => {
    console.log('Searching Google:', query);
    const response = await fetch(
        `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_API_KEY}&cx=${process.env.GOOGLE_CX}&q=${encodeURIComponent(query)}`
    );
    const data = await response.json();
    return data.items.map(i => ({
        title: i.title,
        link: i.link,
        snippet: i.snippet
    }));
};

export { addPassion, addActivity, googleSearch };