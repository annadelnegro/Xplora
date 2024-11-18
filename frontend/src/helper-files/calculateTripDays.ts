export function calculateTripDays(startDateStr: string, endDateStr: string): number {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    // Calculate the difference in days
    const daysDifference = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysDifference;
}
