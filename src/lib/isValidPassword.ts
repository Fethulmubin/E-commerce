export const  isValidPassword = async(password: string,
     hashedPassword: string ) =>{
        // console.log(await hashPassword(password))
        return await hashPassword(password) === hashedPassword
}

async function hashPassword (password: string) {
    const arrayBuffer = await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(password)
    );
    return Buffer.from(arrayBuffer).toString("base64");
}