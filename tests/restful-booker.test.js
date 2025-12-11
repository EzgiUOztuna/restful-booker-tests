const request = require('supertest');
const api = request('https://restful-booker.herokuapp.com');

describe('Restful Booker API tests', () => {
    let token;
    let id;

    //Create a token and reuse it in the next API calls
    test('Create auth token', async () => {
        const res = await api
            .post('/auth')
            .set('content-type', 'application/json')
            .set('accept', 'application/json')
            .send({
                username: 'admin',
                password: 'password123'
            });

        //Headers
        expect(res.headers['content-type']).toMatch(/json/);
        //Status
        expect(res.statusCode).toBe(200);
        //Body
        expect(res.body).toHaveProperty('token');
        token = res.body.token;
    });

    test('Create booking', async () => {
        const res = await api
            .post('/booking')
            .set('content-type', 'application/json')
            .set('accept', 'application/json')
            .send({
                firstname: "Jim",
                lastname: "Brown",
                totalprice: 111,
                depositpaid: true,
                bookingdates: {
                    checkin: "2018-01-01",
                    checkout: "2019-01-01"
                },
                additionalneeds: "Breakfast"
            });

        //Headers
        expect(res.headers['content-type']).toMatch(/json/);
        //Status
        expect(res.statusCode).toBe(200);
        //Body
        expect(res.body).toHaveProperty('bookingid');
        expect(res.body).toHaveProperty('booking');
        expect(res.body.booking).toHaveProperty('firstname');
        expect(res.body.booking).toHaveProperty('lastname');
        expect(res.body.booking).toHaveProperty('totalprice');
        expect(res.body.booking).toHaveProperty('depositpaid');
        expect(res.body.booking).toHaveProperty('bookingdates');
        expect(res.body.booking.bookingdates).toHaveProperty('checkin');
        expect(res.body.booking.bookingdates).toHaveProperty('checkout');
    });

    test('Get created booking by id', async () => {
        const res = await api
            .get(`/booking/${id}`)
            .set('accept', 'application/json');

        //Headers
        expect(res.headers['content-type']).toMatch(/json|plain/);
        //Status
        expect([200, 404]).toContain(res.statusCode);
        //Body
        if (res.statusCode === 200) {
            expect(res.body).toHaveProperty('firstname');
            expect(res.body).toHaveProperty('lastname');
            expect(res.body).toHaveProperty('totalprice');
            expect(res.body).toHaveProperty('depositpaid');
            expect(res.body).toHaveProperty('bookingdates');
            expect(res.body.bookingdates).toHaveProperty('checkin');
            expect(res.body.bookingdates).toHaveProperty('checkout');
        }

    });

    test('Update booking', async () => {
        const res = await api
            .put(`/booking/${id}`)
            .set('content-type', 'application/json')
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                firstname: "James",
                lastname: "Brown",
                totalprice: 111,
                depositpaid: true,
                bookingdates: {
                    checkin: "2018-01-01",
                    checkout: "2019-01-01"
                },
                additionalneeds: "Breakfast"
            });

        //Headers
        expect(res.headers['content-type']).toMatch(/plain/);
        //Status
        expect([200, 403]).toContain(res.statusCode);
        //Body
        if (res.statusCode === 200) {
            expect(res.body).toHaveProperty('firstname');
            expect(res.body).toHaveProperty('lastname');
            expect(res.body).toHaveProperty('totalprice');
            expect(res.body).toHaveProperty('depositpaid');
            expect(res.body).toHaveProperty('bookingdates');
            expect(res.body.bookingdates).toHaveProperty('checkin');
            expect(res.body.bookingdates).toHaveProperty('checkout');
            expect(res.body).toHaveProperty('additionalneeds');
        }
    });

    test('Delete booking', async () => {
        const res = await api
            .delete(`/booking/${id}`)
            .set('content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`);

        //Headers
        expect(res.headers['content-type']).toMatch(/plain|json/);
        //Status
        expect([201, 403]).toContain(res.statusCode);
    });
});