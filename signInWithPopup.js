import { initializeApp } from "firebase/app";

import {
    getAuth,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithPopup
} from "firebase/auth";

const [targetOrigin] = document.location.ancestorOrigins;

console.log("SignInProxy's ancestors: ", document.location.ancestorOrigins);

const app = initializeApp({
    apiKey: "AIzaSyCfEHY2kSz_aB8tCSCtDJMzr5MPDjs-_kE",
    authDomain: "mtch-hsd-ask-test.firebaseapp.com",
});

const auth = getAuth(app);
auth.useDeviceLanguage();

const sendResponse = result => {
    // resolved: result is UserCredential
    // https://github.com/firebase/firebase-js-sdk/blob/ffbf5a60ac756c69dd50bddb69fccd9968844ac5/packages/auth/src/model/public_types.ts#L1058
    
    // rejected: result is FirebaseError
    // https://github.com/firebase/firebase-js-sdk/blob/main/packages/auth/src/core/util/assert.ts
    // https://github.com/firebase/firebase-js-sdk/blob/main/packages/util/src/errors.ts

    globalThis.parent.self.postMessage(
        JSON.stringify(result),
        targetOrigin
    );
};

globalThis.addEventListener("message", event => {
    // TODO: check/validate/verify targetOrigin, event.origin, event.source

    console.log("SignInProxy got a message: ", event);

    const provider = new GoogleAuthProvider();

    event.data?.initAuth && signInWithPopup(
        auth,
        provider
    ).then(
        sendResponse
    ).catch(
        sendResponse
    )
});
