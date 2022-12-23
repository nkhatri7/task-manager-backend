const { validateEmail, getRelevantUserDetails } = require('../../../src/middleware/auth');

describe('validateEmail', () => {
    test('Deals with regular email format', () => {
        expect(validateEmail('john.smith@mail.com')).toEqual(true);
    });
    test('Deals with long named emails', () => {
        const email = 'johnthefirst.smiththesecond@extremelylongprovider.com';
        expect(validateEmail(email)).toEqual(true);
    });
    test('Deals with no @', () => {
        expect(validateEmail('john.smith^gmail.com')).toEqual(false);
    });
    test('Deals with invalid top level domain', () => {
        expect(validateEmail('john.smith@gmail.c')).toEqual(false);
        expect(validateEmail('john.smith@gmail.comp')).toEqual(false);
    });
    test('Deals with no email provider', () => {
        expect(validateEmail('john.smith@.com')).toEqual(false);
    });
});

describe('getRelevantUserDetails', () => {
    const expectedObj = {
        _id: '124b1982brf9812f8',
        name: 'Neil',
        email: 'test@gmail.com',
        createdAt: '23/12/2022',
    };
    test('Deals with regular User doc object', () => {
        const doc = {
            _id: '124b1982brf9812f8',
            name: 'Neil',
            email: 'test@gmail.com',
            password: 'asfbio2qr!$FASf3fda',
            createdAt: '23/12/2022',
            __v: 0,
        };
        expect(getRelevantUserDetails(doc)).toEqual(expectedObj);
    });
    test('Deals with User doc object without __v', () => {
        const doc = {
            _id: '124b1982brf9812f8',
            name: 'Neil',
            email: 'test@gmail.com',
            password: 'asfbio2qr!$FASf3fda',
            createdAt: '23/12/2022',
        };
        expect(getRelevantUserDetails(doc)).toEqual(expectedObj);
    });
});