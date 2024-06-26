interface Person {
    firstName: string;
    lastName: string;

}
class Student implements Person{
    fullName: string;
    constructor(public firstName: string, public middleInitial: string, public lastName: string) {


        this.fullName = firstName + " " + middleInitial + " " + lastName;
    }
}

export function greeter(person: Person) {
    return "Hello, " + person.firstName + " " + person.lastName;
}

let user = { firstName: "Jane", lastName: "User" };