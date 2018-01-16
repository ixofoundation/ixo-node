import 'mocha';
import * as chai from 'chai';
import {expect} from 'chai';
import chaiHttp = require('chai-http');
import app from '../src/App';

chai.use(chaiHttp);

describe('App Tests', () => {
    it('should disply API is running', () => {
        return chai.request(app).get('/')
            .then((res: any) => {
                expect(res.text).to.eql('API is running');
            });
    });

});
