const { 
    getFormattedDate, 
    getFormattedDateTime, 
    formatNumber 
} = require('../../../src/utils/date.utils');

describe('getFormattedDate', () => {
    test('Deals with numbers greater than 10', () => {
        expect(getFormattedDate(new Date(2022, 11, 23))).toEqual('23/12/2022');
    });
    test('Deals with numbers less than 10', () => {
        expect(getFormattedDate(new Date(2022, 0, 1))).toEqual('01/01/2022');
    });
});

describe('getFormattedDateTime', () => {
    test('Deals with numbers greater than 10', () => {
        const date = new Date(2022, 11, 23, 16, 15, 29);
        expect(getFormattedDateTime(date)).toEqual('23/12/2022 16:15:29');
    });
    test('Deals with numbers less than 10', () => {
        const date = new Date(2022, 0, 1, 7, 8, 9);
        expect(getFormattedDateTime(date)).toEqual('01/01/2022 07:08:09');
    });
});

describe('formatNumber', () => {
    test('Deals with numbers with more than one digit', () => {
        expect(formatNumber(13)).toEqual('13');
    });
    test('Deals with numbers with one digit', () => {
        expect(formatNumber(7)).toEqual('07');
    });
    test('Deals with negative numbers with more than one digit', () => {
        expect(formatNumber(-33)).toEqual('-33');
    });
    test('Deals with negative numbers with less than one digit', () => {
        expect(formatNumber(-3)).toEqual('-3');
    });
    test('Deals with zero', () => {
        expect(formatNumber(0)).toEqual('0');
    });
});