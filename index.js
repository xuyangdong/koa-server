const logger = require('koa-logger');
const router = require('koa-router')();
const koaBody = require('koa-body');
const render = require('./lib/render');

const Koa = require('koa');
const app = module.exports = new Koa();

//log

// app.use(logger());

app.use(render);

app.use(koaBody());

// router.get('/', list)
//   .get('/post/new', add)
//   .get('/post/:id', show)
//   .post('/post', create);

router.get('/',home)

function * home(next) {
	yield this.render('List')
}

function * list(next) {
	yield this.render('list',{posts: posts})
}

function * add(next) {
	yield this.render('new')
}

function * show(next) {
  const id = ctx.params.id;
  const post = posts[id];
  if (!post) this.throw(404, 'invalid post id');
  yield this.render('show', { post: post });
}

function * create(ctx) {
  const post = this.request.body;
  const id = posts.push(post) - 1;
  post.created_at = new Date();
  post.id = id;
  this.redirect('/');
}

// x-response-time

app.use(function * (next) {
    var start = Date.now();
    yield next;
    var ms = Date.now() - start;
    this.set('X-Response-Time', ms + 'ms');
});

// logger

app.use(function * (next) {
    var start = Date.now();
    yield next;
    var ms = Date.now() - start;
    console.log('%s %s - %s', this.method, this.url, ms);
});

//auth

app.use(function * (next) {
    try {
        yield next;
    } catch (err) {
		this.status = 401;
		this.set('WWW-Authenticate', 'Basic');
		this.body = 'cant haz that';
	}
});



app.use(auth({ name: 'tj', pass: 'tobi' }));

// response

app.use(function * () {
    this.body = this.request;
});

app.listen(3000);
