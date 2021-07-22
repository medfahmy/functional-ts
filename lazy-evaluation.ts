// *** lazy evaluation ***

// arguments are evaluated in an "eager way"
function sum(a: number, b: number): number {
	return a + b;
}

//console.log("eager sum :", sum(10, 20));

// wrapping a value in a function that returns the value so we don't evaluate it
// until we call the function
type Lazy<T> = () => T;

// sum function where the arguments are evaluated in a "lazy way"
function lazySum(a: Lazy<number>, b: Lazy<number>): Lazy<number> {
	return () => a() + b();
}

/*console.log(
	"lazy sum :",
	lazySum(
		() => 10,
		() => 20
	)()
);*/

// *** avoiding unnecessary computations ***

function hang<T>(): T {
	return hang();
}

// first doesnt return since it calls the function hang
function first(a: number, _: number): number {
	return a;
}

// lazyFirst returns
function lazyFirst(a: Lazy<number>, _: Lazy<number>): Lazy<number> {
	return () => a();
}

/*console.log(
	first(
		() => 10,
		() => hang()
	)()
);*/

/*console.log(
	lazyFirst(
		() => 10,
		() => hang()
	)()
);*/

// *** short circuit evaluation ***

// lazy evaluation implies short circuit evaluation

function and(a: Lazy<boolean>, b: Lazy<boolean>): Lazy<boolean> {
	return () => (!a() ? false : b());
}

function or(a: Lazy<boolean>, b: Lazy<boolean>): Lazy<boolean> {
	return () => (a() ? true : b());
}

function trace<T>(x: Lazy<T>, message: string): Lazy<T> {
	return () => {
		console.log(message);
		return x();
	};
}

/*console.log(
	"false && false ==",
	and(
		trace(() => false, "L"),
		trace(() => false, "R")
	)()
);
console.log(
	"true && false ==",
	and(
		trace(() => true, "L"),
		trace(() => false, "R")
	)()
);
console.log(
	"true && true ==",
	and(
		trace(() => true, "L"),
		trace(() => true, "R")
	)()
);
console.log(
	"false && true ==",
	and(
		trace(() => false, "L"),
		trace(() => true, "R")
	)()
);*/

//console.log(
//"false || false ==",
//or(
//trace(() => false, "L"),
//trace(() => false, "R")
//)()
//);
//console.log(
//"true || false ==",
//or(
//trace(() => true, "L"),
//trace(() => false, "R")
//)()
//);
//console.log(
//"true || true ==",
//or(
//trace(() => true, "L"),
//trace(() => true, "R")
//)()
//);
//console.log(
//"false || true ==",
//or(
//trace(() => false, "L"),
//trace(() => true, "R")
//)()
//);

//*** infinite data structures ***

// implementation of lazy list
type LazyList<T> = Lazy<{
	head: Lazy<T>; // lazy value of first element
	tail: LazyList<T>; // rest of the array as a lazy list
} | null>;

// takes array and returns a lazy list
function toLazyList<T>(xs: T[]): LazyList<T> {
	return () => {
		if (xs.length === 0) {
			return null;
		} else {
			return {
				head: () => xs[0],
				tail: toLazyList(xs.slice(1)),
			};
		}
	};
}

const arr = [1, 2, 3];
//console.log(toLazyList(arr)()?.head()); // 1
//console.log(toLazyList(arr)()?.tail()?.head()); // 2
//console.log(toLazyList(arr)()?.tail()?.tail()?.head()); // 3
//console.log(toLazyList(arr)()?.tail()?.tail()?.tail()); // null

// generates an infinite lazyList of numbers that are not evaluated until we
// actually access them

function infinite_range(start: Lazy<number>): LazyList<number> {
	return () => {
		let b = start();
		return {
			head: () => b,
			tail: infinite_range(() => b + 1),
		};
	};
} // 5 // to infinity // print the values of a lazyList

/*console.log(infinite_range(() => 3)()?.head()); // 3
console.log(
	infinite_range(() => 3)()
		?.tail()
		?.head()
); // 4
console.log(
	infinite_range(() => 3)()
		?.tail()
		?.tail()
		?.head()
);*/ function printList<
	T
>(xs: LazyList<T>) {
	let pair = xs();
	while (pair) {
		console.log(pair.head());
		pair = pair.tail();
	}
}

// print the values from 1 to infinity
//printList(infinite_range(() => 1));

function take<T>(n: Lazy<number>, xs: LazyList<T>): LazyList<T> {
	return () => {
		let m = n();
		let pair = xs();
		if (m > 0) {
			return {
				head: pair!.head,
				tail: take(() => m - 1, pair!.tail),
			};
		} else {
			return null;
		}
	};
}

// print the first 10 elemets from infinite list
/*printList(
	take(
		() => 10,
		infinite_range(() => 3)
	)
);*/

function filter<T>(f: (t: T) => boolean, xs: LazyList<T>): LazyList<T> {
	return () => {
		let pair = xs();
		if (pair === null) {
			return null;
		} else {
			if (f(pair.head())) {
				return {
					head: pair.head,
					tail: filter(f, pair.tail),
				};
			} else {
				return filter(f, pair.tail)();
			}
		}
	};
}

/*printList(
	take(
		() => 10,
		filter(
			(x: number) => x % 2 === 0,
			infinite_range(() => 1)
		)
	)
);*/

function sieve(xs: LazyList<number>): LazyList<number> {
	return () => {
		let pair = xs();
		if (pair === null) {
			return null;
		} else {
			return {
				head: pair.head,
				tail: sieve(filter((x) => x % pair!.head() !== 0, pair.tail)),
			};
		}
	};
}

const prime = sieve(infinite_range(() => 2));
printList(take(() => 10, prime));
printList(prime);
