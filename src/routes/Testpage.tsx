import { useState } from "react";
import TextInput from "../components/TextInput";

function WellcomeFn(text: string): string {
  return `Hello ${text}`;
}

interface User {
  id: number;
  name: string;
  family: string;
  email: string;
}

class UserClass {
  private id: number;
  name: string;
  age: number;
  email: string;

  constructor(name: string, age: number, email: string) {
    this.id = Date.now();
    this.age = age;
    this.name = name;
    this.email = email;
  }

  getUserInfo() {
    console.log(
      `id  ${this.id}  -  name  ${this.name} email ${this.email}  age ${this.age}  `
    );
  }

  updateValue(id: number) {
    this.id = id;
    this.getUserInfo();
  }
}

class Amin extends UserClass {
  constructor(name: string, age: number, email: string) {
    super(name, age, email);
  }

  public getAdminData() {
    console.log(`${this.id} ${this.name} ${this.email}`);
  }
}

const defUserValue: User = {
  id: 0,
  name: "",
  family: "",
  email: "",
};

const TestPage = () => {
  const [userData, setUserData] = useState<User>(defUserValue);

  const [usersData, setUsersData] = useState<User[]>([]);

  function handleChange(name: string, value: string): void {
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  function addUser(user: User): void {
    setUsersData((prevState) => [...prevState, { ...user, id: Date.now() }]);
    setUserData(defUserValue);
  }

  const user1 = new UserClass("reza", 45, "aa@aa.aa");
  user1.getUserInfo();
  user1.updateValue(22);

  const admin = new Amin("reza", 45, "aa@aa.aa");
  admin.getAdminData();
  // console.log(user1.id);

  return (
    <>
      <h1>test page</h1>
      <h2>{WellcomeFn("jafar")}</h2>
      <h1>User List : {usersData.length}</h1>

      <div className="flex gap-4">
        <TextInput
          placeholder="name"
          value={userData.name}
          onChange={(v) => handleChange("name", v)}
        />

        <TextInput
          placeholder="family"
          value={userData.family}
          onChange={(v) => handleChange("family", v)}
        />

        <TextInput
          type="email"
          placeholder="email"
          value={userData.email}
          onChange={(v) => handleChange("email", v)}
        />

        <button
          disabled={!userData.name || !userData.family || !userData.email}
          onClick={() => addUser(userData)}
          className="bg-blue-500 text-white p-2 rounded-sm cursor-pointer
           disabled:bg-gray-300 disabled:text-gray-500
             disabled:cursor-not-allowed"
        >
          Add
        </button>
      </div>
      <ul>
        {usersData.map((user) => (
          <li key={user.id}>
            {user.id} :
            <b>
              {user.name} {user.family} {user.email}
            </b>
          </li>
        ))}
      </ul>
    </>
  );
};

export default TestPage;
