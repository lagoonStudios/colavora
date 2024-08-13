export function convertToSqlDateFormat(text: string) {
    const date = new Date(text).toUTCString();
    return date.replace(/T/g, " ")
}