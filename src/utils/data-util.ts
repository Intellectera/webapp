export const monthsInEnglish: { [key: number]: string } = {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December"
};

export const monthsInPersian: { [key: number]: string } = {
    1: "فروردین",
    2: "اردیبهشت",
    3: "خرداد",
    4: "تیر",
    5: "مرداد",
    6: "شهریور",
    7: "مهر",
    8: "آبان",
    9: "آذر",
    10: "دی",
    11: "بهمن",
    12: "اسفند"
};

export const daysInMonth: { [key: number]: number } = {
    1: 31, // January
    2: 28, // February (non-leap year)
    3: 31, // March
    4: 30, // April
    5: 31, // May
    6: 30, // June
    7: 31, // July
    8: 31, // August
    9: 30, // September
    10: 31, // October
    11: 30, // November
    12: 31  // December
};

export const convertToPersianMonth = (gregorianMonth: number): number => {
    switch (gregorianMonth) {
        case 1:  // January
        case 2:  // February
            return 10; // Dey (10th Persian month) corresponds to parts of January and February
        case 3:  // March
            return 12; // Esfand (12th Persian month) covers March until the 20th/21st
        case 4:  // April
            return 1; // Farvardin (1st Persian month) starts from March 21st
        case 5:  // May
            return 2; // Ordibehesht (2nd Persian month)
        case 6:  // June
            return 3; // Khordad (3rd Persian month)
        case 7:  // July
            return 4; // Tir (4th Persian month)
        case 8:  // August
            return 5; // Mordad (5th Persian month)
        case 9:  // September
            return 6; // Shahrivar (6th Persian month)
        case 10: // October
            return 7; // Mehr (7th Persian month)
        case 11: // November
            return 8; // Aban (8th Persian month)
        case 12: // December
            return 9; // Azar (9th Persian month)
        default:
            throw new Error("Invalid month number. Please provide a number between 1 and 12.");
    }
}