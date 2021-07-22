const appendEmoji = (fixed: any) => (dynamic: any) => fixed + dynamic;

const rain = appendEmoji("🌧 ");
const sun = appendEmoji("☀ ");

// console.log(rain("today"));
// console.log(sun("tomorrow"));

const hasName = (name: string) => {
	return { name };
};

const canSayHi = (name: string) => {
	return {
		sayHi: () => "Hello, " + name,
	};
};

const Person = function (name: string) {
	return {
		...hasName(name),
		...canSayHi(name),
	};
};

const jeff = Person("Jeff");
console.log(jeff.sayHi());
