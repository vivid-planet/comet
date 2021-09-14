export const generateRandomEmails = (amount: number, valueLength: number) => {
    return Array.from(Array(amount).keys()).map(() => {
        let string = "";
        const chars = "abcdefghijklmnopqrstuvwxyz1234567890";
        for (let i = 0; i < valueLength; i++) {
            string += chars[Math.floor(Math.random() * chars.length)];
        }
        return `${string}@gmail.com`;
    });
};

export const generateRandomString = (amount: number, valueLength: number) => {
    return Array.from(Array(amount).keys()).map(() => {
        let string = "";
        const chars = "abcdefghijklmnopqrstuvwxyz1234567890";
        for (let i = 0; i < valueLength; i++) {
            string += chars[Math.floor(Math.random() * chars.length)];
        }
        return string;
    });
};

export const generateRandomColors = (amount: number) => {
    const colors = ["Weiß", "Schwarz", "Rot", "Blau", "Grün", "Lila", "Orange", "Gelb"];
    return Array.from(Array(amount).keys()).map(() => {
        return colors[Math.floor(Math.random() * colors.length)];
    });
};

export const generateRandomIntNumbers = (amount: number, min: number, max: number) => {
    return Array.from(Array(amount).keys()).map(() => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    });
};
