export function validateEmailFormat(userData: { email: string }, res: any) {
    if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(userData.email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }
}