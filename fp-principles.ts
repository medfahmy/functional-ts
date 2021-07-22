// no loops
// no ifs
// function has single return
// no side effects
// no assignments in functions

function sumTo(i: number): number {
	return i <= 0 ? 0 : i + sumTo(i - 1);
}

// functions have only 0 or 1 argument

function add(a: number) {
	return function (b: number) {
		return a + b;
	};
}
//console.log(add(2)(2));

interface Pair {
	first: any;
	second: any;
}

const add2 = (a: number) => (b: number) => a + b;
//console.log(add2(2)(2));

// no arrays
let pair = (first: any) => (second: any): Pair => {
	return {
		first: first,
		second: second,
	};
};

const p = pair(1)(2);
//console.log(p);

const fst = (p: Pair) => p.first;
const snd = (p: Pair) => p.second;
//console.log(fst(p), snd(p));

const empty_list = null;
const list1 = pair(1)(empty_list);
const list2 = pair(2)(list1);
const list3 = pair(3)(list2);
//console.log(list3);

const head = fst;
const tail = snd;

//console.log(head(list3));
//console.log(tail(list3));

function list2array(list: any) {
	let result = [];

	while (list !== null) {
		result.push(head(list));
		list = tail(list);
	}

	return result;
}

//console.log(list2array(list3));

function array2list(arrayLike: any) {
	let result = null;
	let xs = Array.from(arrayLike).reverse();

	for (let i = 0; i < xs.length; ++i) {
		result = pair(xs[i])(result);
	}

	return result;
}

//console.log(array2list("Hel"));

const range = (low: number) => (high: number): any =>
	low > high ? null : pair(low)(range(low + 1)(high));

const map = (f: any) => (xs: any):any =>
	xs === null ? null : pair(f(head(xs)))(map(f)(tail(xs)));

//console.log(list2array(map((n: number) => n * n)(range(1)(5))));

const fizzbuzz = (n: number) =>
	(n % 3 === 0 ? "fizz" : "") + (n % 5 === 0 ? "buzz" : "") || n;

const hundred = range(1)(100);
console.log(list2array(map(fizzbuzz)(hundred)));
