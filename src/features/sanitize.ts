export const sanitizeInput = (input: any) => {
    return input.trim().replace(/<\/?("[^"]*"|'[^']*'|[^>])*(>|$)/g, '')
}