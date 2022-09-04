export const insertInArray = <T>(array: T[], index: number, subArray: T[]): T[] => {
    const splicedValues = array.splice(index);
    return [...array, ...subArray, ...splicedValues];
}
