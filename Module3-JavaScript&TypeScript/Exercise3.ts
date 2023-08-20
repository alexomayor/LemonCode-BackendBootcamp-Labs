interface Teacher {
  name: string;
  age: number;
  subject: string;
}
interface Student {
  name: string;
  age: number;
  occupation: string;
}
type User = Teacher | Student;
const users: User[] = [
  {
    name: "Luke Patterson",
    age: 32,
    occupation: "Internal auditor",
  },
  {
    name: "Jane Doe",
    age: 41,
    subject: "English",
  },
  {
    name: "Alexandra Morton",
    age: 35,
    occupation: "Conservation worker",
  },
  {
    name: "Bruce Willis",
    age: 39,
    subject: "Biology",
  },
];

const logUser = (user: User) => {
  let extraInfo: string;
  if ("occupation" in user) {
    extraInfo = user.occupation;
  } else if ("subject" in user) {
    extraInfo = user.subject;
  } else {
    extraInfo = user;
  }
  console.log(`  - ${user.name}, ${user.age}, ${extraInfo}`);
};

users.forEach(logUser);
