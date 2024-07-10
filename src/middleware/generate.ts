export const generateOtp = () => {
    let num: string = ""
    for(let i = 0; i < 6; i++){ 
        num += Math.floor(Math.random() * (9 - 0 + 1)) + 0;
    }
    return num
}

export const newBits = () => {
    let num: string = ""
    for(let i = 0; i < 10; i++){
        num += Math.floor(Math.random() * (9 - 0 + 1)) + 0;
    }
    return num
}