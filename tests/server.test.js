const request = require('supertest')
const app = require('../server')
const { query } = require('../sql');
let testSession = null;
beforeAll(() => {
  process.env.NODE_ENV = 'test';
})


describe('Check Status Codes and Response Body of Endpoints', () => {
  it('+1 should register new user', async () => {
    //reset database
    await query("DELETE FROM users WHERE email='test1@test.com'");
    jest.spyOn(global.console, 'log')
    const res = await request(app)
      .post('/app/api/auth/register')
      .send({"name":"test1","password":"Test1@test","invitationCode":"ListenOnlineUIUC","email":"test1@test.com"})
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({"data": {"isAdmin": false}})
  })

  it('+2 should submit a successful contact request', async () => {
    jest.spyOn(global.console, 'log')
    const res = await request(app)
      .post('/app/api/home/contact')
      .send({"name":"test1","email":"test1@test.com", "contact":"Test Contact Form"})
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({"data": "Contact Submitted!"})
  })

  it('+3 should login user', async () => {
    jest.spyOn(global.console, 'log')
    const res = await request(app)
      .post('/app/api/auth/login')
      .send({"email":"test1@test.com","password":"Test1@test"})
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({"data":{"email": "test1@test.com","isAdmin": false, "name": "test1"}})
  })

  //TODO: Add dummy graphql server database
  it('+4 should get all graphql servers', async () => {
    jest.spyOn(global.console, 'log')
    const res = await request(app)
      .get('/app/api/servers')
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({"data": []})
  })


  //TODO: Update test case after dummy mongoDb
  // it('+5 should update server details', async () => {
  //   jest.spyOn(global.console, 'log')
  //   const res = await request(app)
  //     .put('/app/api/server/update')
  //     .send({"email":"test1@test.com","password":"Test1@test"})
  //   expect(res.statusCode).toEqual(200)
  //   expect(res.body).toEqual({"data":{"email": "test1@test.com","isAdmin": false, "name": "test1"}})
  // })

  it(' +6 get all social media platforms', async () => {
    jest.spyOn(global.console, 'log')
    const res = await request(app)
      .get('/app/api/social-media-platforms')
      .set("session.user_id", "")
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({"data": []})
  })
  // it(' +7 refresh', async () => {
  //   jest.spyOn(global.console, 'log')
  //   const res = await request(app)
  //     .get('/app/api/server/refresh')
  //     .set("query", "")
  //   expect(res.statusCode).toEqual(200)
  //   expect(res.body).toEqual({"data": []})
  // })

  it(' +8 Queries', async () => {
    jest.spyOn(global.console, 'log')
    const res = await request(app)
      .get('/app/api/queries')
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({"data": []})
  })
//Negative test case 
  it('-9 Queries', async () => {
    jest.spyOn(global.console, 'log')
    const res = await request(app)
      .get('/app/api/query/sources')
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({"data": null,"error":{"generalError":["There are no active servers with schema available to query."]}})
  })

  //Basic test, needs more tests
  it('+10 Full Schema', async () => {
    jest.spyOn(global.console, 'log')
    const res = await request(app)
      .get('/app/api/query/full-schema')
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty("data")
  })

  //Basic property test case
  it('+11 History', async () => {
    jest.spyOn(global.console, 'log')
    const res = await request(app)
      .get('/app/api/query/history-records')
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty("data")
  })

 //Change expected if users change in test_db
  it('+12 Users', async () => {
    jest.spyOn(global.console, 'log')
    const res = await request(app)
      .get('/app/api/users')
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty("data")
    expect(res.body.data).toMatchObject([{"email": "testadmin@test.com", "isAdmin": 1, "name": "testAdmin", "quota": 1}, {"email": "test1@test.com", "isAdmin": 0, "name": "test1", "quota": 1}])
  })

  it('+13 User Update', async () => {
    jest.spyOn(global.console, 'log')
    const res = await request(app)
      .put('/app/api/user/update')
      .send({"type":1,"data":{"name":"test1","isAdmin":0,"email":"test1@test.com","quota":2,"usedQuota":0}})
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty("data")
    expect(res.body.data).toMatchObject({"name":"test1","isAdmin":0,"email":"test1@test.com","quota":2,"usedQuota":0})
  })

   
  it('+14 Applications', async () => {
    jest.spyOn(global.console, 'log')
    const res = await request(app)
      .get('/app/api/applications')
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty("data")
    expect(res.body.data).toEqual([])
  })

  //session needed

  //   it('+15 Applications Create', async () => {
      
  //       jest.spyOn(global.console, 'log')
  //       await query("DELETE FROM applications WHERE callback='https://testapp.com'");
  //       const res = await testSession
  //       .put('/app/api/application/update')
  //       .send({"type":2,"data":{"name":"Test App","callbackURL":"https://testapp.com","home":"https://testapp.com/home","description":"Test App "}})
  //       expect(res.statusCode).toEqual(200)
  //       expect(res.body).toHaveProperty("data")
  //       expect(res.body.data).toMatchObject({"name":"Test App","callbackURL":"https://testapp.com"})
  // })


  it(' should logout user', async () => {
    jest.spyOn(global.console, 'log')
    const res = await request(app)
      .get('/app/api/auth/logout')
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({"data": "Success logging out"})
  })
})